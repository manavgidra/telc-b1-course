import React from 'react'
import styles from './ExamTips.module.css'

interface ExamTip {
  tip: string
  telc_section: string
}

interface ExamTipsProps {
  tips: ExamTip[]
}

const sectionBadgeClass: Record<string, string> = {
  Lesen: styles.badgeLesen,
  Hören: styles.badgeHoren,
  Sprachbausteine: styles.badgeSprachbausteine,
  Schreiben: styles.badgeSchreiben,
  Sprechen: styles.badgeSprechen,
  'General B1': styles.badgeGeneral,
}

export default function ExamTips({ tips }: ExamTipsProps) {
  if (!tips || tips.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>💡</div>
        <p>No exam tips available for this video.</p>
      </div>
    )
  }

  return (
    <div className={styles.list}>
      {tips.map((item, idx) => {
        const badgeClass = sectionBadgeClass[item.telc_section] ?? styles.badgeGeneral
        return (
          <div key={idx} className={styles.card}>
            <div className={styles.iconArea}>
              <span className={styles.icon}>💡</span>
            </div>
            <div className={styles.body}>
              {item.telc_section && (
                <span className={`${styles.badge} ${badgeClass}`}>
                  {item.telc_section}
                </span>
              )}
              <p className={styles.tipText}>{item.tip}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
