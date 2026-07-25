/**
 * Dictionnaire français — langue par défaut de Pro Genius AI.
 * Pour ajouter une langue : dupliquer ce fichier (ex: en.ts),
 * traduire les valeurs et l'enregistrer dans lib/i18n/index.ts.
 */
const fr = {
  meta: {
    siteName: "Pro Genius AI",
    tagline: "L'intelligence artificielle comme levier du développement africain.",
    description:
      "Pro Genius AI conçoit des solutions d'intelligence artificielle qui permettent aux entreprises et aux particuliers de transformer la technologie en résultats concrets et d'accélérer le développement africain.",
  },

  nav: {
    home: "Accueil",
    about: "À propos",
    solutions: "Solutions IA",
    products: "Réalisations",
    services: "Services",
    caseStudies: "Études de cas",
    blog: "Blog IA",
    careers: "Carrières",
    contact: "Contact",
    cta: "Discutons de votre projet",
  },

  hero: {
    eyebrow: "Startup africaine · Intelligence artificielle",
    slogan: "Nous ne remplaçons pas l'humain.",
    sloganAccent: "Nous augmentons ses capacités.",
    sub: "L'intelligence artificielle au service du potentiel humain.",
    scrollHint: "Faites défiler pour connecter",
    ctaPrimary: "Découvrir nos solutions",
    ctaSecondary: "Notre vision",
  },

  about: {
    eyebrow: "Qui sommes-nous",
    titleLines: ["Nous construisons", "l'avenir de l'Afrique", "grâce à l'IA."],
    body: "Pro Genius AI conçoit des solutions d'intelligence artificielle pour permettre aux entreprises comme aux particuliers de tirer pleinement profit de cette technologie. Notre ambition est claire : faire de l'IA un levier concret de productivité, d'opportunités et d'innovation capable d'accélérer durablement le développement africain.",
    pillars: [
      {
        title: "Augmenter l'humain",
        text: "Chaque solution que nous créons amplifie une capacité humaine. Jamais l'inverse.",
      },
      {
        title: "Construire pour l'Afrique",
        text: "Des produits pensés pour les réalités, les langues et les ambitions du continent.",
      },
      {
        title: "Exiger l'excellence",
        text: "Un niveau d'ingénierie et de design capable de rivaliser avec les meilleurs au monde.",
      },
    ],
  },

  globe: {
    eyebrow: "Rayonnement",
    /**
     * Trois formulations ont été rédigées pour cet acte :
     *   1. « L'Afrique propulse la prochaine intelligence. »   ← retenue
     *   2. « L'intelligence africaine, connectée au monde. »
     *   3. « Une intelligence créée ici. Déployée partout. »
     * La première est celle qui prolonge le plus fidèlement le positionnement
     * déjà écrit dans `about.body` (« elle doit la conduire »).
     */
    title: "L'Afrique propulse",
    titleAccent: "la prochaine intelligence.",
    sub: "Pro Genius AI transforme les ambitions, les talents et les réalités africaines en solutions intelligentes capables de rayonner à l'échelle mondiale.",
    /** Mention obligatoire : les points lumineux sont conceptuels. */
    disclaimer:
      "Visualisation conceptuelle de pôles d'innovation — ne représente pas des implantations.",
    /** Libellés des services reliés aux nœuds du continent. */
    nodesLabel: "Ce que nous déployons depuis le continent",
    a11y:
      "Globe terrestre présentant l'Afrique au premier plan. Des nœuds lumineux s'allument à travers le continent, se connectent entre eux, puis des arcs de données s'étendent vers le reste du monde.",
  },

  products: {
    eyebrow: "Écosystème",
    title: "Des produits qui travaillent pour vous.",
    sub: "Chaque produit de notre écosystème résout un problème réel, avec un niveau de finition obsessionnel.",
    viewAll: "Explorer tous les produits",
    discover: "Découvrir",
  },

  services: {
    eyebrow: "Ce que nous créons",
    title: "Un cerveau. Une infinité de possibilités.",
    sub: "Autour d'un même cœur d'intelligence, nous déployons tout le spectre des solutions IA.",
    viewAll: "Explorer tous les services",
  },

  impact: {
    eyebrow: "Notre trajectoire",
    title: "Une histoire qui ne fait que commencer.",
    steps: [
      {
        year: "Chapitre 01",
        title: "La vision",
        text: "Une équipe de bâtisseurs africains décide que le continent ne regardera pas la révolution IA depuis les gradins.",
      },
      {
        year: "Chapitre 02",
        title: "Les premiers produits",
        text: "Graphiste GPT et CutForge prouvent qu'un produit IA conçu en Afrique peut viser un standard mondial.",
      },
      {
        year: "Chapitre 03",
        title: "L'écosystème",
        text: "AfrivoxAI, ProSocial AI et AfriTransfer : des solutions complémentaires s'assemblent au service des entreprises et des particuliers.",
      },
      {
        year: "Chapitre 04",
        title: "L'échelle continentale",
        text: "Déploiements multi-pays, partenariats stratégiques, formation massive de talents : l'IA africaine passe à l'échelle.",
      },
    ],
  },

  stats: {
    eyebrow: "En chiffres",
    title: "Un écosystème concret, une ambition continentale.",
    items: [
      { value: 11, suffix: "", label: "Réalisations numériques présentées dans notre portfolio" },
      { value: 8, suffix: "", label: "Expertises proposées aux organisations" },
      { value: 1, suffix: "", label: "Écosystème intégré au service de l'Afrique" },
      { value: 100, suffix: "%", label: "Une vision centrée sur le potentiel humain" },
    ],
  },

  tech: {
    eyebrow: "Stack technologique",
    title: "Les meilleures technologies du monde. Au service de l'Afrique.",
  },

  team: {
    eyebrow: "L'équipe",
    title: "Une vision portée par des bâtisseurs.",
    sub: "Pro Genius AI orchestre produit, ingénierie et stratégie pour transformer des besoins africains réels en solutions IA utiles.",
    founder: {
      initials: "KG",
      name: "Koffi GAVOE",
      role: "Fondateur & CEO, Pro Genius AI",
      focus: "Vision, stratégie produit et développement d'un écosystème IA conçu en Afrique pour rayonner au-delà du continent.",
    },
    expertise: [
      { number: "01", title: "Produit & design", text: "Des expériences simples, premium et pensées autour des usages réels." },
      { number: "02", title: "Ingénierie IA", text: "Agents, voix, automatisations et plateformes développés comme un même système." },
      { number: "03", title: "Déploiement terrain", text: "Une approche pragmatique : partir du problème, livrer, mesurer et améliorer." },
    ],
  },

  cta: {
    eyebrow: "Prêt à commencer ?",
    title: "Donnez à votre entreprise une longueur d'avance.",
    sub: "Parlons de ce que l'intelligence artificielle peut faire pour vous — concrètement, rapidement, puissamment.",
    button: "Lancer la conversation",
  },

  footer: {
    mission: "Utiliser l'IA pour augmenter les capacités humaines et permettre aux entreprises africaines de travailler plus vite, plus intelligemment et avec beaucoup plus de puissance.",
    columns: {
      company: "Entreprise",
      ecosystem: "Écosystème",
      resources: "Ressources",
    },
    rights: "Tous droits réservés.",
    madeIn: "Conçu et développé en Afrique.",
  },

  contact: {
    eyebrow: "Contact",
    title: "Construisons quelque chose de grand.",
    sub: "Investisseur, entreprise, gouvernement, talent ou partenaire — dites-nous qui vous êtes, nous ferons le reste.",
    form: {
      name: "Nom complet",
      email: "Adresse e-mail",
      org: "Organisation",
      type: "Vous êtes",
      types: ["Entreprise / PME", "Startup", "Investisseur", "Gouvernement / Institution", "Créateur / Talent", "Partenaire"],
      message: "Votre message",
      messagePlaceholder: "Décrivez votre projet, votre besoin ou votre idée…",
      submit: "Envoyer le message",
      success: "Message reçu. Notre équipe vous répond sous 24h ouvrées.",
    },
    direct: {
      title: "Ou directement",
      email: "contact@progenius.ai",
      location: "Abidjan · Côte d'Ivoire — et partout où l'Afrique entreprend.",
    },
  },
} as const;

export type Dictionary = typeof fr;
export default fr;
