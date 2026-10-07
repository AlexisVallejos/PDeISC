import { EditorialArt } from "@/components/common/Artwork";
import { useState } from "react";
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
      <div className="editorial-layout">
        <aside className="editorial-intro"><AdminTitle total={users.length} onNew={openCreate} /><p>Gestioná el equipo, da acceso y mantené el estudio en movimiento.</p><EditorialArt className="intro-editorial" /><button type="button" className="editorial-create" onClick={openCreate}><span>＋</span> NUEVO USUARIO <span aria-hidden="true">→</span></button></aside>
        <section className="editorial-results" aria-label="Directorio de usuarios"><UserSearch value={search} onChange={setSearch} onSearch={() => load()} /><Notice notice={notice} /><UserTable users={users} onEdit={openEdit} onDelete={setUserToDelete} /></section>
      </div>}

      <UserFormDialog open={formOpen} onOpenChange={setFormOpen} user={userToEdit} onSave={saveUser} />
      <DeleteUserDialog user={userToDelete} onCancel={() => setUserToDelete(null)} onConfirm={confirmDelete} />
    </PanelShell>
  );
}
