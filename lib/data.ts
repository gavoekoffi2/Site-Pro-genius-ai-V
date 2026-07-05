/**
 * Données structurées du site — produits, services, technologies,
 * études de cas, articles et offres. Contenu en français (langue par défaut).
 */

export type Product = {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  features: string[];
  gradient: string;
  accent: string;
  symbol: string;
};

export const products: Product[] = [
  {
    slug: "graphiste-gpt",
    name: "Graphiste GPT",
    category: "SaaS créatif",
    tagline: "Votre direction artistique, propulsée par l'IA.",
    description:
      "Graphiste GPT transforme un simple brief en identités visuelles, affiches, publications et déclinaisons de marque prêtes à publier. Pensé pour les entrepreneurs et les équipes marketing africaines qui veulent une qualité studio, sans les délais d'un studio.",
    features: [
      "Génération d'identités visuelles complètes à partir d'un brief",
      "Déclinaisons automatiques pour tous les formats sociaux",
      "Cohérence de marque garantie sur chaque visuel",
      "Exports haute résolution prêts pour l'impression",
    ],
    gradient: "from-[#4d82ff] to-[#b06bff]",
    accent: "#b06bff",
    symbol: "◆",
  },
  {
    slug: "cutforge",
    name: "CutForge",
    category: "SaaS vidéo",
    tagline: "Le montage vidéo qui se fait tout seul.",
    description:
      "CutForge analyse vos rushs, détecte les moments forts et assemble des vidéos rythmées, sous-titrées et calibrées pour chaque plateforme. Des heures de montage réduites à quelques minutes.",
    features: [
      "Détection automatique des moments forts",
      "Sous-titrage multilingue synchronisé",
      "Formats optimisés par plateforme (Reels, Shorts, TikTok…)",
      "Habillage graphique cohérent avec votre marque",
    ],
    gradient: "from-[#38e1ff] to-[#4d82ff]",
    accent: "#38e1ff",
    symbol: "▶",
  },
  {
    slug: "afrivox-ai",
    name: "AfriVox AI",
    category: "IA vocale",
    tagline: "La voix de l'Afrique, comprise par les machines.",
    description:
      "AfriVox AI apporte la reconnaissance et la synthèse vocale aux langues et accents africains. Serveurs vocaux, assistants et interfaces conversationnelles qui comprennent enfin vos clients — dans leur langue.",
    features: [
      "Reconnaissance vocale adaptée aux accents africains",
      "Synthèse vocale naturelle multilingue",
      "Intégration téléphonie, WhatsApp et applications",
      "API simple pour vos propres produits",
    ],
    gradient: "from-[#22d3a5] to-[#38e1ff]",
    accent: "#22d3a5",
    symbol: "◉",
  },
  {
    slug: "procallai",
    name: "ProCallAI",
    category: "Agents vocaux",
    tagline: "Des agents téléphoniques IA qui ne dorment jamais.",
    description:
      "ProCallAI répond, qualifie, relance et prend des rendez-vous par téléphone, 24h/24. Une voix naturelle, un raisonnement fiable, et chaque conversation transcrite et analysée dans votre CRM.",
    features: [
      "Réception et émission d'appels 24h/24, 7j/7",
      "Qualification et routage intelligent des demandes",
      "Prise de rendez-vous connectée à vos agendas",
      "Transcription, résumé et analyse de chaque appel",
    ],
    gradient: "from-[#4d82ff] to-[#38e1ff]",
    accent: "#4d82ff",
    symbol: "◎",
  },
  {
    slug: "afritransfert",
    name: "AfriTransfert",
    category: "Fintech IA",
    tagline: "Les flux financiers africains, fluidifiés par l'IA.",
    description:
      "AfriTransfert simplifie et sécurise les transferts et paiements panafricains. Détection de fraude par IA, réconciliation automatique et une expérience pensée pour le mobile-first africain.",
    features: [
      "Transferts panafricains rapides et traçables",
      "Détection de fraude en temps réel par IA",
      "Réconciliation et reporting automatiques",
      "Expérience mobile-first, même en connectivité faible",
    ],
    gradient: "from-[#ffb648] to-[#ff6b6b]",
    accent: "#ffb648",
    symbol: "◈",
  },
];

