"use client";

import { CalendarDays, ShieldCheck } from "lucide-react";
import { ProfileForm } from "@/components/profile/ProfileForm";
import DecryptedText from "@/components/reactbits/DecryptedText";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { formatDate } from "@/utils/formatDate";
import { initials } from "@/utils/initials";

// bienvenida + edición del perfil propio
export function ProfileView() {
  const { user } = useAuth();
  const { theme } = useTheme();
  if (!user) return null;
  const firstName = user.nombre.split(" ")[0];
  const spot = { theme, spotlightColor: theme === "dark" ? "rgba(199, 255, 88, 0.16)" : "rgba(76, 138, 18, 0.12)", style: { "--spotlight-card-surface": "var(--glass)" } as React.CSSProperties };

  return (
    <div className="profile-layout">
      <section className="welcome">
        <span className="avatar avatar-xl">{initials(user.nombre)}</span>
        <h1 className="display">
          Hola,
          <br />
          <DecryptedText text={`${firstName}.`} animateOn="view" sequential speed={50} className="accent" encryptedClassName="accent dim" />
        </h1>
        <ul className="welcome-facts">
          <li><ShieldCheck aria-hidden="true" /> {user.rol === "administrador" ? "Administrador" : "Usuario"}</li>
          <li><CalendarDays aria-hidden="true" /> Miembro desde {formatDate(user.creado_en)}</li>
        </ul>
      </section>

      <SpotlightCard className="profile-card" {...spot}>
        <ProfileForm user={user} />
      </SpotlightCard>
    </div>
  );
}
