"use client";

import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef } from "react";

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
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const items = section.querySelectorAll<HTMLElement>("[data-problem-reveal]");
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      items.forEach((item) => item.setAttribute("data-visible", "true"));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        items.forEach((item) => item.setAttribute("data-visible", "true"));
        observer.disconnect();
      },
      { threshold: 0.18 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse") return;

    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width;
    const vertical = (event.clientY - bounds.top) / bounds.height;

    card.style.setProperty("--move-x", `${(horizontal - 0.5) * 7}px`);
    card.style.setProperty("--move-y", `${(vertical - 0.5) * 7}px`);
    card.style.setProperty("--rotate-x", `${(0.5 - vertical) * 3}deg`);
    card.style.setProperty("--rotate-y", `${(horizontal - 0.5) * 3}deg`);
    card.style.setProperty("--glow-x", `${horizontal * 100}%`);
    card.style.setProperty("--glow-y", `${vertical * 100}%`);
  }

  function resetPointerMovement(event: ReactPointerEvent<HTMLElement>) {
    const card = event.currentTarget;
    card.style.setProperty("--move-x", "0px");
    card.style.setProperty("--move-y", "0px");
    card.style.setProperty("--rotate-x", "0deg");
    card.style.setProperty("--rotate-y", "0deg");
  }

  return (
    <section ref={sectionRef} className="bg-soft-background py-14 sm:py-20" aria-labelledby="problem-title">
      <div className="section-shell max-w-4xl">
        <h2 id="problem-title" className="text-balance text-center text-3xl font-extrabold tracking-[-0.035em] text-foreground sm:text-4xl">
          {siteConfig.problem.title}
        </h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4">
          {siteConfig.problem.items.map((item, index) => (
            <div
              key={item}
              data-problem-reveal
              className="problem-reveal"
              style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
            >
              <article
                data-problem-card
                onPointerMove={handlePointerMove}
                onPointerLeave={resetPointerMovement}
                className="problem-card-interactive flex h-full items-start gap-4 rounded-2xl border border-border bg-white p-5 shadow-[0_8px_28px_rgba(6,60,45,.045)]"
              >
                <span className="relative z-10 flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-primary">
                  <MessageIcon />
                </span>
                <p className="relative z-10 pt-1 text-[1.02rem] font-semibold leading-7 text-foreground">{item}</p>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
