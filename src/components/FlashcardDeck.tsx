import React, { useState, useCallback } from 'react'
import styles from './FlashcardDeck.module.css'

interface Flashcard {
  front: string
  back: string
  type: 'vocabulary' | 'grammar' | 'phrase' | string
}

interface FlashcardDeckProps {
  flashcards: Flashcard[]
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const typeColors: Record<string, string> = {
  vocabulary: styles.typeVocabulary,
  grammar: styles.typeGrammar,
  phrase: styles.typePhrase,
}

export default function FlashcardDeck({ flashcards }: FlashcardDeckProps) {
  const [cards, setCards] = useState<Flashcard[]>(flashcards)
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const current = cards[index]

  const handleFlip = () => setFlipped(f => !f)

  const handlePrev = useCallback(() => {
    setFlipped(false)
    setIndex(i => (i - 1 + cards.length) % cards.length)
  }, [cards.length])

  const handleNext = useCallback(() => {
    setFlipped(false)
    setIndex(i => (i + 1) % cards.length)
  }, [cards.length])

  const handleShuffle = () => {
    setCards(shuffleArray(flashcards))
    setIndex(0)
    setFlipped(false)
  }

  if (!cards.length) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🃏</div>
        <p>No flashcards available for this video.</p>
      </div>
    )
  }

  const typeClass = typeColors[current.type] ?? styles.typePhrase

  return (
    <div className={styles.deck}>
      <div className={styles.header}>
        <span className={styles.progress}>
          Card {index + 1} of {cards.length}
        </span>
        <div className={styles.typeBadges}>
          <span className={`${styles.typeBadge} ${typeClass}`}>
            {current.type}
          </span>
        </div>
        <button className={styles.shuffleBtn} onClick={handleShuffle} title="Shuffle cards">
          ⇄ Shuffle
        </button>
      </div>

      <div
        className={`${styles.cardScene} ${flipped ? styles.cardSceneFlipped : ''}`}
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        aria-label={flipped ? 'Show front of card' : 'Show back of card'}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleFlip() }}
      >
        <div className={styles.card}>
          <div className={styles.cardFront}>
            <div className={styles.cardLabel}>Front</div>
            <div className={styles.cardText}>{current.front}</div>
            <div className={styles.tapHint}>Tap to reveal</div>
          </div>
          <div className={styles.cardBack}>
            <div className={styles.cardLabel}>Back</div>
            <div className={styles.cardText}>{current.back}</div>
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <button className={styles.navBtn} onClick={handlePrev} disabled={cards.length <= 1}>
          ← Prev
        </button>
        <div className={styles.dots}>
          {cards.slice(0, Math.min(cards.length, 10)).map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
              onClick={() => { setIndex(i); setFlipped(false) }}
              aria-label={`Go to card ${i + 1}`}
            />
          ))}
          {cards.length > 10 && <span className={styles.dotEllipsis}>…</span>}
        </div>
        <button className={styles.navBtn} onClick={handleNext} disabled={cards.length <= 1}>
          Next →
        </button>
      </div>
    </div>
  )
}
