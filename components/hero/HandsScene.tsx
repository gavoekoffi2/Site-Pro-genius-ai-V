"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

/* ————————————————————————————————————————————————————————
   Échantillonnage d'une main tendue (style « Création d'Adam »)
   dessinée en silhouette sur un canvas hors écran, puis
   convertie en nuage de particules.
———————————————————————————————————————————————————————— */

const W = 640;
const H = 400;

function drawHandSilhouette(): Uint8ClampedArray | null {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const seg = (x1: number, y1: number, x2: number, y2: number, w: number) => {
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(x1 * W, y1 * H);
    ctx.lineTo(x2 * W, y2 * H);
    ctx.stroke();
  };

  // Avant-bras (deux segments pour un effet fuselé)
  seg(-0.05, 0.66, 0.2, 0.6, 0.19 * H);
  seg(0.18, 0.61, 0.36, 0.56, 0.14 * H);

  // Paume
  ctx.save();
  ctx.translate(0.45 * W, 0.53 * H);
  ctx.rotate(-0.16);
  ctx.beginPath();
  ctx.ellipse(0, 0, 0.078 * W, 0.115 * H, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Doigts — l'index tendu vers l'autre main
  seg(0.5, 0.45, 0.73, 0.365, 0.055 * H); // index
  seg(0.52, 0.5, 0.675, 0.455, 0.052 * H); // majeur, semi replié
  seg(0.52, 0.56, 0.645, 0.55, 0.05 * H); // annulaire
  seg(0.5, 0.615, 0.595, 0.625, 0.042 * H); // auriculaire
  seg(0.43, 0.62, 0.53, 0.71, 0.06 * H); // pouce

  return ctx.getImageData(0, 0, W, H).data;
}

/** Convertit la silhouette en positions 3D. mode grid = main robotique. */
function sampleHand(count: number, grid: boolean, mirror: boolean) {
  const data = drawHandSilhouette();
  const positions: number[] = [];
  const rand: number[] = [];

  const push = (px: number, py: number) => {
    const lx = (px / W - 0.42) * 3.2 * (mirror ? -1 : 1);
    const ly = (0.5 - py / H) * 2.0;
    const lz = (Math.random() - 0.5) * (grid ? 0.12 : 0.22);
    positions.push(lx, ly, lz);
    rand.push(Math.random(), Math.random(), Math.random());
  };

  if (data) {
    if (grid) {
      const step = 5;
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          if (data[(y * W + x) * 4 + 3] > 128 && positions.length / 3 < count) {
            push(x + (Math.random() - 0.5) * 0.8, y + (Math.random() - 0.5) * 0.8);
          }
        }
      }
    } else {
      let guard = count * 60;
      while (positions.length / 3 < count && guard-- > 0) {
        const x = Math.floor(Math.random() * W);
        const y = Math.floor(Math.random() * H);
        if (data[(y * W + x) * 4 + 3] > 128) push(x, y);
      }
    }
  }

  // Filet de sécurité si le canvas est indisponible : nuage elliptique
  if (positions.length === 0) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random());
      push(W * (0.42 + Math.cos(a) * r * 0.3), H * (0.5 + Math.sin(a) * r * 0.35));
    }
  }

  return {
    positions: new Float32Array(positions),
    rand: new Float32Array(rand),
    count: positions.length / 3,
  };
}

/* ————————————————————————————————————————————————————————
   Shader des particules
———————————————————————————————————————————————————————— */

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uBurst;
  uniform float uAmp;
  uniform float uSize;
  attribute vec3 aRand;
  varying float vSeed;
  varying float vBurst;

  void main() {
    vSeed = aRand.x;
    vBurst = uBurst;
    vec3 p = position;

    // respiration organique
    p.x += sin(uTime * (0.6 + aRand.x) + aRand.y * 6.28) * uAmp;
    p.y += cos(uTime * (0.5 + aRand.y) + aRand.z * 6.28) * uAmp;
    p.z += sin(uTime * (0.4 + aRand.z) + aRand.x * 6.28) * uAmp * 0.6;

    // onde d'énergie à la connexion
    vec3 dir = normalize(p + vec3(aRand.x - 0.5, aRand.y - 0.5, aRand.z - 0.5) * 2.0 + 0.0001);
    p += dir * uBurst * (0.3 + aRand.y * 1.5);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.6 + aRand.z * 0.9) * (1.0 + uBurst * 0.4) * (300.0 / -mv.z) * 0.01;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vSeed;
  varying float vBurst;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.08, d);
    vec3 col = mix(uColorA, uColorB, vSeed);
    col += vBurst * 0.5; // flash blanc à l'impact
    // les particules se dissolvent dans l'onde pour laisser place au slogan
    gl_FragColor = vec4(col, alpha * (0.42 + vSeed * 0.38) * (1.0 - vBurst * 0.88));
  }
