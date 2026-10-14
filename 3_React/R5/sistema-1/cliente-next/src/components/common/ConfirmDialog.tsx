"use client";

import { Modal } from "./Modal";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  text: string;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// confirmación para acciones que no se pueden deshacer (borrar, salir, guardar perfil)
export function ConfirmDialog({ open, title, text, confirmLabel, danger = false, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      description={text}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
          <button type="button" className={danger ? "btn btn-danger" : "btn btn-primary"} onClick={onConfirm} autoFocus>{confirmLabel}</button>
        </>
      }
    />
  );
}
