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
The desktop app makes a backup file for every day. Today's file is kept up to date while FocusDesk is open and when you close it, so each day's file holds how that day ended. Every backup is read back and checked after it is written, and **Back up now** (Control Panel → Desktop) makes one on the spot. By default it keeps the newest seven, and you can pick another folder (like Dropbox) and how many to keep. If that folder can't be reached (an unplugged drive, say), the backup goes to the default folder and Control Panel says so. If nearly everything is deleted by mistake, the bigger backup is kept beside it as `...-before-shrink.json`.

The browser version keeps up to seven daily snapshots inside the browser, which doesn't replace a backup file. Use **Save backup file** or **Copy backup**.

### Can I undo a delete?
Yes. Right after you delete something, a small bar offers **Undo** for about ten seconds (or press Ctrl/Cmd+Z when you're not typing). It puts the item back where it was, in its folders too. After that, it is still in the Recycle Bin until you empty it.

### Why did it say I already have something?
When you add a task, flash card, calendar event, reminder or assignment that matches one you already have, a bar tells you. Nothing is blocked. Press **Undo** on the bar to take the new one back, or ignore it to keep both.

### What is the crash log, and is it sent anywhere?
It is a small file (`crash.log`, in the data folder) that records what went wrong if FocusDesk crashes or hits an error, so a problem can be explained later. It holds error text only. Your notes and tasks are never in it, and your name, folders, e-mail addresses and keys are removed before anything is written. **Nothing is sent automatically.** In Control Panel → Desktop you can view it, copy it, or choose **Send details**, which opens a draft issue on GitHub in your browser. Nothing goes to GitHub until you read it and press Submit there.

### What does the "Works offline" sign in the taskbar mean?
(Browser version.) It says the page can open without internet, and that your notes, tasks and settings are stored only on this device. It only says "Works offline" when that's true: when you run the downloaded folder, or when the website has saved itself in your browser. Otherwise it says "Data stays here". Click it for the details.

### Is my data sent anywhere?
No. FocusDesk has no servers and no accounts. It only goes online for things you ask for: your AI assistant, Research lookups, the update check, a calendar feed link you saved, Citation Maker lookups, and album covers in Now Playing.

## Using it

### My reminder or timer notifications don't show up
Check your system's notification settings for FocusDesk 96 (and that Do Not Disturb or Focus mode isn't on). In the desktop app, Control Panel → Desktop has a button that sends a test notification and tells you what it found.

### Why is the start-up screen silver in version 3?
Version 3 of the browser version comes with a silver start-up screen. Everything else works the same. You can press any key (or click) to skip the start-up screen.

### I use FocusDesk in two browser tabs. Is that safe?
Yes, from version 3.0. Changes made in either tab are merged, so one tab no longer overwrites the other. (If you change the very same item in both at once, the newer change wins.)

### Citation Maker says an address "is on your own network"
Looking up a web page is only allowed for public websites. Addresses that point at your own computer or network (like `localhost` or `192.168.x.x`) are blocked on purpose, so a link can never be used to reach your private devices. Type the details in by hand for pages like that.

### Chrome says "can't open this folder because it contains system files"
That is Chrome's rule, and FocusDesk can't change it. Chrome won't let a website open Desktop, Documents, Downloads, the top of iCloud Drive or Dropbox, or any folder with system files in it. The way around it: make a **new** folder inside iCloud Drive or Dropbox (for example "FocusDesk Backups"), point the desktop app at that folder (Control Panel, Desktop, Daily backups, Choose folder), and choose the same folder in the browser version. Or press "Choose the backup file instead" (BETA) and pick `focusdesk-latest.json` from that folder. The same help is in Control Panel, under Desktop backups folder.

### What do the colours in the storage bar mean?
The bar shows where your browser's space is going: Notes, Pictures, Flash cards, everything else in FocusDesk, restore points and copies, and anything else stored on the same web address. Restore points are an automatic copy of your data that is refreshed about once an hour, and the browser also keeps up to seven daily snapshots; both count as copies and can be large. You can delete the restore point or the daily snapshots from Control Panel if space is tight. "Data size" counts only your own data, and Notes, Pictures, Flash cards and everything else add up to it.

