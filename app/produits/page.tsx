import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";
import FinalCTA from "@/components/sections/FinalCTA";
import { products } from "@/lib/data";

export const metadata: Metadata = {
  title: "Produits",
  description:
    "L'écosystème de produits IA de Pro Genius AI : Graphiste GPT, CutForge, AfriVox AI, ProCallAI, AfriTransfert. Des solutions conçues en Afrique, au standard mondial.",
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Écosystème produits"
        title="Des produits qui travaillent pour vous."
        sub="Chaque produit de l'écosystème Pro Genius AI est né d'un problème réel observé sur le terrain — et conçu avec une obsession : la qualité."
      />

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-10 md:px-8">
        <div className="flex flex-col gap-8">
          {products.map((p) => (
            <Reveal key={p.slug} delay={0.05}>
              <TiltCard glowColor={`${p.accent}1e`} className="rounded-3xl">
                <Link
                  href={`/produits/${p.slug}`}
                  className="glass-deep group grid gap-8 overflow-hidden rounded-3xl p-9 transition-colors duration-500 hover:border-white/20 md:grid-cols-[1fr_1.6fr] md:p-12"
                >
                  <div className="relative flex min-h-[180px] items-center justify-center overflow-hidden rounded-2xl">
                    <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient} opacity-[0.14] transition-opacity duration-700 group-hover:opacity-[0.26]`} />
                    <div
                      className="absolute inset-0 opacity-40"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(140,180,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(140,180,255,0.07) 1px, transparent 1px)",
                        backgroundSize: "26px 26px",
                      }}
                    />
                    <span
                      className="font-display relative text-7xl transition-transform duration-700 group-hover:scale-110"
                      style={{ color: p.accent, textShadow: `0 0 48px ${p.accent}` }}
                      aria-hidden
                    >
                      {p.symbol}
                    </span>
                  </div>

                  <div className="flex flex-col gap-4">
                    <span className="font-display text-[10px] uppercase tracking-[0.3em] text-mist/70">
                      {p.category}
                    </span>
                    <h2 className="font-display text-3xl font-semibold tracking-tight text-frost md:text-4xl">
                      {p.name}
                    </h2>
                    <p className="font-display text-lg text-frost/80">{p.tagline}</p>
                    <p className="text-sm leading-relaxed text-mist">{p.description}</p>
                    <span className="link-arrow mt-2">
                      Découvrir {p.name}
                      <ArrowRight size={15} strokeWidth={2.2} />
                    </span>
                  </div>
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
