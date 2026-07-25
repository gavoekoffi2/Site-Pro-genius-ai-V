"use client";

import { useEffect, useRef } from "react";

/**
 * Planète numérique en canvas 2D : sphère de points en rotation lente,
 * l'Afrique mise en lumière en ember au centre du regard.
 */

// Contour simplifié de l'Afrique (lat, lon)
const AFRICA: [number, number][] = [
  [35, -6], [37, 10], [33, 22], [31, 32], [22, 37], [11, 43], [12, 51],
  [-1, 42], [-11, 41], [-16, 40], [-26, 33], [-34, 20], [-29, 15],
  [-17, 11], [-5, 9], [4, 9], [4, 6], [6, -8], [12, -17], [21, -17],
  [28, -10], [35, -6],
];

function inAfrica(lat: number, lon: number): boolean {
  let inside = false;
  for (let i = 0, j = AFRICA.length - 1; i < AFRICA.length; j = i++) {
    const [yi, xi] = AFRICA[i];
    const [yj, xj] = AFRICA[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

type Dot = { x: number; y: number; z: number; africa: boolean };

export default function DigitalGlobe() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SIZE = 460;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Sphère de Fibonacci
    const dots: Dot[] = [];
    const N = 1400;
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      const lat = Math.asin(y) * (180 / Math.PI);
      const lon = Math.atan2(z, x) * (180 / Math.PI);
      dots.push({ x, y, z, africa: inAfrica(lat, lon) });
    }

    // Rotation qui amène le centre de l'Afrique (0°N, 20°E) face au regard.
    // On oscille autour de cette valeur au lieu de tourner en continu : le
    // continent doit rester visible et reconnaissable en permanence.
    const AFRICA_FACING = -1.221;
    const SWING = 0.34;
    let t = 0;
    let rot = AFRICA_FACING;
    let raf = 0;
    let visible = true;

    const R = SIZE * 0.38;
    const cx = SIZE / 2;
    const cy = SIZE / 2;

    const draw = () => {
      if (!visible) return;
      ctx.clearRect(0, 0, SIZE, SIZE);
      t += 0.0022;
      rot = AFRICA_FACING + Math.sin(t) * SWING;

      // halo
      const halo = ctx.createRadialGradient(cx, cy, R * 0.5, cx, cy, R * 1.35);
      halo.addColorStop(0, "rgba(46,95,183,0.10)");
      halo.addColorStop(1, "rgba(46,95,183,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, SIZE, SIZE);

      const cos = Math.cos(rot);
      const sin = Math.sin(rot);
      const tilt = -0.35;
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);

      for (const d of dots) {
        // rotation autour de Y puis inclinaison
        const x1 = d.x * cos + d.z * sin;
        const z1 = -d.x * sin + d.z * cos;
        const y2 = d.y * cosT - z1 * sinT;
        const z2 = d.y * sinT + z1 * cosT;

        if (z2 < -0.15) continue; // face cachée
        const depth = (z2 + 1) / 2;
        const px = cx + x1 * R;
        const py = cy - y2 * R;

        if (d.africa) {
          ctx.fillStyle = `rgba(255, 155, 69, ${0.25 + depth * 0.75})`;
          ctx.shadowColor = "rgba(255,155,69,0.8)";
          ctx.shadowBlur = 6 * depth;
          ctx.beginPath();
          ctx.arc(px, py, 1.5 + depth * 1.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = `rgba(154, 167, 199, ${0.05 + depth * 0.22})`;
          ctx.beginPath();
          ctx.arc(px, py, 0.8 + depth * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        cancelAnimationFrame(raf);
        if (visible) raf = requestAnimationFrame(draw);
      },
      { threshold: 0.05 }
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="h-full w-full max-w-[460px]"
      style={{ aspectRatio: "1 / 1" }}
      role="img"
      aria-label="Planète numérique mettant l'Afrique en lumière"
    />
  );
}
