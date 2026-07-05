import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/ui/Reveal";
import FinalCTA from "@/components/sections/FinalCTA";
import { caseStudies } from "@/lib/data";

export const metadata: Metadata = {
  title: "Études de cas",
  description:
    "Des résultats concrets : comment les solutions IA de Pro Genius AI transforment les opérations d'entreprises et d'institutions africaines.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Études de cas"
        title="Des résultats, pas des promesses."
        sub="Chaque déploiement est mesuré. Voici ce qui se passe quand l'intelligence artificielle rencontre l'exécution."
      />

      <section className="relative z-10 mx-auto max-w-5xl px-5 pb-10 md:px-8">
        <div className="flex flex-col gap-10">
          {caseStudies.map((c) => (
            <Reveal key={c.slug} delay={0.05}>
              <article className="glass-deep group overflow-hidden rounded-3xl transition-all duration-500 hover:border-ember/20 hover:shadow-[0_0_50px_rgba(232,118,31,0.1)]">
                <div className="p-9 md:p-12">
                  <span className="font-display text-[11px] uppercase tracking-[0.3em] text-ember">
                    {c.sector}
                  </span>
                  <h2 className="font-display mt-4 text-balance text-2xl font-semibold tracking-tight text-frost md:text-4xl">
                    {c.title}
                  </h2>

                  <div className="mt-8 grid gap-8 md:grid-cols-2">
                    <div>
                      <h3 className="font-display text-xs uppercase tracking-[0.26em] text-mist/70">
                        Le défi
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-mist">{c.challenge}</p>
                    </div>
                    <div>
                      <h3 className="font-display text-xs uppercase tracking-[0.26em] text-mist/70">
                        Notre solution
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-mist">{c.solution}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-px border-t border-white/[0.06] bg-white/[0.03]">
                  {c.results.map((r, ri) => (
                    <div key={ri} className="bg-[#0b0806]/85 p-6 text-center md:p-8">
                      <p className="font-display text-2xl font-semibold text-gradient md:text-4xl">{r.value}</p>
                      <p className="mt-2 text-xs leading-snug text-mist md:text-sm">{r.label}</p>
                    </div>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
