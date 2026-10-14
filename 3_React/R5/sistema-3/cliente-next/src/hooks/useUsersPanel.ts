"use client";

import { useState } from "react";
import { useUsers } from "./useUsers";
import type { User } from "@/types/user";

// estado del panel de administración: lista, búsqueda y qué diálogo está abierto
export function useUsersPanel() {
  const users = useUsers();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleting, setDeleting] = useState<User | null>(null);

  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (user: User) => { setEditing(user); setFormOpen(true); };

  async function confirmDelete() {
    if (!deleting) return;
    const id = deleting.id;
    setDeleting(null);
    await users.deleteUser(id);
  }

  const admins = users.users.filter((user) => user.rol === "administrador").length;

  return {
    ...users,
    stats: { total: users.users.length, admins, members: users.users.length - admins },
    formOpen, editing, deleting,
    openCreate, openEdit, closeForm: () => setFormOpen(false),
    askDelete: setDeleting, cancelDelete: () => setDeleting(null), confirmDelete,
  };
}
