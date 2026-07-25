"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import MagneticButton from "@/components/ui/MagneticButton";
import { hasWebGL } from "@/lib/webgl";
import { useInView } from "@/lib/useInView";
import PhotorealHands from "./PhotorealHands";

gsap.registerPlugin(ScrollTrigger);

const ContactEnergy = dynamic(() => import("./ContactEnergy"), { ssr: false });

const dict = getDictionary();

/**
 * Hero cinématique — actes 1 à 4 de la narration.
 *
 * La scène est épinglée pendant 300vh. La progression du scroll pilote :
 *   0.00 → 0.30  l'invitation s'efface
 *   0.00 → 0.86  les deux mains se rapprochent (particules + photoréalisme)
 *   0.42 → 0.84  les particules cèdent la place aux mains photoréalistes
 *   0.86 → 1.00  le contact : flash, onde, énergie
 *   0.89 → 0.98  le slogan est révélé
 *   0.94 → 1.00  l'énergie devient un flux de données vers l'acte du globe
 */
export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const slogan = useRef<HTMLDivElement>(null);
  const flash = useRef<HTMLDivElement>(null);
  const stream = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  // Le hero est en haut de page : il est monté d'emblée, mais sa boucle de
  // rendu s'arrête dès qu'on l'a quitté.
  const { inView } = useInView(section, { mountMargin: "0px" });
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [vertical, setVertical] = useState(false);
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    setMounted(true);
    setWebgl(hasWebGL());

    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqNarrow = window.matchMedia("(max-width: 767px)");
    setReduced(mqReduce.matches);
    setVertical(mqNarrow.matches);

    const onNarrow = (e: MediaQueryListEvent) => setVertical(e.matches);
    mqNarrow.addEventListener("change", onNarrow);

    if (mqReduce.matches) {
      // Sans animation : les mains sont déjà en contact et le slogan est lisible.
      progress.current = 1;
      if (slogan.current) gsap.set(slogan.current, { opacity: 1, y: 0, filter: "blur(0px)" });
      if (intro.current) gsap.set(intro.current, { opacity: 0 });
      return () => mqNarrow.removeEventListener("change", onNarrow);
    }

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
              opacity: gsap.utils.clamp(0, 1, 1 - p / 0.3),
              y: p * -60,
              filter: `blur(${p * 14}px)`,
            });
          }

          // Flash plein écran au moment exact du contact
          if (flash.current) {
            const f =
              gsap.utils.clamp(0, 1, (p - 0.855) / 0.05) *
              gsap.utils.clamp(0, 1, (0.97 - p) / 0.06);
            gsap.set(flash.current, { opacity: f * 0.55 });
          }

          // Révélation du slogan après l'impact
          if (slogan.current) {
            const s = gsap.utils.clamp(0, 1, (p - 0.885) / 0.09);
            gsap.set(slogan.current, {
              opacity: s,
              y: (1 - s) * 46,
              filter: `blur(${(1 - s) * 12}px)`,
            });
          }

          // Acte 4 — la transmission : l'impulsion devient un flux de données
          // qui descend vers l'acte du globe. C'est le raccord narratif.
          if (stream.current) {
            const t = gsap.utils.clamp(0, 1, (p - 0.94) / 0.06);
            gsap.set(stream.current, { opacity: t, scaleY: 0.3 + t * 0.7 });
          }
        },
      });
    }, section);

    return () => {
      ctx.revert();
      mqNarrow.removeEventListener("change", onNarrow);
    };
  }, []);

  return (
    <section ref={section} className="relative" style={{ height: reduced ? "100vh" : "300vh" }}>
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {/* Halo ambiant derrière la scène */}
        <div
          className="animate-aurora pointer-events-none absolute left-1/2 top-1/2 h-[80vmin] w-[110vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(ellipse, rgba(232,118,31,0.13), rgba(46,95,183,0.06) 48%, transparent 70%)",
          }}
          aria-hidden
        />
        <div className="grid-veil pointer-events-none absolute inset-0" aria-hidden />

        {/* Mains photoréalistes — l'asset cinématographique */}
        {mounted && (
          <PhotorealHands progress={progress} vertical={vertical} staticContact={reduced} />
        )}

        {/* Énergie du contact — uniquement si WebGL répond. Sans WebGL, les
            mains photoréalistes assurent seules la scène (repli complet). */}
        {mounted && !reduced && webgl && (
          <div className="absolute inset-0">
            <ContactEnergy progress={progress} vertical={vertical} active={inView} />
          </div>
        )}

        {/* Flash d'impact */}
        <div
          ref={flash}
          className="pointer-events-none absolute inset-0 opacity-0"
          style={{
            background:
              "radial-gradient(circle at 50% 45%, rgba(255,235,210,0.92), rgba(255,150,60,0.38) 40%, transparent 70%)",
          }}
          aria-hidden
        />

        {/* Acte 4 — le flux de données descendant vers le globe */}
        <div
          ref={stream}
          className="pointer-events-none absolute bottom-0 left-1/2 h-[26vh] w-px origin-bottom -translate-x-1/2 opacity-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(255,155,69,0.75) 35%, rgba(93,140,224,0.55))",
          }}
          aria-hidden
        />

        {/* Acte I — l'invitation */}
        <div
          ref={intro}
          className="relative z-10 flex h-full flex-col items-center justify-between py-28 text-center md:py-32"
        >
          <div className="flex flex-col items-center gap-6 px-5">
            <span
              className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 font-display text-[11px] uppercase tracking-[0.3em] text-ember-soft"
              style={{ opacity: 0, animation: "heroFade 1.2s cubic-bezier(0.22,1,0.36,1) 2.5s both" }}
            >
              <span className="h-1 w-1 rounded-full bg-ember shadow-[0_0_8px_#ff9b45]" />
              {dict.hero.eyebrow}
            </span>
            <h1
              className="font-display max-w-3xl text-balance text-3xl font-medium leading-tight tracking-tight text-frost/85 md:text-5xl"
              style={{ opacity: 0, animation: "heroFade 1.4s cubic-bezier(0.22,1,0.36,1) 2.8s both" }}
            >
              {dict.hero.sub}
            </h1>
          </div>

          <div
            className="flex flex-col items-center gap-3 text-mist"
            style={{ opacity: 0, animation: "heroFade 1.2s ease 3.4s both" }}
          >
            <span className="font-display text-[11px] uppercase tracking-[0.35em]">
              {dict.hero.scrollHint}
            </span>
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
          {/* Voile de lisibilité : le slogan doit rester lisible par-dessus
              les mains photoréalistes, sans les effacer. */}
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse 70% 54% at 50% 50%, rgba(7,5,3,0.9), rgba(7,5,3,0.62) 58%, transparent 82%)",
            }}
            aria-hidden
          />
          <h2 className="font-display max-w-5xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            <span className="text-frost drop-shadow-[0_2px_24px_rgba(0,0,0,0.85)]">
              {dict.hero.slogan}
            </span>
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
