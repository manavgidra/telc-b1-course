import React, { useState, useMemo, useEffect, useCallback } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { cleanTitle } from '@/utils/cleanTitle'
import styles from '@/styles/Home.module.css'
import grammarData from '@/data/grammar_foundation.json'

// Types
interface Video {
  video_id: string
  title: string
  url?: string
  telc_section?: string
  study_notes?: {
    summary?: string
    key_concept?: string
    grammar_rule?: string
    word_order_note?: string
    common_mistakes?: string[]
  }
  vocabulary?: Array<{ de: string; en: string; example_de: string; example_en: string }>
  grammar_patterns?: Array<{ pattern: string; structure: string; example_de: string; example_en: string; telc_relevance: string }>
  flashcards?: Array<{ front: string; back: string; type: string }>
  practice_sentences?: Array<{ de: string; en: string; hint: string }>
  exam_tips?: Array<{ tip: string; telc_section: string }>
  visual_summary?: {
    title: string
    table: { headers: string[]; rows: string[][] }
    key_points: string[]
  }
}

interface CourseContent {
  videos: Video[]
}

// Load data with fallback
let courseContent: CourseContent = { videos: [] }
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  courseContent = require('@/data/course_content.json') as CourseContent
} catch {
  courseContent = { videos: [] }
}

const ALL_SECTIONS = ['All', 'Sprachbausteine', 'Schreiben', 'Sprechen', 'Lesen', 'Hören', 'General B1']

const SECTION_ICONS: Record<string, string> = {
  Sprachbausteine: '🔤',
  Schreiben: '✍️',
  Sprechen: '🗣️',
  Lesen: '📖',
  Hören: '🎧',
  'General B1': '🎯',
}

function sectionToClass(section: string): string {
  const map: Record<string, string> = {
    Sprachbausteine: 'badge-sprachbausteine',
    Schreiben: 'badge-schreiben',
    Sprechen: 'badge-sprechen',
    Lesen: 'badge-lesen',
    Hören: 'badge-horen',
    'General B1': 'badge-general',
  }
  return map[section] ?? 'badge-general'
}

const QUICK_ACTIONS = [
  { href: '/practice/schreiben', icon: '✍️', label: 'Schreiben', desc: 'Email writing practice', color: '#bee3f8' },
  { href: '/practice/sprechen', icon: '🗣️', label: 'Sprechen', desc: 'Speaking exercises', color: '#fed7e2' },
  { href: '/practice/lesen', icon: '📖', label: 'Lesen', desc: 'Reading comprehension', color: '#c6f6d5' },
  { href: '/practice/horen', icon: '🎧', label: 'Hören', desc: 'Listening strategies', color: '#fefcbf' },
]

// Exam date: June 16, 2026
const EXAM_DATE = new Date('2026-06-16T09:00:00')

function getProgress(): Record<string, boolean> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem('telc-progress') || '{}')
  } catch { return {} }
}

function setProgress(progress: Record<string, boolean>) {
  if (typeof window === 'undefined') return
  localStorage.setItem('telc-progress', JSON.stringify(progress))
}

function getDaysUntilExam(): number {
  const now = new Date()
  const diff = EXAM_DATE.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

function getFoundationProgress(): Record<string, boolean> {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem('telc-foundation') || '{}') } catch { return {} }
}

