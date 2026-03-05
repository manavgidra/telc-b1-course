import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import styles from '@/styles/Practice.module.css'

// ─── Types ────────────────────────────────────────────────────────────────────

interface TextItem {
  text?: string
  title?: string
  id?: string | number
}

interface Teil1 {
  description?: string
  headlines?: string[]
  texts?: TextItem[]
  answer_key?: (string | number)[]
  // legacy
  answers?: (string | number)[]
}

interface Question {
  question?: string
  options?: string[]
  correct_answer?: number
}

interface Teil2 {
  description?: string
  passage?: string
  questions?: Question[]
  answer_key?: number[]
}

interface PersonItem {
  name?: string
  description?: string
  text?: string
}

interface NoticeItem {
  title?: string
  text?: string
  id?: string | number
}

interface Teil3 {
  description?: string
  people?: PersonItem[]
  notices?: NoticeItem[]
  answer_key?: (string | number)[]
  // legacy
  answers?: (string | number)[]
}

interface LesenExercise {
  teil_1?: Teil1
  teil_2?: Teil2
  teil_3?: Teil3
}

interface LesenModule {
  title?: string
  description?: string
  exercise?: LesenExercise
  // Legacy flat shape
  teil1?: Teil1
  teil2?: Teil2
  teil3?: Teil3
}

interface PracticeModules {
  lesen?: LesenModule
}

// ─── Data Loading ─────────────────────────────────────────────────────────────

function loadModules(): PracticeModules {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('@/data/practice_modules.json') as PracticeModules
  } catch {
    return {}
  }
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function AnswerReveal({ answers }: { answers: (string | number)[] }) {
  const [open, setOpen] = useState(false)
  if (answers.length === 0) return null
  return (
    <>
      <button className={styles.revealBtn} onClick={() => setOpen(o => !o)}>
        {open ? 'Hide' : 'Show'} Answer Key
      </button>
      {open && (
        <div className={styles.answerKey}>
          Answer Key: {answers.join(', ')}
        </div>
      )}
    </>
  )
}

