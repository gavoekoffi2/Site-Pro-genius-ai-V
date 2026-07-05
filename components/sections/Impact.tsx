"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { getDictionary } from "@/lib/i18n";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const dict = getDictionary();

/**
 * Timeline immersive : une ligne d'énergie se dessine au fil du
 * scroll, chaque chapitre apparaît comme une scène de film.
 */
export default function Impact() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 75%", "end 45%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-40">
      <SectionHeading eyebrow={dict.impact.eyebrow} title={dict.impact.title} />

      <div ref={container} className="relative mx-auto mt-20 max-w-3xl">
        {/* Rail + ligne d'énergie */}
        <div className="absolute left-5 top-0 h-full w-px bg-white/[0.08] md:left-1/2" aria-hidden />
        <motion.div
          className="absolute left-5 top-0 h-full w-px origin-top md:left-1/2"
          style={{
            scaleY: lineScale,
            background: "linear-gradient(180deg, #38e1ff, #2f6bff)",
            boxShadow: "0 0 14px rgba(56,225,255,0.6)",
          }}
          aria-hidden
        />

        <div className="flex flex-col gap-20">
          {dict.impact.steps.map((step, i) => {
            const left = i % 2 === 0;
            return (
              <div key={step.title} className="relative">
                {/* Nœud lumineux */}
                <span
                  className="absolute left-5 top-2 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-cyan shadow-[0_0_16px_#38e1ff] md:left-1/2"
                  aria-hidden
                />
                <Reveal
                  direction={left ? "right" : "left"}
                  className={`ml-12 md:ml-0 md:w-[calc(50%-3rem)] ${left ? "" : "md:ml-[calc(50%+3rem)]"}`}
                >
                  <div className="glass-deep group rounded-3xl p-8 transition-all duration-500 hover:border-cyan/25 hover:shadow-[0_0_40px_rgba(47,107,255,0.12)]">
                    <span className="font-display text-[11px] uppercase tracking-[0.32em] text-cyan">
                      {step.year}
                    </span>
                    <h3 className="font-display mt-3 text-2xl font-semibold tracking-tight text-frost">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-mist">{step.text}</p>
                  </div>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
