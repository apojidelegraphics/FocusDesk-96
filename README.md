# FocusDesk 96 — Desktop Edition, v1.0.0

The complete FocusDesk 96 study environment, now as a native desktop app
for macOS, Windows, and Linux. Same features. Real files on your computer
instead of browser storage. Portable, backupable, and fully yours.

[![Latest release](https://img.shields.io/github/v/release/apojidelegraphics/FocusDesk-96?include_prereleases)](https://github.com/apojidelegraphics/FocusDesk-96/releases)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

![FocusDesk 96 boot screen](docs/boot.png)

FocusDesk 96 is a complete study and productivity environment built as a Windows 95-style
desktop: windows, a taskbar, a Start menu, and a little assistant called Clipy. It has no
accounts and no cloud. Everything runs on your computer.

## What's inside

![FocusDesk 96](docs/screenshot.png)

**Study tools**
- 📅 Calendar — Month and Week views, drag to reschedule, click any hour to time-block
- 📝 Notepad — Markdown editor with live preview, note linking, task checkboxes, templates
- 🗂 Folders — Group assignments and notes, search, filter by class
- 🃏 Flash Cards — Real spaced repetition (SM-2), import from Quizlet
- ⏱ Focus Timer — Pomodoro with background sound and auto-logged stats
- 📚 Grade Calculator — Current grade and exactly what you need on the rest
- 🎓 Class Schedule — Weekly class times, semester start/end
- 📊 Study Stats — 14-day chart, 6-month heatmap, weekly goal, day streak
- 📈 Weekly Review — Full summary of any week
- ✅ Tasks, Reminders, Habits, Countdowns
- 📖 Assignment Planner, Formula Sheet, Periodic Table, Dictionary
- ✍️ Citation Maker — APA 7, MLA 9, Chicago
- 🔢 Unit Converter, Equation Solver, Math Grapher, Randomizer
- 🗑 Recycle Bin, 🔍 Find, 📦 Migrate

**Assistant**
- Clipy — your study companion in the corner
- Works with Claude, OpenRouter, OpenAI, DeepSeek, or Gemini (bring your own key)
- Runs fully offline with M.X.E.S. via Ollama or LM Studio

**Extras**
- 🎮 Games — Solitaire, Sudoku, Tetris, Snake, 2048, Memory, Pong, Minesweeper, Typing, Board Games
- 🎨 12 colour themes + Tritone icon themes
- 🖱 Colourable pixel-art cursors
- 💾 Portable JSON data — back up, sync, or move between machines

## What's new in the desktop version

- 📁 **Real files on your computer.** Your data lives in a plain, readable
  `data.json` in your OS's standard user-data folder. Back it up, sync it
  with Dropbox, or open it in a text editor.
- 🖥 **Native menus.** Standard Edit, View, File and Help menus on every platform.
- 💾 **Native file dialogs.** Save backups, import `.ics` calendars, and
  export migration files through your OS's real save/open dialogs.
- 🔄 **Automatic daily backups.** Seven rolling snapshots, written straight
  to disk, no more relying on browser storage.
- 🪟 **Window state persists.** FocusDesk remembers its size and position.
- 📦 **Full session restore.** Every window you had open comes back exactly
  where you left it, even after a full quit and relaunch.

## Download

Grab the installer for your platform from the
[latest release](https://github.com/apojidelegraphics/FocusDesk-96/releases/latest):

- **macOS** — `.dmg` (Apple Silicon `arm64` and Intel `x64`)
- **Windows** — `.exe`
- **Linux** — `.AppImage`
- **Browser (Chrome, Edge, Firefox)**: `FocusDesk-96-Browser-2.7.zip`. This is the **browser version** saved to your computer: unzip it and open `index.html`. It is not the desktop app, and it keeps data in your browser rather than in files, so use Control Panel → Save backup file regularly.

## First launch

These builds are unsigned. That's normal for indie software and doesn't mean
anything is wrong.

- **macOS** — right-click the app → Open → Open. Do this once. Subsequent launches work normally.
  On macOS 15 and later, if that doesn't offer an Open button: open **System Settings → Privacy & Security**, scroll down, and click **Open Anyway** next to FocusDesk 96.
- **Windows** — if SmartScreen appears, click "More info" → "Run anyway".
- **Linux** — mark the AppImage executable: `chmod +x FocusDesk-96-1.0.0.AppImage`.

## Your data

Your data lives in:

- **macOS** — `~/Library/Application Support/FocusDesk 96/`
- **Windows** — `%APPDATA%\FocusDesk 96\`
- **Linux** — `~/.config/FocusDesk 96/`

Back that folder up and you've backed up everything.

Inside it:

| File / folder | What it is |
| --- | --- |
| `data.json` | All your FocusDesk data, pretty-printed and human-readable |
| `wall.json` | Your desktop wallpaper (kept separate because it can be large) |
| `settings.json` | Small app settings, such as custom note templates |
| `keys.json` | Your AI assistant API keys (see the note below) |
| `backups/` | Automatic daily backups, one per day, the newest 7 kept |
| `migrate/` | A copy of every file the Migrate app exports |
| `window-state.json` | Window size and position |

**Back up or move to another computer:** quit FocusDesk, copy the folder (or just `data.json`),
and put it in the same place on the other machine. Syncing the folder with Dropbox or similar
works too; just don't run FocusDesk on two computers at the same moment.

**Restore a backup:** quit FocusDesk, then copy a file from `backups/` over `data.json`. Or use
**Control Panel → Restore from file…** inside the app and pick the backup.

**Open the folder:** use **File → Open Backups Folder** in the app.

All writes are atomic (written to a temporary file, then swapped in), so a crash or power cut
can't leave you with a half-written file. If a data file is ever unreadable, FocusDesk sets it
aside as `*.corrupt-<timestamp>`, starts fresh, and tells you.

> **API keys are stored unencrypted in `keys.json` in your user data folder. Keep that file private.**
> It's a separate file so you can share `data.json` without sharing your keys. Backup files made
> from inside the app never include keys.

## Development

You need [Node.js](https://nodejs.org/) 20 or newer.

```sh
git clone git@github.com:apojidelegraphics/FocusDesk-96.git
cd FocusDesk-96
npm install
npm start
```

`npm start` launches the app with your real user data folder. To develop against a throwaway
copy instead, set a different config location first, for example
`XDG_CONFIG_HOME=/tmp/fd-dev npm start` on Linux.

How it fits together:

- `focusdesk.js`, `focusdesk.css`, `index.html`: the app. It is still plain vanilla JavaScript
  and still runs on its own in a browser (browser version 2.6.1).
- `main.js`: Electron main process. Files, backups, dialogs, menus, window state.
- `preload.js`: the small `window.focusdesk` API. The page never touches `fs` itself.
- `focusdesk-desk.js`: desktop shim loaded before `focusdesk.js`. It swaps `localStorage` for
  files and browser downloads and file pickers for native dialogs.

## Building

Installers are built with [electron-builder](https://www.electron.build/). Build on the OS you
are targeting:

```sh
npm run build:mac     # .dmg   (run on macOS)
npm run build:win     # .exe   (run on Windows)
npm run build:linux   # .AppImage (run on Linux)
```

Output goes to `dist/`. The app icon is generated from `apojilogo.js` automatically before each
build (`scripts/build-icon.js`).

**Releasing:** bump `version` in `package.json`, commit, then push a matching tag:

```sh
git tag v1.0.0
git push origin v1.0.0
```

The GitHub Actions workflow builds all three installers and attaches them to a **draft**
release. Review it on the Releases page and publish when you're happy.

## About Apoji

FocusDesk 96 is a product of **Apoji Delegraphics**, developed in collaboration
with **Apoji Studios**.

**Apoji Studios** is the creative design arm: the people behind every pixel,
every theme, every bit of polish. The Windows 95 aesthetic, the Tritone icon
system, Clipy, the sound design, and the whole feel of the desktop come from
here. If it looks and feels like something, the Studio made it.

**Apoji Delegraphics** is the engineering and security side: software
development, cybersecurity, and firewall protection solutions, plus AI work.
The data model, the sanitization layer, the offline-first architecture, the
local-first, no-account design, and everything that has to *hold up under
pressure* comes from here. If it works, and keeps working, Delegraphics built it.

FocusDesk 96 is the first product to come from both sides at once.

---

## From Lucas Roland, CEO

> I'm Lucas Roland, and I run two companies. Apoji Studios makes things that
> look and feel good. Apoji Delegraphics makes sure they work, stay secure,
> and hold up when it matters.
>
> FocusDesk 96 started as a personal frustration. Every study app I tried
> wanted my data on their server. Every planner wanted a subscription. Every
> timer wanted to send me push notifications at 7 AM. So we built the
> opposite: a complete study environment that lives entirely on your device,
> that doesn't have an account system because it doesn't need one, and that
> treats your attention as the scarce resource it actually is.
>
> It's the first thing the Studio and Delegraphics have built together, and
> it's the template for everything we're going to make next. Design and
> engineering in the same room, from day one, on products we'd actually use
> ourselves.
>
> Whether you're a student cramming for a chem midterm or someone just
> trying to build better habits, I hope FocusDesk gives you a real place to
> work. Something that feels like *yours*.
>
> — Lucas

---

## License

MIT © 2026 Lucas / Apoji Studios. See [LICENSE](LICENSE).

## Credits

A product of **Apoji Delegraphics**, designed by **Apoji Studios**.

Full browser-version history lives in the app's own Notepad under
"FocusDesk 96 — Complete Guide".

---

*FocusDesk 96 is a product of Apoji Delegraphics, designed by Apoji Studios.*

*© 2026 Apoji Delegraphics. All rights reserved.*

*Lucas Roland, CEO*
