import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import styles from '@/styles/Foundation.module.css'
import grammarData from '@/data/grammar_foundation.json'

function getFoundationProgress(): Record<string, boolean> {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem('telc-foundation') || '{}') } catch { return {} }
}

export default function FoundationIndex() {
  const [progress, setProgress] = useState<Record<string, boolean>>({})
  useEffect(() => { setProgress(getFoundationProgress()) }, [])

  const topics = grammarData.topics
  const core = topics.filter(t => t.type === 'core')
  const bridge = topics.filter(t => t.type === 'bridge')
  const done = topics.filter(t => progress[t.id]).length
  const allDone = done === topics.length

  return (
    <Layout title="A2 Foundation Grammar — TELC B1 Deutsch">
      <Head>
        <title>A2 Foundation Grammar — TELC B1 Deutsch</title>
      </Head>

      <div className={styles.pageHero}>
        <div className={styles.pageHeroInner}>
          <Link href="/" className={styles.backLink}>← Back to Home</Link>
          <h1 className={styles.pageTitle}>📐 A2 Foundation Grammar</h1>
          <p className={styles.pageSubtitle}>
            Master the 10 core A2 grammar topics + 3 bridge topics before tackling B1
          </p>
          <div className={`${styles.progressSummary} ${allDone ? styles.readyBadge : ''}`}>
            {allDone ? '✨ Ready for B1!' : `${done} / ${topics.length} complete`}
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <p className={styles.groupLabel}>Core A2 Grammar — 10 topics</p>
        <div className={styles.topicGrid}>
          {core.map(t => (
            <Link
              key={t.id}
              href={`/foundation/${t.id}`}
              className={`${styles.topicCard} ${progress[t.id] ? styles.topicCardDone : ''}`}
            >
              <span className={styles.topicIcon}>{t.icon}</span>
              <div className={styles.topicInfo}>
                <div className={styles.topicTitle}>{t.shortTitle}</div>
                <div className={styles.topicShort}>{t.title}</div>
              </div>
              <span className={styles.topicCheck}>{progress[t.id] ? '✅' : '⬜'}</span>
            </Link>
          ))}
        </div>

        <p className={`${styles.groupLabel} ${styles.groupLabelBridge}`}>🌉 A2 → B1 Bridge — 3 topics</p>
        <div className={styles.topicGrid}>
          {bridge.map(t => (
            <Link
              key={t.id}
              href={`/foundation/${t.id}`}
              className={`${styles.topicCard} ${styles.topicCardBridge} ${progress[t.id] ? styles.topicCardDone : ''}`}
            >
              <span className={styles.topicIcon}>{t.icon}</span>
              <div className={styles.topicInfo}>
                <div className={styles.topicTitle}>{t.shortTitle}</div>
                <div className={styles.topicShort}>{t.title}</div>
              </div>
              <span className={styles.topicCheck}>{progress[t.id] ? '✅' : '⬜'}</span>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  )
}
