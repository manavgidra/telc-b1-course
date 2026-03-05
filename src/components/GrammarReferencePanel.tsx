import React, { useState, useMemo } from 'react'
import styles from '@/styles/Foundation.module.css'
import grammarData from '@/data/grammar_foundation.json'

interface GrammarReferencePanelProps {
  open: boolean
  onClose: () => void
}

export default function GrammarReferencePanel({ open, onClose }: GrammarReferencePanelProps) {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const filtered = useMemo(() => {
    if (!search.trim()) return grammarData.topics
    const q = search.toLowerCase()
    return grammarData.topics.filter(t => {
      const haystack = [
        t.title, t.shortTitle, t.id,
        t.grammar_table.explanation,
        ...t.grammar_table.table.headers,
        ...t.grammar_table.table.rows.flat(),
        ...t.grammar_table.examples.map(e => e.de + ' ' + e.en),
      ].join(' ').toLowerCase()
      return haystack.includes(q)
    })
  }, [search])

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <>
      <div
        className={`${styles.grammarOverlay} ${open ? styles.grammarOverlayOpen : ''}`}
        onClick={onClose}
      />
      <div className={`${styles.grammarPanel} ${open ? styles.grammarPanelOpen : ''}`}>
        <div className={styles.grammarPanelHeader}>
          <span className={styles.grammarPanelTitle}>📋 Grammar Reference</span>
          <button className={styles.grammarPanelClose} onClick={onClose} aria-label="Close grammar panel">
            ✕
          </button>
        </div>
        <div className={styles.grammarPanelSearch}>
          <input
            type="text"
            placeholder="Search grammar... (e.g. Dativ, weil, Perfekt)"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.grammarPanelBody}>
          {filtered.length === 0 && (
            <div className={styles.grammarPanelNoResult}>
              No topics match &ldquo;{search}&rdquo;
            </div>
          )}
          {filtered.map(t => (
            <div key={t.id} className={styles.grammarPanelTopic}>
              <div
                className={styles.grammarPanelTopicTitle}
                onClick={() => toggleExpand(t.id)}
              >
                <span>{t.icon}</span>
                <span style={{ flex: 1 }}>{t.shortTitle}</span>
                <span style={{ fontSize: '0.72rem', color: '#a0aec0' }}>
                  {expanded[t.id] ? '▼' : '▶'}
                </span>
              </div>
              {expanded[t.id] && (
                <>
                  <table className={styles.grammarPanelMiniTable}>
                    <thead>
                      <tr>
                        {t.grammar_table.table.headers.map((h, i) => (
                          <th key={i}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {t.grammar_table.table.rows.map((row, ri) => (
                        <tr key={ri}>
                          {row.map((cell, ci) => (
                            <td key={ci}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {t.grammar_table.examples.slice(0, 2).map((ex, i) => (
                    <div key={i} style={{ fontSize: '0.78rem', margin: '0.25rem 0', color: '#4a5568' }}>
                      <strong>{ex.de}</strong> — <em>{ex.en}</em>
                    </div>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
