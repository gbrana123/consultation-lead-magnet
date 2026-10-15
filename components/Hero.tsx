import { siteConfig } from "@/lib/config";

function ArrowDownIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14m0 0 6-6m-6 6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Hero() {
  const { hero } = siteConfig;

  return (
    <section className="relative isolate overflow-hidden bg-background px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-18 lg:pb-24 lg:pt-22">
      <div className="hero-grid pointer-events-none absolute inset-0 -z-20" aria-hidden="true" />
      <div
        className="pointer-events-none absolute left-1/2 top-2 -z-10 h-[360px] w-[640px] max-w-[120vw] -translate-x-1/2 rounded-full blur-3xl"
        aria-hidden="true"
        style={{ background: "radial-gradient(circle, rgba(24,237,138,.18), rgba(189,248,228,.1) 50%, transparent 72%)" }}
      />

      <div className="mx-auto max-w-4xl text-center">
        <h1 className="fade-up text-balance text-[clamp(2.15rem,9.4vw,4.65rem)] font-extrabold leading-[1.06] tracking-[-0.045em] text-foreground">
          {hero.beforeHighlight}{" "}
          <span className="relative inline-block text-primary">
            {hero.highlight}
            <span className="absolute -bottom-1 left-0 h-2 w-full rounded-full bg-brand/30" aria-hidden="true" />
          </span>{" "}
          {hero.afterHighlight}
        </h1>

        <div className="fade-up-delay mx-auto mt-7 max-w-2xl">
          <p className="text-balance text-lg font-semibold leading-8 text-foreground sm:text-xl">
            {hero.subheadline}
          </p>
          <p className="mx-auto mt-4 max-w-xl text-balance text-base leading-7 text-muted sm:text-lg">
            {hero.description}
          </p>
          <a
            href="#book"
            className="group mt-8 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-bold text-white shadow-[0_14px_32px_rgba(8,122,87,.25)] transition hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_18px_38px_rgba(8,122,87,.3)] sm:w-auto sm:min-w-64"
          >
            {hero.cta}
            <span className="transition-transform group-hover:translate-y-0.5"><ArrowDownIcon /></span>
          </a>
        </div>
      </div>
    </section>
  );
}
