import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { GetStaticPaths, GetStaticProps } from 'next'
import Layout from '@/components/Layout'
import FlashcardDeck from '@/components/FlashcardDeck'
import VocabularyTable from '@/components/VocabularyTable'
import GrammarPatterns from '@/components/GrammarPatterns'
import ExamTips from '@/components/ExamTips'
import styles from '@/styles/Video.module.css'

// ─── Types ────────────────────────────────────────────────────────────────────

interface StudyNotes {
  summary?: string
  key_concept?: string
  grammar_rule?: string
  word_order_note?: string
  common_mistakes?: string[]
}

interface VocabItem {
  de: string
  en: string
  example_de: string
  example_en: string
}

interface GrammarPattern {
  pattern: string
  structure: string
  example_de: string
  example_en: string
  telc_relevance: string
}

interface Flashcard {
  front: string
  back: string
  type: string
}

interface PracticeSentence {
  de: string
  en: string
  hint: string
}

interface ExamTip {
  tip: string
  telc_section: string
}

interface VisualSummary {
  title: string
  table: { headers: string[]; rows: string[][] }
  key_points: string[]
}

export interface Video {
  video_id: string
  title: string
  url?: string
  telc_section?: string
  study_notes?: StudyNotes
  vocabulary?: VocabItem[]
  grammar_patterns?: GrammarPattern[]
  flashcards?: Flashcard[]
  practice_sentences?: PracticeSentence[]
  exam_tips?: ExamTip[]
  visual_summary?: VisualSummary
}

interface CourseContent {
  videos: Video[]
}

// ─── Data Loading ─────────────────────────────────────────────────────────────

function loadCourseContent(): CourseContent {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('@/data/course_content.json') as CourseContent
  } catch {
    return { videos: [] }
  }
}

// ─── Static Generation ────────────────────────────────────────────────────────

