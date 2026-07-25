"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ————————————————————————————————————————————————————————
   Énergie du contact.

   Les mains elles-mêmes sont portées par l'asset photoréaliste
   (`PhotorealHands`). Cette scène ne rejoue donc PAS des silhouettes de
   mains — elle assure le seul rôle que l'image fixe ne peut pas tenir :
   la tension lumineuse entre les deux index, puis l'impulsion, l'onde et
   les lignes de données au moment exact du contact.
———————————————————————————————————————————————————————— */

/** Progression à laquelle les index se touchent. */
const IMPACT = 0.86;

/**
 * Où les deux index se rejoignent DANS chaque asset, en fraction de l'image
 * (0,0 = coin haut-gauche). Mesuré sur les fichiers livrés.
 */
const CONTACT_IN_ASSET = {
  horizontal: { x: 0.497, y: 0.466, aspect: 1920 / 1072 },
  vertical: { x: 0.495, y: 0.48, aspect: 1080 / 1935 },
} as const;

/**
 * Position monde du point de contact.
 *
 * L'image est affichée en `object-fit: cover` : selon le rapport de la fenêtre
 * elle est rognée en largeur ou en hauteur. Sans reproduire ce calcul,
 * l'énergie se décale du contact réel dès que le rapport change — c'était
 * visible sur mobile. On convertit donc la position dans l'asset en fraction
 * d'écran, puis en unités monde via le viewport de la caméra.
 */
function useContactPoint(vertical: boolean): [number, number] {
  const { viewport, size } = useThree();
  const cfg = vertical ? CONTACT_IN_ASSET.vertical : CONTACT_IN_ASSET.horizontal;

  const viewAspect = size.width / size.height;
  let fx = cfg.x;
  let fy = cfg.y;

  if (cfg.aspect > viewAspect) {
    // Rognage horizontal : la hauteur correspond, la largeur dépasse.
    const shownW = size.height * cfg.aspect;
    fx = (cfg.x * shownW - (shownW - size.width) / 2) / size.width;
  } else {
    // Rognage vertical : la largeur correspond, la hauteur dépasse.
    const shownH = size.width / cfg.aspect;
    fy = (cfg.y * shownH - (shownH - size.height) / 2) / size.height;
  }

  return [(fx - 0.5) * viewport.width, (0.5 - fy) * viewport.height];
}

/** Montée de la tension lumineuse avant le contact. */
const tensionAt = (p: number) => THREE.MathUtils.clamp((p - 0.56) / 0.3, 0, 1);

/* ————————————————————————————————————————————————————————
   Particules de tension → éclat
———————————————————————————————————————————————————————— */

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uBurst;
  uniform float uTension;
  uniform float uSize;
  attribute vec3 aDir;
  attribute float aSeed;
  varying float vSeed;
  varying float vBurst;

  void main() {
    vSeed = aSeed;
    vBurst = uBurst;

    // Avant le contact : les particules restent confinées dans un fuseau
    // très étroit entre les deux index, et frémissent de plus en plus.
    vec3 p = position;
    p.x *= 0.22 + uTension * 0.30;
    p.y *= 0.60 + uTension * 0.55;
    p.z *= 0.30;

    p += aDir * uTension * 0.04 * sin(uTime * (2.4 + aSeed * 3.0) + aSeed * 6.28);

    // Au contact : projection radiale, l'énergie se libère.
    p += aDir * uBurst * (0.35 + aSeed * 2.4);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.5 + aSeed * 0.8) * (1.0 + uBurst * 0.6) * (300.0 / -mv.z) * 0.01;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uTension;
  varying float vSeed;
  varying float vBurst;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float mask = smoothstep(0.5, 0.05, d);
    vec3 col = mix(uColorA, uColorB, vSeed);
    // Visible seulement quand la tension monte. Après l'éclat les particules
    // s'éteignent presque totalement (puissance 3) : sans cela elles se
    // dispersent en confettis sur tout l'écran derrière le slogan.
    float decay = pow(1.0 - vBurst, 3.0);
    float life = (0.10 + uTension * 0.85) * decay;
    gl_FragColor = vec4(col, mask * life * (0.5 + vSeed * 0.5));
  }
