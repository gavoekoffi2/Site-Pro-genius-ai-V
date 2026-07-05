import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";
import ServiceIcon from "@/components/ServiceIcon";
import FinalCTA from "@/components/sections/FinalCTA";
import { services } from "@/lib/data";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: service.name,
    description: `${service.short} ${service.description}`,
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  return (
    <>
      <header className="relative overflow-hidden pb-16 pt-40 md:pb-20 md:pt-52">
        <div
          className="animate-aurora pointer-events-none absolute left-1/2 top-0 h-[60vmin] w-[100vmin] -translate-x-1/2 -translate-y-1/3 rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(224,118,40,0.14), rgba(46,95,183,0.05) 50%, transparent 72%)" }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-4xl px-5 text-center md:px-8">
          <Reveal>
            <Link href="/services" className="link-arrow mb-10 inline-flex !text-mist hover:!text-ember">
              <ArrowLeft size={15} />
              Tous les services
            </Link>
          </Reveal>
          <Reveal delay={0.08}>
            <span className="glass mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-2xl text-ember ring-glow">
              <ServiceIcon name={service.icon} size={28} />
            </span>
          </Reveal>
          <Reveal delay={0.14}>
            <h1 className="font-display mt-8 text-balance text-4xl font-semibold tracking-tight text-frost md:text-6xl">
              {service.name}
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="font-display mt-5 text-xl text-frost/85">{service.short}</p>
          </Reveal>
          <Reveal delay={0.26}>
            <p className="mx-auto mt-5 max-w-2xl text-pretty leading-relaxed text-mist">
              {service.description}
            </p>
          </Reveal>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-4xl px-5 py-12 md:px-8 md:py-20">
        <Reveal>
          <h2 className="font-display text-center text-sm uppercase tracking-[0.3em] text-mist/70">
            Ce que nous livrons
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {service.deliverables.map((d, i) => (
            <Reveal key={d} delay={i * 0.07}>
              <div className="glass flex items-start gap-4 rounded-2xl p-6 transition-colors duration-500 hover:border-ember/25">
                <span className="glass mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full">
                  <Check size={13} className="text-ember" strokeWidth={3} />
                </span>
                <p className="text-sm leading-relaxed text-frost/85">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3} className="mt-14 flex justify-center">
          <MagneticButton href="/contact">
            Discuter de votre projet
            <ArrowUpRight size={17} strokeWidth={2.4} />
          </MagneticButton>
        </Reveal>
      </section>

      <FinalCTA />
    </>
  );
}
