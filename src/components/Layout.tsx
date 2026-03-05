import React, { useState, ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './Layout.module.css'

interface LayoutProps {
  children: ReactNode
  title?: string
}

export default function Layout({ children, title = 'TELC B1 Deutsch' }: LayoutProps) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === '/') return router.pathname === '/'
    return router.pathname.startsWith(path)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.flagBar}>
        <div className={styles.flagBlack} />
        <div className={styles.flagRed} />
        <div className={styles.flagGold} />
      </div>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>🇩🇪</span>
            <span className={styles.logoText}>TELC B1 Deutsch</span>
          </Link>
          <nav className={styles.nav}>
            <Link href="/" className={`${styles.navLink} ${isActive('/') ? styles.navLinkActive : ''}`}>
              Home
            </Link>
            <Link href="/practice" className={`${styles.navLink} ${isActive('/practice') ? styles.navLinkActive : ''}`}>
              Practice
            </Link>
          </nav>
          <button
            className={styles.menuToggle}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={`${styles.menuBar} ${menuOpen ? styles.menuBarOpen1 : ''}`} />
            <span className={`${styles.menuBar} ${menuOpen ? styles.menuBarOpen2 : ''}`} />
            <span className={`${styles.menuBar} ${menuOpen ? styles.menuBarOpen3 : ''}`} />
          </button>
        </div>
        {menuOpen && (
          <div className={styles.mobileMenu}>
            <Link href="/" className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link href="/practice" className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>
              Practice
            </Link>
          </div>
        )}
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p className={styles.footerText}>TELC B1 Study Platform &mdash; Viel Erfolg beim Lernen!</p>
          <div className={styles.footerFlag}>
            <span style={{ color: '#999', fontSize: '0.8rem' }}>🇩🇪 Deutsch B1</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
