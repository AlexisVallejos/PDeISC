import { CalendarIcon, MailIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatDate";
import { initials } from "@/utils/initials";
import { UserActions } from "./UserActions";
import type { User } from "@/types/user";

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

// un usuario como tarjeta: se usa en el celular en lugar de la tabla
export function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  const isAdmin = user.rol === "administrador";

  return (
    <article className="flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Avatar><AvatarFallback>{initials(user.nombre)}</AvatarFallback></Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{user.nombre}</p>
          <Badge variant={isAdmin ? "default" : "secondary"}>{user.rol}</Badge>
        </div>
        {/* al administrador no se le muestran acciones */}
        {!isAdmin && <UserActions user={user} onEdit={onEdit} onDelete={onDelete} />}
      </div>

      <div className="flex flex-col gap-1 text-sm text-muted-foreground">
        <span className="inline-flex min-w-0 items-center gap-1.5">
          <MailIcon className="size-4 shrink-0" />
          <span className="truncate">{user.email}</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarIcon className="size-4 shrink-0" />
          Alta: {formatDate(user.creado_en)}
        </span>
      </div>
    </article>
  );
}
