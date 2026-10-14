import { OrbitArt } from "@/components/common/Artwork";
// ilustración del costado (solo decoración)
export function AuthArt() {
  return (
    <aside className="auth-art" aria-hidden="true">
      <div className="atelier-auth-art-copy"><span>CONTROL NOCTURNO</span><h2>Personas,<br />en orden.</h2><p>Gestioná usuarios y accesos con claridad.</p></div>
      <OrbitArt className="auth-orbit" />
    </aside>
  );
}
