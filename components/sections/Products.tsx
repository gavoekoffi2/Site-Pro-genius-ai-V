"use client";

import { useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Clock3, ExternalLink, Layers3, Monitor, Sparkles } from "lucide-react";
import { deployedProjects, inProgressProjects, type ProjectShowcase } from "@/lib/data";

type Filter = "all" | "ai" | "website";

const allProjects = [...deployedProjects, ...inProgressProjects];

const filters: { value: Filter; label: string; icon: typeof Layers3 }[] = [
  { value: "all", label: "Toutes les réalisations", icon: Layers3 },
  { value: "ai", label: "Solutions IA", icon: Sparkles },
  { value: "website", label: "Sites web", icon: Monitor },
];

function ProjectCard({ project, index }: { project: ProjectShowcase; index: number }) {
  const featured = index === 0;
  const columnClass = featured
    ? "md:col-span-12"
    : index < 3
      ? "md:col-span-6"
      : "md:col-span-6 xl:col-span-4";

  const content = (
    <article
      className={`project-card group relative h-full overflow-hidden rounded-[1.5rem] border border-white/[0.09] bg-[#07111b]/95 shadow-[0_30px_100px_rgba(0,0,0,.32)] transition duration-700 hover:-translate-y-1 hover:border-[#5D9CBB]/45 hover:shadow-[0_35px_120px_rgba(21,63,107,.26)] ${featured ? "xl:grid xl:grid-cols-[minmax(0,1.45fr)_minmax(20rem,.55fr)]" : ""}`}
      style={{
        "--project-accent": project.accent,
        "--preview-rest": featured ? "32rem" : "24rem",
      } as CSSProperties}
    >
      <div className={`relative overflow-hidden bg-[#06101a] ${featured ? "h-[24rem] xl:h-[32rem]" : "h-[23rem] md:h-[24rem]"}`}>
        {project.preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.preview}
              alt={`Aperçu du projet ${project.name}`}
              className="project-preview-image absolute left-0 top-0 h-auto w-full"
              loading={index < 2 ? "eager" : "lazy"}
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

        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/15 bg-[#06101a]/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d6e7ed] backdrop-blur-xl md:left-5 md:top-5">
          {project.kind === "ai" ? <Sparkles className="h-3 w-3 text-[#ACCFD6]" /> : <Monitor className="h-3 w-3 text-[#C5936E]" />}
          {project.kind === "ai" ? "Solution IA" : "Site web"}
        </div>

        <div className={`absolute right-4 top-4 flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] backdrop-blur-xl md:right-5 md:top-5 ${project.status === "deployed" ? "border-emerald-400/25 bg-[#06101a]/85 text-emerald-300" : "border-[#C5936E]/30 bg-[#120d0a]/85 text-[#d9ad89]"}`}>
          {project.status === "deployed" ? <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" /> : <Clock3 className="h-3 w-3" />}
          {project.status === "deployed" ? "En ligne" : "En construction"}
        </div>

        {project.preview && (
          <span className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-[#06101a]/85 px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-white/70 backdrop-blur-xl md:left-5">
            Survolez pour explorer
          </span>
        )}
      </div>

      <div className={`relative flex flex-col p-6 md:p-8 ${featured ? "xl:justify-between xl:p-10" : ""}`}>
        <div>
          <div className="mb-5 flex items-center justify-between gap-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#5D9CBB]">{project.category}</span>
            <span className="font-display text-xs text-white/25">{String(index + 1).padStart(2, "0")}</span>
          </div>
          <h3 className={`font-display font-medium leading-none tracking-[-0.04em] text-white ${featured ? "text-4xl md:text-5xl xl:text-[3.4rem]" : "text-3xl"}`}>
            {project.name}
          </h3>
          <p className={`mt-4 max-w-xl leading-relaxed text-[#b3c4d1] ${featured ? "text-base md:text-lg" : "text-sm"}`}>{project.tagline}</p>
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
      className={`col-span-12 h-full ${columnClass}`}
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
