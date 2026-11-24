# IqroQu

An Indonesian learning adventure for Iqro, Qur'an, tajwid, prayer, prophets,
Arabic, and daily duas. Lessons and five mini-games run entirely in the browser.

## Run locally

```sh
python3 -m http.server 4173
```

Open `http://localhost:4173`. There is no build step or runtime dependency.
Serve `index.html`, `game.css`, and `assets/` together when deploying. The play
garden illustration is an original generated asset, not copied reference art. Google Fonts are
optional; the interface falls back to system fonts when they are unavailable.
Game symbols use a locally bundled 87KB subset of Google's Noto Color Emoji so
they also render on devices without emoji fonts. Its SIL Open Font License is
included in `assets/Noto-Emoji-LICENSE.txt`.

## Progress

Learning progress, favorites, XP, music preferences, and streaks stay in the
browser's local storage. The game interface keeps the original storage keys.
Each 100 XP advances a player level; the daily mission tracks 20 XP earned on
the current calendar day. Resetting progress in Settings also clears that mission.

## Motion and audio

A silent, skippable IqroQu welcome plays once per browser tab. Use **Putar intro
IqroQu** on the home screen to replay it. Reduced-motion preferences disable
entrances, character movement, and button transforms; the content remains visible.

Arabic now has nine units, including 48 new words about animals, food, the body,
and nature. Existing unit IDs and card positions are unchanged.

Vocabulary examples are bundled MP3s generated with Microsoft's Saudi Arabic
`ar-SA-HamedNeural` voice, rather than whichever voice a device happens to have.
Isolated hijaiyah with harakat use human recordings from the CC0 Marked Hijaiyah
Letters' Pronunciation Dataset. Multi-letter drills play those syllables in order,
so a single marked letter is not mistaken for its letter name. **Pelan-pelan**
slows playback while preserving pitch. See `assets/audio/SOURCES.md` for provenance.

Other lesson material, including Qur'an and tajwid, still uses device speech
synthesis. This is not a certified reciter or a replacement for a teacher's
makhraj/tajwid guidance. Failed media loads fall back to device speech; missing
voices show a retry message. Navigation and a new playback stop old audio.
Audio is loaded on demand from the same origin, with no runtime TTS service or key.
Background music is optional and can be toggled from any screen.

### Rebuild pronunciation assets

The checked-in files need no generation step to run. To regenerate them, install
`edge-tts==7.2.3` and `ffmpeg`, then run `python3 scripts/generate_arabic_audio.py`.
The script reuses existing MP3s and writes their manifest and source metadata to
`assets/arabic-audio.js`. Delete an MP3 first to regenerate that particular example.

Run the audio lifecycle and asset coverage checks with `node --test tests/audio.test.cjs`.
