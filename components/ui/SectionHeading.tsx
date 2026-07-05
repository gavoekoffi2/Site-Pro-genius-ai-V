import Reveal from "./Reveal";

/** En-tête de section : eyebrow lumineux + titre géant + sous-titre aéré. */
export default function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  align?: "center" | "left";
}) {
  const alignCls = align === "center" ? "items-center text-center" : "items-start text-left";
  return (
    <div className={`flex flex-col gap-6 ${alignCls}`}>
      <Reveal>
        <span className="inline-flex items-center gap-2.5 rounded-full border border-cyan/20 bg-cyan/5 px-4 py-1.5 font-display text-[11px] font-medium uppercase tracking-[0.3em] text-cyan-soft">
          <span className="h-1 w-1 rounded-full bg-cyan shadow-[0_0_8px_#38e1ff]" />
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="font-display max-w-4xl text-balance text-4xl font-semibold leading-[1.06] tracking-tight text-frost md:text-6xl">
          {title}
        </h2>
      </Reveal>
      {sub && (
        <Reveal delay={0.2}>
          <p className="max-w-2xl text-pretty text-base leading-relaxed text-mist md:text-lg">{sub}</p>
        </Reveal>
      )}
    </div>
  );
}
