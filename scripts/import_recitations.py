"""Import unedited human recitations from documented public APIs.

Run with Python 3 (standard library only). No API request is made at runtime.
Only whole recitations matching a lesson are imported: never splice words or
substitute a different dua. Source spelling and provenance stay in the manifest.
"""
from concurrent.futures import ThreadPoolExecutor
import hashlib
import json
from pathlib import Path
import re
import unicodedata
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "audio"
CATALOGUE = "https://opendua.org/v0.0.4/catalogue.json"
QURAN_API = "https://api.alquran.cloud/v1"


def fetch(url):
    request = Request(url, headers={"User-Agent": "IqroQu educational audio importer"})
    with urlopen(request, timeout=60) as response:
        return response.read()


def letters(text):
    # Compare spelling only, not pronunciation. Runtime keys still retain every
    # harakah, and this importer does not claim to certify a reader's makhraj.
    text = unicodedata.normalize("NFC", text).replace("ٱ", "ا")
    return re.sub(r"[^\u0621-\u063a\u0641-\u064a\u0671]", "", text)


def import_recordings():
    lessons = (ROOT / "src/data/lessons.js").read_text()
    cards = list(dict.fromkeys(re.findall(r'\{ arab: "([^"]+)"', lessons)))
    prayers = re.findall(r'\{ arab: "([^"]+)"', lessons.split("const DOA_MODULES = [")[1].split("const APP_DATA")[0])
    entries = {}

    def add(text, audio, provider, reciter, reference, source_text, **extra):
        name = reference.replace(":", "-")
        filename = ("husary-" if provider == "Al Quran Cloud" else "opendua-") + name + ".mp3"
        path = OUT / filename
        if not path.exists():
            data = fetch(audio)
            if len(data) < 1000 or data.lstrip().startswith((b"<", b"{")):
                raise ValueError(f"Not an audio file: {audio}")
            path.write_bytes(data)
        entries[unicodedata.normalize("NFC", text)] = {
            "clip": "assets/audio/" + filename, "remote": audio,
            "provider": provider, "reciter": reciter, "reference": reference,
            "sourceText": source_text,
            "sha256": hashlib.sha256(path.read_bytes()).hexdigest(), **extra,
        }

    catalogue = json.loads(fetch(CATALOGUE))
    # A recording belongs to the entire step, not each individual item inside it.
    # Reject multipart steps so e.g. Alhamdulillah never plays a whole litany.
    reciters = {r["id"]: r["name"] for r in catalogue["reciters"]}
    for entry in catalogue["entries"]:
        for variation in entry.get("variations", []):
            for step in variation["steps"]:
                items = step.get("items", [])
                if len(items) != 1 or "dua" not in items[0] or not step.get("recordings"):
                    continue
                source_text = items[0]["dua"]["arabic"]
                for text in prayers:
                    if text in entries or letters(text) != letters(source_text):
                        continue
                    recording = step["recordings"][0]
                    add(text, recording["url"], "OpenDua", reciters[recording["reciterId"]],
                        entry["id"], source_text, licence="CC BY 4.0",
                        sourceApi="https://api.opendua.org/v2/entries/" + entry["id"])

    # Complete ayahs in the existing Al-Fatihah and short-surah lessons.
    # Never map a fragment to a whole verse, or trim tajwid into unrelated words.
    basmala = letters("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ")

    def import_surah(surah):
        url = f"{QURAN_API}/surah/{surah}/ar.husary"
        data = json.loads(fetch(url))["data"]
        # Match against the API's Imlai spelling, not Uthmani small letters.
        # Keep the unmodified Uthmani source text alongside it for provenance.
        simple = json.loads(fetch(f"{QURAN_API}/surah/{surah}/quran-simple"))["data"]
        matching = {ayah["number"]: ayah["text"] for ayah in simple["ayahs"]}
        for ayah in data["ayahs"]:
            source_text = ayah["text"]
            comparison = matching[ayah["number"]]
            for text in cards:
                key = letters(text)
                prefixed = ayah["numberInSurah"] == 1 and letters(comparison) == basmala + key
                if key != letters(comparison) and not prefixed:
                    continue
                add(text, ayah["audio"], "Al Quran Cloud", "Mahmoud Khalil Al-Husary",
                    f"{surah}:{ayah['numberInSurah']}", source_text,
                    prefixedBasmala=prefixed, matchingText=comparison, sourceApi=url)

    with ThreadPoolExecutor(max_workers=3) as pool:
        list(pool.map(import_surah, [1, 103, 108, 112, 113, 114]))
    manifest = {
        "entries": dict(sorted(entries.items())),
        "unmatchedPrayers": [text for text in prayers if unicodedata.normalize("NFC", text) not in entries],
    }
    (OUT / "recordings.js").write_text(
        "// Generated by scripts/import_recitations.py; whole, unedited human recordings.\n"
        "window.IQRO_RECORDINGS = " + json.dumps(manifest, ensure_ascii=False, indent=2) + ";\n"
    )
    print(f"Imported {len(entries)} human recitations; {len(manifest['unmatchedPrayers'])} prayers retain labelled synthetic examples.")


if __name__ == "__main__":
    import_recordings()
