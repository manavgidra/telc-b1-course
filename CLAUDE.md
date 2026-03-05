# TELC B1 German Course Builder
## Instructions for Claude Code (Paid — No API Key Needed)

You are an autonomous Claude Code agent running inside VS Code.
You ARE the AI — you do not need to call any external API.
Your job: build a complete hosted TELC Deutsch B1 study platform from 2 YouTube playlists.

## WHAT YOU DO

Instead of calling the Anthropic API, YOU directly:
- Read each transcript from src/data/raw_transcripts.json
- Generate all study notes, flashcards, exam tips, practice modules yourself
- Write the output to src/data/course_content.json and src/data/practice_modules.json
- Build and deploy the Next.js web app

## PHASE 1 — Install dependencies
Run in terminal:
```
pip install yt-dlp youtube-transcript-api python-dotenv
npm install
```
No anthropic package needed.

## PHASE 2 — Extract transcripts
Run:
```
python3 scripts/extract_transcripts.py
```
Reads playlists.txt → saves src/data/raw_transcripts.json

## PHASE 3 — Generate course content (YOU do this directly)
Read src/data/raw_transcripts.json.
For EACH video, YOU generate a JSON object with:
- study_notes (summary, key_concept, grammar_rule, word_order_note, common_mistakes)
- vocabulary (de, en, example_de, example_en)
- grammar_patterns (pattern, structure, example_de, example_en, telc_relevance)
- flashcards (minimum 8: front, back, type)
- practice_sentences (5: de, en, hint)
- exam_tips (minimum 3, mapped to TELC sections)
- visual_summary (title, table headers+rows, key_points)
- telc_section (Lesen / Hören / Sprachbausteine / Schreiben / Sprechen / General B1)

Write the entire output to src/data/course_content.json.
Process all videos — do not skip any.
If transcript is in Hindi/mixed language, extract the German being taught.

## PHASE 4 — Generate exam practice modules (YOU do this directly)
Generate src/data/practice_modules.json with 4 modules:

SCHREIBEN: 8 email prompts with 4 Leitpunkte each + model answers + connector hints
SPRECHEN: Teil 1 intro questions + model intro, 5 Teil 2 topics + model responses, 5 Teil 3 planning scenarios + full phrase bank (opinions/agreeing/disagreeing/planning/fillers)
LESEN: Complete 3-part exercise (Teil 1 headlines→texts, Teil 2 MCQ, Teil 3 people→notices) with answer keys
H�REN: Listening strategies + Teil 1 (5 true/false with scripts) + Teil 2 (5 MCQ with audio script) + common distractor traps

## PHASE 5 — Build web app
Run:
```
npm run build
```

## PHASE 6 — Deploy to Vercel
Run:
```
npx vercel --prod
```
Print the live URL when done.

## TELC B1 SYLLABUS REFERENCE

Lesen (75 pts): Global reading (headlines→texts), Detail MCQ, Selective matching (people→ads)
H�ren (75 pts): 1x global listen, 2x detail, 2x selective — focus on keywords not every word
Sprachbausteine (30 pts): Cloze A (3-option MCQ), Cloze B (word bank) — prepositions/conjunctions/verb forms
Schreiben (45 pts): Email reply 100-120 words, ALL 4 Leitpunkte must be addressed
Sprechen (75 pts): Self-intro (~3min) + Topic/Opinion (~6min) + Joint Planning (~6min)
Pass threshold: 60% in BOTH written AND oral separately. Total 300 pts.

Key Grammar B1: Konjunktiv II, Nebensätze (weil/obwohl/damit/dass/wenn), Passiv,
Adjektivendungen, Konnektoren (deshalb/trotzdem/außerdem/zwar-aber/einerseits-andererseits),
nicht nur...sondern auch, entweder...oder, weder...noch

Key Vocabulary Fields: Arbeit, Familie, Gesundheit, Reisen, Wohnen, Umwelt, Technik, Freizeit, Bildung, Gesellschaft

## RULES
- You are the AI — generate content directly, no API calls needed
- Work autonomously end-to-end without stopping
- Show clear progress as you process each video
- Resume gracefully if interrupted — check what's already done before starting
- All explanations in English, all German examples include English translations
- At the end, print the live Vercel URL
