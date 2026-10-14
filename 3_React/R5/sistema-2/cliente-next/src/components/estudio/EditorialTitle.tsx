"use client";

import { useRef } from "react";
import { useReducedMotion } from "motion/react";
import { useMounted } from "@/hooks/useMounted";
import SplitText from "@/components/reactbits/SplitText";
import VariableProximity from "@/components/reactbits/VariableProximity";

interface EditorialTitleProps {
  lines: string[];
  emphasis: string;
  as?: "h1" | "h2";
}

// titular de revista: las líneas entran palabra por palabra y la palabra en cursiva engorda cerca del puntero
export function EditorialTitle({ lines, emphasis, as: Tag = "h1" }: EditorialTitleProps) {
  const container = useRef<HTMLHeadingElement>(null);
  // tras montar: en el servidor no se sabe si la persona pidió reducir movimiento
  const mounted = useMounted();
  const prefersReduced = useReducedMotion();
  const reduced = mounted && prefersReduced;

  return (
    <Tag ref={container} className="headline">
      <span className="sr-only">{`${lines.join(" ")} ${emphasis}`}</span>
      <span aria-hidden="true">
        {lines.map((line) => reduced ? <span key={line} className="headline-line">{line}</span> : (
          <SplitText key={line} text={line} tag="span" splitType="words" delay={70} duration={0.9} ease="power4.out" from={{ opacity: 0, y: 60 }} to={{ opacity: 1, y: 0 }} className="headline-line" textAlign="left" />
        ))}
        <VariableProximity
          label={emphasis}
          className="headline-em"
          style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          containerRef={container}
          fromFontVariationSettings="'wght' 500, 'opsz' 144, 'SOFT' 0"
          toFontVariationSettings="'wght' 900, 'opsz' 144, 'SOFT' 100"
          radius={160}
          falloff="gaussian"
        />
      </span>
    </Tag>
  );
}
