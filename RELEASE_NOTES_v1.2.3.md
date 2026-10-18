# FocusDesk 96 — Desktop Edition 1.2.3

Apple Calendar and Reminders on Mac, a scrub bar for Now Playing, and a much bigger Periodic Table. It includes everything from 1.2.x and browser version 2.7.4.

## Download

- **macOS, Apple Silicon (M1 or newer):** [FocusDesk-96-1.2.3-arm64.dmg](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.3/FocusDesk-96-1.2.3-arm64.dmg)
- **macOS, Intel:** [FocusDesk-96-1.2.3-x64.dmg](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.3/FocusDesk-96-1.2.3-x64.dmg)
- **Windows:** [FocusDesk-96-Setup-1.2.3.exe](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.3/FocusDesk-96-Setup-1.2.3.exe)
- **Linux:** [FocusDesk-96-1.2.3.AppImage](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.3/FocusDesk-96-1.2.3.AppImage)
- **Chrome / any browser:** [FocusDesk-96-Browser-2.7.4.zip](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.2.3/FocusDesk-96-Browser-2.7.4.zip)

**About the Chrome download:** it is the **browser version** of FocusDesk 96 saved to a folder on your computer. It is not the desktop app. Unzip it and open `index.html` in Chrome (Edge, Brave and Firefox work too). It runs offline, but it keeps your data inside the browser instead of in files, so use Control Panel → Save backup file regularly.

## What's new in the desktop version

- **Apple Calendar and Reminders (Mac).** In Calendar Link, choose which Apple calendars and Reminders lists to follow. FocusDesk mirrors them into your calendar and Tasks and refreshes them each time you sync, or when FocusDesk starts if you turn that on. It only **reads**; it never changes anything in Apple Calendar or Reminders. macOS asks for permission the first time. If you finish a reminder in FocusDesk it stays finished there.
- **Scrub bar in Now Playing.** See how far into the song you are and drag to jump. It works with Spotify and Apple Music on Mac, any player on Linux (through `playerctl`), and the system media controls on Windows. Streams with no length simply show a greyed-out bar.

## What's new from browser version 2.7.4

- **Periodic Table 2.0.** A complete table (periods 6 and 7 and the lanthanides and actinides were missing before). Click an element for its configuration, melting and boiling points, density, oxidation states and more. Switch the colours to electronegativity, radius, ionization energy, density, melting or boiling point, or drag the temperature slider and watch elements melt and boil. It also has a molar mass calculator (try `Ca(OH)2` or `CuSO4·5H2O`), a 10-question quiz, and a button that turns the elements into flash cards.
- **A calendar on the taskbar clock.** Click the clock: days with something to do get a dot (classes don't count), click a day to see what's on it, and your focus timer and countdowns sit underneath.
- **Install the website as an app.** In Chrome or Edge you can install the website version, and it keeps working offline after your first visit.

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

- Apple Calendar and Reminders are new in this version. If something doesn't show up, use Control Panel → Feedback and tell us what you chose and what you saw.
- Silent auto-update isn't included yet. The update checker tells you when a new version is out and links to the download.
