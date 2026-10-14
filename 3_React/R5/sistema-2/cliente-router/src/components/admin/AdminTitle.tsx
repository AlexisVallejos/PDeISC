export function AdminTitle({ total }: { total: number; onNew: () => void }) {
  return <div className="editorial-title-block"><span className="sr-only">{total} usuarios registrados</span><h1>Un espacio<br />para cada<br /><em>persona</em></h1></div>;
}
