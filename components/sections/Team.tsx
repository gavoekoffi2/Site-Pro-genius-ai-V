import { getDictionary } from "@/lib/i18n";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";

const dict = getDictionary();

const avatarGradients = [
  "from-[#ff9b45] to-[#c95f14]",
  "from-[#5d8ce0] to-[#2e5fb7]",
  "from-[#ffb066] to-[#5d8ce0]",
  "from-[#2e5fb7] to-[#e8761f]",
  "from-[#ffc061] to-[#e05a1a]",
  "from-[#e8761f] to-[#1b3a75]",
];

export default function Team() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-40">
      <SectionHeading eyebrow={dict.team.eyebrow} title={dict.team.title} sub={dict.team.sub} />

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dict.team.members.map((m, i) => (
          <Reveal key={m.name} delay={i * 0.08}>
            <TiltCard className="rounded-3xl">
              <div className="glass-deep group relative overflow-hidden rounded-3xl p-8 text-center transition-colors duration-500 hover:border-white/20">
                {/* Fond animé de la carte */}
                <div
                  className="animate-aurora pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100"
                  style={{ background: "radial-gradient(circle, rgba(255,155,69,0.16), transparent 70%)" }}
                  aria-hidden
                />

                {/* Photo ronde (avatar monogramme) */}
                <div className="relative mx-auto h-24 w-24">
                  <div
                    className={`absolute -inset-1 rounded-full bg-gradient-to-br ${avatarGradients[i % avatarGradients.length]} opacity-70 blur-[6px] transition-all duration-700 group-hover:opacity-100 group-hover:blur-[10px]`}
                    aria-hidden
                  />
                  <div
                    className={`relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${avatarGradients[i % avatarGradients.length]} font-display text-2xl font-semibold text-[#04060f] transition-transform duration-700 group-hover:scale-105`}
                  >
                    {m.initials}
                  </div>
                </div>

                <h3 className="font-display mt-6 text-xl font-semibold tracking-tight text-frost">
                  {m.name}
                </h3>
                <p className="font-display mt-1 text-sm text-ember">{m.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-mist">{m.focus}</p>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
