/**
 * Données géographiques de l'acte « L'Afrique propulse l'intelligence ».
 *
 * IMPORTANT — nature de ces données :
 * - `AFRICA_OUTLINE` est une approximation du littoral africain destinée
 *   uniquement à la mise en lumière visuelle du continent. Ce n'est pas une
 *   carte politique : aucune frontière d'État n'est représentée.
 * - `AFRICAN_HUBS` et `WORLD_LINKS` sont des coordonnées de villes réelles
 *   utilisées comme visualisation conceptuelle de pôles d'innovation et de
 *   rayonnement. Elles ne représentent NI des bureaux, NI des clients, NI des
 *   implantations de Pro Genius AI.
 */

export type GeoPoint = {
  /** Latitude en degrés (-90 → 90) */
  lat: number;
  /** Longitude en degrés (-180 → 180) */
  lon: number;
  /** Libellé affiché uniquement dans les alternatives textuelles */
  label: string;
};

/**
 * Littoral africain simplifié — sens horaire depuis la Tunisie.
 * Résolution volontairement basse (43 sommets) : suffisante pour reconnaître
 * le continent, assez légère pour un test point-dans-polygone par particule.
 */
export const AFRICA_OUTLINE: [lat: number, lon: number][] = [
  [37.3, 9.8],
  [33.0, 22.0],
  [31.2, 27.3],
  [31.4, 31.6],
  [29.8, 32.6],
  [27.0, 34.0],
  [22.0, 36.9],
  [18.0, 38.6],
  [15.0, 40.0],
  [12.4, 43.4],
  [11.5, 51.3],
  [4.0, 48.5],
  [-1.0, 42.0],
  [-6.5, 39.5],
  [-11.0, 40.5],
  [-16.0, 40.0],
  [-21.0, 35.5],
  [-26.0, 33.0],
  [-30.0, 30.5],
  [-34.0, 25.5],
  [-34.8, 20.0],
  [-33.0, 18.0],
  [-28.0, 16.5],
  [-22.0, 14.5],
  [-17.0, 11.8],
  [-12.0, 13.5],
  [-6.0, 12.2],
  [-1.0, 9.3],
  [3.8, 9.6],
  [4.5, 6.5],
  [6.4, 3.4],
  [5.0, -1.0],
  [4.8, -7.5],
  [7.5, -12.5],
  [10.5, -15.5],
  [14.7, -17.5],
  [20.0, -17.0],
  [24.0, -15.0],
  [28.0, -11.0],
  [31.0, -9.8],
  [35.8, -5.9],
  [37.3, 9.8],
];

/** Madagascar — traitée à part pour rester reconnaissable. */
export const MADAGASCAR_OUTLINE: [lat: number, lon: number][] = [
  [-12.0, 49.3],
  [-15.5, 50.5],
  [-20.0, 48.8],
  [-25.0, 47.0],
  [-25.6, 45.2],
  [-22.0, 43.3],
  [-16.0, 44.4],
  [-12.0, 49.3],
];

/**
 * Test point-dans-polygone (ray casting) sur un contour [lat, lon].
 * Utilisé pour décider si une particule de la sphère appartient au continent.
 */
export function insidePolygon(
  lat: number,
  lon: number,
  poly: [number, number][]
): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [yi, xi] = poly[i];
    const [yj, xj] = poly[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

/** L'Afrique continentale ou Madagascar. */
export function inAfrica(lat: number, lon: number): boolean {
  return (
    insidePolygon(lat, lon, AFRICA_OUTLINE) ||
    insidePolygon(lat, lon, MADAGASCAR_OUTLINE)
  );
}

/**
 * Pôles d'innovation africains — visualisation conceptuelle.
 * Abidjan est placée en tête : c'est le point d'ancrage réel de Pro Genius AI
 * (cf. `contact.direct.location`).
 */
export const AFRICAN_HUBS: GeoPoint[] = [
  { lat: 5.36, lon: -4.01, label: "Abidjan" },
  { lat: 6.52, lon: 3.38, label: "Lagos" },
  { lat: 5.6, lon: -0.19, label: "Accra" },
  { lat: 14.72, lon: -17.47, label: "Dakar" },
  { lat: -1.29, lon: 36.82, label: "Nairobi" },
  { lat: -1.94, lon: 30.06, label: "Kigali" },
  { lat: 30.04, lon: 31.24, label: "Le Caire" },
  { lat: 33.57, lon: -7.59, label: "Casablanca" },
  { lat: -26.2, lon: 28.05, label: "Johannesburg" },
  { lat: 9.03, lon: 38.74, label: "Addis-Abeba" },
  { lat: 12.65, lon: -8.0, label: "Bamako" },
  { lat: 6.13, lon: 1.22, label: "Lomé" },
];

/**
 * Destinations du rayonnement mondial. Les arcs partent d'Afrique vers
 * ces points : le sens de la flèche porte tout le message.
 */
export const WORLD_LINKS: GeoPoint[] = [
  { lat: 48.86, lon: 2.35, label: "Paris" },
  { lat: 51.51, lon: -0.13, label: "Londres" },
  { lat: 40.71, lon: -74.01, label: "New York" },
  { lat: 25.2, lon: 55.27, label: "Dubaï" },
  { lat: 1.35, lon: 103.82, label: "Singapour" },
  { lat: -23.55, lon: -46.63, label: "São Paulo" },
  { lat: 35.68, lon: 139.69, label: "Tokyo" },
  { lat: 52.52, lon: 13.405, label: "Berlin" },
];

/**
 * Conversion latitude/longitude → position cartésienne sur une sphère de
 * rayon `r`. Convention alignée sur la rotation appliquée dans la scène :
 * longitude 0 face à la caméra quand la rotation Y vaut 0.
 */
export function latLonToVec3(
  lat: number,
  lon: number,
  r = 1
): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return [
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  ];
}
