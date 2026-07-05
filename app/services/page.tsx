import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";
import ServiceIcon from "@/components/ServiceIcon";
import FinalCTA from "@/components/sections/FinalCTA";
import { services } from "@/lib/data";

export const metadata: Metadata = {
  title: "Services",
  description:
    "SaaS IA, agents IA, automatisations, plateformes, applications, solutions vocales, formations et conseil : le spectre complet des services d'intelligence artificielle de Pro Genius AI.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Tout le spectre de l'intelligence artificielle."
        sub="De la stratégie au déploiement en production, nous couvrons l'intégralité de la chaîne de valeur IA — avec une seule promesse : des résultats mesurables."
      />

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-10 md:px-8">
        <div className="grid gap-6 sm:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 2) * 0.08}>
              <TiltCard className="h-full rounded-3xl">
                <Link
                  href={`/services/${s.slug}`}
                  className="glass-deep group flex h-full flex-col gap-5 rounded-3xl p-9 transition-colors duration-500 hover:border-ember/25"
                >
                  <span className="glass inline-flex h-13 w-13 items-center justify-center rounded-2xl p-3.5 text-ember transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_26px_rgba(255,155,69,0.25)]">
                    <ServiceIcon name={s.icon} />
                  </span>
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-frost">{s.name}</h2>
                  <p className="font-display text-frost/80">{s.short}</p>
                  <p className="flex-1 text-sm leading-relaxed text-mist">{s.description}</p>
                  <span className="link-arrow">
                    En savoir plus
                    <ArrowRight size={15} strokeWidth={2.2} />
                  </span>
                </Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
