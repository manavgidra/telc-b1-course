import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import styles from '@/styles/Practice.module.css'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Teil1Exercise {
  id?: string
  statement?: string
  audio_script?: string
  correct_answer?: boolean
  // legacy
  text?: string
  script?: string
  answer?: boolean
}

interface Teil2Exercise {
  id?: string
  question?: string
  options?: string[]
  audio_script?: string
  correct_answer?: number
  // legacy
  script?: string
  answer?: number
}

interface HorenTeil1 {
  description?: string
  exercises?: Teil1Exercise[]
}

interface HorenTeil2 {
  description?: string
  exercises?: Teil2Exercise[]
}

interface HorenModule {
  title?: string
  description?: string
  strategies?: string[]
  teil_1?: HorenTeil1
  teil_2?: HorenTeil2
  common_distractor_traps?: string[]
  // Legacy flat fields
  teil1?: Teil1Exercise[]
  teil2?: Teil2Exercise[]
  distractor_traps?: string[]
}

interface PracticeModules {
  horen?: HorenModule
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

function Teil1Item({ item, idx }: { item: Teil1Exercise; idx: number }) {
  const [scriptOpen, setScriptOpen] = useState(false)
  const [answerOpen, setAnswerOpen] = useState(false)

  const statement = item.statement ?? item.text ?? `Statement ${idx + 1}`
  const script = item.audio_script ?? item.script ?? ''
  const correctAnswer = item.correct_answer ?? item.answer ?? false

  return (
    <div className={styles.exerciseCard}>
      <div className={styles.exerciseCardHeader}>
        <div>
          <div className={styles.exerciseNumber}>Statement {idx + 1}</div>
          <div className={styles.exerciseTitle}>{statement}</div>
        </div>
      </div>
      <div className={styles.exerciseCardBody}>
        {script && (
          <>
            <button className={styles.revealBtn} onClick={() => setScriptOpen(o => !o)}>
              {scriptOpen ? 'Hide' : 'Show'} Audio Script
            </button>
            {scriptOpen && (
              <div className={styles.audioScript}>
                <div className={styles.audioScriptLabel}>Audio Script:</div>
                {script}
              </div>
            )}
          </>
        )}
        <div style={{ marginTop: '0.75rem' }}>
          <button className={styles.revealBtn} onClick={() => setAnswerOpen(o => !o)}>
            {answerOpen ? 'Hide' : 'Show'} Answer
          </button>
          {answerOpen && (
            <div style={{ marginTop: '0.5rem' }}>
              <span className={correctAnswer ? styles.trueBadge : styles.falseBadge}>
                {correctAnswer ? 'Richtig (True)' : 'Falsch (False)'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Teil2Item({ item, idx }: { item: Teil2Exercise; idx: number }) {
  const [scriptOpen, setScriptOpen] = useState(false)
  const [answerOpen, setAnswerOpen] = useState(false)

  const question = item.question ?? `Question ${idx + 1}`
  const options = item.options ?? []
  const script = item.audio_script ?? item.script ?? ''
  const correctAnswer = item.correct_answer ?? item.answer ?? 0

  return (
    <div className={styles.exerciseCard}>
      <div className={styles.exerciseCardHeader}>
        <div>
          <div className={styles.exerciseNumber}>Question {idx + 1}</div>
          <div className={styles.exerciseTitle}>{question}</div>
        </div>
      </div>
      <div className={styles.exerciseCardBody}>
        {options.length > 0 && (
          <ul className={styles.optionList}>
            {options.map((opt, oi) => (
              <li
                key={oi}
                className={`${styles.optionItem} ${answerOpen && correctAnswer === oi ? styles.optionCorrect : ''}`}
              >
                <span className={styles.optionLetter}>{String.fromCharCode(65 + oi)}.</span>
                {opt}
              </li>
            ))}
          </ul>
        )}
        {script && (
          <>
            <button className={styles.revealBtn} onClick={() => setScriptOpen(o => !o)}>
              {scriptOpen ? 'Hide' : 'Show'} Audio Script
            </button>
            {scriptOpen && (
              <div className={styles.audioScript}>
                <div className={styles.audioScriptLabel}>Audio Script:</div>
                {script}
              </div>
            )}
          </>
        )}
        <button
          className={styles.revealBtn}
          onClick={() => setAnswerOpen(o => !o)}
          style={{ marginLeft: script ? '0.5rem' : '0' }}
        >
          {answerOpen ? 'Hide' : 'Show'} Answer
        </button>
        {answerOpen && options.length > 0 && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-success, #38a169)' }}>
            Correct: {String.fromCharCode(65 + correctAnswer)}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HorenPage() {
  const modules = loadModules()
  const horen = modules.horen ?? {}

  // Normalise — support nested and legacy flat shapes
  const strategies: string[] = horen.strategies ?? []
  const teil1Exercises: Teil1Exercise[] =
    horen.teil_1?.exercises ?? (Array.isArray(horen.teil1) ? (horen.teil1 as Teil1Exercise[]) : [])
  const teil2Exercises: Teil2Exercise[] =
    horen.teil_2?.exercises ?? (Array.isArray(horen.teil2) ? (horen.teil2 as Teil2Exercise[]) : [])
  const distractorTraps: string[] =
    horen.common_distractor_traps ?? horen.distractor_traps ?? []

  const teil1Desc = horen.teil_1?.description ?? ''
  const teil2Desc = horen.teil_2?.description ?? ''

  const isEmpty = strategies.length === 0 && teil1Exercises.length === 0 && teil2Exercises.length === 0

  return (
    <Layout title="Hören Practice — TELC B1">
      <Head>
        <title>Hören Practice — TELC B1 Deutsch</title>
      </Head>

      <div className={styles.pageHero}>
        <div className={styles.pageHeroInner}>
          <Link href="/practice" className={styles.backLink}>
            ← Back to Practice
          </Link>
          <h1 className={styles.pageTitle}>
            🎧 {horen.title ?? 'Hören — Listening Practice'}
          </h1>
          <p className={styles.pageSubtitle}>
            {horen.description ??
              'Listening comprehension strategies, true/false, and multiple-choice exercises. (75 points)'}
          </p>
        </div>
      </div>

      <div className={styles.content}>
        {isEmpty ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🎧</div>
            <div className={styles.emptyTitle}>No exercises yet</div>
            <p className={styles.emptyText}>
              Hören exercises will appear here once course content is generated.
            </p>
          </div>
        ) : (
          <>
            {/* Strategies */}
            {strategies.length > 0 && (
              <div className={styles.teilSection}>
                <div className={styles.teilTitle}>Listening Strategies</div>
                <div className={styles.strategyList}>
                  {strategies.map((s, i) => (
                    <div key={i} className={styles.strategyItem}>
                      <div className={styles.strategyCheck}>{i + 1}</div>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Teil 1 — True/False */}
            {teil1Exercises.length > 0 && (
              <div className={styles.teilSection}>
                <div className={styles.teilTitle}>Teil 1 — Richtig oder Falsch (True/False)</div>
                {teil1Desc && (
                  <p className={styles.sectionDesc} style={{ marginBottom: '1rem' }}>{teil1Desc}</p>
                )}
                <div className={styles.exerciseList}>
                  {teil1Exercises.map((item, i) => (
                    <Teil1Item key={item.id ?? i} item={item} idx={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Teil 2 — MCQ */}
            {teil2Exercises.length > 0 && (
              <div className={styles.teilSection}>
                <div className={styles.teilTitle}>Teil 2 — Multiple Choice</div>
                {teil2Desc && (
                  <p className={styles.sectionDesc} style={{ marginBottom: '1rem' }}>{teil2Desc}</p>
                )}
                <div className={styles.exerciseList}>
                  {teil2Exercises.map((item, i) => (
                    <Teil2Item key={item.id ?? i} item={item} idx={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Common Distractor Traps */}
            {distractorTraps.length > 0 && (
              <div className={styles.teilSection}>
                <div className={styles.teilTitle}>Common Distractor Traps</div>
                <div className={styles.trapList}>
                  {distractorTraps.map((trap, i) => (
                    <div key={i} className={styles.trapItem}>
                      <span className={styles.trapIcon}>⚠️</span>
                      {trap}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}
