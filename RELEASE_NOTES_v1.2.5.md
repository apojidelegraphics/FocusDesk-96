# FocusDesk 96 — Desktop Edition 1.2.5

A command palette, tags and courses, folders that act as course hubs, shortcuts you can change, and an update checker that works. It includes everything from 1.2.x and browser version 2.8.

## Download

- **macOS, Apple Silicon (M1 or newer):** [FocusDesk-96-1.2.5-arm64.dmg](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.5/FocusDesk-96-1.2.5-arm64.dmg)
- **macOS, Intel:** [FocusDesk-96-1.2.5-x64.dmg](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.5/FocusDesk-96-1.2.5-x64.dmg)
- **Windows:** [FocusDesk-96-Setup-1.2.5.exe](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.5/FocusDesk-96-Setup-1.2.5.exe)
- **Linux:** [FocusDesk-96-1.2.5.AppImage](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.5/FocusDesk-96-1.2.5.AppImage)
- **Chrome / any browser:** [FocusDesk-96-Browser-2.8.zip](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.5/FocusDesk-96-Browser-2.8.zip)

**About the Chrome download:** it is the **browser version** of FocusDesk 96 saved to a folder on your computer. It is not the desktop app. Unzip it and open `index.html` in Chrome (Edge, Brave and Firefox work too). It runs offline, but it keeps your data inside the browser instead of in files, so use Control Panel → Save backup file regularly.

## What's new in the desktop version

- **Shortcuts you can change.** Control Panel → Desktop lists every global shortcut with **Change…** and **Reset**. It tells you when another app already has the keys and won't accept plain keys that would take over your typing. Two new shortcuts are ready to switch on: start or pause the focus timer, and bring FocusDesk to the front.
- **Update checking that works and explains itself.** The desktop app now asks GitHub from its own process, tries GitHub's public release feed if the first source is busy, and Control Panel → Updates shows when it last checked and what it found.

## What's new from browser version 2.8

- **Command palette.** Press `Ctrl+K` (`Cmd+K` on a Mac) to search everything at once (notes, tasks, flash cards, assignments, events, reminders, courses, folders and tags) and to open any app or run an action. Type `#tag`, `@course` or `>` to narrow it down.
- **Tags and courses.** Type `#biology` in a note, a task or a flash card and it works as a tag everywhere. Notes and flash cards can belong to a course (the Course box in Notepad and Flash Cards, or **Set deck's course** for a whole deck).
- **Folders as course hubs.** Every course gets a hub automatically, gathering its assignments, notes, flash cards and current grade. Folders can also be **smart** (fill themselves from a tag, a course and a due date), **nested**, given **icons**, **pinned to the Today page**, and **archived** by semester with final grades. **Export zip** saves Markdown notes and their pictures, and **Share file** gives a study group the notes and flash cards in one file (**Import shared…** opens it).
- **Update checking** in the browser versions is fixed too, with the same last-checked line and a backup source.

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

Install over your current copy. Your data lives in a separate folder and is kept. Your existing folders, notes and flash cards open just as before.

## Good to know

- Apple Calendar and Reminders are still read-only in this version.
- Silent auto-update isn't included yet. The update checker tells you when a new version is out and links to the download.
- If something doesn't work as described, use Control Panel → Feedback.
