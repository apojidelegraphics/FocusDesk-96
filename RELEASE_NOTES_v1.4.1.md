# FocusDesk 96 — Desktop Edition 1.4.1

A **Minor update** (1 of 5 in cycle 1.4): fixes and polish, plus a few new things marked BETA. It includes everything from 1.4.0 and browser version 3.0.1.

## Download

- **macOS, Apple Silicon (M1 or newer):** [FocusDesk-96-1.4.1-arm64.dmg](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.4.1/FocusDesk-96-1.4.1-arm64.dmg)
- **macOS, Intel:** [FocusDesk-96-1.4.1-x64.dmg](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.4.1/FocusDesk-96-1.4.1-x64.dmg)
- **Windows:** [FocusDesk-96-Setup-1.4.1.exe](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.4.1/FocusDesk-96-Setup-1.4.1.exe)
- **Linux:** [FocusDesk-96-1.4.1.AppImage](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.4.1/FocusDesk-96-1.4.1.AppImage)
- **Chrome / any browser:** [FocusDesk-96-Browser-3.0.1.zip](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.4.1/FocusDesk-96-Browser-3.0.1.zip)

**About the Chrome download:** it is the **browser version** of FocusDesk 96 saved to a folder on your computer. It is not the desktop app. Unzip it and open `index.html` in Chrome (Edge, Brave and Firefox work too). It runs offline, but it keeps your data inside the browser instead of in files, so use Control Panel → Save backup file regularly.

## What's new

- **A new logo** on the Start button, and a new menu bar icon on Mac.
- **Clipy can change and complete things you already have** *(BETA)*. Ask it to move an event or tick off a task. It always asks first, even if "Add things without asking" is on, and Undo puts everything back. It only touches things you made by hand, and leaves repeating items and anything from Apple, Canvas or a calendar feed alone. There is a switch in Clipy's menu.
- **Start → Settings jumps to the right place.** Each Settings item opens Control Panel at its own section, with new Storage, Backup and Updates entries. The command palette (Ctrl/Cmd+K) has the same shortcuts.
- **A clearer storage bar** *(browser)*. It shows what is using the space (notes, pictures, flash cards, restore points, other things on the same address), with checked numbers and buttons to delete the restore point or the copy of a damaged save.
- **Backup folder help** *(browser)*. Real error messages instead of silence, a guide to Chrome's "contains system files" message, and **Choose the backup file instead** *(BETA)*.
- **Mac Dock number** *(BETA)*. The setting "Show a number on the Dock icon" already existed but did nothing on a Mac. It works now (off by default).
- **Windows taskbar menu:** *Ask Clipy* and *Show the mini timer* are added to the right-click menu.
- **Pop-outs open where you left them** *(BETA)*, never off screen or too big for the screen, and a window can no longer stay invisible. There is a **Reset pop-out positions** button in Control Panel.
- **Tags:** versions and single features can now carry small labels like MINOR and BETA.

## Good to know

- **BETA** beside a feature means it is newer and less proven. It ships to everyone, and may change or be switched off if it causes trouble.
- The update schedule is at https://apojidelegraphics.github.io/FocusDesk-96/roadmap.html
- Windows and Linux copies of 1.4.0 can install this update by themselves (Control Panel → Updates chooses how). A Mac tells you and links to the download.

## First launch

These builds are unsigned. That is normal for indie software and doesn't mean anything is wrong. Your computer just can't check who made the app.

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
