import { useState } from "react";
import { useForm } from "react-hook-form";
import { SaveIcon, Undo2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Notice } from "@/components/common/Notice";
import { PasswordField } from "@/components/common/PasswordField";
import { TextField } from "@/components/common/TextField";
import { getMessage } from "@/services/api";
import { updateProfileRequest, type ProfileValues } from "@/services/authService";
import { onlyLetters } from "@/utils/onlyLetters";
import { emailRules } from "@/validation/emailRules";
import { nameRules } from "@/validation/nameRules";
import { optionalPasswordRules } from "@/validation/passwordRules";
import type { User } from "@/types/user";
import type { Notice as NoticeValue } from "@/types/notice";

interface ProfileFormProps {
  user: User;
  onUpdated: (user: User) => void;
}

// formulario para que el usuario edite su nombre, correo y contraseña
export function ProfileForm({ user, onUpdated }: ProfileFormProps) {
  const initialValues: ProfileValues = { nombre: user.nombre, email: user.email, password: "" };
  const { register, handleSubmit, reset, formState: { errors, isDirty, isSubmitting } } = useForm<ProfileValues>({
    mode: "onChange",
    defaultValues: initialValues,
  });
  const [notice, setNotice] = useState<NoticeValue | null>(null);
  const [pendingValues, setPendingValues] = useState<ProfileValues | null>(null);

  async function save(values: ProfileValues) {
    setPendingValues(values);
  }

  async function confirmSave() {
    const values = pendingValues;
    setPendingValues(null);
    if (!values) return;

    setNotice(null);
    try {
      const updatedUser = await updateProfileRequest(values);
      onUpdated(updatedUser);
      reset({ nombre: updatedUser.nombre, email: updatedUser.email, password: "" });
      setNotice({ text: "Perfil actualizado correctamente." });
    } catch (error) {
      setNotice({ error: true, text: getMessage(error) });
    }
  }

  function discard() {
    reset();
    setNotice(null);
  }

  return (
    <Card className="atelier-profile-form rounded-2xl shadow-sm">
      <form onSubmit={handleSubmit(save)} noValidate className="flex flex-col gap-4">
        <CardHeader>
          <CardTitle className="text-lg">Mi perfil</CardTitle>
          <CardDescription>Modificá tus datos y guardá los cambios.</CardDescription>
        </CardHeader>

        <CardContent>
          <FieldGroup className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <Notice notice={notice} className="md:col-span-2 xl:col-span-3" />
            <TextField
              id="p-nombre" label="Nombre" required maxLength={80} autoComplete="name"
              error={errors.nombre?.message}
              {...register("nombre", nameRules)} onInput={onlyLetters}
            />
            <TextField
              id="p-email" label="Correo electrónico" type="email" required maxLength={120} autoComplete="email"
              error={errors.email?.message}
              {...register("email", emailRules)}
            />
            <PasswordField
              id="p-password" label="Nueva contraseña" autoComplete="new-password"
              className="md:col-span-2 xl:col-span-1"
              hint="Opcional. Dejala vacía para conservar la actual."
              error={errors.password?.message}
              {...register("password", optionalPasswordRules)}
            />
          </FieldGroup>
        </CardContent>

        <CardFooter className="justify-end gap-2">
          <Button type="button" variant="outline" className="rounded-full" disabled={!isDirty || isSubmitting} onClick={discard}>
            <Undo2Icon data-icon="inline-start" />Descartar
          </Button>
          <Button type="submit" className="rounded-full" disabled={!isDirty || isSubmitting}>
            <SaveIcon data-icon="inline-start" />{isSubmitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        </CardFooter>
      </form>

      <AlertDialog open={!!pendingValues} onOpenChange={(isOpen) => !isOpen && setPendingValues(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Actualizar perfil?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de actualizar tus datos?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSave}>Actualizar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
