# FocusDesk 96 — Desktop Edition 1.4.3

A **Minor update** (3 of 5 in cycle 1.4): find things faster. Search shortcuts, a weekly recap from Clipy, a shortcut list, recent apps and a one-key timer. It includes everything from 1.4.2 and browser version 3.0.3.

## Download

- **macOS, Apple Silicon (M1 or newer):** [FocusDesk-96-1.4.3-arm64.dmg](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.4.3/FocusDesk-96-1.4.3-arm64.dmg)
- **macOS, Intel:** [FocusDesk-96-1.4.3-x64.dmg](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.4.3/FocusDesk-96-1.4.3-x64.dmg)
- **Windows:** [FocusDesk-96-Setup-1.4.3.exe](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.4.3/FocusDesk-96-Setup-1.4.3.exe)
- **Linux:** [FocusDesk-96-1.4.3.AppImage](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.4.3/FocusDesk-96-1.4.3.AppImage)
- **Chrome / any browser:** [FocusDesk-96-Browser-3.0.3.zip](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.4.3/FocusDesk-96-Browser-3.0.3.zip)

**About the Chrome download:** it is the **browser version** of FocusDesk 96 saved to a folder on your computer. It is not the desktop app. Unzip it and open `index.html` in Chrome (Edge, Brave and Firefox work too). It runs offline and keeps your data in the browser, so save a backup file now and then.

## What's new

- **Search shortcuts.** In the search (Ctrl/Cmd+K) and in Find, type `tag:bio`, `folder:Notes`, `course:ENG` (or `@ENG`), `@today`, `@tomorrow`, `@week`, `@overdue`, `is:open`, `is:done` or `type:task`, and mix them with words: `tag:bio @week exam`. Put quotes around a name with spaces: `folder:"Biology 101"`. `@overdue` means not finished and due before today.
- **"What did I do this week?"**, answered by Clipy. Press the **My week** chip. It looks at the last 7 days: focus time and labels, habits, notes you wrote, tasks and assignments you finished, and events that took place, and writes a short recap. With no assistant chosen you still see the facts. Only the titles (never the contents of your notes) are sent to your assistant, and only when you press it. Tasks and assignments are timestamped from this version on, so older weeks won't list what you finished, and flash card reviews aren't counted by day.
- **A keyboard shortcut list** (Ctrl/Cmd+/), **recent apps** in the Start menu (the last four you used), and **T**, one key that starts a 25-minute focus timer when you aren't typing (press it again to pause and resume; there's a switch for it in the list).
- **Clipy no longer adds events or tasks unless you ask.** It now only adds things when your own message asks for it, asks "Want me to add that?" instead of adding on its own, and a request that came out broken is never shown in the chat. New chat also clears an offer that was still waiting.
- **Shut Down closes the app** *(desktop)*. Start, Shut Down, Yes shows the "safe to turn off" screen and then closes FocusDesk, after saving your data and making a last backup. Click the screen quickly to change your mind.
- **Update notes** now show the tagline, tags, BETA and date, and only the features for the version you use (one entry covers a desktop version and its matching browser version).
- **A fix:** the focus timer now records the real length of each finished session in your stats (it used to record your configured length).

## Good to know

- **BETA** beside a feature means it is newer and less proven. Nothing in this release is BETA.
- The pop-out sizing fix from 1.4.2 is still BETA and still unconfirmed on a real Mac.
- The update schedule is at https://apojidelegraphics.github.io/FocusDesk-96/roadmap.html
- Windows and Linux copies can install this update by themselves (Control Panel → Updates chooses how). A Mac tells you and links to the download.

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
