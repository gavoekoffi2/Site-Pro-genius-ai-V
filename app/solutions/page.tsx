import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";
import FinalCTA from "@/components/sections/FinalCTA";
import { solutionAudiences } from "@/lib/data";

export const metadata: Metadata = {
  title: "Solutions IA",
  description:
    "Des solutions d'intelligence artificielle pour chaque acteur de l'économie africaine : entreprises, PME, startups, investisseurs, gouvernements, créateurs et talents.",
};

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions IA"
        title="Une intelligence adaptée à chaque ambition."
        sub="Que vous dirigiez une PME, une startup, un fonds d'investissement ou une institution publique, nous transformons l'IA en avantage concret pour votre organisation."
      />

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-10 md:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {solutionAudiences.map((a, i) => (
            <Reveal key={a.slug} delay={i * 0.07} className={i === 0 ? "md:col-span-2" : ""}>
              <TiltCard className="h-full rounded-3xl">
                <div className="glass-deep flex h-full flex-col gap-5 rounded-3xl p-9">
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-frost md:text-3xl">
                    {a.title}
                  </h2>
                  <p className="text-pretty leading-relaxed text-mist">{a.text}</p>
                  <ul className="mt-1 flex flex-col gap-2.5">
                    {a.points.map((p) => (
                      <li key={p} className="flex items-start gap-3 text-sm text-frost/80">
                        <span className="glass mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                          <Check size={11} className="text-cyan" strokeWidth={3} />
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact" className="link-arrow mt-auto pt-3">
                    Parler à notre équipe
                    <ArrowRight size={15} strokeWidth={2.2} />
                  </Link>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
