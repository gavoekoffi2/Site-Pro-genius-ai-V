import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-8 px-5 text-center">
      <div
        className="animate-aurora pointer-events-none absolute left-1/2 top-1/2 h-[60vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(47,107,255,0.12), transparent 70%)" }}
        aria-hidden
      />
      <p className="font-display relative text-[9rem] font-semibold leading-none text-gradient md:text-[13rem]">
        404
      </p>
      <p className="font-display relative max-w-md text-balance text-xl text-frost/85">
        Cette page n'existe pas encore. Notre IA travaille peut-être dessus.
      </p>
      <Link href="/" className="btn-ghost relative">
        <ArrowLeft size={16} />
        Retour à l'accueil
      </Link>
    </section>
  );
}
