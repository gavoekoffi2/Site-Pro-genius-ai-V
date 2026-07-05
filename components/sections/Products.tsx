import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import { products } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";

const dict = getDictionary();

export default function Products() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-40">
      <SectionHeading eyebrow={dict.products.eyebrow} title={dict.products.title} sub={dict.products.sub} />

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.08} className={i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}>
            <TiltCard glowColor={`${p.accent}22`} className="h-full rounded-3xl">
              <Link
                href={`/produits/${p.slug}`}
                className="glass-deep group flex h-full flex-col overflow-hidden rounded-3xl transition-colors duration-500 hover:border-white/20"
              >
                {/* Miniature futuriste */}
                <div className="relative h-44 overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${p.gradient} opacity-[0.13] transition-opacity duration-700 group-hover:opacity-[0.24]`}
                  />
                  <div
                    className="absolute inset-0 opacity-40"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(140,180,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(140,180,255,0.07) 1px, transparent 1px)",
                      backgroundSize: "28px 28px",
                    }}
                  />
                  <span
                    className="font-display absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl transition-transform duration-700 group-hover:scale-110"
                    style={{ color: p.accent, textShadow: `0 0 42px ${p.accent}` }}
                    aria-hidden
                  >
                    {p.symbol}
                  </span>
                  <span
                    className="absolute bottom-0 left-0 h-px w-full opacity-60"
                    style={{ background: `linear-gradient(90deg, transparent, ${p.accent}, transparent)` }}
                  />
                </div>

                <div className="flex flex-1 flex-col gap-3 p-7">
                  <span className="font-display text-[10px] uppercase tracking-[0.3em] text-mist/70">
                    {p.category}
                  </span>
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-frost">
                    {p.name}
                  </h3>
                  <p className="flex-1 text-sm leading-relaxed text-mist">{p.tagline}</p>
                  <span className="link-arrow mt-3">
                    {dict.products.discover}
                    <ArrowRight size={15} strokeWidth={2.2} />
                  </span>
                </div>
              </Link>
            </TiltCard>
          </Reveal>
        ))}

        {/* Carte « tous les produits » */}
        <Reveal delay={products.length * 0.08}>
          <TiltCard className="h-full rounded-3xl">
            <Link
              href="/produits"
              className="group flex h-full min-h-[300px] flex-col items-center justify-center gap-5 rounded-3xl border border-dashed border-white/15 bg-white/[0.015] p-7 text-center transition-colors duration-500 hover:border-cyan/40 hover:bg-cyan/[0.03]"
            >
              <span className="glass flex h-14 w-14 items-center justify-center rounded-full transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(56,225,255,0.25)]">
                <ArrowUpRight size={20} className="text-cyan" />
              </span>
              <span className="font-display text-lg font-medium text-frost">{dict.products.viewAll}</span>
            </Link>
          </TiltCard>
        </Reveal>
      </div>
    </section>
  );
}
