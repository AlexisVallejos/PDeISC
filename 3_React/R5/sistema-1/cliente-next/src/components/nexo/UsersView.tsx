"use client";

import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, Crown, Pencil, Plus, Search, ShieldCheck, Trash2, UserPlus, UsersRound } from "lucide-react";
import { UserFormDialog } from "@/components/admin/UserFormDialog";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Notice } from "@/components/common/Notice";
import CountUp from "@/components/reactbits/CountUp";
import DecryptedText from "@/components/reactbits/DecryptedText";
import Magnet from "@/components/reactbits/Magnet";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useUsersPanel } from "@/hooks/useUsersPanel";
import { avatarTone } from "@/utils/avatarTone";
import { formatDate } from "@/utils/formatDate";
import { initials } from "@/utils/initials";

const TONES = ["#c7ff58", "#8fb8ff", "#ffb86b", "#c9a2ff", "#7ee0c3", "#ff9eb5"] as const;

// panel del administrador: métricas, búsqueda y la lista de personas
export function UsersView() {
  const panel = useUsersPanel();
  const { user: me } = useAuth();
  const { theme } = useTheme();
  const spot = { theme, spotlightColor: theme === "dark" ? "rgba(199, 255, 88, 0.16)" : "rgba(76, 138, 18, 0.12)", style: { "--spotlight-card-surface": "var(--glass)" } as React.CSSProperties };

  const metrics = [
    { icon: UsersRound, value: panel.stats.total, label: "Personas registradas" },
    { icon: UserPlus, value: panel.stats.members, label: "Usuarios" },
    { icon: Crown, value: panel.stats.admins, label: "Administradores" },
  ];

  return (
    <div className="users-layout">
      <aside className="users-hero">
        <h1 className="display">
          Personas,
          <br />
          <DecryptedText text="en orden." animateOn="view" sequential speed={45} className="accent" encryptedClassName="accent dim" characters="01<>/#*+=" />
        </h1>
        <p className="lead">Un equipo organizado hace grandes cosas.</p>
        <p className="quote" aria-hidden="true">“Personas<br />ideas<br />resultados”</p>
      </aside>

      <section className="users-main" aria-label="Gestión de personas">
        <SpotlightCard className="metrics" {...spot}>
          <div className="metrics-grid">
            {metrics.map(({ icon: Icon, value, label }) => (
              <div key={label} className="metric">
                <span className="metric-icon"><Icon aria-hidden="true" /></span>
                <strong><CountUp to={value} duration={1.2} /></strong>
                <span>{label}</span>
              </div>
            ))}
            <div className="metric">
              <span className="metric-icon"><ShieldCheck aria-hidden="true" /></span>
              <strong>SQL</strong>
              <span>Datos protegidos</span>
            </div>
          </div>
        </SpotlightCard>

        <div className="toolbar">
          <form className="search" role="search" onSubmit={(event) => { event.preventDefault(); panel.load(); }}>
            <Search aria-hidden="true" />
            <input type="search" placeholder="Buscar por nombre o correo..." aria-label="Buscar personas" value={panel.search} maxLength={120} onChange={(event) => panel.setSearch(event.target.value)} />
            <button type="submit" className="btn btn-ghost btn-sm">Buscar</button>
          </form>
          <Magnet padding={30} magnetStrength={5} maxOffset={6}>
            <button type="button" className="btn btn-primary" onClick={panel.openCreate}>
              <Plus aria-hidden="true" /> Nuevo usuario
            </button>
          </Magnet>
        </div>

        <Notice notice={panel.notice} />

        <SpotlightCard className="user-list" {...spot}>
          {panel.users.length === 0 ? (
            <p className="empty">No hay personas que coincidan con la búsqueda.</p>
          ) : (
            <ul>
              <AnimatePresence initial={false}>
                {panel.users.map((person, index) => (
                  <motion.li
                    key={person.id}
                    className="user-row"
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0, transition: { type: "spring", bounce: 0, duration: 0.45, delay: Math.min(index, 8) * 0.04 } }}
                    exit={{ opacity: 0, x: -16, transition: { duration: 0.18 } }}
                  >
                    <span className="avatar" style={{ "--tone": avatarTone(person.nombre, TONES) } as React.CSSProperties}>{initials(person.nombre)}</span>
                    <span className="user-name">
                      <strong>{person.nombre}{person.id === me?.id && <em> (vos)</em>}</strong>
                      <small>{person.email}</small>
                    </span>
                    <span className={person.rol === "administrador" ? "badge is-admin" : "badge"}>{person.rol === "administrador" ? "Administrador" : "Usuario"}</span>
                    <span className="user-date"><CalendarDays aria-hidden="true" /><span><small>Se unió el</small>{formatDate(person.creado_en)}</span></span>
                    <span className="row-actions">
                      <button type="button" className="icon-btn" onClick={() => panel.openEdit(person)} aria-label={`Editar a ${person.nombre}`}><Pencil aria-hidden="true" /></button>
                      <button type="button" className="icon-btn is-danger" onClick={() => panel.askDelete(person)} disabled={person.id === me?.id} aria-label={`Eliminar a ${person.nombre}`}><Trash2 aria-hidden="true" /></button>
                    </span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </SpotlightCard>
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
