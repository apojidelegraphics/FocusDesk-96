# FocusDesk 96 — Desktop Edition 1.3.1

Clipy can add things for you, plus pop-out fixes. It includes everything from 1.3.x and browser version 2.9.

## Download

- **macOS, Apple Silicon (M1 or newer):** [FocusDesk-96-1.3.1-arm64.dmg](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.3.1/FocusDesk-96-1.3.1-arm64.dmg)
- **macOS, Intel:** [FocusDesk-96-1.3.1-x64.dmg](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.3.1/FocusDesk-96-1.3.1-x64.dmg)
- **Windows:** [FocusDesk-96-Setup-1.3.1.exe](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.3.1/FocusDesk-96-Setup-1.3.1.exe)
- **Linux:** [FocusDesk-96-1.3.1.AppImage](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.3.1/FocusDesk-96-1.3.1.AppImage)
- **Chrome / any browser:** [FocusDesk-96-Browser-2.9.zip](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.3.1/FocusDesk-96-Browser-2.9.zip)

**About the Chrome download:** it is the **browser version** of FocusDesk 96 saved to a folder on your computer. It is not the desktop app. Unzip it and open `index.html` in Chrome (Edge, Brave and Firefox work too). It runs offline, but it keeps your data inside the browser instead of in files, so use Control Panel → Save backup file regularly.

## What's new

- **Clipy can add things.** Ask in the chat: "remind me to call mum tomorrow at 9", "add a study group on Friday at 3", "my lab report is due on the 14th". Clipy shows what it wants to add and you press **Add** or **Skip**. If Clipy needs a date or time, it asks. In Clipy's menu, **Add things without asking** skips the question (off by default).
- **Write Clipy's items to Apple Calendar (Mac).** In Calendar Link, **Also write what Clipy adds for me** sends them to Apple Calendar and Reminders too. It's off until you turn it on, and Apple writing has to be on as well.
- **Open any app in its own window from the menu.** **File > Pop Out App**, or **Pop out an app** from the tray icon.
- **Tidier pop-outs.** No more desktop strip at the bottom of a popped-out app, and on Windows the title bar now matches the main window.
- **Fixed:** Clipy giving tips and fun facts one after another when a pop-out window was open. Tips are now always a few minutes apart.
- **Browser version 2.9:** the storage bar in Control Panel now measures how much your browser really allows, so it's accurate in Chrome, Firefox, Safari and Edge.

## Good to know

- Clipy only adds something when you clearly ask. What it adds appears in the Calendar, Tasks, Reminders and Assignment Planner like anything else.
- Next up: a stability release (1.4), and the schedule is on the update schedule page: https://apojidelegraphics.github.io/FocusDesk-96/roadmap.html
- Silent auto-update for Windows and Linux is still planned but not scheduled yet.

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
