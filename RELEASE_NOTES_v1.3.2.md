# FocusDesk 96 — Desktop Edition 1.3.2

Silent updates for Windows and Linux, plus Windows Now Playing, Clipy Undo and flash cards, and pop-outs that remember where they were. It includes everything from 1.3.x and browser version 2.9.1.

## Download

- **macOS, Apple Silicon (M1 or newer):** [FocusDesk-96-1.3.2-arm64.dmg](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.3.2/FocusDesk-96-1.3.2-arm64.dmg)
- **macOS, Intel:** [FocusDesk-96-1.3.2-x64.dmg](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.3.2/FocusDesk-96-1.3.2-x64.dmg)
- **Windows:** [FocusDesk-96-Setup-1.3.2.exe](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.3.2/FocusDesk-96-Setup-1.3.2.exe)
- **Linux:** [FocusDesk-96-1.3.2.AppImage](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.3.2/FocusDesk-96-1.3.2.AppImage)
- **Chrome / any browser:** [FocusDesk-96-Browser-2.9.1.zip](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.3.2/FocusDesk-96-Browser-2.9.1.zip)

**About the Chrome download:** it is the **browser version** of FocusDesk 96 saved to a folder on your computer. It is not the desktop app. Unzip it and open `index.html` in Chrome (Edge, Brave and Firefox work too). It runs offline, but it keeps your data inside the browser instead of in files, so use Control Panel → Save backup file regularly.

## What's new

- **Silent updates (Windows and Linux).** FocusDesk can now update itself. In Control Panel → Updates you choose what happens when an update is out: **install it automatically**, **ask me first**, or **just tell me**. Automatic updates download in the background and install when you close FocusDesk (or when you press Restart now). If an update ever fails, FocusDesk falls back to telling you and linking to the download. A Mac still tells you and links to the download.
- **Windows Now Playing** now looks at every media session, so it picks the one that is actually playing and finds more cover pictures. **Check Now Playing** in Control Panel lists every session.
- **Clipy: Undo, and flash cards.** After Clipy adds something, an Undo button takes it back. Clipy can also make flash cards: "make a card: capital of France is Paris".
- **Pop-outs remember their size and position**, and the command palette (`Ctrl/Cmd+K`) can pop out any app.
- **See the update schedule** is now in Control Panel, next to the update checker.
- **Browser version 2.9.1:** the website shows a **new version is ready** bar with a Reload button, and warns when browser storage is nearly full.

## Good to know

- **Version 1.3.1 and older can't update themselves.** Install 1.3.2 by hand once; after that, Windows and Linux can keep themselves up to date. The first update it delivers will be 1.4.
- Linux updating works for the AppImage. Linux is only tested in a virtual environment, so please tell us if it misbehaves.
- The update schedule is at https://apojidelegraphics.github.io/FocusDesk-96/roadmap.html

## First launch

These builds are unsigned. That's normal for indie software and doesn't mean anything is wrong. Your computer just can't check who made the app.

**macOS:** drag FocusDesk 96 into Applications, then open Terminal and run these two commands:

```
codesign --force --deep --sign - "/Applications/FocusDesk 96.app"
xattr -cr "/Applications/FocusDesk 96.app"
```

Then open the app normally. You need to do this again after each update.

**Windows:** if SmartScreen appears, click **More info**, then **Run anyway**.

**Linux:** make the file executable with `chmod +x FocusDesk-96-*.AppImage`, then run it.

## Updating

Install over your current copy. Your data lives in a separate folder and is kept.

## If something doesn't work

Use Control Panel → Feedback.
