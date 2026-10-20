# FocusDesk 96 — Desktop Edition 1.2.1

Full LaTeX, assignments in your menu bar, and fixes that make everything feel smoother. It includes everything from 1.2.0 and browser version 2.7.2.

## Download

- **macOS, Apple Silicon (M1 or newer):** [FocusDesk-96-1.2.1-arm64.dmg](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.1/FocusDesk-96-1.2.1-arm64.dmg)
- **macOS, Intel:** [FocusDesk-96-1.2.1-x64.dmg](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.1/FocusDesk-96-1.2.1-x64.dmg)
- **Windows:** [FocusDesk-96-Setup-1.2.1.exe](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.1/FocusDesk-96-Setup-1.2.1.exe)
- **Linux:** [FocusDesk-96-1.2.1.AppImage](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.1/FocusDesk-96-1.2.1.AppImage)
- **Chrome / any browser:** [FocusDesk-96-Browser-2.7.2.zip](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.1/FocusDesk-96-Browser-2.7.2.zip)

**About the Chrome download:** it is the **browser version** of FocusDesk 96 saved to a folder on your computer. It is not the desktop app. Unzip it and open `index.html` in Chrome (Edge, Brave and Firefox work too). It runs offline, but it keeps your data inside the browser instead of in files, so use Control Panel → Save backup file regularly.

## What's new in the desktop version

- **Full LaTeX.** Math is now drawn by KaTeX, bundled inside the app and working offline. Boxed and cancelled terms, aligned multi-line equations, arrays, colours, and chemistry with `\ce{2H2 + O2 -> 2H2O}`. If it ever can't load, FocusDesk falls back to its built-in renderer.
- **Assignments in your menu bar.** The tray / menu bar menu now lists the assignments due today. Open the submenu to see each title, course and time, and jump to the Assignment Planner.
- **Overdue switch.** Control Panel → Desktop has a new option to include overdue tasks and assignments in that menu. It also drives the taskbar badge on Windows.

## What's new from browser version 2.7.2

- **Merge keeps your look.** When you merge a backup, you can bring over its theme, icons, cursors and wallpaper too. The box is ticked automatically when your own look is still the default. Pictures, focus sessions and badges from the backup now merge in as well.
- **Offline marker.** Clipy and Control Panel show when an assistant can't be reached, whether you're offline or the provider can't be contacted. Local models are not affected.
- **Clipy greets you.** "Hey, I'm Clipy. Ask me anything about your schedule, what's due, or just say hi." is always the first message, even in a new chat.
- **Smoother feel.** Dialogs and menus ease in, keyboard focus is clearer, and the "can't connect" message now says what actually happened.

## First launch

These builds are unsigned. That's normal for indie software and doesn't mean anything is wrong.

**macOS:** drag FocusDesk 96 to Applications, then open Terminal and run these two commands:

```
codesign --force --deep --sign - "/Applications/FocusDesk 96.app"
xattr -cr "/Applications/FocusDesk 96.app"
```

Then open the app normally. You need to do this again after each update.

**Windows:** if SmartScreen appears, click **More info**, then **Run anyway**.

**Linux:** make the file executable with `chmod +x FocusDesk-96-1.2.1.AppImage`, then run it.

## Updating

Install over your current copy. Your data lives in a separate folder and is kept.

## Good to know

- Silent auto-update isn't included yet. The update checker tells you when a new version is out and links to the download.
- The quick capture hotkey can't be registered if another app already uses it. Control Panel → Desktop tells you.
