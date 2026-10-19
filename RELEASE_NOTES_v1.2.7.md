# FocusDesk 96 — Desktop Edition 1.2.7

An important fix. It includes everything from 1.2.x and browser version 2.8.1.

## Download

- **macOS, Apple Silicon (M1 or newer):** [FocusDesk-96-1.2.7-arm64.dmg](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.7/FocusDesk-96-1.2.7-arm64.dmg)
- **macOS, Intel:** [FocusDesk-96-1.2.7-x64.dmg](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.7/FocusDesk-96-1.2.7-x64.dmg)
- **Windows:** [FocusDesk-96-Setup-1.2.7.exe](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.7/FocusDesk-96-Setup-1.2.7.exe)
- **Linux:** [FocusDesk-96-1.2.7.AppImage](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.7/FocusDesk-96-1.2.7.AppImage)
- **Chrome / any browser:** [FocusDesk-96-Browser-2.8.1.zip](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.7/FocusDesk-96-Browser-2.8.1.zip)

**About the Chrome download:** it is the **browser version** of FocusDesk 96 saved to a folder on your computer. It is not the desktop app. Unzip it and open `index.html` in Chrome (Edge, Brave and Firefox work too). It runs offline, but it keeps your data inside the browser instead of in files, so use Control Panel → Save backup file regularly.

## What's fixed

**Saved data wasn't read after an update.** If you had saved folders or structured citations, FocusDesk 2.7.5, 2.8 and desktop 1.2.5 and 1.2.6 could fail to read your saved data the next time they opened. They then started with the default look (wrong theme and icon colours, empty lists), showed "Your saved data couldn't be read", or showed a "Not saving" message in Control Panel. This was a mistake in how the program started up, not damage to your data.

**If this happened to you, update first, then:**

- **Browser or website:** Control Panel → Backup → **Recover set-aside copy…** (or press **Try to recover it** in the message). **Recover last restore point** is a second option.
- **Desktop app:** the old versions could save the empty start-up state over `data.json`. Your daily backups are in the `backups` folder (Control Panel → Desktop → **Open data folder**). Quit FocusDesk, copy the newest dated file from before the problem over `data.json`, and start it again. The new **Recover set-aside copy…** button helps in some cases too.

**New safety nets:**

- If saved data can't be read, the message now has a **Try to recover it** button, and the desktop app keeps a copy instead of writing over it.
- Every build now runs an automatic check that stops this kind of start-up mistake before it can be released.

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