export const getStaticPaths: GetStaticPaths = () => {
  const content = loadCourseContent()
  const paths = (content.videos ?? []).map(v => ({
    params: { id: v.video_id },
  }))
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<{ video: Video }> = ({ params }) => {
  const content = loadCourseContent()
  const video = (content.videos ?? []).find(v => v.video_id === params?.id)
  if (!video) {
    return { notFound: true }
  }
  return { props: { video } }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TABS = ['Notes', 'Vocabulary', 'Grammar', 'Flashcards', 'Practice', 'Tips'] as const
type Tab = (typeof TABS)[number]

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

function getYouTubeId(url: string): string | null {
  const m = url?.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
}

// ─── Components ───────────────────────────────────────────────────────────────

function NotesTab({ notes }: { notes?: StudyNotes }) {
  if (!notes) return <NoContent message="No study notes available." />
  return (
    <div className={styles.section}>
      <div className={styles.notesGrid}>
        {notes.summary && (
          <div className={styles.noteCard}>
            <div className={styles.noteLabel}>Summary</div>
            <p className={styles.noteText}>{notes.summary}</p>
          </div>
        )}
        {notes.key_concept && (
          <div className={styles.noteCard}>
            <div className={styles.noteLabel}>Key Concept</div>
            <p className={styles.noteText}>{notes.key_concept}</p>
          </div>
        )}
        {notes.grammar_rule && (
          <div className={styles.noteCard}>
            <div className={styles.noteLabel}>Grammar Rule</div>
            <p className={styles.noteText}>{notes.grammar_rule}</p>
          </div>
        )}
        {notes.word_order_note && (
          <div className={styles.noteCard}>
            <div className={styles.noteLabel}>Word Order</div>
            <p className={styles.noteText}>{notes.word_order_note}</p>
          </div>
        )}
        {notes.common_mistakes && notes.common_mistakes.length > 0 && (
          <div className={styles.noteCard}>
            <div className={styles.noteLabel}>Common Mistakes</div>
            <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
              {notes.common_mistakes.map((m, i) => (
                <li key={i} className={styles.noteText}>{m}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

function PracticeTab({ sentences }: { sentences?: PracticeSentence[] }) {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})
  if (!sentences || sentences.length === 0) return <NoContent message="No practice sentences available." />

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Practice Sentences</h3>
      <div className={styles.sentenceList}>
        {sentences.map((s, i) => (
          <div key={i} className={styles.sentenceCard}>
            <div className={styles.sentenceDe}>{s.de}</div>
            <div className={styles.sentenceEn}>{s.en}</div>
            {s.hint && (
              <>
                {revealed[i] ? (
                  <span className={styles.sentenceHint}>Hint: {s.hint}</span>
                ) : (
                  <button
                    onClick={() => setRevealed(r => ({ ...r, [i]: true }))}
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--color-text-muted)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      textDecoration: 'underline',
                    }}
                  >
                    Show hint
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function VisualSummarySection({ visual_summary }: { visual_summary?: VisualSummary }) {
  if (!visual_summary) return null
  const { title, table, key_points } = visual_summary
  const hasTable = table?.headers?.length > 0

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Visual Summary</h3>
      <div className={styles.visualSummary}>
        {title && <div className={styles.visualSummaryTitle}>{title}</div>}
        {hasTable && (
          <div style={{ overflowX: 'auto' }}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  {table.headers.map((h, i) => (
                    <th key={i}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(table.rows ?? []).map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {key_points && key_points.length > 0 && (
          <div className={styles.keyPoints}>
            {key_points.map((kp, i) => (
              <div key={i} className={styles.keyPoint}>{kp}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function NoContent({ message }: { message: string }) {
  return (
    <div className={styles.noContent}>
      <div className={styles.noContentIcon}>📭</div>
      <p className={styles.noContentText}>{message}</p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VideoPage({ video }: { video: Video }) {
  const [activeTab, setActiveTab] = useState<Tab>('Notes')
  const ytId = video.url ? getYouTubeId(video.url) : null

  return (
    <Layout title={video.title}>
      <Head>
        <title>{video.title} — TELC B1 Deutsch</title>
      </Head>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <Link href="/" className={styles.backLink}>
            ← Back to all videos
          </Link>
          <div className={styles.videoMeta}>
            {video.telc_section && (
              <span className={`badge ${sectionToClass(video.telc_section)}`}>
                {video.telc_section}
              </span>
            )}
          </div>
          <h1 className={styles.videoTitle}>{video.title}</h1>
          {video.url && (
            <p className={styles.videoSection}>
              <a href={video.url} target="_blank" rel="noopener noreferrer" style={{ color: '#FFCE00' }}>
                Watch on YouTube →
              </a>
            </p>
          )}
        </div>
      </div>

      {/* YouTube Embed */}
      {ytId && (
        <div
          style={{
            background: '#000',
            display: 'flex',
            justifyContent: 'center',
            padding: '1.5rem 0',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '800px',
              aspectRatio: '16/9',
              margin: '0 1.5rem',
            }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${ytId}`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: '100%', height: '100%', border: 0, borderRadius: '8px' }}
            />
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className={styles.tabNav}>
        <div className={styles.tabNavInner}>
          {TABS.map(tab => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {activeTab === 'Notes' && (
          <>
            <NotesTab notes={video.study_notes} />
            <VisualSummarySection visual_summary={video.visual_summary} />
          </>
        )}
        {activeTab === 'Vocabulary' && (
          <VocabularyTable vocabulary={video.vocabulary ?? []} />
        )}
        {activeTab === 'Grammar' && (
          <GrammarPatterns patterns={video.grammar_patterns ?? []} />
        )}
        {activeTab === 'Flashcards' && (
          <FlashcardDeck flashcards={video.flashcards ?? []} />
        )}
        {activeTab === 'Practice' && (
          <PracticeTab sentences={video.practice_sentences} />
        )}
        {activeTab === 'Tips' && (
          <ExamTips tips={video.exam_tips ?? []} />
        )}
      </div>
    </Layout>
  )
}
