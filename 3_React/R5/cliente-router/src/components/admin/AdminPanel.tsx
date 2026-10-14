import { useState } from "react";
import { PanelShell } from "@/components/common/PanelShell";
import { Notice } from "@/components/common/Notice";
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
  const { users, search, setSearch, load, notice, saveUser, deleteUser } = useUsers();
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
    <PanelShell theme={theme} onToggleTheme={onToggleTheme} onLogout={onLogout}>
      <AdminTitle total={users.length} onNew={openCreate} />
      <Notice notice={notice} />
      <UserSearch value={search} onChange={setSearch} onSearch={() => load()} />
      <UserTable users={users} onEdit={openEdit} onDelete={setUserToDelete} />

      <UserFormDialog open={formOpen} onOpenChange={setFormOpen} user={userToEdit} onSave={saveUser} />
      <DeleteUserDialog user={userToDelete} onCancel={() => setUserToDelete(null)} onConfirm={confirmDelete} />
    </PanelShell>
  );
}
