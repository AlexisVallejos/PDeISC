import { CalendarIcon, MailIcon } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { initials } from "@/utils/initials";
import type { User } from "@/types/user";

export function WelcomeCard({ user }: { user: User }) {
  const firstName = user.nombre.split(" ")[0];
  const since = formatDate(user.creado_en);

  return (
    <section className="atelier-welcome">
      <span className="atelier-eyebrow">MI ESPACIO</span>
      <span className="atelier-avatar" aria-hidden="true">{initials(user.nombre)}</span>
      <h1>Hola, {firstName}.</h1>
      <p>Desde acá podés ver y actualizar los datos de tu cuenta.</p>
      <span className="atelier-role">{user.rol === "administrador" ? "Administrador" : "Usuario"}</span>
      <span className="atelier-welcome-detail"><MailIcon size={17} />{user.email}</span>
      {since && <span className="atelier-welcome-detail"><CalendarIcon size={17} />Miembro desde {since}</span>}
    </section>
  );
}
