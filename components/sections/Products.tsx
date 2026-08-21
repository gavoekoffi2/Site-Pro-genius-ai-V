"use client";

import { useEffect, useRef, useState, type CSSProperties, type SyntheticEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Clock3, ExternalLink, Layers3, Monitor, Sparkles } from "lucide-react";
import { deployedProjects, inProgressProjects, type ProjectShowcase } from "@/lib/data";

type Filter = "all" | "ai" | "website" | "platform";

const allProjects = [...deployedProjects, ...inProgressProjects];

const filters: { value: Filter; label: string; icon: typeof Layers3 }[] = [
  { value: "all", label: "Toutes les réalisations", icon: Layers3 },
  { value: "ai", label: "Solutions IA", icon: Sparkles },
  { value: "website", label: "Sites web", icon: Monitor },
  { value: "platform", label: "Plateformes métier", icon: Layers3 },
];

function ProjectCard({ project, index }: { project: ProjectShowcase; index: number }) {
  const previewFrameRef = useRef<HTMLDivElement>(null);
  const previewImageRef = useRef<HTMLImageElement>(null);
  const tourFrameRef = useRef<number | null>(null);
  const [previewTour, setPreviewTour] = useState({ active: false, distance: 0, duration: 1.1 });

  const measurePreview = (image?: HTMLImageElement) => {
    const frame = previewFrameRef.current;
    const preview = image ?? previewImageRef.current;
    if (!frame || !preview) return { distance: 0, duration: 1.1 };

    const distance = Math.max(0, preview.getBoundingClientRect().height - frame.clientHeight);
    // Environ 62 px/s : une vraie visite lisible, même sur les pages très longues.
    const duration = Math.min(90, Math.max(12, distance / 62));
    return { distance, duration };
  };

  const startPreviewTour = () => {
    const { distance, duration } = measurePreview();
    if (tourFrameRef.current) window.cancelAnimationFrame(tourFrameRef.current);

    // Deux images navigateur séparent explicitement la position initiale du
    // déplacement. Le navigateur ne peut ainsi jamais sauter directement au bas.
    setPreviewTour({ active: false, distance, duration: 1.15 });
    tourFrameRef.current = window.requestAnimationFrame(() => {
      tourFrameRef.current = window.requestAnimationFrame(() => {
        setPreviewTour({ active: true, distance, duration });
      });
    });
  };

  const resetPreviewTour = () => {
    if (tourFrameRef.current) window.cancelAnimationFrame(tourFrameRef.current);
    setPreviewTour((current) => ({ ...current, active: false, duration: 1.15 }));
  };

  useEffect(() => () => {
    if (tourFrameRef.current) window.cancelAnimationFrame(tourFrameRef.current);
  }, []);

  const handlePreviewLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    if (!previewTour.active) return;
    const { distance, duration } = measurePreview(event.currentTarget);
    setPreviewTour({ active: true, distance, duration });
  };

  const content = (
    <article
      className="project-card group relative h-full overflow-hidden rounded-[1.5rem] border border-white/[0.09] bg-[#07111b]/95 shadow-[0_30px_100px_rgba(0,0,0,.32)] transition duration-700 hover:-translate-y-1 hover:border-[#5D9CBB]/45 hover:shadow-[0_35px_120px_rgba(21,63,107,.26)]"
      onMouseEnter={startPreviewTour}
      onMouseLeave={resetPreviewTour}
      onFocus={startPreviewTour}
      onBlur={resetPreviewTour}
      style={{
        "--project-accent": project.accent,
      } as CSSProperties}
    >
      <div ref={previewFrameRef} className="relative h-[19rem] overflow-hidden bg-[#06101a] sm:h-[21rem] md:h-[22rem]">
        {project.preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={previewImageRef}
              src={project.preview}
              alt={`Aperçu du projet ${project.name}`}
              className="project-preview-image absolute left-0 top-0 h-auto w-full"
              loading={index < 2 ? "eager" : "lazy"}
              onLoad={handlePreviewLoad}
              style={{
                transform: `translate3d(0, ${previewTour.active ? -previewTour.distance : 0}px, 0)`,
                transitionDuration: `${previewTour.duration}s`,
                transitionTimingFunction: previewTour.active ? "linear" : "cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06101a]/95 via-transparent to-black/10" />
            <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100 [background:radial-gradient(circle_at_70%_30%,color-mix(in_srgb,var(--project-accent)_28%,transparent),transparent_50%)]" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_45%,rgba(93,156,187,.22),transparent_42%),linear-gradient(145deg,#07111b,#0b1d2c)]">
            <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(172,207,214,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(172,207,214,.12)_1px,transparent_1px)] [background-size:34px_34px]" />
            <motion.div
              animate={{ rotate: [0, 4, -4, 0], scale: [1, 1.06, 1] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-[#5D9CBB]/25 bg-[#5D9CBB]/10 shadow-[0_0_80px_rgba(93,156,187,.25)]"
            >
              <Sparkles className="h-10 w-10 text-[#ACCFD6]" />
            </motion.div>
          </div>
        )}

        {project.kind === "ai" && (
          <div className={`ai-telemetry ai-telemetry--${index % 3} pointer-events-none absolute inset-0 z-[2] overflow-hidden`} aria-hidden>
            <span className="ai-corner ai-corner--tl" />
            <span className="ai-corner ai-corner--tr" />
            <span className="ai-corner ai-corner--bl" />
            <span className="ai-corner ai-corner--br" />
            <span className="ai-scan-line" />
            <span className="ai-reticle"><i /><i /></span>
            <span className="ai-node ai-node--one" />
            <span className="ai-node ai-node--two" />
            <span className="ai-node ai-node--three" />
            <div className="ai-data-stream font-mono">
              <span>AI_{String(index + 1).padStart(2, "0")}</span>
              <span>NEURAL · ACTIVE</span>
              <span>{index % 2 === 0 ? "INFERENCE 98.7%" : "AGENT ONLINE"}</span>
            </div>
            <div className="ai-waveform">
              {[12, 22, 8, 28, 17, 34, 12, 25, 9, 30].map((height, bar) => (
                <i key={bar} style={{ height, animationDelay: `${bar * -0.12}s` }} />
              ))}
            </div>
          </div>
        )}

        <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-white/15 bg-[#06101a]/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d6e7ed] backdrop-blur-xl md:left-5 md:top-5">
          {project.kind === "ai" ? <Sparkles className="h-3 w-3 text-[#ACCFD6]" /> : project.kind === "platform" ? <Layers3 className="h-3 w-3 text-[#5D9CBB]" /> : <Monitor className="h-3 w-3 text-[#C5936E]" />}
          {project.kind === "ai" ? "Solution IA" : project.kind === "platform" ? "Plateforme métier" : "Site web"}
        </div>

        <div className={`absolute right-4 top-4 z-10 flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] backdrop-blur-xl md:right-5 md:top-5 ${project.status === "deployed" ? "border-emerald-400/25 bg-[#06101a]/85 text-emerald-300" : "border-[#C5936E]/30 bg-[#120d0a]/85 text-[#d9ad89]"}`}>
          {project.status === "deployed" ? <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" /> : <Clock3 className="h-3 w-3" />}
          {project.status === "deployed" ? "En ligne" : "En construction"}
        </div>

        {project.preview && (
          <span className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-[#06101a]/85 px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-white/70 backdrop-blur-xl md:left-5">
            Survolez pour explorer
          </span>
        )}
      </div>

      <div className="relative flex flex-col p-6 md:p-7">
        <div>
          <div className="mb-5 flex items-center justify-between gap-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#5D9CBB]">{project.category}</span>
            <span className="font-display text-xs text-white/25">{String(index + 1).padStart(2, "0")}</span>
          </div>
          <h3 className="font-display text-3xl font-medium leading-none tracking-[-0.04em] text-white">
            {project.name}
          </h3>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#b3c4d1]">{project.tagline}</p>
        </div>

        <div className="mt-8">
          <div className="h-px w-full bg-gradient-to-r from-[#5D9CBB]/55 via-white/10 to-transparent" />
          <p className="mt-5 flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60 transition group-hover:text-[#ACCFD6]">
            <span>{project.url ? "Voir le projet" : "Bientôt disponible"}</span>
            {project.url && (
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition duration-500 group-hover:rotate-45 group-hover:border-[#5D9CBB]/55 group-hover:bg-[#153F6B]">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            )}
          </p>
        </div>
      </div>
    </article>
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: 16, filter: "blur(6px)" }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.055, 0.28), ease: [0.22, 1, 0.36, 1] }}
      className="col-span-12 h-full md:col-span-6 xl:col-span-4"
    >
      {project.url ? (
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Voir le projet ${project.name}`}
          className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5D9CBB] focus-visible:ring-offset-4 focus-visible:ring-offset-[#03070d]"
        >
          {content}
        </a>
      ) : content}
    </motion.div>
  );
}

export default function Products() {
  const [filter, setFilter] = useState<Filter>("all");
  const projects = filter === "all" ? allProjects : allProjects.filter((project) => project.kind === filter);

  return (
    <section id="projets" className="relative z-10 overflow-hidden py-28 md:py-40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#5D9CBB]/35 to-transparent" />
      <div className="pointer-events-none absolute -left-52 top-48 h-[34rem] w-[34rem] rounded-full bg-[#153F6B]/12 blur-[130px]" />
      <div className="pointer-events-none absolute -right-44 top-[38rem] h-[30rem] w-[30rem] rounded-full bg-[#B7561D]/8 blur-[130px]" />

      <div className="relative mx-auto max-w-[88rem] px-5 md:px-8">
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_28rem]">
          <div>
            <div className="mb-6 flex items-center gap-4">
              <span className="font-display text-xs font-medium tracking-[0.26em] text-[#5D9CBB]">01 — PORTFOLIO</span>
              <span className="h-px w-16 bg-gradient-to-r from-[#5D9CBB] to-transparent" />
            </div>
            <h2 className="font-display max-w-5xl text-[clamp(3.6rem,8vw,8rem)] font-medium leading-[0.83] tracking-[-0.065em] text-white">
              Nos <span className="text-gradient">réalisations.</span>
            </h2>
          </div>
          <div className="lg:pb-2">
            <p className="max-w-md text-base leading-relaxed text-[#b3c4d1] md:text-lg">
              Produits intelligents, plateformes métiers et sites institutionnels : un aperçu concret de ce que nous imaginons, concevons et mettons en ligne.
            </p>
            <div className="mt-6 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-white/45">
              <ExternalLink className="h-4 w-4 text-[#C5936E]" />
              Chaque réalisation s&apos;ouvre en direct
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap gap-2 border-y border-white/[0.08] py-4" role="tablist" aria-label="Filtrer les réalisations">
          {filters.map(({ value, label, icon: Icon }) => {
            const count = value === "all" ? allProjects.length : allProjects.filter((project) => project.kind === value).length;
            const active = filter === value;
            return (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(value)}
                className={`relative flex items-center gap-2.5 rounded-full px-4 py-3 text-xs font-semibold transition duration-400 md:px-6 ${active ? "text-white" : "text-white/48 hover:bg-white/[0.04] hover:text-white"}`}
              >
                {active && (
                  <motion.span
                    layoutId="portfolio-filter"
                    className="absolute inset-0 rounded-full border border-[#5D9CBB]/35 bg-[#153F6B]/65 shadow-[0_12px_35px_rgba(21,63,107,.3)]"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <Icon className="relative h-3.5 w-3.5" />
                <span className="relative">{label}</span>
                <span className={`relative rounded-full px-2 py-0.5 text-[9px] ${active ? "bg-white/10 text-[#ACCFD6]" : "bg-white/[0.04] text-white/35"}`}>{count}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="popLayout">
          <motion.div key={filter} className="mt-8 grid grid-cols-12 gap-5 md:gap-7">
            {projects.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
