import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Menu.module.css';

const links = [
  { href: '/',           label: 'Inicio' },
  { href: '/nosotros',   label: 'Nosotros' },
  { href: '/servicios',  label: 'Servicios' },
  { href: '/portafolio', label: 'Portafolio' },
  { href: '/blog',       label: 'Blog' },
  { href: '/contacto',   label: 'Contacto' },
];

export default function Menu() {
  const { pathname } = useRouter();

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>MiSitio</div>
      <ul className={styles.list}>
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link href={href} className={pathname === href ? styles.active : styles.link}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
