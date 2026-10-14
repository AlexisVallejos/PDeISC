"use client";

import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, Crown, Pencil, Plus, Search, Trash2, UsersRound } from "lucide-react";
import { UserFormDialog } from "@/components/admin/UserFormDialog";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Notice } from "@/components/common/Notice";
import Counter from "@/components/reactbits/Counter";
import TiltedCard from "@/components/reactbits/TiltedCard";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useUsersPanel } from "@/hooks/useUsersPanel";
import { cardArt } from "@/utils/cardArt";
import { avatarTone } from "@/utils/avatarTone";
import { formatDate } from "@/utils/formatDate";
import { initials } from "@/utils/initials";

const TONES = ["#dfe4ff", "#ffe0cf", "#d9ecff", "#e9e0ff"] as const;

// directorio en tarjetas modulares que se inclinan hacia el puntero
export function UsersView() {
  const panel = useUsersPanel();
  const { user: me } = useAuth();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const counter = { fontSize: 30, gap: 2, textColor: "currentColor", fontWeight: 800, gradientFrom: "transparent", gradientTo: "transparent" };

  return (
    <div className="users-layout">
      <aside className="users-side">
        <span className="eyebrow">Gestión de usuarios</span>
        <h1 className="title">Tu comunidad,<br /><span className="accent">de un vistazo</span></h1>
        <p className="lead">Personas, roles y accesos en un solo lugar para un equipo más conectado.</p>

        <form className="search" role="search" onSubmit={(event) => { event.preventDefault(); panel.load(); }}>
          <Search aria-hidden="true" />
          <input type="search" placeholder="Buscar usuario..." aria-label="Buscar usuarios" value={panel.search} maxLength={120} onChange={(event) => panel.setSearch(event.target.value)} />
        </form>

        <button type="button" className="btn btn-primary btn-block btn-lg" onClick={panel.openCreate}>
          <Plus aria-hidden="true" /> Crear usuario
        </button>

        <section className="stats" aria-label="Estadísticas">
          <header>
            <span className="eyebrow">Estadísticas</span>
            <span className="stats-total"><small>Total de usuarios</small><Counter value={panel.stats.total} {...counter} /></span>
          </header>
          <div className="stats-grid">
            <div className="stat"><span className="stat-icon is-blue"><UsersRound aria-hidden="true" /></span><Counter value={panel.stats.members} {...counter} fontSize={24} /><small>Usuarios</small></div>
            <div className="stat"><span className="stat-icon is-peach"><Crown aria-hidden="true" /></span><Counter value={panel.stats.admins} {...counter} fontSize={24} /><small>Administradores</small></div>
          </div>
        </section>
      </aside>

      <section className="users-grid-wrap" aria-label="Usuarios">
        <Notice notice={panel.notice} />
        {panel.users.length === 0 ? (
          <p className="empty">No hay usuarios que coincidan con la búsqueda.</p>
        ) : (
          <ul className="users-grid">
            <AnimatePresence initial={false}>
              {panel.users.map((person, index) => (
                <motion.li
                  key={person.id}
                  layout
                  initial={{ opacity: 0, scale: 0.94, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0, transition: { type: "spring", bounce: 0.25, duration: 0.55, delay: Math.min(index, 8) * 0.05 } }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.18 } }}
                >
                  <TiltedCard
                    imageSrc={cardArt(person.id, dark)}
                    altText=""
                    containerHeight="12.5rem"
                    containerWidth="100%"
                    imageHeight="12.5rem"
                    imageWidth="100%"
                    rotateAmplitude={9}
                    scaleOnHover={1.03}
                    showMobileWarning={false}
                    showTooltip={false}
                    displayOverlayContent
                    overlayContent={
                      <article className="user-card">
                        <span className="avatar" style={{ "--tone": avatarTone(person.nombre, TONES) } as React.CSSProperties}>{initials(person.nombre)}</span>
                        <div className="user-card-body">
                          <h2>{person.nombre}{person.id === me?.id && <small> (vos)</small>}</h2>
                          <p>{person.email}</p>
                          <span className={person.rol === "administrador" ? "pill is-admin" : "pill"}>
                            {person.rol === "administrador" && <Crown aria-hidden="true" />}
                            {person.rol === "administrador" ? "Administrador" : "Usuario"}
                          </span>
                          <p className="joined"><CalendarDays aria-hidden="true" /> Se unió el {formatDate(person.creado_en)}</p>
                        </div>
                        <div className="user-card-actions">
                          <button type="button" className="icon-btn" onClick={() => panel.openEdit(person)} aria-label={`Editar a ${person.nombre}`}><Pencil aria-hidden="true" /></button>
                          <button type="button" className="icon-btn is-danger" onClick={() => panel.askDelete(person)} disabled={person.id === me?.id} aria-label={`Eliminar a ${person.nombre}`}><Trash2 aria-hidden="true" /></button>
                        </div>
                      </article>
                    }
                  />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
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
