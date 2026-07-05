import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import Logo from "./Logo";

const dict = getDictionary();

const columns = [
  {
    title: dict.footer.columns.company,
    links: [
      { href: "/a-propos", label: dict.nav.about },
      { href: "/etudes-de-cas", label: dict.nav.caseStudies },
      { href: "/carrieres", label: dict.nav.careers },
      { href: "/contact", label: dict.nav.contact },
    ],
  },
  {
    title: dict.footer.columns.ecosystem,
    links: [
      { href: "/produits/graphiste-gpt", label: "Graphiste GPT" },
      { href: "/produits/cutforge", label: "CutForge" },
      { href: "/produits/afrivox-ai", label: "AfriVox AI" },
      { href: "/produits/procallai", label: "ProCallAI" },
      { href: "/produits/afritransfert", label: "AfriTransfert" },
    ],
  },
  {
    title: dict.footer.columns.resources,
    links: [
      { href: "/solutions", label: dict.nav.solutions },
      { href: "/services", label: dict.nav.services },
      { href: "/blog", label: dict.nav.blog },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="flex flex-col gap-5">
            <Link href="/" aria-label="Pro Genius AI — Accueil">
              <Logo />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-mist">{dict.footer.mission}</p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-display mb-5 text-[11px] font-medium uppercase tracking-[0.28em] text-mist/70">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-frost/70 transition-colors duration-300 hover:text-ember"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="hairline mt-14" />

        <div className="mt-7 flex flex-col items-center justify-between gap-3 text-xs text-mist/60 md:flex-row">
          <p>© {new Date().getFullYear()} Pro Genius AI. {dict.footer.rights}</p>
          <p className="inline-flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-ember shadow-[0_0_6px_#ff9b45]" />
            {dict.footer.madeIn}
          </p>
        </div>
      </div>
    </footer>
  );
}
