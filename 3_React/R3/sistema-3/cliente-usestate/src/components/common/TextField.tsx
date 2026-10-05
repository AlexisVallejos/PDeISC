import { forwardRef, type ComponentProps } from "react";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface TextFieldProps extends Omit<ComponentProps<"input">, "id"> {
  id: string;
  label: string;
  error?: string;
  hint?: string;
}

// etiqueta + input + error/ayuda. forwardRef para que funcione con register de useForm
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { id, label, error, hint, className, ...inputProps },
  ref
) {
  return (
    <Field className={className} data-invalid={!!error}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input id={id} ref={ref} aria-invalid={!!error} {...inputProps} />
      {error ? <FieldError>{error}</FieldError> : hint && <FieldDescription>{hint}</FieldDescription>}
    </Field>
  );
});
