"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useMounted } from "@/hooks/useMounted";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

// <dialog> nativo: trae foco atrapado, Escape y fondo; la entrada y salida se animan en CSS (@starting-style)
export function Modal({ open, onClose, title, description, children, footer, className = "" }: ModalProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const mounted = useMounted();

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open, mounted]);

  if (!mounted) return null;

  return createPortal(
    <dialog
      ref={dialog}
      className={`modal ${className}`}
      onClose={() => open && onClose()}
      onClick={(event) => event.target === dialog.current && onClose()}
      aria-labelledby="modal-title"
    >
      <div className="modal-card">
        <header className="modal-head">
          <h2 id="modal-title">{title}</h2>
          {description && <p>{description}</p>}
        </header>
        {children}
        {footer && <footer className="modal-foot">{footer}</footer>}
      </div>
    </dialog>,
    document.body,
  );
}