### Can Clipy change or complete things I already have?
Yes. Ask it, for example, to move your study group to Saturday or to mark chapter 3 done. It always shows what it wants to change and waits for you to say yes, even if "Add things without asking" is on, and Undo puts everything back. It only touches things you made by hand (or that Clipy made). It leaves repeating items alone, and anything that comes from Apple, Canvas or a calendar feed, because the next sync would just undo the change. You can switch it off in Clipy's menu.

### What do the tags like MINOR and BETA mean?
Every update has a tag shown beside its version number, as a small label (for example MINOR next to 1.4.1). The tag is separate: it is never part of the number.
- **MAJOR** (like 1.5): starts a new cycle of updates.
- **MINOR** (like 1.5.1): a small update with one theme. There are five Minor updates after each Major.
- **STABILITY**: the fifth Minor of every cycle. No new features, only fixes, speed and safety checks.
- **HOTFIX**: an urgent fix for something serious. It ships as soon as it's tested and doesn't count toward the five.
- **BETA**: an extra tag for an update that is still being tried out. The automatic updater skips betas, so you only get one if you download it yourself. The number stays the same when the beta becomes final.
- **BETA beside a single feature**: that one feature is newer and less proven. It comes in a finished update that everyone gets, and may change or be switched off if it causes trouble. The tag comes off once it has proved itself.

The desktop app and the browser version each have their own number, and they move together: desktop 1.4.1 comes with browser 3.0.1. The update schedule page shows what is coming next and updates itself when a release is published.

### Does FocusDesk update itself?
On **Windows and Linux**, yes, from version 1.3.2. In Control Panel → Updates you choose: **install it automatically**, **ask me first**, or **just tell me**. Automatic updates download in the background and install when you close FocusDesk (or when you press Restart now). If an update ever fails, FocusDesk falls back to telling you and linking to the download. Version 1.3.1 and older can't update themselves, so install 1.3.2 by hand once. On a **Mac**, FocusDesk tells you when an update is out and links to the download, because Apple's signing isn't paid for yet.

### Where can I see when the next update is coming?
Control Panel → Updates → **See the update schedule**, or https://apojidelegraphics.github.io/FocusDesk-96/roadmap.html

### Can I undo something Clipy added?
Yes. Right after Clipy adds something, an **Undo** button appears in the chat. It removes exactly what Clipy just added. Press **Keep it** (or just carry on chatting) to dismiss it. Clipy can also make flash cards: try "make a card: capital of France is Paris".

### The website says a new version is ready
That's the bar the website shows when a newer version has been published. Press **Reload** (it saves first). If you used the browser zip instead, the update checker in Control Panel tells you.

### Can Clipy add things for me?
Yes. Ask in the chat, like "remind me to call mum tomorrow at 9", "add a study group on Friday at 3" or "my lab report is due on the 14th". Clipy shows what it wants to add, and you press **Add** or **Skip**. If Clipy needs a date or time, it asks. Clipy's menu has **Add things without asking** if you'd rather skip the question. What Clipy adds shows up in the Calendar, Tasks, Reminders and Assignment Planner like anything else. On a Mac, Calendar Link has **Also write what Clipy adds for me** to send those to Apple Calendar and Reminders too (it's off until you turn it on, and Apple writing itself has to be on).

### Clipy keeps adding things I didn't ask for
Clipy only adds something when you clearly ask. If you'd like to be sure, leave **Add things without asking** off (it is by default), so every item waits for your Add.

### Clipy gave me a lot of tips one after another
That was a mistake in 1.3.0 when a pop-out window was open. It's fixed in 1.3.1. Tips are now at least a few minutes apart, and you can turn them off in Clipy's menu.

### How do I open an app in its own window?
Use **File > Pop Out App** in the menu bar (or **Pop out an app** from the tray icon), or press the small arrow in an app's title bar. On Windows with the slim title bar, the menu is behind the three dots at the top left.

### The storage bar in the browser looked wrong
Browsers allow different amounts and count them differently, so the bar used to guess. From version 2.9 it measures how much your browser really allows, and shows "at least" when there's more than it needs to check. Measuring takes a moment when you open Control Panel.

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