`;

type SceneRefs = {
  progress: MutableRefObject<number>;
};

function ParticleHand({
  mirror,
  grid,
  colorA,
  colorB,
  amp,
  size,
  count,
  startX,
  endX,
  scale = 1,
  progress,
}: {
  mirror: boolean;
  grid: boolean;
  colorA: string;
  colorB: string;
  amp: number;
  size: number;
  count: number;
  startX: number;
  endX: number;
  scale?: number;
  progress: MutableRefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);

  const { positions, rand } = useMemo(() => sampleHand(count, grid, mirror), [count, grid, mirror]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBurst: { value: 0 },
      uAmp: { value: amp },
      uSize: { value: size },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame(({ clock }) => {
    const p = THREE.MathUtils.clamp(progress.current, 0, 1);
    const eased = 1 - Math.pow(1 - Math.min(p / 0.86, 1), 2.2); // approche décélérée
    const burst = THREE.MathUtils.smoothstep(p, 0.86, 1);

    if (group.current) {
      group.current.position.x = THREE.MathUtils.lerp(startX, endX, eased);
      group.current.position.y = Math.sin(clock.elapsedTime * 0.6 + (mirror ? 2 : 0)) * 0.04 * (1 - burst);
      group.current.rotation.z = (mirror ? -1 : 1) * 0.03 * Math.sin(clock.elapsedTime * 0.4);
    }
    if (mat.current) {
      mat.current.uniforms.uTime.value = clock.elapsedTime;
      mat.current.uniforms.uBurst.value = burst;
      mat.current.uniforms.uAmp.value = amp * (1 - eased * 0.55); // les mains se « concentrent » en approchant
    }
  });

  return (
    <group ref={group} position={[startX, 0, 0]} scale={scale}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aRand" args={[rand, 3]} />
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
    </group>
  );
}

/** Onde de choc + halo au point de contact. */
function Shockwave({ progress }: SceneRefs) {
  const ring = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const flash = useRef<THREE.Mesh>(null);

  const flashTexture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d");
    if (ctx) {
      const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      g.addColorStop(0, "rgba(255,242,225,1)");
      g.addColorStop(0.25, "rgba(255,180,105,0.55)");
      g.addColorStop(0.6, "rgba(230,120,40,0.16)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 256, 256);
    }
    return new THREE.CanvasTexture(c);
  }, []);

  useFrame(() => {
    const p = THREE.MathUtils.clamp(progress.current, 0, 1);
    const burst = THREE.MathUtils.smoothstep(p, 0.86, 1);

    if (ring.current) {
      const s = 0.2 + burst * 5.2;
      ring.current.scale.setScalar(s);
      (ring.current.material as THREE.MeshBasicMaterial).opacity = burst > 0 ? (1 - burst) * 0.75 : 0;
    }
    if (ring2.current) {
      const s = 0.1 + burst * 3.1;
      ring2.current.scale.setScalar(s);
      (ring2.current.material as THREE.MeshBasicMaterial).opacity = burst > 0 ? (1 - burst) * 0.5 : 0;
    }
    if (flash.current) {
      const pulse = Math.sin(Math.min(burst * Math.PI, Math.PI));
      flash.current.scale.setScalar(0.5 + burst * 4.5);
      (flash.current.material as THREE.MeshBasicMaterial).opacity = pulse * 0.95;
    }
  });

  return (
    <group position={[0, 0.26, 0]}>
      <mesh ref={flash}>
        <planeGeometry args={[1.6, 1.6]} />
        <meshBasicMaterial
          map={flashTexture}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={ring}>
        <ringGeometry args={[0.46, 0.5, 80]} />
        <meshBasicMaterial color="#ff9b45" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={ring2} rotation={[0.5, 0.3, 0]}>
        <ringGeometry args={[0.47, 0.49, 80]} />
        <meshBasicMaterial color="#5d8ce0" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

/** Parallax caméra très doux piloté par la souris. */
function CameraRig() {
  const { camera, pointer } = useThree();
  useFrame(() => {
    camera.position.x += (pointer.x * 0.22 - camera.position.x) * 0.04;
    camera.position.y += (pointer.y * 0.14 - camera.position.y) * 0.04;
    camera.lookAt(0, 0.1, 0);
  });
  return null;
}

export default function HandsScene({ progress }: SceneRefs) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const humanCount = isMobile ? 2200 : 4600;
  const robotCount = isMobile ? 1800 : 3600;
  // Sur mobile, le champ visible est étroit : la scène est réduite
  // pour que les mains restent au centre du cadre.
  const s = isMobile ? 0.56 : 1;

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 4.4], fov: 45 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      <CameraRig />

      {/* Main humaine — chaleur organique, l'orange de la marque */}
      <ParticleHand
        mirror={false}
        grid={false}
        colorA="#ffffff"
        colorB="#ffab5e"
        amp={0.018}
        size={isMobile ? 13 : 15}
        count={humanCount}
        startX={isMobile ? -1.2 : -2.05}
        endX={-0.74 * s}
        scale={s}
        progress={progress}
      />

      {/* Main androïde — précision numérique, le bleu secondaire */}
      <ParticleHand
        mirror={true}
        grid={true}
        colorA="#5d8ce0"
        colorB="#2e5fb7"
        amp={0.007}
        size={isMobile ? 12 : 14}
        count={robotCount}
        startX={isMobile ? 1.2 : 2.05}
        endX={0.74 * s}
        scale={s}
        progress={progress}
      />

      <group scale={s}>
        <Shockwave progress={progress} />
      </group>

      <Sparkles count={isMobile ? 40 : 90} scale={[9, 5, 3]} size={1.6} speed={0.25} opacity={0.35} color="#ffc08a" />
    </Canvas>
  );
}
