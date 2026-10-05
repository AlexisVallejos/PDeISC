import { Plus } from "lucide-react";

export function AdminTitle({ total, onNew }: { total: number; onNew: () => void }) {
  return <div className="atelier-title-block"><span className="atelier-eyebrow">GESTIÓN DE USUARIOS</span><h1>Tu comunidad,<br /><em>de un vistazo</em></h1><span className="sr-only">{total} usuarios registrados</span><button type="button" className="atelier-create" onClick={onNew}><Plus size={24} aria-hidden="true" />Crear usuario</button></div>;
}
