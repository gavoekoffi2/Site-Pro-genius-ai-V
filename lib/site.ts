/**
 * URL canonique du site.
 *
 * Par défaut le domaine de production. Le déploiement GitHub Pages la surcharge
 * via `NEXT_PUBLIC_SITE_URL` afin que les métadonnées, le sitemap et robots.txt
 * pointent vers l'adresse où le site est réellement servi — sinon le sitemap
 * annoncerait des URL inexistantes.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://progenius.ai"
).replace(/\/$/, "");
