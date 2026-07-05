import fr, { type Dictionary } from "./dictionaries/fr";

/**
 * Architecture multilingue de Pro Genius AI.
 *
 * Le français est la langue par défaut et est servi sans préfixe d'URL.
 * Pour activer une nouvelle langue :
 *   1. Créer lib/i18n/dictionaries/<locale>.ts (même forme que fr.ts)
 *   2. L'ajouter au registre `dictionaries` ci-dessous
 *   3. Ajouter la locale à `locales`
 * Les composants consomment uniquement `getDictionary()`, donc aucun
 * autre changement n'est nécessaire côté UI.
 */
export const locales = ["fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

const dictionaries: Record<Locale, Dictionary> = { fr };

export function getDictionary(locale: Locale = defaultLocale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

export type { Dictionary };
