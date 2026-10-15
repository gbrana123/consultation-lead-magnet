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
    // TODO: No backend is connected yet. Set NEXT_PUBLIC_FORM_ENDPOINT to a
    // Formspree endpoint, Google Apps Script URL, email service endpoint, or a
    // Next.js route handler such as app/api/lead/route.ts. Without it, this
    // demo simulates success but does not save the lead.
    await new Promise((resolve) => setTimeout(resolve, 700));
    return;
  }

  const response = await fetch(publicConfig.formEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead satisfies LeadSubmission),
  });

  if (!response.ok) {
    throw new Error("Lead submission failed");
  }
}
