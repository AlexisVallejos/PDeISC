import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminTitle({ total, onNew }: { total: number; onNew: () => void }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight">Gestión de usuarios</h1>
        <p className="text-sm text-muted-foreground">{total} {total === 1 ? "usuario registrado" : "usuarios registrados"}</p>
      </div>
      <Button size="lg" className="rounded-full" onClick={onNew}>
        <PlusIcon data-icon="inline-start" />Nuevo usuario
      </Button>
    </div>
  );
}
