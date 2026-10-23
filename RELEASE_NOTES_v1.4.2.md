# FocusDesk 96 — Desktop Edition 1.4.2

A **Minor update** (2 of 5 in cycle 1.4): the safety net. Undo, better backups, and a crash log. It includes everything from 1.4.1 and browser version 3.0.2.

## Download

- **macOS, Apple Silicon (M1 or newer):** [FocusDesk-96-1.4.2-arm64.dmg](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.4.2/FocusDesk-96-1.4.2-arm64.dmg)
- **macOS, Intel:** [FocusDesk-96-1.4.2-x64.dmg](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.4.2/FocusDesk-96-1.4.2-x64.dmg)
- **Windows:** [FocusDesk-96-Setup-1.4.2.exe](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.4.2/FocusDesk-96-Setup-1.4.2.exe)
- **Linux:** [FocusDesk-96-1.4.2.AppImage](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.4.2/FocusDesk-96-1.4.2.AppImage)
- **Chrome / any browser:** [FocusDesk-96-Browser-3.0.2.zip](https://github.com/apojidelegraphics/FocusDesk-96/releases/download/v1.4.2/FocusDesk-96-Browser-3.0.2.zip)

**About the Chrome download:** it is the **browser version** of FocusDesk 96 saved to a folder on your computer. It is not the desktop app. Unzip it and open `index.html` in Chrome (Edge, Brave and Firefox work too). It runs offline and keeps your data in the browser, so save a backup file now and then.

## What's new

- **Undo for deleting things.** Right after a delete, a small bar offers **Undo** (or press Ctrl/Cmd+Z when you're not typing). It puts the item back where it was, in its folders too. A heads-up appears if you add something you already have, like a task or a flash card with the same words. Nothing is blocked.
- **Better automatic backups** *(desktop)*. Today's backup stays up to date while FocusDesk is open and when you close it. Every backup is read back and checked after it is written. **Back up now** saves one on the spot, and Control Panel shows when the last one was made. If nearly everything is deleted by mistake, the bigger backup is kept beside it.
- **A crash log** *(desktop)*. It records what went wrong if FocusDesk crashes: error text only, with your name, folders, e-mail addresses and keys removed. **Nothing is ever sent automatically.** *Send details* only opens a draft in your browser for you to read and submit.
- **Copy backup** *(browser)* puts your whole backup on the clipboard as text. A small sign in the taskbar says whether FocusDesk works offline and that your data stays on your device.
- **The storage numbers add up** *(browser)*. The daily snapshots are now counted as copies instead of "everything else", so Notes, Pictures, Flash cards and the rest add up to your data size. A button deletes the snapshots if you need the space.
- **The empty space under the storage section is gone** (desktop and browser).
- **Updates can have more than one tag.** A Major that was released again with a fix under the same number can be MAJOR and HOTFIX.
- **Pop-outs fit their size when they open** *(BETA, Mac)*, and **Continue with Clipy from a popped-out Research window** opens Clipy's own pop-out *(BETA)*.
- **No longer BETA:** the Mac Dock number, Clipy's change-and-complete, and choosing the backup file instead of a folder.

## Good to know

- **BETA** beside a feature means it is newer and less proven. It ships to everyone, and may change or be switched off if it causes trouble.
- The pop-out fix is for a problem seen on the Mac. It couldn't be tried on a real Mac before release, so tell us if a pop-out still opens at the wrong size.
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
