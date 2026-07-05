"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import Logo from "./Logo";

const dict = getDictionary();

const links = [
  { href: "/a-propos", label: dict.nav.about },
  { href: "/solutions", label: dict.nav.solutions },
  { href: "/produits", label: dict.nav.products },
  { href: "/services", label: dict.nav.services },
  { href: "/etudes-de-cas", label: dict.nav.caseStudies },
  { href: "/blog", label: dict.nav.blog },
  { href: "/carrieres", label: dict.nav.careers },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-[90] transition-all duration-500 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8">
          <Link href="/" className="relative z-10" aria-label="Pro Genius AI — Accueil">
            <Logo />
          </Link>

          <nav
            className={`hidden items-center gap-1 rounded-full px-2 py-1.5 transition-all duration-500 lg:flex ${
              scrolled ? "glass-deep" : ""
            }`}
            aria-label="Navigation principale"
          >
            {links.map((l) => {
              const active = pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`relative rounded-full px-3.5 py-2 font-display text-[13px] tracking-wide transition-colors duration-300 ${
                    active ? "text-frost" : "text-mist hover:text-frost"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-white/[0.07] ring-1 ring-white/10"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                    />
                  )}
                  <span className="relative">{l.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="btn-primary !hidden !px-5 !py-2.5 text-sm lg:!inline-flex"
            >
              {dict.nav.contact}
              <ArrowUpRight size={15} strokeWidth={2.4} />
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="glass relative z-10 flex h-11 w-11 items-center justify-center rounded-full text-frost lg:hidden"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={open}
            >
              {open ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Menu mobile plein écran */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[85] flex flex-col justify-center bg-[#030409]/95 px-8 backdrop-blur-2xl lg:hidden"
          >
            <nav className="flex flex-col gap-2" aria-label="Navigation mobile">
              {[{ href: "/", label: dict.nav.home }, ...links, { href: "/contact", label: dict.nav.contact }].map(
                (l, i) => (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, x: -28, filter: "blur(6px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.08 + i * 0.055, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={l.href}
                      className="font-display block py-2.5 text-3xl font-medium tracking-tight text-frost/90 transition-colors hover:text-cyan"
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                )
              )}
            </nav>
            <motion.div
              className="hairline mt-10"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            />
            <motion.p
              className="mt-6 text-sm text-mist"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
            >
              {dict.meta.tagline}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
