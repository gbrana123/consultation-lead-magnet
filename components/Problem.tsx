import { siteConfig } from "@/lib/config";

function MessageIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7.5 19.5 4 21l1.5-3.5A8 8 0 1 1 7.5 19.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 12h8M8 9h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function Problem() {
  return (
    <section className="bg-soft-background py-14 sm:py-20" aria-labelledby="problem-title">
      <div className="section-shell max-w-4xl">
        <h2 id="problem-title" className="text-balance text-center text-3xl font-extrabold tracking-[-0.035em] text-foreground sm:text-4xl">
          {siteConfig.problem.title}
        </h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4">
          {siteConfig.problem.items.map((item) => (
            <div key={item} className="flex items-start gap-4 rounded-2xl border border-border bg-white p-5 shadow-[0_8px_28px_rgba(6,60,45,.045)]">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-primary">
                <MessageIcon />
              </span>
              <p className="pt-1 text-[1.02rem] font-semibold leading-7 text-foreground">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
