"use client";

import { CalendarDays, Crown, Mail } from "lucide-react";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/utils/formatDate";
import { initials } from "@/utils/initials";
import { Clay } from "./Clay";

// tarjeta de bienvenida con la escena 3D de fondo + formulario de perfil
export function ProfileView() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="profile-layout">
      <section className="welcome">
        <Clay className="welcome-clay" />
        <div className="welcome-copy">
          <span className="avatar avatar-xl">{initials(user.nombre)}</span>
          <span className="eyebrow">Bienvenida</span>
          <h1 className="title">Hola, <span className="accent">{user.nombre.split(" ")[0]}</span></h1>
          <ul className="welcome-facts">
            <li><Crown aria-hidden="true" /> {user.rol === "administrador" ? "Administrador" : "Usuario"}</li>
            <li><Mail aria-hidden="true" /> {user.email}</li>
            <li><CalendarDays aria-hidden="true" /> Se unió el {formatDate(user.creado_en)}</li>
          </ul>
        </div>
      </section>
      <div className="profile-card">
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
