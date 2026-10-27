# TERMS, AGREEMENTS, AND LICENSING FOR FOCUSDESK 96

**Effective Date:** October 16, 2026
**Publisher:** Apoji Delegraphics
**Designed by:** Apoji Studios

This document governs the use, development, and distribution of Apoji Delegraphics' FocusDesk 96 study and productivity software, including the Desktop Edition (Version 1.4.1), the Browser Edition (Version 2.8), and the downloadable Browser zip. The source code is licensed separately under the MIT License (see the `LICENSE` file); where this document and `LICENSE` differ about the source code, `LICENSE` controls.

---

## PART I: GENERAL TERMS AND CONDITIONS OF USE

### 1. Scope and Acceptance

**1.1. Products Covered**

These General Terms and Conditions ("T&C") apply to all users accessing or utilizing the following products (collectively, the "Products"):

* a. **FocusDesk 96 Desktop Edition, Version 1.4.3**, the native application for macOS, Windows, and Linux, including quick capture, native notifications, the tray or menu bar icon, the mini timer, the Ask Clipy window, and the title-bar menu on Windows.
* b. **FocusDesk 96 Browser Edition, Version 3.0.3**, the version that runs in a web browser, including copies saved to your own computer (the "Browser zip").
* c. **The FocusDesk 96 feature set**, consisting of: Habit Breaker, Achievements, the focus session log, LaTeX and image support in notes and flash cards, cloze and image-occlusion flash cards, the grade what-if projection, and the other apps in the Start menu.

**1.2. Acceptance**

By downloading, installing, or using any of the Products, the user ("User" or "You") agrees to be bound by these T&C and any specialized terms that apply to the Edition You use (Part II for Desktop, Part III for Browser and development).

### 2. Intellectual Property and Licensing

**2.1. Source Code**

The FocusDesk 96 source code is released under the MIT License. You may use, copy, modify, merge, publish, distribute, sublicense, and sell copies of it, provided the copyright notice and license text are kept with it.

**2.2. Brand Assets**

The names "FocusDesk 96," "Apoji Studios," and "Apoji Delegraphics," together with the Apoji logo and the application icon, identify the Products and their publisher. The MIT License covers the code; it does not grant You the right to use these names or logos to name or promote a different product, or to suggest that a modified copy is made or endorsed by Apoji Delegraphics or Apoji Studios.

**2.3. Third-Party Services**

Some features connect to third-party services at Your request (see Section 3.4). Those services belong to their owners and are governed by their own terms.

### 3. Your Data, Privacy, and Safety Standards

**3.1. Local-First Data**

FocusDesk 96 has no accounts and no server of its own. Your notes, tasks, cards, settings, and every other piece of data You create stay on Your device. The Desktop Edition keeps them as plain files in the folder named in Part II, Section 4.4. The Browser Edition keeps them in Your web browser's own storage.

**3.2. Backups Are Your Responsibility**

Because Your data lives only on Your device, no copy exists anywhere else unless You make one. The Desktop Edition writes automatic daily backups (by default the newest seven are kept), keeps today's backup up to date while it is open, and checks each backup after writing it; it cannot protect You if the whole device and the backup folder are lost. The Browser Edition keeps up to seven daily snapshots inside the browser's own storage, which is erased with Your site data, so it does not replace a backup file; You should use Control Panel, then Save backup file (or Copy backup, which puts the backup text on Your clipboard when You press the button), regularly. Clearing Your browser's site data, deleting the data folder, or losing Your device can permanently erase Your data.

**3.3. API Keys**

If You add an API key for an AI assistant provider, it is stored on Your device. In the Desktop Edition it is stored **unencrypted** in `keys.json` in the data folder, separate from `data.json` so You can share Your data without sharing Your keys. You are responsible for keeping that file private. A calendar feed link You save in the Desktop Edition is kept in the same file, because such links work like passwords.

**3.4. Network Connections**

The Products contain no advertising and no analytics or tracking code. They can make the following connections, and only for the purposes described:

* a. **Update checks.** The Desktop Edition asks `api.github.com` for the latest release when it starts (at most once every twelve hours) unless You turn this off in Control Panel. The Browser Edition does this only when You click the button, or when You turn on automatic checks (off by default) in a copy saved to Your computer.
* b. **Lookups You request.** The dictionary and thesaurus (Datamuse, Wiktionary), the Research app (Wikipedia, Open Library, DuckDuckGo), and links that open in Your browser (such as search engines and study sites) contact those services when You use them.
* c. **AI assistant.** If You configure an assistant, the text You send (including questions typed into the Ask tab of quick capture or the Clipy window, and the study context FocusDesk adds to them, such as what is due) is transmitted to the provider You chose (such as OpenRouter, OpenAI, Google, DeepSeek, or Anthropic) under that provider's terms, or to a local model running on Your own computer (such as Ollama or LM Studio).
* d. **Calendar feed (Desktop Edition).** If You save a calendar link in Calendar Link, FocusDesk downloads that link when You press Sync and, unless You turn it off, when it starts. Only `https://` and `webcal://` links are used.
* e. **Feedback.** The buttons in Control Panel open a pre-filled page on GitHub in Your web browser. FocusDesk sends nothing itself; nothing is submitted unless You press Submit on GitHub.
* f. **Album covers (Desktop Edition).** When the Now Playing pill shows a cover, FocusDesk may download that one image from the music service's own image server (for example Spotify's) once per song. Covers your player has already saved on Your computer are read directly. FocusDesk only accepts real image files from a short list of known image servers.

You can use the Products without any of these connections.

**3.5. Responsible Use**

The grade calculator, GPA projection, and study statistics are planning aids. They are estimates based on what You enter, not official results. Do not rely on them for decisions that require verified figures.

---

## PART II: DESKTOP EDITION AGREEMENT

This Part applies to the Desktop Edition (Version 1.4.3).

### 4. Installation, Builds, and Data Location

**4.1. Unsigned Builds**

The installers are not code-signed or notarized. Your operating system may warn You on first launch (for example macOS Gatekeeper or Windows SmartScreen). This is expected for independent software and is not by itself a sign of a problem.

**4.2. Operational Acknowledgement**

You acknowledge that on macOS You may need to run the commands published in the release notes (`codesign` and `xattr`) on Your own copy of the application to open it, and that You may need to run them again after each update. You run them at Your own discretion and on Your own device.

**4.3. Desktop Features and Permissions**

The following features are controlled by You in Control Panel, then Desktop, and can be turned off:

