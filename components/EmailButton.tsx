import { siteConfig } from "@/lib/config";

function EmailIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="m5 7 7 5 7-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function EmailButton() {
  const { contactEmail, emailLabel, emailMessage, emailSubject } =
    siteConfig.thankYou;
  const href = `mailto:${contactEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailMessage)}`;

  return (
    <a
      href={href}
      className="mx-auto mt-3 flex min-h-13 w-full items-center justify-center gap-2 rounded-full border-2 border-primary bg-white px-6 py-3.5 text-base font-bold text-primary shadow-[0_12px_26px_rgba(6,95,70,.12)] transition hover:-translate-y-0.5 hover:bg-soft-background sm:w-auto sm:min-w-72"
    >
      <EmailIcon />
      {emailLabel}
    </a>
  );
}
