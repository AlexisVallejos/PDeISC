"use client";

import { ProfileForm } from "@/components/profile/ProfileForm";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/utils/formatDate";
import { initials } from "@/utils/initials";
import { EditorialTitle } from "./EditorialTitle";

// perfil como página de entrevista: retrato tipográfico, datos al margen y el formulario en el cuerpo
export function ProfileView() {
  const { user } = useAuth();
  if (!user) return null;
  const firstName = user.nombre.split(" ")[0];

  return (
    <div className="profile-layout">
      <aside className="profile-margin">
        <span className="portrait" aria-hidden="true">{initials(user.nombre)}</span>
        <dl>
          <div><dt>Rol</dt><dd>{user.rol === "administrador" ? "Administrador" : "Usuario"}</dd></div>
          <div><dt>Correo</dt><dd>{user.email}</dd></div>
          <div><dt>En el estudio desde</dt><dd>{formatDate(user.creado_en)}</dd></div>
        </dl>
      </aside>
      <article className="profile-body">
        <EditorialTitle lines={["Hola,"]} emphasis={`${firstName}.`} />
        <p className="dek">Tus datos, en tus palabras. Lo que cambies acá se guarda en todo el estudio.</p>
        <ProfileForm user={user} />
      </article>
    </div>
  );
}
