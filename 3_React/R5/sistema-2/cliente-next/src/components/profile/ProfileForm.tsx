"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Save, Undo2 } from "lucide-react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Field } from "@/components/common/Field";
import { Notice } from "@/components/common/Notice";
import { PasswordInput } from "@/components/common/PasswordInput";
import { useAuth } from "@/context/AuthContext";
import { getMessage } from "@/services/api";
import { updateProfileRequest, type ProfileValues } from "@/services/authService";
import { onlyLetters } from "@/utils/onlyLetters";
import { emailRules } from "@/validation/emailRules";
import { nameRules } from "@/validation/nameRules";
import { optionalPasswordRules } from "@/validation/passwordRules";
import type { Notice as NoticeValue } from "@/types/notice";
import type { User } from "@/types/user";

// la persona edita su nombre, correo y contraseña; el rol no se puede cambiar desde acá
export function ProfileForm({ user, className = "" }: { user: User; className?: string }) {
  const { setUser } = useAuth();
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<ProfileValues>({
    mode: "onChange",
    defaultValues: { nombre: user.nombre, email: user.email, password: "" },
  });
  const [notice, setNotice] = useState<NoticeValue | null>(null);
  const [pending, setPending] = useState<ProfileValues | null>(null);
  const [saving, setSaving] = useState(false);

  async function confirmSave() {
    const values = pending;
    setPending(null);
    if (!values) return;

    setSaving(true);
    setNotice(null);
    try {
      const updated = await updateProfileRequest(values);
      setUser(updated);
      reset({ nombre: updated.nombre, email: updated.email, password: "" });
      setNotice({ text: "Perfil actualizado correctamente." });
    } catch (error) {
      setNotice({ error: true, text: getMessage(error) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className={`profile-form ${className}`} onSubmit={handleSubmit(setPending)} noValidate>
      <header>
        <h2>Mi perfil</h2>
        <p>Modificá tus datos y guardá los cambios.</p>
      </header>

      <Notice notice={notice} />

      <div className="profile-fields">
        <Field label="Nombre" htmlFor="p-nombre" error={errors.nombre?.message}>
          <input id="p-nombre" maxLength={80} autoComplete="name" {...register("nombre", nameRules)} onInput={onlyLetters} />
        </Field>
        <Field label="Correo electrónico" htmlFor="p-email" error={errors.email?.message}>
          <input id="p-email" type="email" maxLength={120} autoComplete="email" {...register("email", emailRules)} />
        </Field>
        <Field label="Nueva contraseña" htmlFor="p-password" error={errors.password?.message} hint="Opcional. Si entraste con una red, acá podés crear una.">
          <PasswordInput id="p-password" registration={register("password", optionalPasswordRules)} autoComplete="new-password" placeholder="Dejala vacía para conservarla" />
        </Field>
      </div>

      <footer className="profile-actions">
        <button type="button" className="btn btn-ghost" disabled={!isDirty || saving} onClick={() => { reset(); setNotice(null); }}>
          <Undo2 aria-hidden="true" /> Descartar
        </button>
        <button type="submit" className="btn btn-primary" disabled={!isDirty || saving}>
          <Save aria-hidden="true" /> {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </footer>

      <ConfirmDialog
        open={!!pending}
        title="¿Actualizar perfil?"
        text="Se van a guardar los datos nuevos de tu cuenta."
        confirmLabel="Actualizar"
        onConfirm={confirmSave}
        onCancel={() => setPending(null)}
      />
    </form>
  );
}
