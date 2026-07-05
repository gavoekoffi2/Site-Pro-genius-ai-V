import { getDictionary } from "@/lib/i18n";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Counter from "@/components/ui/Counter";

const dict = getDictionary();

export default function Stats() {
  return (
    <section className="relative z-10 py-28 md:py-40">
      {/* Bande lumineuse traversante */}
      <div className="hairline" aria-hidden />
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <SectionHeading eyebrow={dict.stats.eyebrow} title={dict.stats.title} />

        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-4">
          {dict.stats.items.map((s, i) => (
            <div key={s.label} className="bg-[#05070f]/90 p-10 text-center">
              <Reveal delay={i * 0.1}>
                <p className="font-display text-5xl font-semibold tracking-tight text-gradient md:text-6xl">
                  <Counter value={s.value} suffix={s.suffix} duration={1.6 + i * 0.3} />
                </p>
                <p className="mx-auto mt-4 max-w-[210px] text-sm leading-relaxed text-mist">{s.label}</p>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
      <div className="hairline" aria-hidden />
    </section>
  );
}
