import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import styles from '@/styles/Practice.module.css'

const MODULES = [
  {
    href: '/practice/schreiben',
    icon: '✍️',
    label: 'Schreiben',
    desc: '8 email writing exercises with model answers, Leitpunkte, and connector hints.',
    points: '45 pts',
    color: '#bee3f8',
  },
  {
    href: '/practice/sprechen',
    icon: '🗣️',
    label: 'Sprechen',
    desc: 'Self-intro practice, topic responses, and joint planning with a full phrase bank.',
    points: '75 pts',
    color: '#fed7e2',
  },
  {
    href: '/practice/lesen',
    icon: '📖',
    label: 'Lesen',
    desc: 'Three-part reading exercise: headline matching, MCQ detail, and person-to-notice matching.',
    points: '75 pts',
    color: '#c6f6d5',
  },
  {
    href: '/practice/horen',
    icon: '🎧',
    label: 'Hören',
    desc: 'Listening strategies, true/false, multiple-choice, and common distractor traps.',
    points: '75 pts',
    color: '#fefcbf',
  },
]

export default function PracticeIndex() {
  return (
    <Layout title="Practice — TELC B1 Deutsch">
      <Head>
        <title>Exam Practice — TELC B1 Deutsch</title>
      </Head>

      <div className={styles.pageHero}>
        <div className={styles.pageHeroInner}>
          <Link href="/" className={styles.backLink}>
            ← Back to Home
          </Link>
          <h1 className={styles.pageTitle}>Exam Practice Modules</h1>
          <p className={styles.pageSubtitle}>
            Prepare for all four TELC B1 exam components — total 270 written + 75 oral points
          </p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.moduleGrid}>
          {MODULES.map(m => (
            <Link key={m.href} href={m.href} className={styles.moduleCard}>
              <div className={styles.moduleIconWrap} style={{ background: m.color }}>
                {m.icon}
              </div>
              <div className={styles.moduleCardTitle}>{m.label}</div>
              <p className={styles.moduleCardDesc}>{m.desc}</p>
              <span className={styles.moduleCardPoints}>{m.points}</span>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  )
}
