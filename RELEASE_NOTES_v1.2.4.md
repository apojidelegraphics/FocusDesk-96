# FocusDesk 96 — Desktop Edition 1.2.4

A flash card hotkey, a player in the taskbar clock, shuffle and repeat, plus a much bigger Citation Maker and Sketch Pad. It includes everything from 1.2.x and browser version 2.7.5.

## Download

- **macOS, Apple Silicon (M1 or newer):** [FocusDesk-96-1.2.4-arm64.dmg](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.4/FocusDesk-96-1.2.4-arm64.dmg)
- **macOS, Intel:** [FocusDesk-96-1.2.4-x64.dmg](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.4/FocusDesk-96-1.2.4-x64.dmg)
- **Windows:** [FocusDesk-96-Setup-1.2.4.exe](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.4/FocusDesk-96-Setup-1.2.4.exe)
- **Linux:** [FocusDesk-96-1.2.4.AppImage](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.4/FocusDesk-96-1.2.4.AppImage)
- **Chrome / any browser:** [FocusDesk-96-Browser-2.7.5.zip](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.4/FocusDesk-96-Browser-2.7.5.zip)

**About the Chrome download:** it is the **browser version** of FocusDesk 96 saved to a folder on your computer. It is not the desktop app. Unzip it and open `index.html` in Chrome (Edge, Brave and Firefox work too). It runs offline, but it keeps your data inside the browser instead of in files, so use Control Panel → Save backup file regularly.

## What's new in the desktop version

- **Flash card hotkey.** Press `Ctrl+Shift+Y` (`Cmd+Shift+Y` on Mac) anywhere to turn the text you just copied into a new flash card. The quick capture window opens on the new **Card** tab with the front already filled in, so you only type the back. Cards land in a deck called "Quick cards". You can switch the hotkey off in Control Panel → Desktop, and FocusDesk tells you if another app is already using it.
- **A player in the taskbar clock.** Click the clock for a Now Playing player above the calendar: cover, a scrub bar, and play, pause, next, previous, shuffle and repeat. In Control Panel → Desktop you can also turn on **Show what's playing next to the taskbar clock**, a small ♪ indicator you can click. It only checks what's playing while the flyout is open or that setting is on.
- **Shuffle and repeat** on the Now Playing pill as well. They work with Spotify and Apple Music on Mac and with Linux players, and with Windows apps that report them. The buttons grey out when a player doesn't.

## What's new from browser version 2.7.5

- **Citation Maker 2.0.** Eight kinds of source (website, book, journal article, video, podcast, lecture, dataset, AI-generated text) in six styles (APA, MLA, Chicago, Harvard, IEEE, Turabian), with the in-text citation shown next to each. Fill it in from a **DOI** or an **ISBN** (and from a web link in the desktop app). Import and export **BibTeX** and **RIS**, copy with italics and hanging indents, and change a whole bibliography to another style in one click. In a note, type `[@key]` for an in-text citation and `{{works-cited}}` for the list of what that note cites.
- **Sketch Pad 2.0.** Redo and `Ctrl/Cmd+Z`, an Arrow tool, an Eyedropper, **Select** (drag a piece of your drawing around), zoom and pan, graph, lined and Cornell paper, pen pressure, **Insert into note**, and **Make flash cards** (turns your drawing into image-occlusion cards).
- **Special characters fixed.** The window close X and a few other symbols could show up as odd characters on some websites. The app no longer depends on how a website handles text encoding.

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

## Good to know

- Apple Calendar and Reminders are still read-only in this version.
- Silent auto-update isn't included yet. The update checker tells you when a new version is out and links to the download.
- If something doesn't work as described, use Control Panel → Feedback.
