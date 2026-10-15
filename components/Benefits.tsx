"use client";

import Image from "next/image";
import type { PointerEvent as ReactPointerEvent } from "react";

import { siteConfig } from "@/lib/config";

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5 12 4.2 4L19 6.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Benefits() {
  function handlePointerMove(event: ReactPointerEvent<HTMLLIElement>) {
    if (event.pointerType !== "mouse") return;

    const item = event.currentTarget;
    const bounds = item.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width;
    const vertical = (event.clientY - bounds.top) / bounds.height;

    item.style.setProperty("--benefit-x", `${(horizontal - 0.5) * 8}px`);
    item.style.setProperty("--benefit-y", `${(vertical - 0.5) * 5}px`);
    item.style.setProperty("--benefit-rotate", `${(horizontal - 0.5) * 1.5}deg`);
    item.style.setProperty("--benefit-glow-x", `${horizontal * 100}%`);
    item.style.setProperty("--benefit-glow-y", `${vertical * 100}%`);
  }

  function resetPointerMovement(event: ReactPointerEvent<HTMLLIElement>) {
    const item = event.currentTarget;
    item.style.setProperty("--benefit-x", "0px");
    item.style.setProperty("--benefit-y", "0px");
    item.style.setProperty("--benefit-rotate", "0deg");
  }

  return (
    <section className="bg-white py-14 sm:py-20" aria-labelledby="benefits-title">
      <div className="section-shell max-w-5xl">
        <div className="grid items-center gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <div className="mx-auto flex aspect-square w-full max-w-[245px] items-center justify-center rounded-[2.25rem] border border-border bg-[linear-gradient(145deg,#f1fff8,#dffbef)] shadow-[0_22px_60px_rgba(8,122,87,.12)] sm:max-w-[280px]">
            <Image src={siteConfig.brand.icon} alt="" width={306} height={306} className="h-auto w-[76%] object-contain" />
          </div>
          <div>
            <h2 id="benefits-title" className="text-balance text-center text-3xl font-extrabold tracking-[-0.035em] text-foreground sm:text-4xl lg:text-left">
              {siteConfig.benefits.title}
            </h2>
            <ul className="mt-8 space-y-4">
              {siteConfig.benefits.items.map((item) => (
                <li
                  key={item}
                  onPointerMove={handlePointerMove}
                  onPointerLeave={resetPointerMovement}
                  className="benefit-item-interactive -mx-3 flex items-start gap-4 rounded-2xl px-3 py-2"
                >
                  <span className="benefit-icon relative z-10 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-[0_6px_16px_rgba(8,122,87,.18)]">
                    <CheckIcon />
                  </span>
                  <span className="relative z-10 text-[1.02rem] font-semibold leading-7 text-foreground sm:text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