export type Service = {
  slug: string;
  name: string;
  short: string;
  description: string;
  deliverables: string[];
  icon: string;
};

export const services: Service[] = [
  {
    slug: "saas-ia",
    name: "SaaS IA",
    short: "Des logiciels intelligents, prêts à conquérir leur marché.",
    description:
      "Nous concevons et développons des SaaS propulsés par l'IA de bout en bout : du positionnement produit à l'architecture, du design premium au déploiement. Le même niveau d'exigence que nos propres produits, appliqué aux vôtres.",
    deliverables: [
      "Cadrage produit et architecture technique",
      "Design d'interface premium et prototypage",
      "Développement full-stack et intégration LLM",
      "Déploiement, observabilité et itérations",
    ],
    icon: "layers",
  },
  {
    slug: "agents-ia",
    name: "Agents IA",
    short: "Des collaborateurs numériques autonomes et fiables.",
    description:
      "Des agents qui lisent, raisonnent, agissent et rendent compte : support client, prospection, back-office, veille. Nous les concevons avec des garde-fous solides pour qu'ils travaillent pour vous — jamais à votre place sans contrôle.",
    deliverables: [
      "Conception d'agents adaptés à vos processus",
      "Connexion à vos outils (CRM, e-mail, ERP…)",
      "Garde-fous, supervision et traçabilité",
      "Amélioration continue sur données réelles",
    ],
    icon: "bot",
  },
  {
    slug: "automatisations-ia",
    name: "Automatisations IA",
    short: "Vos processus répétitifs, exécutés à la vitesse machine.",
    description:
      "Nous cartographions vos processus, identifions les gisements de temps et déployons des automatisations robustes (n8n, API, webhooks) enrichies d'IA. Vos équipes se concentrent enfin sur ce qui a de la valeur.",
    deliverables: [
      "Audit et cartographie de vos processus",
      "Automatisations n8n / API sur mesure",
      "Enrichissement IA (tri, extraction, rédaction)",
      "Monitoring et maintenance évolutive",
    ],
    icon: "workflow",
  },
  {
    slug: "plateformes-ia",
    name: "Plateformes IA",
    short: "Des infrastructures intelligentes à l'échelle de vos ambitions.",
    description:
      "Marketplaces augmentées, portails métiers, plateformes de données : nous bâtissons des systèmes qui orchestrent utilisateurs, données et modèles d'IA à grande échelle, avec la fiabilité d'une infrastructure critique.",
    deliverables: [
      "Architecture scalable et sécurisée",
      "Orchestration de modèles et de données",
      "Espaces multi-acteurs et rôles avancés",
      "Tableaux de bord et analytique temps réel",
    ],
    icon: "network",
  },
  {
    slug: "applications-ia",
    name: "Applications IA",
    short: "Des applications web et mobiles qui pensent.",
    description:
      "Des applications où l'IA n'est pas un gadget mais le cœur de l'expérience : recherche intelligente, personnalisation, assistants embarqués. Web, mobile, desktop — toujours rapides, toujours élégantes.",
    deliverables: [
      "Applications web & mobiles sur mesure",
      "Fonctionnalités IA natives (recherche, assistants…)",
      "Design d'expérience haut de gamme",
      "Performance et accessibilité exemplaires",
    ],
    icon: "smartphone",
  },
  {
    slug: "solutions-vocales-ia",
    name: "Solutions vocales IA",
    short: "Quand vos systèmes parlent — et écoutent vraiment.",
    description:
      "Standards téléphoniques intelligents, assistants vocaux, serveurs interactifs nouvelle génération : nous donnons une voix à vos services, avec une compréhension fine des langues et accents africains.",
    deliverables: [
      "Agents vocaux entrants et sortants",
      "SVI conversationnels nouvelle génération",
      "Voix de marque sur mesure",
      "Analyse et supervision des conversations",
    ],
    icon: "audio-waveform",
  },
  {
    slug: "formations-ia",
    name: "Formations IA",
    short: "Faites de vos équipes des équipes augmentées.",
    description:
      "Des programmes pratiques, du dirigeant à l'opérationnel : comprendre l'IA, l'utiliser au quotidien, la déployer dans son métier. Formations en présentiel ou à distance, toujours ancrées dans vos cas d'usage réels.",
    deliverables: [
      "Parcours dirigeants : vision et stratégie IA",
      "Ateliers métiers sur vos cas d'usage",
      "Programmes techniques pour vos développeurs",
      "Supports, certifications et suivi post-formation",
    ],
    icon: "graduation-cap",
  },
  {
    slug: "conseil-ia",
    name: "Conseil IA",
    short: "Une stratégie IA claire, pragmatique, rentable.",
    description:
      "Nous aidons dirigeants et institutions à passer de l'intuition à la feuille de route : audit de maturité, identification des cas d'usage à fort ROI, choix technologiques, gouvernance et conduite du changement.",
    deliverables: [
      "Audit de maturité IA de votre organisation",
      "Feuille de route priorisée par ROI",
      "Choix d'architecture et de partenaires",
      "Gouvernance, éthique et conformité",
    ],
    icon: "compass",
  },
];

