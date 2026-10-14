"use client";

import Noise from "@/components/reactbits/Noise";

// grano de papel fijo sobre toda la página (estático: fps 0, no parpadea)
export function PaperGrain() {
  return <Noise fixed fps={0} opacity={0.07} size={1.4} blendMode="multiply" dust={0} zIndex={50} className="paper-grain" />;
}
