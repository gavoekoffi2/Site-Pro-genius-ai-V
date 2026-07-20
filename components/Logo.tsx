import Image from "next/image";

interface LogoProps {
  compact?: boolean;
  className?: string;
}

/** Logo officiel fourni par Pro Genius AI — aucun monogramme de substitution. */
export default function Logo({ compact = false, className = "" }: LogoProps) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <Image
        src={compact ? "/brand/pro-genius-ai-mark.webp" : "/brand/pro-genius-ai-horizontal.webp"}
        alt="Pro Genius AI"
        width={compact ? 256 : 672}
        height={compact ? 167 : 111}
        priority
        className={`${compact ? "h-10 w-auto object-contain" : "h-9 w-auto max-w-[13.5rem] object-contain object-left md:h-10"} drop-shadow-[0_0_18px_rgba(93,156,187,.2)]`}
      />
    </span>
  );
}
