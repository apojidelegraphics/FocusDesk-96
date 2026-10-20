# FocusDesk 96 — Desktop Edition 1.3.0

Apple Calendar and Reminders writing, pop-out windows, and Apple's on-device model. It includes everything from 1.2.x and browser version 2.8.2.

## Download

- **macOS, Apple Silicon (M1 or newer):** [FocusDesk-96-1.3.0-arm64.dmg](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.3.0/FocusDesk-96-1.3.0-arm64.dmg)
- **macOS, Intel:** [FocusDesk-96-1.3.0-x64.dmg](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.3.0/FocusDesk-96-1.3.0-x64.dmg)
- **Windows:** [FocusDesk-96-Setup-1.3.0.exe](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.3.0/FocusDesk-96-Setup-1.3.0.exe)
- **Linux:** [FocusDesk-96-1.3.0.AppImage](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.3.0/FocusDesk-96-1.3.0.AppImage)
- **Chrome / any browser:** [FocusDesk-96-Browser-2.8.2.zip](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.3.0/FocusDesk-96-Browser-2.8.2.zip)

**About the Chrome download:** it is the **browser version** of FocusDesk 96 saved to a folder on your computer. It is not the desktop app. Unzip it and open `index.html` in Chrome (Edge, Brave and Firefox work too). It runs offline, but it keeps your data inside the browser instead of in files, so use Control Panel → Save backup file regularly.

## What's new

- **Write to Apple Calendar and Reminders (Mac).** In Calendar Link, turn on **Write FocusDesk items to Apple Calendar and Reminders**. FocusDesk makes a calendar and a Reminders list called **FocusDesk** and changes only those two; everything else in your calendars is left alone. You choose what goes in: events, assignments (as due dates), reminders, and tasks with a due date. Tick a reminder off on your iPhone and it ticks off in FocusDesk too. Off by default. macOS asks for permission the first time.
- **Pop out an app (all computers).** Press the small arrow button in an app's title bar to move it into its own window: Notepad on one screen, your reading on the other. Changes in either window appear in the other.
- **Apple's on-device model for M.X.E.S.** (Mac with Apple Intelligence and macOS 26 or newer). Control Panel → Assistant → M.X.E.S. engine. Nothing leaves your Mac.
- **Now Playing cover lookup** (optional, off by default). When the player gives no cover, FocusDesk can look one up by song and artist. This sends the title and artist to Apple's public music search.
- **Newest-copy file for the browser version** (optional). Control Panel → Desktop → "Keep a copy of your newest data in the backup folder". Choose that folder in the browser version (Chrome, Edge or Brave) to load your latest data there.

## Good to know

- The Mac helper programs are built when the app is built. If one can't be built, the app tells you why in that feature's message instead of failing silently, and the other features keep working.
- Pop-out windows don't cover the Timer or Control Panel, which stay in the main window.
- Silent auto-update is coming in 1.3.1. For now the update checker tells you when a new version is out and links to the download.
- Clipy creating events, reminders and tasks is planned for 1.4.

## First launch

These builds are unsigned. That's normal for indie software and doesn't mean anything is wrong. Your computer just can't check who made the app.

**macOS:** drag FocusDesk 96 into Applications, then open Terminal and run these two commands:

```
codesign --force --deep --sign - "/Applications/FocusDesk 96.app"
xattr -cr "/Applications/FocusDesk 96.app"
```

Then open the app normally. You need to do this again after each update. The first time you turn on Apple Calendar writing, macOS asks for permission; if you said no earlier, change it in System Settings → Privacy & Security.

**Windows:** if SmartScreen appears, click **More info**, then **Run anyway**.

**Linux:** make the file executable with `chmod +x FocusDesk-96-*.AppImage`, then run it.

## Updating

Install over your current copy. Your data lives in a separate folder and is kept.

## If something doesn't work

Use Control Panel → Feedback.
