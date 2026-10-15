import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { VimeoEmbed } from "@/components/VimeoEmbed";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: siteConfig.thankYou.title,
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouPage() {
  const { thankYou } = siteConfig;
  return (
    <>
      <Header />
      <main className="relative min-h-[calc(100vh-6rem)] overflow-hidden bg-soft-background px-4 py-14 sm:px-6 sm:py-20">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(24,237,138,.17),transparent_66%)]" aria-hidden="true" />
        <section className="relative mx-auto max-w-2xl rounded-[1.75rem] border border-border bg-white p-6 text-center shadow-[0_24px_70px_rgba(6,60,45,.11)] sm:p-10" aria-labelledby="thank-you-title">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-brand text-deep-green shadow-[0_12px_25px_rgba(24,237,138,.28)]" aria-hidden="true">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path d="m5 12 4.2 4L19 6.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 id="thank-you-title" className="text-balance mt-6 text-3xl font-extrabold tracking-[-0.04em] text-foreground sm:text-5xl">
            {thankYou.title}
          </h1>
          <p className="mt-4 text-balance text-lg leading-8 text-muted">{thankYou.message}</p>

          <ol className="mt-8 text-left">
            <li>
              <div className="mx-auto flex max-w-md items-start gap-3 rounded-xl bg-soft-background px-4 py-3.5 font-semibold leading-6 text-foreground">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-white">1</span>
                <span>{thankYou.steps[0]}</span>
              </div>
              <VimeoEmbed />
            </li>
            <li className="mt-7">
              <div className="mx-auto flex max-w-md items-start gap-3 rounded-xl bg-soft-background px-4 py-3.5 font-semibold leading-6 text-foreground">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-white">2</span>
                <span>{thankYou.steps[1]}</span>
              </div>
              <WhatsAppButton />
            </li>
          </ol>
        </section>
      </main>
    </>
  );
}
