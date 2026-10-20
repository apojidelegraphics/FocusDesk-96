# FocusDesk 96 — Desktop Edition 1.1.0

The complete FocusDesk 96 study environment as a native app for macOS, Windows and Linux, now with quick capture, native notifications and a tray icon. It includes everything new in browser version 2.7. Your data stays as plain files on your computer.

## Download

- **macOS, Apple Silicon (M1 or newer):** [FocusDesk-96-1.1.0-arm64.dmg](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.1.0/FocusDesk-96-1.1.0-arm64.dmg)
- **macOS, Intel:** [FocusDesk-96-1.1.0-x64.dmg](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.1.0/FocusDesk-96-1.1.0-x64.dmg)
- **Windows:** [FocusDesk-96-Setup-1.1.0.exe](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.1.0/FocusDesk-96-Setup-1.1.0.exe)
- **Linux:** [FocusDesk-96-1.1.0.AppImage](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.1.0/FocusDesk-96-1.1.0.AppImage)
- **Chrome / any browser:** [FocusDesk-96-Browser-2.7.zip](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.1.0/FocusDesk-96-Browser-2.7.zip)

**About the Chrome download:** it is the **browser version** of FocusDesk 96 saved to a folder on your computer. It is not the desktop app. Unzip it and open `index.html` in Chrome (Edge, Brave and Firefox work too). It runs offline, but it keeps your data inside the browser instead of in files, so use Control Panel → Save backup file regularly. For automatic daily backups and real files, use the desktop app.

## What's new in the desktop version

- **Quick capture.** Press `Cmd+Shift+Space` (`Ctrl+Shift+Space` on Windows and Linux) from anywhere. `Tab` switches between Task, Note, Reminder and Event, `Enter` saves, `Esc` cancels. It understands things like "call mom tomorrow at 5pm" or "in 30 min".
- **Native notifications.** Reminders and finished focus sessions appear in your system's notification center when FocusDesk isn't in front. Your system's Do Not Disturb is respected.
- **Menu bar / system tray icon.** Start a focus session, add a quick task, or open the app. The timer countdown shows while a session runs.
- **Control Panel → Desktop.** Keep FocusDesk running in the tray when you close the window, open it at login, start hidden, or turn notifications and the hotkey off.
- **Update checker.** FocusDesk tells you when a new release is out.
- **No more 5 MB meter.** Your data is plain files, so the browser storage limit doesn't apply.

## What's new from browser version 2.7

- **Habit Breaker.** Track habits you want to quit. Same day grid and streaks, but the goal is clean days. Log slips with a note about what triggered them, and get a message when you beat your own record.
- **LaTeX and images in Notepad.** `$x^2$` inline and `$$...$$` for blocks. Paste or drop images straight into a note; they export with the `.md` file.
- **Flash cards.** LaTeX and images on cards, plus cloze deletion (`{{c1::answer}}`) and image occlusion cards you draw over a diagram.
- **Focus session log.** Every timer session is logged with its subject, length and time of day. Study Stats shows your best hours to focus, and Weekly Review lists each session.
- **Achievements.** 30 badges for streaks, hours, cards, habits, games and more.
- **Grade what-if.** Slide to see "if I get X on the rest", with best, likely and worst semester GPA.

## First launch

These builds are unsigned. That's normal for indie software and doesn't mean anything is wrong.

**macOS:** drag FocusDesk 96 to Applications, then open Terminal and run these two commands:

```
codesign --force --deep --sign - "/Applications/FocusDesk 96.app"
xattr -cr "/Applications/FocusDesk 96.app"
```

Then open the app normally. You need to do this again after each update.

**Windows:** if SmartScreen appears, click **More info**, then **Run anyway**.

**Linux:** make the file executable with `chmod +x FocusDesk-96-1.1.0.AppImage`, then run it.

## Updating from 1.0.0

Install over your current copy. Your data lives in a separate folder and is kept. On first launch you'll see NEW badges on Habit Breaker and Achievements.

## Your data

- **macOS:** `~/Library/Application Support/FocusDesk 96/`
- **Windows:** `%APPDATA%\FocusDesk 96\`
- **Linux:** `~/.config/FocusDesk 96/`

Use **File → Open Backups Folder** to jump there. API keys for the AI assistant are stored unencrypted in `keys.json` in that folder, so keep it private.

## Moving from the browser version

In the browser version, open Control Panel and choose Save backup file. In the desktop app, use Control Panel → Restore from file.

## Good to know

- The quick capture hotkey can't be registered if another app already uses it. Control Panel → Desktop tells you.
- Some Linux desktops (GNOME without an extension, or Wayland) don't show tray icons or allow global hotkeys. FocusDesk still works without them.
- Silent auto-update isn't included yet. The update checker tells you when a new version is out and links to the download.