export default function HomePage() {
  const videos: Video[] = courseContent?.videos ?? []
  const [search, setSearch] = useState('')
  const [activeSection, setActiveSection] = useState('All')
  const [progress, setProgressState] = useState<Record<string, boolean>>({})
  const [foundationProgress, setFoundationProgress] = useState<Record<string, boolean>>({})
  const [daysLeft, setDaysLeft] = useState<number | null>(null)

  useEffect(() => {
    setProgressState(getProgress())
    setFoundationProgress(getFoundationProgress())
    setDaysLeft(getDaysUntilExam())
  }, [])

  const toggleComplete = useCallback((videoId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setProgressState(prev => {
      const next = { ...prev, [videoId]: !prev[videoId] }
      setProgress(next)
      return next
    })
  }, [])

  const filtered = useMemo(() => {
    return videos.filter(v => {
      const title = cleanTitle(v.title)
      const matchSearch = search === '' || title.toLowerCase().includes(search.toLowerCase())
      const matchSection = activeSection === 'All' || v.telc_section === activeSection
      return matchSearch && matchSection
    })
  }, [videos, search, activeSection])

  const sectionCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    videos.forEach(v => {
      const s = v.telc_section ?? 'General B1'
      counts[s] = (counts[s] ?? 0) + 1
    })
    return counts
  }, [videos])

  const sectionProgress = useMemo(() => {
    const result: Record<string, { done: number; total: number }> = {}
    videos.forEach(v => {
      const s = v.telc_section ?? 'General B1'
      if (!result[s]) result[s] = { done: 0, total: 0 }
      result[s].total++
      if (progress[v.video_id]) result[s].done++
    })
    return result
  }, [videos, progress])

  const totalDone = Object.values(progress).filter(Boolean).length

  const foundationTotal = grammarData?.topics?.length ?? 13
  const foundationDone = grammarData?.topics
    ? grammarData.topics.filter((t: any) => foundationProgress[t.id]).length
    : 0
  const foundationPct = foundationTotal > 0 ? Math.round((foundationDone / foundationTotal) * 100) : 0
  const totalPercent = videos.length > 0 ? Math.round((totalDone / videos.length) * 100) : 0

  return (
    <Layout title="TELC B1 Deutsch — Home">
      <Head>
        <title>TELC B1 Deutsch — Complete Study Platform</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Exam Countdown Banner */}
      {daysLeft !== null && daysLeft > 0 && (
        <div className={styles.countdownBanner}>
          <div className={styles.countdownInner}>
            <span className={styles.countdownIcon}>📅</span>
            <span className={styles.countdownText}>
              <strong>{daysLeft} days</strong> until your TELC B1 exam — 16 June 2026
            </span>
            <span className={styles.countdownBar}>
              <span
                className={styles.countdownBarFill}
                style={{ width: `${totalPercent}%` }}
              />
            </span>
            <span className={styles.countdownPercent}>{totalPercent}% complete</span>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroFlag}>
            <span className={`${styles.flagStripe} ${styles.flagBlack}`} />
            <span className={`${styles.flagStripe} ${styles.flagRed}`} />
            <span className={`${styles.flagStripe} ${styles.flagGold}`} />
          </div>
          <h1 className={styles.heroTitle}>
            TELC B1 <span>Deutsch</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Complete study platform — notes, flashcards, grammar, and exam practice
          </p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <div className={styles.heroStatNumber}>{videos.length}</div>
              <div className={styles.heroStatLabel}>Videos</div>
            </div>
            <div className={styles.heroStat}>
              <div className={styles.heroStatNumber}>{totalDone}</div>
              <div className={styles.heroStatLabel}>Completed</div>
            </div>
            <div className={styles.heroStat}>
              <div className={styles.heroStatNumber}>{Object.keys(sectionCounts).length}</div>
              <div className={styles.heroStatLabel}>Sections</div>
            </div>
            <div className={styles.heroStat}>
              <div className={styles.heroStatNumber}>B1</div>
              <div className={styles.heroStatLabel}>Level</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Progress Bars */}
      <div className={styles.sectionProgressContainer}>
        <div className={styles.sectionProgressTitle}>Progress by Section</div>
        <div className={styles.sectionProgressGrid}>
          {ALL_SECTIONS.filter(s => s !== 'All').map(s => {
            const sp = sectionProgress[s] ?? { done: 0, total: 0 }
            const pct = sp.total > 0 ? Math.round((sp.done / sp.total) * 100) : 0
            return (
              <button
                key={s}
                className={`${styles.sectionProgressCard} ${activeSection === s ? styles.sectionProgressCardActive : ''}`}
                onClick={() => setActiveSection(s === activeSection ? 'All' : s)}
              >
                <div className={styles.sectionProgressHeader}>
                  <span>{SECTION_ICONS[s] ?? ''} {s}</span>
                  <span className={styles.sectionProgressCount}>{sp.done}/{sp.total}</span>
                </div>
                <div className={styles.sectionProgressBarOuter}>
                  <div
                    className={styles.sectionProgressBarInner}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </button>
            )
          })}
          <a href="/foundation" className={styles.sectionProgressCard} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className={styles.sectionProgressHeader}>
              <span>📐 A2 Foundation</span>
              <span className={styles.sectionProgressCount}>
                {foundationDone}/{foundationTotal}
                {foundationDone === foundationTotal && foundationTotal > 0 ? ' ✨' : ''}
              </span>
            </div>
            <div className={styles.sectionProgressBarOuter}>
              <div
                className={styles.sectionProgressBarInner}
                style={{ width: `${foundationPct}%`, background: foundationDone === foundationTotal && foundationTotal > 0 ? 'var(--color-success, #38a169)' : undefined }}
              />
            </div>
            {foundationDone === foundationTotal && foundationTotal > 0 && (
              <div style={{ fontSize: '0.7rem', color: 'var(--color-success, #38a169)', fontWeight: 600, marginTop: 2 }}>Ready for B1</div>
            )}
          </a>
        </div>
      </div>

      {/* Quick actions */}
      <div className={styles.quickActions}>
        <div className={styles.quickActionsTitle}>Exam Practice Modules</div>
        <div className={styles.quickActionsGrid}>
          {QUICK_ACTIONS.map(qa => (
            <Link key={qa.href} href={qa.href} className={styles.quickActionCard}>
              <div className={styles.quickActionIcon} style={{ background: qa.color }}>
                {qa.icon}
              </div>
              <div className={styles.quickActionText}>
                <h3>{qa.label}</h3>
                <p>{qa.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Search + Filters */}
      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search videos…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search videos"
          />
        </div>
        <div className={styles.filterGroup}>
          {ALL_SECTIONS.map(s => (
            <button
              key={s}
              className={`${styles.filterBtn} ${activeSection === s ? styles.filterBtnActive : ''}`}
              onClick={() => setActiveSection(s)}
            >
              {s !== 'All' ? (SECTION_ICONS[s] ?? '') + ' ' : ''}{s}
            </button>
          ))}
        </div>
      </div>

      {/* Video grid */}
      <div className={styles.levelSection}>
        {videos.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>📹</div>
            <div className={styles.emptyStateTitle}>No videos yet</div>
            <p className={styles.emptyStateText}>
              Run the transcript extraction script to load your study videos.
            </p>
          </div>
        ) : (
          <div className={styles.videosGrid}>
            {filtered.length === 0 ? (
              <div className={styles.noResults}>
                No videos match your search. Try a different keyword or filter.
              </div>
            ) : (
              filtered.map(video => (
                <Link
                  key={video.video_id}
                  href={`/video/${video.video_id}`}
                  className={`${styles.videoCard} ${progress[video.video_id] ? styles.videoCardDone : ''}`}
                >
                  <div className={styles.videoCardHeader}>
                    <div className={styles.videoThumbnailPlaceholder}>
                      {SECTION_ICONS[video.telc_section ?? ''] ?? '📹'}
                    </div>
                    <div className={styles.videoCardBadges}>
                      {video.telc_section && (
                        <span className={`badge ${sectionToClass(video.telc_section)}`}>
                          {video.telc_section}
                        </span>
                      )}
                      <button
                        className={`${styles.checkBtn} ${progress[video.video_id] ? styles.checkBtnDone : ''}`}
                        onClick={(e) => toggleComplete(video.video_id, e)}
                        title={progress[video.video_id] ? 'Mark as not done' : 'Mark as done'}
                        aria-label="Toggle completed"
                      >
                        {progress[video.video_id] ? '✅' : '⬜'}
                      </button>
                    </div>
                  </div>
                  <div className={styles.videoTitle}>{cleanTitle(video.title)}</div>
                  <div className={styles.videoCardFooter}>
                    <span className={styles.videoCardMeta}>
                      {[
                        video.vocabulary?.length ? `${video.vocabulary.length} vocab` : null,
                        video.flashcards?.length ? `${video.flashcards.length} cards` : null,
                      ]
                        .filter(Boolean)
                        .join(' · ') || 'Study notes'}
                    </span>
                    <span className={styles.videoCardArrow}>→</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
