import type { NextConfig } from "next";

/**
 * Le site est entièrement statique (toutes les routes sont en SSG, aucune route
 * API, aucun middleware). Il peut donc être exporté en fichiers plats et servi
 * par n'importe quel hébergeur statique.
 *
 * L'export n'est activé que lorsque `GITHUB_PAGES=true` : `npm run dev` et le
 * build de production classique restent inchangés.
 */
const isPages = process.env.GITHUB_PAGES === "true";

/** Sous-chemin de publication sur GitHub Pages (dépôt de projet). */
const basePath = isPages ? process.env.NEXT_PUBLIC_BASE_PATH ?? "" : "";

const nextConfig: NextConfig = {
  ...(isPages
    ? {
        output: "export" as const,
        basePath,
        // Routes servies en /chemin/ : le plus fiable sur un hébergeur statique.
        trailingSlash: true,
        // L'optimiseur d'images de Next exige un serveur ; en export les
        // fichiers sont livrés tels quels. Nos médias sont déjà en WebP
        // redimensionné, l'optimiseur n'apportait rien.
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
