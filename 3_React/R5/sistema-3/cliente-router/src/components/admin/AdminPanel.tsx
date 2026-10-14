import { useState } from "react";
import { Crown, UsersRound } from "lucide-react";
import { PanelShell } from "@/components/common/PanelShell";
import { Notice } from "@/components/common/Notice";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { WelcomeCard } from "@/components/profile/WelcomeCard";
import { useAuth } from "@/context/AuthContext";
import { useUsers } from "@/hooks/useUsers";
import { AdminTitle } from "./AdminTitle";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { UserFormDialog } from "./UserFormDialog";
import { UserSearch } from "./UserSearch";
import { UserTable } from "./UserTable";
import type { User } from "@/types/user";

interface AdminPanelProps {
  onLogout: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

// panel del administrador: lista de usuarios + alta, edición y baja
export function AdminPanel({ onLogout, theme, onToggleTheme }: AdminPanelProps) {
  const { user, setUser } = useAuth();
  const { users, search, setSearch, load, notice, saveUser, deleteUser } = useUsers();
  const [view, setView] = useState<"directory" | "profile">("directory");
  const [formOpen, setFormOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  function openCreate() {
    setUserToEdit(null);
    setFormOpen(true);
  }

  function openEdit(user: User) {
    setUserToEdit(user);
    setFormOpen(true);
  }

  async function confirmDelete() {
    if (!userToDelete) return;
    await deleteUser(userToDelete.id);
    setUserToDelete(null);
  }

  return (
    <PanelShell theme={theme} onToggleTheme={onToggleTheme} onLogout={onLogout} activeView={view} onViewChange={setView} user={user}>
      {view === "profile" && user ? <div className="atelier-profile-layout"><WelcomeCard user={user} /><ProfileForm user={user} onUpdated={setUser} /></div> :
      <div className="atelier-directory">
        <aside className="atelier-intro">
          <AdminTitle total={users.length} onNew={openCreate} />
          <p className="atelier-intro-copy">Personas, roles y accesos en un solo lugar para un equipo más conectado.</p>
          <UserSearch value={search} onChange={setSearch} onSearch={() => load()} />
          <div className="atelier-stat-panel" aria-label="Estadísticas de usuarios">
            <div className="atelier-stat-heading"><span>ESTADÍSTICAS</span><span>Total de usuarios <strong>{users.length}</strong></span></div>
            <div className="atelier-stat-grid">
              <div className="atelier-stat"><span className="atelier-stat-icon"><UsersRound size={23} /></span><div><strong>{users.filter((item) => item.rol === "usuario").length}</strong><span>Usuarios</span></div></div>
              <div className="atelier-stat"><span className="atelier-stat-icon admin"><Crown size={23} /></span><div><strong>{users.filter((item) => item.rol === "administrador").length}</strong><span>Administradores</span></div></div>
            </div>
          </div>
          <Notice notice={notice} />
        </aside>
        <section className="atelier-results" aria-label="Directorio de usuarios"><UserTable users={users} onEdit={openEdit} onDelete={setUserToDelete} /></section>
      </div>}

      <UserFormDialog open={formOpen} onOpenChange={setFormOpen} user={userToEdit} onSave={saveUser} />
      <DeleteUserDialog user={userToDelete} onCancel={() => setUserToDelete(null)} onConfirm={confirmDelete} />
    </PanelShell>
  );
}
