#!/usr/bin/env python3
"""
TELC B1 Course Builder — Master Runner
For Claude Code paid users: no API key needed.
Claude Code itself generates all content directly.

Run this script, then hand control to Claude Code for phases 3 & 4.
"""

import subprocess
import sys
from pathlib import Path


def run(cmd: str, label: str):
    print(f"\n{'='*60}\n  {label}\n{'='*60}")
    result = subprocess.run(cmd, shell=True)
    if result.returncode != 0:
        print(f"\n❌ Failed at: {label}")
        print("   Fix the issue above, then re-run.")
        sys.exit(1)


def check_playlists():
    p = Path('playlists.txt')
    if not p.exists():
        print("❌ playlists.txt not found!")
        sys.exit(1)
    urls = [l.strip() for l in p.read_text().splitlines()
            if l.strip() and not l.startswith('#')]
    if len(urls) < 2:
        print(f"⚠️  Only {len(urls)} playlist URL(s) found — add your second playlist to playlists.txt")
    else:
        print(f"✅ {len(urls)} playlists ready")
    for u in urls:
        print(f"   → {u}")


def main():
    print("\n🎓 TELC B1 Course Builder")
    print("   Claude Code Paid — No API key needed\n")

    check_playlists()

    # Phase 1
    run("pip install -q yt-dlp youtube-transcript-api python-dotenv && npm install",
        "📦 PHASE 1: Installing dependencies")

    # Phase 2
    run("python3 scripts/extract_transcripts.py",
        "🎬 PHASE 2: Extracting transcripts from playlists")

    print("\n" + "="*60)
    print("  ✅ Transcripts extracted!")
    print("="*60)
    print("""
  NEXT STEPS for Claude Code:

  Claude Code will now handle Phases 3–6 directly.
  In the Claude Code chat, say:

  "Follow CLAUDE.md — generate course content from
   src/data/raw_transcripts.json, create all 4 practice
   modules, build the Next.js app, and deploy to Vercel."

  Claude Code will do the rest autonomously.
""")


if __name__ == '__main__':
    main()
