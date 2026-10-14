"use client";

import { useEffect, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";

// cada recorte vive a una profundidad distinta: al inclinar el escenario se separan como papeles apilados
const LAYERS = [
  { className: "cut cut-arch", depth: 0 },
  { className: "cut cut-comb", depth: 34 },
  { className: "cut cut-half", depth: 18 },
  { className: "cut cut-sun", depth: 64 },
  { className: "cut cut-dot", depth: 96 },
] as const;

// collage 3D en CSS: perspectiva + translateZ, inclinado por el puntero con resortes sin rebote
export function PaperCollage({ className = "", children }: { className?: string; children?: ReactNode }) {
  const reduced = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 120, damping: 22, mass: 0.6 };
  const rotateY = useSpring(useTransform(px, [-1, 1], [-16, 16]), spring);
  const rotateX = useSpring(useTransform(py, [-1, 1], [12, -12]), spring);
  // la sombra se corre al lado contrario de la inclinación, como si la luz estuviera fija arriba
  const shadowX = useTransform(rotateY, (v) => `${-v * 0.9}px`);
  const shadowY = useTransform(rotateX, (v) => `${18 + v * 0.9}px`);
  const shadow = useMotionTemplate`drop-shadow(${shadowX} ${shadowY} 18px rgba(80, 20, 10, 0.22))`;

  useEffect(() => {
    if (reduced) return;
    const onMove = (event: PointerEvent) => {
      px.set((event.clientX / window.innerWidth) * 2 - 1);
      py.set((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, px, py]);

  return (
    <div className={`collage ${className}`}>
      <motion.div className="collage-stage" style={{ rotateX, rotateY }} aria-hidden="true">
        {LAYERS.map(({ className: cut, depth }, index) => (
          <motion.span
            key={cut}
            className={cut}
            style={{ z: depth, filter: shadow }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.9, delay: 0.08 * index }}
          />
        ))}
      </motion.div>
      {children}
    </div>
  );
}
