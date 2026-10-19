# FocusDesk 96 — Questions and answers

Quick answers to the things people ask most. If yours isn't here, use **Control Panel → Feedback** inside the app, or [open an issue](https://github.com/apojidelegraphics/FocusDesk-96/issues/new/choose).

## Installing

### My Mac says FocusDesk 96 is "damaged and can't be opened"
It isn't damaged. macOS shows that wording for apps that haven't paid Apple for a signature, and FocusDesk 96 is an independent project. Fix it once like this:

1. Drag **FocusDesk 96** from the `.dmg` into your **Applications** folder.
2. Open **Terminal** (press `Cmd+Space`, type "Terminal", press Enter).
3. Copy and paste these two lines, pressing Enter after each:

```sh
codesign --force --deep --sign - "/Applications/FocusDesk 96.app"
xattr -cr "/Applications/FocusDesk 96.app"
```

4. Open FocusDesk 96 normally.

You need to do this again after each update, because installing a new version replaces the app.

### Which Mac download do I pick?
Click the Apple menu, then **About This Mac**. If it says **Apple M1** (or M2, M3, M4…), pick the `arm64` file. If it says **Intel**, pick the `x64` file.

### Windows says "Windows protected your PC"
That's SmartScreen, and it appears for apps without a paid certificate. Click **More info**, then **Run anyway**.

### How do I run the Linux AppImage?
Make it executable, then run it:

```sh
chmod +x FocusDesk-96-*.AppImage
./FocusDesk-96-*.AppImage
```

If it won't start, run it from a terminal once to see the message. On newer Ubuntu you may need to install `libfuse2`. For Now Playing on Linux, install `playerctl`.

### Is the "Chrome download" the desktop app?
No. The `FocusDesk-96-Browser-*.zip` is the **browser version** saved to a folder. Unzip it and open `index.html`. It works offline, but it keeps your data inside the browser instead of in files, so save a backup regularly (Control Panel → Save backup file).

### Will updating delete my data?
No. Install the new version over the old one. Your data lives in a separate folder that updates never touch.

## Your data

### Where is my data?
In the desktop app it's a plain folder on your computer:

- **macOS:** `~/Library/Application Support/FocusDesk 96/`
- **Windows:** `%APPDATA%\FocusDesk 96\`
- **Linux:** `~/.config/FocusDesk 96/`

Your notes, tasks and cards are in `data.json`. In the app, **File → Open Backups Folder** takes you to the backups.

In the **browser version**, your data lives inside your browser's storage for that site, so clearing site data erases it. Save a backup file now and then.

### How do I move to a new computer?
Pick whichever is easier.

**Copy the folder (desktop to desktop):**
1. Quit FocusDesk 96 on both computers.
2. Copy the data folder (see above) from the old computer to the same place on the new one.
3. Open the app.

**Use a backup file (works between any versions, including browser to desktop):**
1. On the old one: **Control Panel → Save backup file…**
2. Move the file to the new computer.
3. On the new one: **Control Panel → Restore from file…** and choose it.

Your assistant API keys, and a calendar feed link if you saved one, are **not** in backup files on purpose. Re-enter them, or copy `keys.json` from the data folder if you want to bring them along. Keep that file private.

### Can I add one backup to what I already have instead of replacing it?
Yes. Use **Merge from file…** instead of Restore. It adds what's missing and can bring over the backup's theme, icons, cursors and wallpaper too.

### Does it back up automatically?
The desktop app makes a backup once a day. By default it keeps the newest seven, and you can pick another folder (like Dropbox) and how many to keep in Control Panel → Desktop.

### Is my data sent anywhere?
No. FocusDesk has no servers and no accounts. It only goes online for things you ask for: your AI assistant, Research lookups, the update check, a calendar feed link you saved, Citation Maker lookups, and album covers in Now Playing.

## Using it

### My reminder or timer notifications don't show up
Check your system's notification settings for FocusDesk 96 (and that Do Not Disturb or Focus mode isn't on). In the desktop app, Control Panel → Desktop has a button that sends a test notification and tells you what it found.

### The hotkey doesn't work, or I want different keys
Another app is probably using the same keys. Control Panel → Desktop lists every shortcut with its keys, and tells you when another app has them. Press **Change…** and then the keys you want (they need Ctrl, Alt or Cmd/Win with a letter, number or F key), or **Reset** to go back. The defaults are `Cmd/Ctrl+Shift+Space` for quick capture and `Cmd/Ctrl+Shift+Y` for a flash card from what you copied. Two more can be switched on: starting or pausing the focus timer, and bringing FocusDesk to the front.

### How do I get my school calendar in?
Open **Calendar Link** and load the `.ics` file from Canvas, Infinite Campus or Apple Calendar. In the desktop app you can paste your calendar's feed link once, and FocusDesk updates itself each time it starts.

### How do I find something quickly?
Press **Ctrl+K** (Cmd+K on a Mac). It searches your notes, tasks, flash cards, assignments, events, reminders, courses and folders at once, and opens any app or action. Type `#biology` to see everything with that tag, `@BIO` for everything in a course, or `>` to see only actions.

### How do tags and courses work?
Tags are just words with a hash in front, like `#biology`, typed in a note, a task or a flash card. They work the same everywhere. A **course** is a name like "BIO 101". Give a note a course with the Course box in Notepad, and give flash cards one with the Course box in Flash Cards (or **Set deck's course** for a whole deck). Every course gets its own folder automatically, called a course hub, that collects its assignments, notes, cards and current grade.

### How do I share my notes with a study group?
In **Folders**, pick a folder (or a course hub) and press **Share file**. It saves one file with the notes, their pictures and the flash cards, and nothing about your grades. Your friends open it with **Import shared…** in their Folders. **Export zip** makes a zip of plain Markdown notes instead, for any other app.

### The update check says GitHub is limiting checks
GitHub only lets each network ask a limited number of times per hour, and a shared network (like school Wi-Fi) can use them all up. Try again later. The desktop app has a second source it tries first, so this is rare there. Control Panel → Updates shows when it last checked and what it found.

### How do I set up the AI assistant?
Open **Control Panel → Assistant**, pick a provider and paste your key. Keys stay on your computer. To keep everything on your own machine, choose the local option (M.X.E.S.) and run Ollama or LM Studio. Clipy still works without an assistant: he'll give tips and fun facts.

### What does Apple Calendar and Reminders sync do?
On a Mac, **Calendar Link** can read your Apple Calendar and Reminders and show them in FocusDesk. It only reads them; it never changes anything. macOS asks for permission the first time. This is new, so please tell us if something doesn't show up.

## Still stuck?

Use **Control Panel → Feedback** in the app. It opens a pre-filled GitHub page, and you can read exactly what it includes first. Or [open an issue](https://github.com/apojidelegraphics/FocusDesk-96/issues/new/choose) directly.
