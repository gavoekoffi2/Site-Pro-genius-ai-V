import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MapPin, Clock } from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/ui/Reveal";
import FinalCTA from "@/components/sections/FinalCTA";
import { jobOpenings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Carrières",
  description:
    "Rejoignez Pro Genius AI et construisez l'avenir de l'intelligence artificielle africaine. Postes ouverts en ingénierie, design, automatisation et growth.",
};

const perks = [
  { title: "Impact réel", text: "Vos lignes de code et vos designs touchent des entreprises dans huit pays africains." },
  { title: "Excellence exigée", text: "Un environnement où la barre est haute — et où l'on vous donne les moyens de l'atteindre." },
  { title: "IA au quotidien", text: "Les meilleurs outils d'IA du marché, intégrés à chaque étape de votre travail." },
  { title: "Flexibilité", text: "Remote-friendly à l'échelle du continent, avec des rituels d'équipe qui comptent." },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Carrières"
        title="Construisez ce que le continent attend."
        sub="Nous cherchons des personnes qui refusent la médiocrité et veulent laisser une trace. Si c'est vous, on devrait se parler."
      />

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-20 md:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.07}>
              <div className="glass h-full rounded-3xl p-7 transition-colors duration-500 hover:border-cyan/25">
                <h2 className="font-display text-lg font-semibold text-frost">{p.title}</h2>
                <p className="mt-2.5 text-sm leading-relaxed text-mist">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-5xl px-5 pb-16 md:px-8">
        <Reveal>
          <h2 className="font-display text-center text-3xl font-semibold tracking-tight text-frost md:text-4xl">
            Postes ouverts
          </h2>
        </Reveal>

        <div className="mt-12 flex flex-col gap-5">
          {jobOpenings.map((job, i) => (
            <Reveal key={job.slug} delay={i * 0.06}>
              <Link
                href={`/contact?poste=${job.slug}`}
                className="glass-deep group flex flex-col gap-4 rounded-3xl p-8 transition-all duration-500 hover:border-cyan/30 hover:shadow-[0_0_36px_rgba(47,107,255,0.1)] md:flex-row md:items-center md:justify-between"
              >
                <div className="max-w-2xl">
                  <span className="font-display text-[10px] uppercase tracking-[0.28em] text-cyan">
                    {job.team}
                  </span>
                  <h3 className="font-display mt-2 text-xl font-semibold tracking-tight text-frost md:text-2xl">
                    {job.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{job.description}</p>
                  <div className="mt-4 flex flex-wrap gap-5 text-xs text-mist/80">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={13} className="text-cyan" /> {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={13} className="text-cyan" /> {job.type}
                    </span>
                  </div>
                </div>
                <span className="glass flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-cyan transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_26px_rgba(56,225,255,0.3)]">
                  <ArrowUpRight size={18} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-12 text-center text-sm text-mist">
            Aucun poste ne correspond ? Les grands profils créent leur propre porte :{" "}
            <Link href="/contact" className="text-cyan underline-offset-4 hover:underline">
              candidature spontanée
            </Link>
            .
          </p>
        </Reveal>
      </section>

      <FinalCTA />
    </>
  );
}
