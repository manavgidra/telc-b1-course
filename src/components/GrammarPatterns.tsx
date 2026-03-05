import React from 'react'
import styles from './GrammarPatterns.module.css'

interface GrammarPattern {
  pattern: string
  structure: string
  example_de: string
  example_en: string
  telc_relevance: string
}

interface GrammarPatternsProps {
  patterns: GrammarPattern[]
}

export default function GrammarPatterns({ patterns }: GrammarPatternsProps) {
  if (!patterns || patterns.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>📐</div>
        <p>No grammar patterns available for this video.</p>
      </div>
    )
  }

  return (
    <div className={styles.list}>
      {patterns.map((item, idx) => (
        <div key={idx} className={styles.card}>
          <div className={styles.cardHeader}>
            <h4 className={styles.patternName}>{item.pattern}</h4>
            {item.telc_relevance && (
              <span className={styles.relevanceBadge}>{item.telc_relevance}</span>
            )}
          </div>
          {item.structure && (
            <div className={styles.structure}>
              <span className={styles.fieldLabel}>Structure:</span>
              <code className={styles.structureCode}>{item.structure}</code>
            </div>
          )}
          {item.example_de && (
            <div className={styles.example}>
              <span className={styles.fieldLabel}>Example:</span>
              <p className={styles.exampleDe}>{item.example_de}</p>
              {item.example_en && (
                <p className={styles.exampleEn}>{item.example_en}</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
