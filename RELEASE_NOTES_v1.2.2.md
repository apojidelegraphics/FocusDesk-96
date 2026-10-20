# FocusDesk 96 — Desktop Edition 1.2.2

A music pill, a calendar that keeps itself updated, and a more resilient Clipy. It includes everything from 1.2.x and browser version 2.7.3.

## Download

- **macOS, Apple Silicon (M1 or newer):** [FocusDesk-96-1.2.2-arm64.dmg](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.2/FocusDesk-96-1.2.2-arm64.dmg)
- **macOS, Intel:** [FocusDesk-96-1.2.2-x64.dmg](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.2/FocusDesk-96-1.2.2-x64.dmg)
- **Windows:** [FocusDesk-96-Setup-1.2.2.exe](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.2/FocusDesk-96-Setup-1.2.2.exe)
- **Linux:** [FocusDesk-96-1.2.2.AppImage](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.2/FocusDesk-96-1.2.2.AppImage)
- **Chrome / any browser:** [FocusDesk-96-Browser-2.7.3.zip](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.2/FocusDesk-96-Browser-2.7.3.zip)

**About the Chrome download:** it is the **browser version** of FocusDesk 96 saved to a folder on your computer. It is not the desktop app. Unzip it and open `index.html` in Chrome (Edge, Brave and Firefox work too). It runs offline, but it keeps your data inside the browser instead of in files, so use Control Panel → Save backup file regularly.

## What's new in the desktop version

- **Now Playing.** A small always-on-top pill with the current song and its album cover, play/pause, next and previous. Open it from the Timer menu, the tray, or Control Panel → Desktop. Drag it anywhere by grabbing it; it remembers where you put it.
  - **Mac:** Spotify and Apple Music. macOS asks permission the first time. Spotify covers load from Spotify's image server; Apple Music covers are read from the Music app.
  - **Linux:** any media player, through the `playerctl` package.
  - **Windows:** apps that report to the system media controls (Spotify, browsers, most players). This is new on Windows, so tell us if your player doesn't show up.
- **Calendar Link keeps itself updated.** Paste your Canvas (or Google, Apple, school) calendar feed link once. FocusDesk fetches it when it starts, adds new assignments and events, and updates changed due dates. The link is kept in `keys.json`, never in backups. There's a switch to turn startup syncing off.
- **Ask Clipy opens in the bottom-right corner**, like Clipy's spot in the app.
- **Roomier mini timer.** More space between the clock, its label and the buttons, and you can drag it anywhere, just like the Now Playing pill.

## What's new from browser version 2.7.3

- **Clipy tries again by himself.** Some free models answer with a safety label like "User safety: safe" instead of an answer. Clipy now notices, says "Something came up while Clipy was answering. Never fear, he's trying again right now!", and retries up to twice. There's a switch in Control Panel → Assistant.
- **Regenerate.** Every Clipy answer has a Regenerate button, and a failed answer has Try again.
- **Feedback.** Control Panel has a new Feedback section: report a problem or suggest an idea as a pre-filled GitHub page. You can read exactly what's included first.

## First launch

These builds are unsigned. That's normal for indie software and doesn't mean anything is wrong.

**macOS:** drag FocusDesk 96 to Applications, then open Terminal and run these two commands:

```
codesign --force --deep --sign - "/Applications/FocusDesk 96.app"
xattr -cr "/Applications/FocusDesk 96.app"
```

Then open the app normally. You need to do this again after each update.

**Windows:** if SmartScreen appears, click **More info**, then **Run anyway**.

**Linux:** make the file executable with `chmod +x FocusDesk-96-1.2.2.AppImage`, then run it.

## Updating

Install over your current copy. Your data lives in a separate folder and is kept.

## Good to know

- Silent auto-update isn't included yet. The update checker tells you when a new version is out and links to the download.
- Calendar sync needs a feed link from your school or calendar app. Reading Apple Calendar directly isn't built yet.
