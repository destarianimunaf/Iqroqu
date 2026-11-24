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

Arabic pronunciation uses the browser's speech synthesis and available voices.
Background music is optional and can be toggled from any screen.
