import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { PasswordField } from "@/components/common/PasswordField";
import { TextField } from "@/components/common/TextField";
import { RoleSelect } from "./RoleSelect";
import { onlyLetters } from "@/utils/onlyLetters";
import { emailRules } from "@/validation/emailRules";
import { nameRules } from "@/validation/nameRules";
import { optionalPasswordRules, passwordRules } from "@/validation/passwordRules";
import type { User, UserFormValues } from "@/types/user";

const emptyForm: UserFormValues = { nombre: "", email: "", password: "", rol: "usuario" };

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSave: (values: UserFormValues, id?: number) => Promise<string>;
}

// modal para crear (user = null) o editar un usuario
export function UserFormDialog({ open, onOpenChange, user, onSave }: UserFormDialogProps) {
  const isEditing = !!user;
  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm<UserFormValues>({ mode: "onChange", defaultValues: emptyForm });
  const [serverError, setServerError] = useState("");
  const [pendingValues, setPendingValues] = useState<UserFormValues | null>(null);

  // cada vez que se abre, cargo los datos del usuario (o el formulario vacío)
  useEffect(() => {
    if (!open) return;
    reset(user ? { nombre: user.nombre, email: user.email, password: "", rol: user.rol } : emptyForm);
    setServerError("");
  }, [open, user, reset]);

  async function submit(values: UserFormValues) {
    if (isEditing) {
      setPendingValues(values);
      return;
    }

    await save(values);
  }

  async function save(values: UserFormValues) {
    const error = await onSave(values, user?.id);
    if (error) setServerError(error);
    else onOpenChange(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar usuario" : "Nuevo usuario"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Modificá los datos del usuario." : "Completá los datos para dar de alta un usuario."}
          </DialogDescription>
        </DialogHeader>

        <form id="user-form" onSubmit={handleSubmit(submit)} noValidate>
          <FieldGroup>
            <TextField
              id="u-nombre" label="Nombre" required maxLength={80}
              error={errors.nombre?.message}
              {...register("nombre", nameRules)} onInput={onlyLetters}
            />
            <TextField
              id="u-email" label="Email" type="email" required maxLength={120}
              error={errors.email?.message}
              {...register("email", emailRules)}
            />
            <PasswordField
              id="u-password" label={isEditing ? "Nueva contraseña" : "Contraseña"} autoComplete="new-password"
              hint={isEditing ? "Dejala vacía para conservar la actual." : undefined}
              error={errors.password?.message}
              {...register("password", isEditing ? optionalPasswordRules : passwordRules)}
            />
            <Field>
              <FieldLabel htmlFor="u-rol">Rol</FieldLabel>
              <Controller name="rol" control={control} render={({ field }) => <RoleSelect id="u-rol" value={field.value} onChange={field.onChange} />} />
            </Field>
            {serverError && <p className="text-sm text-destructive" role="alert">{serverError}</p>}
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button type="submit" form="user-form" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear usuario"}
          </Button>
        </DialogFooter>
      </DialogContent>
      </Dialog>

    <AlertDialog open={!!pendingValues} onOpenChange={(isOpen) => !isOpen && setPendingValues(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Actualizar usuario?</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de actualizar los datos de este usuario?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => pendingValues && save(pendingValues).then(() => setPendingValues(null))}>
            Actualizar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
