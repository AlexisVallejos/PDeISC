export function AdminTitle({ total }: { total: number; onNew: () => void }) {
  return <div className="control-title-block"><span className="control-eyebrow">DIRECTORIO DE USUARIOS</span><h1>Personas,<br /><em>en orden.</em></h1><span className="sr-only">{total} usuarios registrados</span></div>;
}
