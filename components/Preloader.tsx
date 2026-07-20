"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => {
      setDone(true);
      document.documentElement.style.overflow = "";
    }, 1900);
    return () => {
      clearTimeout(t);
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#03070d]"
          exit={{ opacity: 0, scale: 1.03, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } }}
          aria-hidden
        >
          <div className="relative flex flex-col items-center">
            <motion.div
              className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(93,156,187,.22),rgba(21,63,107,.08)_42%,transparent_70%)] blur-xl"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: [0.4, 1.15, 1], opacity: [0, 1, 0.8] }}
              transition={{ duration: 1.7, ease: "easeOut" }}
            />
            <motion.div
              initial={{ opacity: 0, y: 18, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image src="/brand/pro-genius-ai-logo.webp" alt="" width={166} height={180} className="h-40 w-auto" priority />
            </motion.div>
            <motion.div
              className="mt-6 h-px bg-gradient-to-r from-transparent via-[#5D9CBB] to-transparent"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 190, opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.85 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
