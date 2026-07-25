"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  AFRICAN_HUBS,
  WORLD_LINKS,
  inAfrica,
  latLonToVec3,
} from "@/lib/geo/nodes";

/* ————————————————————————————————————————————————————————
   Acte du globe — l'Afrique crée, maîtrise et propulse l'IA.

   Géographie : la position de chaque particule et de chaque nœud provient de
   coordonnées lat/lon réelles (cf. lib/geo/nodes.ts). Le continent est mis en
   lumière par un test point-dans-polygone sur un littoral simplifié ; le reste
   du globe reste un treillis neutre, sans frontière politique ni masse
   continentale approximative.
———————————————————————————————————————————————————————— */

/** Rotation Y qui amène le centre de l'Afrique (0°N, 20°E) face à la caméra. */
const AFRICA_FACING_Y = THREE.MathUtils.degToRad(-110);
/** Rotation supplémentaire parcourue pendant le scroll avant stabilisation. */
const SPIN = 2.6;

/** Chaque destination mondiale part du pôle africain le plus crédible. */
const ARC_ROUTES: [hubIndex: number, worldIndex: number][] = [
  [7, 0], // Casablanca → Paris
  [1, 1], // Lagos → Londres
  [0, 2], // Abidjan → New York
  [6, 3], // Le Caire → Dubaï
  [4, 4], // Nairobi → Singapour
  [3, 5], // Dakar → São Paulo
  [9, 6], // Addis-Abeba → Tokyo
  [2, 7], // Accra → Berlin
];

/* ————————————————————————————————————————————————————————
   Treillis terrestre
———————————————————————————————————————————————————————— */

const dotsVertex = /* glsl */ `
  uniform float uTime;
  uniform float uReveal;
  uniform float uSize;
  attribute float aAfrica;
  attribute float aSeed;
  varying float vAfrica;
  varying float vAlpha;

  void main() {
    vAfrica = aAfrica;

    vec3 p = position;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);

    // Les particules africaines s'allument en vague, d'ouest en est.
    float wave = smoothstep(0.0, 1.0, uReveal * 1.6 - aSeed * 0.6);
    float lit = mix(0.18, 1.0, wave) * aAfrica + (1.0 - aAfrica) * 0.5;

    // Respiration très légère du continent activé
    lit *= 1.0 + aAfrica * wave * 0.16 * sin(uTime * 1.4 + aSeed * 6.28);

    vAlpha = lit;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (aAfrica > 0.5 ? 1.45 : 1.0) * (1.0 + wave * aAfrica * 0.35) * (300.0 / -mv.z) * 0.01;
  }
`;

const dotsFragment = /* glsl */ `
  uniform vec3 uAfricaColor;
  uniform vec3 uWorldColor;
  varying float vAfrica;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float mask = smoothstep(0.5, 0.1, d);
    vec3 col = mix(uWorldColor, uAfricaColor, vAfrica);
    // Blending additif : des alphas volontairement bas évitent que le
    // continent ne se transforme en tache surexposée et gardent le réseau
    // de points lisible.
    float a = mask * vAlpha * mix(0.20, 0.55, vAfrica);
    gl_FragColor = vec4(col, a);
  }
`;

