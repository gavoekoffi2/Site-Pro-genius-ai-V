# Pro Genius AI — Site officiel

Site vitrine de **Pro Genius AI**, startup africaine spécialisée en intelligence artificielle.

> Nous ne remplaçons pas l'humain. Nous augmentons ses capacités.

## Stack

- **Next.js 15** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS 4** — design system sur mesure : orange premium dominant (« ember »),
  bleu premium secondaire (« azure »), blanc, noir profond chaud, dégradés orange ↔ bleu,
  glassmorphism subtil
- **Photographic plate compositing + Framer Motion** — scène cinématique humain/androïde photoréaliste
- **GSAP + ScrollTrigger** — narration au scroll, rapprochement et contact des mains
- **Framer Motion** — reveals, micro-animations, compteurs
- **Lenis** — smooth scroll synchronisé avec GSAP
- **Lucide** — icônes

## Démarrage

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de production
```

## Architecture

```
app/                    Pages (App Router) : accueil, à propos, solutions,
                        produits(+detail), services(+detail), études de cas,
                        blog(+articles), carrières, contact, sitemap, robots
components/
  hero/                 Scène photographique des mains + orchestration du scroll
  sections/             Sections de l'accueil (globe, orbite services, timeline…)
  ui/                   Primitives (Reveal, MagneticButton, TiltCard, Counter…)
lib/
  data.ts               Produits, services, études de cas, articles, offres
  i18n/                 Architecture multilingue (français par défaut)
```

## Multilingue

Le français est la langue par défaut (sans préfixe d'URL). Pour ajouter une
langue : dupliquer `lib/i18n/dictionaries/fr.ts`, traduire, puis l'enregistrer
dans `lib/i18n/index.ts`. L'UI ne consomme que `getDictionary()`.

## Configuration de production

- **Domaine** : remplacer `https://progenius.ai` dans `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`
- **Identité** : le fondateur public affiché est Koffi GAVOE, CEO de Pro Genius AI
- **Chiffres** : la section d'accueil ne présente que les éléments vérifiables de l'écosystème publié
- **E-mail de contact** : `contact.direct.email` (le formulaire envoie via `mailto:`;
  brancher une API route ou un service type Resend pour un envoi serveur)
- **Études de cas** : anonymisées et illustratives dans `lib/data.ts` — à remplacer
  par vos références réelles

## Performance

- Scène photographique chargée dynamiquement, sans coût WebGL dans le hero
- Canvas 2D (fond neuronal, globe, sphère) mis en pause hors viewport / onglet caché
- `prefers-reduced-motion` respecté partout (le hero devient statique)
- Pages entièrement statiques (SSG), métadonnées SEO + sitemap + robots
