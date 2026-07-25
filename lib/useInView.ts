"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Indique si un élément est (ou approche d')à l'écran.
 *
 * Sert à deux choses dans les scènes 3D :
 *  - `mounted` : ne monter le `<Canvas>` que lorsque la section approche, pour
 *    ne pas payer l'initialisation WebGL au chargement de la page ;
 *  - `inView`  : suspendre la boucle de rendu dès que la section sort du champ.
 *
 * Sans cela, les deux scènes du site (énergie du hero, globe) tournaient en
 * parallèle en permanence — le temps de blocage du thread principal doublait.
 */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { rootMargin = "0px", mountMargin = "600px" } = {}
) {
  const [inView, setInView] = useState(false);
  const [mounted, setMounted] = useState(false);
  const everMounted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Observateur de rendu : suspend/reprend la boucle d'animation.
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      rootMargin,
    });
    io.observe(el);

    // Observateur de montage : anticipe l'arrivée de la section.
    const pre = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !everMounted.current) {
          everMounted.current = true;
          setMounted(true);
          pre.disconnect();
        }
      },
      { rootMargin: mountMargin }
    );
    pre.observe(el);

    return () => {
      io.disconnect();
      pre.disconnect();
    };
  }, [ref, rootMargin, mountMargin]);

  return { inView, mounted };
}