export type CaseStudy = {
  slug: string;
  sector: string;
  title: string;
  challenge: string;
  solution: string;
  results: { value: string; label: string }[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "banque-agents-vocaux",
    sector: "Services financiers · Afrique de l'Ouest",
    title: "Un service client qui répond en 3 secondes, 24h/24",
    challenge:
      "Une institution financière recevait des milliers d'appels par jour. Temps d'attente moyen : 11 minutes. Un client sur trois raccrochait avant d'avoir parlé à un conseiller.",
    solution:
      "Déploiement de ProCallAI en première ligne : réponse instantanée, résolution automatique des demandes courantes (soldes, oppositions, suivis), transfert intelligent des cas complexes avec contexte complet pour le conseiller.",
    results: [
      { value: "-82%", label: "de temps d'attente moyen" },
      { value: "67%", label: "des appels résolus sans humain" },
      { value: "24/7", label: "de disponibilité réelle" },
    ],
  },
  {
    slug: "distribution-automatisation",
    sector: "Distribution · Multi-pays",
    title: "40 heures de saisie hebdomadaire réduites à zéro",
    challenge:
      "Un groupe de distribution consolidait manuellement les commandes de dizaines de points de vente : ressaisies, erreurs, retards de facturation et visibilité quasi nulle sur les stocks.",
    solution:
      "Chaîne d'automatisations IA : extraction automatique des bons de commande (photos, PDF, WhatsApp), validation intelligente, synchronisation ERP et alertes de stock prédictives.",
    results: [
      { value: "40h", label: "économisées chaque semaine" },
      { value: "-95%", label: "d'erreurs de saisie" },
      { value: "x3", label: "plus rapide sur la facturation" },
    ],
  },
  {
    slug: "media-production-creative",
    sector: "Médias & création · Afrique centrale",
    title: "Une production de contenus multipliée par cinq",
    challenge:
      "Un studio de création croulait sous la demande : chaque campagne exigeait des jours de déclinaisons graphiques et de montage vidéo, limitant le nombre de clients servis.",
    solution:
      "Adoption de Graphiste GPT et CutForge au cœur du flux de production : génération des déclinaisons, montages automatiques calibrés par plateforme, contrôle créatif humain en bout de chaîne.",
    results: [
      { value: "x5", label: "de volume de production" },
      { value: "-70%", label: "de temps par campagne" },
      { value: "+40%", label: "de nouveaux clients servis" },
    ],
  },
];

