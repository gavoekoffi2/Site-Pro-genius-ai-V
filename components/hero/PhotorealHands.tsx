"use client";

import Image from "next/image";
import { useEffect, useRef, type MutableRefObject } from "react";
import gsap from "gsap";

/**
 * Couche photoréaliste du hero.
 *
 * L'asset est une image unique où les deux mains se rejoignent au centre
 * exact. Elle est affichée deux fois, chaque copie découpée à la moitié
 * (`clip-path`) : la moitié « main humaine » et la moitié « main robotique ».
 * Faire glisser les deux moitiés l'une vers l'autre recompose l'image au
 * pixel près à la progression 1 — on obtient une véritable approche des mains
 * photoréalistes sans jamais déformer l'anatomie.
 *
 * L'écart central passe sur du noir obsidienne (le fond de l'image), il reste
 * donc invisible pendant l'approche.
 */

const DESKTOP_SRC = "/assets/cinematic/human-robot-contact-hero-desktop.webp";
const MOBILE_SRC = "/assets/cinematic/human-robot-contact-hero-mobile.webp";

/** Aperçus 24px inline : évitent tout flash blanc avant le décodage. */
const LQIP_DESKTOP =
  "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAABwAwCdASoYAA0APt1ap0yopSOiMAgBEBuJZ2HgADc1pqjYtpAA/vCiwfdBSGORjH94nkDh9kZ6ey0Y0+3mOyCNF4kTAAAA";
const LQIP_MOBILE =
  "data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAABwBQCdASoYACsAPtFWo0yoJKMitVgMAQAaCWcAxNgbQqKqmS+/2bVERF6t8+aBzqP4f0AAAP7xZHYl6LZGb25J1zHWZjnPbVXKNHmru69x3ZocA/qF1PF8Yb2X71v/S0C70BsSAlzko/KAAAA=";

/**
 * Écart maximal entre les deux moitiés, en % de la dimension.
 * Volontairement modeste : au-delà, chaque moitié emporte un fragment de la
 * main opposée et l'on voit un double des bouts de doigts au centre.
 */
const SPREAD = 8.5;

/**
 * Les deux moitiés ne sont pas découpées net mais fondues par un masque en
 * dégradé : sans cela, l'arête d'architecture présente au centre de l'image
 * se dédouble et laisse une couture verticale visible pendant l'approche.
 * À la progression 1 les deux copies sont superposées au pixel près, donc le
 * masque n'altère rien de l'image finale.
 */
const MASK = {
  horizontal: [
    "linear-gradient(to right, #000 43%, transparent 52%)",
    "linear-gradient(to left, #000 43%, transparent 52%)",
  ],
  vertical: [
    "linear-gradient(to bottom, #000 43%, transparent 52%)",
    "linear-gradient(to top, #000 43%, transparent 52%)",
  ],
} as const;

type Props = {
  /** Progression du scroll du hero, 0 → 1. */
  progress: MutableRefObject<number>;
  /** Composition verticale (mains haut/bas) au lieu d'horizontale. */
  vertical: boolean;
  /** Rendu statique immédiat : mains déjà en contact (reduced-motion). */
  staticContact?: boolean;
};

export default function PhotorealHands({ progress, vertical, staticContact = false }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLDivElement>(null);
  const second = useRef<HTMLDivElement>(null);

  const src = vertical ? MOBILE_SRC : DESKTOP_SRC;
  const lqip = vertical ? LQIP_MOBILE : LQIP_DESKTOP;

  // Moitié « entrante » : gauche/haut, puis droite/bas.
  const [maskFirst, maskSecond] = vertical ? MASK.vertical : MASK.horizontal;

  useEffect(() => {
    if (staticContact) {
      gsap.set([first.current, second.current], { xPercent: 0, yPercent: 0 });
      gsap.set(wrap.current, { opacity: 1 });
      return;
    }

    const axis = vertical ? "yPercent" : "xPercent";

    const tick = () => {
      const p = gsap.utils.clamp(0, 1, progress.current);

      // Approche décélérée, calée sur la même courbe que la scène de particules
      // pour que les deux couches restent solidaires.
      const eased = 1 - Math.pow(1 - Math.min(p / 0.86, 1), 2.2);
      const gap = SPREAD * (1 - eased);

      // Les mains sont visibles dès la première image — elles ENTRENT depuis
      // l'obscurité (acte 2 du storyboard) au lieu d'apparaître d'un coup.
      // Démarrer à 0 laissait un écran noir pendant ~2,5 s : mauvais pour le
      // récit comme pour la vitesse perçue (Speed Index).
      const reveal = 0.42 + 0.58 * gsap.utils.clamp(0, 1, p / 0.55);

      if (wrap.current) wrap.current.style.opacity = String(reveal);
      if (first.current) gsap.set(first.current, { [axis]: -gap });
      if (second.current) gsap.set(second.current, { [axis]: gap });
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [progress, vertical, staticContact]);

  return (
    <div
      ref={wrap}
      className="absolute inset-0 overflow-hidden"
      // 0.42 dès le rendu initial : la première image montre déjà les deux
      // mains dans la pénombre, jamais un écran vide.
      style={{ opacity: staticContact ? 1 : 0.42 }}
      aria-hidden
    >
      <div
        ref={first}
        className="absolute inset-0"
        style={{
          maskImage: maskFirst,
          WebkitMaskImage: maskFirst,
          willChange: "transform",
        }}
      >
        <Image
          src={src}
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          placeholder="blur"
          blurDataURL={lqip}
          className="object-cover"
          draggable={false}
        />
      </div>
      <div
        ref={second}
        className="absolute inset-0"
        style={{
          maskImage: maskSecond,
          WebkitMaskImage: maskSecond,
          willChange: "transform",
        }}
      >
        <Image
          src={src}
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          placeholder="blur"
          blurDataURL={lqip}
          className="object-cover"
          draggable={false}
        />
      </div>
    </div>
  );
}
