"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "@/components/common/Modal";
import { Field } from "@/components/common/Field";
import { PasswordInput } from "@/components/common/PasswordInput";
import { onlyLetters } from "@/utils/onlyLetters";
import { emailRules } from "@/validation/emailRules";
import { nameRules } from "@/validation/nameRules";
import { optionalPasswordRules, passwordRules } from "@/validation/passwordRules";
import type { User, UserFormValues } from "@/types/user";

const emptyForm: UserFormValues = { nombre: "", email: "", password: "", rol: "usuario" };

interface UserFormDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (values: UserFormValues, id?: number) => Promise<string>;
}

// alta (user = null) o edición de un usuario
export function UserFormDialog({ open, user, onClose, onSave }: UserFormDialogProps) {
  const isEditing = !!user;
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<UserFormValues>({ mode: "onChange", defaultValues: emptyForm });
  const [serverError, setServerError] = useState("");

  // cada vez que se abre cargo los datos del usuario (o el formulario vacío)
  useEffect(() => {
    if (!open) return;
    reset(user ? { nombre: user.nombre, email: user.email, password: "", rol: user.rol } : emptyForm);
    setServerError("");
  }, [open, user, reset]);

  async function submit(values: UserFormValues) {
    const error = await onSave(values, user?.id);
    if (error) setServerError(error);
    else onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Editar usuario" : "Nuevo usuario"}
      description={isEditing ? "Modificá los datos del usuario." : "Completá los datos para dar de alta un usuario."}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" form="user-form" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear usuario"}
          </button>
        </>
      }
    >
      <form id="user-form" className="modal-form" onSubmit={handleSubmit(submit)} noValidate>
        <Field label="Nombre" htmlFor="u-nombre" error={errors.nombre?.message}>
          <input id="u-nombre" maxLength={80} {...register("nombre", nameRules)} onInput={onlyLetters} />
        </Field>
        <Field label="Correo electrónico" htmlFor="u-email" error={errors.email?.message}>
          <input id="u-email" type="email" maxLength={120} {...register("email", emailRules)} />
        </Field>
        <Field label={isEditing ? "Nueva contraseña" : "Contraseña"} htmlFor="u-password" error={errors.password?.message} hint={isEditing ? "Dejala vacía para conservar la actual." : undefined}>
          <PasswordInput id="u-password" registration={register("password", isEditing ? optionalPasswordRules : passwordRules)} autoComplete="new-password" />
        </Field>
        <Field label="Rol" htmlFor="u-rol">
          <select id="u-rol" {...register("rol")}>
            <option value="usuario">Usuario</option>
            <option value="administrador">Administrador</option>
          </select>
        </Field>
        {serverError && <p className="notice notice-error" role="alert">{serverError}</p>}
      </form>
    </Modal>
  );
}
