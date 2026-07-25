"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getDictionary } from "@/lib/i18n";
import { services } from "@/lib/data";
import { useInView } from "@/lib/useInView";
import { hasWebGL } from "@/lib/webgl";
import DigitalGlobe from "./DigitalGlobe";

gsap.registerPlugin(ScrollTrigger);

const GlobeCanvas = dynamic(() => import("./GlobeCanvas"), { ssr: false });

const dict = getDictionary();

/**
 * Actes 5 à 7 de la narration : le flux de données issu du contact devient un
 * globe, l'Afrique s'illumine, son réseau se densifie, puis le rayonnement
 * part vers le monde.
 *
 * Les six services reliés aux nœuds sont les services réels du site
 * (`lib/data.ts`) : chacun pointe vers sa vraie route `/services/[slug]`.
 */

/** Services réellement proposés, reliés visuellement au continent. */
const NODE_SLUGS = [
  "agents-ia",
  "solutions-vocales-ia",
  "automatisations-ia",
  "plateformes-ia",
  "applications-ia",
  "conseil-ia",
] as const;

export default function AfricaGlobe() {
  const section = useRef<HTMLElement>(null);
  const heading = useRef<HTMLDivElement>(null);
  const nodesWrap = useRef<HTMLUListElement>(null);
  const progress = useRef(0);
  // Le canvas n'est monté qu'à l'approche de la section (600px avant), et sa
  // boucle de rendu ne tourne que lorsqu'elle est visible.
  const { inView, mounted: nearby } = useInView(section);

  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [webgl, setWebgl] = useState(true);

  const nodes = NODE_SLUGS.map(
    (slug) => services.find((s) => s.slug === slug)
  ).filter((s): s is NonNullable<typeof s> => Boolean(s));

  useEffect(() => {
    setMounted(true);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(prefersReduced);
    setWebgl(hasWebGL());

    if (prefersReduced) {
      progress.current = 1;
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          progress.current = self.progress;
          const p = self.progress;

          // Le titre apparaît une fois l'Afrique face à la caméra
          if (heading.current) {
            const h = gsap.utils.clamp(0, 1, (p - 0.26) / 0.16);
            gsap.set(heading.current, {
              opacity: h,
              y: (1 - h) * 34,
              filter: `blur(${(1 - h) * 10}px)`,
            });
          }

          // Les services s'attachent aux nœuds au fur et à mesure
          if (nodesWrap.current) {
            const items = nodesWrap.current.children;
            for (let i = 0; i < items.length; i++) {
              const start = 0.44 + (i / items.length) * 0.28;
              const v = gsap.utils.clamp(0, 1, (p - start) / 0.09);
              gsap.set(items[i], { opacity: v, x: (1 - v) * (i % 2 === 0 ? -22 : 22) });
            }
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const animated = mounted && !reduced;

  return (
    <section
      ref={section}
      aria-labelledby="globe-title"
      className="relative"
      style={{ height: reduced ? "auto" : "300vh" }}
    >
      <div
        className={`${
          reduced ? "" : "sticky top-0"
        } flex min-h-screen w-full flex-col items-center justify-center overflow-hidden py-24`}
      >
        {/* Plaque d'ambiance générée — profondeur sans coût de rendu */}
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-70"
          style={{ backgroundImage: "url('/assets/cinematic/africa-ai-ambience-desktop.webp')" }}
          aria-hidden
        />

        {/* Deux colonnes sur grand écran : le texte et le globe ne se
            superposent jamais, la lisibilité ne dépend d'aucun voile. */}
        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-5 lg:grid-cols-2 lg:gap-14">
          {/* Colonne texte + services */}
          <div className="flex flex-col">
            <div
              ref={heading}
              className="flex flex-col items-start gap-5 text-left"
              style={animated ? { opacity: 0 } : undefined}
            >
              <span className="inline-flex items-center gap-2.5 rounded-full border border-ember/20 bg-ember/5 px-4 py-1.5 font-display text-[11px] font-medium uppercase tracking-[0.3em] text-ember-soft backdrop-blur-sm">
                <span className="h-1 w-1 rounded-full bg-ember shadow-[0_0_8px_#ff9b45]" />
                {dict.globe.eyebrow}
              </span>
              <h2
                id="globe-title"
                className="font-display text-balance text-4xl font-semibold leading-[1.06] tracking-tight md:text-5xl lg:text-6xl"
              >
                <span className="text-frost">{dict.globe.title}</span>{" "}
                <span className="text-gradient">{dict.globe.titleAccent}</span>
              </h2>
              <p className="max-w-xl text-pretty text-sm leading-relaxed text-mist md:text-base">
                {dict.globe.sub}
              </p>
            </div>

            {/* Services réels reliés aux nœuds du continent */}
            <div className="mt-10">
              <h3 className="font-display mb-4 text-[11px] uppercase tracking-[0.3em] text-mist/70">
                {dict.globe.nodesLabel}
              </h3>
              <ul ref={nodesWrap} className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {nodes.map((s) => (
                  <li key={s.slug} style={animated ? { opacity: 0 } : undefined}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="glass-deep group flex items-center gap-3 rounded-xl px-3.5 py-3 transition-colors duration-500 hover:border-ember/35"
                    >
                      {/* Le trait relie visuellement l'étiquette au continent */}
                      <span
                        className="h-px w-4 flex-none bg-gradient-to-r from-transparent to-ember/70"
                        aria-hidden
                      />
                      <span
                        className="h-1.5 w-1.5 flex-none rounded-full bg-ember shadow-[0_0_10px_#ff9b45]"
                        aria-hidden
                      />
                      <span className="font-display text-[13px] font-medium leading-tight text-frost/90 group-hover:text-frost">
                        {s.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-[11px] leading-relaxed text-mist/55">
                {dict.globe.disclaimer}
              </p>
            </div>
          </div>

          {/* Colonne globe — conteneur carré dédié */}
          <div className="relative mx-auto aspect-square w-full max-w-[540px]">
            {mounted && webgl && nearby ? (
              <GlobeCanvas progress={progress} reduced={reduced} active={inView} />
            ) : (
              <div className="flex h-full w-full items-center justify-center opacity-90">
                <DigitalGlobe />
              </div>
            )}
          </div>
        </div>

        {/* Alternative textuelle de la scène pour les technologies d'assistance */}
        <p className="sr-only">{dict.globe.a11y}</p>
      </div>
    </section>
  );
}
