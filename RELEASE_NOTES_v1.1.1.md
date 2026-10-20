# FocusDesk 96 — Desktop Edition 1.1.1

A small update for Windows, plus everything from 1.1.0.

## What's new

- **Windows: menu in the title bar.** Control Panel → Desktop has a new option, "Put File, Edit, View and Help in a ⋯ button in the title bar". Turn it on and restart FocusDesk. The menu row disappears and a slim title bar with a ⋯ button takes its place, like Spotify. Click ⋯ to open File, Edit, View and Help. It is off by default.

Everything from 1.1.0 is included: quick capture (`Ctrl+Shift+Space`), native notifications, the tray icon, Habit Breaker, LaTeX and images in notes, cloze and image-occlusion flash cards, the focus session log, achievements and the grade what-if.

## Download

- **macOS, Apple Silicon (M1 or newer):** [FocusDesk-96-1.1.1-arm64.dmg](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.1.1/FocusDesk-96-1.1.1-arm64.dmg)
- **macOS, Intel:** [FocusDesk-96-1.1.1-x64.dmg](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.1.1/FocusDesk-96-1.1.1-x64.dmg)
- **Windows:** [FocusDesk-96-Setup-1.1.1.exe](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.1.1/FocusDesk-96-Setup-1.1.1.exe)
- **Linux:** [FocusDesk-96-1.1.1.AppImage](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.1.1/FocusDesk-96-1.1.1.AppImage)
- **Chrome / any browser:** [FocusDesk-96-Browser-2.7.zip](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.1.1/FocusDesk-96-Browser-2.7.zip)

**About the Chrome download:** it is the **browser version** of FocusDesk 96 saved to a folder on your computer. It is not the desktop app. Unzip it and open `index.html` in Chrome (Edge, Brave and Firefox work too). It runs offline, but it keeps your data inside the browser instead of in files, so use Control Panel → Save backup file regularly.

## First launch

These builds are unsigned. That's normal for indie software and doesn't mean anything is wrong.

**macOS:** drag FocusDesk 96 to Applications, then open Terminal and run these two commands:

```
codesign --force --deep --sign - "/Applications/FocusDesk 96.app"
xattr -cr "/Applications/FocusDesk 96.app"
```

Then open the app normally. You need to do this again after each update.

**Windows:** if SmartScreen appears, click **More info**, then **Run anyway**.

**Linux:** make the file executable with `chmod +x FocusDesk-96-1.1.1.AppImage`, then run it.

## Updating

Install over your current copy. Your data lives in a separate folder and is kept.