`;

function EnergyCore({
  progress,
  count,
  size,
  contact,
}: {
  progress: MutableRefObject<number>;
  count: number;
  size: number;
  contact: [number, number];
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);

  const { positions, dirs, seeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const dir = new Float32Array(count * 3);
    const sd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Répartition sphérique concentrée autour du point de contact
      const r = Math.pow(Math.random(), 0.6);
      const a = Math.random() * Math.PI * 2;
      const b = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(b) * Math.cos(a);
      const y = r * Math.sin(b) * Math.sin(a);
      const z = r * Math.cos(b);
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      const n = Math.hypot(x, y, z) || 1;
      dir[i * 3] = x / n;
      dir[i * 3 + 1] = y / n;
      dir[i * 3 + 2] = z / n;
      sd[i] = Math.random();
    }
    return { positions: pos, dirs: dir, seeds: sd };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBurst: { value: 0 },
      uTension: { value: 0 },
      uSize: { value: size },
      uColorA: { value: new THREE.Color("#fff0dc") },
      uColorB: { value: new THREE.Color("#ff9b45") },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame(({ clock }) => {
    if (!mat.current) return;
    const p = THREE.MathUtils.clamp(progress.current, 0, 1);
    mat.current.uniforms.uTime.value = clock.elapsedTime;
    mat.current.uniforms.uTension.value = tensionAt(p);
    mat.current.uniforms.uBurst.value = THREE.MathUtils.smoothstep(p, IMPACT, 1);
  });

  return (
    <points position={[contact[0], contact[1], 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aDir" args={[dirs, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ————————————————————————————————————————————————————————
   Onde de choc + halo — volontairement retenus pour ne jamais
   effacer les mains photoréalistes.
———————————————————————————————————————————————————————— */

function Shockwave({
  progress,
  contact,
}: {
  progress: MutableRefObject<number>;
  contact: [number, number];
}) {
  const ring = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);

  const haloTexture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d");
    if (ctx) {
      const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      g.addColorStop(0, "rgba(255,242,225,0.95)");
      g.addColorStop(0.22, "rgba(255,180,105,0.42)");
      g.addColorStop(0.55, "rgba(230,120,40,0.12)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 256, 256);
    }
    return new THREE.CanvasTexture(c);
  }, []);

  useFrame(() => {
    const p = THREE.MathUtils.clamp(progress.current, 0, 1);
    const tension = tensionAt(p);
    // L'onde est un événement bref : elle naît à l'impact et a totalement
    // disparu à 0.94, pour laisser le slogan seul sur les mains jointes.
    const wave = THREE.MathUtils.clamp((p - IMPACT) / 0.08, 0, 1);
    // Enveloppe piquée : montée immédiate, extinction franche.
    const env = Math.pow(1 - wave, 2) * Math.min(wave * 4, 1);

    if (ring.current) {
      ring.current.scale.setScalar(0.15 + wave * 3.1);
      (ring.current.material as THREE.MeshBasicMaterial).opacity = env * 0.8;
    }
    if (ring2.current) {
      ring2.current.scale.setScalar(0.1 + wave * 1.9);
      (ring2.current.material as THREE.MeshBasicMaterial).opacity = env * 0.5;
    }
    if (halo.current) {
      // Le halo pré-existe discrètement (la tension), puis pulse à l'impact
      halo.current.scale.setScalar(0.28 + tension * 0.3 + wave * 1.3);
      (halo.current.material as THREE.MeshBasicMaterial).opacity =
        tension * 0.3 * (1 - wave) + env * 0.5;
    }
  });

  return (
    <group position={[contact[0], contact[1], 0]}>
      <mesh ref={halo}>
        <planeGeometry args={[1.6, 1.6]} />
        <meshBasicMaterial
          map={haloTexture}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={ring}>
        <ringGeometry args={[0.47, 0.5, 96]} />
        <meshBasicMaterial
          color="#ffb066"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={ring2} rotation={[0.55, 0.3, 0]}>
        <ringGeometry args={[0.48, 0.495, 96]} />
        <meshBasicMaterial
          color="#5d8ce0"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/* ————————————————————————————————————————————————————————
   Lignes de données — n'apparaissent qu'au contact
———————————————————————————————————————————————————————— */

function DataLines({
  progress,
  count,
  contact,
}: {
  progress: MutableRefObject<number>;
  count: number;
  contact: [number, number];
}) {
  const group = useRef<THREE.Group>(null);

  const lines = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        angle: (i / count) * Math.PI * 2 + Math.random() * 0.3,
        len: 0.5 + Math.random() * 1.5,
        seed: Math.random(),
      })),
    [count]
  );

  useFrame(() => {
    if (!group.current) return;
    const p = THREE.MathUtils.clamp(progress.current, 0, 1);
    const burst = THREE.MathUtils.smoothstep(p, IMPACT, 1);
    group.current.children.forEach((child, i) => {
      const l = lines[i];
      const t = THREE.MathUtils.clamp((burst - l.seed * 0.25) / 0.5, 0, 1);
      child.scale.set(t * l.len, 1, 1);
      const m = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      m.opacity = t * (1 - t) * 1.7;
    });
  });

  return (
    <group ref={group} position={[contact[0], contact[1], 0]}>
      {lines.map((l, i) => (
        <mesh key={i} rotation={[0, 0, l.angle]} scale={[0, 1, 1]}>
          <planeGeometry args={[1, 0.0055]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? "#5d8ce0" : "#ffc08a"}
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

/** Parallax caméra très doux piloté par la souris. */
function CameraRig() {
  const { camera, pointer } = useThree();
  useFrame(() => {
    camera.position.x += (pointer.x * 0.18 - camera.position.x) * 0.04;
    camera.position.y += (pointer.y * 0.11 - camera.position.y) * 0.04;
    camera.lookAt(0, 0.1, 0);
  });
  return null;
}

/**
 * Contenu de la scène. Séparé du `<Canvas>` car `useContactPoint` a besoin du
 * contexte react-three-fiber (viewport + taille du rendu).
 */
function Scene({
  progress,
  vertical,
  count,
  size,
  lines,
}: {
  progress: MutableRefObject<number>;
  vertical: boolean;
  count: number;
  size: number;
  lines: number;
}) {
  const contact = useContactPoint(vertical);

  return (
    <>
      <CameraRig />
      <EnergyCore progress={progress} count={count} size={size} contact={contact} />
      <Shockwave progress={progress} contact={contact} />
      <DataLines progress={progress} count={lines} contact={contact} />
    </>
  );
}

export default function ContactEnergy({
  progress,
  vertical,
  active = true,
}: {
  progress: MutableRefObject<number>;
  vertical: boolean;
  /** Boucle de rendu suspendue dès que le hero quitte l'écran. */
  active?: boolean;
}) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, vertical ? 1.5 : 1.75]}
      camera={{ position: [0, 0, 4.4], fov: 45 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      <Scene
        progress={progress}
        vertical={vertical}
        count={vertical ? 900 : 2000}
        size={vertical ? 11 : 13}
        lines={vertical ? 14 : 26}
      />
    </Canvas>
  );
}
