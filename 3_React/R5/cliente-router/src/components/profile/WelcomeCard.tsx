import { CalendarIcon, MailIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/utils/formatDate";
import { initials } from "@/utils/initials";
import type { User } from "@/types/user";

export function WelcomeCard({ user }: { user: User }) {
  const firstName = user.nombre.split(" ")[0];
  const since = formatDate(user.creado_en);

  return (
    <Card className="rounded-2xl shadow-sm lg:sticky lg:top-6">
      <CardContent className="flex flex-col items-start gap-5">
        <Avatar className="size-20 text-2xl">
          <AvatarFallback className="bg-primary text-primary-foreground">{initials(user.nombre)}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Te damos la bienvenida, {firstName}</h1>
          <p className="text-sm text-muted-foreground">Desde acá podés ver y actualizar los datos de tu cuenta.</p>
        </div>

        <div className="flex flex-col items-start gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary">{user.rol}</Badge>
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <MailIcon className="size-4 shrink-0" />
            <span className="truncate">{user.email}</span>
          </span>
          {since && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarIcon className="size-4" />
              Miembro desde {since}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
