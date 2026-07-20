"use client";

import { motion } from "framer-motion";
import { getDictionary } from "@/lib/i18n";
import Reveal from "@/components/ui/Reveal";
import DigitalGlobe from "./DigitalGlobe";

const dict = getDictionary();

/** Les mots du titre apparaissent un à un, la planète tourne à côté. */
function AnimatedTitle() {
  let wordIndex = 0;
  return (
    <h2 className="font-display text-balance text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">
      {dict.about.titleLines.map((line, li) => (
        <span key={li} className="block">
          {line.split(" ").map((word) => {
            const i = wordIndex++;
            return (
              <motion.span
                key={`${li}-${word}-${i}`}
                className={`mr-[0.28em] inline-block ${li === 1 ? "text-gradient" : "text-frost"}`}
                initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: 0.08 * i, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                {word}
              </motion.span>
            );
          })}
        </span>
      ))}
    </h2>
  );
}

export default function About() {
  return (
    <section id="a-propos" className="relative z-10 mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-40">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div className="flex flex-col gap-8">
          <Reveal>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-ember/20 bg-ember/5 px-4 py-1.5 font-display text-[11px] font-medium uppercase tracking-[0.3em] text-ember-soft">
              <span className="h-1 w-1 rounded-full bg-azure-soft shadow-[0_0_8px_#5d9cbb]" />
              {dict.about.eyebrow}
            </span>
          </Reveal>

          <AnimatedTitle />

          <Reveal delay={0.35}>
            <p className="max-w-xl text-pretty text-base leading-relaxed text-mist md:text-lg">
              {dict.about.body}
            </p>
          </Reveal>

          <div className="mt-2 flex flex-col gap-4">
            {dict.about.pillars.map((p, i) => (
              <Reveal key={p.title} delay={0.15 + i * 0.12} direction="right">
                <div className="glass group flex items-start gap-4 rounded-2xl p-5 transition-colors duration-500 hover:border-ember/30">
                  <span className="font-display mt-0.5 text-sm font-semibold text-ember">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="font-display font-medium text-frost">{p.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-mist">{p.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.2} direction="left" className="flex justify-center">
          <div className="relative">
            <DigitalGlobe />
            <div
              className="pointer-events-none absolute inset-0 animate-[pulse-soft_6s_ease-in-out_infinite] rounded-full"
              style={{ boxShadow: "inset 0 0 80px rgba(93,156,187,0.07)" }}
              aria-hidden
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
