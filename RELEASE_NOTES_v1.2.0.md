# FocusDesk 96 — Desktop Edition 1.2.0

A bigger update: a mini timer, an Ask Clipy window, your choice of backup folder, and more. It includes everything from 1.1.x and browser version 2.7.1.

## Download

- **macOS, Apple Silicon (M1 or newer):** [FocusDesk-96-1.2.0-arm64.dmg](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.0/FocusDesk-96-1.2.0-arm64.dmg)
- **macOS, Intel:** [FocusDesk-96-1.2.0-x64.dmg](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.0/FocusDesk-96-1.2.0-x64.dmg)
- **Windows:** [FocusDesk-96-Setup-1.2.0.exe](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.0/FocusDesk-96-Setup-1.2.0.exe)
- **Linux:** [FocusDesk-96-1.2.0.AppImage](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.0/FocusDesk-96-1.2.0.AppImage)
- **Chrome / any browser:** [FocusDesk-96-Browser-2.7.1.zip](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.0/FocusDesk-96-Browser-2.7.1.zip)

**About the Chrome download:** it is the **browser version** of FocusDesk 96 saved to a folder on your computer. It is not the desktop app. Unzip it and open `index.html` in Chrome (Edge, Brave and Firefox work too). It runs offline, but it keeps your data inside the browser instead of in files, so use Control Panel → Save backup file regularly.

## What's new in the desktop version

- **Mini timer.** A small always-on-top focus timer you can drag to any screen. Open it from the Timer menu, the tray, or Control Panel → Desktop. It remembers where you put it.
- **Ask Clipy.** Press the quick capture hotkey, switch to the Ask tab and type a question. Clipy opens in its own always-on-top window: the same Clipy you get from the corner, with all of its buttons (Word of the day, Fun fact, Tip, What's due?, Plan my week and more), so you can chat while you work. You can also open it from the File menu or the tray.
- **Choose your backup folder.** Send daily backups to Dropbox, iCloud Drive or anywhere else, and keep the last 7, 14, 30 or all of them.
- **Due counts.** The tray menu shows how many cards and tasks are due. On Windows the taskbar icon gets a badge. On Mac nothing shows until you click the menu bar icon.
- **More menus.** New Note, Save Backup Now, a Go menu for every app, a Timer menu, Check for Updates, Terms of Use and Report an Issue.
- **Notifications fixed.** They now use a proper Windows identity, show even while FocusDesk is in front (you can turn that off), and there is a Send test notification button.
- **Windows menu.** File, Edit, View and Help now live behind a ⋯ button in a slim title bar.

## What's new from browser version 2.7.1

- **Edit cards.** Edit cloze and image-occlusion cards. Cards you keep keep their review history.
- **Add Image button** in Notepad, alongside paste and drop.
- **More LaTeX.** Multi-line equations (aligned, align, gather, split), `\substack`, and cleaner integral limits.
- **Habit Breaker.** Change a quit date, keep a note for each habit, and see which weekdays you slip on.
- **Control Panel.** About now describes where you are running FocusDesk, and an optional update check can run when FocusDesk starts.

## First launch

These builds are unsigned. That's normal for indie software and doesn't mean anything is wrong.

**macOS:** drag FocusDesk 96 to Applications, then open Terminal and run these two commands:

```
codesign --force --deep --sign - "/Applications/FocusDesk 96.app"
xattr -cr "/Applications/FocusDesk 96.app"
```

Then open the app normally. You need to do this again after each update.

**Windows:** if SmartScreen appears, click **More info**, then **Run anyway**.

**Linux:** make the file executable with `chmod +x FocusDesk-96-1.2.0.AppImage`, then run it.

## Updating

Install over your current copy. Your data lives in a separate folder and is kept.

## Good to know

- The quick capture hotkey can't be registered if another app already uses it. Control Panel → Desktop tells you.
- Some Linux desktops (GNOME without an extension, or Wayland) don't show tray icons or allow global hotkeys. FocusDesk still works without them.
- Silent auto-update isn't included yet. The update checker tells you when a new version is out and links to the download.
