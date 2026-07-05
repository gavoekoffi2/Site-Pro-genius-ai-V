import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";
import FinalCTA from "@/components/sections/FinalCTA";
import { products } from "@/lib/data";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};
  return {
    title: product.name,
    description: `${product.tagline} ${product.description}`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  return (
    <>
      <header className="relative overflow-hidden pb-16 pt-40 md:pb-24 md:pt-52">
        <div
          className="animate-aurora pointer-events-none absolute left-1/2 top-0 h-[65vmin] w-[100vmin] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-70"
          style={{ background: `radial-gradient(ellipse, ${product.accent}26, transparent 70%)` }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <Link href="/produits" className="link-arrow mb-10 !text-mist hover:!text-ember">
              <ArrowLeft size={15} />
              Tous les produits
            </Link>
          </Reveal>
          <div className="mt-8 grid items-center gap-14 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
              <Reveal delay={0.08}>
                <span className="font-display text-[11px] uppercase tracking-[0.32em] text-mist/70">
                  {product.category}
                </span>
              </Reveal>
              <Reveal delay={0.14}>
                <h1 className="font-display text-balance text-5xl font-semibold tracking-tight text-frost md:text-7xl">
                  {product.name}
                </h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="font-display text-xl text-frost/85 md:text-2xl">{product.tagline}</p>
              </Reveal>
              <Reveal delay={0.26}>
                <p className="max-w-xl text-pretty leading-relaxed text-mist">{product.description}</p>
              </Reveal>
              <Reveal delay={0.32}>
                <div className="mt-2 flex flex-wrap gap-4">
                  <MagneticButton href="/contact">
                    Demander une démo
                    <ArrowUpRight size={17} strokeWidth={2.4} />
                  </MagneticButton>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.2} direction="left">
              <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-3xl border border-white/[0.08]">
                <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-[0.15]`} />
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(140,180,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(140,180,255,0.07) 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                  }}
                />
                <span
                  className="font-display animate-[float_8s_ease-in-out_infinite] text-9xl"
                  style={{ color: product.accent, textShadow: `0 0 70px ${product.accent}` }}
                  aria-hidden
                >
                  {product.symbol}
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-5 sm:grid-cols-2">
          {product.features.map((f, i) => (
            <Reveal key={f} delay={i * 0.07}>
              <div className="glass flex items-start gap-4 rounded-2xl p-6 transition-colors duration-500 hover:border-ember/25">
                <span className="glass mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full">
                  <Check size={13} className="text-ember" strokeWidth={3} />
                </span>
                <p className="text-sm leading-relaxed text-frost/85">{f}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
