import { UserRow } from "./UserRow";
import type { User } from "@/types/user";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  if (users.length === 0) return <div className="atelier-empty">No hay usuarios para mostrar. Probá otra búsqueda.</div>;
  return <div className="atelier-user-grid">{users.map((user, index) => <UserRow key={user.id} user={user} index={index} onEdit={onEdit} onDelete={onDelete} />)}</div>;
}
