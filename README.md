# 🎓 TELC Deutsch B1 — Complete Study Course Builder
### For Claude Code Paid Users — No API Key Needed!

Claude Code IS the AI. It reads your transcripts and generates everything directly.

---

## Quick Start (3 steps)

### Step 1 — Open in VS Code
```
File → Open Folder → select telc-b1-course
```

### Step 2 — Add your 2 playlist URLs
Open `playlists.txt` and paste both YouTube playlist URLs (one per line).

### Step 3 — Run the setup script
Open the VS Code terminal (Ctrl+` / Cmd+`) and run:
```bash
python3 scripts/run_all.py
```
This installs dependencies and pulls all transcripts automatically.

### Step 4 — Hand off to Claude Code
In the Claude Code chat panel, say:

> *"Follow CLAUDE.md — generate course content from src/data/raw_transcripts.json,
> create all 4 practice modules, build the Next.js app, and deploy to Vercel."*

Claude Code will do the rest autonomously. ☕ Grab a coffee.

---

## What Gets Built

| Feature | Details |
|---|---|
| 📹 Video Notes | Study notes + grammar rules for every video |
| 🃏 Flashcards | 8–15 per video, tap-to-flip |
| 🗺 Visual Summaries | Grammar tables + pattern maps |
| ⚡ Exam Tips | Mapped to TELC sections |
| ✍️ Schreiben Module | 8 email prompts + model answers |
| 🗣 Sprechen Module | All 3 parts + full phrase bank |
| 📖 Lesen Module | Complete 3-part reading exercises |
| 🎧 Hören Module | Strategies + listening exercises |
| 📊 Progress Tracker | Mark videos done, track completion |
| 🌐 Hosted on Vercel | Any device, any time |

---

## TELC B1 Coverage

| Section | Points |
|---|---|
| Lesen | 75 pts |
| Hören | 75 pts |
| Sprachbausteine | 30 pts |
| Schreiben | 45 pts |
| Sprechen | 75 pts |
| **Pass = 60% in written AND oral separately** | **300 pts total** |

---

## Project Structure

```
telc-b1-course/
├── playlists.txt              ← ADD YOUR 2 PLAYLIST URLs HERE
├── CLAUDE.md                  ← Agent instructions (don't edit)
├── scripts/
│   ├── extract_transcripts.py ← Pulls transcripts (auto-run)
│   └── run_all.py             ← Master setup script
└── src/data/                  ← Auto-created by Claude Code
    ├── raw_transcripts.json
    ├── course_content.json
    └── practice_modules.json
```

---

Viel Erfolg bei deiner TELC B1 Prüfung! 🇩🇪
