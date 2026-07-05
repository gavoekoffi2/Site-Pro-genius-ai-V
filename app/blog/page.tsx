import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";
import { blogPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Blog IA",
  description:
    "Analyses, guides pratiques et vision sur l'intelligence artificielle en Afrique, par l'équipe Pro Genius AI.",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export default function BlogPage() {
  const [featured, ...rest] = blogPosts;

  return (
    <>
      <PageHero
        eyebrow="Blog IA"
        title="L'intelligence, décryptée."
        sub="Vision, guides pratiques et coulisses de la construction d'un écosystème IA africain."
      />

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-28 md:px-8">
        {/* Article à la une */}
        <Reveal>
          <TiltCard className="rounded-3xl">
            <Link
              href={`/blog/${featured.slug}`}
              className="glass-deep group block overflow-hidden rounded-3xl p-9 transition-colors duration-500 hover:border-cyan/25 md:p-14"
            >
              <div className="flex flex-wrap items-center gap-4 font-display text-[11px] uppercase tracking-[0.26em] text-mist/70">
                <span className="rounded-full border border-cyan/25 bg-cyan/5 px-3 py-1 text-cyan">
                  {featured.category}
                </span>
                <span>{formatDate(featured.date)}</span>
                <span>·</span>
                <span>{featured.readTime} de lecture</span>
              </div>
              <h2 className="font-display mt-6 max-w-3xl text-balance text-3xl font-semibold leading-tight tracking-tight text-frost md:text-5xl">
                {featured.title}
              </h2>
              <p className="mt-5 max-w-2xl text-pretty leading-relaxed text-mist">{featured.excerpt}</p>
              <span className="link-arrow mt-7">
                Lire l'article
                <ArrowRight size={15} strokeWidth={2.2} />
              </span>
            </Link>
          </TiltCard>
        </Reveal>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {rest.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.08}>
              <TiltCard className="h-full rounded-3xl">
                <Link
                  href={`/blog/${post.slug}`}
                  className="glass-deep group flex h-full flex-col gap-4 rounded-3xl p-8 transition-colors duration-500 hover:border-cyan/25"
                >
                  <div className="flex flex-wrap items-center gap-3 font-display text-[10px] uppercase tracking-[0.24em] text-mist/70">
                    <span className="rounded-full border border-cyan/25 bg-cyan/5 px-2.5 py-0.5 text-cyan">
                      {post.category}
                    </span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="font-display text-balance text-xl font-semibold leading-snug tracking-tight text-frost">
                    {post.title}
                  </h2>
                  <p className="flex-1 text-sm leading-relaxed text-mist">{post.excerpt}</p>
                  <span className="text-xs text-mist/60">{formatDate(post.date)}</span>
                </Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
