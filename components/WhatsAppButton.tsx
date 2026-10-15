import { publicConfig, siteConfig } from "@/lib/config";

function WhatsAppIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 11.6a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 8.5c.5 2.7 1.8 4 4.5 5l1-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WhatsAppButton() {
  const number = publicConfig.whatsappNumber.replace(/\D/g, "");
  if (!number) return null;

  const href = `https://wa.me/${number}?text=${encodeURIComponent(siteConfig.thankYou.whatsappMessage)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mx-auto mt-7 flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-[#15803D] px-6 py-3.5 text-base font-bold text-white shadow-[0_14px_30px_rgba(21,128,61,.22)] transition hover:-translate-y-0.5 hover:bg-[#166534] sm:w-auto sm:min-w-72"
    >
      <WhatsAppIcon />
      {siteConfig.thankYou.whatsappLabel}
    </a>
  );
}
