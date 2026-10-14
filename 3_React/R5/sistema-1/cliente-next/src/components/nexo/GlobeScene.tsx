"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdditiveBlending, Color, type Group, type Mesh } from "three";

interface GlobeSceneProps {
  dark: boolean;
  reduced: boolean;
}

const DOTS = 4200;

// puntos repartidos parejo sobre la esfera (espiral de Fibonacci)
function fibonacciSphere(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const ring = Math.sqrt(1 - y * y);
    const angle = golden * i;
    positions.set([Math.cos(angle) * ring * radius, y * radius, Math.sin(angle) * ring * radius], i * 3);
  }
  return positions;
}

// los puntos del frente brillan, los de atrás casi desaparecen y el borde toma el color de acento
const vertexShader = /* glsl */ `
  uniform float uSize;
  uniform float uPixelRatio;
  varying vec3 vNormal;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * position);
    gl_PointSize = uSize * uPixelRatio * (6.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uAccent;
  varying vec3 vNormal;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float front = smoothstep(-0.2, 0.6, vNormal.z);
    float rim = pow(1.0 - abs(vNormal.z), 3.0);
    float light = max(dot(vNormal, normalize(vec3(-0.7, 0.6, 0.5))), 0.0);
    vec3 color = mix(uBase, uAccent, clamp(rim * 1.4 + (1.0 - light) * 0.15, 0.0, 1.0));
    float alpha = (0.08 + front * (0.35 + light * 0.65) + rim * 0.5) * smoothstep(0.5, 0.2, d);
    gl_FragColor = vec4(color, alpha);
  }
`;

function DotSphere({ dark }: { dark: boolean }) {
  const positions = useMemo(() => fibonacciSphere(DOTS, 1.6), []);
  const uniforms = useMemo(
    () => ({
      uSize: { value: 3.2 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uBase: { value: new Color() },
      uAccent: { value: new Color() },
    }),
    [],
  );
  uniforms.uBase.value.set(dark ? "#d7e6ff" : "#16324a");
  uniforms.uAccent.value.set(dark ? "#c7ff58" : "#4c8a12");
  // con movimiento reducido el lienzo dibuja a pedido: el cambio de tema pide un cuadro nuevo
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => invalidate(), [dark, invalidate]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} transparent depthWrite={false} />
    </points>
  );
}

// anillo orbital con un halo suave y un satélite que lo recorre
function Orbit({ dark, reduced }: GlobeSceneProps) {
  const satellite = useRef<Mesh>(null);
  const accent = dark ? "#c7ff58" : "#5c9e1a";

  useFrame(({ clock }) => {
    if (!satellite.current) return;
    const t = reduced ? 0.8 : clock.getElapsedTime() * 0.35;
    satellite.current.position.set(Math.cos(t) * 2.15, Math.sin(t) * 2.15, 0);
  });

  return (
    <group rotation={[1.15, 0.35, -0.5]}>
      <mesh>
        <torusGeometry args={[2.15, 0.012, 16, 220]} />
        <meshBasicMaterial color={accent} toneMapped={false} />
      </mesh>
      <mesh>
        <torusGeometry args={[2.15, 0.035, 16, 220]} />
        <meshBasicMaterial color={accent} transparent opacity={dark ? 0.18 : 0.12} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={satellite}>
        <sphereGeometry args={[0.05, 24, 24]} />
        <meshBasicMaterial color={accent} toneMapped={false} />
      </mesh>
    </group>
  );
}

// gira despacio y se inclina hacia el puntero con un resorte suave (interrumpible: siempre parte del valor actual)
function Rig({ reduced, children }: { reduced: boolean; children: React.ReactNode }) {
  const group = useRef<Group>(null);

  useFrame(({ pointer }, delta) => {
    const g = group.current;
    if (!g) return;
    if (!reduced) g.rotation.y += delta * 0.06;
    const ease = 1 - Math.exp(-delta * 3);
    g.rotation.x += (pointer.y * 0.18 - g.rotation.x) * ease;
    g.rotation.z += (-pointer.x * 0.08 - g.rotation.z) * ease;
  });

  return <group ref={group}>{children}</group>;
}

export default function GlobeScene({ dark, reduced }: GlobeSceneProps) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 42 }} gl={{ antialias: true, alpha: true }} frameloop={reduced ? "demand" : "always"}>
      <Rig reduced={reduced}>
        <DotSphere dark={dark} />
        <Orbit dark={dark} reduced={reduced} />
      </Rig>
    </Canvas>
  );
}