function MCQQuestion({
  q,
  idx,
}: {
  q: Question
  idx: number
}) {
  const [revealed, setRevealed] = useState(false)
  const options = q.options ?? []

  return (
    <div className={styles.exerciseCard} style={{ marginBottom: '1rem' }}>
      <div className={styles.exerciseCardHeader}>
        <div className={styles.exerciseTitle}>
          {idx + 1}. {q.question ?? `Question ${idx + 1}`}
        </div>
      </div>
      <div className={styles.exerciseCardBody}>
        <ul className={styles.optionList}>
          {options.map((opt, oi) => (
            <li
              key={oi}
              className={`${styles.optionItem} ${revealed && q.correct_answer === oi ? styles.optionCorrect : ''}`}
            >
              <span className={styles.optionLetter}>{String.fromCharCode(65 + oi)}.</span>
              {opt}
            </li>
          ))}
        </ul>
        <button className={styles.revealBtn} onClick={() => setRevealed(r => !r)}>
          {revealed ? 'Hide' : 'Show'} Answer
        </button>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LesenPage() {
  const modules = loadModules()
  const lesen = modules.lesen ?? {}

  // Normalise — support nested (exercise.teil_1) and legacy flat (teil1) shapes
  const t1: Teil1 = lesen.exercise?.teil_1 ?? lesen.teil1 ?? {}
  const t2: Teil2 = lesen.exercise?.teil_2 ?? lesen.teil2 ?? {}
  const t3: Teil3 = lesen.exercise?.teil_3 ?? lesen.teil3 ?? {}

  const t1Headlines: string[] = t1.headlines ?? []
  const t1Texts: TextItem[] = t1.texts ?? []
  const t1Answers: (string | number)[] = t1.answer_key ?? t1.answers ?? []

  const t2Questions: Question[] = t2.questions ?? []

  const t3People: PersonItem[] = t3.people ?? []
  const t3Notices: NoticeItem[] = t3.notices ?? []
  const t3Answers: (string | number)[] = t3.answer_key ?? t3.answers ?? []

  const isEmpty = t1Headlines.length === 0 && t2Questions.length === 0 && t3People.length === 0

  return (
    <Layout title="Lesen Practice — TELC B1">
      <Head>
        <title>Lesen Practice — TELC B1 Deutsch</title>
      </Head>

      <div className={styles.pageHero}>
        <div className={styles.pageHeroInner}>
          <Link href="/practice" className={styles.backLink}>
            ← Back to Practice
          </Link>
          <h1 className={styles.pageTitle}>
            📖 {lesen.title ?? 'Lesen — Reading Practice'}
          </h1>
          <p className={styles.pageSubtitle}>
            {lesen.description ??
              'Three-part reading comprehension: headline matching, detail MCQ, and notice matching. (75 points)'}
          </p>
        </div>
      </div>

      <div className={styles.content}>
        {isEmpty ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📖</div>
            <div className={styles.emptyTitle}>No exercises yet</div>
            <p className={styles.emptyText}>
              Lesen exercises will appear here once course content is generated.
            </p>
          </div>
        ) : (
          <>
            {/* Teil 1 — Headlines + Texts */}
            {(t1Headlines.length > 0 || t1Texts.length > 0) && (
              <div className={styles.teilSection}>
                <div className={styles.teilTitle}>Teil 1 — Headline Matching</div>
                {t1.description && (
                  <p className={styles.sectionDesc} style={{ marginBottom: '1rem' }}>{t1.description}</p>
                )}
                {t1Headlines.length > 0 && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p className={styles.fieldLabel}>Headlines:</p>
                    <div className={styles.matchGrid}>
                      {t1Headlines.map((h, i) => (
                        <div key={i} className={styles.matchCard}>
                          <div className={styles.matchCardLabel}>Headline {i + 1}</div>
                          <div className={styles.matchCardTitle}>{h}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {t1Texts.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <p className={styles.fieldLabel}>Texts:</p>
                    <div className={styles.exerciseList}>
                      {t1Texts.map((t, i) => (
                        <div key={i} className={styles.exerciseCard}>
                          <div className={styles.exerciseCardHeader}>
                            <div className={styles.exerciseTitle}>{t.title ?? `Text ${i + 1}`}</div>
                          </div>
                          {t.text && (
                            <div className={styles.exerciseCardBody}>
                              <p style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>{t.text}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <AnswerReveal answers={t1Answers} />
              </div>
            )}

            {/* Teil 2 — MCQ Detail */}
            {(t2.passage || t2Questions.length > 0) && (
              <div className={styles.teilSection}>
                <div className={styles.teilTitle}>Teil 2 — Reading Comprehension (MCQ)</div>
                {t2.description && (
                  <p className={styles.sectionDesc} style={{ marginBottom: '1rem' }}>{t2.description}</p>
                )}
                {t2.passage && (
                  <div className={styles.passage}>{t2.passage}</div>
                )}
                {t2Questions.map((q, i) => (
                  <MCQQuestion key={i} q={q} idx={i} />
                ))}
              </div>
            )}

            {/* Teil 3 — People + Notices Matching */}
            {(t3People.length > 0 || t3Notices.length > 0) && (
              <div className={styles.teilSection}>
                <div className={styles.teilTitle}>Teil 3 — Person-to-Notice Matching</div>
                {t3.description && (
                  <p className={styles.sectionDesc} style={{ marginBottom: '1rem' }}>{t3.description}</p>
                )}
                {t3People.length > 0 && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p className={styles.fieldLabel}>People:</p>
                    <div className={styles.matchGrid}>
                      {t3People.map((p, i) => (
                        <div key={i} className={styles.matchCard}>
                          <div className={styles.matchCardLabel}>Person {i + 1}</div>
                          <div className={styles.matchCardTitle}>{p.name ?? `Person ${i + 1}`}</div>
                          {(p.description ?? p.text) && (
                            <div className={styles.matchCardBody}>{p.description ?? p.text}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {t3Notices.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <p className={styles.fieldLabel}>Notices / Advertisements:</p>
                    <div className={styles.matchGrid}>
                      {t3Notices.map((n, i) => (
                        <div key={i} className={styles.matchCard}>
                          <div className={styles.matchCardLabel}>{n.id ?? String.fromCharCode(65 + i)}</div>
                          <div className={styles.matchCardTitle}>{n.title ?? `Notice ${i + 1}`}</div>
                          {n.text && (
                            <div className={styles.matchCardBody}>{n.text}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <AnswerReveal answers={t3Answers} />
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}
