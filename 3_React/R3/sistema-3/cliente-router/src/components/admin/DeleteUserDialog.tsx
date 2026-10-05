import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import type { User } from "@/types/user";

interface DeleteUserDialogProps {
  user: User | null;
  onCancel: () => void;
  onConfirm: () => void;
}

// confirmación antes de borrar (user = null → cerrado)
export function DeleteUserDialog({ user, onCancel, onConfirm }: DeleteUserDialogProps) {
  return (
    <AlertDialog open={!!user} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
          <AlertDialogDescription>
            Se eliminará a {user?.nombre} ({user?.email}). Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>Eliminar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
