import { ArrowUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollTop } from "@/hooks/useScrollTop";

// botón fijo que aparece al bajar y vuelve suave al inicio
export function ScrollTopButton() {
  const visible = useScrollTop();
  if (!visible) return null;

  return (
    <Button
      size="icon-lg"
      className="apple-float fixed right-6 bottom-6 z-40 rounded-full shadow-lg"
      onClick={() => window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
      aria-label="Volver arriba"
      title="Volver arriba"
    >
      <ArrowUpIcon />
    </Button>
  );
}
