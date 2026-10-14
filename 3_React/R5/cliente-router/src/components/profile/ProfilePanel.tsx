import { PanelShell } from "@/components/common/PanelShell";
import { ProfileForm } from "./ProfileForm";
import { WelcomeCard } from "./WelcomeCard";
import type { User } from "@/types/user";

interface ProfilePanelProps {
  user: User;
  onUpdated: (user: User) => void;
  onLogout: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

// panel del usuario común: una sola página con la bienvenida y la edición del perfil
export function ProfilePanel({ user, onUpdated, onLogout, theme, onToggleTheme }: ProfilePanelProps) {
  return (
    <PanelShell theme={theme} onToggleTheme={onToggleTheme} onLogout={onLogout}>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]">
        <WelcomeCard user={user} />
        <ProfileForm user={user} onUpdated={onUpdated} />
      </div>
    </PanelShell>
  );
}
