import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import FinalCTA from "@/components/sections/FinalCTA";
import { blogPosts } from "@/lib/data";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <>
      <article className="relative z-10 mx-auto max-w-3xl px-5 pb-24 pt-40 md:px-8 md:pt-52">
        <Reveal>
          <Link href="/blog" className="link-arrow !text-mist hover:!text-ember">
            <ArrowLeft size={15} />
            Tous les articles
          </Link>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-10 flex flex-wrap items-center gap-4 font-display text-[11px] uppercase tracking-[0.26em] text-mist/70">
            <span className="rounded-full border border-ember/25 bg-ember/5 px-3 py-1 text-ember">
              {post.category}
            </span>
            <span>{formatDate(post.date)}</span>
            <span>·</span>
            <span>{post.readTime} de lecture</span>
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <h1 className="font-display mt-6 text-balance text-3xl font-semibold leading-tight tracking-tight text-frost md:text-5xl">
            {post.title}
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-6 border-l-2 border-ember/40 pl-5 font-display text-lg leading-relaxed text-frost/80">
            {post.excerpt}
          </p>
        </Reveal>

        <div className="mt-10 flex flex-col gap-6">
          {post.content.map((paragraph, i) => (
            <Reveal key={i} delay={0.05}>
              <p className="text-pretty leading-[1.85] text-mist">{paragraph}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="hairline mt-14" />
          <p className="mt-6 text-sm text-mist/70">
            Par l'équipe <span className="text-frost">Pro Genius AI</span> — l'intelligence artificielle
            au service du potentiel humain.
          </p>
        </Reveal>
      </article>

      <FinalCTA />
    </>
  );
}
