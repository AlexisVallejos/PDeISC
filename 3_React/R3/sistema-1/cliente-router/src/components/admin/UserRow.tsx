import { CalendarDays, Crown, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { initials } from "@/utils/initials";
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
    <article className={`control-user-row control-tone-${index % 4}`}>
      <span className="control-avatar" aria-hidden="true">{initials(user.nombre)}</span>
      <h2>{user.nombre}</h2><p title={user.email}>{user.email}</p>
      <span className={`control-role ${isAdmin ? "admin" : ""}`}>{isAdmin && <Crown size={14} aria-hidden="true" />}{isAdmin ? "Administrador" : "Usuario"}</span>
      <span className="control-joined"><CalendarDays size={16} aria-hidden="true" />{formatDate(user.creado_en)}</span>
      {!isAdmin && <span className="control-user-actions"><button type="button" onClick={() => onEdit(user)} aria-label={`Editar a ${user.nombre}`} title="Editar"><Pencil size={17} /></button><button type="button" className="delete" onClick={() => onDelete(user)} aria-label={`Eliminar a ${user.nombre}`} title="Eliminar"><Trash2 size={17} /></button></span>}
    </article>
  );
}
