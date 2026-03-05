import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import styles from '@/styles/Practice.module.css'

// ─── Types ────────────────────────────────────────────────────────────────────

interface SchreibenExercise {
  id?: string
  scenario?: string
  prompt?: string
  leitpunkte?: string[]
  model_answer?: string
  word_range?: [number, number]
  connector_hints?: string[]
  evaluation_criteria?: string[]
}

interface SchreibenModule {
  title?: string
  description?: string
  exercises?: SchreibenExercise[]
  // legacy flat shape from some data generators
  prompts?: SchreibenExercise[]
}

interface PracticeModules {
  schreiben?: SchreibenModule
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

// ─── Component ───────────────────────────────────────────────────────────────

function ExerciseCard({ exercise, index }: { exercise: SchreibenExercise; index: number }) {
  const [showAnswer, setShowAnswer] = useState(false)

  const leitpunkte = exercise.leitpunkte ?? []
  const connectors = exercise.connector_hints ?? []
  const criteria = exercise.evaluation_criteria ?? []
  const wordRange = exercise.word_range ?? [100, 120]

  return (
    <div className={styles.exerciseCard}>
      <div className={styles.exerciseCardHeader}>
        <div>
          <div className={styles.exerciseNumber}>Exercise {index + 1}</div>
          <div className={styles.exerciseTitle}>
            {exercise.scenario ?? exercise.prompt ?? `Writing Exercise ${index + 1}`}
          </div>
          {exercise.prompt && exercise.scenario && (
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.3rem' }}>
              {exercise.prompt}
            </p>
          )}
        </div>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            background: '#bee3f8',
            color: '#2b6cb0',
            padding: '0.2rem 0.6rem',
            borderRadius: '20px',
            whiteSpace: 'nowrap',
          }}
        >
          {wordRange[0]}–{wordRange[1]} words
        </span>
      </div>

      <div className={styles.exerciseCardBody}>
        {leitpunkte.length > 0 && (
          <>
            <p className={styles.fieldLabel}>Leitpunkte (address all 4):</p>
            <ul className={styles.leitpunkteList}>
              {leitpunkte.map((lp, i) => (
                <li key={i} className={styles.leitpunkt}>
                  <span className={styles.leitpunktNum}>{i + 1}</span>
                  {lp}
                </li>
              ))}
            </ul>
          </>
        )}

        {connectors.length > 0 && (
          <>
            <p className={styles.fieldLabel} style={{ marginTop: '0.75rem' }}>Connector hints:</p>
            <div className={styles.chipGroup}>
              {connectors.map((c, i) => (
                <span key={i} className={styles.chip}>{c}</span>
              ))}
            </div>
          </>
        )}

        {criteria.length > 0 && (
          <>
            <p className={styles.fieldLabel} style={{ marginTop: '1rem' }}>Evaluation criteria:</p>
            <ul className={styles.criteriaList}>
              {criteria.map((c, i) => (
                <li key={i} className={styles.criteriaItem}>{c}</li>
              ))}
            </ul>
          </>
        )}

        {exercise.model_answer && (
          <>
            <button className={styles.revealBtn} onClick={() => setShowAnswer(s => !s)}>
              {showAnswer ? 'Hide' : 'Show'} Model Answer
            </button>
            {showAnswer && (
              <div className={styles.revealContent}>{exercise.model_answer}</div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function SchreibenPage() {
  const modules = loadModules()
  const schreiben = modules.schreiben ?? {}
  // Support both `exercises` and legacy `prompts` field names
  const exercises: SchreibenExercise[] = schreiben.exercises ?? schreiben.prompts ?? []

  return (
    <Layout title="Schreiben Practice — TELC B1">
      <Head>
        <title>Schreiben Practice — TELC B1 Deutsch</title>
      </Head>

      <div className={styles.pageHero}>
        <div className={styles.pageHeroInner}>
          <Link href="/practice" className={styles.backLink}>
            ← Back to Practice
          </Link>
          <h1 className={styles.pageTitle}>
            ✍️ {schreiben.title ?? 'Schreiben — Writing Practice'}
          </h1>
          <p className={styles.pageSubtitle}>
            {schreiben.description ??
              'Email writing practice — 100–120 words, all 4 Leitpunkte required. (45 points)'}
          </p>
        </div>
      </div>

      <div className={styles.content}>
        {exercises.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>✍️</div>
            <div className={styles.emptyTitle}>No exercises yet</div>
            <p className={styles.emptyText}>
              Schreiben exercises will appear here once course content is generated.
            </p>
          </div>
        ) : (
          <div className={styles.exerciseList}>
            {exercises.map((ex, i) => (
              <ExerciseCard key={ex.id ?? i} exercise={ex} index={i} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
