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
    <article className={`atelier-user-card atelier-card-tone-${index % 4}`}>
      <span className="atelier-avatar" aria-hidden="true">{initials(user.nombre)}</span>
      <div className="atelier-user-info"><h2>{user.nombre}</h2><p title={user.email}>{user.email}</p><span className={`atelier-role ${isAdmin ? "atelier-role-admin" : ""}`}>{isAdmin && <Crown size={16} aria-hidden="true" />}{isAdmin ? "Administrador" : "Usuario"}</span></div>
      <div className="atelier-user-bottom"><span className="atelier-joined"><CalendarDays size={16} aria-hidden="true" />Se unió el {formatDate(user.creado_en)}</span>
        {!isAdmin && <span className="atelier-user-actions"><button type="button" onClick={() => onEdit(user)} aria-label={`Editar a ${user.nombre}`} title="Editar"><Pencil size={18} /></button><button type="button" className="delete" onClick={() => onDelete(user)} aria-label={`Eliminar a ${user.nombre}`} title="Eliminar"><Trash2 size={18} /></button></span>}
      </div>
    </article>
  );
}
