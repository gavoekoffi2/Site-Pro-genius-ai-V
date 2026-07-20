"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Silhouette simplifiée, mais reconnaissable, du continent africain.
const AFRICA: [number, number][] = [
  [36, -6], [37, 10], [33, 22], [31, 32], [23, 36], [13, 43], [12, 51],
  [2, 45], [-11, 41], [-16, 39], [-26, 33], [-35, 20], [-29, 15], [-18, 11],
  [-5, 9], [4, 9], [5, 3], [10, -14], [21, -17], [29, -11], [36, -6],
];

const HUBS = [
  { lat: 6.13, lon: 1.22 }, // Lomé
  { lat: 5.56, lon: -0.2 }, // Accra
  { lat: 6.52, lon: 3.38 }, // Lagos
  { lat: -1.29, lon: 36.82 }, // Nairobi
  { lat: -26.2, lon: 28.04 }, // Johannesburg
  { lat: 30.04, lon: 31.24 }, // Cairo
];

function inAfrica(lat: number, lon: number) {
  let inside = false;
  for (let i = 0, j = AFRICA.length - 1; i < AFRICA.length; j = i++) {
    const [yi, xi] = AFRICA[i];
    const [yj, xj] = AFRICA[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function project(lat: number, lon: number, centerLon: number, radius: number, cx: number, cy: number) {
  const phi = (lat * Math.PI) / 180;
  const lambda = ((lon - centerLon) * Math.PI) / 180;
  const visible = Math.cos(phi) * Math.cos(lambda) > -0.04;
  return {
    x: cx + radius * Math.cos(phi) * Math.sin(lambda),
    y: cy - radius * Math.sin(phi),
    z: Math.cos(phi) * Math.cos(lambda),
    visible,
  };
}

export default function DigitalGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 520;
    let height = 520;
    let raf = 0;
    let visible = true;
    let start = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(300, rect.width);
      height = Math.max(300, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now: number) => {
      if (!visible) return;
      const t = reduced ? 0 : (now - start) / 1000;
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.365;
      // L'Afrique reste toujours face au visiteur ; seule une respiration orbitale anime la planète.
      const centerLon = 17 + Math.sin(t * 0.22) * 5.5;
      ctx.clearRect(0, 0, width, height);

      const outer = ctx.createRadialGradient(cx, cy, radius * 0.28, cx, cy, radius * 1.42);
      outer.addColorStop(0, "rgba(26,111,153,.16)");
      outer.addColorStop(0.62, "rgba(7,66,93,.10)");
      outer.addColorStop(1, "rgba(2,8,13,0)");
      ctx.fillStyle = outer;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();
      const sphere = ctx.createRadialGradient(cx - radius * 0.36, cy - radius * 0.42, radius * 0.08, cx, cy, radius * 1.08);
      sphere.addColorStop(0, "rgba(41,137,174,.24)");
      sphere.addColorStop(0.48, "rgba(7,35,53,.74)");
      sphere.addColorStop(1, "rgba(1,8,14,.98)");
      ctx.fillStyle = sphere;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      // Grille géodésique : méridiens et latitudes donnent une vraie profondeur 3D.
      ctx.lineWidth = 0.7;
      for (let lat = -60; lat <= 60; lat += 20) {
        ctx.beginPath();
        let begun = false;
        for (let lon = -180; lon <= 180; lon += 3) {
          const p = project(lat, lon, centerLon, radius, cx, cy);
          if (!p.visible) { begun = false; continue; }
          if (!begun) { ctx.moveTo(p.x, p.y); begun = true; } else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = "rgba(91,165,192,.11)";
        ctx.stroke();
      }
      for (let lon = -160; lon <= 180; lon += 20) {
        ctx.beginPath();
        let begun = false;
        for (let lat = -88; lat <= 88; lat += 2) {
          const p = project(lat, lon, centerLon, radius, cx, cy);
          if (!p.visible) { begun = false; continue; }
          if (!begun) { ctx.moveTo(p.x, p.y); begun = true; } else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = "rgba(91,165,192,.09)";
        ctx.stroke();
      }

      // Nuage de données mondial, discret derrière l'Afrique.
      for (let lat = -82; lat <= 82; lat += 5.2) {
        for (let lon = -180; lon < 180; lon += 5.8) {
          const p = project(lat, lon, centerLon, radius, cx, cy);
          if (!p.visible || inAfrica(lat, lon)) continue;
          const alpha = 0.035 + Math.max(0, p.z) * 0.14;
          ctx.fillStyle = `rgba(138,190,207,${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 0.55 + Math.max(0, p.z) * 0.55, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Masse lumineuse et contour de l'Afrique, fixés sur la sphère.
      ctx.beginPath();
      AFRICA.forEach(([lat, lon], i) => {
        const p = project(lat, lon, centerLon, radius, cx, cy);
        if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      const africaGlow = ctx.createLinearGradient(cx - radius * 0.2, cy - radius * 0.55, cx + radius * 0.28, cy + radius * 0.58);
      africaGlow.addColorStop(0, "rgba(117,228,218,.34)");
      africaGlow.addColorStop(0.52, "rgba(38,120,157,.31)");
      africaGlow.addColorStop(1, "rgba(196,115,56,.34)");
      ctx.fillStyle = africaGlow;
      ctx.shadowColor = "rgba(89,222,210,.72)";
      ctx.shadowBlur = 23 + Math.sin(t * 1.4) * 4;
      ctx.fill();
      ctx.lineWidth = 1.7;
      ctx.strokeStyle = "rgba(154,244,229,.9)";
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Points IA à l'intérieur du continent.
      for (let lat = -33; lat <= 36; lat += 3.6) {
        for (let lon = -17; lon <= 51; lon += 3.8) {
          if (!inAfrica(lat, lon)) continue;
          const p = project(lat, lon, centerLon, radius, cx, cy);
          const pulse = 0.72 + 0.28 * Math.sin(t * 2.2 + lat * 0.19 + lon * 0.13);
          ctx.fillStyle = `rgba(194,241,232,${0.34 + pulse * 0.54})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 0.75 + pulse * 0.75, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Réseau continental : liaisons animées entre les hubs africains.
      const projectedHubs = HUBS.map((h) => project(h.lat, h.lon, centerLon, radius, cx, cy));
      projectedHubs.slice(1).forEach((hub, i) => {
        const origin = projectedHubs[0];
        const mx = (origin.x + hub.x) / 2;
        const my = Math.min(origin.y, hub.y) - radius * (0.08 + i * 0.012);
        ctx.beginPath();
        ctx.moveTo(origin.x, origin.y);
        ctx.quadraticCurveTo(mx, my, hub.x, hub.y);
        ctx.strokeStyle = `rgba(111,229,214,${0.24 + 0.16 * Math.sin(t * 1.7 + i)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
      projectedHubs.forEach((hub, i) => {
        const pulse = 1 + Math.sin(t * 2.5 + i) * 0.25;
        ctx.fillStyle = i === 0 ? "#f2b77d" : "#9ff3e7";
        ctx.shadowColor = i === 0 ? "rgba(232,118,31,.9)" : "rgba(91,228,213,.9)";
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, (i === 0 ? 3.1 : 2.1) * pulse, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;
      ctx.restore();

      // Atmosphère, limbe et orbites extérieures.
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(128,224,220,.42)";
      ctx.lineWidth = 1.15;
      ctx.shadowColor = "rgba(58,173,186,.55)";
      ctx.shadowBlur = 16;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.26 + t * 0.025);
      ctx.scale(1, 0.34);
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.22, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(109,207,205,.25)";
      ctx.lineWidth = 1;
      ctx.stroke();
      const satelliteAngle = t * 0.44;
      ctx.fillStyle = "#d8f7f1";
      ctx.shadowColor = "rgba(105,238,222,.9)";
      ctx.shadowBlur = 13;
      ctx.beginPath();
      ctx.arc(Math.cos(satelliteAngle) * radius * 1.22, Math.sin(satelliteAngle) * radius * 1.22, 2.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      raf = requestAnimationFrame(draw);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) { start = performance.now(); raf = requestAnimationFrame(draw); }
    }, { threshold: 0.02 });
    observer.observe(canvas);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, [reduced]);

  return (
    <div className="relative aspect-square w-full max-w-[620px]" data-digital-globe>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" role="img" aria-label="Globe numérique tridimensionnel mettant l'Afrique au premier plan" />

      <motion.div
        className="absolute left-[6%] top-[17%] rounded-lg border border-[#72d9d1]/20 bg-[#041018]/72 px-3 py-2 backdrop-blur-xl"
        animate={reduced ? undefined : { y: [0, -7, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="block text-[8px] font-semibold uppercase tracking-[0.24em] text-[#72d9d1]/60">Position orbitale</span>
        <span className="mt-1 block font-mono text-[10px] text-[#d8f7f1]">AFR · 08°N / 01°E</span>
      </motion.div>

      <motion.div
        className="absolute bottom-[13%] right-[2%] min-w-36 rounded-xl border border-[#c58b61]/20 bg-[#080f14]/78 p-3 backdrop-blur-xl"
        animate={reduced ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 6.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between gap-4">
          <span className="text-[8px] uppercase tracking-[0.2em] text-white/45">Africa core</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_#6ee7b7]" />
        </div>
        <div className="mt-2 flex items-end gap-1">
          {[42, 64, 50, 82, 58, 92, 68].map((height, i) => (
            <motion.span key={i} className="w-2 rounded-sm bg-gradient-to-t from-[#1d6381] to-[#84e8dd]" style={{ height }} animate={reduced ? undefined : { scaleY: [0.72, 1, 0.78] }} transition={{ duration: 1.8 + i * 0.13, repeat: Infinity, delay: i * 0.11 }} />
          ))}
        </div>
      </motion.div>

      <div className="pointer-events-none absolute inset-[8%] rounded-full border border-white/[0.04]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[73%] w-[73%] -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_110px_rgba(42,149,170,.19)]" />
    </div>
  );
}
