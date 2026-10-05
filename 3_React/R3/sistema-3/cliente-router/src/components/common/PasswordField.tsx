import { forwardRef, useState, type ComponentProps } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface PasswordFieldProps extends Omit<ComponentProps<"input">, "id" | "type"> {
  id: string;
  label: string;
  error?: string;
  hint?: string;
}

// contraseña con botón de ojo (versión shadcn, para los paneles)
export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(
  { id, label, error, hint, className, ...inputProps },
  ref
) {
  const [visible, setVisible] = useState(false);

  return (
    <Field className={className} data-invalid={!!error}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="relative">
        <Input id={id} ref={ref} type={visible ? "text" : "password"} className="pr-10" maxLength={72} aria-invalid={!!error} {...inputProps} />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="absolute top-1/2 right-1 -translate-y-1/2"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          aria-pressed={visible}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </Button>
      </div>
      {error ? <FieldError>{error}</FieldError> : hint && <FieldDescription>{hint}</FieldDescription>}
    </Field>
  );
});
