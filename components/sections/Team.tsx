import { getDictionary } from "@/lib/i18n";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const dict = getDictionary();

export default function Team() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-40">
      <SectionHeading eyebrow={dict.team.eyebrow} title={dict.team.title} sub={dict.team.sub} />

      <div className="mt-16 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        <Reveal>
          <article className="glass-deep relative flex h-full min-h-[360px] flex-col justify-between overflow-hidden rounded-[2rem] border border-white/[0.09] p-8 md:p-11">
            <div className="animate-aurora pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-ember/10 blur-3xl" aria-hidden />
            <div className="relative flex items-center gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-ember/30 bg-gradient-to-br from-ember to-[#6bd3c8] font-display text-2xl font-semibold text-[#04100f] shadow-[0_18px_55px_rgba(232,118,31,0.18)]">
                {dict.team.founder.initials}
              </div>
              <div>
                <p className="font-display text-xs uppercase tracking-[0.3em] text-ember">Leadership</p>
                <h3 className="font-display mt-2 text-2xl font-semibold tracking-tight text-frost md:text-3xl">
                  {dict.team.founder.name}
                </h3>
                <p className="mt-1 text-sm text-[#8fd8cf]">{dict.team.founder.role}</p>
              </div>
            </div>
            <blockquote className="relative mt-12 max-w-xl font-display text-xl leading-relaxed text-frost/90 md:text-2xl">
              « {dict.team.founder.focus} »
            </blockquote>
          </article>
        </Reveal>

        <div className="grid gap-4">
          {dict.team.expertise.map((item, i) => (
            <Reveal key={item.number} delay={0.08 + i * 0.08}>
              <article className="glass group grid grid-cols-[auto_1fr] gap-5 rounded-3xl border border-white/[0.07] p-6 transition-colors duration-500 hover:border-[#6bd3c8]/25 md:p-7">
                <span className="font-display text-xs tracking-[0.25em] text-ember/80">{item.number}</span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-frost">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{item.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
