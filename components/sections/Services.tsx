"use client";

import Link from "next/link";
import { ArrowUpRight, BrainCircuit } from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import { services } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const dict = getDictionary();

const orbitSlugs = ["automatisations-ia", "agents-ia", "applications-ia", "formations-ia", "conseil-ia", "saas-ia"];
const orbitServices = orbitSlugs
  .map((slug) => services.find((s) => s.slug === slug))
  .filter((s): s is (typeof services)[number] => Boolean(s));

/**
 * Visualisation orbitale : le cerveau IA au centre, les services
 * gravitent autour sur deux anneaux contrarotatifs. Les étiquettes
 * contre-tournent pour rester lisibles.
 */
function Orbit() {
  const inner = orbitServices.slice(0, 3);
  const outer = orbitServices.slice(3);

  return (
    <div className="relative mx-auto hidden aspect-square w-full max-w-[620px] lg:block">
      {/* Anneaux */}
      <div className="absolute inset-[9%] rounded-full border border-white/[0.07]" />
      <div className="absolute inset-[26%] rounded-full border border-white/[0.09]" />
      <div className="absolute inset-[26%] rounded-full border border-ember/10 blur-[1px]" />

      {/* Cœur — le cerveau IA */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex h-36 w-36 items-center justify-center rounded-full">
          <div
            className="absolute inset-0 animate-[pulse-soft_4s_ease-in-out_infinite] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,155,69,0.2), rgba(46,95,183,0.08) 55%, transparent 75%)" }}
          />
          <div className="glass-deep relative flex h-24 w-24 items-center justify-center rounded-full ring-glow">
            <BrainCircuit size={40} className="text-ember" strokeWidth={1.4} />
          </div>
        </div>
      </div>

      {/* Anneau intérieur */}
      <div className="absolute inset-[26%] animate-[orbit_36s_linear_infinite]">
        {inner.map((s, i) => {
          const angle = (i / inner.length) * 360;
          return (
            <div
              key={s.slug}
              className="absolute left-1/2 top-1/2"
              style={{ transform: `rotate(${angle}deg) translateX(148px) rotate(-${angle}deg)` }}
            >
              <div className="-translate-x-1/2 -translate-y-1/2 animate-[orbit-reverse_36s_linear_infinite]">
                <OrbitNode name={s.name} slug={s.slug} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Anneau extérieur */}
      <div className="absolute inset-[9%] animate-[orbit-reverse_52s_linear_infinite]">
        {outer.map((s, i) => {
          const angle = (i / outer.length) * 360 + 42;
          return (
            <div
              key={s.slug}
              className="absolute left-1/2 top-1/2"
              style={{ transform: `rotate(${angle}deg) translateX(252px) rotate(-${angle}deg)` }}
            >
              <div className="-translate-x-1/2 -translate-y-1/2 animate-[orbit_52s_linear_infinite]">
                <OrbitNode name={s.name} slug={s.slug} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrbitNode({ name, slug }: { name: string; slug: string }) {
  return (
    <Link
      href={`/services/${slug}`}
      className="glass-deep group flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 font-display text-sm text-frost/85 transition-all duration-400 hover:border-ember/50 hover:text-frost hover:shadow-[0_0_26px_rgba(255,155,69,0.2)]"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_8px_#ff9b45] transition-transform duration-400 group-hover:scale-125" />
      {name}
    </Link>
  );
}

export default function Services() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-40">
      <SectionHeading eyebrow={dict.services.eyebrow} title={dict.services.title} sub={dict.services.sub} />

      <Reveal delay={0.2} className="mt-10">
        <Orbit />
      </Reveal>

      {/* Liste mobile / accessibilité */}
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:hidden">
        {services.map((s, i) => (
          <Reveal key={s.slug} delay={i * 0.06}>
            <Link
              href={`/services/${s.slug}`}
              className="glass flex items-center justify-between gap-3 rounded-2xl p-5 transition-colors hover:border-ember/30"
            >
              <div>
                <h3 className="font-display font-medium text-frost">{s.name}</h3>
                <p className="mt-1 text-sm text-mist">{s.short}</p>
              </div>
              <ArrowUpRight size={17} className="shrink-0 text-ember" />
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.3} className="mt-14 flex justify-center">
        <Link href="/services" className="btn-ghost">
          {dict.services.viewAll}
          <ArrowUpRight size={16} />
        </Link>
      </Reveal>
    </section>
  );
}
