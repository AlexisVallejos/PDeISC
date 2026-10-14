import { useEffect, useState } from "react";

// true cuando el scroll bajó lo suficiente como para mostrar el botón de subir
export function useScrollTop(offset = 240): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);

  return visible;
}
