"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { UserFormDialog } from "@/components/admin/UserFormDialog";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Notice } from "@/components/common/Notice";
import { useAuth } from "@/context/AuthContext";
import { useUsersPanel } from "@/hooks/useUsersPanel";
import { formatDate } from "@/utils/formatDate";
import { EditorialTitle } from "./EditorialTitle";
import { PaperCollage } from "./PaperCollage";

// el correo puede cortarse después de la @, nunca a mitad del usuario o del dominio
function breakAtSign(email: string) {
  const at = email.indexOf("@");
  return at < 0 ? email : <>{email.slice(0, at)}<wbr />{email.slice(at)}</>;
}

// directorio como índice de revista: nombres en serif grande, columnas finas y acciones redondas
export function UsersView() {
  const panel = useUsersPanel();
  const { user: me } = useAuth();

  return (
    <div className="users-layout">
      <aside className="users-cover">
        <EditorialTitle lines={["Un espacio", "para cada"]} emphasis="persona" />
        <p className="dek">Gestioná el equipo, da acceso y mantené el estudio en movimiento.</p>
        <p className="tally">
          <strong>{panel.stats.total}</strong> personas · <strong>{panel.stats.admins}</strong> en dirección
        </p>
        <PaperCollage className="users-collage">
          <button type="button" className="collage-cta" onClick={panel.openCreate}>
            <span className="cta-disc"><Plus aria-hidden="true" /></span>
            <span className="cta-label">Nuevo usuario</span>
            <ArrowRight aria-hidden="true" />
          </button>
        </PaperCollage>
      </aside>

      <section className="users-index" aria-label="Personas">
        <form className="search" role="search" onSubmit={(event) => { event.preventDefault(); panel.load(); }}>
          <Search aria-hidden="true" />
          <input type="search" placeholder="Buscar por nombre o correo" aria-label="Buscar personas" value={panel.search} maxLength={120} onChange={(event) => panel.setSearch(event.target.value)} />
          <button type="submit">Buscar</button>
        </form>

        <Notice notice={panel.notice} />

        <div className="index-head" aria-hidden="true">
          <span>Nombre</span><span>Rol</span><span>Correo electrónico</span><span>Alta</span><span />
        </div>

        {panel.users.length === 0 ? (
          <p className="empty">Ninguna persona coincide con la búsqueda.</p>
        ) : (
          <ol className="index-list">
            <AnimatePresence initial={false}>
              {panel.users.map((person, index) => (
                <motion.li
                  key={person.id}
                  className="index-row"
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0, transition: { type: "spring", bounce: 0, duration: 0.6, delay: Math.min(index, 8) * 0.05 } }}
                  exit={{ opacity: 0, transition: { duration: 0.18 } }}
                >
                  <h2 className="index-name">{person.nombre}{person.id === me?.id && <small> vos</small>}</h2>
                  <span className={person.rol === "administrador" ? "role is-admin" : "role"}>{person.rol === "administrador" ? "Administrador" : "Usuario"}</span>
                  <span className="index-mail">{breakAtSign(person.email)}</span>
                  <time className="index-date" dateTime={person.creado_en}>{formatDate(person.creado_en)}</time>
                  <span className="index-actions">
                    <button type="button" className="round" onClick={() => panel.openEdit(person)} aria-label={`Editar a ${person.nombre}`}><Pencil aria-hidden="true" /></button>
                    <button type="button" className="round is-coral" onClick={() => panel.askDelete(person)} disabled={person.id === me?.id} aria-label={`Eliminar a ${person.nombre}`}><Trash2 aria-hidden="true" /></button>
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
        )}
      </section>

      <UserFormDialog open={panel.formOpen} user={panel.editing} onClose={panel.closeForm} onSave={panel.saveUser} />
      <ConfirmDialog
        open={!!panel.deleting}
        danger
        title="¿Eliminar usuario?"
        text={`Se va a borrar la cuenta de ${panel.deleting?.nombre ?? ""} y sus redes vinculadas. No se puede deshacer.`}
        confirmLabel="Eliminar"
        onConfirm={panel.confirmDelete}
        onCancel={panel.cancelDelete}
      />
    </div>
  );
}
