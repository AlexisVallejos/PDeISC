import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserCard } from "./UserCard";
import { UserRow } from "./UserRow";
import type { User } from "@/types/user";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

// tabla en pantallas medianas y grandes; tarjetas en el celular
export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border bg-card shadow-sm md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4">Usuario</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Alta</TableHead>
              <TableHead className="px-4 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <UserRow key={user.id} user={user} onEdit={onEdit} onDelete={onDelete} />
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No hay usuarios para mostrar.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-3 md:hidden">
        {users.map((user) => (
          <UserCard key={user.id} user={user} onEdit={onEdit} onDelete={onDelete} />
        ))}
        {users.length === 0 && <p className="rounded-2xl border bg-card p-6 text-center text-sm text-muted-foreground">No hay usuarios para mostrar.</p>}
      </div>
    </>
  );
}
