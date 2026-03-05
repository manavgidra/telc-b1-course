import React, { useState, useMemo } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import styles from '@/styles/Home.module.css'

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

export default function HomePage() {
  const videos: Video[] = courseContent?.videos ?? []
  const [search, setSearch] = useState('')
  const [activeSection, setActiveSection] = useState('All')

  const filtered = useMemo(() => {
    return videos.filter(v => {
      const matchSearch = search === '' || v.title?.toLowerCase().includes(search.toLowerCase())
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

  return (
    <Layout title="TELC B1 Deutsch — Home">
      <Head>
        <title>TELC B1 Deutsch — Complete Study Platform</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

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
                  className={styles.videoCard}
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
                    </div>
                  </div>
                  <div className={styles.videoTitle}>{video.title}</div>
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
