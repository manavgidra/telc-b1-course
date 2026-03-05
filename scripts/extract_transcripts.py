#!/usr/bin/env python3
"""
Phase 2: Extract transcripts from both YouTube playlists.
No API key needed — just yt-dlp and youtube-transcript-api.
"""

import json
import os
import sys
import time
import subprocess
from pathlib import Path

try:
    from youtube_transcript_api import YouTubeTranscriptApi
    import yt_dlp
except ImportError:
    print("Installing dependencies...")
    subprocess.run([sys.executable, "-m", "pip", "install", "youtube-transcript-api", "yt-dlp"], check=True)
    from youtube_transcript_api import YouTubeTranscriptApi
    import yt_dlp


def get_playlist_videos(playlist_url: str) -> list:
    print(f"\n📋 Fetching playlist: {playlist_url}")
    ydl_opts = {'quiet': True, 'extract_flat': True, 'playlist_end': 60}
    videos = []
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(playlist_url, download=False)
        if 'entries' in info:
            for entry in info['entries']:
                if entry:
                    videos.append({
                        'id': entry.get('id'),
                        'title': entry.get('title', 'Unknown'),
                        'url': f"https://www.youtube.com/watch?v={entry.get('id')}",
                        'duration': entry.get('duration'),
                        'playlist_url': playlist_url,
                    })
    print(f"   ✅ Found {len(videos)} videos")
    return videos


def get_transcript(video_id: str, title: str) -> dict:
    result = {
        'video_id': video_id, 'title': title,
        'transcript': None, 'language': None,
        'transcript_text': None, 'error': None
    }
    lang_priority = ['de', 'en', 'hi', 'mr']
    try:
        # youtube-transcript-api v1.x uses instantiation
        api = YouTubeTranscriptApi()
        transcript_list = api.list(video_id)
        for lang in lang_priority:
            try:
                transcript = transcript_list.find_transcript([lang])
                fetched = transcript.fetch()
                entries = [{'text': s.text, 'start': s.start, 'duration': s.duration} for s in fetched]
                full_text = ' '.join([s.text for s in fetched])
                result.update({'transcript': entries, 'transcript_text': full_text, 'language': lang})
                print(f"   ✅ [{lang}] {title[:55]}")
                return result
            except Exception:
                continue
        try:
            transcript = transcript_list.find_generated_transcript(lang_priority)
            fetched = transcript.fetch()
            entries = [{'text': s.text, 'start': s.start, 'duration': s.duration} for s in fetched]
            full_text = ' '.join([s.text for s in fetched])
            result.update({'transcript': entries, 'transcript_text': full_text,
                          'language': transcript.language_code, 'auto_generated': True})
            print(f"   ✅ [auto] {title[:55]}")
            return result
        except Exception:
            pass
    except Exception as e:
        err_str = str(e)
        if 'disabled' in err_str.lower():
            result['error'] = 'transcripts_disabled'
            print(f"   ⚠️  [disabled] {title[:55]}")
        elif 'no transcript' in err_str.lower():
            result['error'] = 'no_transcript'
            print(f"   ⚠️  [not found] {title[:55]}")
        else:
            result['error'] = err_str
            print(f"   ❌ [error] {title[:55]}: {e}")
    return result


def main():
    playlists_file = Path('playlists.txt')
    if not playlists_file.exists():
        print("❌ playlists.txt not found!")
        sys.exit(1)

    playlist_urls = [l.strip() for l in playlists_file.read_text().splitlines()
                     if l.strip() and not l.startswith('#')]

    print(f"🎬 Processing {len(playlist_urls)} playlist(s)...")
    all_videos = []
    for url in playlist_urls:
        all_videos.extend(get_playlist_videos(url))

    # Deduplicate
    seen, unique = set(), []
    for v in all_videos:
        if v['id'] not in seen:
            seen.add(v['id'])
            unique.append(v)

    print(f"\n📹 {len(unique)} unique videos found. Fetching transcripts...\n")

    results = []
    for i, video in enumerate(unique, 1):
        print(f"[{i}/{len(unique)}] ", end='')
        data = get_transcript(video['id'], video['title'])
        data.update({'playlist_url': video['playlist_url'], 'url': video['url'],
                     'duration': video.get('duration'), 'video_index': i})
        results.append(data)
        time.sleep(0.5)

    output_dir = Path('src/data')
    output_dir.mkdir(parents=True, exist_ok=True)
    output_file = output_dir / 'raw_transcripts.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump({'total_videos': len(results), 'playlists': playlist_urls, 'videos': results},
                  f, ensure_ascii=False, indent=2)

    ok = sum(1 for r in results if r['transcript_text'])
    print(f"\n✅ {ok}/{len(results)} transcripts saved to {output_file}")
    if ok < len(results):
        print(f"⚠️  {len(results)-ok} videos had no transcript (Claude Code will skip these)")

if __name__ == '__main__':
    main()
