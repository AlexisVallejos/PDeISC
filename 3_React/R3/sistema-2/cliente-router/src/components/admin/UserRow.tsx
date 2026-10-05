import { Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import type { User } from "@/types/user";

interface UserRowProps {
  user: User;
  index: number;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UserRow({ user, index, onEdit, onDelete }: UserRowProps) {
  const isAdmin = user.rol === "administrador";

  return (
    <article className={`editorial-user-row editorial-tone-${index % 4}`}>
      <h2>{user.nombre}</h2><span className={`editorial-role ${isAdmin ? "admin" : ""}`}>{isAdmin ? "Administrador" : "Usuario"}</span><p title={user.email}>{user.email}</p><time>{formatDate(user.creado_en)}</time>
      {!isAdmin && <span className="editorial-user-actions"><button type="button" onClick={() => onEdit(user)} aria-label={`Editar a ${user.nombre}`} title="Editar"><Pencil size={20} /></button><button type="button" className="delete" onClick={() => onDelete(user)} aria-label={`Eliminar a ${user.nombre}`} title="Eliminar"><Trash2 size={20} /></button></span>}
    </article>
  );
}
