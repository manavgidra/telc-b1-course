#!/usr/bin/env python3
"""
Incremental course content generator.
Usage: python3 scripts/generate_batch.py <batch_json_file>
  - Reads existing course_content.json
  - Merges in new videos from the batch file
  - Writes back to course_content.json
"""
import json, sys, os

CONTENT_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'course_content.json')

def load_existing():
    try:
        with open(CONTENT_PATH) as f:
            data = json.load(f)
            return data.get('videos', [])
    except:
        return []

def save(videos):
    with open(CONTENT_PATH, 'w', encoding='utf-8') as f:
        json.dump({"videos": videos}, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(videos)} total videos to course_content.json")

def merge_batch(existing, new_videos):
    existing_ids = {v['video_id'] for v in existing}
    added = 0
    for v in new_videos:
        if v['video_id'] not in existing_ids:
            existing.append(v)
            existing_ids.add(v['video_id'])
            added += 1
        else:
            # Update existing
            for i, ev in enumerate(existing):
                if ev['video_id'] == v['video_id']:
                    existing[i] = v
                    break
    print(f"Added {added} new, updated {len(new_videos) - added} existing")
    return existing

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/generate_batch.py <batch_json_file>")
        sys.exit(1)
    
    batch_file = sys.argv[1]
    with open(batch_file, encoding='utf-8') as f:
        new_videos = json.load(f)
    
    existing = load_existing()
    merged = merge_batch(existing, new_videos)
    save(merged)
