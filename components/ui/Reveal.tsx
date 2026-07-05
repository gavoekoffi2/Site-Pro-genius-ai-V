"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const variants: Variants = {
  hidden: (dir: string) => ({
    opacity: 0,
    y: dir === "up" ? 44 : dir === "down" ? -44 : 0,
    x: dir === "left" ? 44 : dir === "right" ? -44 : 0,
    filter: "blur(10px)",
  }),
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    filter: "blur(0px)",
  },
};

/** Apparition douce au scroll : fade + slide + blur. */
export default function Reveal({
  children,
  delay = 0,
  direction = "up",
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      custom={direction}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
