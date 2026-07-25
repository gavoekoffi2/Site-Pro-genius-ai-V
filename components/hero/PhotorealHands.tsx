"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import gsap from "gsap";
import { asset } from "@/lib/asset";

/**
 * Couche photoréaliste du hero.
 *
 * L'asset est une image unique où les deux mains se rejoignent au centre exact.
 * Elle est affichée deux fois, chaque copie fondue à la moitié par un masque en
 * dégradé : la moitié « main humaine » et la moitié « main robotique ». Faire
 * glisser les deux moitiés l'une vers l'autre recompose l'image au pixel près à
 * la progression 1 — on obtient une véritable approche des mains
 * photoréalistes sans jamais déformer l'anatomie.
 *
 * Deux choix importants :
 *  - `<picture>` plutôt que `next/image` : le rendu est présent dans le HTML
 *    statique, donc le scanner de préchargement du navigateur trouve l'image
 *    immédiatement (c'est l'élément LCP), et la bonne variante — horizontale ou
 *    verticale — est choisie par le navigateur, sans double téléchargement.
 *  - masques et axe de glissement définis en CSS (cf. `globals.css`) : corrects
 *    dès la première image, sans attendre l'hydratation.
 */

const DESKTOP_SRC = "/assets/cinematic/human-robot-contact-hero-desktop.webp";
const MOBILE_SRC = "/assets/cinematic/human-robot-contact-hero-mobile.webp";

/** Écart initial entre les deux moitiés, en % (doit refléter `--hands-gap`). */
const SPREAD = 8.5;

/** Opacité au repos : les mains émergent de la pénombre, jamais d'un écran vide. */
const BASE_OPACITY = 0.42;

type Props = {
  /** Progression du scroll du hero, 0 → 1. */
  progress: MutableRefObject<number>;
  /** Rendu statique immédiat : mains déjà en contact (reduced-motion). */
  staticContact?: boolean;
};

/** Une moitié de la composition. */
function Half({ className }: { className: string }) {
  return (
    <div className={className}>
      <picture>
        <source media="(max-width: 767px)" srcSet={asset(MOBILE_SRC)} />
        <img
          src={asset(DESKTOP_SRC)}
          alt=""
          fetchPriority="high"
          decoding="async"
          draggable={false}
          className="h-full w-full object-cover"
        />
      </picture>
    </div>
  );
}

export default function PhotorealHands({ progress, staticContact = false }: Props) {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;

    if (staticContact) {
      el.style.setProperty("--hands-gap", "0%");
      el.style.opacity = "1";
      return;
    }

    const tick = () => {
      const p = gsap.utils.clamp(0, 1, progress.current);

      // Approche décélérée, calée sur la courbe de la scène d'énergie pour que
      // les deux couches restent solidaires.
      const eased = 1 - Math.pow(1 - Math.min(p / 0.86, 1), 2.2);
      el.style.setProperty("--hands-gap", `${SPREAD * (1 - eased)}%`);

      // Les mains montent en intensité pendant l'approche.
      el.style.opacity = String(BASE_OPACITY + (1 - BASE_OPACITY) * Math.min(p / 0.55, 1));
    };

    tick();
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [progress, staticContact]);

  return (
    <div
      ref={wrap}
      className="hero-hands absolute inset-0 overflow-hidden"
      style={{ opacity: staticContact ? 1 : BASE_OPACITY }}
      aria-hidden
    >
      <Half className="hero-hands-a" />
      <Half className="hero-hands-b" />
    </div>
  );
}
