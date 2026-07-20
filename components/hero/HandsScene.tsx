'use client';
/* eslint-disable @next/next/no-img-element -- native transparent photographic plates are required for the scroll composite */

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
 * Rencontre photographique humain × IA.
 *
 * Les deux plaques transparentes partagent exactement le même cadre 1015 × 580 :
 * leur position finale garantit donc que seuls les bouts des index se rejoignent.
 * Le scroll anime les plaques séparément avant de déclencher l'impact au contact.
 */
export default function HandsScene({ progress }: HandsSceneProps) {
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const scrollProgress = useMotionValue(progress.current ?? 0);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const parallaxX = useSpring(pointerX, { stiffness: 52, damping: 25, mass: 0.85 });
  const parallaxY = useSpring(pointerY, { stiffness: 52, damping: 25, mass: 0.85 });

  // Les mains restent éloignées au début, avancent franchement, dépassent de
  // quelques pixels puis se stabilisent : ce micro-rebond rend le contact vivant.
  const humanApproach = useTransform(
    scrollProgress,
    [0, 0.12, 0.58, 0.68, 0.74, 1],
    reduceMotion
      ? ['0vw', '0vw', '0vw', '0vw', '0vw', '0vw']
      : ['-38vw', '-36vw', '-9vw', '0vw', '0.55vw', '0vw']
  );
  const robotApproach = useTransform(
    scrollProgress,
    [0, 0.12, 0.58, 0.68, 0.74, 1],
    reduceMotion
      ? ['0vw', '0vw', '0vw', '0vw', '0vw', '0vw']
      : ['38vw', '36vw', '9vw', '0vw', '-0.55vw', '0vw']
  );
  const humanRotation = useTransform(
    scrollProgress,
    [0, 0.18, 0.62, 0.7, 1],
    reduceMotion ? [0, 0, 0, 0, 0] : [-8, -7, -1.5, 0.35, 0]
  );
  const robotRotation = useTransform(
    scrollProgress,
    [0, 0.18, 0.62, 0.7, 1],
    reduceMotion ? [0, 0, 0, 0, 0] : [8, 7, 1.5, -0.35, 0]
  );

  const humanParallax = useTransform(parallaxX, [-1, 1], [-7, 7]);
  const robotParallax = useTransform(parallaxX, [-1, 1], [8, -8]);
  const handY = useTransform(parallaxY, [-1, 1], [-4, 4]);
  const backgroundX = useTransform(parallaxX, [-1, 1], [-12, 12]);
  const backgroundY = useTransform(parallaxY, [-1, 1], [-8, 8]);

  const handScale = useTransform(
    scrollProgress,
    [0, 0.2, 0.62, 0.72, 1],
    reduceMotion ? [1, 1, 1, 1, 1] : [0.9, 0.91, 0.985, 1.012, 1]
  );
  const contactOpacity = useTransform(scrollProgress, [0.63, 0.68, 0.73, 0.82, 1], [0, 0.45, 1, 0.72, 0.42]);
  const contactScale = useTransform(scrollProgress, [0.63, 0.7, 0.78, 1], [0.15, 1, 1.7, 2.15]);
  const impactOpacity = useTransform(scrollProgress, [0.64, 0.69, 0.735, 0.82], [0, 0.2, 1, 0]);
  const energyLineScale = useTransform(scrollProgress, [0.64, 0.7, 0.82], [0, 1, 1.42]);
  const atmosphereOpacity = useTransform(scrollProgress, [0, 0.55, 0.72, 1], [0.25, 0.48, 0.92, 0.64]);
  const sceneScale = useTransform(scrollProgress, [0, 0.7, 1], reduceMotion ? [1, 1, 1] : [1.025, 1.065, 1.085]);

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
      data-hands-scene
    >
      <motion.div
        className="absolute -inset-[3%]"
        style={{ x: backgroundX, y: backgroundY, scale: sceneScale }}
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 1.35, ease: 'easeOut' }}
      >
        <img
          src="/media/africa-ai-background.jpg"
          alt=""
          className="h-full w-full object-cover object-center"
          draggable={false}
        />
      </motion.div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_53%,transparent_0%,rgba(2,8,9,0.05)_30%,rgba(2,8,9,0.74)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,8,9,0.8)_0%,rgba(2,8,9,0.14)_31%,rgba(2,8,9,0.1)_68%,rgba(2,8,9,0.7)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,9,0.56)_0%,transparent_26%,transparent_72%,rgba(2,8,9,0.94)_100%)]" />

      {/*
        Un même cadre de composition pour les deux plaques évite toute dérive du
        point de contact. Sur mobile il reste large, mais n'est plus déformé ni
        rogné verticalement par object-cover.
      */}
      <div className="absolute left-1/2 top-[55%] z-[2] aspect-[1015/580] w-[164vw] -translate-x-1/2 -translate-y-1/2 sm:w-[142vw] md:top-[53%] md:w-[110vw] lg:w-[104vw]">
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ x: humanApproach, y: handY, scale: handScale, rotate: humanRotation, transformOrigin: '12% 78%' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ opacity: { duration: 0.95, delay: 0.12 } }}
          data-human-hand
        >
          <motion.img
            src="/media/african-human-hand.png"
            alt=""
            className="h-full w-full select-none object-contain opacity-[0.98] drop-shadow-[0_22px_34px_rgba(0,0,0,0.42)]"
            style={{ x: humanParallax }}
            draggable={false}
          />
        </motion.div>

        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ x: robotApproach, y: handY, scale: handScale, rotate: robotRotation, transformOrigin: '88% 76%' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ opacity: { duration: 0.95, delay: 0.2 } }}
          data-robot-hand
        >
          <motion.img
            src="/media/robot-hand.png"
            alt=""
            className="h-full w-full select-none object-contain opacity-[0.99] drop-shadow-[0_24px_38px_rgba(0,0,0,0.48)]"
            style={{ x: robotParallax }}
            draggable={false}
          />
        </motion.div>
      </div>

      {/* Point exact du contact des deux index. */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[53.2%] z-[5] h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.95)_0%,rgba(118,241,225,0.62)_9%,rgba(52,181,170,0.2)_35%,transparent_70%)] blur-xl md:h-60 md:w-60"
        style={{ opacity: contactOpacity, scale: contactScale }}
      />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[53.2%] z-[6] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_9px_3px_rgba(255,255,255,1),0_0_32px_13px_rgba(92,238,220,0.95),0_0_90px_38px_rgba(32,160,151,0.62)] md:h-4 md:w-4"
        style={{ opacity: contactOpacity, scale: contactScale }}
        data-contact-core
      />

      {/* Onde de choc premium : trois anneaux, un trait d'énergie et des éclats. */}
      {[0, 0.13, 0.26].map((delay, index) => (
        <motion.div
          key={delay}
          className="pointer-events-none absolute left-1/2 top-[53.2%] z-[5] h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#8ff7ea]/60 md:h-44 md:w-44"
          style={{ opacity: contactOpacity }}
          animate={reduceMotion ? undefined : { scale: [0.2, 1.75] }}
          transition={{ duration: 1.8 + index * 0.2, delay, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[53.2%] z-[5] h-px w-[92vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_16px_rgba(92,238,220,0.9)]"
        style={{ opacity: contactOpacity, scaleX: energyLineScale }}
      />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[53.2%] z-[5] h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(119,247,231,0.22)_2deg,transparent_5deg,transparent_86deg,rgba(255,255,255,0.16)_89deg,transparent_93deg,transparent_178deg,rgba(198,161,91,0.18)_181deg,transparent_185deg)] blur-[0.5px]"
        style={{ opacity: impactOpacity, scale: contactScale }}
      />
      {[18, 64, 112, 158, 206, 252, 301, 338].map((angle, index) => (
        <motion.span
          key={angle}
          className="pointer-events-none absolute left-1/2 top-[53.2%] z-[6] h-1 w-1 rounded-full bg-white shadow-[0_0_9px_2px_rgba(103,244,227,0.85)]"
          style={{
            opacity: impactOpacity,
            transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${44 + (index % 3) * 18}px)`,
          }}
        />
      ))}

      <motion.div className="absolute inset-0 z-[4] mix-blend-screen" style={{ opacity: atmosphereOpacity }}>
        <div className="absolute left-[16%] top-[28%] h-px w-[25%] rotate-[7deg] bg-gradient-to-r from-transparent via-[#9ce8df]/35 to-transparent" />
        <div className="absolute right-[15%] top-[68%] h-px w-[25%] -rotate-[9deg] bg-gradient-to-r from-transparent via-[#d8b56c]/28 to-transparent" />
        <div className="absolute left-[49.6%] top-[31%] h-1 w-1 rounded-full bg-[#8ce8dc] shadow-[0_0_22px_6px_rgba(67,194,180,0.55)]" />
      </motion.div>

      <div
        className="pointer-events-none absolute inset-0 z-[7] opacity-[0.06] mix-blend-soft-light"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%270 0 180 180%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%27.85%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25 height=%27100%25 filter=%27url(%23n)%27 opacity=%27.65%27/%3E%3C/svg%3E")',
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 z-[8] bg-white"
        style={{ opacity: impactOpacity }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[9] h-[42%] bg-gradient-to-b from-[#020809]/92 via-[#020809]/38 to-transparent md:hidden" />
    </div>
  );
}
