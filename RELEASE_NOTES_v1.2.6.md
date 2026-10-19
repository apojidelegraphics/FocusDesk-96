# FocusDesk 96 — Desktop Edition 1.2.6

A Windows fixes release. It includes everything from 1.2.x and browser version 2.8.

## Download

- **macOS, Apple Silicon (M1 or newer):** [FocusDesk-96-1.2.6-arm64.dmg](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.6/FocusDesk-96-1.2.6-arm64.dmg)
- **macOS, Intel:** [FocusDesk-96-1.2.6-x64.dmg](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.6/FocusDesk-96-1.2.6-x64.dmg)
- **Windows:** [FocusDesk-96-Setup-1.2.6.exe](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.6/FocusDesk-96-Setup-1.2.6.exe)
- **Linux:** [FocusDesk-96-1.2.6.AppImage](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.6/FocusDesk-96-1.2.6.AppImage)
- **Chrome / any browser:** [FocusDesk-96-Browser-2.8.zip](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.6/FocusDesk-96-Browser-2.8.zip)

**About the Chrome download:** it is the **browser version** of FocusDesk 96 saved to a folder on your computer. It is not the desktop app. Unzip it and open `index.html` in Chrome (Edge, Brave and Firefox work too). It runs offline, but it keeps your data inside the browser instead of in files, so use Control Panel → Save backup file regularly.

## What's fixed

- **Full screen.** The full-screen button, `Alt+Enter`, `F11` and the View menu now all work the same way, so you can always get out. FocusDesk also no longer starts in full screen. If you're stuck on an older version, the FAQ explains how to get out.
- **Saving.** Saving is more patient and more flexible when Windows (antivirus, OneDrive, Dropbox) holds a file for a moment. If a save ever fails, Control Panel now says which file and why, instead of a vague browser message, and a small log is kept in the data folder (`focusdesk.log`).
- **The red number on the taskbar icon** is now optional and off by default. It counted what's due, not notifications. Turn it on in Control Panel → Desktop if you like it.
- **Taskbar menu.** Right-click the FocusDesk icon on the Windows taskbar for Add a quick task, New flash card from the clipboard, Start or pause the focus timer, and Open Now Playing.
- **Boot screen.** It now waits until the window is on screen, so it's always seen.
- **Troubleshooting buttons.** Control Panel → Desktop has **Open data folder** and **Check Now Playing**. If a cover picture doesn't show up on Windows, play a song, press Check Now Playing, and send us the text it shows.

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
