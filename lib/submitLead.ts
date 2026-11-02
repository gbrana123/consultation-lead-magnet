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

  const response = await fetch(publicConfig.formEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead satisfies LeadSubmission),
  });

  if (!response.ok) {
    const payload = await response
      .json()
      .catch(() => null) as { error?: unknown } | null;
    const serverMessage =
      typeof payload?.error === "string" ? payload.error.trim() : "";

    throw new Error(serverMessage || "Lead submission failed");
  }
}
