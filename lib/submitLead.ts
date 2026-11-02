import { publicConfig } from "@/lib/config";
import type { LeadFormData } from "@/lib/validation";

export type LeadSubmission = Omit<LeadFormData, "companyWebsite">;

export async function submitLead(
  data: LeadFormData,
): Promise<void> {
  if (data.companyWebsite) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return;
  }

  const { companyWebsite: _honeypot, ...lead } = data;
  void _honeypot;

  if (!publicConfig.formEndpoint) {
    throw new Error("No lead form endpoint is configured");
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12000);

  let response: Response;
  try {
    response = await fetch(publicConfig.formEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead satisfies LeadSubmission),
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("The email notification timed out. Please try again.");
    }
    throw new Error("The email notification could not be reached. Please try again.");
  } finally {
    window.clearTimeout(timeout);
  }

  if (!response.ok) {
    const payload = await response
      .json()
      .catch(() => null) as { error?: unknown } | null;
    const serverMessage =
      typeof payload?.error === "string" ? payload.error.trim() : "";

    throw new Error(serverMessage || "Lead submission failed");
  }
}
