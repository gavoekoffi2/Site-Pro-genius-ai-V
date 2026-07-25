# Direction artistique — Pro Genius AI

> **L'intelligence humaine africaine, amplifiée par l'intelligence artificielle
> et connectée au monde.**

Direction retenue : **Obsidian African Future**, avec l'éclairage latéral
sculptural emprunté au traitement « musée ». Elle conserve intégralement
l'identité déjà en place (orange dominant, bleu secondaire, logo, typographies)
et réutilise la majeure partie du code d'animation existant.

---

## 1. Tokens

Toutes les couleurs vivent dans `@theme` (`app/globals.css`). **Aucune couleur
n'est improvisée dans un composant.**

| Token | Valeur | Rôle |
|---|---|---|
| `--color-void` | `#070503` | Fond de page, noir obsidienne chaud |
| `--color-abyss` / `--color-ink` | `#0b0806` / `#14100b` | Surfaces successives |
| `--color-ember` | `#e8761f` | **Couleur dominante** — action, énergie, Afrique |
| `--color-ember-soft` | `#ff9b45` | Accents lumineux, nœuds, halos |
| `--color-ember-deep` | `#9c4a12` | Ombres chaudes |
| `--color-azure` | `#2e5fb7` | **Secondaire** — technologie, robot, arcs mondiaux |
| `--color-azure-soft` | `#5d8ce0` | Liserés LED, atmosphère du globe |
| `--color-mist` | `#b3a89a` | Texte secondaire |
| `--color-frost` | `#f5efe8` | Texte principal |

**Typographies inchangées :** Space Grotesk (display) + Inter (corps), via
`next/font`.

**Répartition chromatique :** l'orange porte l'humain, l'action et l'Afrique ; le
bleu porte la machine et le rayonnement mondial. Leur rencontre au point de
contact des index est la signature visuelle de la marque.

---

## 2. Narration

L'expérience est une chaîne continue : chaque acte naît du précédent.

| Acte | Où | Ce qui se passe |
|---|---|---|
| 1. L'obscurité | Hero, `p=0` | Noir obsidienne ; les deux mains émergent déjà de la pénombre |
| 2. L'approche | Hero, `p → 0.86` | Les deux moitiés de l'image glissent l'une vers l'autre |
| 3. La tension | Hero, `p 0.56 → 0.86` | Un fuseau de particules ember se resserre entre les index |
| 4. Le contact | Hero, `p = 0.86` | Impulsion, onde, lignes de données, révélation du slogan |
| 5. La transmission | Hero, `p 0.94 → 1` | L'énergie devient un flux descendant vers le globe |
| 6. L'Afrique s'illumine | Globe, `p 0.30 → 0.62` | Vague d'activation ouest → est sur le continent |
| 7. Le réseau africain | Globe, `p 0.36 → 0.66` | Les 12 pôles d'innovation s'allument un par un |
| 8. Le rayonnement | Globe, `p 0.62 → 0.94` | 8 arcs partent d'Afrique vers le monde, impulsions circulantes |
| 9. Les applications | Sections suivantes | Les services réels, reliés aux nœuds du continent |
| 10. L'action | `FinalCTA` | Retour au geste initial, vers une route réelle |

---

## 3. Règles de mouvement

- **Trois mouvements dominants seulement** : le rapprochement des mains,
  l'impulsion du contact, la naissance et l'activation du globe. Tout le reste
  reste discret.
- `transform` et `opacity` uniquement ; aucun recalcul de mise en page.
- Le curseur ne fait que **nuancer** la perspective (±0,09 rad sur le globe,
  parallaxe caméra très faible sur le hero). Jamais de poursuite.
- **Une seule scène 3D tourne à la fois** : chaque `<Canvas>` suspend sa boucle
  (`frameloop="never"`) dès que sa section quitte l'écran.
- `prefers-reduced-motion` : le hero devient une image fixe avec les mains déjà
  en contact et le slogan lisible ; le globe passe en rendu à la demande — une
  seule image, aucun nœud qui pulse.
- Sans WebGL : les mains photoréalistes assurent seules le hero, et le globe
  bascule sur la version canvas 2D (`DigitalGlobe`).

---

## 4. Deux décisions structurantes

### Les particules ne dessinent plus les mains

À l'origine, la scène 3D échantillonnait des silhouettes de mains en nuages de
particules. Superposée à l'asset photoréaliste, cette couche produisait une
traînée orange décalée et un amas bleu incohérent : deux représentations des
mêmes mains qui se contredisaient.

Les particules ont donc changé de rôle : elles n'assurent plus que ce que
l'image fixe ne peut pas tenir — **la tension lumineuse entre les index, puis
l'impulsion**. Le fichier a été renommé `ContactEnergy.tsx` en conséquence.

### Le globe n'est pas une image générée

La géographie est une contrainte non négociable. Une image générée n'offre
aucune garantie sur la forme du continent, et un continent déformé ruinerait le
message. Le globe est donc construit en React Three Fiber à partir de
**coordonnées réelles** (`lib/geo/nodes.ts`) :

- littoral africain simplifié (43 sommets) + Madagascar, testés par
  point-dans-polygone pour illuminer les particules du continent ;
- 12 pôles d'innovation africains et 8 destinations mondiales aux vraies
  latitudes/longitudes ;
- le reste du globe est un **treillis neutre** : aucune masse continentale
  approximative, aucune frontière politique.

Higgsfield ne fournit que l'atmosphère derrière la scène.

---

## 5. Honnêteté du contenu

- Les points lumineux du globe sont une **visualisation conceptuelle de pôles
  d'innovation**. La mention est affichée sous la section : ils ne représentent
  ni bureaux, ni clients, ni implantations.
- Les six services reliés aux nœuds sont les services réels de `lib/data.ts` et
  pointent vers leurs vraies routes `/services/[slug]`.
- Aucun chiffre, partenaire, témoignage ni certification n'a été inventé.

---

## 6. Budget de performance

Mesuré sur cette machine (WebGL logiciel, donc pessimiste), page d'accueil :

| Métrique | Avant | Après |
|---|---|---|
| Performance Lighthouse | 28 | **41** |
| CLS | 0,272 | **0** |
| LCP | 5,2 s | 5,1 s |
| Speed Index | 2,1 s | 2,3 s |
| Total Blocking Time | 1 750 ms | 2 350 ms |
| First Load JS partagé | 232 ko | 233 ko |
| Poids total | 584 ko | 624 ko |

Règles à tenir pour la suite :

- **Aucune nouvelle dépendance** sans usage réel et mesure de poids.
- Les assets lourds restent en WebP, avec une variante mobile dédiée et un
  aperçu inline de 24 px pour éviter tout flash blanc.
- Les scènes 3D sont chargées dynamiquement, montées seulement à l'approche de
  leur section, et mises en pause hors écran.
- Ne jamais mettre `overflow-x: hidden` sur `html` ou `body` : cela casse les
  `position: sticky` du hero et du globe. Utiliser `clip`.
