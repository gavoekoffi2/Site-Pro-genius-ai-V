"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import MagneticButton from "@/components/ui/MagneticButton";

gsap.registerPlugin(ScrollTrigger);

const HandsScene = dynamic(() => import("./HandsScene"), { ssr: false });

const dict = getDictionary();

/**
 * Hero cinématique : la scène reste épinglée pendant le scroll.
 * La progression rapproche l'index humain de l'index robotique ; au contact,
 * une onde lumineuse traverse l'écran avant de révéler le slogan.
 */
export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const slogan = useRef<HTMLDivElement>(null);
  const flash = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setMounted(true);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(prefersReduced);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          progress.current = p;

          // L'invitation initiale s'efface dès que l'histoire commence
          if (intro.current) {
            gsap.set(intro.current, {
              opacity: gsap.utils.clamp(0, 1, 1 - p / 0.27),
              y: p * -52,
              filter: `blur(${p * 13}px)`,
            });
          }

          // Flash plein écran au moment exact du contact
          if (flash.current) {
            const f = gsap.utils.clamp(0, 1, (p - 0.655) / 0.035) * gsap.utils.clamp(0, 1, (0.775 - p) / 0.055);
            gsap.set(flash.current, { opacity: f * 0.72 });
          }

          // Révélation du slogan après l'impact
          if (slogan.current) {
            const s = gsap.utils.clamp(0, 1, (p - 0.755) / 0.12);
            gsap.set(slogan.current, {
              opacity: s,
              y: (1 - s) * 46,
              filter: `blur(${(1 - s) * 12}px)`,
            });
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={section} className="relative" style={{ height: reduced ? "180vh" : "240vh" }}>
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {/* Halo ambiant derrière la scène */}
        <div
          className="animate-aurora pointer-events-none absolute left-1/2 top-1/2 h-[80vmin] w-[110vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60"
          style={{ background: "radial-gradient(ellipse, rgba(93,156,187,0.15), rgba(21,63,107,0.09) 48%, transparent 70%)" }}
          aria-hidden
        />
        <div className="grid-veil pointer-events-none absolute inset-0" aria-hidden />

        {/* Interface IA cinématique : des repères techniques donnent à la scène
            la profondeur d'un laboratoire, sans concurrencer les deux mains. */}
        <div className="hero-hud pointer-events-none absolute inset-0 z-[3] hidden md:block" aria-hidden>
          <div className="hero-hud-corner hero-hud-corner--tl" />
          <div className="hero-hud-corner hero-hud-corner--tr" />
          <div className="hero-hud-corner hero-hud-corner--bl" />
          <div className="hero-hud-corner hero-hud-corner--br" />
          <div className="absolute left-8 top-[34%] flex items-center gap-3 xl:left-14">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-[#70ddd2]/25">
              <span className="absolute inset-1 animate-ping rounded-full border border-[#70ddd2]/20" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#8cebdd] shadow-[0_0_12px_#70ddd2]" />
            </span>
            <div><span className="block font-mono text-[8px] uppercase tracking-[0.25em] text-[#88c9c4]/45">Human potential</span><span className="mt-1 block font-mono text-[10px] tracking-[0.14em] text-[#d9f4f0]/70">CAPACITY · AMPLIFIED</span></div>
          </div>
          <div className="absolute right-8 top-[34%] flex items-center gap-3 text-right xl:right-14">
            <div><span className="block font-mono text-[8px] uppercase tracking-[0.25em] text-[#88c9c4]/45">Intelligence layer</span><span className="mt-1 block font-mono text-[10px] tracking-[0.14em] text-[#d9f4f0]/70">NEURAL CORE · ONLINE</span></div>
            <span className="relative h-8 w-8 rounded-md border border-[#70ddd2]/25 bg-[#70ddd2]/[0.035]"><span className="absolute inset-x-1 top-1/2 h-px animate-[hud-scan_2.8s_ease-in-out_infinite] bg-[#8cebdd]/75 shadow-[0_0_8px_#70ddd2]" /></span>
          </div>
          <div className="absolute bottom-9 left-1/2 flex -translate-x-1/2 items-center gap-5 font-mono text-[8px] uppercase tracking-[0.25em] text-white/25">
            <span>Agents IA</span><span className="h-1 w-1 rounded-full bg-[#70ddd2]/55" /><span>Automatisation</span><span className="h-1 w-1 rounded-full bg-[#c58b61]/55" /><span>Produits intelligents</span>
          </div>
        </div>

        {/* Scène 3D */}
        {mounted && (
          <div className="absolute inset-0">
            <HandsScene progress={progress} />
          </div>
        )}

        {/* Flash d'impact */}
        <div
          ref={flash}
          className="pointer-events-none absolute inset-0 opacity-0"
          style={{ background: "radial-gradient(circle at 50% 53.2%, rgba(255,255,255,0.98), rgba(93,220,204,0.52) 24%, rgba(93,156,187,0.34) 42%, rgba(183,86,29,0.13) 61%, transparent 75%)" }}
          aria-hidden
        />

        {/* Acte I — l'invitation */}
        <div ref={intro} className="relative z-10 flex h-full flex-col items-center justify-between py-28 text-center md:py-32">
          <div className="flex flex-col items-center gap-6 px-5">
            <span
              className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 font-display text-[11px] uppercase tracking-[0.3em] text-ember-soft"
              style={{ opacity: 0, animation: "heroFade 1.2s cubic-bezier(0.22,1,0.36,1) 2.5s both" }}
            >
              <span className="h-1 w-1 rounded-full bg-ember shadow-[0_0_8px_#ff9b45]" />
              {dict.hero.eyebrow}
            </span>
            <h1
              className="font-display max-w-4xl text-balance text-4xl font-medium leading-[0.98] tracking-[-0.045em] text-frost/90 md:text-6xl lg:text-[4.8rem]"
              style={{ opacity: 0, animation: "heroFade 1.4s cubic-bezier(0.22,1,0.36,1) 2.8s both" }}
            >
              {dict.hero.sub}
            </h1>
            <div className="hero-signal mt-1 h-px w-32 overflow-hidden bg-white/10" aria-hidden>
              <span className="block h-full w-1/2 bg-gradient-to-r from-transparent via-[#83e8dd] to-transparent" />
            </div>
          </div>

          <div
            className="flex flex-col items-center gap-3 text-mist"
            style={{ opacity: 0, animation: "heroFade 1.2s ease 3.4s both" }}
          >
            <span className="font-display text-[11px] uppercase tracking-[0.35em]">{dict.hero.scrollHint}</span>
            <span className="flex h-10 w-6 items-start justify-center rounded-full border border-white/15 p-1.5">
              <ArrowDown size={12} className="animate-bounce text-ember" />
            </span>
          </div>
        </div>

        {/* Acte II — la révélation */}
        <div
          ref={slogan}
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-8 px-5 text-center opacity-0"
        >
          <h2 className="font-display max-w-5xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            <span className="text-frost">{dict.hero.slogan}</span>
            <br />
            <span className="text-gradient">{dict.hero.sloganAccent}</span>
          </h2>
          <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-4">
            <MagneticButton href="/solutions">
              {dict.hero.ctaPrimary}
              <ArrowUpRight size={17} strokeWidth={2.4} />
            </MagneticButton>
            <MagneticButton href="/a-propos" variant="ghost">
              {dict.hero.ctaSecondary}
            </MagneticButton>
          </div>
        </div>

        {/* Lien d'évacuation accessible pendant le pin */}
        <Link href="/solutions" className="sr-only">
          {dict.hero.ctaPrimary}
        </Link>
      </div>
    </section>
  );
}
