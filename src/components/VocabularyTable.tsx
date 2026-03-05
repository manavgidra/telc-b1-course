import React from 'react'
import styles from './VocabularyTable.module.css'

interface VocabItem {
  de: string
  en: string
  example_de: string
  example_en: string
}

interface VocabularyTableProps {
  vocabulary: VocabItem[]
}

export default function VocabularyTable({ vocabulary }: VocabularyTableProps) {
  if (!vocabulary || vocabulary.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>📚</div>
        <p>No vocabulary available for this video.</p>
      </div>
    )
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>German</th>
            <th className={styles.th}>English</th>
            <th className={styles.th}>Example (DE)</th>
            <th className={styles.th}>Example (EN)</th>
          </tr>
        </thead>
        <tbody>
          {vocabulary.map((item, idx) => (
            <tr key={idx} className={`${styles.tr} ${idx % 2 === 0 ? styles.trEven : styles.trOdd}`}>
              <td className={`${styles.td} ${styles.tdDe}`}>{item.de}</td>
              <td className={`${styles.td} ${styles.tdEn}`}>{item.en}</td>
              <td className={`${styles.td} ${styles.tdExample}`}>{item.example_de}</td>
              <td className={`${styles.td} ${styles.tdExampleEn}`}>{item.example_en}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
