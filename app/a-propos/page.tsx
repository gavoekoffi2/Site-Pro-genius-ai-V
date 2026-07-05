import type { Metadata } from "next";
import { Eye, Globe2, Rocket, ShieldCheck, Sparkles, Users } from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import FinalCTA from "@/components/sections/FinalCTA";
import DigitalGlobe from "@/components/sections/DigitalGlobe";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Pro Genius AI est une startup africaine d'intelligence artificielle. Notre mission : augmenter les capacités humaines et permettre aux entreprises africaines de travailler plus vite, plus intelligemment, avec plus de puissance.",
};

const values = [
  {
    icon: Sparkles,
    title: "L'humain d'abord",
    text: "L'IA n'a de valeur que si elle rend les personnes plus capables. Chaque produit part d'un humain à augmenter, jamais d'une technologie à placer.",
  },
  {
    icon: Rocket,
    title: "Ambition sans complexe",
    text: "Nous visons le niveau des meilleures entreprises technologiques du monde — et nous refusons l'idée qu'il faudrait viser moins haut depuis l'Afrique.",
  },
  {
    icon: Globe2,
    title: "Enracinement africain",
    text: "Nos solutions parlent les langues du continent, fonctionnent sur ses réseaux et répondent à ses réalités économiques.",
  },
  {
    icon: ShieldCheck,
    title: "Confiance et rigueur",
    text: "Sécurité des données, transparence des systèmes, fiabilité en production : la confiance se gagne dans les détails.",
  },
  {
    icon: Users,
    title: "Transmission",
    text: "Former des milliers de talents africains à l'IA fait partie de notre mission autant que construire des produits.",
  },
  {
    icon: Eye,
    title: "Vision long terme",
    text: "Nous ne courons pas après les tendances. Nous bâtissons une infrastructure d'intelligence pour les décennies à venir.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="À propos"
        title="Nous construisons l'avenir de l'Afrique grâce à l'IA."
        sub="Pro Genius AI est une startup africaine spécialisée en intelligence artificielle. Nous ne vendons pas seulement des logiciels : nous augmentons les capacités de ceux qui font avancer le continent."
      />

      {/* Mission */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="flex flex-col gap-7">
            <Reveal>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-frost md:text-5xl">
                Notre mission
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-pretty text-lg leading-relaxed text-mist">
                Utiliser l'intelligence artificielle pour{" "}
                <span className="text-frost">augmenter les capacités humaines</span> et permettre aux
                entreprises africaines de travailler{" "}
                <span className="text-gradient-duo font-medium">plus vite, plus intelligemment et avec beaucoup plus de puissance</span>.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-pretty leading-relaxed text-mist">
                Nous créons des SaaS IA, des agents IA, des automatisations, des plateformes, des
                applications, des solutions vocales, des formations et du conseil. Un écosystème complet,
                conçu sur le continent, pour le continent — avec un niveau d'exigence mondial.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.15} direction="left" className="flex justify-center">
            <DigitalGlobe />
          </Reveal>
        </div>
      </section>

      {/* Valeurs */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <SectionHeading
          eyebrow="Nos valeurs"
          title="Ce qui guide chacune de nos décisions."
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.07}>
              <div className="glass-deep group h-full rounded-3xl p-8 transition-all duration-500 hover:border-ember/25 hover:shadow-[0_0_36px_rgba(232,118,31,0.12)]">
                <span className="glass inline-flex h-12 w-12 items-center justify-center rounded-2xl text-ember transition-transform duration-500 group-hover:scale-110">
                  <v.icon size={21} strokeWidth={1.7} />
                </span>
                <h3 className="font-display mt-5 text-xl font-semibold tracking-tight text-frost">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mist">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
