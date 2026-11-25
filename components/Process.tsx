import { siteConfig } from "@/lib/config";

export function Process() {
  return (
    <section className="bg-deep-green py-14 text-white sm:py-20" aria-labelledby="process-title">
      <div className="section-shell">
        <h2 id="process-title" className="text-balance text-center text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">
          {siteConfig.process.title}
        </h2>
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {siteConfig.process.steps.map((step, index) => (
            <article key={step.title} className="relative overflow-hidden rounded-2xl border border-white/12 bg-white/[0.065] p-6 backdrop-blur-sm">
              <span className="flex size-11 items-center justify-center rounded-full bg-brand text-lg font-extrabold text-deep-green">
                {index + 1}
              </span>
              <h3 className="mt-5 text-xl font-bold">{step.title}</h3>
              <p className="mt-2 leading-7 text-white/76">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
