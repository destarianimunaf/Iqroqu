"""Build same-origin vocabulary/prayer speech and human hijaiyah examples.

Install edge-tts==7.2.3 and ffmpeg, then run from any directory.
Existing MP3s are reused. No generation service is called by the application.
"""
import asyncio
import hashlib
import json
from pathlib import Path
import re
import subprocess
import unicodedata
import urllib.request
import wave

import edge_tts

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "audio"
DATASET = "https://dataverse.telkomuniversity.ac.id"
DOI = "doi:10.34820/FK2/XACWLX"
VOICE = "ar-SA-HamedNeural"
RATE = "-12%"
LETTERS = "أبتثجحخدذرزسشصضطظعغفقكلمنوهي"
MARKS = {"َ": ("a", "o"), "ِ": ("i",), "ُ": ("u",), "ً": ("an", "on"), "ٍ": ("in",), "ٌ": ("un",)}


def fetch(url):
    for attempt in range(4):
        try:
            with urllib.request.urlopen(url, timeout=120) as response:
                return response.read()
        except Exception:
            if attempt == 3:
                raise


async def main():
    OUT.mkdir(exist_ok=True)
    # 50 ms of silence primes the persistent player inside a user's tap.
    with wave.open(str(OUT / 'unlock.wav'), 'wb') as silent:
        silent.setnchannels(1)
        silent.setsampwidth(2)
        silent.setframerate(16000)
        silent.writeframes(b'\0' * 1600)
    lessons = (ROOT / "src" / "data" / "lessons.js").read_text()
    vocabulary = re.findall(r'\{ arab: "([^"]+)"', lessons.split("const ARAB_MODULES = [")[1].split("const DOA_MODULES")[0])
    prayers = re.findall(r'\{ arab: "([^"]+)"', lessons.split("const DOA_MODULES = [")[1].split("const APP_DATA")[0])
    iqro = re.findall(r'\{ arab: "([^"]+)"', lessons.split("const IQRO_MODULES = [")[1].split("const SHOLAT_MODULES")[0])
    entries, sources = {}, {}
    # The dataset is CC0; only the isolated syllables actually used are bundled.
    metadata_cache = OUT / ".dataset.json"
    if not metadata_cache.exists():
        metadata_cache.write_bytes(await asyncio.to_thread(fetch, DATASET + "/api/datasets/:persistentId/?persistentId=" + DOI))
    files = json.loads(metadata_cache.read_text())["data"]["latestVersion"]["files"]
    sem = asyncio.Semaphore(8)

    async def native(text):
        index = LETTERS.index(text[0]) + 1
        endings = MARKS[text[1]]
        candidates = [f for f in files if re.fullmatch(str(index) + r'_[a-z]+_1_1.wav', f['label']) and f['label'].split('_')[1].endswith(endings)]
        # Match the whole vowel ending, not 'an' when looking for 'a'.
        candidates = [f for f in candidates if f['label'].split('_')[1].endswith('n') == (text[1] in 'ًٌٍ')]
        if len(candidates) != 1:
            raise ValueError((text, [f['label'] for f in candidates]))
        source = candidates[0]['dataFile']
        name = 'letter-' + str(index).zfill(2) + '-' + hex(ord(text[1]))[2:] + '.mp3'
        target = OUT / name
        async with sem:
            if not target.exists():
                wav = OUT / (name + '.wav')
                wav.write_bytes(await asyncio.to_thread(fetch, DATASET + '/api/access/datafile/' + str(source['id'])))
                if hashlib.md5(wav.read_bytes()).hexdigest() != source['md5']:
                    raise ValueError('Source checksum mismatch: ' + source['filename'])
                subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(wav), '-af', 'silenceremove=start_periods=1:start_threshold=-40dB,areverse,silenceremove=start_periods=1:start_threshold=-40dB,areverse,apad=pad_dur=0.16', '-ac', '1', '-ar', '24000', '-b:a', '64k', str(target)], check=True)
                wav.unlink()
        entries[text] = ["assets/audio/" + name]
        sources[name] = {"type": "human", "source": source['pidURL'], "original": source['filename'], "license": "CC0-1.0"}
        print('Human', text, flush=True)

    async def neural(text, collection='vocabulary'):
        prefix = 'prayer-' if collection == 'prayers' else 'word-'
        name = prefix + hashlib.sha256((VOICE + RATE + text).encode()).hexdigest()[:16] + '.mp3'
        target = OUT / name
        async with sem:
            if not target.exists():
                for attempt in range(3):
                    try:
                        await edge_tts.Communicate(text, VOICE, rate=RATE).save(str(target))
                        break
                    except Exception:
                        target.unlink(missing_ok=True)
                        if attempt == 2:
                            raise
        entries[text] = ["assets/audio/" + name]
        sources[name] = {"type": "synthetic", "voice": VOICE, "text": text, "rate": RATE}
        if collection == 'prayers':
            sources[name]['collection'] = collection
        print(collection.title(), text, flush=True)

    singles = sorted({word for text in iqro for word in text.split() if len(word) == 2 and word[0] in LETTERS and word[1] in MARKS})
    await asyncio.gather(*(native(text) for text in singles), *(neural(text) for text in dict.fromkeys(vocabulary)), *(neural(text, 'prayers') for text in dict.fromkeys(prayers)))
    for text in iqro:
        words = text.split()
        if words and all(word in entries for word in words):
            entries[text] = [clip for word in words for clip in entries[word]]
    manifest = {"voice": VOICE, "entries": dict(sorted((unicodedata.normalize('NFC', text), clips) for text, clips in entries.items())), "sources": dict(sorted(sources.items()))}
    (OUT / "manifest.js").write_text("// Generated by scripts/generate_arabic_audio.py\nwindow.IQRO_AUDIO = " + json.dumps(manifest, ensure_ascii=False, indent=2) + ";\n")
    print(len(entries), 'playable examples;', len(sources), 'MP3s')


if __name__ == '__main__':
    asyncio.run(main())
