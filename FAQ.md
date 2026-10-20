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

### How do I get FocusDesk items into Apple Calendar and Reminders? (Mac)
Open **Calendar Link**, then the Apple Calendar and Reminders section, and tick **Write FocusDesk items to Apple Calendar and Reminders**. macOS asks for permission. FocusDesk makes a calendar and a Reminders list called "FocusDesk" and changes only those. You choose what goes in: events, assignments (as due dates), reminders, and tasks with a due date. Things that came from Apple, Canvas or a calendar feed are never sent back. Tick a reminder off on your iPhone and it ticks off in FocusDesk. If you delete something in Apple, FocusDesk puts it back, because FocusDesk keeps the master copy. Turning a kind off stops updating it; what's already in Apple stays.

### It says the Apple Calendar helper didn't build
The Mac helper programs are built when the app is built. If one fails, the app shows the reason in that feature's message instead of silently doing nothing, and the other helpers still work. Send us that message with your feedback.

### What is the Apple model option in M.X.E.S.?
On a Mac with Apple Intelligence and macOS 26 or newer, Control Panel → Assistant → M.X.E.S. engine lets you use Apple's on-device model. Nothing leaves your Mac and you don't need a server. Press Check to see whether it's ready.

### How do I pop an app out into its own window?
Press the small arrow button in the app's title bar (in the desktop app). The app moves into a real window you can drag to another screen. Changes in either window show up in the other, and if you change the same thing in both at once, the newer change wins. Closing the main window closes the pop-outs.

### Can the browser version load my desktop backups?
In Chrome, Edge or Brave: set the desktop app's backup folder to one in iCloud Drive (Control Panel → Desktop), turn on "Keep a copy of your newest data in the backup folder", then in the browser version open Control Panel → Desktop backups folder → Choose folder. It offers the newest copy when the page opens, and asks first if you've changed things in the browser. Safari and Firefox can't open folders this way; use Restore from file instead.

### Why does Now Playing sometimes have no cover picture?
Some players and browser tabs don't give one. In Control Panel → Desktop you can turn on a lookup that finds a cover by song and artist from Apple's public music search. It's off by default because it sends the title and artist to Apple.

### It says my saved data couldn't be read, or my theme and notes are gone after updating
This was a mistake in browser versions 2.7.5 and 2.8 and desktop versions 1.2.5 and 1.2.6, fixed in 2.8.1 and 1.2.7. Your data wasn't deleted. Update first, then:

- **Website or browser version:** open Control Panel → Backup and press **Recover set-aside copy…** (the message also has a **Try to recover it** button). If it isn't there, try **Recover last restore point**.
- **Desktop app:** open Control Panel → Desktop → **Open data folder**, then the `backups` folder. Each day's first launch saves a dated copy. Quit FocusDesk, copy the newest dated file from before the problem over `data.json` in the main folder, and start FocusDesk again. If Control Panel shows **Recover set-aside copy…**, use that first.

### FocusDesk is stuck in full screen (Windows)
Update to 1.2.6, where the full-screen button, `Alt+Enter`, `F11` and the View menu all agree. On an older version, quit FocusDesk, open `%APPDATA%\FocusDesk 96\window-state.json` in Notepad, change `"fullScreen": true` to `"fullScreen": false`, and save it.

### The taskbar icon shows a number, and I have no notifications
That red number counts what's due (flash cards, tasks and assignments, including overdue ones), not system notifications. In 1.2.6 it's off by default. You can turn it on in Control Panel → Desktop → "Show a red number on the taskbar icon".

### It says "Couldn't save" or "Not saving"
Control Panel → Storage now tells you which file couldn't be saved and why, and **Open data folder** (Control Panel → Desktop) takes you to your files. Save a backup file straight away (Control Panel → Save backup file). Antivirus and cloud-sync tools sometimes lock files for a moment, and FocusDesk 1.2.6 is much more patient with them. If it keeps happening, send us `focusdesk.log` from the data folder (check it for anything private first).

### Now Playing doesn't show the cover (or the song)
Play something first, then press **Check Now Playing** in Control Panel → Desktop. It shows what your computer told FocusDesk. If the cover is missing, copy that text and send it with your feedback.

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
