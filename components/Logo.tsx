/** Monogramme Pro Genius AI — anneau dégradé + P + nœud lumineux. */
export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="group inline-flex items-center gap-3">
      <svg width="34" height="34" viewBox="0 0 100 100" fill="none" aria-hidden>
        <circle
          cx="50" cy="50" r="44"
          stroke="url(#logo-g)" strokeWidth="4"
          className="transition-all duration-500 group-hover:stroke-[6]"
        />
        <path
          d="M36 68 V32 h16 a12 12 0 0 1 0 24 h-10"
          stroke="#e8edfb" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"
        />
        <circle cx="68" cy="66" r="5" fill="#ff9b45" />
        <defs>
          <linearGradient id="logo-g" x1="0" y1="0" x2="100" y2="100">
            <stop stopColor="#ff9b45" />
            <stop offset="1" stopColor="#2e5fb7" />
          </linearGradient>
        </defs>
      </svg>
      {!compact && (
        <span className="font-display text-[15px] font-semibold tracking-wide text-frost">
          Pro Genius <span className="text-gradient-duo">AI</span>
        </span>
      )}
    </span>
  );
}
