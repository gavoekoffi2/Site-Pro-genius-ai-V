"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import Reveal from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";

const dict = getDictionary();

/**
 * Sphère énergétique : elle pulse, respire, et se déforme
 * vers le curseur quand on l'approche.
 */
function EnergySphere() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SIZE = 640;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = SIZE / 2;
    const cy = SIZE / 2;
    const mouse = { x: 0, y: 0, active: 0 };
    let raf = 0;
    let visible = true;
    let t = 0;

    const draw = () => {
      if (!visible) return;
      t += 0.012;
      ctx.clearRect(0, 0, SIZE, SIZE);

      const breath = 1 + Math.sin(t * 1.4) * 0.045;
      const baseR = SIZE * 0.21 * breath;

      // attraction vers la souris
      const pullX = mouse.x * mouse.active * 26;
      const pullY = mouse.y * mouse.active * 26;

      // halo extérieur
      const outer = ctx.createRadialGradient(cx + pullX, cy + pullY, baseR * 0.4, cx + pullX, cy + pullY, baseR * 2.6);
      outer.addColorStop(0, `rgba(255,155,69,${0.14 + mouse.active * 0.08})`);
      outer.addColorStop(0.5, "rgba(46,95,183,0.07)");
      outer.addColorStop(1, "rgba(46,95,183,0)");
      ctx.fillStyle = outer;
      ctx.fillRect(0, 0, SIZE, SIZE);

      // corps de la sphère : blob organique
      ctx.beginPath();
      const points = 90;
      for (let i = 0; i <= points; i++) {
        const a = (i / points) * Math.PI * 2;
        const wobble =
          Math.sin(a * 3 + t * 2) * 6 +
          Math.sin(a * 5 - t * 1.6) * 4 +
          Math.sin(a * 8 + t * 2.6) * 2.4 * (1 + mouse.active);
        const toMouse = Math.cos(a) * mouse.x + Math.sin(a) * mouse.y;
        const r = baseR + wobble + Math.max(0, toMouse) * mouse.active * 34;
        const x = cx + pullX * 0.4 + Math.cos(a) * r;
        const y = cy + pullY * 0.4 + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      const body = ctx.createRadialGradient(
        cx + pullX * 0.4 - baseR * 0.3, cy + pullY * 0.4 - baseR * 0.35, baseR * 0.1,
        cx + pullX * 0.4, cy + pullY * 0.4, baseR * 1.25
      );
      body.addColorStop(0, "rgba(255,240,220,0.88)");
      body.addColorStop(0.35, "rgba(255,160,80,0.5)");
      body.addColorStop(0.75, "rgba(200,95,25,0.2)");
      body.addColorStop(1, "rgba(46,95,183,0.07)");
      ctx.fillStyle = body;
      ctx.fill();

      // anneaux d'énergie — orange dominant, un souffle de bleu
      for (let ring = 0; ring < 3; ring++) {
        const phase = (t * 0.5 + ring / 3) % 1;
        const rr = baseR * (1.05 + phase * 1.5);
        ctx.beginPath();
        ctx.arc(cx + pullX * 0.55, cy + pullY * 0.55, rr, 0, Math.PI * 2);
        ctx.strokeStyle =
          ring === 1
            ? `rgba(93,140,224,${(1 - phase) * 0.12})`
            : `rgba(255,155,69,${(1 - phase) * 0.16})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // filaments internes
      ctx.globalCompositeOperation = "lighter";
      for (let f = 0; f < 5; f++) {
        ctx.beginPath();
        for (let i = 0; i <= 40; i++) {
          const a = (i / 40) * Math.PI * 2;
          const r = baseR * (0.35 + f * 0.12) + Math.sin(a * 4 + t * (1.5 + f * 0.4)) * 8;
          const x = cx + pullX * 0.4 + Math.cos(a + t * (0.3 + f * 0.12)) * r;
          const y = cy + pullY * 0.4 + Math.sin(a + t * (0.3 + f * 0.12)) * r * 0.6;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(255,192,138,${0.05 + mouse.active * 0.05})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
      ctx.globalCompositeOperation = "source-over";

      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
      const dist = Math.sqrt(nx * nx + ny * ny);
      mouse.x = nx;
      mouse.y = ny;
      mouse.active += ((dist < 1.15 ? 1 - Math.min(dist / 1.15, 1) * 0.4 : 0) - mouse.active) * 0.12;
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
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute left-1/2 top-1/2 w-[min(90vw,640px)] -translate-x-1/2 -translate-y-1/2"
      style={{ aspectRatio: "1 / 1" }}
      aria-hidden
    />
  );
}

export default function FinalCTA() {
  return (
    <section className="relative z-10 overflow-hidden py-32 md:py-48">
      <div className="relative mx-auto flex min-h-[560px] max-w-5xl items-center justify-center px-5">
        <EnergySphere />

        <div className="relative z-10 flex flex-col items-center gap-7 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-ember/20 bg-[#0b0806]/60 px-4 py-1.5 font-display text-[11px] uppercase tracking-[0.3em] text-ember-soft backdrop-blur-md">
              <span className="h-1 w-1 rounded-full bg-ember shadow-[0_0_8px_#ff9b45]" />
              {dict.cta.eyebrow}
            </span>
          </Reveal>
          <Reveal delay={0.12}>
            <h2 className="font-display max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-frost md:text-6xl">
              {dict.cta.title}
            </h2>
          </Reveal>
          <Reveal delay={0.22}>
            <p className="max-w-xl text-pretty text-mist md:text-lg">{dict.cta.sub}</p>
          </Reveal>
          <Reveal delay={0.32}>
            <MagneticButton href="/contact" className="!px-9 !py-4 text-lg">
              {dict.cta.button}
              <ArrowUpRight size={19} strokeWidth={2.4} />
            </MagneticButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