* a. **Native notifications** for reminders and finished focus sessions, shown by Your operating system and subject to its Do Not Disturb settings.
* b. **The quick capture hotkey** (`Cmd+Shift+Space` on macOS, `Ctrl+Shift+Space` on Windows and Linux), a global shortcut that opens a capture window from any application.
* c. **The tray or menu bar icon,** and the option to keep the application running there when You close the window.
* d. **Open at login,** and the option to start hidden.
* e. **The mini timer** and **Ask Clipy** windows, which stay on top of other windows until You close them.
* f. **Due counts** for cards, tasks and assignments (including a list of assignment titles and times, and, if You leave it on, overdue items), shown in the tray or menu bar menu and, on Windows, as a badge on the taskbar icon. They are calculated on Your device and are not sent anywhere.
* g. **Now Playing.** The Now Playing pill reads the title, artist and cover of the song playing on Your computer (through Your system's media controls, through AppleScript for Spotify and Music on macOS, where the system asks for Your permission first, or through the `playerctl` tool on Linux) and can send play, pause, next and previous. This stays on Your device and is not sent anywhere.
* h. **Apple Calendar and Reminders (Desktop Edition on a Mac).** If You choose calendars or Reminders lists in Calendar Link, FocusDesk runs a small helper that reads those items from Your Mac and shows them in FocusDesk. macOS asks for Your permission first. FocusDesk only reads them; it never creates, changes or deletes anything in Apple Calendar or Apple Reminders, and the information stays on Your device. You can turn this off at any time by removing the permission in System Settings.
* i. **Citation lookups.** If You paste a DOI or an ISBN into the Citation Maker and press Fill in, FocusDesk asks Crossref (for a DOI) or Open Library (for an ISBN) for that one record. In the Desktop Edition, pasting a web link makes FocusDesk download that one page so it can read its title, author and date. Nothing is looked up until You press the button.
* j. **Flash card hotkey (Desktop Edition).** When You press the flash card hotkey, FocusDesk reads the text on Your clipboard once, to put it on the front of a new card. It does not watch the clipboard at other times, and nothing is sent anywhere.
* k. **Now Playing in the taskbar (Desktop Edition).** While the clock flyout is open, or if You turn on the taskbar indicator, FocusDesk checks what is playing on Your computer every few seconds. This stays on Your device.
* l. **Update checks.** When You check for updates (or leave automatic checks on), the Desktop Edition asks GitHub for the newest release number, first through GitHub's programming interface and then through its public release feed. Browsers ask GitHub's interface and, if it is busy, read a small file on the FocusDesk website. Only the version number is looked at. Nothing about You is sent beyond what any web request includes, such as Your network address.
* m. **Shared folder files.** A shared folder file contains only the notes and flash cards You chose to put in it, plus the pictures those notes use. It does not contain Your grades, assignments' progress or settings. FocusDesk creates the file on Your device and does not send it anywhere; whoever You give it to can open it with Import shared.
* n. **Log file (Desktop Edition).** FocusDesk keeps a small text log called `focusdesk.log` in its data folder, noting problems such as a file that could not be saved. It stays on Your computer and is never sent anywhere; You can read or delete it. Please check it for anything private before sharing it with a bug report.
* o. **Writing to Apple Calendar and Reminders (Mac, off by default).** If You turn it on, FocusDesk adds Your events, assignments, reminders and tasks (the kinds You choose) to a calendar and a Reminders list that it creates, both called "FocusDesk", using Your Mac's calendar and reminders features. It changes only those two. macOS asks for Your permission first. Those items then live in Your Apple account (for example iCloud) under Apple's terms, and may appear on Your other Apple devices. FocusDesk does not send them anywhere else.
* p. **Cover lookup for Now Playing (off by default).** If You turn it on and Your music player gives no cover picture, FocusDesk sends the song title and artist to Apple's public music search to find one. Nothing is sent while it is off.
* q. **Apple's on-device model (Mac).** If You choose it for M.X.E.S., Your messages are answered by the model built into Your Mac. They are not sent over the internet.
* r. **Backup copies and the browser's folder access.** If You turn on "keep a copy of Your newest data in the backup folder", the Desktop Edition writes a file called focusdesk-latest.json there. If that folder is in iCloud Drive, Dropbox or similar, that service syncs it under its own terms. The browser version, if You choose a folder, only reads from it, and only the folder You pick.
* w. **What did I do this week?** When You press My week in Clipy (or choose it from the command palette), a summary of the last seven days is sent, together with the question, to the assistant You chose in Control Panel, exactly as with any Clipy chat. The summary contains the titles (not the contents) of notes You edited and of tasks, assignments and events, the names of habits You kept, and Your focus-timer totals and labels. If You have not chosen an assistant, the summary is only shown on Your device and nothing is sent. To make this possible, FocusDesk now stores, in Your own data on Your device, the time You finished each task and assignment, and a short list of the apps You opened most recently; neither is sent anywhere by itself.
* s. **Clipy adding items.** When You ask Clipy to add an event, reminder, task or assignment, the words You type go to the assistant You chose in Control Panel, exactly as with any Clipy chat, and Clipy's answer may include the item. Clipy only adds when Your own message asks it to, and anything it adds without being asked is thrown away. Nothing is added until You press Add, unless You turn on "Add things without asking" in Clipy's menu. Items Clipy adds stay in FocusDesk; they are written to Apple Calendar and Reminders only if You have turned on writing (item o above) and also turned on "Also write what Clipy adds for me".
* t. **Automatic updates (Windows and Linux).** If automatic updates are on (the default, and You can change it in Control Panel), the Desktop Edition checks GitHub for a newer version about once every twelve hours and, depending on Your setting, downloads and installs it from GitHub. Only the version information and the update file are fetched; nothing about You is sent beyond what any web request includes, such as Your network address. If an automatic update fails, FocusDesk falls back to telling You and linking to the download. On a Mac, FocusDesk only tells You when an update is out.
* v. **Crash log (Desktop Edition).** When FocusDesk crashes or hits an error, it records a short entry (the kind of problem, the version, Your system type and the error text) in a file called `crash.log` in its data folder. Before anything is written, Your user name, home folder, e-mail addresses, the query part of web addresses and anything that looks like a key or token are removed, and it never contains Your notes, tasks or other data. It stays on Your computer and nothing is sent automatically. If You choose "Send details", FocusDesk opens a draft issue on GitHub in Your web browser with the same text filled in; nothing is sent to GitHub until You review it and press Submit there, under GitHub's own terms. You can read, copy or clear the log in Control Panel.
* u. **Update bar in the browser.** The website checks a small file on the FocusDesk website now and then to see whether a newer version has been published, and shows a bar if so.

**4.4. Data Location**

The Desktop Edition stores Your data in the following folder (daily backups go to a `backups` folder inside it unless You choose another folder in Control Panel, for example one inside Dropbox or iCloud Drive; if You do, that folder and its sync service are Your responsibility):

* **macOS:** `~/Library/Application Support/FocusDesk 96/`
* **Windows:** `%APPDATA%\FocusDesk 96\`
* **Linux:** `~/.config/FocusDesk 96/`

**4.5. Updates**

The Desktop Edition does not install updates by itself. The update checker tells You when a newer release exists and links to it. You decide whether to install it. Your data is kept when You install over an existing copy.

### 5. Feedback and Contributions

**5.1. Feedback Submission**

You may report bugs and suggest improvements through the project's issue tracker on GitHub. Please do not include private data, API keys, or the contents of Your data folder in public reports.

**5.2. Contributions**

Unless You state otherwise in writing, anything You contribute to the project (code, text, or artwork) is licensed under the same MIT License as the rest of the source code, and You confirm that You have the right to contribute it. Contributed code does not carry permission to use the brand assets described in Section 2.2.

---

## PART III: BROWSER EDITION AND DEVELOPER TERMS

This Part applies to the Browser Edition (Version 2.8), the Browser zip, and anyone building from the source code.

### 6. Browser Edition and Browser zip

**6.1. What the Browser zip Is**

The Browser zip is the **Browser Edition** saved to a folder on Your computer. It is **not** the Desktop Edition. To use it, unzip the folder and open `index.html` in a web browser. It runs offline.

**6.2. Browser Storage**

The Browser Edition keeps Your data inside Your web browser, not as files in the unzipped folder. Browsers limit how much a page can store (commonly about 5 MB), and different browsers or browser profiles do not share data. The Browser Edition also keeps up to seven daily snapshots of Your data in that same storage; they count toward the limit, and Control Panel can delete them. Moving Your data between the Browser Edition and the Desktop Edition is done with Control Panel, using Save backup file and Restore from file.

**6.3. Updates**

The Browser Edition checks for a newer Browser zip only when You ask it to. It never replaces itself.

### 7. Developer Terms

**7.1. Building From Source**

Developers may build and run the application from source using Node.js and the commands in the project's `README`. The build scripts, installer configuration, and release workflow are part of the MIT-licensed source.

**7.2. Forks and Modified Copies**

You may publish modified copies under the MIT License. A modified copy must keep the license and copyright notices and must use a name and icon that do not suggest it is the official FocusDesk 96 (see Section 2.2).

**7.3. Security Reports**

If You find a security problem, please open an issue on GitHub that describes the area affected **without** exploit details or private data, and a private channel will be arranged. Please allow reasonable time for a fix before disclosing the details publicly.

**7.4. Data Handling in Derived Works**

Software built on FocusDesk 96 that changes how data is stored or transmitted should say so clearly to its own users, and should not describe itself as keeping data on-device if it does not.

---

## PART IV: DISCLAIMERS AND CHANGES

### 8. Warranty and Liability

**8.1. No Warranty**

THE PRODUCTS ARE PROVIDED "AS IS," WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT.

**8.2. Limitation of Liability**

TO THE FULLEST EXTENT PERMITTED BY LAW, APOJI DELEGRAPHICS AND APOJI STUDIOS ARE NOT LIABLE FOR ANY CLAIM, DAMAGES, OR LOSS OF DATA ARISING FROM OR IN CONNECTION WITH THE PRODUCTS OR THEIR USE.

### 9. Changes to These Terms

Apoji Delegraphics may update this document for new versions of the Products. The Effective Date at the top shows the latest revision. Using a new version of the Products means You accept the terms published with it.

---

© 2026 Apoji Delegraphics and Apoji Studios. Source code released under the MIT License.