function EarthDots({ progress, count }: { progress: MutableRefObject<number>; count: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);

  const { positions, africa, seeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const afr = new Float32Array(count);
    const sd = new Float32Array(count);
    const golden = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
      // Répartition de Fibonacci : densité homogène sur la sphère
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;

      const lat = Math.asin(THREE.MathUtils.clamp(y, -1, 1)) * (180 / Math.PI);
      // Convention identique à latLonToVec3 (x = sinφ·cos L, z = −sinφ·sin L),
      // sinon le continent est mirroré en longitude par rapport aux nœuds.
      const lon = Math.atan2(-z, x) * (180 / Math.PI);
      const isAfrica = inAfrica(lat, lon);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      afr[i] = isAfrica ? 1 : 0;
      // Graine croissante avec la longitude → vague d'activation ouest→est
      sd[i] = (lon + 180) / 360;
    }
    return { positions: pos, africa: afr, seeds: sd };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uSize: { value: 10 },
      uAfricaColor: { value: new THREE.Color("#ffab5e") },
      uWorldColor: { value: new THREE.Color("#8fa4c8") },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value = clock.elapsedTime;
    // L'Afrique s'illumine entre 0.30 et 0.62 de la section
    mat.current.uniforms.uReveal.value = THREE.MathUtils.clamp(
      (progress.current - 0.3) / 0.32,
      0,
      1
    );
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aAfrica" args={[africa, 1]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={dotsVertex}
        fragmentShader={dotsFragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ————————————————————————————————————————————————————————
   Nœuds d'innovation africains
———————————————————————————————————————————————————————— */

function HubNodes({ progress }: { progress: MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);

  const hubs = useMemo(
    () => AFRICAN_HUBS.map((h) => latLonToVec3(h.lat, h.lon, 1.012)),
    []
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    const p = progress.current;
    group.current.children.forEach((child, i) => {
      // Les nœuds s'allument un par un entre 0.36 et 0.66
      const start = 0.36 + (i / hubs.length) * 0.3;
      const on = THREE.MathUtils.clamp((p - start) / 0.06, 0, 1);
      const pulse = 1 + Math.sin(clock.elapsedTime * 2 + i) * 0.18 * on;
      child.scale.setScalar(on * pulse);
      const m = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      m.opacity = on * 0.95;
    });
  });

  return (
    <group ref={group}>
      {hubs.map((p, i) => (
        <mesh key={i} position={p} scale={0}>
          <sphereGeometry args={[0.016, 10, 10]} />
          <meshBasicMaterial
            color="#ffc08a"
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ————————————————————————————————————————————————————————
   Arcs de rayonnement — de l'Afrique vers le monde
———————————————————————————————————————————————————————— */

const ARC_SEGMENTS = 64;

function Arcs({ progress }: { progress: MutableRefObject<number> }) {
  const pulses = useRef<THREE.Group>(null);

  const arcs = useMemo(() => {
    return ARC_ROUTES.map(([hi, wi]) => {
      const hub = AFRICAN_HUBS[hi];
      const dest = WORLD_LINKS[wi];
      const a = new THREE.Vector3(...latLonToVec3(hub.lat, hub.lon, 1));
      const b = new THREE.Vector3(...latLonToVec3(dest.lat, dest.lon, 1));

      // Hauteur de l'arc proportionnelle à la distance parcourue
      const lift = 1 + a.distanceTo(b) * 0.42;
      const mid = a.clone().add(b).normalize().multiplyScalar(lift);
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);

      const pts = curve.getPoints(ARC_SEGMENTS);
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      geo.setDrawRange(0, 0);

      const line = new THREE.Line(
        geo,
        new THREE.LineBasicMaterial({
          color: "#5d8ce0",
          transparent: true,
          opacity: 0.5,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      );

      return { curve, line, geo };
    });
  }, []);

  useFrame(({ clock }) => {
    const p = progress.current;

    arcs.forEach((arc, i) => {
      // Les arcs se tracent un par un entre 0.62 et 0.94 : le rayonnement
      // arrive APRÈS l'activation du continent, jamais avant.
      const start = 0.62 + (i / arcs.length) * 0.26;
      const t = THREE.MathUtils.clamp((p - start) / 0.1, 0, 1);
      arc.geo.setDrawRange(0, Math.floor(t * (ARC_SEGMENTS + 1)));
      (arc.line.material as THREE.LineBasicMaterial).opacity = t * 0.55;

      // Impulsion qui circule le long de l'arc tracé
      const pulse = pulses.current?.children[i];
      if (pulse) {
        if (t > 0.99) {
          const u = (clock.elapsedTime * 0.28 + i * 0.17) % 1;
          pulse.position.copy(arc.curve.getPoint(u));
          pulse.scale.setScalar(1);
        } else {
          pulse.scale.setScalar(0);
        }
      }
    });
  });

  return (
    <group>
      {arcs.map((a, i) => (
        <primitive key={i} object={a.line} />
      ))}
      <group ref={pulses}>
        {arcs.map((_, i) => (
          <mesh key={i} scale={0}>
            <sphereGeometry args={[0.014, 8, 8]} />
            <meshBasicMaterial
              color="#ffd9b0"
              transparent
              opacity={0.9}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ————————————————————————————————————————————————————————
   Atmosphère + rotation pilotée par le scroll
———————————————————————————————————————————————————————— */

function Atmosphere() {
  return (
    <mesh scale={1.16}>
      <sphereGeometry args={[1, 48, 48]} />
      <meshBasicMaterial
        color="#2e5fb7"
        transparent
        opacity={0.055}
        side={THREE.BackSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function GlobeGroup({
  progress,
  count,
  reduced,
}: {
  progress: MutableRefObject<number>;
  count: number;
  reduced: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!group.current) return;

    if (reduced) {
      group.current.rotation.set(0.18, AFRICA_FACING_Y, 0);
      return;
    }

    const p = THREE.MathUtils.clamp(progress.current, 0, 1);
    // Le globe tourne pour présenter l'Afrique, puis se stabilise à 0.42.
    const eased = 1 - Math.pow(1 - Math.min(p / 0.42, 1), 2.4);
    const targetY = AFRICA_FACING_Y - SPIN * (1 - eased);

    // Le curseur ne fait que nuancer la perspective (±0.09 rad max)
    group.current.rotation.y += (targetY + pointer.x * 0.09 - group.current.rotation.y) * 0.08;
    group.current.rotation.x += (0.18 + pointer.y * 0.05 - group.current.rotation.x) * 0.08;
  });

  return (
    <group ref={group} rotation={[0.18, AFRICA_FACING_Y - SPIN, 0]}>
      <Atmosphere />
      <EarthDots progress={progress} count={count} />
      <HubNodes progress={progress} />
      <Arcs progress={progress} />
    </group>
  );
}

export default function GlobeCanvas({
  progress,
  reduced = false,
  active = true,
}: {
  progress: MutableRefObject<number>;
  reduced?: boolean;
  /** Boucle de rendu suspendue dès que l'acte du globe quitte l'écran. */
  active?: boolean;
}) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  // Mobile : moitié des particules, rotation et réseau allégés
  const count = isMobile ? 3000 : 5600;

  return (
    <Canvas
      /* reduced-motion : rendu à la demande → une seule image statique, les
         nœuds ne pulsent pas et les impulsions ne circulent pas.
         Sinon : boucle active uniquement quand la section est visible. */
      frameloop={reduced ? "demand" : active ? "always" : "never"}
      dpr={[1, isMobile ? 1.5 : 1.75]}
      camera={{ position: [0, 0, 3.4], fov: 42 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      <GlobeGroup progress={progress} count={count} reduced={reduced} />
    </Canvas>
  );
}
