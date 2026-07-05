import Reveal from "@/components/ui/Reveal";

/** En-tête cinématique des pages intérieures. */
export default function PageHero({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <header className="relative overflow-hidden pb-16 pt-40 md:pb-24 md:pt-52">
      <div
        className="animate-aurora pointer-events-none absolute left-1/2 top-0 h-[60vmin] w-[100vmin] -translate-x-1/2 -translate-y-1/3 rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(47,107,255,0.13), rgba(56,225,255,0.04) 45%, transparent 70%)" }}
        aria-hidden
      />
      <div className="grid-veil pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-6 px-5 text-center md:px-8">
        <Reveal>
          <span className="inline-flex items-center gap-2.5 rounded-full border border-cyan/20 bg-cyan/5 px-4 py-1.5 font-display text-[11px] font-medium uppercase tracking-[0.3em] text-cyan-soft">
            <span className="h-1 w-1 rounded-full bg-cyan shadow-[0_0_8px_#38e1ff]" />
            {eyebrow}
          </span>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-display max-w-4xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-frost md:text-7xl">
            {title}
          </h1>
        </Reveal>
        {sub && (
          <Reveal delay={0.2}>
            <p className="max-w-2xl text-pretty text-base leading-relaxed text-mist md:text-lg">{sub}</p>
          </Reveal>
        )}
      </div>
    </header>
  );
}
