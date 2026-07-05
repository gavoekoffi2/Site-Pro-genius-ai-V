"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";

/**
 * Carte premium : rotation 3D subtile au survol, élévation,
 * halo lumineux qui suit le curseur.
 */
export default function TiltCard({
  children,
  className = "",
  glowColor = "rgba(255, 155, 69, 0.14)",
}: {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (py - 0.5) * -7;
    const ry = (px - 0.5) * 9;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    if (glow.current) {
      glow.current.style.background = `radial-gradient(420px circle at ${px * 100}% ${py * 100}%, ${glowColor}, transparent 65%)`;
      glow.current.style.opacity = "1";
    }
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)";
    if (glow.current) glow.current.style.opacity = "0";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative will-change-transform ${className}`}
      style={{ transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)" }}
    >
      <div
        ref={glow}
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0"
        style={{ transition: "opacity 0.4s ease" }}
        aria-hidden
      />
      {children}
    </div>
  );
}
