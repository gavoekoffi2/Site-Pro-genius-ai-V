import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/ContactForm";
import { getDictionary } from "@/lib/i18n";

const dict = getDictionary();

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez Pro Genius AI : entreprises, startups, investisseurs, gouvernements, créateurs et partenaires. Parlons de ce que l'IA peut faire pour vous.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow={dict.contact.eyebrow} title={dict.contact.title} sub={dict.contact.sub} />

      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-32 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <Reveal>
            <ContactForm />
          </Reveal>

          <div className="flex flex-col gap-6">
            <Reveal delay={0.12}>
              <div className="glass rounded-3xl p-8">
                <h2 className="font-display text-sm uppercase tracking-[0.26em] text-mist/70">
                  {dict.contact.direct.title}
                </h2>
                <a
                  href={`mailto:${dict.contact.direct.email}`}
                  className="mt-5 flex items-center gap-3.5 text-frost transition-colors hover:text-cyan"
                >
                  <span className="glass flex h-11 w-11 items-center justify-center rounded-full text-cyan">
                    <Mail size={17} />
                  </span>
                  <span className="font-display">{dict.contact.direct.email}</span>
                </a>
                <p className="mt-5 flex items-start gap-3.5 text-sm leading-relaxed text-mist">
                  <span className="glass flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-cyan">
                    <MapPin size={17} />
                  </span>
                  {dict.contact.direct.location}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="glass-deep relative overflow-hidden rounded-3xl p-8">
                <div
                  className="animate-aurora pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full blur-3xl"
                  style={{ background: "radial-gradient(circle, rgba(56,225,255,0.13), transparent 70%)" }}
                  aria-hidden
                />
                <p className="font-display relative text-lg leading-relaxed text-frost/90">
                  « Si leur site est déjà à ce niveau, imaginez la qualité de leurs solutions
                  d'intelligence artificielle. »
                </p>
                <p className="relative mt-4 text-sm text-mist">
                  — C'est exactement l'effet que nous produirons pour vos clients.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