export type BlogPost = {
  slug: string;
  date: string;
  readTime: string;
  category: string;
  title: string;
  excerpt: string;
  content: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "afrique-avantage-ia",
    date: "2026-06-12",
    readTime: "6 min",
    category: "Vision",
    title: "Pourquoi l'Afrique a un avantage décisif dans la course à l'IA",
    excerpt:
      "Pas d'infrastructures héritées à traîner, une population jeune, mobile-first, et des problèmes réels à résoudre : le continent a tout pour sauter une génération technologique.",
    content: [
      "Quand on parle d'intelligence artificielle, on regarde spontanément vers la Silicon Valley, Londres ou Shenzhen. C'est une erreur de perspective. Les révolutions technologiques ne profitent pas d'abord à ceux qui les inventent, mais à ceux qui les adoptent le plus vite et le plus intelligemment.",
      "L'Afrique a déjà démontré cette capacité de saut technologique : le continent est passé directement au mobile money pendant que d'autres modernisaient leurs réseaux bancaires. L'IA offre la même opportunité, à une échelle bien supérieure. Pas de systèmes d'information vieux de quarante ans à maintenir, pas de processus fossilisés : chaque entreprise peut construire directement sur l'état de l'art.",
      "Chez Pro Genius AI, nous le constatons chaque semaine : une PME d'Abidjan ou de Dakar peut déployer en quelques jours des agents IA qu'une multinationale mettrait dix-huit mois à faire valider. Cette agilité est un avantage compétitif massif — à condition d'avoir des partenaires qui comprennent à la fois la technologie et le terrain.",
      "C'est exactement notre raison d'être : mettre le meilleur de l'intelligence artificielle mondiale au service des réalités africaines. Pas demain. Maintenant.",
    ],
  },
  {
    slug: "agents-ia-entreprise-guide",
    date: "2026-05-28",
    readTime: "8 min",
    category: "Guide pratique",
    title: "Agents IA en entreprise : par où commencer (vraiment)",
    excerpt:
      "Tout le monde parle d'agents IA. Peu d'entreprises savent par quel processus commencer, comment garder le contrôle et comment mesurer le retour sur investissement.",
    content: [
      "Un agent IA n'est pas un chatbot amélioré. C'est un système capable de lire, raisonner, utiliser des outils et exécuter des tâches de bout en bout. Cette différence change tout : un chatbot répond, un agent travaille.",
      "La première erreur des entreprises est de viser trop large : « un agent qui gère tout le support client ». La bonne approche est chirurgicale : choisir un processus fréquent, bien défini, mesurable — la qualification des demandes entrantes, la relance des devis, la préparation des rapports hebdomadaires.",
      "La deuxième clé est le contrôle. Un agent en production doit être supervisable : chaque action tracée, des seuils de confiance explicites, une escalade humaine fluide. C'est ce que nous appelons le principe du copilote : l'agent exécute, l'humain garde le cap.",
      "Enfin, mesurez. Temps économisé, taux de résolution, satisfaction client : un agent bien conçu doit prouver sa valeur en semaines, pas en années. Si votre partenaire IA ne vous propose pas de métriques dès le premier jour, changez de partenaire.",
    ],
  },
  {
    slug: "voix-prochaine-interface",
    date: "2026-05-06",
    readTime: "5 min",
    category: "Technologie",
    title: "La voix est la prochaine grande interface — surtout en Afrique",
    excerpt:
      "Sur un continent aux centaines de langues et où le mobile domine, la voix n'est pas un gadget : c'est l'interface la plus naturelle et la plus inclusive qui soit.",
    content: [
      "L'écran et le clavier ont dominé quarante ans d'informatique. Mais la manière la plus naturelle de communiquer reste la parole — et pour des millions d'utilisateurs africains, elle est aussi la plus accessible.",
      "Les modèles vocaux de nouvelle génération changent la donne : compréhension en contexte, voix de synthèse naturelles, latence quasi imperceptible. Ce qui relevait de la science-fiction en 2022 tourne aujourd'hui en production sur de simples lignes téléphoniques.",
      "Le défi spécifique du continent, ce sont les langues et les accents. C'est précisément pour cela que nous avons construit AfriVox AI : parce qu'une IA vocale qui ne comprend pas vos clients n'est pas une IA vocale.",
      "Notre conviction : d'ici cinq ans, l'interface principale entre les entreprises africaines et leurs clients sera conversationnelle et vocale. Les entreprises qui s'y préparent aujourd'hui prendront une avance considérable.",
    ],
  },
  {
    slug: "automatisation-pme-10-processus",
    date: "2026-04-17",
    readTime: "7 min",
    category: "Guide pratique",
    title: "10 processus que toute PME devrait automatiser dès ce trimestre",
    excerpt:
      "De la facturation aux relances clients, voici les automatisations au retour sur investissement le plus rapide — celles que nous déployons le plus souvent chez nos clients.",
    content: [
      "L'automatisation n'est pas réservée aux grands groupes. Les gains les plus spectaculaires que nous observons sont chez les PME, où chaque heure libérée compte double.",
      "Les dix processus au ROI le plus rapide selon nos déploiements : la saisie des factures fournisseurs, les relances de devis, la qualification des leads entrants, les réponses aux questions récurrentes, la génération de rapports hebdomadaires, la réconciliation bancaire, l'onboarding administratif des clients, la veille concurrentielle, la publication multicanale de contenus, et le suivi des stocks.",
      "Le point commun de ces processus : ils sont fréquents, répétitifs et suivent des règles claires. C'est le terrain de jeu idéal des automatisations enrichies d'IA — l'extraction et la rédaction en plus de la simple exécution.",
      "Notre conseil : commencez par un seul processus, mesurez le temps réellement gagné pendant un mois, puis réinvestissez ce temps dans le suivant. L'automatisation est un effet boule de neige.",
    ],
  },
];

