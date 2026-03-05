import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import styles from '@/styles/Practice.module.css'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Teil2Topic {
  title?: string
  prompt?: string
  duration_seconds?: number
  model_response?: string
  key_phrases_to_use?: string[]
}

interface Teil3Scenario {
  situation?: string
  task?: string
  model_response?: string
}

interface PhraseBank {
  opinions?: string[]
  agreeing?: string[]
  disagreeing?: string[]
  planning?: string[]
  suggestions?: string[]
  fillers?: string[]
}

interface SprechenTeil1 {
  description?: string
  intro_questions?: string[]
  model_intro?: string
}

interface SprechenTeil2 {
  description?: string
  topics?: Teil2Topic[]
}

interface SprechenTeil3 {
  description?: string
  planning_scenarios?: Teil3Scenario[]
  phrase_bank?: PhraseBank
}

interface SprechenModule {
  title?: string
  description?: string
  teil_1?: SprechenTeil1
  teil_2?: SprechenTeil2
  teil_3?: SprechenTeil3
  // Legacy fields from some data generators
  teil1_questions?: string[]
  teil1_model_intro?: string
  teil2_topics?: Teil2Topic[]
  teil3_scenarios?: Teil3Scenario[]
  phrase_bank?: PhraseBank
}

interface PracticeModules {
  sprechen?: SprechenModule
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

// ─── Subcomponents ───────────────────────────────────────────────────────────

function RevealBlock({ label, content }: { label: string; content: string }) {
  const [open, setOpen] = useState(false)
  if (!content) return null
  return (
    <>
      <button className={styles.revealBtn} onClick={() => setOpen(o => !o)}>
        {open ? 'Hide' : 'Show'} {label}
      </button>
      {open && <div className={styles.revealContent}>{content}</div>}
    </>
  )
}

function PhraseBankSection({ bank }: { bank?: PhraseBank }) {
  if (!bank) return null
  const categories: Array<{ key: keyof PhraseBank; label: string }> = [
    { key: 'opinions', label: 'Opinions / Meinungen' },
    { key: 'agreeing', label: 'Agreeing / Zustimmen' },
    { key: 'disagreeing', label: 'Disagreeing / Widersprechen' },
    { key: 'planning', label: 'Planning / Planen' },
    { key: 'suggestions', label: 'Suggestions / Vorschläge' },
    { key: 'fillers', label: 'Fillers / Füllwörter' },
  ]
  const populated = categories.filter(c => (bank[c.key] ?? []).length > 0)
  if (populated.length === 0) return null

  return (
    <div>
      <p className={styles.fieldLabel} style={{ marginBottom: '0.75rem' }}>Phrase Bank:</p>
      <div className={styles.phraseBank}>
        {populated.map(({ key, label }) => (
          <div key={key} className={styles.phraseBankCard}>
            <div className={styles.phraseBankTitle}>{label}</div>
            <ul className={styles.phraseList}>
              {(bank[key] as string[]).map((phrase, i) => (
                <li key={i} className={styles.phraseItem}>{phrase}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SprechenPage() {
  const modules = loadModules()
  const sp = modules.sprechen ?? {}

  // Normalise — support both nested (teil_1) and legacy flat (teil1_questions) shapes
  const teil1Questions: string[] = sp.teil_1?.intro_questions ?? sp.teil1_questions ?? []
  const teil1ModelIntro: string = sp.teil_1?.model_intro ?? sp.teil1_model_intro ?? ''
  const teil1Desc: string = sp.teil_1?.description ?? ''

  const teil2Topics: Teil2Topic[] = sp.teil_2?.topics ?? sp.teil2_topics ?? []
  const teil2Desc: string = sp.teil_2?.description ?? ''

  const teil3Scenarios: Teil3Scenario[] = sp.teil_3?.planning_scenarios ?? sp.teil3_scenarios ?? []
  const teil3Desc: string = sp.teil_3?.description ?? ''
  const phraseBank: PhraseBank = sp.teil_3?.phrase_bank ?? sp.phrase_bank ?? {}

  const isEmpty =
    teil1Questions.length === 0 &&
    teil2Topics.length === 0 &&
    teil3Scenarios.length === 0

  return (
    <Layout title="Sprechen Practice — TELC B1">
      <Head>
        <title>Sprechen Practice — TELC B1 Deutsch</title>
      </Head>

      <div className={styles.pageHero}>
        <div className={styles.pageHeroInner}>
          <Link href="/practice" className={styles.backLink}>
            ← Back to Practice
          </Link>
          <h1 className={styles.pageTitle}>
            🗣️ {sp.title ?? 'Sprechen — Speaking Practice'}
          </h1>
          <p className={styles.pageSubtitle}>
            {sp.description ??
              'Three-part speaking exam: self-intro, topic discussion, and joint planning. (75 points)'}
          </p>
        </div>
      </div>

      <div className={styles.content}>
        {isEmpty ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🗣️</div>
            <div className={styles.emptyTitle}>No exercises yet</div>
            <p className={styles.emptyText}>
              Sprechen exercises will appear here once course content is generated.
            </p>
          </div>
        ) : (
          <>
            {/* Teil 1 */}
            <div className={styles.teilSection}>
              <div className={styles.teilTitle}>Teil 1 — Vorstellung (~3 min)</div>
              {teil1Desc && <p className={styles.sectionDesc} style={{ marginBottom: '1rem' }}>{teil1Desc}</p>}
              {teil1Questions.length > 0 && (
                <>
                  <p className={styles.fieldLabel}>Intro questions:</p>
                  <div className={styles.questionList}>
                    {teil1Questions.map((q, i) => (
                      <div key={i} className={styles.questionItem}>{q}</div>
                    ))}
                  </div>
                </>
              )}
              {teil1ModelIntro && (
                <RevealBlock label="Model Introduction" content={teil1ModelIntro} />
              )}
            </div>

            {/* Teil 2 */}
            {teil2Topics.length > 0 && (
              <div className={styles.teilSection}>
                <div className={styles.teilTitle}>Teil 2 — Thema &amp; Meinung (~6 min)</div>
                {teil2Desc && <p className={styles.sectionDesc} style={{ marginBottom: '1rem' }}>{teil2Desc}</p>}
                <div className={styles.exerciseList}>
                  {teil2Topics.map((topic, i) => (
                    <div key={i} className={styles.exerciseCard}>
                      <div className={styles.exerciseCardHeader}>
                        <div>
                          <div className={styles.exerciseNumber}>Topic {i + 1}</div>
                          <div className={styles.exerciseTitle}>{topic.title ?? `Topic ${i + 1}`}</div>
                        </div>
                        {topic.duration_seconds && (
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              background: '#c6f6d5',
                              color: '#276749',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '20px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            ~{Math.round(topic.duration_seconds / 60)} min
                          </span>
                        )}
                      </div>
                      <div className={styles.exerciseCardBody}>
                        {topic.prompt && (
                          <p style={{ fontSize: '0.9rem', marginBottom: '0.85rem' }}>{topic.prompt}</p>
                        )}
                        {topic.key_phrases_to_use && topic.key_phrases_to_use.length > 0 && (
                          <>
                            <p className={styles.fieldLabel}>Key phrases to use:</p>
                            <div className={styles.chipGroup}>
                              {topic.key_phrases_to_use.map((ph, pi) => (
                                <span key={pi} className={styles.chip}>{ph}</span>
                              ))}
                            </div>
                          </>
                        )}
                        {topic.model_response && (
                          <RevealBlock label="Model Response" content={topic.model_response} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Teil 3 */}
            {(teil3Scenarios.length > 0 || Object.values(phraseBank).some(a => (a as string[]).length > 0)) && (
              <div className={styles.teilSection}>
                <div className={styles.teilTitle}>Teil 3 — Gemeinsam planen (~6 min)</div>
                {teil3Desc && <p className={styles.sectionDesc} style={{ marginBottom: '1rem' }}>{teil3Desc}</p>}
                {teil3Scenarios.length > 0 && (
                  <div className={styles.exerciseList} style={{ marginBottom: '1.5rem' }}>
                    {teil3Scenarios.map((sc, i) => (
                      <div key={i} className={styles.exerciseCard}>
                        <div className={styles.exerciseCardHeader}>
                          <div>
                            <div className={styles.exerciseNumber}>Scenario {i + 1}</div>
                            <div className={styles.exerciseTitle}>{sc.situation ?? `Planning Scenario ${i + 1}`}</div>
                          </div>
                        </div>
                        <div className={styles.exerciseCardBody}>
                          {sc.task && (
                            <p style={{ fontSize: '0.9rem', marginBottom: '0.85rem' }}>{sc.task}</p>
                          )}
                          {sc.model_response && (
                            <RevealBlock label="Model Response" content={sc.model_response} />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <PhraseBankSection bank={phraseBank} />
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}
