import React, { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import FlashcardDeck from '@/components/FlashcardDeck'
import styles from '@/styles/Foundation.module.css'
import grammarData from '@/data/grammar_foundation.json'

type Topic = (typeof grammarData.topics)[number]

const TABS = [
  { key: 'grammar', label: '📋 Grammar Table' },
  { key: 'progression', label: '🔄 A2 → B1' },
  { key: 'exercises', label: '✏️ Exercises' },
  { key: 'flashcards', label: '🃏 Flashcards' },
] as const

type TabKey = (typeof TABS)[number]['key']

function getFoundationProgress(): Record<string, boolean> {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem('telc-foundation') || '{}') } catch { return {} }
}

function setFoundationProgress(id: string, val: boolean) {
  const p = getFoundationProgress()
  p[id] = val
  localStorage.setItem('telc-foundation', JSON.stringify(p))
}

export default function FoundationTopic() {
  const router = useRouter()
  const { topic: slug } = router.query
  const [tab, setTab] = useState<TabKey>('grammar')
  const [progress, setProgress] = useState<Record<string, boolean>>({})

  useEffect(() => { setProgress(getFoundationProgress()) }, [])

  const topic = grammarData.topics.find(t => t.id === slug) as Topic | undefined
  if (!topic) {
    return (
      <Layout title="Topic Not Found">
        <div style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
          <h2>Topic not found</h2>
          <Link href="/foundation">← Back to Foundation</Link>
        </div>
      </Layout>
    )
  }

  const idx = grammarData.topics.findIndex(t => t.id === slug)
  const prev = idx > 0 ? grammarData.topics[idx - 1] : null
  const next = idx < grammarData.topics.length - 1 ? grammarData.topics[idx + 1] : null

  const handleMarkDone = () => {
    const newVal = !progress[topic.id]
    setFoundationProgress(topic.id, newVal)
    setProgress({ ...progress, [topic.id]: newVal })
  }

  return (
    <Layout title={`${topic.shortTitle} — Foundation`}>
      <Head>
        <title>{topic.shortTitle} — A2 Foundation — TELC B1 Deutsch</title>
      </Head>

      {/* Hero */}
      <div className={styles.topicHero}>
        <div className={styles.topicHeroInner}>
          <div className={styles.breadcrumb}>
            <Link href="/">Home</Link> <span>/</span>
            <Link href="/foundation">Foundation</Link> <span>/</span>
            <span style={{ color: '#fff' }}>{topic.shortTitle}</span>
          </div>
          <h1 className={styles.topicHeroTitle}>
            <span>{topic.icon}</span> {topic.title}
          </h1>
          {topic.grammar_table.formula && (
            <div className={styles.topicFormula}>{topic.grammar_table.formula}</div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {TABS.map(t => (
          <button
            key={t.key}
            className={`${styles.tab} ${tab === t.key ? styles.tabActive : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'grammar' && <GrammarTab topic={topic} />}
      {tab === 'progression' && <ProgressionTab topic={topic} />}
      {tab === 'exercises' && (
        <ExercisesTab
          topic={topic}
          done={!!progress[topic.id]}
          onMarkDone={handleMarkDone}
        />
      )}
      {tab === 'flashcards' && <FlashcardsTab topic={topic} />}

      {/* Navigation */}
      <div className={styles.topicNav}>
        {prev ? (
          <Link href={`/foundation/${prev.id}`} className={styles.topicNavLink}>
            ← {prev.icon} {prev.shortTitle}
          </Link>
        ) : <div className={styles.topicNavPlaceholder} />}
        {next ? (
          <Link href={`/foundation/${next.id}`} className={styles.topicNavLink}>
            {next.icon} {next.shortTitle} →
          </Link>
        ) : <div className={styles.topicNavPlaceholder} />}
      </div>
    </Layout>
  )
}

/* ── Grammar Table Tab ── */
function GrammarTab({ topic }: { topic: Topic }) {
  const g = topic.grammar_table
  return (
    <div className={styles.grammarSection}>
      <div className={styles.explanation}>{g.explanation}</div>

      <table className={styles.grammarTable}>
        <thead>
          <tr>{g.table.headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {g.table.rows.map((row, ri) => (
            <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>Examples</h3>
      <div className={styles.examplesGrid}>
        {g.examples.map((ex, i) => (
          <div key={i} className={styles.exampleCard}>
            <div className={styles.exDe}>{ex.de}</div>
            <div className={styles.exEn}>{ex.en}</div>
          </div>
        ))}
      </div>

      <div className={styles.mistakesBox}>
        <div className={styles.mistakesTitle}>⚠️ Common Mistakes</div>
        <ul className={styles.mistakesList}>
          {g.common_mistakes.map((m, i) => <li key={i}>{m}</li>)}
        </ul>
      </div>
    </div>
  )
}

/* ── Progression Tab ── */
function ProgressionTab({ topic }: { topic: Topic }) {
  const p = topic.progression
  return (
    <div className={styles.progressionSection}>
      <div className={styles.progressionCard}>
        <div className={`${styles.progressionLevel} ${styles.progressionLevelA2}`}>
          <span className={`${styles.progressionBadge} ${styles.badgeA2}`}>A2 Level</span>
          <div className={styles.progressionDe}>{p.a2_example.de}</div>
          <div className={styles.progressionEn}>{p.a2_example.en}</div>
        </div>
        <div className={styles.progressionArrow}>⬇️</div>
        <div className={`${styles.progressionLevel} ${styles.progressionLevelB1}`}>
          <span className={`${styles.progressionBadge} ${styles.badgeB1}`}>B1 Level</span>
          <div className={styles.progressionDe}>{p.b1_upgrade.de}</div>
          <div className={styles.progressionEn}>{p.b1_upgrade.en}</div>
        </div>
        <div className={styles.progressionExplain}>
          <div className={styles.progressionExplainTitle}>What changed?</div>
          <div className={styles.progressionExplainText}>{p.what_changed}</div>
          <div className={styles.telcTag}>TELC Section: {p.telc_section}</div>
        </div>
      </div>
    </div>
  )
}

/* ── Exercises Tab ── */
type ExerciseState = {
  userAnswer: string
  submitted: boolean
  correct: boolean
}

function ExercisesTab({ topic, done, onMarkDone }: { topic: Topic; done: boolean; onMarkDone: () => void }) {
  const [states, setStates] = useState<ExerciseState[]>(
    topic.exercises.map(() => ({ userAnswer: '', submitted: false, correct: false }))
  )

  const allSubmitted = states.every(s => s.submitted)
  const correctCount = states.filter(s => s.correct).length

  const updateState = (idx: number, patch: Partial<ExerciseState>) => {
    setStates(prev => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)))
  }

  const handleSubmit = (idx: number) => {
    const ex = topic.exercises[idx]
    const user = states[idx].userAnswer.trim()
    const answer = ex.answer.trim()
    // Handle double-blank answers like "stehe ... auf"
    const isCorrect = user.toLowerCase() === answer.toLowerCase() ||
      user.toLowerCase().replace(/\s+/g, ' ') === answer.toLowerCase().replace(/\s+/g, ' ')
    updateState(idx, { submitted: true, correct: isCorrect })
  }

  const handleReset = () => {
    setStates(topic.exercises.map(() => ({ userAnswer: '', submitted: false, correct: false })))
  }

  return (
    <div className={styles.exercisesSection}>
      {topic.exercises.map((ex, idx) => {
        const st = states[idx]
        return (
          <div
            key={idx}
            className={`${styles.exerciseCard} ${
              st.submitted ? (st.correct ? styles.exerciseCardCorrect : styles.exerciseCardWrong) : ''
            }`}
          >
            <div className={styles.exerciseHeader}>
              <span className={styles.exerciseNumber}>#{idx + 1} — {ex.type === 'fill' ? 'Fill in' : ex.type === 'choose' ? 'Choose' : 'Fix'}</span>
              <span className={`${styles.exerciseDifficulty} ${ex.difficulty === 'A2' ? styles.diffA2 : styles.diffB1}`}>
                {ex.difficulty}
              </span>
            </div>
            <div className={styles.exercisePrompt}>{ex.prompt}</div>

            {(ex.type === 'fill' || ex.type === 'fix') && (
              <div className={styles.fillInput}>
                <input
                  type="text"
                  value={st.userAnswer}
                  onChange={e => updateState(idx, { userAnswer: e.target.value })}
                  disabled={st.submitted}
                  placeholder="Type your answer..."
                  onKeyDown={e => { if (e.key === 'Enter' && st.userAnswer.trim()) handleSubmit(idx) }}
                />
                {!st.submitted && (
                  <button
                    className={styles.submitBtn}
                    onClick={() => handleSubmit(idx)}
                    disabled={!st.userAnswer.trim()}
                  >
                    Check
                  </button>
                )}
              </div>
            )}

            {ex.type === 'choose' && 'options' in ex && (
              <>
                <div className={styles.optionsList}>
                  {(ex.options as string[]).map((opt, oi) => {
                    const selected = st.userAnswer === opt
                    const isAnswer = opt === ex.answer
                    let optClass = styles.optionBtn
                    let dotClass = styles.optionDot
                    if (st.submitted) {
                      if (isAnswer) { optClass += ' ' + styles.optionCorrect; dotClass += ' ' + styles.optionDotCorrect }
                      else if (selected && !isAnswer) { optClass += ' ' + styles.optionWrong; dotClass += ' ' + styles.optionDotWrong }
                    } else if (selected) {
                      optClass += ' ' + styles.optionSelected
                      dotClass += ' ' + styles.optionDotSelected
                    }
                    return (
                      <button
                        key={oi}
                        className={optClass}
                        onClick={() => !st.submitted && updateState(idx, { userAnswer: opt })}
                        disabled={st.submitted}
                      >
                        <span className={dotClass}>{st.submitted ? (isAnswer ? '✓' : selected ? '✗' : '') : ''}</span>
                        {opt}
                      </button>
                    )
                  })}
                </div>
                {!st.submitted && (
                  <button
                    className={styles.submitBtn}
                    onClick={() => handleSubmit(idx)}
                    disabled={!st.userAnswer}
                  >
                    Check
                  </button>
                )}
              </>
            )}

            {st.submitted && (
              <div className={`${styles.exerciseExplanation} ${st.correct ? styles.explanationCorrect : styles.explanationWrong}`}>
                <span className={styles.explanationAnswer}>
                  {st.correct ? '✅ Correct!' : `❌ Correct answer: ${ex.answer}`}
                </span>
                {ex.explanation}
              </div>
            )}
          </div>
        )
      })}

      {allSubmitted && (
        <div className={styles.scoreSummary}>
          <div className={styles.scoreNumber}>{correctCount} / {topic.exercises.length}</div>
          <div className={styles.scoreLabel}>
            {correctCount === topic.exercises.length ? '🎉 Perfect score!' : correctCount >= topic.exercises.length * 0.6 ? '👍 Good job!' : '📚 Keep practicing!'}
          </div>
          <div className={styles.scoreActions}>
            <button className={styles.resetBtn} onClick={handleReset}>🔄 Try Again</button>
            <button className={styles.markDoneBtn} onClick={onMarkDone}>
              {done ? '↩️ Unmark' : '✅ Mark Complete'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Flashcards Tab ── */
function FlashcardsTab({ topic }: { topic: Topic }) {
  const cards = topic.flashcards.map(f => ({
    front: f.front,
    back: f.back,
    type: 'grammar' as const,
  }))
  return (
    <div className={styles.flashcardSection}>
      <FlashcardDeck flashcards={cards} />
    </div>
  )
}