export type JobOpening = {
  slug: string;
  title: string;
  type: string;
  location: string;
  team: string;
  description: string;
};

export const jobOpenings: JobOpening[] = [
  {
    slug: "senior-ai-engineer",
    title: "Senior AI Engineer",
    type: "Temps plein",
    location: "Abidjan / Remote Afrique",
    team: "Engineering",
    description:
      "Concevez et déployez des agents et pipelines LLM en production pour des clients exigeants. Maîtrise de Python ou TypeScript, expérience des architectures RAG et des systèmes d'agents.",
  },
  {
    slug: "product-designer",
    title: "Product Designer",
    type: "Temps plein",
    location: "Remote Afrique",
    team: "Design",
    description:
      "Donnez leur visage aux produits de l'écosystème Pro Genius AI. Portfolio démontrant un niveau d'exigence visuelle exceptionnel, sens du motion design bienvenu.",
  },
  {
    slug: "automation-specialist",
    title: "Automation Specialist (n8n)",
    type: "Temps plein",
    location: "Abidjan / Hybride",
    team: "Delivery",
    description:
      "Cartographiez les processus de nos clients et transformez-les en automatisations robustes. Expertise n8n, API REST et webhooks ; la rigueur est votre langue maternelle.",
  },
  {
    slug: "ai-sales-lead",
    title: "AI Solutions Sales Lead",
    type: "Temps plein",
    location: "Abidjan",
    team: "Growth",
    description:
      "Portez nos solutions auprès des entreprises et institutions du continent. Expérience B2B exigée, culture technologique réelle, réseau ouest-africain apprécié.",
  },
];

export const technologies = [
  "React", "Next.js", "TypeScript", "OpenAI", "Claude", "Gemini",
  "n8n", "Supabase", "Docker", "Node.js", "Python", "PostgreSQL",
  "Three.js", "TailwindCSS", "LangChain", "Kubernetes",
];

export const solutionAudiences = [
  {
    slug: "entreprises-pme",
    title: "Entreprises & PME",
    text: "Automatisez vos opérations, augmentez vos équipes et servez vos clients 24h/24 — sans alourdir vos coûts fixes.",
    points: ["Automatisation des processus métiers", "Agents de support et de vente", "Tableaux de bord intelligents"],
  },
  {
    slug: "startups",
    title: "Startups",
    text: "Intégrez l'IA au cœur de votre produit et lancez plus vite que vos concurrents, avec une architecture qui tiendra la charge.",
    points: ["Développement produit IA de bout en bout", "Architecture LLM scalable", "Design premium qui inspire confiance"],
  },
  {
    slug: "investisseurs",
    title: "Investisseurs",
    text: "Accédez à un écosystème de produits IA conçus pour des marchés africains en forte croissance, avec une exécution démontrée.",
    points: ["Portefeuille de produits en croissance", "Marchés massifs et sous-adressés", "Équipe d'exécution de niveau international"],
  },
  {
    slug: "gouvernements",
    title: "Gouvernements & institutions",
    text: "Modernisez vos services publics avec des solutions souveraines, multilingues et pensées pour les réalités du terrain.",
    points: ["Services citoyens conversationnels", "Formation massive des agents publics", "Conseil en stratégie IA nationale"],
  },
  {
    slug: "createurs-talents",
    title: "Créateurs & talents",
    text: "Multipliez votre capacité créative avec nos outils, ou rejoignez l'équipe qui construit l'IA africaine de demain.",
    points: ["Outils créatifs (Graphiste GPT, CutForge)", "Formations pratiques à l'IA", "Carrières au sein de Pro Genius AI"],
  },
];
