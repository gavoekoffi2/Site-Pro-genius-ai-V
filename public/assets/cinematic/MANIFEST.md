# Manifeste des médias cinématographiques

Assets générés via **Higgsfield MCP** (`https://mcp.higgsfield.ai/mcp`), modèle
`nano_banana_pro` (routé côté serveur vers `nano_banana_2`), puis redimensionnés
et convertis en WebP dans le dépôt. Aucune URL distante n'est utilisée en
production : les trois fichiers sont servis depuis `public/`.

Chaque image a été **contrôlée visuellement** avant intégration : nombre de
mains, nombre de doigts, absence de déformation anatomique, absence de texte,
de logo et de filigrane.

---

## 1. `human-robot-contact-hero-desktop.webp`

| | |
|---|---|
| **Fonction** | Mains photoréalistes du hero, composition horizontale |
| **Emplacement** | `components/hero/PhotorealHands.tsx` → hero de la page d'accueil (`≥768px`) |
| **Dimensions** | 1920 × 1072 (source générée : 2752 × 1536) |
| **Poids** | 59 Ko — WebP qualité 80 |
| **Format** | WebP, préchargé (`priority`), aperçu inline 24px pour éviter tout flash |
| **Point de contact** | x = 0,497 · y = 0,466 (fraction de l'image, utilisé pour aligner l'énergie 3D) |

**Prompt utilisé :**

> Cinematic close-up of exactly two large hands approaching each other in a dark premium futuristic environment. On the left, a highly realistic elegant Black African human hand with natural deep-brown skin texture, subtle warm amber highlights and anatomically correct fingers. On the right, a beautiful refined humanoid robotic hand made of premium dark titanium and brushed metal, with sophisticated articulated fingers and subtle integrated blue light. Both hands seen from compatible perspectives and scales, same lighting direction. Their index fingers are extended toward each other and about to touch at the exact center of the composition, a narrow gap of glowing warm orange energy between the two fingertips. Dramatic sculptural side lighting like a contemporary museum. Emotional symbol of African human intelligence augmented by artificial intelligence, not replaced by it. Museum-quality cinematic lighting, deep obsidian blacks, warm skin highlights, restrained deep blue and amber gold energy, shallow atmospheric depth, ultra-detailed, premium technology campaign. No faces, no text, no logos, no watermark, no weapons, no stereotypes, no extra hands, no extra fingers, no deformed anatomy, no fused fingers, no cartoon robot, no cheap sci-fi aesthetic.

**Contrôle qualité :** deux variantes générées. La variante retenue présente des
noirs obsidienne profonds et une énergie organique ; la variante écartée avait un
fond gris-bleu et une énergie centrale en forme de capsule d'interface. Zoom
vérifié sur chaque main : 5 doigts, ongles cohérents, texture de peau réaliste,
articulations métalliques crédibles.

---

## 2. `human-robot-contact-hero-mobile.webp`

| | |
|---|---|
| **Fonction** | Mains photoréalistes du hero, **composition verticale dédiée** (pas un recadrage) |
| **Emplacement** | `components/hero/PhotorealHands.tsx` → hero (`<768px`) |
| **Dimensions** | 1080 × 1935 (source générée : 1536 × 2752) |
| **Poids** | 53 Ko — WebP qualité 80 |
| **Point de contact** | x = 0,495 · y = 0,48 |

**Prompt utilisé :**

> Vertical cinematic composition. Exactly two large hands approaching each other in a dark premium futuristic environment, arranged vertically. From the lower left, a highly realistic elegant Black African human hand with natural deep-brown skin texture and warm amber rim highlights reaches upward, index finger extended. From the upper right, a beautiful refined humanoid robotic hand of premium dark titanium and brushed metal with subtle integrated blue light reaches downward, index finger extended. The two index fingertips almost touch at the exact center of the frame with a narrow warm orange glow between them. Dramatic sculptural side lighting, deep obsidian black background, shallow atmospheric depth, ultra-detailed premium technology campaign, anatomically correct hands. No faces, no text, no logos, no watermark, no extra hands, no extra fingers, no deformed anatomy, no fused fingers, no cartoon robot, no cheap sci-fi.

---

## 3. `africa-ai-ambience-desktop.webp`

| | |
|---|---|
| **Fonction** | Plaque d'ambiance derrière le globe : profondeur atmosphérique sans coût de rendu |
| **Emplacement** | `components/sections/AfricaGlobe.tsx` → fond de la section |
| **Dimensions** | 1920 × 1072 |
| **Poids** | 13 Ko — WebP qualité 72 |

**Prompt utilisé :**

> Deep obsidian digital space backdrop for a premium technology website. Vast empty black void with extremely subtle warm amber and deep blue volumetric light gradients at the edges, faint fine luminous particles drifting, a very subtle sense of atmospheric depth and scale. Elegant, restrained, cinematic, almost entirely dark with generous negative space in the centre. No planet, no globe, no continents, no text, no logos, no watermark, no bright neon, no lens flare, no stars pattern, no nebula cliche.

**Note de conception :** le globe lui-même **n'est pas** une image générée. Il est
construit en React Three Fiber à partir de coordonnées géographiques réelles
(`lib/geo/nodes.ts`) — une image générée n'offrait aucune garantie sur
l'exactitude du continent. Higgsfield ne fournit ici que l'atmosphère.

---

## Total

**125 Ko** pour les trois assets. Les noirs profonds se compressent
exceptionnellement bien en WebP, ce qui permet un hero photoréaliste plein écran
pour le poids d'une vignette.

## Coût de génération

| Poste | Crédits |
|---|---|
| Hero desktop (2 variantes) | 4 |
| Hero mobile | 2 |
| Plaque d'ambiance | 2 |
| **Total retenu** | **8** |
