'use client';
/* eslint-disable @next/next/no-img-element -- native images are required for Framer Motion photographic plate compositing */

import { useEffect, useState, type RefObject } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';

interface HandsSceneProps {
  progress: RefObject<number>;
}

/**
 * Photographic human × AI encounter.
 *
 * The scene is intentionally built from independent photographic plates so the
 * two hands can genuinely move toward each other as the visitor scrolls. The
 * former WebGL particle silhouettes looked illustrative; these plates preserve
 * skin, metal, depth of field and cinematic lighting.
 */
export default function HandsScene({ progress }: HandsSceneProps) {
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const scrollProgress = useMotionValue(progress.current ?? 0);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const parallaxX = useSpring(pointerX, { stiffness: 55, damping: 24, mass: 0.8 });
  const parallaxY = useSpring(pointerY, { stiffness: 55, damping: 24, mass: 0.8 });

  const humanApproach = useTransform(
    scrollProgress,
    [0, 0.2, 0.76, 1],
    reduceMotion ? ['0vw', '0vw', '0vw', '0vw'] : ['-17vw', '-14vw', '-2vw', '0vw']
  );
  const robotApproach = useTransform(
    scrollProgress,
    [0, 0.2, 0.76, 1],
    reduceMotion ? ['0vw', '0vw', '0vw', '0vw'] : ['17vw', '14vw', '2vw', '0vw']
  );
  const humanParallax = useTransform(parallaxX, [-1, 1], [-8, 8]);
  const robotParallax = useTransform(parallaxX, [-1, 1], [10, -10]);
  const handY = useTransform(parallaxY, [-1, 1], [-5, 5]);
  const backgroundX = useTransform(parallaxX, [-1, 1], [-12, 12]);
  const backgroundY = useTransform(parallaxY, [-1, 1], [-8, 8]);

  const handScale = useTransform(scrollProgress, [0, 0.78, 1], reduceMotion ? [0.86, 0.86, 0.86] : [0.78, 0.82, 0.86]);
  const contactOpacity = useTransform(scrollProgress, [0.76, 0.86, 0.93, 1], [0, 0.18, 1, 0.92]);
  const contactScale = useTransform(scrollProgress, [0.76, 0.92, 1], [0.2, 1, 1.35]);
  const atmosphereOpacity = useTransform(scrollProgress, [0, 0.65, 1], [0.3, 0.58, 0.78]);
  const sceneScale = useTransform(scrollProgress, [0, 1], reduceMotion ? [1, 1] : [1.04, 1.1]);

  useEffect(() => {
    setReady(true);
    let frame = 0;
    const syncProgress = () => {
      scrollProgress.set(progress.current ?? 0);
      frame = window.requestAnimationFrame(syncProgress);
    };
    frame = window.requestAnimationFrame(syncProgress);
    return () => window.cancelAnimationFrame(frame);
  }, [progress, scrollProgress]);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * 2);
    pointerY.set(((event.clientY - rect.top) / rect.height - 0.5) * 2);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-[#020809]"
      aria-hidden="true"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      {/* Africa — a photographic background plate, not a decorative icon. */}
      <motion.div
        className="absolute -inset-[3%]"
        style={{ x: backgroundX, y: backgroundY, scale: sceneScale }}
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
      >
        <img
          src="/media/africa-ai-background.jpg"
          alt=""
          className="h-full w-full object-cover object-center"
          draggable={false}
        />
      </motion.div>

      {/* Cinematic grade: preserves detail while keeping copy readable. */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_52%,transparent_0%,rgba(2,8,9,0.08)_34%,rgba(2,8,9,0.72)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,8,9,0.86)_0%,rgba(2,8,9,0.24)_33%,rgba(2,8,9,0.14)_58%,rgba(2,8,9,0.62)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,9,0.52)_0%,transparent_24%,transparent_70%,rgba(2,8,9,0.92)_100%)]" />

      {/* Human photographic plate. Pure black areas disappear through Screen. */}
      <motion.div
        className="absolute -inset-[1.5%] z-[2] will-change-transform"
        style={{ x: humanApproach, y: handY, scale: handScale }}
        initial={{ opacity: 0, x: '-12vw' }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ opacity: { duration: 1.1, delay: 0.15 }, x: { duration: 1.25, ease: [0.16, 1, 0.3, 1] } }}
      >
        <motion.img
          src="/media/african-human-hand.png"
          alt=""
          className="h-full w-full select-none object-cover object-center opacity-95"
          style={{ x: humanParallax }}
          draggable={false}
        />
      </motion.div>

      {/* Robot photographic plate. */}
      <motion.div
        className="absolute -inset-[1.5%] z-[3] will-change-transform"
        style={{ x: robotApproach, y: handY, scale: handScale }}
        initial={{ opacity: 0, x: '12vw' }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ opacity: { duration: 1.1, delay: 0.25 }, x: { duration: 1.25, ease: [0.16, 1, 0.3, 1] } }}
      >
        <motion.img
          src="/media/robot-hand.png"
          alt=""
          className="h-full w-full select-none object-cover object-center opacity-95"
          style={{ x: robotParallax }}
          draggable={false}
        />
      </motion.div>

      {/* Contact energy appears only when the fingertips meet. */}
      <motion.div
        className="pointer-events-none absolute left-[50.2%] top-[51%] z-[4] h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#56d6c9]/20 blur-2xl md:h-44 md:w-44"
        style={{ opacity: contactOpacity, scale: contactScale }}
      />
      <motion.div
        className="pointer-events-none absolute left-[50.2%] top-[51%] z-[4] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_4px_rgba(112,238,222,0.9),0_0_44px_16px_rgba(9,129,118,0.56)]"
        style={{ opacity: contactOpacity, scale: contactScale }}
      />
      {[0, 0.18, 0.36].map((delay) => (
        <motion.div
          key={delay}
          className="pointer-events-none absolute left-[50.2%] top-[51%] z-[4] h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#64d8cc]/45 md:h-32 md:w-32"
          style={{ opacity: contactOpacity }}
          animate={reduceMotion ? undefined : { scale: [0.45, 1.5], opacity: [0, 0.48, 0] }}
          transition={{ duration: 2.5, delay, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[51%] z-[4] h-px w-[70vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#ACCFD6] to-transparent blur-[1px]"
        style={{ opacity: contactOpacity, scaleX: contactScale }}
      />

      {/* Restrained data atmosphere — no particle-hand effect. */}
      <motion.div
        className="absolute inset-0 z-[5] opacity-60 mix-blend-screen"
        style={{ opacity: atmosphereOpacity }}
      >
        <div className="absolute left-[20%] top-[28%] h-px w-[18%] rotate-[9deg] bg-gradient-to-r from-transparent via-[#9ec9c3]/30 to-transparent" />
        <div className="absolute right-[18%] top-[64%] h-px w-[22%] -rotate-[11deg] bg-gradient-to-r from-transparent via-[#c6a15b]/25 to-transparent" />
        <div className="absolute left-[47%] top-[18%] h-1 w-1 rounded-full bg-[#8ce8dc] shadow-[0_0_20px_5px_rgba(67,194,180,0.45)]" />
      </motion.div>

      {/* Grain removes the sterile CGI finish. */}
      <div
        className="pointer-events-none absolute inset-0 z-[6] opacity-[0.055] mix-blend-soft-light"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%270 0 180 180%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%27.85%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27 opacity=%27.65%27/%3E%3C/svg%3E")',
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[7] h-[44%] bg-gradient-to-b from-[#020809]/90 via-[#020809]/35 to-transparent md:hidden" />
    </div>
  );
}
