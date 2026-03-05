/**
 * Clean raw YouTube titles into student-friendly display titles.
 *
 * "Learn German with Kedar Jadhav : B1 : Session 19 : Exam Preparation : Sprechen 3"
 *   → "Sprechen · Teil 3"
 * "B1 - Lesson 14 | Finalsätze | um...zu / damit | Learn German Intermediate"
 *   → "Finalsätze — um...zu / damit"
 */
export function cleanTitle(raw: string): string {
  let t = raw.trim()

  // Pattern A: "Learn German with Kedar Jadhav : B1 : Session X : ..."
  const kedarMatch = t.match(
    /Learn German with Kedar Jadhav\s*:\s*B1\s*:\s*Session\s*\d+\s*:\s*(.+)/i
  )
  if (kedarMatch) {
    t = kedarMatch[1].trim()
    // "Exam Preparation : Sprechen 3" → "Sprechen · Teil 3"
    t = t.replace(/^Exam Preparation\s*:\s*/i, '')
    // Convert trailing numbers to "Teil N" for Sprechen
    t = t.replace(/^(Sprechen)\s+(\d)$/i, '$1 · Teil $2')
    // Clean up "Revision of All Concepts"
    t = t.replace(/^Revision of All Concepts$/i, 'Revision — Alle Konzepte')
    return t
  }

  // Pattern B: "B1 - Lesson N | Topic | ... | Learn German (Intermediate)"
  const lessonMatch = t.match(/B1\s*-\s*Lesson\s*\d+\s*\|\s*(.+)/i)
  if (lessonMatch) {
    t = lessonMatch[1].trim()
    // Remove trailing "| Learn German Intermediate" or "| Learn German"
    t = t.replace(/\|\s*Learn German(?:\s+Intermediate)?\s*$/i, '').trim()
    // Remove duplicate trailing pipes
    t = t.replace(/\|\s*$/, '').trim()
    // Replace first "|" with " — ", keep rest as-is
    const parts = t.split('|').map(s => s.trim()).filter(Boolean)
    if (parts.length >= 2) {
      return parts[0] + ' — ' + parts.slice(1).join(' · ')
    }
    return parts[0] || t
  }

  return t
}

/**
 * Map telc_section + cleaned title to a more descriptive subtitle line
 */
export function sectionLabel(section?: string): string {
  const map: Record<string, string> = {
    Sprachbausteine: 'Sprachbausteine · Grammar & Structure',
    Schreiben: 'Schreiben · Writing',
    Sprechen: 'Sprechen · Speaking',
    Lesen: 'Lesen · Reading',
    Hören: 'Hören · Listening',
    'General B1': 'General B1 · Exam Prep',
  }
  return map[section ?? ''] ?? section ?? ''
}
