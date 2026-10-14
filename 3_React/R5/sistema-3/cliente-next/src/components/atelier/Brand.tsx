import Image from "next/image";

// isotipo del atelier + nombre de la sección
export function Brand({ title = "Usuarios" }: { title?: string }) {
  return (
    <span className="brand">
      <Image src="/atelier-logo.png" alt="" width={44} height={44} priority />
      <span>
        <small>C · Atelier modular</small>
        <strong>{title}</strong>
      </span>
    </span>
  );
}
