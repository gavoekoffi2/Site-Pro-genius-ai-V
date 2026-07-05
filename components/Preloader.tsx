"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Ouverture cinématique : écran noir, monogramme qui se trace,
 * pulsation lumineuse, puis le voile se lève sur le hero.
 */
export default function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => {
      setDone(true);
      document.documentElement.style.overflow = "";
    }, 2400);
    return () => {
      clearTimeout(t);
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020308]"
          exit={{ opacity: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }}
          aria-hidden
        >
          <div className="relative flex flex-col items-center gap-8">
            <motion.div
              className="absolute h-56 w-56 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(56,225,255,0.14), transparent 65%)" }}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: [0.4, 1.15, 1], opacity: [0, 1, 0.8] }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
            <svg width="92" height="92" viewBox="0 0 100 100" fill="none">
              <motion.circle
                cx="50" cy="50" r="44"
                stroke="url(#pg)" strokeWidth="1.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
              />
              <motion.path
                d="M36 68 V32 h16 a12 12 0 0 1 0 24 h-10"
                stroke="#e8edfb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.1, delay: 0.5, ease: "easeInOut" }}
              />
              <motion.circle
                cx="68" cy="66" r="3.4" fill="#38e1ff"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.4 }}
              />
              <defs>
                <linearGradient id="pg" x1="0" y1="0" x2="100" y2="100">
                  <stop stopColor="#38e1ff" />
                  <stop offset="1" stopColor="#2f6bff" />
                </linearGradient>
              </defs>
            </svg>
            <motion.p
              className="font-display text-[11px] uppercase tracking-[0.5em] text-mist"
              initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              Pro Genius AI
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
