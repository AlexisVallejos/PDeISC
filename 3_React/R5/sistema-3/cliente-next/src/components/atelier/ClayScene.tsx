"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer, RoundedBox } from "@react-three/drei";
import type { Group } from "three";

interface ClaySceneProps {
  dark: boolean;
  reduced: boolean;
}

type ShapeKind = "box" | "torus" | "sphere" | "capsule" | "cylinder";

interface ShapeSpec {
  kind: ShapeKind;
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  scale: number;
}

// piezas modulares en los colores del atelier: azul, durazno y lila
const SHAPES: ShapeSpec[] = [
  { kind: "box", position: [-1.55, 0.55, 0], rotation: [0.4, 0.6, 0.1], color: "#2f55f4", scale: 1 },
  { kind: "torus", position: [1.45, 0.85, -0.4], rotation: [1.1, 0.2, 0.4], color: "#ffb38a", scale: 0.95 },
  { kind: "sphere", position: [0.15, -0.35, 0.6], rotation: [0, 0, 0], color: "#c7c9ff", scale: 0.85 },
  { kind: "capsule", position: [-0.55, 1.45, -0.8], rotation: [0.2, 0, 0.9], color: "#8fb1ff", scale: 0.7 },
  { kind: "cylinder", position: [1.2, -0.95, 0.2], rotation: [0.5, 0.3, -0.3], color: "#ff8f6b", scale: 0.6 },
];

function Geometry({ kind }: { kind: ShapeKind }) {
  switch (kind) {
    case "torus": return <torusGeometry args={[0.62, 0.26, 48, 96]} />;
    case "sphere": return <sphereGeometry args={[0.7, 64, 64]} />;
    case "capsule": return <capsuleGeometry args={[0.32, 0.8, 16, 32]} />;
    case "cylinder": return <cylinderGeometry args={[0.55, 0.55, 0.5, 64]} />;
    default: return null;
  }
}

// cada pieza crece con un resorte al pasar el puntero y gira al tocarla; el giro conserva la velocidad y se frena solo
function Piece({ spec, reduced }: { spec: ShapeSpec; reduced: boolean }) {
  const group = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const spin = useRef(0);
  const scale = useRef(spec.scale);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const target = spec.scale * (hovered ? 1.12 : 1);
    scale.current += (target - scale.current) * (1 - Math.exp(-delta * 10));
    g.scale.setScalar(scale.current);
    g.rotation.y += spin.current * delta;
    spin.current *= Math.exp(-delta * 1.6);
  });

  const onDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    spin.current += 9;
  };

  const material = <meshPhysicalMaterial color={spec.color} roughness={0.32} clearcoat={1} clearcoatRoughness={0.18} sheen={0.4} sheenColor="#ffffff" />;

  return (
    <Float speed={reduced ? 0 : 1.4} rotationIntensity={reduced ? 0 : 0.6} floatIntensity={reduced ? 0 : 0.9}>
      <group
        ref={group}
        position={spec.position}
        rotation={spec.rotation}
        onPointerOver={(event) => { event.stopPropagation(); setHovered(true); document.body.style.cursor = "grab"; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = ""; }}
        onPointerDown={onDown}
      >
        {spec.kind === "box" ? (
          <RoundedBox args={[1.05, 1.05, 1.05]} radius={0.22} smoothness={6}>{material}</RoundedBox>
        ) : (
          <mesh>
            <Geometry kind={spec.kind} />
            {material}
          </mesh>
        )}
      </group>
    </Float>
  );
}

// el conjunto sigue al puntero con suavidad (siempre desde la posición actual, así se puede interrumpir)
function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<Group>(null);
  useFrame(({ pointer }, delta) => {
    const g = group.current;
    if (!g) return;
    const ease = 1 - Math.exp(-delta * 2.5);
    g.rotation.y += (pointer.x * 0.35 - g.rotation.y) * ease;
    g.rotation.x += (-pointer.y * 0.2 - g.rotation.x) * ease;
  });
  return <group ref={group}>{children}</group>;
}

export default function ClayScene({ dark, reduced }: ClaySceneProps) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6.2], fov: 38 }} gl={{ antialias: true, alpha: true }} frameloop={reduced ? "demand" : "always"}>
      <ambientLight intensity={dark ? 0.35 : 0.6} />
      <directionalLight position={[3, 5, 4]} intensity={dark ? 1.6 : 2.2} />
      {/* luz de estudio armada con paneles: no descarga mapas HDR de internet */}
      <Environment resolution={256}>
        <Lightformer intensity={2.2} position={[0, 4, 3]} scale={[8, 3, 1]} />
        <Lightformer intensity={1.4} position={[-5, 0, 1]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} color="#dfe6ff" />
        <Lightformer intensity={1.2} position={[5, -1, 1]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} color="#ffe3d4" />
      </Environment>
      <Rig>
        {SHAPES.map((spec) => <Piece key={spec.kind} spec={spec} reduced={reduced} />)}
      </Rig>
      <ContactShadows position={[0, -2.1, 0]} opacity={dark ? 0.5 : 0.28} scale={9} blur={2.6} far={4} color={dark ? "#000000" : "#2f3c8f"} />
    </Canvas>
  );
}
