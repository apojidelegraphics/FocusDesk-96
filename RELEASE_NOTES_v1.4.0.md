# FocusDesk 96 — Desktop Edition 1.4.0

A stability release: no new features. Security fixes, safer saving with several tabs and windows, and a polish pass. It includes everything from 1.3.x and browser version 3.0.0.

## Download

- **macOS, Apple Silicon (M1 or newer):** [FocusDesk-96-1.4.0-arm64.dmg](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.4.0/FocusDesk-96-1.4.0-arm64.dmg)
- **macOS, Intel:** [FocusDesk-96-1.4.0-x64.dmg](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.4.0/FocusDesk-96-1.4.0-x64.dmg)
- **Windows:** [FocusDesk-96-Setup-1.4.0.exe](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.4.0/FocusDesk-96-Setup-1.4.0.exe)
- **Linux:** [FocusDesk-96-1.4.0.AppImage](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.4.0/FocusDesk-96-1.4.0.AppImage)
- **Chrome / any browser:** [FocusDesk-96-Browser-3.0.0.zip](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.4.0/FocusDesk-96-Browser-3.0.0.zip)

**About the Chrome download:** it is the **browser version** of FocusDesk 96 saved to a folder on your computer. It is not the desktop app. Unzip it and open `index.html` in Chrome (Edge, Brave and Firefox work too). It runs offline, but it keeps your data inside the browser instead of in files, so use Control Panel → Save backup file regularly.

## What's fixed

**Security**

- **Notes can't carry hidden code any more.** A crafted web link or `[[note link]]` in a note (for example one that arrived in a shared-folder file) could use a quote mark to add hidden code to the page. Quote marks are now handled safely.
- **The graphing calculator** refuses anything that isn't plain maths.
- **Citation Maker's web page lookup** is no longer allowed to reach addresses on your own computer or network.

**Safer saving**

- **Two browser tabs:** changes made in each tab now merge, instead of one tab overwriting the other. A stray or broken save from another tab can no longer replace your data.
- **One app having a problem** can no longer stop other windows from updating, or cut an action short.
- A leftover temporary storage entry is cleaned up if a browser was closed at the wrong moment.

**Speed and polish**

- **Start-up is about half a second quicker**, and any key skips it.
- **Minimized windows** are no longer redrawn while they're out of sight; they catch up when you bring them back.
- **Hint text is easier to read** (it was too faint on the grey background).
- **Control Panel has a Jump to row** at the top, so you can go straight to Updates, Backup and the rest.
- **Counts read properly:** "1 card" and "3 cards", not "1 card(s)".
- Behind the scenes: leftover code removed, and automatic safety checks (including tests for the security fixes above) now run in every build.

## Also checked, and found fine

Opening and closing every app over and over leaves nothing behind (no memory leaks). 4,000 deliberately damaged saved files all loaded safely. A very large data set (about 11 MB, thousands of notes and cards) still saves in about a tenth of a second. The libraries inside the app have no known vulnerabilities.

## Good to know

- **Browser version 3.0** comes with a silver start-up screen. Everything else works the same.
- **Windows and Linux copies of 1.3.2 can install this update by themselves** (Control Panel → Updates chooses how). If it doesn't arrive on its own, install it from the link above. A Mac tells you and links to the download.
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
