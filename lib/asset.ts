/**
 * Préfixe des médias servis depuis `public/`.
 *
 * Sur GitHub Pages, le site est publié sous un sous-chemin
 * (`/Site-Pro-genius-ai-V`). `next/image` et `next/link` appliquent le
 * `basePath` automatiquement, mais PAS les URL écrites à la main dans un style
 * inline (`background-image: url(...)`) : sans ce helper, ces médias
 * renverraient un 404 en production.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** `asset("/assets/x.webp")` → `/<basePath>/assets/x.webp` */
export function asset(path: string): string {
  return `${BASE_PATH}${path}`;
}
