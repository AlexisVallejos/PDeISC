import type { ReactNode } from "react";

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

// etiqueta + control + mensaje (el error reemplaza a la ayuda)
export function Field({ label, htmlFor, error, hint, children, className = "" }: FieldProps) {
  return (
    <div className={`field ${error ? "has-error" : ""} ${className}`}>
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {error ? <small className="field-error" role="alert">{error}</small> : hint && <small className="field-hint">{hint}</small>}
    </div>
  );
}
