import { Check, Crown } from "lucide-react";

// módulos de vidrio sobre esferas de color (reemplaza al PNG): todo en CSS, nítido y con tema claro/oscuro
export function AtelierArt({ className = "" }: { className?: string }) {
  return (
    <div className={`atelier-art ${className}`} aria-hidden="true">
      <span className="atelier-orb orb-a" />
      <span className="atelier-orb orb-b" />
      <span className="atelier-orb orb-c" />

      <div className="atelier-tile tile-profile">
        <span className="tile-avatar tone-a">AM</span>
        <span className="tile-lines"><i /><i className="short" /></span>
        <span className="tile-pill"><Crown size={13} />Admin</span>
      </div>

      <div className="atelier-tile tile-people">
        <span className="tile-avatar tone-b">LS</span>
        <span className="tile-avatar tone-c">JP</span>
        <span className="tile-avatar tone-d">MR</span>
      </div>

      <div className="atelier-tile tile-check">
        <span className="tile-check-icon"><Check size={16} strokeWidth={3} /></span>
        <span className="tile-lines"><i /><i className="short" /></span>
      </div>
    </div>
  );
}
