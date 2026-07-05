"use client";

import { getDictionary } from "@/lib/i18n";
import { technologies } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const dict = getDictionary();

/**
 * Nuage interactif : chaque technologie flotte à son propre rythme
 * et s'illumine au passage de la souris.
 */
export default function Tech() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-40">
      <SectionHeading eyebrow={dict.tech.eyebrow} title={dict.tech.title} />

      <div className="mx-auto mt-16 flex max-w-4xl flex-wrap items-center justify-center gap-x-4 gap-y-5">
        {technologies.map((t, i) => (
          <Reveal key={t} delay={i * 0.04}>
            <span
              className="glass inline-block cursor-default rounded-full px-6 py-3 font-display text-sm text-frost/75 transition-all duration-500 hover:-translate-y-1.5 hover:border-ember/50 hover:text-frost hover:shadow-[0_0_28px_rgba(255,155,69,0.28)]"
              style={{
                animation: `float ${7 + (i % 5) * 1.4}s ease-in-out ${i * 0.35}s infinite`,
                fontSize: i % 4 === 0 ? "1.05rem" : i % 3 === 0 ? "0.85rem" : "0.95rem",
              }}
            >
              {t}
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
