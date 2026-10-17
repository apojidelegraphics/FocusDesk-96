window.addEventListener("error", function (e) {
  var b = document.getElementById("boot");
  if (!b) return;
  b.style.display = "flex";
  var p = b.querySelector("p");
  if (p) {
    p.style.color = "#ff8080";
    p.style.fontFamily = "monospace";
    p.style.whiteSpace = "pre-wrap";
    p.style.maxWidth = "90vw";
    p.textContent =
      "Boot error: " +
      (e.message || "unknown") +
      "\nLine: " +
      (e.lineno || "?") +
      " : " +
      (e.colno || "?");
  }
});
(function () {
  "use strict";

  var VERSION_BROWSER = "2.7.2";
  var VERSION_DESKTOP = "1.2.1";
  var VERSION = window.__focusdeskIsDesktop ? VERSION_DESKTOP : VERSION_BROWSER;
  var VERSION_KEY = "focusdesk96.version";
  var PATCHES = [
    {
      v: "2.7.1",
      date: "October 2026",
      title: "Edit cards, add images, more LaTeX",
      apps: [],
      notes: [
        "Flash cards: edit cloze and image-occlusion cards. Cards you keep keep their review history.",
        "Notepad: new Add Image button, alongside paste and drop.",
        "LaTeX: multi-line equations (aligned, align, gather, split), \\substack, and cleaner limits on integrals.",
        "Habit Breaker: change a quit date, keep a note for each habit, and see which weekdays you slip on.",
        "Control Panel: About now describes where you're running FocusDesk correctly and sits just above the Danger zone. Optional update check when FocusDesk starts (off by default in the browser).",
      ],
    },
    {
      v: "2.7.2",
      date: "October 2026",
      title: "Merge keeps your look, offline marker, Clipy greeting",
      apps: [],
      notes: [
        "Merging a backup can now bring over its look too: theme, icons, cursors and wallpaper. It's ticked automatically when your own look is still the default. Pictures, focus sessions and badges from the backup merge in as well.",
        "Clipy and Control Panel mark the assistant as offline when you're disconnected or it can't be reached. Local models are not affected.",
        "Clipy always opens with a greeting, even in a new chat.",
        "Smoother dialogs and menus, clearer keyboard focus, and a friendlier message when the assistant can't connect.",
      ],
    },
    {
      v: "1.2.1",
      date: "October 2026",
      title: "Desktop 1.2.1: full LaTeX, assignments in the menu bar",
      apps: [],
      notes: [
        "Math is now rendered by KaTeX, bundled with the app and working offline: boxed and cancelled terms, aligned multi-line equations, arrays, colours, and chemistry with \\ce{H2O}.",
        "The menu bar / tray menu now lists the assignments due today, with a submenu of titles and times. A new switch in Control Panel \u2192 Desktop decides whether overdue tasks and assignments are included.",
        "Includes browser version 2.7.2: merge keeps your look, an offline marker for assistants, and Clipy's always-on greeting.",
      ],
    },
    {
      v: "1.2.0",
      date: "October 2026",
      title: "Desktop 1.2: mini timer, Ask Clipy, backup folder",
      apps: [],
      notes: [
        "Mini timer: a small always-on-top focus timer you can drag to any screen. Open it from the Timer menu, the tray, or Control Panel \u2192 Desktop.",
        "Ask Clipy: press the quick capture hotkey, switch to the Ask tab and type a question. Clipy opens in its own always-on-top window so you can chat while you work.",
        "Choose where your daily backups go (for example a Dropbox or iCloud folder) and how many to keep: 7, 14, 30 or all.",
        "Due counts: the tray menu shows how many cards and tasks are due, and on Windows the taskbar icon shows a badge. On Mac nothing shows until you click the menu bar icon.",
        "More in the menus: New Note, Save Backup Now, Go to any app, Start/Pause timer, Check for Updates, Terms of Use and Report an Issue.",
        "Notifications: fixed the Windows identity, they now show even while FocusDesk is in front (you can turn that off), and there is a Send test notification button.",
        "Windows: the menu now lives behind the \u22ef button in the title bar by default.",
        "Includes browser version 2.7.1: edit cloze and occlusion cards, an Add Image button in Notepad, more LaTeX, Habit Breaker upgrades.",
      ],
    },
    {
      v: "1.1.1",
      date: "October 2026",
      title: "Windows: menu in the title bar",
      apps: [],
      notes: [
        "Windows: Control Panel \u2192 Desktop now has an option to move File, Edit, View and Help into a \u22ef button in a slim title bar, like Spotify. Restart FocusDesk to apply it.",
      ],
    },
    {
      v: "1.1.0",
      date: "October 2026",
      title: "Desktop 1.1: notifications, quick capture, tray",
      apps: ["breaker", "achievements"],
      notes: [
        "Everything in browser version 2.7: Habit Breaker, LaTeX and images in notes and cards, cloze and image-occlusion flash cards, focus session log, achievements, and the grade what-if.",
        "Native notifications: reminders and finished focus sessions appear in your system's notification center when FocusDesk isn't in front. Your system's Do Not Disturb is respected.",
        "Quick capture: press Cmd+Shift+Space (Ctrl+Shift+Space on Windows and Linux) from anywhere. Tab switches between Task, Note, Reminder and Event, Enter saves, Esc cancels. Try \u201ccall mom tomorrow at 5pm\u201d.",
        "Menu bar / system tray icon with the focus timer countdown, a shortcut to start a session, and quick task capture.",
        "Control Panel \u2192 Desktop: keep running in the tray when the window is closed, open at login, start hidden, and switch notifications or the hotkey off.",
        "Update checker finds new releases and, in the browser version, the new browser zip. The 5 MB storage meter is gone on desktop because your data is plain files.",
      ],
    },
    {
      v: "2.7",
      date: "October 2026",
      title: "Habit Breaker, LaTeX, cloze cards and more (beta)",
      apps: ["breaker", "achievements"],
      notes: [
        "New: Habit Breaker. Track habits you want to quit. Same day grid and streaks, but the goal is a run of clean days. Log slips with a note about what triggered them, and get a message when you beat your own record.",
        "Notepad now renders LaTeX: $x^2$ inline and $$...$$ for blocks. Paste or drop images straight into a note; they save with the note and export with the .md file.",
        "Flash cards support LaTeX and images too, plus cloze deletion ({{c1::answer}}) and image occlusion cards you draw over a diagram.",
        "Every Focus Timer session is now logged with its time of day. Study Stats shows your best hours to focus and Weekly Review lists each session.",
        "New: Achievements. About 30 badges for streaks, hours, cards, habits, games and more.",
        "Grade Calculator: slide to see \u201cif I get X on the rest\u201d, with best, likely and worst semester GPA.",
        "Control Panel can check GitHub for a newer desktop release.",
      ],
    },
    {
      v: "1.0.0",
      date: "October 2026",
      title: "FocusDesk 96 \u2014 Desktop Edition",
      apps: [],
      notes: [
        "FocusDesk 96 is now a real desktop app for macOS, Windows and Linux. Same apps, same look, same features as the browser version 2.6.1.",
        "Your data now lives in plain files on your computer (data.json, plus wall.json, settings.json and keys.json) instead of browser storage, so you can back it up, sync it with Dropbox, or copy it to another machine.",
        "Automatic daily backups: seven rolling copies are kept in the backups folder, written straight to disk.",
        "Safe saving: every write goes to a temporary file first and is swapped in, so a crash can't corrupt your data. If a file is ever damaged, it is set aside and you are told.",
        "Native Save and Open dialogs for backups, .ics calendar imports, Migrate files, sketches, graphs and note exports.",
        "Migrate keeps a copy of every export in the migrate folder inside your data folder, and Import migrated file opens there.",
        "Native menus on every platform, and the window remembers its size and position.",
      ],
    },
    {
      v: "2.6.1",
      date: "October 2026",
      title: "Migrate, and a session fix",
      apps: ["migrate"],
      notes: [
        "New: Migrate. Move individual notes, cards, assignments, folders and more out to a file to free up browser storage, then import them back any time.",
        "Folders you migrate bring their contents along automatically, so nothing gets orphaned.",
        "Migrating an assignment also carries its private notes with it.",
        "Session persistence now survives a Shut Down. Reopen FocusDesk and every window you had open comes back exactly as you left it.",
      ],
    },
    {
      v: "2.6.0",
      date: "October 2026",
      title: "Folders, session persistence, and Apoji Studios",
      apps: ["folders"],
      notes: [
        "New: Folders. Group assignments and notes into named folders you can colour however you like.",
        "New: Assignment Viewer. Click any assignment to open a proper detail window with its own notes area and a folder selector.",
        "Folders now have a search bar and a By Class dropdown, plus section headers separating Assignments from Notes.",
        "New: Session persistence. Reopen FocusDesk and every window you had open comes back exactly where you left it.",
        "Clipy's Word of the Day is now truly daily \u2014 one word per day, saved the first time you see it, and it stays put while you're inside the same day.",
        "New: Sticky mode for the Word of the Day, if you'd rather keep one word around for as long as you want.",
        "Research now has a \u201cContinue with Clipy\u201d button. After an inline search or an assistant answer, one click hands the whole thing to Clipy.",
        "FocusDesk 96 is brought to you by Apoji Studios. You'll see the byline on the boot screen, in the Welcome dialog, and in Control Panel \u2192 About.",
      ],
    },
    {
      v: "2.5.2",
      date: "October 2026",
      title:
        "More icons, themed cursors, free placement and a tidier Control Panel",
      apps: [],
      notes: [
        "New tritone icon theme with ten built-in presets \u2014 pick three colours and every icon redraws itself.",
        "Ten new icon glyphs: clock, bell, quill, test tube, flash card, pin, globe, puzzle piece, star and heart.",
        "Pixel-art cursors are back and colourable: pick an outline and a fill and the pointer updates live.",
        "Every cursor state now matches the theme: pointer hand, text I-beam, crosshair, move, resize, not-allowed, help and busy.",
        "New: Free placement. Turn \u201cSnap icons to a grid\u201d off in Control Panel and icons stay wherever you drop them.",
        "While dragging with the grid on, a dashed guide shows exactly where the icon will land.",
        "Display and Preferences are now one section, and Screen Saver lives inside it too.",
        "Wallpapers ride along with the full backup, and \u201cExport appearance\u201d / \u201cImport appearance\u201d move just your theme, icons, cursors and wallpaper between browsers.",
        "Notepad shows an auto-save indicator so you always know your note is safe.",
        "Clipy now mixes practical nudges with random study tips and fun facts instead of repeating the same line.",
      ],
    },
    {
      v: "2.5",
      date: "October 2026",
      title: "Clipy, themes, local AI, and a games hub",
      apps: ["games"],
      notes: [
        "New: Clipy \u2014 a floating paper-clip assistant in the corner of the desktop. Click to chat, right-click for options.",
        "Clipy now has a Plan My Week tool (moved out of Research). Ask Clipy to plan your week and it lays out study blocks you can send straight to the Calendar.",
        "New: Games hub \u2014 Solitaire, Memory, 2048, Snake, Tetris, Pong, Minesweeper, Typing, Sudoku and Board Games.",
        "Sudoku with four difficulties, note mode, hints, and conflict highlighting.",
        "Board Games: Tic-Tac-Toe (unbeatable), Connect Four, and Checkers.",
        "The Math Grapher is now Desmos-style: multiple expression rows, auto sliders for free variables.",
        "M.X.E.S. \u2014 run a model locally through Ollama or LM Studio. Includes a Fetch Models button.",
        "12 colour themes plus custom desktop and accent colours.",
        "Calendar: drag events between days; resize time blocks in Week view.",
        "Custom cursors, sound packs, icon themes, rename desktop icons.",
        "Drag sections to reorder on the Today page. Per-day notes on habits.",
        "Fun facts and Word of the Day in Clipy no longer repeat until every one has been used.",
      ],
    },
    {
      v: "2.4",
      date: "October 2026",
      title: "Calendar scroll, Notepad formatting, more screensavers",
      apps: ["research"],
      notes: [
        "Calendar day cells now show every item, scrolling when a day is full.",
        "Notepad toolbar has an arbitrary font-size box, highlight, rule, indent and table.",
        "Notepad task list checkboxes are clickable in the preview.",
        "Research can search Wikipedia, DuckDuckGo, Crossref, Open Library and Datamuse inside the window.",
        "OpenRouter and other models no longer cut answers short.",
        "Two new screen savers: Flurry and Warp Tunnel.",
        "Grade Calculator can set every weight to one number at once.",
        "Habit Tracker has a 90-day view and completion summary.",
        "Sketch Pad has a full colour picker.",
      ],
    },
    {
      v: "2.3",
      date: "October 2026",
      title:
        "Notepad formatting, dictionary fix, Mac keys, Sketch Pad constrain",
      apps: [],
      notes: [
        "Notepad: full formatting toolbar, live preview, Ctrl/Cmd+B and Ctrl/Cmd+I.",
        "Dictionary tries dictionaryapi.dev, then Wiktionary, then Datamuse.",
        "Mac keyboard shortcuts fixed (uses key codes, not key names).",
        "Sketch Pad: hold Shift while drawing to constrain.",
      ],
    },
    {
      v: "2.2",
      date: "October 2026",
      title: "Spaced repetition, heatmap, weekly review, and a grey theme",
      apps: ["weekly"],
      notes: [
        "Flash Cards use real spaced repetition (SM-2).",
        "Study Stats has a 6-month heatmap.",
        "New app: Weekly Review.",
        "Alt+1..9 jumps to the Nth open window.",
        "Storage usage bar, daily snapshots, restore preview.",
        "Grey Mode. Multi-select in Tasks. Note templates from files.",
      ],
    },
    {
      v: "2.1",
      date: "October 2026",
      title: "Notes link, time blocking, and a planner",
      apps: ["planner"],
      notes: [
        "Notepad note linking [[Note Title]].",
        "Calendar Week view with click-to-create study blocks.",
        "New app: Assignment Planner.",
      ],
    },
  ];
  /* Desktop has its own 1.x version line; the browser's 2.x notes aren't "new" there. */
  if (window.__focusdeskIsDesktop)
    PATCHES = PATCHES.filter(function (p) {
      return verCmp(p.v, "2.0") < 0;
    });
  function verCmp(a, b) {
    var A = String(a).split(".").map(Number),
      B = String(b).split(".").map(Number);
    for (var i = 0; i < Math.max(A.length, B.length); i++) {
      var x = A[i] || 0,
        y = B[i] || 0;
      if (x !== y) return x - y;
    }
    return 0;
  }

  function ensureReleaseGuide() {
    var GUIDE_ID = "focusdesk96.releaseguide.v1";
    if (
      S.notes.some(function (n) {
        return n.id === GUIDE_ID;
      })
    )
      return;
    var g = [
      "# FocusDesk 96 — Complete Guide",
      "",
      "Welcome! This note is your manual. It's locked so it can't be edited or deleted by accident, but you can copy anything you want out of it.",
      "",
      "---",
      "",
      "## What FocusDesk 96 is",
      "",
      "A complete study environment that runs entirely in your browser. No accounts, no cloud, no tracking. Everything lives on your device. Close the tab, come back tomorrow — it's all still here.",
      "",
      "---",
      "",
      "## The desktop",
      "",
      "- **Double-click an icon** to open that app.",
      "- **Single-click** to select. Drag to reposition.",
      "- **Right-click the desktop** for a menu: add/remove icons, arrange by name, reset positions, or change the wallpaper.",
      "- **Right-click an icon** to rename it, remove it from the desktop, or open it.",
      "- **Drag a picture onto the desktop** to set it as your wallpaper.",
      "- **Alt+Enter** (or the fullscreen button in the tray) toggles full screen.",
      "",
      "---",
      "",
      "## The taskbar (bottom of the screen)",
      "",
      "Left to right:",
      "",
      "1. **Start button** — the programs menu.",
      "2. **Open windows** — click to switch, or click the active one to minimize.",
      "3. **Tray** — the storage warning icon (only appears if saving is blocked), timer countdown, fullscreen toggle, sound on/off, and the clock.",
      "",
      "**Click the clock** to see a mini calendar.",
      "",
      "**Keyboard shortcuts:**",
      "- `Alt+1` through `Alt+9` — jump to the Nth open window",
      "- `Alt+Enter` — full screen",
      "- `Escape` — close any open menu",
      "",
      "---",
      "",
      "## The apps",
      "",
      "### Today",
      "One glance at your whole day. Schedule, reminders, overdue items, what's due this week, exams, tasks, habits, countdowns and focus stats — all on one page. **Drag any section header** to reorder them. The order saves automatically.",
      "",
      "### Calendar",
      "Month view and Week (time-block) view. In Month view, **drag an event chip** to another day to reschedule. In Week view, **click any hour slot** to add a study block, and **drag the bottom edge** of a chip to change its length. Import a `.ics` file from Canvas, Infinite Campus, Google Calendar, iCloud or any calendar app via **Calendar Link**.",
      "",
      "### Tasks",
      "Simple to-do list with due dates, priorities and repeats. **Shift-click** to select a range, **Ctrl-click** (Cmd on Mac) to select multiple. Delete them all at once with the X button.",
      "",
      "### Notepad",
      "Markdown editor with a full formatting toolbar, live preview, autosave indicator, and note linking.",
      "- **Click Preview** to render the note below the editor",
      "- **Task checkboxes become clickable** in preview",
      "- **`[[Note Title]]`** links to another note (click the link in preview to jump)",
      "- **`#tag`** adds a searchable tag",
      "- **Ctrl+B** and **Ctrl+I** (Cmd on Mac) for bold and italic",
      "- **F5** stamps the current date and time",
      "- **File → New from Template** for Cornell Notes, Lab Report, Essay Outline, and more",
      "- **File → Import template from file** to save your own",
      "- **Add to Folder** to file it into a Folder",
      "",
      "### Folders",
      "Group assignments and notes into named folders you can colour however you like.",
      "- **Search bar** filters items live",
      "- **Class dropdown** filters by course code (populated from your Calendar Link imports)",
      "- **Section headers** separate Assignments from Notes",
      "- **Click an item** to open it — assignments open in the Assignment Viewer",
      "- **Click the ×** on an item to remove it from the folder (the item itself isn't deleted)",
      "",
      "### Assignment Viewer",
      "Click any assignment in Folders or Calendar Link to open it in its own window.",
      "- **Its own notes area** — saves automatically",
      "- **Folder chips** show which folders it belongs to; click a chip to remove it",
      "- **Mark as done / Mark as open** button",
      "- **Add to folder…** to file it",
      "",
      "### Reminders",
      "A reminder and a chime will pop up when it's time. Quick-add buttons for 10 min, 1 hour or tomorrow morning. Repeats (daily, weekdays, weekly, monthly) are supported.",
      "",
      "### Focus Timer",
      "Classic Pomodoro. Work in focused blocks separated by short breaks. Type what you're working on and it gets logged to your stats. Every 4 focus sessions earns a long break. Background sound options: brown noise, white noise, or rain.",
      "",
      "### Calendar Link",
      "Import a `.ics` file from Canvas, Infinite Campus, Google Calendar, iCloud or any other calendar app. Assignments show up in Tasks, Calendar and Grades. Duplicates are skipped automatically on re-import.",
      "",
      "### Flash Cards",
      "Real spaced repetition (SM-2). Grade each card **Again / Hard / Good / Easy** and it schedules the next review automatically. Import from Quizlet with a tab, dash or comma separator. **Study** shows due cards; **Cards** lets you add and edit.",
      "",
      "### Research",
      "Search Wikipedia, DuckDuckGo, Crossref, Open Library and Datamuse all in one window. Plus an **assistant panel** with buttons for Explain it, Quiz me, Summarize note, Search ideas, Make flash cards, Essay outline, and Check my writing.",
      "- **Save answer to Notepad** to keep what the assistant said",
      "- **Continue with Clipy** hands the whole search or answer to Clipy for follow-up questions",
      "",
      "### Grade Calculator",
      "Enter your scores as you get them. It shows your current grade and **exactly what you need on the remaining work** to hit an A, B or C. **Sync with imports** pulls your Canvas courses and assignments in automatically.",
      "",
      "### Class Schedule",
      "Set the days and times your classes meet. They show up on your Calendar and Today pages.",
      "",
      "### Study Stats",
      "14-day chart and 6-month heatmap of your study minutes. Log time manually or let the Focus Timer do it. Weekly goal tracker, day streak, and breakdown by subject.",
      "",
      "### Weekly Review",
      "A summary of any week: focus time, tasks completed, assignments done, reminders, habits and more. Use the Older/Newer buttons to look back.",
      "",
      "### Citation Maker",
      "Build citations in APA 7, MLA 9 or Chicago. Copy to clipboard, add to your bibliography, or save the whole list to Notepad.",
      "",
      "### Find",
      "Search everything at once — notes, tasks, assignments, events, reminders, classes, cards, courses, habits, countdowns, citations, folders.",
      "",
      "### Habit Tracker",
      "Daily habits with 7, 14, 30 or 90-day views. **Right-click any day cell** to attach a note. Shows current and best streaks.",
      "",
      "### Countdowns",
      "Days until finals, a trip, graduation. Anything with a date.",
      "",
      "### Unit Converter",
      "Length, mass, volume, speed, area, time, data and temperature.",
      "",
      "### Favorites",
      "Save your most-visited links. Quick-add for Scholar, Khan Academy, Wikipedia, Quizlet, Desmos, Wolfram|Alpha and more.",
      "",
      "### Randomizer",
      "Coin flip, dice roller, name picker and team maker.",
      "",
      "### Equation Solver",
      "Handles linear and quadratic equations. Enter something like `2x + 5 = 13` or `x^2 - 5x + 6 = 0` and it shows the solution with the discriminant.",
      "",
      "### Assignment Planner",
      "Timeline view of every open assignment. Bars show how long each one has been open, ending at its due date.",
      "",
      "### Math Grapher",
      "Desmos-style. Type any expression: `sin(x)`, `a x^2 + b`, `1/x`, `sqrt(x)`. **Free letters become sliders** you can drag. Scroll to zoom, drag to pan.",
      "",
      "### Periodic Table",
      "Click any element for details. Colours show element families.",
      "",
      "### Formula Sheet",
      "Algebra, geometry, trigonometry, calculus, physics, chemistry and statistics.",
      "",
      "### Dictionary / Thesaurus",
      "Type a word and press Enter. Definitions, examples, synonyms and antonyms.",
      "",
      "### Recycle Bin",
      "Deleted items go here before they're gone for good. Restore individual items or empty the whole bin.",
      "",
      "### Migrate",
      "Move individual notes, cards, assignments, folders and more **out to a file** to free up browser storage. Import them back later. Folders bring their contents along automatically.",
      "",
      "### Games",
      "Solitaire, Memory, 2048, Snake, Tetris, Pong, Minesweeper, Typing Test, Sudoku, and Board Games (Tic-Tac-Toe, Connect Four, Checkers). Sudoku has four difficulties, note mode and hints.",
      "",
      "---",
      "",
      "## Clipy",
      "",
      "Your study companion lives in the bottom-right corner. Click him to chat. **Right-click him** for options: show a study tip, show a fun fact, sticky Word of the Day, or hide him.",
      "",
      "Clipy can:",
      "- Chat about anything — what's due, how your week went, what to study first",
      "- **Plan your week** — click the 'Plan my week' chip and he'll lay out study blocks you can send straight to your Calendar",
      "- Give you a **Word of the Day** (once per day, saved so it stays put)",
      "- **Mix tips and fun facts** into his nudges so you never get bored",
      "",
      "Clipy needs an assistant key for most features. Go to **Control Panel → Assistant** to set one up.",
      "",
      "---",
      "",
      "## Control Panel",
      "",
      "### Storage",
      "Shows how much space you're using and whether autosave is working.",
      "",
      "### Backup",
      "- **Save backup file…** — downloads a complete JSON backup",
      "- **Restore from file…** — replaces everything with a backup",
      "- **Merge from file…** — adds anything from a backup without deleting your current data",
      "- **Export .csv** — for spreadsheets",
      "- **Export appearance…** / **Import appearance…** — just the look",
      "- **Migrate items…** — move items out to a file",
      "- **Recover last restore point** — the automatic hourly snapshot",
      "",
      "### Display & Preferences",
      "12 colour themes plus custom desktop and accent colours. Icon themes (16-colour, monochrome, modern, and Tritone where you pick three colours). Colourable pixel cursors. Screen savers (Starfield, Mystify, Flying Text, Bubbles, Matrix, Pipes, Flurry, Warp Tunnel). Sound packs. Grey Mode. Clipy options.",
      "",
      "### Assistant",
      "Pick an assistant: **Helpy** (Claude), **Lolbit** (OpenRouter), **HandUnit** (OpenAI), **Carnie** (DeepSeek), **Mystic Hippo** (Gemini), or **M.X.E.S.** (a local model running on your own computer via Ollama or LM Studio). Keys stay in your browser only.",
      "",
      "### Desktop Icons",
      "Tick which apps appear on the desktop. Snap-to-grid or free placement. Rename icons.",
      "",
      "### About",
      "Version info and diagnostics.",
      "",
      "### Danger zone",
      "**Erase all data** wipes everything. There's no undo, so back up first.",
      "",
      "---",
      "",
      "## Data safety",
      "",
      "**Your data lives in this browser only.** Nothing goes to a server. That means:",
      "",
      "- Clearing your browser's site data **erases FocusDesk**",
      "- A browser cleanup tool might erase it",
      "- **Save a backup file** regularly (Control Panel → Backup)",
      "",
      "FocusDesk takes an **automatic hourly snapshot** you can recover from, but that only protects against the last hour. Save a real backup for anything important.",
      "",
      "---",
      "",
      "## Tips",
      "",
      "- **Notepad `[[Note Title]]` linking** turns your notes into a wiki. Link them together and never lose a train of thought.",
      "- **Calendar Link** is the fastest way to get assignments in. Import once a week.",
      "- **Flash Cards** use real spaced repetition — the algorithm schedules reviews for you. Just grade honestly.",
      "- **Clipy 'Plan my week'** is a genuine time-saver. Try it Sunday evening.",
      "- **Session persistence** reopens every window you had open when you come back.",
      "- **Drag sections** on Today to reorder. Whatever you use most goes at the top.",
      "",
      "---",
      "",
      "## Credits",
      "",
      "**FocusDesk 96** is a product of Apoji Delegraphics.",
      "",
      "- **Designed by** Apoji Studios",
      "- **Engineered by** Apoji Delegraphics",
      "- **Version:** " + VERSION,
      "",
      "Apoji Studios makes things that look and feel good. Apoji Delegraphics",
      "makes sure they work, stay secure, and hold up under pressure. FocusDesk 96",
      "is the first product to come from both sides at once.",
      "",
      "Made with care for students everywhere.",
    ].join("\n");
    S.notes.unshift({
      id: GUIDE_ID,
      text: g,
      updated: Date.now(),
      locked: true,
    });
    save();
  }

  function applyPatchNotes(S) {
    var cur = "";
    try {
      cur = localStorage.getItem(VERSION_KEY) || "";
    } catch (e) {}
    if (!cur || cur === "0") {
      try {
        localStorage.setItem(VERSION_KEY, VERSION);
      } catch (e) {}
      return false;
    }
    if (verCmp(cur, VERSION) >= 0) return false;
    var fresh = PATCHES.filter(function (p) {
      return verCmp(cur, p.v) < 0;
    });
    if (!fresh.length) {
      try {
        localStorage.setItem(VERSION_KEY, VERSION);
      } catch (e) {}
      return false;
    }
    var body =
      "FocusDesk 96 — Update " +
      VERSION +
      "\n" +
      new Date().toLocaleDateString() +
      "\n\n";
    fresh.forEach(function (p) {
      body += "Version " + p.v + " — " + p.title + "  (" + p.date + ")\n";
      p.notes.forEach(function (n) {
        body += "  \u2022 " + n + "\n";
      });
      body += "\n";
    });
    body += "This note stays in Notepad so you can read it any time.\n";
    S.notes.unshift({
      id: uid(),
      text: body,
      updated: Date.now(),
      locked: true,
    });
    try {
      localStorage.setItem(VERSION_KEY, VERSION);
    } catch (e) {}
    return true;
  }

  var TRASH_KINDS = [
    "events",
    "notes",
    "reminders",
    "assign",
    "cards",
    "tasks",
    "grades",
    "classes",
    "bib",
    "stickies",
    "habits",
    "breakers",
    "countdowns",
    "links",
  ];
  var KEY = "focusdesk96.v1";
  var storageOK = true,
    corruptLoad = false;
  var isStr = function (v) {
    return typeof v === "string";
  };
  var isNum = function (v) {
    return typeof v === "number" && isFinite(v);
  };
  var isObj = function (v) {
    return !!v && typeof v === "object" && !Array.isArray(v);
  };
  function clip(s, n) {
    return String(s).slice(0, n);
  }
  function uid() {
    return (
      Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4)
    );
  }

  /* ===== Apoji Studios logo helper ===== */
  function apojiSrc() {
    var v = (typeof window !== "undefined" && window.APOJI_LOGO) || "";
    if (!v) return "";
    v = String(v).trim();
    if (v.indexOf("data:") === 0) return v;
    if (/^[A-Za-z0-9+/=\s]+$/.test(v.slice(0, 40))) {
      return "data:image/png;base64," + v.replace(/\s+/g, "");
    }
    return v;
  }
  function makeApojiLogo(cls) {
    var src = apojiSrc();
    if (!src) {
      return el(
        "div",
        {
          class: cls + " " + cls + "-missing",
          title: "apojilogo.js not loaded",
        },
        "Apoji Studios"
      );
    }
    var img = el("img", { class: cls, src: src, alt: "Apoji Studios" });
    img.addEventListener("error", function () {
      var fb = el("div", { class: cls + "-missing" }, "Apoji Studios");
      if (img.parentNode) img.parentNode.replaceChild(fb, img);
    });
    return img;
  }

  var THEMES = [
    { key: "classic", name: "Classic Teal", bg: "#008080", accent: "#000080" },
    { key: "navy", name: "Navy", bg: "#000080", accent: "#1084d0" },
    { key: "forest", name: "Forest", bg: "#2e6b3e", accent: "#005020" },
    { key: "plum", name: "Plum", bg: "#6a2a7a", accent: "#400060" },
    { key: "sienna", name: "Sienna", bg: "#a0522d", accent: "#7a2000" },
    { key: "slate", name: "Slate", bg: "#3a3a3a", accent: "#181818" },
    { key: "rose", name: "Rose", bg: "#a05070", accent: "#700030" },
    { key: "sunset", name: "Sunset", bg: "#c06030", accent: "#8a1a10" },
    { key: "ocean", name: "Ocean", bg: "#1a4a70", accent: "#0a2a50" },
    { key: "mint", name: "Mint", bg: "#2e8060", accent: "#004030" },
    { key: "midnight", name: "Midnight", bg: "#101828", accent: "#4060a0" },
    { key: "sand", name: "Sand", bg: "#c0a070", accent: "#604020" },
  ];
  function themeByKey(k) {
    for (var i = 0; i < THEMES.length; i++)
      if (THEMES[i].key === k) return THEMES[i];
    return THEMES[0];
  }

  function defaults() {
    return {
      events: [],
      notes: [],
      reminders: [],
      assign: [],
      cards: [],
      stats: {},
      timer: null,
      tasks: [],
      grades: [],
      mines: {},
      classes: [],
      bib: [],
      stickies: [],
      habits: [],
      breakers: [],
      images: {},
      sessions: [],
      ach: {},
      countdowns: [],
      games: {},
      links: [],
      desk: {
        init: false,
        ids: [],
        pos: {},
        freepos: {},
        known: [],
        names: {},
      },
      trash: [],
      winpos: {},
      newApps: {},
      session: { open: [], active: null },
      folders: [],
      assignNotes: {},
      clipy: { msgs: [], wotd: null, wotdHistory: [] },
      prefs: {
        bg: "#008080",
        tips: true,
        mute: false,
        wallMode: "fill",
        grey: false,
        pattern: "",
        goal: 300,
        saver: "",
        saverMin: 5,
        ai: "",
        claudeMode: "native",
        aiModels: {},
        orModel: "openrouter/free",
        noteSize: 13,
        theme: "classic",
        accent: "#000080",
        lastVersion: "",
        localUrl: "",
        showClipy: true,
        clipyTips: true,
        clipyTipMin: 20,
        soundPack: "classic",
        cursor: "blocky",
        iconTheme: "vga",
        cursorColors: { outline: "#000000", fill: "#ffffff" },
        tritone: { dark: "#000000", mid: "#808080", light: "#ffffff" },
        iconGrid: true,
        wotdMode: "daily",
        todayOrder: [],
        restoreSession: true,
        updAuto: !!window.__focusdeskIsDesktop,
        dur: { focus: 25, short: 5, long: 15 },
      },
    };
  }

  function sanitize(p) {
    var o = defaults();
    if (!isObj(p)) return o;
    function arr(k) {
      return Array.isArray(p[k]) ? p[k].filter(isObj) : [];
    }
    var dateRe = /^\d{4}-\d{2}-\d{2}$/,
      timeRe = /^\d{2}:\d{2}$/;
    var REPEATS_V = [
      "none",
      "daily",
      "weekdays",
      "weekly",
      "biweekly",
      "monthly",
    ];
    o.events = arr("events")
      .filter(function (e) {
        return isStr(e.title) && dateRe.test(e.date);
      })
      .map(function (e) {
        var r = {
          id: isStr(e.id) ? e.id : uid(),
          title: clip(e.title, 300),
          date: e.date,
          time: timeRe.test(e.time) ? e.time : "",
          kind:
            ["class", "exam", "study", "other"].indexOf(e.kind) >= 0
              ? e.kind
              : "other",
        };
        if (isStr(e.uid)) r.uid = clip(e.uid, 300);
        if (isStr(e.src)) r.src = clip(e.src, 20);
        r.repeat = REPEATS_V.indexOf(e.repeat) >= 0 ? e.repeat : "none";
        if (isNum(e.dur) && e.dur >= 5 && e.dur <= 480)
          r.dur = Math.round(e.dur);
        return r;
      });
    o.notes = arr("notes")
      .filter(function (n) {
        return isStr(n.text);
      })
      .map(function (n) {
        return {
          id: isStr(n.id) ? n.id : uid(),
          text: clip(n.text, 300000),
          updated: isNum(n.updated) ? n.updated : Date.now(),
          locked: !!n.locked,
        };
      });
    o.reminders = arr("reminders")
      .filter(function (r) {
        return isStr(r.text) && isNum(r.at);
      })
      .map(function (r) {
        return {
          id: isStr(r.id) ? r.id : uid(),
          text: clip(r.text, 300),
          at: r.at,
          done: !!r.done,
          fired: !!r.fired,
          repeat: REPEATS_V.indexOf(r.repeat) >= 0 ? r.repeat : "none",
        };
      });
    o.assign = arr("assign")
      .filter(function (a) {
        return isStr(a.title) && isNum(a.due);
      })
      .map(function (a) {
        var id = isStr(a.id) ? a.id : uid();
        return {
          id: id,
          uid: isStr(a.uid) ? clip(a.uid, 300) : "a-" + id,
          title: clip(a.title, 300),
          course: isStr(a.course) ? clip(a.course, 40) : "",
          due: a.due,
          allDay: !!a.allDay,
          done: !!a.done,
          src: a.src === "canvas" ? "canvas" : "manual",
          url:
            isStr(a.url) && /^https?:\/\//i.test(a.url) ? clip(a.url, 600) : "",
        };
      });
    o.cards = arr("cards")
      .filter(function (c) {
        return isStr(c.q) && isStr(c.a);
      })
      .map(function (c) {
        var r = {
          id: isStr(c.id) ? c.id : uid(),
          deck: isStr(c.deck) && c.deck ? clip(c.deck, 40) : "General",
          q: clip(c.q, 1000),
          a: clip(c.a, 2000),
          box: isNum(c.box) ? Math.max(0, Math.min(3, Math.floor(c.box))) : 0,
          dueAt: isNum(c.dueAt) ? c.dueAt : Date.now(),
          interval: isNum(c.interval) && c.interval >= 0 ? c.interval : 0,
          ease: isNum(c.ease) && c.ease >= 1.3 && c.ease <= 3.5 ? c.ease : 2.5,
          reps: isNum(c.reps) ? Math.max(0, Math.floor(c.reps)) : 0,
          lapses: isNum(c.lapses) ? Math.max(0, Math.floor(c.lapses)) : 0,
        };
        if (isNum(c.cloze) && c.cloze > 0) r.cloze = Math.min(99, Math.floor(c.cloze));
        if (isObj(c.occ) && isStr(c.occ.img) && Array.isArray(c.occ.boxes)) {
          var f01 = function (v) {
            return isNum(v) ? Math.max(0, Math.min(1, v)) : 0;
          };
          r.occ = {
            img: clip(c.occ.img, 40),
            boxes: c.occ.boxes
              .filter(isObj)
              .slice(0, 60)
              .map(function (b) {
                return { x: f01(b.x), y: f01(b.y), w: f01(b.w), h: f01(b.h) };
              }),
            i: isNum(c.occ.i) ? Math.max(0, Math.floor(c.occ.i)) : 0,
          };
          if (!r.occ.boxes.length) delete r.occ;
          else if (r.occ.i >= r.occ.boxes.length) r.occ.i = 0;
        }
        if (isStr(c.grp)) r.grp = clip(c.grp, 40);
        return r;
      });
    o.tasks = arr("tasks")
      .filter(function (t) {
        return isStr(t.text);
      })
      .map(function (t) {
        return {
          id: isStr(t.id) ? t.id : uid(),
          text: clip(t.text, 300),
          done: !!t.done,
          pri: ["high", "normal", "low"].indexOf(t.pri) >= 0 ? t.pri : "normal",
          due: isNum(t.due) ? t.due : null,
          created: isNum(t.created) ? t.created : Date.now(),
          repeat: REPEATS_V.indexOf(t.repeat) >= 0 ? t.repeat : "none",
        };
      })
      .slice(0, 500);
    o.grades = arr("grades")
      .filter(function (g) {
        return isStr(g.name);
      })
      .map(function (g) {
        var num = function (v, max) {
          return isNum(v) ? Math.max(0, Math.min(max, v)) : null;
        };
        return {
          id: isStr(g.id) ? g.id : uid(),
          name: clip(g.name, 60),
          canvas: isStr(g.canvas) ? clip(g.canvas, 40) : "",
          mode: g.mode === "points" ? "points" : "weighted",
          credits: isNum(g.credits) ? Math.max(0, Math.min(12, g.credits)) : 3,
          items: (Array.isArray(g.items) ? g.items : [])
            .filter(isObj)
            .map(function (i) {
              return {
                id: isStr(i.id) ? i.id : uid(),
                name: clip(isStr(i.name) ? i.name : "", 80),
                cid: isStr(i.cid) ? clip(i.cid, 300) : "",
                weight: isNum(i.weight)
                  ? Math.max(0, Math.min(100, i.weight))
                  : 0,
                score: num(i.score, 300),
                raw: isStr(i.raw) ? clip(i.raw, 20) : "",
                pts: isNum(i.pts) ? Math.max(0, Math.min(100000, i.pts)) : 0,
                earned: num(i.earned, 100000),
              };
            })
            .slice(0, 200),
        };
      })
      .slice(0, 30);
    o.classes = arr("classes")
      .filter(function (c) {
        return (
          isStr(c.name) &&
          Array.isArray(c.days) &&
          timeRe.test(c.start) &&
          timeRe.test(c.end)
        );
      })
      .map(function (c) {
        var ds = [];
        c.days.forEach(function (d) {
          if (isNum(d) && d >= 0 && d <= 6 && ds.indexOf(Math.floor(d)) < 0)
            ds.push(Math.floor(d));
        });
        return {
          id: isStr(c.id) ? c.id : uid(),
          name: clip(c.name, 60),
          days: ds,
          start: c.start,
          end: c.end,
          room: isStr(c.room) ? clip(c.room, 40) : "",
          canvas: isStr(c.canvas) ? clip(c.canvas, 40) : "",
          from: dateRe.test(c.from) ? c.from : "",
          until: dateRe.test(c.until) ? c.until : "",
        };
      })
      .filter(function (c) {
        return c.days.length;
      })
      .slice(0, 60);
    o.bib = arr("bib")
      .filter(function (b) {
        return isStr(b.text) && b.text.trim();
      })
      .map(function (b) {
        return {
          id: isStr(b.id) ? b.id : uid(),
          text: clip(b.text, 1500),
          style:
            ["apa", "mla", "chicago"].indexOf(b.style) >= 0 ? b.style : "apa",
        };
      })
      .slice(0, 300);
    o.stickies = arr("stickies")
      .map(function (n) {
        var c = function (v, a, b, d) {
          return isNum(v) ? Math.max(a, Math.min(b, v)) : d;
        };
        return {
          id: isStr(n.id) ? n.id : uid(),
          x: c(n.x, 0, 4000, 40),
          y: c(n.y, 0, 4000, 40),
          w: c(n.w, 120, 420, 190),
          h: c(n.h, 90, 420, 150),
          text: isStr(n.text) ? clip(n.text, 3000) : "",
          color: Math.floor(c(n.color, 0, 3, 0)),
        };
      })
      .slice(0, 30);
    o.habits = arr("habits")
      .filter(function (h) {
        return isStr(h.name) && h.name.trim();
      })
      .map(function (h) {
        var log = {};
        if (isObj(h.log))
          Object.keys(h.log)
            .slice(0, 1200)
            .forEach(function (k) {
              if (!dateRe.test(k)) return;
              var v = h.log[k];
              if (!v) return;
              if (isObj(v))
                log[k] = {
                  done: 1,
                  note: isStr(v.note) ? clip(v.note, 200) : "",
                };
              else log[k] = 1;
            });
        return {
          id: isStr(h.id) ? h.id : uid(),
          name: clip(h.name, 60),
          log: log,
        };
      })
      .slice(0, 40);
    o.countdowns = arr("countdowns")
      .filter(function (c) {
        return isStr(c.name) && dateRe.test(c.date);
      })
      .map(function (c) {
        return {
          id: isStr(c.id) ? c.id : uid(),
          name: clip(c.name, 60),
          date: c.date,
        };
      })
      .slice(0, 60);
    if (isObj(p.games))
      [
        "solWins",
        "solPlayed",
        "solBest",
        "memBest",
        "wpmBest",
        "g2048",
        "snakeBest",
        "tetrisBest",
        "pongBest",
      ].forEach(function (k) {
        if (isNum(p.games[k]) && p.games[k] >= 0)
          o.games[k] = Math.floor(p.games[k]);
      });
    o.links = arr("links")
      .filter(function (l) {
        return isStr(l.name) && isStr(l.url) && /^https?:\/\//i.test(l.url);
      })
      .map(function (l) {
        return {
          id: isStr(l.id) ? l.id : uid(),
          name: clip(l.name, 60),
          url: clip(l.url, 500),
        };
      })
      .slice(0, 100);
    if (isObj(p.newApps))
      Object.keys(p.newApps)
        .slice(0, 120)
        .forEach(function (id) {
          if (isNum(p.newApps[id]) && p.newApps[id] >= 0)
            o.newApps[clip(id, 24)] = p.newApps[id];
        });
    if (isObj(p.clipy) && Array.isArray(p.clipy.msgs))
      p.clipy.msgs.slice(-200).forEach(function (m) {
        if (!isObj(m)) return;
        if (m.role === "plan" && Array.isArray(m.plan)) {
          var plan = m.plan
            .slice(0, 60)
            .filter(function (x) {
              return (
                isObj(x) &&
                isStr(x.title) &&
                isStr(x.date) &&
                /^\d{4}-\d{2}-\d{2}$/.test(x.date)
              );
            })
            .map(function (x) {
              return {
                title: clip(x.title, 80),
                date: x.date,
                time:
                  isStr(x.time) && /^\d{2}:\d{2}$/.test(x.time)
                    ? x.time
                    : "16:00",
                min: isNum(x.min)
                  ? Math.max(5, Math.min(240, Math.round(x.min)))
                  : 45,
              };
            });
          if (plan.length)
            o.clipy.msgs.push({
              role: "plan",
              text: "",
              at: isNum(m.at) ? m.at : Date.now(),
              plan: plan,
            });
        } else if (
          isStr(m.text) &&
          ["user", "assistant", "sys"].indexOf(m.role) >= 0
        ) {
          o.clipy.msgs.push({
            role: m.role,
            text: clip(m.text, 6000),
            at: isNum(m.at) ? m.at : Date.now(),
          });
        }
      });
    if (isObj(p.clipy) && isObj(p.clipy.wotd)) {
      var w0 = p.clipy.wotd;
      if (isStr(w0.word) && isStr(w0.def))
        o.clipy.wotd = {
          date: isStr(w0.date) && dateRe.test(w0.date) ? w0.date : "",
          word: clip(w0.word, 40),
          pos: isStr(w0.pos) ? clip(w0.pos, 20) : "",
          def: clip(w0.def, 300),
          example: isStr(w0.example) ? clip(w0.example, 300) : "",
          why: isStr(w0.why) ? clip(w0.why, 200) : "",
          from: w0.from === "ai" ? "ai" : "list",
        };
    }
    if (isObj(p.clipy) && Array.isArray(p.clipy.wotdHistory))
      p.clipy.wotdHistory.slice(-60).forEach(function (w2) {
        if (isStr(w2) && w2.length <= 40)
          o.clipy.wotdHistory.push(clip(w2, 40));
      });
    if (isObj(p.desk)) {
      var dk = p.desk;
      o.desk.init = !!dk.init;
      if (Array.isArray(dk.ids)) {
        var seenD = {};
        dk.ids.forEach(function (id) {
          if (
            isStr(id) &&
            id.length <= 24 &&
            !seenD[id] &&
            o.desk.ids.length < 80
          ) {
            seenD[id] = 1;
            o.desk.ids.push(id);
          }
        });
      }
      if (Array.isArray(dk.known))
        dk.known.slice(0, 120).forEach(function (id) {
          if (isStr(id) && id.length <= 24) o.desk.known.push(id);
        });
      if (isObj(dk.names))
        Object.keys(dk.names)
          .slice(0, 120)
          .forEach(function (id) {
            if (isStr(dk.names[id]) && dk.names[id].length <= 60)
              o.desk.names[clip(id, 24)] = clip(dk.names[id], 60);
          });
      if (isObj(dk.pos))
        Object.keys(dk.pos)
          .slice(0, 120)
          .forEach(function (id) {
            var q = dk.pos[id];
            if (Array.isArray(q) && isNum(q[0]) && isNum(q[1]))
              o.desk.pos[clip(id, 24)] = [
                Math.max(0, Math.min(80, Math.floor(q[0]))),
                Math.max(0, Math.min(80, Math.floor(q[1]))),
              ];
          });
      if (isObj(dk.freepos))
        Object.keys(dk.freepos)
          .slice(0, 120)
          .forEach(function (id) {
            var q = dk.freepos[id];
            if (Array.isArray(q) && isNum(q[0]) && isNum(q[1]))
              o.desk.freepos[clip(id, 24)] = [
                Math.max(0, Math.min(8000, Math.round(q[0]))),
                Math.max(0, Math.min(8000, Math.round(q[1]))),
              ];
          });
    }
    if (Array.isArray(p.trash))
      p.trash.slice(0, 200).forEach(function (t) {
        if (
          isObj(t) &&
          isStr(t.kind) &&
          TRASH_KINDS.indexOf(t.kind) >= 0 &&
          isObj(t.data)
        )
          o.trash.push({
            id: isStr(t.id) ? t.id : uid(),
            kind: t.kind,
            data: t.data,
            label: isStr(t.label) ? clip(t.label, 120) : t.kind,
            at: isNum(t.at) ? t.at : Date.now(),
          });
      });
    if (isObj(p.winpos))
      Object.keys(p.winpos)
        .slice(0, 40)
        .forEach(function (id) {
          var q = p.winpos[id];
          if (isObj(q) && isNum(q.x) && isNum(q.y) && isNum(q.w) && isNum(q.h))
            o.winpos[clip(id, 20)] = {
              x: Math.max(-2000, Math.min(20000, Math.round(q.x))),
              y: Math.max(0, Math.min(20000, Math.round(q.y))),
              w: Math.max(220, Math.min(4000, Math.round(q.w))),
              h: Math.max(160, Math.min(4000, Math.round(q.h))),
            };
        });
    if (isObj(p.mines))
      ["beginner", "intermediate"].forEach(function (k) {
        if (isNum(p.mines[k]) && p.mines[k] > 0)
          o.mines[k] = Math.floor(p.mines[k]);
      });
    if (isObj(p.stats))
      for (var k in p.stats) {
        var st = p.stats[k];
        if (dateRe.test(k) && isObj(st)) {
          var rec = {
            sessions: isNum(st.sessions) ? Math.max(0, st.sessions) : 0,
            minutes: isNum(st.minutes) ? Math.max(0, st.minutes) : 0,
          };
          if (isObj(st.by)) {
            rec.by = {};
            Object.keys(st.by)
              .slice(0, 40)
              .forEach(function (b) {
                if (isNum(st.by[b]) && st.by[b] > 0)
                  rec.by[clip(b, 40)] = Math.round(st.by[b]);
              });
          }
          o.stats[k] = rec;
        }
      }
    if (isObj(p.timer)) {
      var t = p.timer;
      if (
        ["focus", "short", "long"].indexOf(t.mode) >= 0 &&
        isNum(t.total) &&
        t.total > 0 &&
        isNum(t.left)
      )
        o.timer = {
          mode: t.mode,
          total: t.total,
          left: Math.max(0, Math.min(t.total, t.left)),
          running: !!t.running && isNum(t.endAt),
          endAt: isNum(t.endAt) ? t.endAt : 0,
          label: isStr(t.label) ? clip(t.label, 120) : "",
          cycle: isNum(t.cycle) ? Math.max(0, Math.floor(t.cycle)) : 0,
        };
    }
    var pp = isObj(p.prefs) ? p.prefs : {};
    if (isStr(pp.bg) && /^#[0-9a-f]{6}$/i.test(pp.bg)) o.prefs.bg = pp.bg;
    if (pp.tips === false) o.prefs.tips = false;
    o.prefs.mute = !!pp.mute;
    o.prefs.grey = !!pp.grey;
    o.prefs.wallMode =
      ["fill", "stretch", "center", "tile"].indexOf(pp.wallMode) >= 0
        ? pp.wallMode
        : "fill";
    o.prefs.pattern =
      ["dots", "grid", "checks", "stripes"].indexOf(pp.pattern) >= 0
        ? pp.pattern
        : "";
    o.prefs.goal = isNum(pp.goal)
      ? Math.max(0, Math.min(6000, Math.round(pp.goal)))
      : 300;
    o.prefs.saver =
      [
        "stars",
        "mystify",
        "text",
        "bubbles",
        "matrix",
        "pipes",
        "flurry",
        "warp",
      ].indexOf(pp.saver) >= 0
        ? pp.saver
        : "";
    o.prefs.ai =
      [
        "helpy",
        "lolbit",
        "handunit",
        "carnie",
        "mystic",
        "ollama",
        "off",
      ].indexOf(pp.ai) >= 0
        ? pp.ai
        : "";
    o.prefs.claudeMode = pp.claudeMode === "api" ? "api" : "native";
    if (isObj(pp.aiModels))
      [
        "claude",
        "openai",
        "deepseek",
        "gemini",
        "openrouter",
        "ollama",
      ].forEach(function (k) {
        if (isStr(pp.aiModels[k]) && pp.aiModels[k].length <= 100)
          o.prefs.aiModels[k] = clip(pp.aiModels[k], 100);
      });
    o.prefs.orModel =
      isStr(pp.orModel) && /^[\w\-.:\/]{1,100}$/.test(pp.orModel)
        ? pp.orModel
        : "openrouter/free";
    o.prefs.noteSize = isNum(pp.noteSize)
      ? Math.max(8, Math.min(96, Math.round(pp.noteSize)))
      : 13;
    if (
      isStr(pp.theme) &&
      THEMES.some(function (t2) {
        return t2.key === pp.theme;
      })
    )
      o.prefs.theme = pp.theme;
    if (isStr(pp.accent) && /^#[0-9a-f]{6}$/i.test(pp.accent))
      o.prefs.accent = pp.accent;
    if (isStr(pp.lastVersion) && pp.lastVersion.length <= 12)
      o.prefs.lastVersion = pp.lastVersion;
    if (
      isStr(pp.localUrl) &&
      pp.localUrl.length <= 200 &&
      /^https?:\/\//i.test(pp.localUrl)
    )
      o.prefs.localUrl = pp.localUrl;
    o.prefs.showClipy = pp.showClipy !== false;
    o.prefs.clipyTips = pp.clipyTips !== false;
    o.prefs.clipyTipMin =
      [5, 10, 15, 20, 30, 60].indexOf(pp.clipyTipMin) >= 0
        ? pp.clipyTipMin
        : 20;
    o.prefs.soundPack =
      ["classic", "silent", "chiptune"].indexOf(pp.soundPack) >= 0
        ? pp.soundPack
        : "classic";
    o.prefs.cursor =
      ["default", "blocky", "dot", "pencil"].indexOf(pp.cursor) >= 0
        ? pp.cursor
        : "blocky";
    var cc = isObj(pp.cursorColors) ? pp.cursorColors : {};
    o.prefs.cursorColors = {
      outline:
        isStr(cc.outline) && /^#[0-9a-f]{6}$/i.test(cc.outline)
          ? cc.outline
          : "#000000",
      fill:
        isStr(cc.fill) && /^#[0-9a-f]{6}$/i.test(cc.fill) ? cc.fill : "#ffffff",
    };
    o.prefs.iconTheme =
      ["vga", "mono", "modern", "tritone"].indexOf(pp.iconTheme) >= 0
        ? pp.iconTheme
        : "vga";
    var tri = isObj(pp.tritone) ? pp.tritone : {};
    o.prefs.tritone = {
      dark:
        isStr(tri.dark) && /^#[0-9a-f]{6}$/i.test(tri.dark)
          ? tri.dark
          : "#000000",
      mid:
        isStr(tri.mid) && /^#[0-9a-f]{6}$/i.test(tri.mid) ? tri.mid : "#808080",
      light:
        isStr(tri.light) && /^#[0-9a-f]{6}$/i.test(tri.light)
          ? tri.light
          : "#ffffff",
    };
    o.prefs.iconGrid = pp.iconGrid !== false;
    o.prefs.saverMin =
      [1, 2, 5, 10, 15].indexOf(pp.saverMin) >= 0 ? pp.saverMin : 5;
    ["focus", "short", "long"].forEach(function (m) {
      var v = isObj(pp.dur) ? pp.dur[m] : null;
      if (isNum(v)) o.prefs.dur[m] = Math.max(1, Math.min(180, Math.round(v)));
    });
    if (pp.wotdMode === "sticky") o.prefs.wotdMode = "sticky";
    if (Array.isArray(pp.todayOrder))
      o.prefs.todayOrder = pp.todayOrder.slice(0, 30).filter(function (x) {
        return isStr(x) && x.length <= 24;
      });
    o.prefs.restoreSession = pp.restoreSession !== false;
    o.prefs.updAuto = typeof pp.updAuto === "boolean" ? pp.updAuto : pp.updCheck === false ? false : !!window.__focusdeskIsDesktop;
    o.prefs.updLast = isNum(pp.updLast) ? pp.updLast : 0;
    o.prefs.updSeen = isStr(pp.updSeen) ? clip(pp.updSeen, 20) : "";

    /* ---- Session (open windows) ---- */
    if (isObj(p.session) && Array.isArray(p.session.open)) {
      var sess = [];
      var seenId = {};
      p.session.open.slice(0, 40).forEach(function (rec) {
        if (!isObj(rec) || !isStr(rec.id) || rec.id.length > 40) return;
        if (seenId[rec.id]) return;
        seenId[rec.id] = 1;
        sess.push({
          id: rec.id,
          z: isNum(rec.z)
            ? Math.max(0, Math.min(100000, Math.round(rec.z)))
            : 0,
          min: !!rec.min,
          max: !!rec.max,
        });
      });
      o.session = {
        open: sess,
        active:
          isStr(p.session.active) && p.session.active.length <= 40
            ? p.session.active
            : null,
      };
    }

    /* ---- Folders ---- */
    if (Array.isArray(p.folders)) {
      var okAssign = {},
        okNotes = {};
      o.assign.forEach(function (a) {
        okAssign[a.id] = 1;
      });
      o.notes.forEach(function (n) {
        okNotes[n.id] = 1;
      });
      o.folders = p.folders
        .filter(isObj)
        .filter(function (f) {
          return isStr(f.name) && f.name.trim();
        })
        .map(function (f) {
          return {
            id: isStr(f.id) ? f.id : uid(),
            name: clip(f.name, 60),
            color: isNum(f.color)
              ? Math.max(0, Math.min(7, Math.floor(f.color)))
              : 0,
            assign: Array.isArray(f.assign)
              ? f.assign
                  .filter(function (id) {
                    return isStr(id) && okAssign[id];
                  })
                  .slice(0, 500)
              : [],
            note: Array.isArray(f.note)
              ? f.note
                  .filter(function (id) {
                    return isStr(id) && okNotes[id];
                  })
                  .slice(0, 500)
              : [],
            created: isNum(f.created) ? f.created : Date.now(),
          };
        })
        .slice(0, 100);
    }

    /* ---- Per-assignment notes ---- */
    if (isObj(p.assignNotes)) {
      Object.keys(p.assignNotes)
        .slice(0, 500)
        .forEach(function (k) {
          if (isStr(p.assignNotes[k]) && p.assignNotes[k].length) {
            o.assignNotes[clip(k, 30)] = clip(p.assignNotes[k], 5000);
          }
        });
    }
    o.breakers = arr("breakers")
      .filter(function (b) {
        return isStr(b.name) && b.name.trim();
      })
      .map(function (b) {
        var log = {};
        if (isObj(b.log))
          Object.keys(b.log)
            .slice(0, 1200)
            .forEach(function (k) {
              if (!dateRe.test(k) || !b.log[k]) return;
              log[k] = { note: isObj(b.log[k]) && isStr(b.log[k].note) ? clip(b.log[k].note, 200) : "" };
            });
        return {
          id: isStr(b.id) ? b.id : uid(),
          name: clip(b.name, 60),
          start: isStr(b.start) && dateRe.test(b.start) ? b.start : ymd(new Date()),
          log: log,
          note: isStr(b.note) ? clip(b.note, 500) : "",
          record: isNum(b.record) ? Math.max(0, Math.floor(b.record)) : 0,
        };
      })
      .slice(0, 40);
    o.images = {};
    if (isObj(p.images))
      Object.keys(p.images)
        .slice(0, 200)
        .forEach(function (k) {
          var v = p.images[k];
          if (/^[A-Za-z0-9_-]{1,40}$/.test(k) && isStr(v) && v.length < 2000000 && /^data:image\/(png|jpeg|gif|webp);base64,[A-Za-z0-9+\/=]+$/.test(v)) o.images[k] = v;
        });
    o.sessions = arr("sessions")
      .filter(function (x) {
        return isNum(x.t) && isNum(x.m);
      })
      .map(function (x) {
        return { t: x.t, m: Math.max(1, Math.min(600, Math.round(x.m))), l: isStr(x.l) ? clip(x.l, 40) : "" };
      })
      .slice(-3000);
    o.ach = {};
    if (isObj(p.ach))
      Object.keys(p.ach)
        .slice(0, 100)
        .forEach(function (k) {
          if (isNum(p.ach[k])) o.ach[k] = p.ach[k];
        });
    return o;
  }

  var S = defaults();
  try {
    var raw = null;
    if (window.__focusdeskInitialData) {
      /* Desktop: data.json was read before this script ran. */
      S = sanitize(window.__focusdeskInitialData);
    } else raw = localStorage.getItem(KEY);
    if (window.__focusdeskCorrupt && window.__focusdeskCorrupt.length)
      corruptLoad = true;
    if (raw) {
      try {
        S = sanitize(JSON.parse(raw));
      } catch (e) {
        corruptLoad = true;
        try {
          localStorage.setItem(KEY + ".corrupt", raw);
        } catch (x) {}
      }
      var bt = +localStorage.getItem(KEY + ".baktime") || 0;
      if (!corruptLoad && Date.now() - bt > 3600000) {
        localStorage.setItem(KEY + ".bak", raw);
        localStorage.setItem(KEY + ".baktime", String(Date.now()));
      }
    }
    localStorage.setItem(KEY + ".t", "1");
    localStorage.removeItem(KEY + ".t");
  } catch (e) {
    storageOK = false;
  }
  S.reminders.forEach(function (r) {
    r.fired = false;
  });
  var saveT;
  function updSave() {
    var w = document.getElementById("saveWarn");
    if (w) w.hidden = storageOK;
  }
  function flush() {
    if (window.__focusdeskWrite) {
      /* Desktop: debounced, queued write to data.json via the shim. */
      window.__focusdeskWrite(S, wallData);
      return;
    }
    try {
      localStorage.setItem(KEY, JSON.stringify(S));
      if (!storageOK) {
        storageOK = true;
        updSave();
      }
    } catch (e) {
      if (storageOK) {
        storageOK = false;
        updSave();
      }
    }
  }
  function save() {
    clearTimeout(saveT);
    saveT = setTimeout(flush, 200);
    checkAchSoon();
    if (window.__focusdeskScheduleDue) window.__focusdeskScheduleDue();
  }
  window.addEventListener("pagehide", flush);
  if (window.__focusdeskIsDesktop) window.__focusdeskFlush = flush;

  var WALLKEY = KEY + ".wall",
    wallData = null;
  try {
    wallData =
      window.__focusdeskInitialWall || localStorage.getItem(WALLKEY) || null;
  } catch (e) {}
  var PATTERNS = {
    dots: {
      img: "radial-gradient(circle,rgba(255,255,255,.45) 1.5px,transparent 2px)",
      size: "12px 12px",
    },
    grid: {
      img: "linear-gradient(rgba(0,0,0,.28) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.28) 1px,transparent 1px)",
      size: "16px 16px",
    },
    checks: {
      img: "conic-gradient(rgba(0,0,0,.18) 25%,transparent 0 50%,rgba(0,0,0,.18) 0 75%,transparent 0)",
      size: "24px 24px",
    },
    stripes: {
      img: "repeating-linear-gradient(45deg,rgba(255,255,255,.14) 0 6px,transparent 6px 12px)",
      size: "auto",
    },
  };
  function applyWall() {
    var e = document.getElementById("wall");
    if (!e) return;
    var st = e.style;
    st.backgroundImage = "none";
    st.backgroundSize = "auto";
    st.backgroundRepeat = "no-repeat";
    st.backgroundPosition = "center";
    st.backgroundColor = "transparent";
    var body = document.body;
    body.style.backgroundImage = "none";
    body.style.backgroundSize = "auto";
    body.style.backgroundRepeat = "repeat";
    body.style.backgroundPosition = "0 0";
    if (S.prefs.pattern && PATTERNS[S.prefs.pattern]) {
      var p = PATTERNS[S.prefs.pattern];
      body.style.backgroundImage = p.img;
      body.style.backgroundSize = p.size;
    }
    if (wallData) {
      st.backgroundImage = 'url("' + wallData + '")';
      var m = S.prefs.wallMode;
      if (m === "tile") {
        st.backgroundRepeat = "repeat";
        st.backgroundPosition = "0 0";
      } else if (m === "stretch") st.backgroundSize = "100% 100%";
      else if (m === "fill") st.backgroundSize = "cover";
      else if (m === "center") {
        st.backgroundRepeat = "no-repeat";
        st.backgroundPosition = "center";
        st.backgroundSize = "auto";
      }
    }
  }
  function setWall(url) {
    wallData = url;
    var ok = true;
    try {
      localStorage.setItem(WALLKEY, url);
    } catch (e) {
      ok = false;
    }
    applyWall();
    refreshAll();
    if (!ok)
      msgBox({
        title: "Desktop Background",
        icon: "warn",
        text: "The picture is in use for now, but it is too big for this browser to remember. Try a smaller picture.",
      });
  }
  function clearWall() {
    wallData = null;
    try {
      localStorage.removeItem(WALLKEY);
    } catch (e) {}
    applyWall();
    refreshAll();
  }
  function setWallFromFile(file) {
    if (!file || !/^image\//.test(file.type || "")) {
      msgBox({
        title: "Desktop Background",
        icon: "warn",
        text: "Please choose a picture file (JPG, PNG, GIF or WebP).",
      });
      return;
    }
    var r = new FileReader();
    r.onerror = function () {
      msgBox({
        title: "Desktop Background",
        icon: "err",
        text: "That file couldn't be read.",
      });
    };
    r.onload = function () {
      var img = new Image();
      img.onerror = function () {
        msgBox({
          title: "Desktop Background",
          icon: "err",
          text: "That picture couldn't be opened.",
        });
      };
      img.onload = function () {
        try {
          var sc = Math.min(1, 1920 / Math.max(img.width, img.height, 1));
          var cv = document.createElement("canvas");
          cv.width = Math.max(1, Math.round(img.width * sc));
          cv.height = Math.max(1, Math.round(img.height * sc));
          var cx = cv.getContext("2d");
          cx.fillStyle = S.prefs.bg;
          cx.fillRect(0, 0, cv.width, cv.height);
          cx.drawImage(img, 0, 0, cv.width, cv.height);
          var q = 0.85,
            url = cv.toDataURL("image/jpeg", q);
          while (url.length > 1400000 && q > 0.35) {
            q -= 0.12;
            url = cv.toDataURL("image/jpeg", q);
          }
          setWall(url);
        } catch (e) {
          msgBox({
            title: "Desktop Background",
            icon: "err",
            text: "That picture couldn't be used.",
          });
        }
      };
      img.src = r.result;
    };
    r.readAsDataURL(file);
  }

  function $(s, r) {
    return (r || document).querySelector(s);
  }
  var pad = function (n) {
    return String(n).padStart(2, "0");
  };
  var ymd = function (d) {
    return (
      d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate())
    );
  };
  var hm = function (d) {
    return pad(d.getHours()) + ":" + pad(d.getMinutes());
  };
  var fmt12 = function (d) {
    var h = d.getHours(),
      ap = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return h + ":" + pad(d.getMinutes()) + " " + ap;
  };
  var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  function whenStr(ms, allDay) {
    var d = new Date(ms);
    return (
      DAYS[d.getDay()] +
      " " +
      (d.getMonth() + 1) +
      "/" +
      d.getDate() +
      (allDay ? "" : " " + fmt12(d))
    );
  }
  function rel(ms) {
    var diff = ms - Date.now(),
      a = Math.abs(diff),
      s;
    if (a < 3600000) {
      var m = Math.max(1, Math.round(a / 60000));
      s = m + " min";
    } else if (a < 86400000) {
      s = Math.round(a / 3600000) + " hr";
    } else {
      var d = Math.round(a / 86400000);
      s = d + " day" + (d > 1 ? "s" : "");
    }
    return diff < 0 ? s + " overdue" : "in " + s;
  }
  function add(p, kids) {
    kids.forEach(function (c) {
      if (Array.isArray(c)) add(p, c);
      else if (c == null || c === false) return;
      else p.append(c.nodeType ? c : document.createTextNode(String(c)));
    });
  }
  function el(tag, props) {
    var e = document.createElement(tag);
    if (props)
      for (var k in props) {
        var v = props[k];
        if (v == null || v === false) continue;
        if (k === "class") e.className = v;
        else if (k === "style") e.style.cssText = v;
        else if (k.slice(0, 2) === "on") e[k] = v;
        else if (k === "value" || k === "checked") e[k] = v;
        else if (v === true) e.setAttribute(k, "");
        else e.setAttribute(k, v);
      }
    add(e, Array.prototype.slice.call(arguments, 2));
    return e;
  }
  function onEnter(inp, fn) {
    inp.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        fn();
      }
    });
  }
  function findNote(id) {
    return S.notes.filter(function (n) {
      return n.id === id;
    })[0];
  }

  var TRASH_LABELS = {
    events: "Event",
    notes: "Note",
    reminders: "Reminder",
    assign: "Assignment",
    cards: "Card",
    tasks: "Task",
    grades: "Course",
    classes: "Class",
    bib: "Citation",
    stickies: "Sticky Note",
    habits: "Habit",
    breakers: "Breaker habit",
    countdowns: "Countdown",
    links: "Favorite",
  };
  function toTrash(kind, data, label) {
    if (TRASH_KINDS.indexOf(kind) < 0) return;
    S.trash.unshift({
      id: uid(),
      kind: kind,
      data: data,
      label: clip(String(label || TRASH_LABELS[kind] || kind), 120),
      at: Date.now(),
    });
    if (S.trash.length > 200) S.trash.length = 200;
  }
  function softDelete(kind, pred) {
    var arr = S[kind] || [],
      keep = [];
    arr.forEach(function (x) {
      if (pred(x)) {
        var lb = x.title || x.text || x.name || x.q || x.url || "";
        toTrash(kind, x, lb || TRASH_LABELS[kind]);
      } else keep.push(x);
    });
    S[kind] = keep;
    if ((kind === "assign" || kind === "notes") && Array.isArray(S.folders)) {
      var fk = kind === "assign" ? "assign" : "note";
      var keepIds = {};
      keep.forEach(function (x) {
        keepIds[x.id] = 1;
      });
      S.folders.forEach(function (f) {
        f[fk] = f[fk].filter(function (id) {
          return keepIds[id];
        });
      });
    }
    save();
    refreshAll();
  }
  function restoreTrash(id) {
    var i = -1;
    S.trash.forEach(function (t, k) {
      if (t.id === id) i = k;
    });
    if (i < 0) return;
    var t = S.trash[i];
    if (!Array.isArray(S[t.kind])) S[t.kind] = [];
    if (t.data && t.data.id) {
      var dup = S[t.kind].some(function (x) {
        return x && x.id === t.data.id;
      });
      if (dup) t.data.id = uid();
    }
    S[t.kind].push(t.data);
    S.trash.splice(i, 1);
    save();
    refreshAll();
  }
  function purgeTrash(id) {
    S.trash = S.trash.filter(function (t) {
      return t.id !== id;
    });
    save();
    refreshAll();
  }

  function citeEsc(t) {
    return String(t)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  /* ================= 2.7: IMAGES, LaTeX, RICH CARD FACES ================= */
  function escAttr(t) {
    return String(t)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  var IMG_RE = /!\[([^\]\n]*)\]\((img:[A-Za-z0-9_-]+|data:image\/(?:png|jpeg|gif|webp);base64,[A-Za-z0-9+\/=]+)\)/g;
  var DMATH_INLINE_RE = /\$\$([^$\n]+?)\$\$/g;
  var MATH_RE = /\$(?!\s)([^$\n]*[^$\s\\])\$(?!\d)/g;
  function imgSrc(ref) {
    return ref.indexOf("img:") === 0 ? S.images[ref.slice(4)] || "" : ref;
  }
  function imgHtml(alt, ref) {
    var src = imgSrc(ref);
    if (!src) return '<span class="dim">[missing image]</span>';
    return '<img class="md-img" src="' + src + '" alt="' + escAttr(alt) + '">';
  }
  /* Shrinks to 1280px, keeps PNGs crisp when small, otherwise JPEG; stores a data URL in S.images. */
  function addImageFile(file, cb) {
    if (!file || !/^image\/(png|jpeg|gif|webp)$/.test(file.type)) {
      cb(null, "Only PNG, JPEG, GIF or WebP images can be added.");
      return;
    }
    if (Object.keys(S.images).length >= 200) {
      cb(null, "You've reached the limit of 200 images.");
      return;
    }
    var fr = new FileReader();
    fr.onerror = function () {
      cb(null, "Couldn't read that image.");
    };
    fr.onload = function () {
      var im = new Image();
      im.onerror = function () {
        cb(null, "Couldn't read that image.");
      };
      im.onload = function () {
        var sc = Math.min(1, 1280 / Math.max(im.width, im.height, 1)),
          cw = Math.max(1, Math.round(im.width * sc)),
          ch = Math.max(1, Math.round(im.height * sc)),
          url = "";
        var cv = document.createElement("canvas");
        cv.width = cw;
        cv.height = ch;
        if (file.type !== "image/jpeg") {
          cv.getContext("2d").drawImage(im, 0, 0, cw, ch);
          url = cv.toDataURL("image/png");
          if (url.length > 550000) url = "";
        }
        if (!url) {
          var x2 = cv.getContext("2d");
          x2.fillStyle = "#fff";
          x2.fillRect(0, 0, cw, ch);
          x2.drawImage(im, 0, 0, cw, ch);
          var q = 0.85;
          url = cv.toDataURL("image/jpeg", q);
          while (url.length > 550000 && q > 0.4) {
            q -= 0.15;
            url = cv.toDataURL("image/jpeg", q);
          }
        }
        if (url.length > 1500000) {
          cb(null, "That image is too large, even after shrinking it.");
          return;
        }
        var id = uid();
        S.images[id] = url;
        save();
        cb(id);
      };
      im.src = fr.result;
    };
    fr.readAsDataURL(file);
  }
  function insertAtCursor(inp, s) {
    var a = inp.selectionStart == null ? inp.value.length : inp.selectionStart,
      b = inp.selectionEnd == null ? a : inp.selectionEnd;
    inp.value = inp.value.slice(0, a) + s + inp.value.slice(b);
    inp.selectionStart = inp.selectionEnd = a + s.length;
    inp.dispatchEvent(new Event("input"));
  }
  /* Paste or drop image files onto a text field; insert() receives the markdown. */
  function attachImagePaste(node, insert) {
    function take(files) {
      var any = false;
      Array.prototype.forEach.call(files || [], function (f) {
        if (!/^image\//.test(f.type)) return;
        any = true;
        addImageFile(f, function (id, err) {
          if (err) {
            msgBox({ title: "Add Image", icon: "warn", text: err });
            return;
          }
          var alt = (f.name || "image")
            .replace(/\.[a-z0-9]+$/i, "")
            .replace(/[\[\]\n]/g, "");
          insert("![" + clip(alt, 40) + "](img:" + id + ")");
        });
      });
      return any;
    }
    node.addEventListener("paste", function (e) {
      var cd = e.clipboardData;
      if (cd && cd.files && cd.files.length && take(cd.files)) e.preventDefault();
    });
    node.addEventListener("dragover", function (e) {
      var ty = (e.dataTransfer && e.dataTransfer.types) || [];
      if (Array.prototype.indexOf.call(ty, "Files") >= 0) e.preventDefault();
    });
    node.addEventListener("drop", function (e) {
      var dt = e.dataTransfer;
      if (dt && dt.files && dt.files.length && take(dt.files)) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
  }
  /* Notes keep images as img:ID references; exports inline them as data URLs. */
  function inlineImages(text) {
    return String(text).replace(/\]\(img:([A-Za-z0-9_-]+)\)/g, function (m, id) {
      return S.images[id] ? "](" + S.images[id] + ")" : m;
    });
  }
  function pruneImages() {
    var used = {};
    function scan(t) {
      String(t || "").replace(/\(img:([A-Za-z0-9_-]+)\)/g, function (m, id) {
        used[id] = 1;
        return m;
      });
    }
    function scanCard(c) {
      if (!c) return;
      scan(c.q);
      scan(c.a);
      if (c.occ) used[c.occ.img] = 1;
    }
    S.notes.forEach(function (n) {
      scan(n.text);
    });
    S.cards.forEach(scanCard);
    S.stickies.forEach(function (s) {
      scan(s.text);
    });
    S.trash.forEach(function (t) {
      if (!t.data) return;
      if (t.kind === "cards") scanCard(t.data);
      else scan(t.data.text);
    });
    Object.keys(S.images).forEach(function (id) {
      if (!used[id]) delete S.images[id];
    });
  }

  /* ---- a small LaTeX renderer (no libraries, works offline) ---- */
  var TEX_SYM = {
    alpha: "\u03b1", beta: "\u03b2", gamma: "\u03b3", delta: "\u03b4", epsilon: "\u03b5",
    varepsilon: "\u03f5", zeta: "\u03b6", eta: "\u03b7", theta: "\u03b8", vartheta: "\u03d1",
    iota: "\u03b9", kappa: "\u03ba", lambda: "\u03bb", mu: "\u03bc", nu: "\u03bd", xi: "\u03be",
    pi: "\u03c0", rho: "\u03c1", sigma: "\u03c3", tau: "\u03c4", upsilon: "\u03c5",
    phi: "\u03d5", varphi: "\u03c6", chi: "\u03c7", psi: "\u03c8", omega: "\u03c9",
    Gamma: "\u0393", Delta: "\u0394", Theta: "\u0398", Lambda: "\u039b", Xi: "\u039e",
    Pi: "\u03a0", Sigma: "\u03a3", Phi: "\u03a6", Psi: "\u03a8", Omega: "\u03a9",
    infty: "\u221e", partial: "\u2202", nabla: "\u2207", emptyset: "\u2205", forall: "\u2200",
    exists: "\u2203", neg: "\u00ac", ldots: "\u2026", cdots: "\u22ef", vdots: "\u22ee",
    ddots: "\u22f1", degree: "\u00b0", circ: "\u2218", angle: "\u2220", perp: "\u22a5",
    parallel: "\u2225", therefore: "\u2234", because: "\u2235", prime: "\u2032",
    hbar: "\u210f", ell: "\u2113", Re: "\u211c", Im: "\u2111", aleph: "\u2135",
    langle: "\u27e8", rangle: "\u27e9", lbrace: "{", rbrace: "}", vert: "|", Vert: "\u2016",
    lfloor: "\u230a", rfloor: "\u230b", lceil: "\u2308", rceil: "\u2309",
  };
  var TEX_OPS = {
    times: "\u00d7", cdot: "\u22c5", div: "\u00f7", pm: "\u00b1", mp: "\u2213",
    le: "\u2264", leq: "\u2264", ge: "\u2265", geq: "\u2265", ne: "\u2260", neq: "\u2260",
    approx: "\u2248", equiv: "\u2261", sim: "\u223c", propto: "\u221d", to: "\u2192",
    rightarrow: "\u2192", leftarrow: "\u2190", Rightarrow: "\u21d2", Leftarrow: "\u21d0",
    leftrightarrow: "\u2194", Leftrightarrow: "\u21d4", mapsto: "\u21a6", "in": "\u2208",
    notin: "\u2209", subset: "\u2282", subseteq: "\u2286", supset: "\u2283", supseteq: "\u2287",
    cup: "\u222a", cap: "\u2229", land: "\u2227", lor: "\u2228", ll: "\u226a", gg: "\u226b",
    cong: "\u2245", ast: "\u2217", star: "\u22c6", oplus: "\u2295", otimes: "\u2297",
    setminus: "\u2216",
  };
  var TEX_FN = "sin cos tan cot sec csc arcsin arccos arctan sinh cosh tanh log ln exp lim max min sup inf det gcd deg dim ker arg mod Pr limsup liminf".split(" ");
  var TEX_LIM = { lim: 1, max: 1, min: 1, sup: 1, inf: 1, limsup: 1, liminf: 1 };
  var TEX_BIG = {
    sum: "\u2211", prod: "\u220f", int: "\u222b", iint: "\u222c", oint: "\u222e",
    bigcup: "\u22c3", bigcap: "\u22c2", coprod: "\u2210",
  };
  var TEX_BIGLIM = { sum: 1, prod: 1, bigcup: 1, bigcap: 1, coprod: 1 };
  var TEX_ENV = {
    pmatrix: ["(", ")"], bmatrix: ["[", "]"], Bmatrix: ["{", "}"], vmatrix: ["|", "|"],
    Vmatrix: ["\u2016", "\u2016"], matrix: ["", ""], cases: ["{", ""],
    aligned: ["", ""], align: ["", ""], "align*": ["", ""], split: ["", ""], alignat: ["", ""], "alignat*": ["", ""],
    gather: ["", ""], "gather*": ["", ""], gathered: ["", ""], eqnarray: ["", ""], "eqnarray*": ["", ""],
  };
  var TEX_BB = { R: "\u211d", Z: "\u2124", N: "\u2115", Q: "\u211a", C: "\u2102", P: "\u2119" };
  var TEX_ACC = { hat: "^", widehat: "^", tilde: "~", widetilde: "~", vec: "\u2192", dot: "\u02d9", ddot: "\u00a8", check: "\u02c7", acute: "\u00b4", grave: "`" };
  function texToHtml(src, block) {
    /* Desktop bundles KaTeX (and the chemistry extension): full LaTeX, offline. The built-in renderer below is the fallback. */
    if (window.__focusdeskKatex && window.katex) {
      try {
        var kh = window.katex.renderToString(String(src || ""), {
          displayMode: !!block,
          throwOnError: false,
          strict: "ignore",
          trust: false,
          maxExpand: 1000,
          maxSize: 60,
        });
        return block ? '<div class="kx-block">' + kh + "</div>" : '<span class="kx">' + kh + "</span>";
      } catch (e) {}
    }
    var s = String(src || ""),
      p = 0,
      n = s.length,
      big = false,
      intFlag = false,
      depth = 0;
    function esc(t) {
      return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    function peek() {
      return s.charAt(p);
    }
    function skipWs() {
      while (p < n && /\s/.test(s.charAt(p))) p++;
    }
    function cmdName() {
      var m = /^[A-Za-z]+/.exec(s.slice(p, p + 30));
      if (m) {
        p += m[0].length;
        return m[0];
      }
      return s.charAt(p++);
    }
    function rawGroup() {
      skipWs();
      if (peek() === "{") {
        var d = 1,
          st = ++p;
        while (p < n && d) {
          var c = s.charAt(p++);
          if (c === "{") d++;
          else if (c === "}") d--;
        }
        return s.slice(st, d ? p : p - 1);
      }
      return s.charAt(p++);
    }
    function atEnd() {
      var c = peek();
      if (c === "}" || c === "&") return true;
      if (c === "\\") {
        if (s.charAt(p + 1) === "\\") return true;
        if (/^\\(end|right)(?![A-Za-z])/.test(s.slice(p, p + 8))) return true;
      }
      return false;
    }
    function parseSeq() {
      if (++depth > 40) throw new Error("too deep");
      var out = "";
      for (;;) {
        skipWs();
        if (p >= n || atEnd()) break;
        out += parseScripted();
      }
      depth--;
      return out;
    }
    function parseGroup() {
      skipWs();
      if (peek() === "{") {
        p++;
        var h = parseSeq();
        if (peek() === "}") p++;
        return h;
      }
      return parseAtom();
    }
    function scriptArg() {
      skipWs();
      if (peek() === "{") return parseGroup();
      var c = s.charAt(p);
      if (c === "\\") {
        p++;
        return parseCmd();
      }
      p++;
      return /[A-Za-z]/.test(c) ? "<i>" + c + "</i>" : c === "-" ? "\u2212" : esc(c);
    }
    function parseScripted() {
      big = false;
      intFlag = false;
      var h = parseAtom(),
        isBig = big,
        wasInt = intFlag,
        sub = "",
        sup = "";
      for (;;) {
        skipWs();
        var c = peek();
        if (c === "^") {
          p++;
          sup = scriptArg();
        } else if (c === "_") {
          p++;
          sub = scriptArg();
        } else break;
      }
      if (!sub && !sup) return h;
      if (isBig && block)
        return (
          '<span class="tx-lim"><span class="tx-limsup">' + sup + "</span><span>" + h +
          '</span><span class="tx-limsub">' + sub + "</span></span>"
        );
      if (wasInt)
        return '<span class="tx-int">' + h + '<span class="tx-iscr"><span class="tx-isup">' + sup + '</span><span class="tx-isub">' + sub + "</span></span></span>";
      if (sub && sup)
        return h + '<span class="tx-scr"><span>' + sup + "</span><span>" + sub + "</span></span>";
      return h + (sup ? "<sup>" + sup + "</sup>" : "<sub>" + sub + "</sub>");
    }
    function parseAtom() {
      skipWs();
      var c = s.charAt(p);
      if (!c) return "";
      if (c === "{") {
        p++;
        var h = parseSeq();
        if (peek() === "}") p++;
        return '<span class="tx-g">' + h + "</span>";
      }
      if (c === "\\") {
        p++;
        return parseCmd();
      }
      p++;
      if (/[A-Za-z]/.test(c)) return "<i>" + c + "</i>";
      if (c === "+" || c === "=" || c === "<" || c === ">") return '<span class="tx-op">' + esc(c) + "</span>";
      if (c === "-") return '<span class="tx-op">\u2212</span>';
      if (c === "*") return "\u2217";
      if (c === "'") return "\u2032";
      return esc(c);
    }
    function parseEnv(name) {
      var rows = [],
        row = [],
        guard = 0;
      for (;;) {
        row.push(parseSeq());
        if (s.substr(p, 2) === "\\\\") {
          p += 2;
          rows.push(row);
          row = [];
        } else if (peek() === "&") p++;
        else break;
        if (++guard > 400) break;
      }
      if (row.length && !(row.length === 1 && !row[0] && rows.length)) rows.push(row);
      if (/^\\end(?![A-Za-z])/.test(s.slice(p, p + 5))) {
        p += 4;
        rawGroup();
      }
      var dl = TEX_ENV[name] || ["", ""],
        t =
          '<table class="tx-mt' +
          (name === "cases" ? " tx-cases" : "") +
          (/^(aligned|align|alignat|split|eqnarray)\*?$/.test(name) ? " tx-align" : "") +
          (/^gather/.test(name) ? " tx-gather" : "") +
          '">';
      rows.forEach(function (r) {
        t += "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>";
      });
      t += "</table>";
      return (
        '<span class="tx-mat">' + (dl[0] ? '<span class="tx-mdel">' + dl[0] + "</span>" : "") + t +
        (dl[1] ? '<span class="tx-mdel">' + dl[1] + "</span>" : "") + "</span>"
      );
    }
    function parseCmd() {
      var name = cmdName();
      if (TEX_SYM[name] !== undefined) return esc(TEX_SYM[name]);
      if (TEX_OPS[name] !== undefined) return '<span class="tx-op">' + esc(TEX_OPS[name]) + "</span>";
      if (TEX_BIG[name]) {
        big = !!TEX_BIGLIM[name];
        intFlag = name === "int" || name === "iint" || name === "oint";
        return '<span class="tx-bigop">' + TEX_BIG[name] + "</span>";
      }
      if (TEX_FN.indexOf(name) >= 0) {
        big = !!TEX_LIM[name];
        return '<span class="tx-rm">' + name + "</span>\u2009";
      }
      if (TEX_ACC[name]) return '<span class="tx-acc"><span>' + TEX_ACC[name] + "</span><span>" + parseGroup() + "</span></span>";
      switch (name) {
        case "frac": case "dfrac": case "tfrac":
          var a = parseGroup(), b = parseGroup();
          return '<span class="tx-frac"><span class="tx-num">' + a + '</span><span class="tx-den">' + b + "</span></span>";
        case "binom":
          var x = parseGroup(), y = parseGroup();
          return '<span class="tx-mdel">(</span><span class="tx-frac"><span>' + x + "</span><span>" + y + '</span></span><span class="tx-mdel">)</span>';
        case "sqrt":
          skipWs();
          var idx = "";
          if (peek() === "[") {
            var e = s.indexOf("]", p);
            if (e > 0) {
              idx = s.slice(p + 1, e);
              p = e + 1;
            }
          }
          var r = parseGroup();
          return '<span class="tx-sqrt">' + (idx ? '<sup class="tx-idx">' + esc(idx) + "</sup>" : "") + '<span class="tx-rad">\u221a</span><span class="tx-rcl">' + r + "</span></span>";
        case "overline": case "bar":
          return '<span class="tx-over">' + parseGroup() + "</span>";
        case "underline":
          return '<span class="tx-under">' + parseGroup() + "</span>";
        case "text": case "textrm": case "mathrm": case "operatorname": case "mbox":
          return '<span class="tx-text">' + esc(rawGroup()) + "</span>";
        case "mathbf": case "boldsymbol": case "bf": case "bm":
          return "<b>" + parseGroup() + "</b>";
        case "mathit": case "mathcal": case "mathsf":
          return parseGroup();
        case "mathbb":
          var bb = rawGroup();
          return TEX_BB[bb] || "<b>" + esc(bb) + "</b>";
        case "left":
          skipWs();
          var d0 = s.charAt(p++);
          if (d0 === "\\") {
            var dn = cmdName();
            d0 = TEX_SYM[dn] || dn;
          }
          var inner = parseSeq(), d1 = "";
          if (/^\\right(?![A-Za-z])/.test(s.slice(p, p + 7))) {
            p += 6;
            skipWs();
            d1 = s.charAt(p++);
            if (d1 === "\\") {
              var dn2 = cmdName();
              d1 = TEX_SYM[dn2] || dn2;
            }
          }
          return '<span class="tx-dl">' + (d0 === "." ? "" : esc(d0)) + "</span>" + inner + '<span class="tx-dl">' + (d1 === "." ? "" : esc(d1)) + "</span>";
        case "big": case "Big": case "bigg": case "Bigg": case "displaystyle": case "textstyle": case "limits": case "nolimits":
          return "";
        case "begin":
          return parseEnv(rawGroup());
        case "substack":
          var srows = [];
          skipWs();
          if (peek() === "{") {
            p++;
            for (var sg = 0; sg < 60; sg++) {
              srows.push(parseSeq());
              if (s.substr(p, 2) === "\\\\") {
                p += 2;
                continue;
              }
              break;
            }
            if (peek() === "}") p++;
          }
          return '<span class="tx-substack">' + srows.map(function (r) { return "<span>" + r + "</span>"; }).join("") + "</span>";
        case ",": return '<span class="tx-sp" style="width:.17em"></span>';
        case ":": return '<span class="tx-sp" style="width:.22em"></span>';
        case ";": return '<span class="tx-sp" style="width:.28em"></span>';
        case "!": return '<span class="tx-sp" style="width:-.17em;margin-left:-.17em"></span>';
        case " ": return '<span class="tx-sp" style="width:.3em"></span>';
        case "quad": return '<span class="tx-sp" style="width:1em"></span>';
        case "qquad": return '<span class="tx-sp" style="width:2em"></span>';
        case "\\": return "<br>";
        case "|": return "\u2016";
        case "{": case "}": case "%": case "$": case "&": case "#": case "_":
          return esc(name);
      }
      return '<span class="tx-err">\\' + esc(name) + "</span>";
    }
    try {
      var out = "";
      while (p < n) {
        out += parseSeq();
        if (p < n) p++; // stray }, &, \end ... : skip it rather than loop forever
      }
      return (block ? '<div class="tex tex-block">' : '<span class="tex">') + out + (block ? "</div>" : "</span>");
    } catch (e) {
      return '<code class="tx-err">' + esc(s) + "</code>";
    }
  }

  /* ---- card faces: plain / LaTeX / cloze / image occlusion ---- */
  function richNode(t) {
    t = String(t == null ? "" : t);
    if (t.indexOf("$") < 0 && t.indexOf("![") < 0) return document.createTextNode(t);
    var d = el("div", { class: "rich" });
    d.innerHTML = mdToHtml(t);
    return d;
  }
  function clozeRe() {
    return /\{\{c(\d+)::([^{}]*?)(?:::([^{}]*?))?\}\}/g;
  }
  function clozeNums(t) {
    var seen = {},
      m,
      re = clozeRe();
    while ((m = re.exec(t))) seen[+m[1]] = 1;
    return Object.keys(seen).map(Number).sort(function (a, b) {
      return a - b;
    });
  }
  function clozeFace(c, back) {
    var tokens = [];
    var txt = c.q.replace(clozeRe(), function (m, num, ans, hint) {
      if (+num !== c.cloze) return ans;
      tokens.push({ ans: ans, hint: hint });
      return "\u0005" + (tokens.length - 1) + "\u0006";
    });
    var d = el("div", { class: "rich" });
    d.innerHTML = mdToHtml(txt).replace(/\u0005(\d+)\u0006/g, function (m, i) {
      var t = tokens[+i];
      return back
        ? '<span class="cloze-ans">' + citeEsc(t.ans) + "</span>"
        : '<span class="cloze-blank">[' + (t.hint ? citeEsc(t.hint) : "\u2026") + "]</span>";
    });
    return d;
  }
  function occFace(c, back) {
    var src = S.images[c.occ.img] || "",
      wrap = el("div", { class: "occ-wrap" });
    if (!src) {
      wrap.append(el("div", { class: "dim" }, "[image missing]"));
      return wrap;
    }
    wrap.append(el("img", { class: "occ-img", src: src, alt: "" }));
    c.occ.boxes.forEach(function (b, j) {
      var mine = j === c.occ.i;
      wrap.append(
        el(
          "div",
          {
            class: "occ-box" + (mine ? (back ? " occ-ans" : " occ-hide") : " occ-other"),
            style: "left:" + b.x * 100 + "%;top:" + b.y * 100 + "%;width:" + b.w * 100 + "%;height:" + b.h * 100 + "%",
          },
          mine && !back ? "?" : ""
        )
      );
    });
    return wrap;
  }
  function cardFace(c, back) {
    if (c.occ) return occFace(c, back);
    if (c.cloze) return clozeFace(c, back);
    return richNode(back ? c.a : c.q);
  }
  function cardLabel(c) {
    if (c.occ) return "[Image occlusion " + (c.occ.i + 1) + " of " + c.occ.boxes.length + "]";
    if (c.cloze) return c.q + "  (cloze c" + c.cloze + ")";
    return c.q + "  \u2192  " + c.a;
  }

  function mdToHtml(src) {
    var lines = String(src || "").split("\n"),
      out = [],
      inCode = false,
      inList = null,
      inQuote = false,
      taskN = 0;
    function inline(t) {
      var stash = [];
      function keep(h) {
        stash.push(h);
        return "\u0001" + (stash.length - 1) + "\u0002";
      }
      t = String(t)
        .replace(IMG_RE, function (m, alt, ref) {
          return keep(imgHtml(alt, ref));
        })
        .replace(DMATH_INLINE_RE, function (m, tex) {
          return keep(texToHtml(tex, false));
        })
        .replace(MATH_RE, function (m, tex) {
          return keep(texToHtml(tex, false));
        });
      return inline0(t).replace(/\u0001(\d+)\u0002/g, function (m, i) {
        return stash[+i];
      });
    }
    function inline0(t) {
      return citeEsc(t)
        .replace(
          /`([^`]+)`/g,
          "<code style=\"background:#f0f0f0;padding:1px 4px;border-radius:2px;font-family:'Courier New',monospace;font-size:.92em\">$1</code>"
        )
        .replace(/\*\*\*([^*]+)\*\*\*/g, "<b><i>$1</i></b>")
        .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
        .replace(/(^|\s)\*([^*\n]+)\*/g, "$1<i>$2</i>")
        .replace(/~~([^~]+)~~/g, "<s>$1</s>")
        .replace(
          /==([^=\n]+)==/g,
          '<mark style="background:#ffff99;padding:0 2px">$1</mark>'
        )
        .replace(
          /\[\[([^\]\n]+)\]\]/g,
          '<a href="#" class="wikilink" data-note="$1">$1</a>'
        )
        .replace(
          /\[([^\]]+)\]\((https?:[^)]+)\)/g,
          '<a href="$2" target="_blank" rel="noopener" style="color:#0000c0">$1</a>'
        )
        .replace(
          /(^|\s)#(\w[\w\-]*)/g,
          '$1<span style="background:#e0e0ff;border:1px solid #8080c0;padding:0 4px;font-size:11px;border-radius:2px">#$2</span>'
        );
    }
    function closeAll() {
      if (inList) {
        out.push("</" + inList + ">");
        inList = null;
      }
      if (inQuote) {
        out.push("</blockquote>");
        inQuote = false;
      }
    }
    var i = 0;
    while (i < lines.length) {
      var l = lines[i];
      var m;
      if (/^```/.test(l)) {
        closeAll();
        out.push(
          inCode
            ? "</pre>"
            : "<pre style=\"background:#f5f5f5;border:1px solid #d0d0d0;border-radius:3px;padding:8px;overflow:auto;font:12px/1.5 'Courier New',monospace\">"
        );
        inCode = !inCode;
        i++;
        continue;
      }
      if (inCode) {
        out.push(citeEsc(l));
        i++;
        continue;
      }
      if (/^\s*\$\$/.test(l)) {
        var mathSrc = l.replace(/^\s*\$\$/, "");
        if (/\$\$\s*$/.test(mathSrc)) mathSrc = mathSrc.replace(/\$\$\s*$/, "");
        else {
          var mbuf = [mathSrc];
          i++;
          while (i < lines.length && !/\$\$/.test(lines[i])) {
            mbuf.push(lines[i]);
            i++;
          }
          if (i < lines.length) mbuf.push(lines[i].replace(/\$\$.*$/, ""));
          mathSrc = mbuf.join("\n");
        }
        closeAll();
        out.push(texToHtml(mathSrc, true));
        i++;
        continue;
      }
      if (
        /^\s*\|.*\|\s*$/.test(l) &&
        i + 1 < lines.length &&
        /^\s*\|[\s\-:|]+\|\s*$/.test(lines[i + 1])
      ) {
        closeAll();
        var headerCells = l
          .trim()
          .replace(/^\||\|$/g, "")
          .split("|")
          .map(function (c) {
            return inline(c.trim());
          });
        var tbl =
          '<table style="border-collapse:collapse;margin:8px 0;font-size:.95em"><thead><tr>';
        headerCells.forEach(function (c) {
          tbl +=
            '<th style="border:1px solid #c0c0c0;padding:5px 10px;background:#f0f0f0;text-align:left">' +
            c +
            "</th>";
        });
        tbl += "</tr></thead><tbody>";
        i += 2;
        while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) {
          var cells = lines[i]
            .trim()
            .replace(/^\||\|$/g, "")
            .split("|")
            .map(function (c) {
              return inline(c.trim());
            });
          tbl += "<tr>";
          cells.forEach(function (c) {
            tbl +=
              '<td style="border:1px solid #c0c0c0;padding:5px 10px">' +
              c +
              "</td>";
          });
          tbl += "</tr>";
          i++;
        }
        tbl += "</tbody></table>";
        out.push(tbl);
        continue;
      }
      if ((m = l.match(/^(#{1,6})\s+(.*)$/))) {
        closeAll();
        var lvl = m[1].length;
        var sizes = { 1: 22, 2: 18, 3: 15.5, 4: 14, 5: 13, 6: 12.5 };
        var weights = lvl === 1 ? "700" : "600";
        out.push(
          "<h" +
            lvl +
            ' style="font-size:' +
            sizes[lvl] +
            "px;font-weight:" +
            weights +
            ";margin:" +
            (lvl === 1 ? "12px 0 6px" : "10px 0 4px") +
            ";line-height:1.25;" +
            (lvl === 1
              ? "border-bottom:1px solid #d0d0d0;padding-bottom:4px"
              : "") +
            '">' +
            inline(m[2]) +
            "</h" +
            lvl +
            ">"
        );
        i++;
        continue;
      }
      if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(l)) {
        closeAll();
        out.push(
          '<hr style="border:0;border-top:1px solid #c0c0c0;margin:10px 0">'
        );
        i++;
        continue;
      }
      if ((m = l.match(/^\s*>\s?(.*)$/))) {
        if (inList) {
          out.push("</" + inList + ">");
          inList = null;
        }
        if (!inQuote) {
          out.push(
            '<blockquote style="border-left:3px solid #a0a0d0;margin:6px 0;padding:4px 12px;color:#404040;background:#fafaff">'
          );
          inQuote = true;
        }
        out.push('<p style="margin:3px 0">' + inline(m[1]) + "</p>");
        i++;
        continue;
      } else if (inQuote) {
        out.push("</blockquote>");
        inQuote = false;
      }
      if ((m = l.match(/^\s*[-*]\s+\[([ xX])\]\s+(.*)$/))) {
        if (inList && inList !== "ul") {
          out.push("</" + inList + ">");
          inList = null;
        }
        if (!inList) {
          out.push(
            '<ul style="margin:6px 0;padding-left:22px;list-style:none">'
          );
          inList = "ul";
        }
        var checked = m[1] !== " ";
        out.push(
          '<li style="margin:2px 0" data-task="' +
            taskN++ +
            '">' +
            (checked ? '<span style="color:#006000">\u2611</span>' : "\u2610") +
            " " +
            inline(m[2]) +
            "</li>"
        );
        i++;
        continue;
      }
      if ((m = l.match(/^\s*[-*+]\s+(.*)$/))) {
        if (inList && inList !== "ul") {
          out.push("</" + inList + ">");
          inList = null;
        }
        if (!inList) {
          out.push('<ul style="margin:6px 0;padding-left:22px">');
          inList = "ul";
        }
        out.push("<li>" + inline(m[1]) + "</li>");
        i++;
        continue;
      }
      if ((m = l.match(/^\s*\d+\.\s+(.*)$/))) {
        if (inList && inList !== "ol") {
          out.push("</" + inList + ">");
          inList = null;
        }
        if (!inList) {
          out.push('<ol style="margin:6px 0;padding-left:22px">');
          inList = "ol";
        }
        out.push("<li>" + inline(m[1]) + "</li>");
        i++;
        continue;
      }
      if (inList) {
        out.push("</" + inList + ">");
        inList = null;
      }
      if (!l.trim()) {
        out.push('<p style="margin:6px 0"></p>');
        i++;
        continue;
      }
      out.push(
        '<p style="margin:5px 0;line-height:1.55">' + inline(l) + "</p>"
      );
      i++;
    }
    closeAll();
    if (inCode) out.push("</pre>");
    return out.join("");
  }

  var capCache = {};
  function getCap(name) {
    if (capCache[name]) return capCache[name];
    var p;
    try {
      p =
        window.claude && typeof window.claude.use === "function"
          ? Promise.resolve(window.claude.use(name)).catch(function () {
              return null;
            })
          : Promise.resolve(null);
    } catch (e) {
      p = Promise.resolve(null);
    }
    capCache[name] = p;
    return p;
  }
  function fallbackDownload(name, data) {
    try {
      var blob =
        typeof Blob !== "undefined" && data instanceof Blob
          ? data
          : new Blob([data], {
              type: /\.csv$/i.test(name)
                ? "text/csv"
                : /\.json$/i.test(name)
                ? "application/json"
                : "text/plain",
            });
      var url = URL.createObjectURL(blob),
        a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.style.display = "none";
      document.body.append(a);
      a.click();
      setTimeout(function () {
        a.remove();
        URL.revokeObjectURL(url);
      }, 1500);
      return true;
    } catch (e) {
      return false;
    }
  }
  function saveFile(name, data) {
    return getCap("downloads")
      .then(function (dl) {
        if (!dl || typeof dl.save !== "function") {
          if (fallbackDownload(name, data))
            msgBox({
              title: "Save File",
              icon: "info",
              text: "Saved " + name + " to your downloads.",
            });
          else
            msgBox({
              title: "Save File",
              icon: "warn",
              text: "Saving files isn't available in this view.",
            });
          return;
        }
        return dl.save({ filename: name, data: data }).then(
          function () {
            msgBox({
              title: "Save File",
              icon: "info",
              text: "Saved " + name + ".",
            });
          },
          function (e) {
            if (e && e.code === "declined") return;
            msgBox({
              title: "Save File",
              icon: "err",
              text:
                "The file couldn't be saved (" +
                ((e && e.code) || "error") +
                ").",
            });
          }
        );
      })
      .catch(function () {
        msgBox({
          title: "Save File",
          icon: "err",
          text: "The file couldn't be saved.",
        });
      });
  }
  function openUrl(url) {
    var w = null;
    try {
      w = window.open(url, "_blank");
      if (w) w.opener = null;
    } catch (e) {}
    if (!w) {
      var inp = el("input", {
        class: "in",
        value: url,
        readonly: true,
        style: "width:100%;margin-top:8px",
        onfocus: function () {
          this.select();
        },
      });
      msgBox({
        title: "Open Link",
        icon: "info",
        width: 420,
        text: "Your browser blocked the new tab. Copy this address into a browser tab:",
        extra: inp,
      });
    }
  }

  var PROVIDERS = {
    helpy: {
      name: "Helpy",
      icon: "helpy",
      kind: "claude",
      blurb: "Claude, either built-in or via the Anthropic API.",
    },
    lolbit: {
      name: "Lolbit",
      icon: "lolbit",
      kind: "openrouter",
      blurb: "OpenRouter — one key, hundreds of models.",
    },
    handunit: {
      name: "HandUnit",
      icon: "handunit",
      kind: "openai",
      blurb: "OpenAI / ChatGPT API.",
    },
    carnie: {
      name: "Carnie",
      icon: "carnie",
      kind: "deepseek",
      blurb: "DeepSeek API.",
    },
    mystic: {
      name: "Mystic Hippo",
      icon: "mystic",
      kind: "gemini",
      blurb: "Google Gemini API.",
    },
    ollama: {
      name: "M.X.E.S.",
      icon: "mxes",
      kind: "ollama",
      blurb:
        "A local model running on your own computer. Free, private, offline.",
    },
  };
  var ENDPOINTS = {
    openrouter: {
      url: "https://openrouter.ai/api/v1/chat/completions",
      model: "openrouter/free",
      hint: "https://openrouter.ai/keys",
    },
    openai: {
      url: "https://api.openai.com/v1/chat/completions",
      model: "gpt-4o-mini",
      hint: "https://platform.openai.com/api-keys",
    },
    deepseek: {
      url: "https://api.deepseek.com/chat/completions",
      model: "deepseek-chat",
      hint: "https://platform.deepseek.com/api_keys",
    },
    ollama: {
      url: "http://localhost:11434",
      model: "",
      hint: "https://ollama.com/download",
    },
  };
  var KEYS_KEY = "focusdesk96.keys",
    keysMem = null;
  function getKeys() {
    if (keysMem) return keysMem;
    keysMem = {};
    try {
      var j = JSON.parse(localStorage.getItem(KEYS_KEY) || "{}");
      if (isObj(j))
        ["claude", "openai", "deepseek", "gemini", "openrouter"].forEach(
          function (k) {
            if (isStr(j[k])) keysMem[k] = j[k];
          }
        );
    } catch (e) {}
    try {
      var oldOr = localStorage.getItem("focusdesk96.orkey");
      if (oldOr && !keysMem.openrouter) keysMem.openrouter = oldOr;
    } catch (e) {}
    return keysMem;
  }
  function getKey(p) {
    var v = getKeys()[p];
    return isStr(v) ? v : "";
  }
  function setKey(p, v) {
    var ks = getKeys();
    if (v) ks[p] = v;
    else delete ks[p];
    keysMem = ks;
    try {
      localStorage.setItem(KEYS_KEY, JSON.stringify(ks));
      return true;
    } catch (e) {
      return false;
    }
  }
  function localBase() {
    var u = (S.prefs.localUrl || ENDPOINTS.ollama.url).replace(/\/+$/, "");
    u = u
      .replace(/\/v1\/chat\/completions$/i, "")
      .replace(/\/chat\/completions$/i, "")
      .replace(/\/v1$/i, "");
    return u;
  }
  function aiModel(kind) {
    var m = (S.prefs.aiModels || {})[kind] || "";
    if (m) return m;
    if (kind === "openrouter") return S.prefs.orModel || "openrouter/free";
    if (kind === "claude") return "claude-3-5-haiku-latest";
    if (kind === "gemini") return "gemini-2.0-flash";
    if (kind === "ollama") return "";
    var ep = ENDPOINTS[kind];
    return ep ? ep.model : "";
  }
  function orErr(status, body) {
    var msg = "";
    try {
      msg =
        (body && body.error && (body.error.message || body.error.code)) ||
        (body && body.message) ||
        "";
    } catch (e) {}
    var code =
      status === 401 || status === 403
        ? "bad_key"
        : status === 402
        ? "no_credits"
        : status === 429
        ? "rate_limited"
        : status === 404 || status === 400
        ? "bad_model"
        : "upstream_error";
    return { code: code, detail: clip(String(msg), 160), status: status };
  }
  function parseJsonLoose(t) {
    t = String(t)
      .trim()
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/, "")
      .trim();
    try {
      return JSON.parse(t);
    } catch (e) {}
    var a = t.indexOf("["),
      b = t.lastIndexOf("]");
    if (a >= 0 && b > a) {
      try {
        return JSON.parse(t.slice(a, b + 1));
      } catch (e) {}
    }
    var c = t.indexOf("{"),
      d = t.lastIndexOf("}");
    if (c >= 0 && d > c) {
      try {
        return JSON.parse(t.slice(c, d + 1));
      } catch (e) {}
    }
    throw { code: "invalid_json" };
  }
  function openAiStyleChat(ep, key, prompt, opts, kind) {
    var messages = opts.messages || [{ role: "user", content: prompt }];
    var stream = !opts.json && !opts.noStream;
    var full = "",
      rounds = 0,
      maxRounds = opts.json ? 1 : 12;
    var MAXLEN = 200000;
    function round(msgs) {
      rounds++;
      var body = {
        model: aiModel(kind) || ep.model,
        messages: msgs,
        stream: stream,
        max_tokens: opts.maxTokens || (opts.json ? 4000 : 8000),
      };
      if (opts.json) body.response_format = { type: "json_object" };
      var headers = { "Content-Type": "application/json" };
      if (key && key !== "local" && key !== "no-key")
        headers.Authorization = "Bearer " + key;
      if (kind === "openrouter") {
        headers["X-Title"] = "FocusDesk 96";
        try {
          if (/^https?:$/.test(location.protocol))
            headers["HTTP-Referer"] = location.origin;
        } catch (e) {}
      }
      return fetch(ep.url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
        signal: opts.signal,
      }).then(function (res) {
        if (!res.ok)
          return res
            .json()
            .catch(function () {
              return null;
            })
            .then(function (j) {
              throw orErr(res.status, j);
            });
        if (!stream || !res.body || !res.body.getReader) {
          return res.json().then(function (j) {
            if (j && j.error) throw orErr(res.status, j);
            var ch = j && j.choices && j.choices[0];
            var t = ch && ch.message && ch.message.content;
            if (!isStr(t) || !t.trim()) throw { code: "empty" };
            full += t;
            if (opts.onText) opts.onText({ text: full });
            if (
              ch.finish_reason === "length" &&
              rounds < maxRounds &&
              full.length < MAXLEN
            ) {
              return round(
                msgs.concat([
                  { role: "assistant", content: t },
                  {
                    role: "user",
                    content:
                      "Continue exactly where you left off. Do not repeat what you already wrote and do not add any preamble.",
                  },
                ])
              );
            }
            return { text: full };
          });
        }
        var rd = res.body.getReader(),
          dec = new TextDecoder(),
          buf = "",
          seg = "",
          hitLength = false;
        function pump() {
          return rd.read().then(function (r) {
            if (r.done) {
              full += seg;
              if (opts.onText) opts.onText({ text: full });
              if (hitLength && rounds < maxRounds && full.length < MAXLEN) {
                return round(
                  msgs.concat([
                    { role: "assistant", content: seg },
                    {
                      role: "user",
                      content:
                        "Continue exactly where you left off. Do not repeat what you already wrote and do not add any preamble.",
                    },
                  ])
                );
              }
              if (!full.trim()) throw { code: "empty" };
              return { text: full };
            }
            buf += dec.decode(r.value, { stream: true });
            var lines = buf.split(/\r?\n/);
            buf = lines.pop();
            lines.forEach(function (ln) {
              if (ln.indexOf("data:") !== 0) return;
              var d = ln.slice(5).trim();
              if (!d || d === "[DONE]") return;
              var j = null;
              try {
                j = JSON.parse(d);
              } catch (x) {
                return;
              }
              if (j.error) throw orErr(200, j);
              var ch = j.choices && j.choices[0];
              if (ch && ch.finish_reason === "length") hitLength = true;
              var c = ch && ch.delta && ch.delta.content;
              if (isStr(c) && c) {
                seg += c;
                if (opts.onText) opts.onText({ text: full + seg });
              }
            });
            return pump();
          });
        }
        return pump();
      });
    }
    return round(messages).catch(function (e) {
      if (e && e.name === "AbortError") throw { code: "cancelled" };
      if (e && e.code) throw e;
      throw { code: "network" };
    });
  }
  function geminiChat(prompt, opts) {
    var key = getKey("gemini");
    if (!key) return Promise.reject({ code: "no_key" });
    var url =
      "https://generativelanguage.googleapis.com/v1beta/models/" +
      encodeURIComponent(aiModel("gemini")) +
      ":generateContent?key=" +
      encodeURIComponent(key);
    var body = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: opts.maxTokens || 8192 },
    };
    if (opts.json) body.generationConfig.responseMimeType = "application/json";
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: opts.signal,
    })
      .then(function (res) {
        return res.json().then(function (j) {
          if (!res.ok) throw orErr(res.status, j);
          var cand = j && j.candidates && j.candidates[0];
          var t =
            cand &&
            cand.content &&
            cand.content.parts &&
            cand.content.parts
              .map(function (p) {
                return p.text || "";
              })
              .join("");
          if (!isStr(t) || !t.trim()) throw { code: "empty" };
          if (opts.onText) opts.onText({ text: t });
          return { text: t };
        });
      })
      .catch(function (e) {
        if (e && e.name === "AbortError") throw { code: "cancelled" };
        if (e && e.code) throw e;
        throw { code: "network" };
      });
  }
  function claudeApiChat(prompt, opts) {
    var key = getKey("claude");
    if (!key) return Promise.reject({ code: "no_key" });
    return fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: aiModel("claude"),
        max_tokens: opts.maxTokens || 8192,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: opts.signal,
    })
      .then(function (res) {
        return res.json().then(function (j) {
          if (!res.ok) throw orErr(res.status, j);
          var t =
            j && j.content
              ? j.content
                  .map(function (c) {
                    return c.text || "";
                  })
                  .join("")
              : "";
          if (!isStr(t) || !t.trim()) throw { code: "empty" };
          if (opts.onText) opts.onText({ text: t });
          return { text: t };
        });
      })
      .catch(function (e) {
        if (e && e.name === "AbortError") throw { code: "cancelled" };
        if (e && e.code) throw e;
        throw { code: "network" };
      });
  }
  var capSample = null;
  /* ---- is the assistant reachable? cloud ones need a connection; the local model only fails if it can't be reached ---- */
  var aiFail = {},
    aiNetListeners = {};
  function assistantState(m) {
    if (m === "off") return { ok: false, off: true, why: "" };
    var local = m === "ollama";
    if (!local && navigator.onLine === false) return { ok: false, why: "offline" };
    if (aiFail[m] && Date.now() - aiFail[m] < 90000) return { ok: false, why: local ? "can't reach your local model" : "can't reach the provider" };
    return { ok: true, why: "" };
  }
  function fireAiNet() {
    Object.keys(aiNetListeners).forEach(function (k) {
      try {
        aiNetListeners[k]();
      } catch (e) {}
    });
  }
  window.addEventListener("online", function () {
    aiFail = {};
    fireAiNet();
  });
  window.addEventListener("offline", fireAiNet);
  function aiChat(prov, prompt, opts) {
    return aiChat0(prov, prompt, opts).then(
      function (r) {
        if (aiFail[prov]) {
          delete aiFail[prov];
          fireAiNet();
        }
        return r;
      },
      function (e) {
        if (e && e.code === "network") {
          aiFail[prov] = Date.now();
          fireAiNet();
        }
        throw e;
      }
    );
  }
  function aiChat0(prov, prompt, opts) {
    opts = opts || {};
    var p = PROVIDERS[prov];
    if (!p) return Promise.reject({ code: "no_backend" });
    if (p.kind === "claude") {
      if (S.prefs.claudeMode === "api")
        return claudeApiChat(prompt, opts).then(function (r) {
          return opts.json ? parseJsonLoose(r.text) : r;
        });
      if (!capSample) return Promise.reject({ code: "no_backend" });
      return opts.json ? capSample.json(prompt, opts) : capSample(prompt, opts);
    }
    if (p.kind === "gemini")
      return geminiChat(prompt, opts).then(function (r) {
        return opts.json ? parseJsonLoose(r.text) : r;
      });
    if (p.kind === "ollama") {
      var mdl = aiModel("ollama");
      if (!mdl) return Promise.reject({ code: "no_model" });
      var ep = { url: localBase() + "/v1/chat/completions", model: mdl };
      return openAiStyleChat(ep, "local", prompt, opts, "ollama").then(
        function (r) {
          return opts.json ? parseJsonLoose(r.text) : r;
        }
      );
    }
    var key = getKey(p.kind);
    if (!key) return Promise.reject({ code: "no_key" });
    return openAiStyleChat(ENDPOINTS[p.kind], key, prompt, opts, p.kind).then(
      function (r) {
        return opts.json ? parseJsonLoose(r.text) : r;
      }
    );
  }

  function fsElement() {
    return (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement ||
      null
    );
  }
  function fsFallback(blocked) {
    msgBox({
      title: "Full Screen",
      icon: "info",
      width: 410,
      text:
        (blocked
          ? "Your browser blocked full screen here. This often happens when the page is embedded inside another page."
          : "This browser doesn't allow full-screen web pages.") +
        "\n\nTry one of these:\n\u2022 Open the page in its own tab or window, then try again.\n\u2022 On a computer: press F11 (Windows or Linux) or Control+Command+F (Mac).",
    });
  }
  function toggleFullscreen() {
    if (fsElement()) {
      var ex =
        document.exitFullscreen ||
        document.webkitExitFullscreen ||
        document.msExitFullscreen;
      try {
        var p = ex && ex.call(document);
        if (p && p.catch) p.catch(function () {});
      } catch (e) {}
      return;
    }
    var de = document.documentElement,
      req =
        de.requestFullscreen ||
        de.webkitRequestFullscreen ||
        de.msRequestFullscreen;
    if (!req) {
      fsFallback(false);
      return;
    }
    try {
      var p2 = req.call(de, { navigationUI: "hide" });
      if (p2 && p2.catch)
        p2.catch(function () {
          fsFallback(true);
        });
    } catch (e) {
      fsFallback(true);
    }
  }
  function updFs() {
    var b = document.getElementById("fsbtn");
    if (!b) return;
    b.textContent = "";
    b.append(pix(fsElement() ? "fullx" : "full", 16));
    b.title = fsElement()
      ? "Exit full screen (Alt+Enter)"
      : "Full screen (Alt+Enter)";
  }
  function copyFor(e) {
    var c = e && e.code;
    if (c === "cancelled") return "Stopped.";
    if (c === "no_backend")
      return "Pick an assistant in Control Panel → Assistant first.";
    if (c === "no_key")
      return "Add that assistant's API key in Control Panel → Assistant, then try again.";
    if (c === "bad_key") return "The provider didn't accept that API key.";
    if (c === "no_credits")
      return "That account has no credit left. Try a free model.";
    if (c === "bad_model") return "The provider couldn't use that model.";
    if (c === "empty") return "The model returned an empty answer.";
    if (c === "network") {
      if (navigator.onLine === false)
        return "You're offline, so this assistant can't be reached. It will work again when you're back online.";
      if (window.self === window.top)
        return "Couldn't reach the assistant. Check your connection (or that your local model is running), then try again.";
      return "Couldn't reach the provider. Pages inside Claude block outside connections — download the page and open it in your browser (or host it).";
    }
    if (c === "not_granted") return "Claude access was declined for this page.";
    if (c === "rate_limited")
      return "Too many requests, or a usage limit was reached.";
    if (c === "invalid_json")
      return "The model's answer wasn't in the expected format.";
    if (c === "session_expired")
      return "Please sign in to Claude again, then retry.";
    if (
      c === "sampling_disabled" ||
      c === "not_declared" ||
      c === "capability_disabled" ||
      c === "capability_removed"
    )
      return "The built-in Claude helper isn't available.";
    if (c === "refused")
      return "The assistant couldn't help with that request.";
    if (c === "prompt_too_large") return "That note is too long.";
    if (c === "no_model")
      return "M.X.E.S. needs a model name. Open Control Panel → Assistant, click \u201cFetch models\u201d next to M.X.E.S., then pick one from the list.";
    return (
      "Something went wrong with the assistant (" +
      (e && e.detail ? e.detail : c || "error") +
      ")."
    );
  }

  var VGA = {
    k: "#000000",
    w: "#ffffff",
    g: "#c0c0c0",
    d: "#808080",
    R: "#800000",
    r: "#ff0000",
    G: "#008000",
    l: "#00ff00",
    O: "#808000",
    y: "#ffff00",
    N: "#000080",
    b: "#0000ff",
    P: "#800080",
    m: "#ff00ff",
    T: "#008080",
    c: "#00ffff",
  };
  var ICONS = {
    calendar: [
      "....kk.....kk...",
      "....dk.....dk...",
      ".kkkdkkkkkkdkkk.",
      ".krrkkrrrrrkkrk.",
      ".krrrrrrrrrrrrk.",
      ".kkkkkkkkkkkkkk.",
      ".kwwwwwwwwwwwwk.",
      ".kwdwdwdwdwdwwk.",
      ".kwwwwwwwwwwwwk.",
      ".kwdwdwdwdwdwwk.",
      ".kwwwwwwwwwwwwk.",
      ".kwdwdwdwrrdwwk.",
      ".kwwwwwwwrrwwwk.",
      ".kwdwdwdwdwdwwk.",
      ".kkkkkkkkkkkkkk.",
      "..dddddddddddddd",
    ],
    notepad: [
      "...kk.kk.kk.kk..",
      "...dk.dk.dk.dk..",
      "..kkkkkkkkkkkk..",
      "..kkkNkkNkkNkk..",
      "..kNNNNNNNNNNk.d",
      "..kkkkkkkkkkkk.d",
      "..kwwwwwwwwwwk.d",
      "..kwbbbbbbbbwk.d",
      "..kwwwwwwwwwwk.d",
      "..kwbbbbbbbbwk.d",
      "..kwwwwwwwwwwk.d",
      "..kwbbbbbbbbwk.d",
      "..kwwwwwwwwwwk.d",
      "..kwbbbbbbbbwk.d",
      "..kkkkkkkkkkkk.d",
      "...ddddddddddddd",
    ],
    alarm: [
      "................",
      "................",
      ".kkkk..kk..kkkk.",
      ".krrkkkkkkkkrrk.",
      ".krrkwwkwwwkrrk.",
      ".kkkwwwkwwwwkkk.",
      "..kwwwwkwwwwwk..",
      "..kwwwwkwwwwwk..",
      "..kwwwwkkkkwwk..",
      "..kwwwwwwwwwwk..",
      "..kwwwwwwwwwwk..",
      "..kwwwwwwwwwwk..",
      "...kwwwwwwwwk...",
      "....kwwwwwwk....",
      ".....kkkkkk.....",
      "...kk......kk...",
    ],
    hourglass: [
      "..kkkkkkkkkkkk..",
      "..kddddddddddk..",
      "..kkkkkkkkkkkk..",
      "...kwwwwwwwwk...",
      "...kwyyyyyywk...",
      "....kwyyyywk....",
      ".....kwyywk.....",
      "......kwwk......",
      "......kyyk......",
      ".....kwyywk.....",
      "....kwwyywwk....",
      "...kwwyyyywwk...",
      "...kyyyyyyyyk...",
      "..kkkkkkkkkkkk..",
      "..kddddddddddk..",
      "..kkkkkkkkkkkk..",
    ],
    cap: [
      "................",
      "................",
      ".......kk.......",
      ".....kkgdkk.....",
      "...kkkgdddkkk...",
      ".kkkdgddddddkkk.",
      "kkkdgddddddddkkk",
      ".kkddddddddddky.",
      "...kkkkkkkkkk.y.",
      "...kNNNNNNNNk.y.",
      "...kNNNNNNNNk.y.",
      "...kNNNNNNNNk.y.",
      "...kkkkkkkkkkyyy",
      ".............yyy",
      "................",
      "................",
    ],
    cards: [
      "................",
      ".....kkkkkkkkkk.",
      ".....kyyyyyyyyk.",
      ".kkkkkkkkkkkkyk.",
      ".kNNNNNNNNNNkyk.",
      ".kNNNNNNNNNNkyk.",
      ".kkkkkkkkkkkkyk.",
      ".kwwwwwwwwwwkyk.",
      ".kwbbbbbbbbwkyk.",
      ".kwwwwwwwwwwkkk.",
      ".kwbbbbbbbbwk...",
      ".kwwwwwwwwwwk...",
      ".kwbbbbbwwwwk...",
      ".kkkkkkkkkkkk...",
      "................",
      "..dddddddddddd..",
    ],
    magnifier: [
      "................",
      ".....kkk........",
      "...kkccckk......",
      "..kcwwcccck.....",
      "..kwcccccck.....",
      ".kcwccccccck....",
      ".kccccccccck....",
      ".kccccccccck....",
      "..kccccccck.....",
      "..kccccccck.....",
      "...kkccckkkk....",
      ".....kkk..kRk...",
      "...........kRk..",
      "............kRk.",
      ".............kRk",
      "..............kk",
    ],
    control: [
      "................",
      "kkkkkkkkkkkkkkkk",
      "kwwwwwwwwwwwwwwk",
      "kggggggggggggggk",
      "kgkkkkkgkgggkggk",
      "kgkwdwkgkgkkkkkk",
      "kgkkkkkgkgkwdwkk",
      "kgggkgggkgkkkkkk",
      "kgggkgkkkkkgkggk",
      "kgggkgkwdwkgkggk",
      "kgggkgkkkkkgkggk",
      "kgggkgggkgggkggk",
      "kgggkgggkgggkggk",
      "kgggkgggkgggkggk",
      "kkkkkkkkkkkkkkkk",
      ".ddddddddddddddd",
    ],
    bin: [
      "................",
      ".....kkkkkk.....",
      ".....kggggk.....",
      "..kkkkkkkkkkkk..",
      "..kggggggggggk..",
      "..kkkkkkkkkkkk..",
      "...kggggggggk...",
      "...kgdgdgdgdk...",
      "...kgdgdgdgdk...",
      "...kgdgdgdgdk...",
      "...kgdgdgdgdk...",
      "...kgdgdgdgdk...",
      "...kgdgdgdgdk...",
      "...kgdgdgdgdk...",
      "...kgggggggdk...",
      "...kkkkkkkkkk...",
    ],
    sun: [
      "y......y......y.",
      ".y.....y......y.",
      "................",
      "................",
      "......OOOO......",
      ".....OyyyyO.....",
      "....OywyyyyO....",
      "yy..OwyyyyyO..y.",
      "....OyyyyyyO....",
      "....OyyyyyyO....",
      ".....OyyyyO.....",
      "......OOOO......",
      "................",
      "................",
      "yy.....y......y.",
      "................",
    ],
    tasks: [
      ".....kkkkkk.....",
      ".....kggggk.....",
      "..kkkkddddkkkk..",
      "..kOOkkkkkkOOk..",
      "..kkkkkkkkkkkk..",
      "..kkwwwwwwwwkk..",
      "..kkwlGwddddkk..",
      "..kkwGGwddddkk..",
      "..kkwwwwwwwwkk..",
      "..kkwGGwddddkk..",
      "..kkwGGwddddkk..",
      "..kkwwwwwwwwkk..",
      "..kkwGGwddddkk..",
      "..kkkGGkddddkk..",
      "..kkkkkkkkkkkk..",
      "................",
    ],
    grades: [
      "................",
      "..kkkkkkkkkkkk..",
      "..kwwwwwwwwwwk..",
      "..kwwrwwwwrwwk..",
      "..kwrwrwwrrrwk..",
      "..kwrrrwwwrwwk..",
      "..kwrwrwwwwwwk..",
      "..kwrwrwwwwwwk..",
      "..kwwwwwwwwwwk..",
      "..kwwwwwwwwwwk..",
      "..kwddddddddwk..",
      "..kwwwwwwwwwwk..",
      "..kwddddddddwk..",
      "..kwwwwwwwwwwk..",
      "..kkkkkkkkkkkk..",
      "...ddddddddddddd",
    ],
    calc: [
      "..kkkkkkkkkkkk..",
      "..kggggggggggk..",
      "..kgddddddddgk..",
      "..kgdkkkkkkdgk..",
      "..kgddddddddgk..",
      "..kggggggggggk..",
      "..kggggggggggk..",
      "..kgbbgbbgrrgk..",
      "..kgddgddgddgk..",
      "..kgbbgbbgrrgk..",
      "..kgddgddgddgk..",
      "..kgbbgbbgrrgk..",
      "..kgddgddgddgk..",
      "..kggggggggggk..",
      "..kkkkkkkkkkkk..",
      "...ddddddddddddd",
    ],
    mine: [
      "................",
      "................",
      ".......kk.......",
      ".......kk.......",
      "...k...kk...k...",
      "....kkkkkkkk....",
      "....kwwkkkkk....",
      "....kwkkkkkk....",
      ".kkkkkkkkkkkkkk.",
      ".kkkkkkkkkkkkkk.",
      "....kkkkkkkk....",
      "....kkkkkkkk....",
      "....kkkkkkkk....",
      "...k...kk...k...",
      ".......kk.......",
      ".......kk.......",
    ],
    paint: [
      ".............kRk",
      "............kRk.",
      "...........kRk..",
      ".....OOOO.kRk...",
      "...OOyyyykRk....",
      "..OyybbykRkO....",
      "..OyybbybkyO....",
      ".OyrryyybbPPO...",
      ".OyrryyyyyPPO...",
      ".OyyyyyyyyyyO...",
      ".OymmyyyyyyyO...",
      ".OymmyyyyyOyO...",
      "..OyyyyyyO.O....",
      "..OyyyyyyyOO....",
      "...OOyyyyOO.....",
      ".....OOOO.......",
    ],
    bulb: [
      "................",
      "................",
      ".y...OOOOOO...y.",
      "....OywyyyyO....",
      "....OwyyyyyO....",
      "...OywyyyyyyO...",
      "y..OyyyyyyyyO..y",
      "...OyyyyyyyyO...",
      "....OyyyyyyO....",
      "....OyyyyyyO....",
      ".....OOOOOO.....",
      "......dddd......",
      "......kkkk......",
      "......dddd......",
      ".......kk.......",
      "................",
    ],
    run: [
      "................",
      "................",
      "kkkkkkkkkkkkkkkk",
      "kNNNNNNNNNNNNNNk",
      "kNNNNNNNNNNNNNNk",
      "kkkkkkkkkkkkkkkk",
      "kwwwwwwwwwwwwwwk",
      "kwwwkwwwwwwwwwwk",
      "kwwwkkwwwwwwwwwk",
      "kwwwwkkwwwwwwwwk",
      "kwwwwkkwwwwwwwwk",
      "kwwwkwwwkkkkwwwk",
      "kwwwwwwwwwwwwwwk",
      "kkkkkkkkkkkkkkkk",
      "................",
      "................",
    ],
    shutdown: [
      "................",
      ".kkkkkkkkkkkkkk.",
      ".kggggggggggggk.",
      ".kgddddddddddgk.",
      ".kgdccTTTTTTdgk.",
      ".kgdTTTTTTTTdgk.",
      ".kgdTTTTTTTTdgk.",
      ".kgdTTTTTTTTdgk.",
      ".kgddddddddddgk.",
      ".kggggggggggggk.",
      ".kkkkkkkkkkklkk.",
      "......gggg......",
      "......gggg......",
      "...kkkkkkkkkk...",
      "...kkkkkkkkkk...",
      "................",
    ],
    folder: [
      "................",
      "................",
      "................",
      "OOOOOOO.........",
      "OyyyyyO.........",
      "OOOOOOOOOOOOOOOO",
      "OwwwwwwwwwwwwwwO",
      "OyyyyyyyyyyyyyyO",
      "OyyyyyyyyyyyyyyO",
      "OyyyyyyyyyyyyyyO",
      "OyyyyyyyyyyyyyyO",
      "OyyyyyyyyyyyyyyO",
      "OyyyyyyyyyyyyyyO",
      "OyyyyyyyyyyyyyyO",
      "OOOOOOOOOOOOOOOO",
      "................",
    ],
    programs: [
      "................",
      "................",
      "................",
      "OOOOOOO.........",
      "OyyyyyO.........",
      "OOOOOOOOOOOOOOOO",
      "OwwwwwwwwwwwwwwO",
      "OyyyyyyyyyyyyyyO",
      "OyyyykkkkkkkkkyO",
      "OyyyykNNNNNNNkyO",
      "OyyyykwwwwwwwkyO",
      "OyyyykwwwwwwwkyO",
      "OyyyykwwwwwwwkyO",
      "OyyyykkkkkkkkkyO",
      "OOOOOOOOOOOOOOOO",
      "................",
    ],
    spk: [
      "................",
      "................",
      "................",
      "......kk....k...",
      "....kkkk...kk...",
      ".kkkkkkk..k.k...",
      ".kwkkkkk..k.k...",
      ".kwkkkkk..k.k...",
      ".kwkkkkk..k.k...",
      ".kwkkkkk..k.k...",
      ".kkkkkkk..k.k...",
      "....kkkk...kk...",
      "......kk....k...",
      "................",
      "................",
      "................",
    ],
    spk0: [
      "................",
      "................",
      "................",
      "......kk........",
      "....kkkk........",
      ".kkkkkkk.r...r..",
      ".kwkkkkk..r.r...",
      ".kwkkkkk...r....",
      ".kwkkkkk..r.r...",
      ".kwkkkkk.r...r..",
      ".kkkkkkk........",
      "....kkkk........",
      "......kk........",
      "................",
      "................",
      "................",
    ],
    info: [
      "................",
      "......kkkk......",
      "....kkbbbbkk....",
      "...kbbbwwbbbk...",
      "..kbbbbwwbbbbk..",
      "..kbbbbbbbbbbk..",
      ".kbbbbwwwbbbbbk.",
      ".kbbbbbwwbbbbbk.",
      ".kbbbbbwwbbbbbk.",
      ".kbbbbbwwbbbbbk.",
      "..kbbbbwwbbbbk..",
      "..kbbbwwwwbbbk..",
      "...kbbbbbbbbk...",
      "....kkbbbbkk....",
      "......kkkk......",
      "................",
    ],
    warn: [
      "................",
      ".......kk.......",
      ".......kk.......",
      "......kyyk......",
      "......kyyk......",
      ".....kykkyk.....",
      ".....kykkyk.....",
      "....kyykkyyk....",
      "....kyykkyyk....",
      "...kyyykkyyyk...",
      "...kyyyyyyyyk...",
      "..kyyyykkyyyyk..",
      ".kyyyyykkyyyyyk.",
      ".kyyyyyyyyyyyyk.",
      "kkkkkkkkkkkkkkkk",
      "................",
    ],
    err: [
      "................",
      "......kkkk......",
      "....kkrrrrkk....",
      "...krrrrrrrrk...",
      "..krwwrrrrwwrk..",
      "..krrwwrrwwrrk..",
      ".krrrrwwwwrrrrk.",
      ".krrrrrwwrrrrrk.",
      ".krrrrwwwwrrrrk.",
      ".krrrwwrrwwrrrk.",
      "..krrrrrrrrrrk..",
      "..krrrrrrrrrrk..",
      "...krrrrrrrrk...",
      "....kkrrrrkk....",
      "......kkkk......",
      "................",
    ],
    q: [
      "................",
      "......kkkk......",
      "....kkbbbbkk....",
      "...kbbbbbbbbk...",
      "..kbbwwwwwwbbk..",
      "..kbbwbbbbwbbk..",
      ".kbbbbbbbbwbbbk.",
      ".kbbbbbbwwbbbbk.",
      ".kbbbbbwwbbbbbk.",
      ".kbbbbbwwbbbbbk.",
      "..kbbbbbbbbbbk..",
      "..kbbbbwwbbbbk..",
      "...kbbbwwbbbk...",
      "....kkbbbbkk....",
      "......kkkk......",
      "................",
    ],
    f_smile: [
      "................",
      ".....kkkkkk.....",
      "....kyyyyyyk....",
      "...kyyyyyyyyk...",
      "..kyyyyyyyyyyk..",
      ".kyyykyyyykyyyk.",
      ".kyyykyyyykyyyk.",
      ".kyyyyyyyyyyyyk.",
      ".kyyyyyyyyyyyyk.",
      ".kyykyyyyyykyyk.",
      ".kyykyyyyyykyyk.",
      "..kyykkkkkkyyk..",
      "...kyyyyyyyyk...",
      "....kyyyyyyk....",
      ".....kkkkkk.....",
      "................",
    ],
    f_wow: [
      "................",
      ".....kkkkkk.....",
      "....kyyyyyyk....",
      "...kyyyyyyyyk...",
      "..kyyyyyyyyyyk..",
      ".kyyykyyyykyyyk.",
      ".kyyykyyyykyyyk.",
      ".kyyyyyyyyyyyyk.",
      ".kyyyyyyyyyyyyk.",
      ".kyyyyykkyyyyyk.",
      ".kyyyyykkyyyyyk.",
      "..kyyyykkyyyyk..",
      "...kyyyyyyyyk...",
      "....kyyyyyyk....",
      ".....kkkkkk.....",
      "................",
    ],
    f_dead: [
      "................",
      ".....kkkkkk.....",
      "....kyyyyyyk....",
      "...kyyyyyyyyk...",
      "..kykykyykykyk..",
      ".kyyykyyyykyyyk.",
      ".kyykykyykykyyk.",
      ".kyyyyyyyyyyyyk.",
      ".kyyyyyyyyyyyyk.",
      ".kyyyyyyyyyyyyk.",
      ".kyyyyyyyyyyyyk.",
      "..kyykkkkkkyyk..",
      "...kkyyyyyykk...",
      "....kyyyyyyk....",
      ".....kkkkkk.....",
      "................",
    ],
    f_cool: [
      "................",
      ".....kkkkkk.....",
      "....kyyyyyyk....",
      "...kyyyyyyyyk...",
      "..kyyyyyyyyyyk..",
      ".kykkkkkkkkkkyk.",
      ".kykkkkkkkkkkyk.",
      ".kyykkkyykkkyyk.",
      ".kyyyyyyyyyyyyk.",
      ".kyykyyyyyykyyk.",
      ".kyykyyyyyykyyk.",
      "..kyykkkkkkyyk..",
      "...kyyyyyyyyk...",
      "....kyyyyyyk....",
      ".....kkkkkk.....",
      "................",
    ],
    f_meh: [
      "................",
      ".....kkkkkk.....",
      "....kyyyyyyk....",
      "...kyyyyyyyyk...",
      "..kyyyyyyyyyyk..",
      ".kyyykyyyykyyyk.",
      ".kyyykyyyykyyyk.",
      ".kyyyyyyyyyyyyk.",
      ".kyyyyyyyyyyyyk.",
      ".kyyyyyyyyyyyyk.",
      ".kyyyyyyyyyyyyk.",
      "..kyykkkkkkyyk..",
      "...kyyyyyyyyk...",
      "....kyyyyyyk....",
      ".....kkkkkk.....",
      "................",
    ],
    f_sad: [
      "................",
      ".....kkkkkk.....",
      "....kyyyyyyk....",
      "...kyyyyyyyyk...",
      "..kyyyyyyyyyyk..",
      ".kyyykyyyykyyyk.",
      ".kyyykyyyykyyyk.",
      ".kyyyyyyyyyyyyk.",
      ".kyyyyyyyyyyyyk.",
      ".kyyyyyyyyyyyyk.",
      ".kyyykkkkkkyyyk.",
      "..kykyyyyyykyk..",
      "...kyyyyyyyyk...",
      "....kyyyyyyk....",
      ".....kkkkkk.....",
      "................",
    ],
    mflag: [
      "................",
      "................",
      "....rrrrk.......",
      "...rrrrrk.......",
      "..rrrrrrk.......",
      "...rrrrrk.......",
      "....rrrrk.......",
      "........k.......",
      "........k.......",
      "........k.......",
      "........k.......",
      ".....kkkkkkk....",
      "...kkkkkkkkkkk..",
      "...kkkkkkkkkkk..",
      "................",
      "................",
    ],
    flag: [
      "................",
      "................",
      ".rrrrrr.GGGGGG..",
      ".rrrrrr.GGGGGG..",
      ".rrrrrr.GGGGGG..",
      ".rrrrrr.GGGGGG..",
      ".rrrrrr.GGGGGG..",
      "................",
      ".bbbbbb.yyyyyy..",
      ".bbbbbb.yyyyyy..",
      ".bbbbbb.yyyyyy..",
      ".bbbbbb.yyyyyy..",
      ".bbbbbb.yyyyyy..",
      "................",
      "................",
      "................",
    ],
    schedule: [
      "................",
      ".kkkkkkkkkkkkkk.",
      ".kNNNNNNNNNNNNk.",
      ".kNNNNNNNNNNNNk.",
      ".kwwwdwwdwwdwwk.",
      ".krrrdwwdGGdwwk.",
      ".krrrdwwdGGdwwk.",
      ".kddddddddddddk.",
      ".kwwwdbbdwwdwwk.",
      ".kwwwdbbdwwdwwk.",
      ".kddddddddddddk.",
      ".kwwwdmmdwwdyyk.",
      ".kwwwdmmdwwdyyk.",
      ".kwwwdwwdwwdwwk.",
      ".kkkkkkkkkkkkkk.",
      "..dddddddddddddd",
    ],
    stats: [
      "kkkkkkkkkkkkkkkk",
      "kwwwwwwwwwwwwwwk",
      "kwkwwwwwwwwwwwwk",
      "kwkwwwwwwwwwwyyk",
      "kwkwwwwbbwwwwyyk",
      "kwkwwwwbbwwwwyyk",
      "kwkwwwwbbwGGwyyk",
      "kwkwwwwbbwGGwyyk",
      "kwkwrrwbbwGGwyyk",
      "kwkwrrwbbwGGwyyk",
      "kwkwrrwbbwGGwyyk",
      "kwkwrrwbbwGGwyyk",
      "kwkkkkkkkkkkkkkk",
      "kwwwwwwwwwwwwwwk",
      "kwwddddddddddddk",
      "kkkkkkkkkkkkkkkk",
    ],
    book: [
      "................",
      "..kkkkkkkkkkkk..",
      "..kNkNNNNNNNkw..",
      "..kNkNOOOOOOkwg.",
      "..kNkNOyyyyOkwg.",
      "..kNkNOOOOOOkwg.",
      "..kNkNNNNNNNkwg.",
      "..kNkNNNNNNNkwg.",
      "..kNkNddddddkwg.",
      "..kNkNNNNNNNkwg.",
      "..kNkNddddddkwg.",
      "..kNkNNNNNNNkwg.",
      "..kNkNdddrrNkwg.",
      "..kNkNNNNrrNkwg.",
      "..kkkkkkkrrkk.g.",
      "..kkkkkkkkkkkk..",
    ],
    find: [
      "................",
      ".kkkkkkkkk......",
      ".kwwwwwwwk......",
      ".kwdddddwk......",
      ".kwwwwwwwk......",
      ".kwdddddwk......",
      ".kwwwwwwwkkk....",
      ".kwddddwkwcck...",
      ".kwwwwwkwcccck..",
      ".kwwwwwkccccck..",
      ".kwwwwwkccccck..",
      ".kwwwwwkcccckk..",
      ".kkkkkkkkcckkk..",
      ".........kkkkRk.",
      ".............kRk",
      "..............kk",
    ],
    image: [
      "................",
      "................",
      "kkkkkkkkkkkkkkkk",
      "kggggggggggggggk",
      "kgkkkkkkkkkkkkgk",
      "kgkcccccccyyckgk",
      "kgkcccccccyyckgk",
      "kgkccwwcccccckgk",
      "kgkccGGcccccckgk",
      "kgkcGGGGccGcckgk",
      "kgkGGGGGGGGGGkgk",
      "kgkGGGGGGGGGGkgk",
      "kggggggggggggggk",
      "kkkkkkkkkkkkkkkk",
      "................",
      "................",
    ],
    su_h: [
      "................",
      "................",
      "................",
      "...rrrr..rrrr...",
      "..rrrrrrrrrrrr..",
      "..rrrrrrrrrrrr..",
      "..rrrrrrrrrrrr..",
      ".rrrrrrrrrrrrrr.",
      ".rrrrrrrrrrrrrr.",
      "..rrrrrrrrrrrr..",
      "...rrrrrrrrrr...",
      "....rrrrrrrr....",
      ".....rrrrrr.....",
      "......rrrr......",
      ".......rr.......",
      "................",
    ],
    su_s: [
      "................",
      ".......kk.......",
      "......kkkk......",
      ".....kkkkkk.....",
      "....kkkkkkkk....",
      "...kkkkkkkkkk...",
      "..kkkkkkkkkkkk..",
      "..kkkkkkkkkkkk..",
      "..kkkkkkkkkkkk..",
      "..kkkkkkkkkkkk..",
      "..kkkkkkkkkkkk..",
      "..kkkkkkkkkkkk..",
      "...kkkkkkkkkk...",
      ".......kk.......",
      ".....kkkkkk.....",
      "................",
    ],
    su_c: [
      "................",
      "................",
      "......kkkk......",
      ".....kkkkkk.....",
      ".....kkkkkk.....",
      ".....kkkkkk.....",
      "....kkkkkkkk....",
      "..kkkkkkkkkkkk..",
      "..kkkkkkkkkkkk..",
      "..kkkkkkkkkkkk..",
      "..kkkkkkkkkkkk..",
      "..kkkkkkkkkkkk..",
      "....kk.kk.kk....",
      ".......kk.......",
      ".....kkkkkk.....",
      "................",
    ],
    su_d: [
      ".......rr.......",
      "......rrrr......",
      ".....rrrrrr.....",
      "....rrrrrrrr....",
      "...rrrrrrrrrr...",
      "..rrrrrrrrrrrr..",
      ".rrrrrrrrrrrrrr.",
      "rrrrrrrrrrrrrrrr",
      "rrrrrrrrrrrrrrrr",
      ".rrrrrrrrrrrrrr.",
      "..rrrrrrrrrrrr..",
      "...rrrrrrrrrr...",
      "....rrrrrrrr....",
      ".....rrrrrr.....",
      "......rrrr......",
      ".......rr.......",
    ],
    sol: [
      "................",
      "......kkkkkkkkk.",
      "......kwwwwwwwk.",
      "......kwwwkwwwk.",
      ".kkkkkkkkkkkwwk.",
      ".kwwwwwwwkkkkwk.",
      ".kwwwwwwwkkkkwk.",
      ".kwwrwrwwkkwwwk.",
      ".kwrrrrrwkwwwwk.",
      ".kwwrrrwwkwwwwk.",
      ".kwwwrwwwkwwwwk.",
      ".kwwwwwwwkkkkkk.",
      ".kwwwwwwwk......",
      ".kwwwwwwwk......",
      ".kkkkkkkkk......",
      "................",
    ],
    mem: [
      "................",
      "................",
      ".kkkkkkk........",
      ".kbbbbbk........",
      ".kbwbwbkkkkkkkk.",
      ".kbbbbbkkwwwwwk.",
      ".kbbwbbkkwrrrwk.",
      ".kbbbbbkkwwwrwk.",
      ".kbwbwbkkwwrrwk.",
      ".kbbbbbkkwwwwwk.",
      ".kbbwbbkkwwrwwk.",
      ".kbbbbbkkwwwwwk.",
      ".kkkkkkkkwwwwwk.",
      "........kwwwwwk.",
      "........kkkkkkk.",
      "................",
    ],
    sticky: [
      "................",
      ".......kkk......",
      ".OOOOOkrrrkOOOO.",
      ".OyyyykrrrkyyyO.",
      ".OyyyyykkkyyyyO.",
      ".OyyyyyyyyyyyyO.",
      ".OyyyyyyyyyyyyO.",
      ".OyOOOOOOOOOOyO.",
      ".OyyyyyyyyyyyyO.",
      ".OyOOOOOOOOOOyO.",
      ".OyyyyyyyyyyyyO.",
      ".OyOOOOOOOyyyyO.",
      ".OyyyyyyyyyyyyO.",
      ".OyyyyyyyyyyyyO.",
      ".OOOOOOOOOOOOOO.",
      "..dddddddddddddd",
    ],
    breaker: [
      "................",
      ".kkkkkkkkkkkkkk.",
      ".krrrrrrrrrrrrk.",
      ".kwwwwwwwwwwwwk.",
      ".kwrrwwwwwwrrwk.",
      ".kwwrrwwwwrrwwk.",
      ".kwwwrrwwrrwwwk.",
      ".kwwwwrrrrwwwwk.",
      ".kwwwwrrrrwwwwk.",
      ".kwwwrrwwrrwwwk.",
      ".kwwrrwwwwrrwwk.",
      ".kwrrwwwwwwrrwk.",
      ".kwwwwwwwwwwwwk.",
      ".kkkkkkkkkkkkkk.",
      "..dddddddddddd..",
      "................",
    ],
    trophy: [
      "................",
      "..kkkkkkkkkkkk..",
      "..kwyyyyyyyyOk..",
      "kkkwyyyyyyyyOkkk",
      "kyykwyyyyyyOkyyk",
      "kyykwyyyyyyOkyyk",
      "kkkkwyyyyyyOkkkk",
      "..kkwyyyyyyOkk..",
      "....kwyyyyOk....",
      ".....kwyyOk.....",
      "......kyOk......",
      ".......kk.......",
      "......kyyk......",
      "....kkkkkkkk....",
      "...kyyyyyyyyk...",
      "...kkkkkkkkkk...",
    ],
    habits: [
      "................",
      ".kkkkkkkkkkkkkk.",
      ".kwwwwwwwwwwwwk.",
      ".kwddGwddGwdddk.",
      ".kwGgdwGgdwdgdk.",
      ".kwdGdwdGdwdddk.",
      ".kwwwwwwwwwwwwk.",
      ".kwddGwdddwddGk.",
      ".kwGgdwdgdwGgdk.",
      ".kwdGdwdddwdGdk.",
      ".kwwwwwwwwwwwwk.",
      ".kwdddwddGwdddk.",
      ".kwdgdwGgdwdgdk.",
      ".kwdddwdGdwdddk.",
      ".kkkkkkkkkkkkkk.",
      "..dddddddddddddd",
    ],
    countdown: [
      "................",
      ".kkkkkkkkkkkkkk.",
      ".krrrrrrrrrrrrk.",
      ".krrrrrrrrrrrrk.",
      ".kkkkkkkkkkkkkk.",
      ".kwwwwwwwwwwwwk.",
      ".kwwwwwwwwwwwwk.",
      ".kwwkkkkkkkkwwk.",
      ".kwwkkkkkkkkwwk.",
      ".kwwwwwwwwkkwwk.",
      ".kwwwwwwwkkwwwk.",
      ".kwwwwwwkkwwwwk.",
      ".kwwwwwwkkwwwwk.",
      ".kwwwwwkkwwwwwk.",
      ".kkkkkkkkkkkkkk.",
      "................",
    ],
    convert: [
      "................",
      "................",
      "................",
      "................",
      "................",
      ".kkkkkkkkkkkkkk.",
      ".kykykykykykykk.",
      ".kykykykykykykk.",
      ".kykykykykykykk.",
      ".kyyykyyykyyykk.",
      ".kyyyyyyyyyyyyk.",
      ".kkOOOOOOOOOOkk.",
      "................",
      "................",
      "................",
      "................",
    ],
    helpy: [
      "......rrr.......",
      "......rrr.......",
      ".......k........",
      "......kkkk......",
      "....kkcccckk....",
      "...kcccccccck...",
      "...kwwwccwwwk...",
      "..kcwwwccwwwck..",
      "..kcwkkccwkkck..",
      "..kcwwwccwwwck..",
      "..kcccccccccck..",
      "..kckcccccckck..",
      "...kckkkkkkck...",
      "...kcbcccccck...",
      "....kkcccckk....",
      "......kkkk......",
    ],
    lolbit: [
      "..Oy........yO..",
      "..Oyy......yyO..",
      "..Oyyy....yyyO..",
      "..Oyyyy..yyyyO..",
      "..Oyyyy..yyyyO..",
      "..OOOOOOOOOOOO..",
      "..OyyyyyyyyyyO..",
      "..OyckyyyyckyO..",
      "..OykkyyyykkyO..",
      "..OyywwkkwwyyO..",
      "..OyywwwwwwyyO..",
      "..OyykwkkwkyyO..",
      "..OyywkkkkwyyO..",
      "..OOOwwwwwwOOO..",
      "................",
      "................",
    ],
    handunit: [
      "................",
      "...kkkkkkkkkk...",
      "..kggggggggggk..",
      "..kgddddddddgk..",
      "..kgdrrdrrddgk..",
      "..kgddddddddgk..",
      "..kgdkkkkkkdgk..",
      "..kgdkwwwwkdgk..",
      "..kgdkwwwwkdgk..",
      "..kgdkkkkkkdgk..",
      "..kgddddddddgk..",
      "..kggggggggggk..",
      "...kkkkkkkkkk...",
      "....k......k....",
      "...kkk....kkk...",
      "................",
    ],
    carnie: [
      "................",
      ".......kk.......",
      "......kmmk......",
      ".....kmrrmk.....",
      "....kmrrrrmk....",
      "...kmrrrrrrmk...",
      "..kmrrrrrrrrmk..",
      ".kmrrrrrrrrrrmk.",
      "kkkkkkkkkkkkkkkk",
      "................",
      "....kkkkkkkk....",
      "...kyyyyyyyyk...",
      "...kykkkkykyk...",
      "...kyyyyyyyyk...",
      "....kkkkkkkk....",
      "................",
    ],
    mystic: [
      "................",
      "......kkkk......",
      "....kkcccckk....",
      "...kcccccccck...",
      "..kccwwccwwcck..",
      "..kcwwwwwwwwck..",
      "..kcwkwwwwkwck..",
      "..kcwwwwwwwwck..",
      "..kcwwkkkkwwck..",
      "..kcwwwwwwwwck..",
      "...kccwwwwcck...",
      "....kkcccckk....",
      "......kkkk......",
      ".....kkkkkk.....",
      "....kkkkkkkk....",
      "................",
    ],
    mxes: [
      "................",
      "....kkkkkkkk....",
      "...kbbbbbbbbk...",
      "..kbbbbbbbbbbk..",
      ".kbbbbbbbbbbbbk.",
      ".kbbbbkkkkbbbbk.",
      ".kbbbkkkkkkbbbk.",
      ".kbbbkwwwwkbbbk.",
      ".kbbbkwwkkwbbbk.",
      ".kbbbkkkkkkbbbk.",
      "..kbbbkkkkbbbk..",
      "..kbbbbbbbbbbk..",
      "...kbbbbbbbbk...",
      "....kbbbbbbk....",
      ".....kkkkkk.....",
      "................",
    ],
    clippy: [
      "................",
      "......kkkk......",
      ".....kwwwwk.....",
      "....kw....wk....",
      "....kw.kk.wk....",
      "....kw.kw.wk....",
      "....kw.kk.wk....",
      "....kwwwwwwk....",
      "....kw..........",
      "....kw..........",
      "....kw..........",
      "....kwwwwwk.....",
      ".....kwwwwk.....",
      "......kkkk......",
      "................",
      "................",
    ],
    app: [
      "................",
      "kkkkkkkkkkkkkkkk",
      "kwwwwwwwwwwwwwwk",
      "kgddddddddddddgk",
      "kgdTTrrrGGGTTdgk",
      "kgdTTrrrGGGTTdgk",
      "kgdTTbbbyyyTTdgk",
      "kgdTTbbbyyyTTdgk",
      "kgdTTTTTTTTTTdgk",
      "kgddddddddddddgk",
      "kggggggggggggggk",
      "kkkkkkkkkkkkkkkk",
      "......kggk......",
      "......kggk......",
      "...kkkkkkkkkk...",
      "...kkkkkkkkkk...",
    ],
    full: [
      "................",
      ".kkkkk....kkkkk.",
      ".kkkkk....kkkkk.",
      ".kk.........kk.",
      ".kk.........kk.",
      ".kk.........kk.",
      "................",
      "................",
      "................",
      "................",
      ".kk.........kk.",
      ".kk.........kk.",
      ".kk.........kk.",
      ".kkkkk....kkkkk.",
      ".kkkkk....kkkkk.",
      "................",
    ],
    fullx: [
      "................",
      ".....kk..kk.....",
      ".....kk..kk.....",
      ".....kk..kk.....",
      ".....kk..kk.....",
      ".kkkkkk..kkkkkk.",
      ".kkkkk....kkkkk.",
      "................",
      "................",
      ".kkkkk....kkkkk.",
      ".kkkkkk..kkkkkk.",
      ".....kk..kk.....",
      ".....kk..kk.....",
      ".....kk..kk.....",
      ".....kk..kk.....",
      "................",
    ],
    links: [
      "................",
      ".......kk.......",
      "....kkkkckkk....",
      "...kccckcGGGk...",
      "..kGGGGkcGGGck..",
      "..kGGGGkccccck..",
      "..kGGGGkccccck..",
      ".kkkkkkkkkkkkkk.",
      ".kccccckGGGGcck.",
      "..kcccckGGGGck..",
      "..kccGGkGGGGck..",
      "..kccGGkGGGGck..",
      "...kccckcccck...",
      "....kkkkckkk....",
      ".......kk.......",
      "................",
    ],
    dice: [
      "................",
      ".kkkkkkkkkkkkk..",
      ".kwwwwwwwwwwwk.d",
      ".kwkkwwwwwkkwk.d",
      ".kwkkwwwwwkkwk.d",
      ".kwwwwwwwwwwwk.d",
      ".kwwwwkkwwwwwk.d",
      ".kwwwwkkwwwwwk.d",
      ".kwwwwwwwwwwwk.d",
      ".kwwwwwwwwwwwk.d",
      ".kwkkwwwwwkkwk.d",
      ".kwkkwwwwwkkwk.d",
      ".kwwwwwwwwwwwk.d",
      ".kkkkkkkkkkkkk.d",
      "...............d",
      "..dddddddddddddd",
    ],
    grapher: [
      "................",
      "................",
      "..k.............",
      "..k............",
      "..k.............",
      "..k....k........",
      "..k...k.k.......",
      "..k..k...k......",
      "..k.k.....k.....",
      "..kk.......k....",
      "..k.........k...",
      "..k..........k..",
      "..kkkkkkkkkkkkk.",
      "................",
      "................",
      "................",
    ],
    periodic: [
      "................",
      "..kkkkkkkkkkkk..",
      "..kwwwwwwwwwwk..",
      "..kwkkkkkkkkwk..",
      "..kwkwwwwwwkwk..",
      "..kwkwkkkkwkwk..",
      "..kwkwkHHkwkwk..",
      "..kwkwkHHkwkwk..",
      "..kwkwkkkkwkwk..",
      "..kwkwwwwwwkwk..",
      "..kwkkkkkkkkwk..",
      "..kwwwwwwwwwwk..",
      "..kkkkkkkkkkkk..",
      "................",
      "................",
      "................",
    ],
    formula: [
      "................",
      "..kkkkkkkkkkkk..",
      "..kwwwwwwwwwwk..",
      "..kwkwkwkwkwwk..",
      "..kwwwwwwwwwwk..",
      "..kwkwkkwkwkwk..",
      "..kwwwwwwwwwwk..",
      "..kwkwwwwkwkwk..",
      "..kwwwwwwwwwwk..",
      "..kwkkwkwwkkwk..",
      "..kwwwwwwwwwwk..",
      "..kwkkkkkkkkwk..",
      "..kwwwwwwwwwwk..",
      "..kkkkkkkkkkkk..",
      "................",
      "................",
    ],
    dict: [
      "................",
      "..kkkkkkkkkkkk..",
      "..kNNNNNNNNNNk..",
      "..kNwwwwwwwwNk..",
      "..kNwkkkkkkwNk..",
      "..kNwkwwwwkwNk..",
      "..kNwkwwwwkwNk..",
      "..kNwkwwwwkwNk..",
      "..kNwkkkkkkwNk..",
      "..kNwwwwwwwwNk..",
      "..kNNNNNNNNNNk..",
      "..kkkkkkkkkkkk..",
      "................",
      "................",
      "................",
      "................",
    ],
    g2048: [
      "................",
      "................",
      ".kkkkkk..kkkkkk.",
      ".kwwggk..kggwwk.",
      ".kwkkwk..kwkkwk.",
      ".kwkkwk..kwkkwk.",
      ".kggwwk..kwwggk.",
      ".kkkkkk..kkkkkk.",
      "................",
      ".kkkkkk..kkkkkk.",
      ".kggwwk..kwwggk.",
      ".kwkkwk..kwkkwk.",
      ".kwkkwk..kwkkwk.",
      ".kwwggk..kggwwk.",
      ".kkkkkk..kkkkkk.",
      "................",
    ],
    snake: [
      "................",
      "................",
      "..........OOOO..",
      "..........OyyO..",
      "..........OOOO..",
      "................",
      "...OOOO.........",
      "...OyyO.........",
      "...OOOOOO.......",
      ".....OyyOOO.....",
      ".....OOOOyyO....",
      "........OOOO....",
      "................",
      "........r.......",
      "................",
      "................",
    ],
    tetris: [
      "................",
      "..kkkkkkkkkkkk..",
      "..kwwwwwwwwwwk..",
      "..kwbbbbbbbbwk..",
      "..kwbbbbbbbbwk..",
      "..kwbbbbbbbbwk..",
      "..kwwwwwwwwwwk..",
      "..kwwwwwwwwwwk..",
      "..kwwkkkkwwwwk..",
      "..kwwkkkkwwwwk..",
      "..kwwkkkkwwwwk..",
      "..kwwkkkkwwwwk..",
      "..kwwwwwwwwwwk..",
      "..kwwwwwwwwwwk..",
      "..kkkkkkkkkkkk..",
      "................",
    ],
    pong: [
      "................",
      "................",
      "................",
      "................",
      "..kkkkkkkkkkkk..",
      "..kwwwwwwwwwwk..",
      "..kwwwwwwwwwwk..",
      "..kwwkkkkkkwwk..",
      "..kwwwwwwwwwwk..",
      "..kwwwwwwwwwwk..",
      "..kkkkkkkkkkkk..",
      "..k..........k..",
      "..k..........k..",
      "..k..........k..",
      "..k..........k..",
      "................",
    ],
    equation: [
      "................",
      "................",
      "..kkkkkkkkkkkk..",
      "..kwwwwwwwwwwk..",
      "..kwkkkwwkkkwk..",
      "..kwwwwwwwwwwk..",
      "..kwkkkwwkkkwk..",
      "..kwwwwwwwwwwk..",
      "..kwkkkwwkkkwk..",
      "..kwwwwwwwwwwk..",
      "..kwkkkwwkkkwk..",
      "..kwwwwwwwwwwk..",
      "..kkkkkkkkkkkk..",
      "................",
      "................",
      "................",
    ],
    typing: [
      "................",
      "..kkkkkkkkkkkk..",
      "..kwwwwwwwwwwk..",
      "..kwdwdwdwdwwk..",
      "..kwwwwwwwwwwk..",
      "..kwdwdwdwdwwk..",
      "..kwwwwwwwwwwk..",
      "..kwdwdwdwdwwk..",
      "..kwwwwwwwwwwk..",
      ".kkkkkkkkkkkkkk.",
      ".kggggggggggggk.",
      ".kggggggggggggk.",
      ".kkkkkkkkkkkkkk.",
      "................",
      "................",
      "................",
    ],
    games: [
      "................",
      "..kkkkkkkkkkkk..",
      "..kwwwwwwwwwwk..",
      "..kwkkkwwkkkwk..",
      "..kwwwwwwwwwwk..",
      "..kwdwwwwwdwk...",
      "..kwwwwwwwwwwk..",
      "..kwkkkwwkkkwk..",
      "..kwwwwwwwwwwk..",
      "..kwwwwwwwwwwk..",
      "..kwwwwwwwwwwk..",
      "..kwwwwwwwwwwk..",
      "..kkkkkkkkkkkk..",
      "................",
      "................",
      "................",
    ],
    sudoku: [
      "................",
      "..kkkkkkkkkkkk..",
      "..kwwkwwkwwkwk..",
      "..kkkkkkkkkkkk..",
      "..kwkwwkwwkwwk..",
      "..kkkkkkkkkkkk..",
      "..kwwkwwkwwkwk..",
      "..kkkkkkkkkkkk..",
      "..kwkwwkwwkwwk..",
      "..kkkkkkkkkkkk..",
      "..kwwkwwkwwkwk..",
      "..kkkkkkkkkkkk..",
      "..kwwkwwkwwkwk..",
      "..kkkkkkkkkkkk..",
      "................",
      "................",
    ],
    board: [
      "................",
      "................",
      "..kkkkkkkkkkkk..",
      "..kwbwbwbwbwbk..",
      "..kwbwbwbwbwbk..",
      "..kbwbwbwbwbwk..",
      "..kwbwbwbwbwbk..",
      "..kbwbwbwbwbwk..",
      "..kwbwbwbwbwbk..",
      "..kbwbwbwbwbwk..",
      "..kwbwbwbwbwbk..",
      "..kbwbwbwbwbwk..",
      "..kwbwbwbwbwbk..",
      "..kkkkkkkkkkkk..",
      "................",
      "................",
    ],
    clock: [
      "................",
      "..kkkkkkkkkkkk..",
      "..kwwwwwwwwwwk..",
      "..kwkwwkwwkwkk..",
      "..kwwkwwkwwkwk..",
      "..kwkwwkwwkwkk..",
      "..kwwkwwkwwkwk..",
      "..kwkkkkkkkkwk..",
      "..kwwwwwwwwwwk..",
      "..kwkwwwwwwwkk..",
      "..kwwkwkwwkwwk..",
      "..kwkwwkwwkwkk..",
      "..kwwwwwwwwwwk..",
      "..kkkkkkkkkkkk..",
      "................",
      "................",
    ],
    bell: [
      "................",
      "................",
      ".......kk.......",
      "......kwwk......",
      ".....kwwwwk.....",
      "....kwwwwwwk....",
      "...kwwwwwwwwk...",
      "...kwwwwwwwwk...",
      "..kwwwwwwwwwwk..",
      ".kwwwwwwwwwwwwk.",
      "..kkkkkkkkkkkk..",
      "................",
      ".......kk.......",
      ".......kk.......",
      "................",
      "................",
    ],
    quill: [
      "................",
      ".............kkk",
      "............kOOk",
      "...........kOOk.",
      "..........kOOk..",
      ".........kOOk...",
      "........kOOk....",
      ".......kOOk.....",
      "......kOOk......",
      ".....kOOk.......",
      "....kOOk........",
      "...kOOk.kk......",
      "..kOOk.kRRk.....",
      "..kkk..kRRk.....",
      ".......kkk......",
      "................",
    ],
    testtube: [
      "................",
      "................",
      "....kk..kk......",
      "...kGGkkGGk.....",
      "...kGGkkGGk.....",
      "...kGGkkGGk.....",
      "...kGGkkGGk.....",
      "...kGGkkGGk.....",
      "...kGGkkGGk.....",
      "...kGGkkGGk.....",
      "...kGGkkGGk.....",
      "...kGGkkGGk.....",
      "...kGGkkGGk.....",
      "..kkkkkkkkkk....",
      "..kkkkkkkkkk....",
      "................",
    ],
    flashcard: [
      "................",
      ".kkkkkkkkkkkkkk.",
      ".kwwwwwwwwwwwwk.",
      ".kwkkkkkkkkkkwk.",
      ".kwkwwwwwwwwkwk.",
      ".kwkwkkkkkkwkwk.",
      ".kwkwwwwwwwwkwk.",
      ".kwkwkkkkkkwkwk.",
      ".kwkwwwwwwwwkwk.",
      ".kwkkkkkkkkkkwk.",
      ".kwwwwwwwwwwwwk.",
      ".kwwwwwwwwwwwwk.",
      ".kkkkkkkkkkkkkk.",
      "................",
      "................",
      "................",
    ],
    pin: [
      "................",
      "................",
      ".....kkkkkk.....",
      "....kNNNNNNk....",
      "...kNNNNNNNNk...",
      "...kNNwwwwNNk...",
      "...kNNwwwwNNk...",
      "...kNNwwwwNNk...",
      "...kNNNNNNNNk...",
      "....kNNNNNNk....",
      ".....kNNNNk.....",
      "......kNNk......",
      ".......kk.......",
      "................",
      "................",
      "................",
    ],
    globe: [
      "................",
      ".....kkkkkk.....",
      "....kNNNNNNk....",
      "...kNNGGGGNNk...",
      "..kNNGGwwGGNNk..",
      "..kNGGwwwwGGNk..",
      ".kNNGGwwwwGGNNk.",
      ".kNNGGwwwwGGNNk.",
      "..kNGGwwwwGGNk..",
      "..kNNGGwwGGNNk..",
      "...kNNGGGGNNk...",
      "....kNNNNNNk....",
      ".....kkkkkk.....",
      "................",
      "................",
      "................",
    ],
    puzzle: [
      "................",
      "................",
      "....kkkkkk......",
      "...kGGGGGGk.....",
      "..kkkkkGGGk.....",
      ".kRRRkkkGGk.....",
      ".kRRRRRkGGk.....",
      ".kRRRRRkkkk.....",
      ".kRRRRRkBBBk....",
      ".kRRRRRkBBBk....",
      "..kRRRkkBBBk....",
      "...kkkkkBBBk....",
      ".....kBBBBk.....",
      "......kkkk......",
      "................",
      "................",
    ],
    star: [
      "................",
      ".......yy.......",
      ".......yy.......",
      "......yyyy......",
      "......yyyy......",
      "yyyyyyyyyyyyyyyy",
      "yyyyyyyyyyyyyyyy",
      "..yyyyyyyyyyyy..",
      "...yyyyyyyyyy...",
      "....yyyyyyyy....",
      "....yyyyyyyy....",
      "...yyyy..yyyy...",
      "..yyyy....yyyy..",
      ".yyy........yyy.",
      "................",
      "................",
    ],
    heart: [
      "................",
      "................",
      "..rr.rr..rr.rr..",
      ".rrrrrrrrrrrrrr.",
      ".rrrrrrrrrrrrrr.",
      ".rrrrrrrrrrrrrr.",
      "..rrrrrrrrrrrr..",
      "...rrrrrrrrrr...",
      "....rrrrrrrr....",
      ".....rrrrrr.....",
      "......rrrr......",
      ".......rr.......",
      "................",
      "................",
      "................",
      "................",
    ],
  };
  var ICON_PALETTES = {
    vga: null,
    mono: {
      k: "#111111",
      w: "#ffffff",
      g: "#cccccc",
      d: "#666666",
      R: "#444444",
      r: "#888888",
      G: "#555555",
      l: "#999999",
      O: "#666666",
      y: "#aaaaaa",
      N: "#222222",
      b: "#777777",
      P: "#555555",
      m: "#888888",
      T: "#555555",
      c: "#999999",
    },
    modern: {
      k: "#1f2937",
      w: "#f9fafb",
      g: "#d1d5db",
      d: "#6b7280",
      R: "#b91c1c",
      r: "#ef4444",
      G: "#047857",
      l: "#10b981",
      O: "#a16207",
      y: "#fbbf24",
      N: "#1e3a8a",
      b: "#3b82f6",
      P: "#7e22ce",
      m: "#a855f7",
      T: "#0d9488",
      c: "#22d3ee",
    },
    migrate: [
      "................",
      "................",
      "..kkkkkkkk......",
      "..kggggggk......",
      "..kgkkkkgk......",
      "..kgkwwkgk......",
      "..kgkwwkgk......",
      "..kgkkkkgk......",
      "kkkkkkkkkkkkkkk.",
      "kwwwwwwwwwwwwwk.",
      "kwddddddddddwwk.",
      "kwwwwwwwwwwwwwk.",
      "kkkkkkkkkkkkkkk.",
      "...kk......kk...",
      "..kRRk....kRRk..",
      "..kkkk....kkkk..",
    ],
  };
  var TRITONE_PRESETS = [
    { name: "Classic", dark: "#000000", mid: "#808080", light: "#ffffff" },
    { name: "Blueprint", dark: "#001858", mid: "#3060a8", light: "#d0e8ff" },
    { name: "Sepia", dark: "#2a1a08", mid: "#8a6838", light: "#f0dfb8" },
    { name: "Forest", dark: "#0c280c", mid: "#3a7a3a", light: "#c8ecc8" },
    { name: "Sunset", dark: "#38101c", mid: "#c05838", light: "#ffe0a0" },
    { name: "Ocean", dark: "#001c38", mid: "#2088a8", light: "#c0eaff" },
    { name: "Ember", dark: "#280000", mid: "#a02828", light: "#ffd0c0" },
    { name: "Violet", dark: "#200a30", mid: "#7840a0", light: "#e8d0ff" },
    { name: "Mint", dark: "#003028", mid: "#30a080", light: "#d0ffe8" },
    { name: "Rose", dark: "#38081e", mid: "#c04880", light: "#ffd8e8" },
  ];
  function validHex6(v, def) {
    return isStr(v) && /^#[0-9a-f]{6}$/i.test(v) ? v : def;
  }
  function tritonePalette(t) {
    t = isObj(t) ? t : {};
    var dark = validHex6(t.dark, "#000000");
    var mid = validHex6(t.mid, "#808080");
    var light = validHex6(t.light, "#ffffff");
    var map = {};
    Object.keys(VGA).forEach(function (k) {
      if (k === "k") {
        map[k] = dark;
        return;
      }
      if (k === "w") {
        map[k] = light;
        return;
      }
      var hex = VGA[k];
      var r = parseInt(hex.slice(1, 3), 16);
      var g = parseInt(hex.slice(3, 5), 16);
      var b = parseInt(hex.slice(5, 7), 16);
      var L = 0.299 * r + 0.587 * g + 0.114 * b;
      map[k] = L < 90 ? dark : L > 200 ? light : mid;
    });
    return map;
  }
  var iconUrls = {};
  function iconUrl(name) {
    var theme = (S.prefs && S.prefs.iconTheme) || "vga";
    var key, palette;
    if (theme === "tritone") {
      var t = (S.prefs && S.prefs.tritone) || {};
      var dk = validHex6(t.dark, "#000000");
      var md = validHex6(t.mid, "#808080");
      var lt = validHex6(t.light, "#ffffff");
      key = "tritone::" + dk + "::" + md + "::" + lt + "::" + name;
      palette = tritonePalette({ dark: dk, mid: md, light: lt });
    } else {
      key = theme + "::" + name;
      palette = ICON_PALETTES[theme] || VGA;
    }
    if (iconUrls[key]) return iconUrls[key];
    var rows = ICONS[name] || ICONS.info,
      svg =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">';
    rows.forEach(function (row, y) {
      var x = 0;
      while (x < 16) {
        var ch = row.charAt(x);
        if (ch === "." || !palette[ch]) {
          x++;
          continue;
        }
        var x2 = x;
        while (x2 < 16 && row.charAt(x2) === ch) x2++;
        svg +=
          '<rect x="' +
          x +
          '" y="' +
          y +
          '" width="' +
          (x2 - x) +
          '" height="1" fill="' +
          palette[ch] +
          '"/>';
        x = x2;
      }
    });
    svg += "</svg>";
    iconUrls[key] = 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
    return iconUrls[key];
  }
  function refreshIcons() {
    iconUrls = {};
    buildIcons();
    for (var k in wins) {
      if (wins[k].titleEl) {
        var ti = wins[k].titleEl.querySelector(".ti");
        if (ti) {
          ti.textContent = "";
          ti.append(pix(wins[k].app.icon, 16));
        }
      }
      if (wins[k].task) {
        var sp = wins[k].task.firstChild;
        if (sp) {
          sp.textContent = "";
          sp.append(pix(wins[k].app.icon, 16));
        }
      }
    }
    if (!sm.hidden) buildStart();
    setSpk();
  }
  function pix(name, size) {
    var e = el("span", { class: "pix" });
    e.style.backgroundImage = iconUrl(name);
    e.style.width = e.style.height = (size || 16) + "px";
    return e;
  }
  function setSpk() {
    var sp = $("#spk");
    if (!sp) return;
    sp.textContent = "";
    sp.append(pix(S.prefs.mute ? "spk0" : "spk", 16));
  }

  var AC = null;
  function ac() {
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      if (AC.state === "suspended") AC.resume();
    } catch (e) {}
    return AC;
  }
  function tone(f, t0, d, type, vol) {
    if (S.prefs.mute) return;
    var pack = S.prefs.soundPack || "classic";
    if (pack === "silent") return;
    if (pack === "chiptune") {
      type = "square";
      vol = (vol || 0.12) * 0.45;
      f = f * 1.2;
      d = d * 0.8;
    }
    var a = ac();
    if (!a) return;
    try {
      var o = a.createOscillator(),
        g = a.createGain(),
        t = a.currentTime + t0;
      o.type = type || "triangle";
      o.frequency.value = f;
      g.gain.setValueAtTime(vol || 0.12, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g);
      g.connect(a.destination);
      o.start(t);
      o.stop(t + d + 0.03);
    } catch (e) {}
  }
  function chime() {
    tone(784, 0, 0.18);
    tone(988, 0.16, 0.18);
    tone(1319, 0.32, 0.4);
  }
  function ding() {
    tone(660, 0, 0.12, "square", 0.05);
  }
  function startupSound() {
    [523, 659, 784, 1047].forEach(function (f, i) {
      tone(f, i * 0.13, 0.5, "triangle", 0.09);
    });
    tone(1319, 0.55, 0.9, "triangle", 0.07);
  }
  var amb = { src: null, kind: "off" };
  function stopAmbient() {
    if (amb.src) {
      try {
        amb.src.stop();
      } catch (e) {}
      amb.src = null;
    }
  }
  function setAmbient(kind) {
    stopAmbient();
    amb.kind = kind;
    if (kind === "off" || S.prefs.mute) return;
    var a = ac();
    if (!a) return;
    try {
      var len = a.sampleRate * 4,
        buf = a.createBuffer(1, len, a.sampleRate),
        d = buf.getChannelData(0),
        last = 0;
      for (var i = 0; i < len; i++) {
        var wn = Math.random() * 2 - 1;
        if (kind === "brown") {
          last = (last + 0.02 * wn) / 1.02;
          d[i] = last * 3.5;
        } else d[i] = wn * 0.5;
      }
      var src = a.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      var g = a.createGain(),
        node = src;
      if (kind === "rain") {
        var hp = a.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.value = 900;
        var lp = a.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 7000;
        src.connect(hp);
        hp.connect(lp);
        node = lp;
        g.gain.value = 0.22;
      } else g.gain.value = kind === "white" ? 0.07 : 0.2;
      node.connect(g);
      g.connect(a.destination);
      src.start();
      amb.src = src;
    } catch (e) {}
  }
  function shutdownSound() {
    [784, 659, 523, 392].forEach(function (f, i) {
      tone(f, i * 0.16, 0.45, "triangle", 0.09);
    });
  }

  var pops = [];
  var coarse = !!(window.matchMedia && matchMedia("(pointer:coarse)").matches);
  function closePop(from) {
    from = from || 0;
    while (pops.length > from) pops.pop().remove();
  }
  function subOpen(row, sub, level) {
    var r = row.getBoundingClientRect();
    popMenu(r.right - 3, r.top - 3, sub, level + 1);
  }
  function popMenu(x, y, items, level) {
    level = level || 0;
    closePop(level);
    var m = el("div", { class: "pop" });
    items.forEach(function (it) {
      if (it.sep) {
        m.append(el("div", { class: "msep" }));
        return;
      }
      var row = el(
        "div",
        {
          class: "mi" + (it.dis ? " dis" : ""),
          oncontextmenu: function (e) {
            if (!it.app) return;
            e.preventDefault();
            e.stopPropagation();
            popMenu(
              e.clientX,
              e.clientY,
              [
                {
                  label: onDesk(it.app)
                    ? "Remove from Desktop"
                    : "Add to Desktop",
                  ic: "folder",
                  fn: function () {
                    if (onDesk(it.app)) removeFromDesk(it.app);
                    else addToDesk(it.app);
                  },
                },
              ],
              level + 1
            );
          },
          onclick: function (e) {
            e.stopPropagation();
            if (it.sub) {
              subOpen(row, it.sub, level);
              return;
            }
            closePop(0);
            hideStart();
            if (!it.dis && it.fn) it.fn();
          },
          onmouseenter: function () {
            if (coarse) return;
            if (it.sub) subOpen(row, it.sub, level);
            else closePop(level + 1);
          },
        },
        it.ic ? pix(it.ic, 16) : el("span", { class: "ic0" }),
        el(
          "span",
          { class: "ml" },
          (it.check ? "\u2713 " : "") + it.label.replace(/\u2003NEW$/, "")
        ),
        /\u2003NEW$/.test(it.label)
          ? el("span", { class: "new" }, "NEW")
          : null,
        it.sub ? el("span", { class: "arr" }, "\u25B6") : null
      );
      m.append(row);
    });
    document.body.append(m);
    var r = m.getBoundingClientRect();
    m.style.left = Math.max(0, Math.min(x, innerWidth - r.width - 2)) + "px";
    m.style.top = Math.max(0, Math.min(y, innerHeight - r.height - 34)) + "px";
    pops.push(m);
  }

  var wins = {},
    active = null,
    zTop = 10,
    dz = 6000;
  var desk = $("#desktop"),
    tasks = $("#tasks");
  var snapInd = el("div", { class: "snap-ind", hidden: true });
  desk.append(snapInd);
  function drag(handle, win) {
    handle.addEventListener("pointerdown", function (e) {
      if (e.target.closest("button") || win.classList.contains("max")) return;
      var r = win.getBoundingClientRect(),
        dr = desk.getBoundingClientRect();
      var ox = e.clientX - r.left,
        oy = e.clientY - r.top;
      try {
        handle.setPointerCapture(e.pointerId);
      } catch (x) {}
      function mv(ev) {
        var x = ev.clientX - ox - dr.left,
          y = ev.clientY - oy - dr.top;
        x = Math.max(-r.width + 70, Math.min(dr.width - 70, x));
        y = Math.max(0, Math.min(dr.height - 24, y));
        win.style.left = x + "px";
        win.style.top = y + "px";
      }
      function up() {
        handle.removeEventListener("pointermove", mv);
        handle.removeEventListener("pointerup", up);
        handle.removeEventListener("pointercancel", up);
      }
      handle.addEventListener("pointermove", mv);
      handle.addEventListener("pointerup", up);
      handle.addEventListener("pointercancel", up);
    });
  }
  function makeWin(app) {
    var dr = desk.getBoundingClientRect();
    var n = Object.keys(wins).length;
    var width = Math.min(app.w, dr.width - 8),
      height = Math.min(app.h, dr.height - 8);
    var left = Math.max(0, Math.min(96 + n * 26, dr.width - width - 4));
    var top = Math.max(0, Math.min(12 + n * 26, dr.height - height - 4));
    var sv = S.winpos[app.id];
    if (sv) {
      width = Math.min(sv.w, dr.width - 8);
      height = Math.min(sv.h, dr.height - 8);
      left = Math.max(0, Math.min(dr.width - 70, sv.x));
      top = Math.max(0, Math.min(dr.height - 24, sv.y));
    }
    var w = { app: app, id: app.id, min: false, max: false, refresh: null };
    var bMin = el("button", {
      class: "bmin",
      "aria-label": "Minimize",
      onclick: function () {
        minWin(w);
      },
    });
    var bMax = el("button", {
      class: "bmax",
      "aria-label": "Maximize",
      onclick: function () {
        toggleMax(w);
      },
    });
    var bX = el(
      "button",
      {
        class: "bx",
        "aria-label": "Close",
        onclick: function () {
          closeWin(w);
        },
      },
      "×"
    );
    var title = el(
      "div",
      {
        class: "title",
        ondblclick: function (e) {
          if (!e.target.closest("button")) toggleMax(w);
        },
      },
      el("span", { class: "ti" }, pix(app.icon, 16)),
      el("span", { class: "tt" }, app.title),
      el("span", { class: "tb" }, bMin, bMax, bX)
    );
    var menubar = el("div", { class: "menubar", hidden: true });
    var body = el("div", { class: "wbody" });
    var status = el("div", { class: "status", hidden: true });
    var grip = el("div", { class: "grip" });
    var node = el(
      "div",
      {
        class: "win",
        style:
          "left:" +
          left +
          "px;top:" +
          top +
          "px;width:" +
          width +
          "px;height:" +
          height +
          "px",
      },
      title,
      menubar,
      body,
      status,
      grip
    );
    desk.append(node);
    drag(title, node);
    node.addEventListener(
      "pointerdown",
      function () {
        focusWin(w);
      },
      true
    );
    w.savePos = function () {
      if (w.max) return;
      var r = node.getBoundingClientRect(),
        d0 = desk.getBoundingClientRect();
      S.winpos[app.id] = {
        x: Math.round(r.left - d0.left),
        y: Math.round(r.top - d0.top),
        w: Math.round(r.width),
        h: Math.round(r.height),
      };
      save();
    };
    node.addEventListener("pointerup", function () {
      w.savePos();
    });
    grip.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      e.stopPropagation();
      focusWin(w);
      try {
        grip.setPointerCapture(e.pointerId);
      } catch (x) {}
      var r = node.getBoundingClientRect(),
        sx = e.clientX,
        sy = e.clientY;
      function mv(ev) {
        node.style.width = Math.max(280, r.width + ev.clientX - sx) + "px";
        node.style.height = Math.max(190, r.height + ev.clientY - sy) + "px";
      }
      function up() {
        grip.removeEventListener("pointermove", mv);
        grip.removeEventListener("pointerup", up);
        grip.removeEventListener("pointercancel", up);
        w.savePos();
      }
      grip.addEventListener("pointermove", mv);
      grip.addEventListener("pointerup", up);
      grip.addEventListener("pointercancel", up);
    });
    var tb = el(
      "button",
      {
        class: "btn task",
        onclick: function () {
          if (w.min) {
            restoreWin(w);
            focusWin(w);
          } else if (active === w) minWin(w);
          else focusWin(w);
        },
      },
      pix(app.icon, 16),
      el("span", null, app.title)
    );
    tasks.append(tb);
    w.el = node;
    w.body = body;
    w.task = tb;
    w.titleEl = title;
    w.status = function (t) {
      status.hidden = false;
      status.textContent = t;
    };
    w.menus = function (defs) {
      menubar.hidden = false;
      menubar.textContent = "";
      defs.forEach(function (d) {
        var b = el(
          "div",
          {
            class: "mb",
            onpointerdown: function (e) {
              e.stopPropagation();
              focusWin(w);
              var r = b.getBoundingClientRect();
              popMenu(r.left, r.bottom, d.items());
            },
          },
          d.label
        );
        menubar.append(b);
      });
    };
    if (innerWidth < 700) {
      node.classList.add("max");
      w.max = true;
    }
    return w;
  }
  function focusWin(w) {
    if (w.min) restoreWin(w);
    if (active && active !== w) active.el.classList.remove("active");
    w.el.classList.add("active");
    w.el.style.zIndex = ++zTop;
    active = w;
    updTasks();
    saveSession();
  }
  function minWin(w) {
    w.min = true;
    w.el.hidden = true;
    w.el.classList.remove("active");
    if (active === w) active = null;
    updTasks();
    saveSession();
  }
  function restoreWin(w) {
    w.min = false;
    w.el.hidden = false;
    saveSession();
  }
  function toggleMax(w) {
    w.max = !w.max;
    w.el.classList.toggle("max", w.max);
    saveSession();
  }
  function closeWin(w) {
    if (w.savePos) w.savePos();
    if (w.stop) {
      try {
        w.stop();
      } catch (e) {}
    }
    w.el.remove();
    w.task.remove();
    delete wins[w.id];
    if (active === w) active = null;
    if (w.app.onclose) w.app.onclose(w);
    updTasks();
    saveSession();
  }
  function updTasks() {
    for (var k in wins) {
      var w = wins[k];
      w.task.classList.toggle("on", w === active && !w.min);
    }
  }

  var suspendSessionSave = false;
  function saveSession() {
    if (suspendSessionSave) return;
    var list = [];
    for (var k in wins) {
      var w = wins[k];
      var isApp =
        (typeof APPS !== "undefined" && APPS[w.id]) || /^assign-/.test(w.id);
      if (!isApp) continue;
      list.push({
        id: w.id,
        z: +w.el.style.zIndex || 0,
        min: !!w.min,
        max: !!w.max,
      });
    }
    list.sort(function (a, b) {
      return a.z - b.z;
    });
    S.session = { open: list, active: active ? active.id : null };
    save();
  }

  function restoreSession() {
    if (S.prefs.restoreSession === false) return;
    var sess = S.session;
    if (!sess || !Array.isArray(sess.open) || !sess.open.length) return;
    if (innerWidth < 700) return;
    sess.open.forEach(function (rec) {
      if (!rec || !rec.id) return;
      var w = null;
      if (/^assign-/.test(rec.id)) {
        var aid = rec.id.slice(7);
        var a = S.assign.filter(function (x) {
          return x.id === aid;
        })[0];
        if (!a) return;
        try {
          openAssignmentViewer(aid);
        } catch (e) {
          return;
        }
        w = wins[rec.id];
      } else if (APPS[rec.id]) {
        try {
          openApp(rec.id);
        } catch (e) {
          return;
        }
        w = wins[rec.id];
      }
      if (!w) return;
      if (rec.max && !w.max) toggleMax(w);
      if (rec.min) minWin(w);
    });
    var topW = null;
    for (var k in wins) {
      var ww = wins[k];
      if (ww.min) continue;
      if (!topW || (+ww.el.style.zIndex || 0) > (+topW.el.style.zIndex || 0))
        topW = ww;
    }
    if (topW) focusWin(topW);
    else if (sess.active && wins[sess.active]) focusWin(wins[sess.active]);
  }

  function refreshAll() {
    for (var k in wins) {
      var w = wins[k];
      if (w.refresh) w.refresh();
    }
  }
  function openApp(id) {
    var app = APPS[id];
    if (!app) return;
    markAppSeen(id);
    if (wins[id]) {
      var w0 = wins[id];
      if (w0.min) restoreWin(w0);
      focusWin(w0);
      return;
    }
    var w = makeWin(app);
    wins[id] = w;
    try {
      app.build(w);
    } catch (err) {
      closeWin(w);
      msgBox({
        title: app.title,
        icon: "err",
        text:
          "This program couldn't start:\n" +
          clip((err && err.message) || "unknown error", 140) +
          "\n\nYour data is safe.",
      });
      return;
    }
    focusWin(w);
  }
  function msgBox(o) {
    var ik = {
      info: "info",
      warn: "warn",
      err: "err",
      q: "q",
      bell: "alarm",
      bulb: "bulb",
      run: "run",
      find: "find",
      folder: "folder",
    };
    var ic = ik[o.icon] || "info";
    var txt = el("div", { class: "dlg-t" }, o.text || "");
    var host = dlgHost(),
      hostW = host === desk ? innerWidth : host.ownerDocument.defaultView.innerWidth;
    var dlg = el("div", {
      class: "win dialog active",
      style:
        "width:" +
        Math.min(o.width || 350, hostW - 16) +
        "px;z-index:" +
        ++dz,
    });
    var close = function () {
      dlg.remove();
    };
    var btns = el("div", { class: "dlg-btns" });
    (o.buttons || [{ label: "OK" }]).forEach(function (b) {
      btns.append(
        el(
          "button",
          {
            class: "btn",
            onclick: function () {
              var r = b.fn ? b.fn() : null;
              if (r !== false) close();
            },
          },
          b.label
        )
      );
    });
    var x = el(
      "button",
      {
        class: "bx",
        "aria-label": "Close",
        onclick: function () {
          if (o.onClose) o.onClose();
          close();
        },
      },
      "\u00d7"
    );
    var title = el(
      "div",
      { class: "title" },
      el("span", { class: "tt" }, o.title || "FocusDesk 96"),
      el("span", { class: "tb" }, x)
    );
    dlg.append(
      title,
      el(
        "div",
        { class: "dlg-b" },
        pix(ic, 32),
        el("div", { class: "dlg-m" }, txt, o.extra || null)
      ),
      btns
    );
    host.append(dlg);
    var dr = host.getBoundingClientRect(),
      n = host.querySelectorAll(".dialog").length - 1;
    dlg.style.left =
      Math.max(0, (dr.width - dlg.offsetWidth) / 2 + (n % 5) * 18) + "px";
    dlg.style.top =
      Math.max(0, (dr.height - dlg.offsetHeight) / 2 - 20 + (n % 5) * 18) +
      "px";
    drag(title, dlg);
    dlg.addEventListener("pointerdown", function () {
      dlg.style.zIndex = ++dz;
    });
    if (saverOn) stopSaver();
    if (!o.silent) ding();
    var f = btns.firstChild;
    if (f) f.focus();
    return {
      close: close,
      setText: function (t) {
        txt.textContent = t;
      },
    };
  }
  function askText(title, label, def, cb) {
    var inp = el("input", {
      class: "in",
      value: def || "",
      style: "width:100%;margin-top:8px",
    });
    var d = msgBox({
      title: title,
      icon: "q",
      text: label,
      extra: inp,
      buttons: [
        {
          label: "OK",
          fn: function () {
            var v = inp.value.trim();
            if (!v) {
              inp.focus();
              return false;
            }
            cb(v);
          },
        },
        { label: "Cancel" },
      ],
    });
    onEnter(inp, function () {
      var v = inp.value.trim();
      if (v) {
        cb(v);
        d.close();
      }
    });
    setTimeout(function () {
      inp.focus();
      inp.select();
    }, 0);
  }
  function unesc(s) {
    return String(s || "")
      .replace(/\\n/gi, " ")
      .replace(/\\,/g, ",")
      .replace(/\\;/g, ";")
      .replace(/\\\\/g, "\\")
      .trim();
  }
  function icsDate(v) {
    var m = String(v || "").match(
      /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/
    );
    if (!m) return null;
    if (!m[4])
      return {
        ms: new Date(+m[1], +m[2] - 1, +m[3], 23, 59).getTime(),
        allDay: true,
      };
    if (m[7])
      return {
        ms: Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]),
        allDay: false,
      };
    return {
      ms: new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]).getTime(),
      allDay: false,
    };
  }
  function parseICS(txt) {
    txt = String(txt)
      .replace(/\r\n[ \t]/g, "")
      .replace(/\n[ \t]/g, "");
    var out = [],
      cur = null;
    txt.split(/\r?\n/).forEach(function (ln) {
      if (ln === "BEGIN:VEVENT") {
        cur = {};
        return;
      }
      if (ln === "END:VEVENT") {
        if (cur) out.push(cur);
        cur = null;
        return;
      }
      if (!cur) return;
      var i = ln.indexOf(":");
      if (i < 0) return;
      cur[ln.slice(0, i).split(";")[0].toUpperCase()] = ln.slice(i + 1);
    });
    return out;
  }

  var CLASS_COLORS = [
    "#000080",
    "#800000",
    "#006000",
    "#800080",
    "#006868",
    "#806000",
  ];
  function classesOn(ds) {
    var wd = new Date(ds + "T00:00").getDay();
    return S.classes
      .filter(function (c) {
        return (
          c.days.indexOf(wd) >= 0 &&
          (!c.from || ds >= c.from) &&
          (!c.until || ds <= c.until)
        );
      })
      .sort(function (a, b) {
        return a.start < b.start ? -1 : a.start > b.start ? 1 : 0;
      });
  }
  var REPEATS = [
    ["none", "Does not repeat"],
    ["daily", "Every day"],
    ["weekdays", "Every weekday"],
    ["weekly", "Every week"],
    ["biweekly", "Every 2 weeks"],
    ["monthly", "Every month"],
  ];
  function eventOnDate(e, ds) {
    if (e.date === ds) return true;
    if (!e.repeat || e.repeat === "none") return false;
    var a = new Date(e.date + "T00:00"),
      b = new Date(ds + "T00:00");
    if (b < a) return false;
    var days = Math.round((b - a) / 86400000);
    if (days <= 0) return false;
    if (e.repeat === "daily") return true;
    if (e.repeat === "weekdays") {
      var wd = b.getDay();
      return wd >= 1 && wd <= 5;
    }
    if (e.repeat === "weekly") return days % 7 === 0;
    if (e.repeat === "biweekly") return days % 14 === 0;
    if (e.repeat === "monthly") return b.getDate() === a.getDate();
    return false;
  }
  function rollReminder(r) {
    var d = new Date(r.at),
      now = Date.now();
    var step = r.repeat || "none";
    do {
      if (step === "daily") d.setDate(d.getDate() + 1);
      else if (step === "weekdays") {
        do {
          d.setDate(d.getDate() + 1);
        } while (d.getDay() === 0 || d.getDay() === 6);
      } else if (step === "weekly") d.setDate(d.getDate() + 7);
      else if (step === "biweekly") d.setDate(d.getDate() + 14);
      else if (step === "monthly") d.setMonth(d.getMonth() + 1);
      else break;
    } while (d.getTime() <= now);
    S.reminders.push({
      id: uid(),
      text: r.text,
      at: d.getTime(),
      done: false,
      fired: false,
      repeat: step,
    });
  }

  /* ================= APP: CALENDAR ================= */
  function appCalendar(w) {
    var t = new Date(),
      vy = t.getFullYear(),
      vm = t.getMonth(),
      sel = ymd(t);
    var title = el("div", { class: "sunk cal-title" });
    var head = el(
      "div",
      { class: "row cal-head" },
      el(
        "button",
        {
          class: "btn sm",
          "aria-label": "Previous",
          onclick: function () {
            if (viewMode === "week") {
              var d = new Date(sel + "T00:00");
              d.setDate(d.getDate() - 7);
              sel = ymd(d);
              vm = d.getMonth();
              vy = d.getFullYear();
            } else {
              vm--;
              if (vm < 0) {
                vm = 11;
                vy--;
              }
            }
            draw();
          },
        },
        "◄"
      ),
      title,
      el(
        "button",
        {
          class: "btn sm",
          "aria-label": "Next",
          onclick: function () {
            if (viewMode === "week") {
              var d = new Date(sel + "T00:00");
              d.setDate(d.getDate() + 7);
              sel = ymd(d);
              vm = d.getMonth();
              vy = d.getFullYear();
            } else {
              vm++;
              if (vm > 11) {
                vm = 0;
                vy++;
              }
            }
            draw();
          },
        },
        "►"
      ),
      el(
        "button",
        {
          class: "btn sm",
          onclick: function () {
            var n = new Date();
            vy = n.getFullYear();
            vm = n.getMonth();
            sel = ymd(n);
            draw();
          },
        },
        "Today"
      )
    );
    var viewMode = "month";
    var viewBtns = el("div", { class: "row", style: "gap:4px;padding:2px 0" });
    function paintViewBtns() {
      viewBtns.textContent = "";
      [
        ["month", "Month"],
        ["week", "Week (time-block)"],
      ].forEach(function (v) {
        viewBtns.append(
          el(
            "button",
            {
              class: "btn sm" + (viewMode === v[0] ? " on" : ""),
              onclick: function () {
                viewMode = v[0];
                paintViewBtns();
                draw();
              },
            },
            v[1]
          )
        );
      });
    }
    paintViewBtns();
    var FILTERS = [
      ["class", "Classes"],
      ["exam", "Exams"],
      ["study", "Study"],
      ["other", "Other"],
      ["as", "Assignments"],
      ["rm", "Reminders"],
      ["tk", "Tasks"],
      ["sched", "Class schedule"],
    ];
    var show = {};
    FILTERS.forEach(function (f) {
      show[f[0]] = true;
    });
    var filterBoxes = [];
    var filterRow = el(
      "div",
      {
        class: "row",
        style: "gap:8px;flex-wrap:wrap;padding:4px 2px;font-size:11px",
      },
      FILTERS.map(function (f) {
        var cb = el("input", {
          type: "checkbox",
          checked: true,
          onchange: function () {
            show[f[0]] = this.checked;
            draw();
          },
        });
        filterBoxes.push({ key: f[0], cb: cb });
        return el(
          "label",
          { style: "display:flex;align-items:center;gap:3px" },
          cb,
          f[1]
        );
      }),
      el(
        "button",
        {
          class: "btn xs",
          style: "padding:1px 6px",
          onclick: function () {
            filterBoxes.forEach(function (b) {
              b.cb.checked = true;
              show[b.key] = true;
            });
            draw();
          },
        },
        "All"
      ),
      el(
        "button",
        {
          class: "btn xs",
          style: "padding:1px 6px",
          onclick: function () {
            filterBoxes.forEach(function (b) {
              b.cb.checked = false;
              show[b.key] = false;
            });
            draw();
          },
        },
        "None"
      )
    );
    var grid = el("div", { class: "sunk cal-grid" });
    var weekGrid = el("div", {
      class: "sunk",
      style: "display:none;flex:1;min-height:0;overflow:auto",
    });
    var panel = el("div", { class: "sunk cal-panel" });
    var tIn = el("input", {
      class: "in",
      placeholder: "Add a class, exam or study block…",
      style: "flex:1 1 150px",
    });
    var tm = el("input", { class: "in", type: "time", style: "width:96px" });
    var kind = el(
      "select",
      { class: "in" },
      ["class", "exam", "study", "other"].map(function (k) {
        return el("option", { value: k }, k);
      })
    );
    var repeatSel = el(
      "select",
      { class: "in", title: "Repeat" },
      REPEATS.map(function (r) {
        return el("option", { value: r[0] }, r[1]);
      })
    );
    function addEv() {
      var v = tIn.value.trim();
      if (!v) {
        tIn.focus();
        return;
      }
      S.events.push({
        id: uid(),
        title: v,
        date: sel,
        time: tm.value || "",
        kind: kind.value,
        repeat: repeatSel.value || "none",
      });
      tIn.value = "";
      save();
      refreshAll();
    }
    onEnter(tIn, addEv);
    var form = el(
      "div",
      { class: "row cal-form" },
      tIn,
      tm,
      kind,
      repeatSel,
      el("button", { class: "btn sm", onclick: addEv }, "Add")
    );
    w.body.append(
      el(
        "div",
        { class: "col cal" },
        head,
        viewBtns,
        filterRow,
        grid,
        weekGrid,
        panel,
        form
      )
    );
    function itemsFor(d) {
      var out = [];
      S.events.forEach(function (e) {
        if (!eventOnDate(e, d)) return;
        var kk =
          ["class", "exam", "study", "other"].indexOf(e.kind) >= 0
            ? e.kind
            : "other";
        if (!show[kk]) return;
        var tag = e.repeat && e.repeat !== "none" ? " \u21bb" : "";
        out.push({
          k: "ev",
          kindKey: kk,
          sort: e.time || "00:00",
          eventId: e.id,
          label:
            (e.kind === "exam"
              ? "Exam: "
              : e.kind === "study"
              ? "Study: "
              : "") +
            (e.time ? e.time + " " : "") +
            e.title +
            tag,
          del: function () {
            softDelete("events", function (x) {
              return x.id === e.id;
            });
          },
        });
      });
      if (show.as)
        S.assign.forEach(function (a) {
          var dt = new Date(a.due);
          if (ymd(dt) === d)
            out.push({
              k: "as",
              sort: hm(dt),
              label:
                "Due: " +
                a.title +
                (a.course ? " [" + a.course + "]" : "") +
                (a.done ? " (done)" : ""),
            });
        });
      if (show.rm)
        S.reminders.forEach(function (r) {
          var dt = new Date(r.at);
          if (ymd(dt) === d)
            out.push({
              k: "rm",
              sort: hm(dt),
              label: fmt12(dt) + " " + r.text + (r.done ? " (done)" : ""),
            });
        });
      if (show.sched)
        classesOn(d).forEach(function (c) {
          out.push({
            k: "ev",
            cls: S.classes.indexOf(c),
            sort: c.start,
            label: c.start + " " + c.name + (c.room ? " (" + c.room + ")" : ""),
          });
        });
      if (show.tk)
        S.tasks.forEach(function (t) {
          if (t.due != null && ymd(new Date(t.due)) === d)
            out.push({
              k: "tk",
              sort: "23:59",
              label: "To do: " + t.text + (t.done ? " (done)" : ""),
            });
        });
      out.sort(function (a, b) {
        return a.sort < b.sort ? -1 : a.sort > b.sort ? 1 : 0;
      });
      return out;
    }
    function draw() {
      if (viewMode === "week") {
        drawWeek();
        return;
      }
      grid.style.display = "";
      weekGrid.style.display = "none";
      title.textContent = MONTHS[vm] + " " + vy;
      grid.textContent = "";
      DAYS.forEach(function (d) {
        grid.append(el("div", { class: "cal-dow" }, d));
      });
      var start = new Date(vy, vm, 1 - new Date(vy, vm, 1).getDay()),
        todayS = ymd(new Date());
      for (var i = 0; i < 42; i++) {
        (function () {
          var d = new Date(
              start.getFullYear(),
              start.getMonth(),
              start.getDate() + i
            ),
            s = ymd(d),
            items = itemsFor(s);
          var cell = el(
            "div",
            {
              class:
                "cal-cell" +
                (d.getMonth() !== vm ? " other" : "") +
                (s === todayS ? " today" : "") +
                (s === sel ? " sel" : ""),
              "data-date": s,
              onclick: function () {
                sel = s;
                if (d.getMonth() !== vm) {
                  vm = d.getMonth();
                  vy = d.getFullYear();
                }
                draw();
              },
              ondblclick: function () {
                tIn.value = prompt("Quick-add event on " + s + ":", "");
                if (tIn.value) {
                  sel = s;
                  addEv();
                }
              },
            },
            el("div", { class: "cal-n" }, d.getDate()),
            el(
              "div",
              {
                class: "cal-chips",
                title: items.length
                  ? items
                      .map(function (x) {
                        return x.label;
                      })
                      .join("\n")
                  : "",
              },
              items.map(function (it) {
                var c2 = el(
                  "div",
                  { class: "chip " + it.k, title: it.label },
                  it.label
                );
                if (it.cls != null && it.cls >= 0)
                  c2.style.background =
                    CLASS_COLORS[it.cls % CLASS_COLORS.length];
                if (it.eventId) {
                  c2.style.cursor = "grab";
                  c2.addEventListener(
                    "pointerdown",
                    (function (evId, evDate) {
                      return function (e) {
                        if (e.pointerType === "mouse" && e.button !== 0) return;
                        e.stopPropagation();
                        var startX = e.clientX,
                          startY = e.clientY,
                          dragging = false;
                        var ghost = null;
                        try {
                          c2.setPointerCapture(e.pointerId);
                        } catch (x) {}
                        function mv(ev) {
                          if (
                            !dragging &&
                            Math.abs(ev.clientX - startX) +
                              Math.abs(ev.clientY - startY) <
                              6
                          )
                            return;
                          if (!dragging) {
                            dragging = true;
                            c2.classList.add("dragging");
                            ghost = c2.cloneNode(true);
                            ghost.style.position = "fixed";
                            ghost.style.pointerEvents = "none";
                            ghost.style.zIndex = "9999";
                            ghost.style.opacity = "0.85";
                            ghost.classList.remove("dragging");
                            document.body.append(ghost);
                          }
                          ghost.style.left = ev.clientX + 8 + "px";
                          ghost.style.top = ev.clientY + 8 + "px";
                          grid
                            .querySelectorAll(".cal-cell.drop-target")
                            .forEach(function (n) {
                              n.classList.remove("drop-target");
                            });
                          var el2 = document.elementFromPoint(
                            ev.clientX,
                            ev.clientY
                          );
                          var target =
                            el2 && el2.closest && el2.closest(".cal-cell");
                          if (target) target.classList.add("drop-target");
                        }
                        function up(ev) {
                          c2.removeEventListener("pointermove", mv);
                          c2.removeEventListener("pointerup", up);
                          c2.removeEventListener("pointercancel", up);
                          if (ghost) ghost.remove();
                          c2.classList.remove("dragging");
                          grid
                            .querySelectorAll(".cal-cell.drop-target")
                            .forEach(function (n) {
                              n.classList.remove("drop-target");
                            });
                          if (!dragging) return;
                          var el2 = document.elementFromPoint(
                            ev.clientX,
                            ev.clientY
                          );
                          var target =
                            el2 && el2.closest && el2.closest(".cal-cell");
                          if (!target) return;
                          var newDate = target.getAttribute("data-date");
                          if (!newDate || newDate === evDate) return;
                          var evObj = S.events.filter(function (x) {
                            return x.id === evId;
                          })[0];
                          if (!evObj) return;
                          evObj.date = newDate;
                          save();
                          refreshAll();
                        }
                        c2.addEventListener("pointermove", mv);
                        c2.addEventListener("pointerup", up);
                        c2.addEventListener("pointercancel", up);
                      };
                    })(it.eventId, s)
                  );
                }
                return c2;
              })
            )
          );
          grid.append(cell);
        })();
      }
      var sd = new Date(sel + "T00:00"),
        its = itemsFor(sel);
      panel.textContent = "";
      panel.append(
        el(
          "div",
          { class: "panel-h" },
          DAYS[sd.getDay()] + ", " + MONTHS[sd.getMonth()] + " " + sd.getDate()
        )
      );
      if (!its.length)
        panel.append(
          el(
            "div",
            { class: "dim", style: "padding:0" },
            "Nothing scheduled. Add something below."
          )
        );
      its.forEach(function (it) {
        panel.append(
          el(
            "div",
            { class: "prow" },
            el("span", {
              class: "dot " + it.k,
              style:
                it.cls != null && it.cls >= 0
                  ? "background:" + CLASS_COLORS[it.cls % CLASS_COLORS.length]
                  : "",
            }),
            el(
              "span",
              { style: "flex:1;min-width:0;overflow-wrap:anywhere" },
              it.label
            ),
            it.del
              ? el(
                  "button",
                  { class: "btn xs", "aria-label": "Delete", onclick: it.del },
                  "X"
                )
              : null
          )
        );
      });
    }
    function drawWeek() {
      grid.style.display = "none";
      weekGrid.style.display = "block";
      var start = new Date(sel + "T00:00");
      var dow = start.getDay();
      var monday = new Date(start);
      monday.setDate(start.getDate() - ((dow + 6) % 7));
      title.textContent =
        "Week of " +
        (monday.getMonth() + 1) +
        "/" +
        monday.getDate() +
        (monday.getFullYear() !== new Date().getFullYear()
          ? " " + monday.getFullYear()
          : "");
      weekGrid.textContent = "";
      var HOURS = [];
      for (var h = 6; h <= 22; h++) HOURS.push(h);
      var wrap = el("div", {
        style:
          "display:grid;grid-template-columns:56px repeat(7,1fr);gap:1px;min-width:660px",
      });
      wrap.append(el("div"));
      var todayS = ymd(new Date());
      var dayCols = [];
      for (var d = 0; d < 7; d++) {
        var dd = new Date(
          monday.getFullYear(),
          monday.getMonth(),
          monday.getDate() + d
        );
        var ds = ymd(dd);
        dayCols.push({ d: dd, s: ds });
        (function (dd2, ds2) {
          wrap.append(
            el(
              "div",
              {
                style:
                  "text-align:center;font-weight:bold;padding:3px 0;cursor:default;background:" +
                  (ds2 === todayS ? "#000080" : "#c0c0c0") +
                  ";color:" +
                  (ds2 === todayS ? "#fff" : "#000"),
                onclick: function () {
                  sel = ds2;
                  vm = dd2.getMonth();
                  vy = dd2.getFullYear();
                  drawWeek();
                },
              },
              DAYS[dd2.getDay()] +
                " " +
                (dd2.getMonth() + 1) +
                "/" +
                dd2.getDate()
            )
          );
        })(dd, ds);
      }
      HOURS.forEach(function (h) {
        wrap.append(
          el(
            "div",
            {
              style:
                "font-size:10px;color:#606060;text-align:right;padding-right:4px;padding-top:2px",
            },
            h < 12 ? h + "am" : h === 12 ? "12pm" : h - 12 + "pm"
          )
        );
        dayCols.forEach(function (col) {
          var cell = el("div", {
            style:
              "min-height:36px;background:#fff;border-top:1px solid #e4e4e4;padding:1px 2px;cursor:default;font-size:10px",
            title:
              "Click to add a study block at " + pad(h) + ":00 on " + col.s,
            onclick: function () {
              askText(
                "Add study block",
                "Title for " + col.s + " " + pad(h) + ":00:",
                "",
                function (v) {
                  S.events.push({
                    id: uid(),
                    title: clip(v, 300),
                    date: col.s,
                    time: pad(h) + ":00",
                    kind: "study",
                    repeat: "none",
                  });
                  save();
                  refreshAll();
                }
              );
            },
          });
          S.events.forEach(function (e) {
            if (!eventOnDate(e, col.s)) return;
            var kk =
              ["class", "exam", "study", "other"].indexOf(e.kind) >= 0
                ? e.kind
                : "other";
            if (!show[kk]) return;
            var et = e.time || "09:00";
            if (parseInt(et.split(":")[0], 10) !== h) return;
            var chip = el(
              "div",
              {
                class: "week-chip",
                style:
                  "background:#000080;color:#fff;padding:1px 3px;margin-bottom:1px;border-radius:2px;cursor:default;overflow:hidden;text-overflow:ellipsis;white-space:nowrap",
                title:
                  et +
                  " " +
                  e.title +
                  " — drag the bottom edge to change length",
                "data-event": e.id,
              },
              et + " " + e.title
            );
            chip.append(
              el("div", {
                class: "rz",
                title: "Drag to change length",
                onpointerdown: (function (evObj, chipEl) {
                  return function (evDown) {
                    evDown.stopPropagation();
                    evDown.preventDefault();
                    try {
                      evDown.target.setPointerCapture(evDown.pointerId);
                    } catch (x) {}
                    var startY = evDown.clientY;
                    var startMin = isNum(evObj.dur) ? evObj.dur : 50;
                    function mv(ev) {
                      var dy = ev.clientY - startY;
                      var delta = Math.round(dy / 12) * 10;
                      var m = Math.max(15, Math.min(240, startMin + delta));
                      evObj.dur = m;
                      chipEl.style.height = m * 0.8 + "px";
                      chipEl.style.whiteSpace = "normal";
                    }
                    function up() {
                      evDown.target.removeEventListener("pointermove", mv);
                      evDown.target.removeEventListener("pointerup", up);
                      evDown.target.removeEventListener("pointercancel", up);
                      save();
                      refreshAll();
                    }
                    evDown.target.addEventListener("pointermove", mv);
                    evDown.target.addEventListener("pointerup", up);
                    evDown.target.addEventListener("pointercancel", up);
                  };
                })(e, chip),
              })
            );
            if (isNum(e.dur)) chip.style.height = e.dur * 0.8 + "px";
            chip.addEventListener("click", function (ev) {
              ev.stopPropagation();
            });
            chip.addEventListener("dblclick", function () {
              msgBox({
                title: "Delete Event",
                icon: "q",
                text: 'Delete "' + e.title + '"?',
                buttons: [
                  {
                    label: "Yes",
                    fn: function () {
                      softDelete("events", function (x) {
                        return x.id === e.id;
                      });
                    },
                  },
                  { label: "No" },
                ],
              });
            });
            cell.append(chip);
          });
          if (show.sched)
            classesOn(col.s).forEach(function (c) {
              if (parseInt(c.start.split(":")[0], 10) !== h) return;
              var idx = S.classes.indexOf(c);
              cell.append(
                el(
                  "div",
                  {
                    style:
                      "background:" +
                      CLASS_COLORS[idx % CLASS_COLORS.length] +
                      ";color:#fff;padding:1px 3px;margin-bottom:1px;border-radius:2px;font-size:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap",
                    title: c.start + "-" + c.end + " " + c.name,
                    onclick: function (ev) {
                      ev.stopPropagation();
                    },
                  },
                  c.start + " " + c.name
                )
              );
            });
          if (show.as)
            S.assign.forEach(function (a) {
              if (a.allDay || ymd(new Date(a.due)) !== col.s) return;
              if (new Date(a.due).getHours() !== h) return;
              cell.append(
                el(
                  "div",
                  {
                    style:
                      "background:#a00000;color:#fff;padding:1px 3px;margin-bottom:1px;border-radius:2px;font-size:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap",
                    title: "Due: " + a.title,
                    onclick: function (ev) {
                      ev.stopPropagation();
                    },
                  },
                  "Due " + a.title
                )
              );
            });
          wrap.append(cell);
        });
      });
      weekGrid.append(wrap);
      var sd = new Date(sel + "T00:00"),
        its = itemsFor(sel);
      panel.textContent = "";
      panel.append(
        el(
          "div",
          { class: "panel-h" },
          DAYS[sd.getDay()] + ", " + MONTHS[sd.getMonth()] + " " + sd.getDate()
        )
      );
      if (!its.length)
        panel.append(
          el(
            "div",
            { class: "dim", style: "padding:0" },
            "Nothing scheduled. Click an hour slot above to add a study block."
          )
        );
      its.forEach(function (it) {
        panel.append(
          el(
            "div",
            { class: "prow" },
            el("span", {
              class: "dot " + it.k,
              style:
                it.cls != null && it.cls >= 0
                  ? "background:" + CLASS_COLORS[it.cls % CLASS_COLORS.length]
                  : "",
            }),
            el(
              "span",
              { style: "flex:1;min-width:0;overflow-wrap:anywhere" },
              it.label
            ),
            it.del
              ? el(
                  "button",
                  { class: "btn xs", "aria-label": "Delete", onclick: it.del },
                  "X"
                )
              : null
          )
        );
      });
    }
    w.refresh = draw;
    draw();
  }

  /* ================= APP: NOTEPAD ================= */
  function appNotepad(w) {
    if (!S.notes.length) {
      S.notes.push({
        id: uid(),
        text: "# Welcome to Notepad\n\nThis is a **Markdown** note. Everything saves automatically.\n\n## Headings\nUse # for H1, ## for H2, ### for H3 — or the toolbar above.\n\n## Emphasis\n**bold**, *italic*, ~~strikethrough~~, ==highlight==, and `inline code`.\n\n## Lists\n- bullet one\n- bullet two\n\n1. first item\n2. second item\n\n- [ ] unchecked task (click it in Preview!)\n- [x] done task\n\n## Links and tags\nVisit [Wikipedia](https://en.wikipedia.org) or tag with #study.\nLink another note with [[Biology Notes]].\n\n> A blockquote for a key idea.\n\nPress F5 to stamp the date and time.",
        updated: Date.now(),
      });
      save();
    }
    var cur = S.notes[0].id,
      wrapOn = true,
      mdMode = false,
      tagFilter = "";
    var list = el("div", {
      class: "sunk np-list",
      style: "flex:1;min-height:0;width:auto",
    });
    var q = el("input", {
      class: "in",
      placeholder: "Search notes…",
      oninput: function () {
        drawList();
      },
    });
    var tagbar = el("div", { class: "tagbar" });
    var linkBox = el("div", { class: "sunk np-links" });
    var left = el(
      "div",
      { class: "col", style: "width:175px;flex:none;gap:4px" },
      q,
      tagbar,
      list,
      linkBox
    );
    var ta = el("textarea", {
      class: "in np-ta",
      spellcheck: "false",
      placeholder: "Start typing…",
      style:
        "font-size:" +
        (S.prefs.noteSize || 13) +
        "px;flex:1;min-height:120px;resize:vertical",
    });
    var preview = el("div", {
      class: "sunk np-ta",
      style:
        "font-size:" +
        (S.prefs.noteSize || 13) +
        "px;overflow:auto;background:#fff;padding:10px;line-height:1.55;flex:1;min-height:120px;display:none",
    });
    var lockBar = el(
      "div",
      { class: "np-lock", hidden: true },
      "This note is a version log and can't be edited. It's kept here so you can read it any time."
    );
    var editorCol = el(
      "div",
      { class: "col", style: "flex:1;min-width:0;min-height:0;gap:4px" },
      lockBar,
      ta,
      preview
    );
    function noteById(id) {
      return S.notes.filter(function (n) {
        return n.id === id;
      })[0];
    }
    function titleOf(n) {
      var l = (n.text || "")
        .split("\n")[0]
        .trim()
        .replace(/^#+\s*/, "");
      return l || "(untitled)";
    }
    function tagsOf(n) {
      var m = String(n.text || "").match(/(?:^|\s)#([\w\-]+)/g) || [];
      var out = [];
      m.forEach(function (t) {
        var k = t.trim().slice(1).toLowerCase();
        if (out.indexOf(k) < 0) out.push(k);
      });
      return out;
    }
    function wikiLinksIn(text) {
      var m = String(text || "").match(/\[\[([^\]\n]+)\]\]/g) || [];
      var out = [];
      m.forEach(function (s) {
        var t = s.slice(2, -2).trim();
        if (t && out.indexOf(t) < 0) out.push(t);
      });
      return out;
    }
    function openNoteByTitle(title) {
      var lower = title.toLowerCase();
      var n = S.notes.filter(function (x) {
        return titleOf(x).toLowerCase() === lower;
      })[0];
      if (n) {
        cur = n.id;
        load();
        return;
      }
      msgBox({
        title: "Note Link",
        icon: "q",
        text: 'No note titled "' + title + '". Create it?',
        buttons: [
          {
            label: "Create",
            fn: function () {
              var nn = {
                id: uid(),
                text: "# " + title + "\n\n",
                updated: Date.now(),
              };
              S.notes.push(nn);
              cur = nn.id;
              save();
              load();
              setTimeout(function () {
                ta.focus();
              }, 0);
            },
          },
          { label: "Cancel" },
        ],
      });
    }
    function drawLinks() {
      linkBox.textContent = "";
      var n = noteById(cur);
      if (!n) return;
      var myTitle = titleOf(n).toLowerCase();
      var out = wikiLinksIn(n.text);
      var back = S.notes.filter(function (x) {
        if (x.id === cur) return false;
        var t = titleOf(x).toLowerCase();
        if (t === myTitle) return false;
        return wikiLinksIn(x.text).some(function (x2) {
          return x2.toLowerCase() === myTitle;
        });
      });
      if (!out.length && !back.length) {
        linkBox.append(
          el(
            "div",
            { class: "dim", style: "padding:2px 4px" },
            "Type [[Note Title]] to link to another note."
          )
        );
        return;
      }
      if (out.length) {
        linkBox.append(el("div", { class: "lh" }, "Links to"));
        out.forEach(function (t) {
          linkBox.append(
            el(
              "div",
              {
                class: "lr",
                onclick: function () {
                  openNoteByTitle(t);
                },
              },
              t
            )
          );
        });
      }
      if (back.length) {
        linkBox.append(
          el("div", { class: "lh", style: "background:#dcffe0" }, "Linked from")
        );
        back.forEach(function (b) {
          linkBox.append(
            el(
              "div",
              {
                class: "lr back",
                onclick: function () {
                  cur = b.id;
                  load();
                },
              },
              titleOf(b)
            )
          );
        });
      }
    }
    function drawTags() {
      var all = {};
      S.notes.forEach(function (n) {
        tagsOf(n).forEach(function (t) {
          all[t] = (all[t] || 0) + 1;
        });
      });
      var keys = Object.keys(all).sort();
      tagbar.textContent = "";
      if (!keys.length) return;
      keys.forEach(function (k) {
        tagbar.append(
          el(
            "span",
            {
              class: "tg" + (tagFilter === k ? " on" : ""),
              onclick: function () {
                tagFilter = tagFilter === k ? "" : k;
                drawList();
              },
            },
            "#" + k + " (" + all[k] + ")"
          )
        );
      });
      if (tagFilter)
        tagbar.append(
          el(
            "span",
            {
              class: "tg",
              onclick: function () {
                tagFilter = "";
                drawList();
              },
            },
            "\u00d7 clear"
          )
        );
    }
    function drawList() {
      list.textContent = "";
      var needle = q.value.trim().toLowerCase();
      S.notes
        .slice()
        .sort(function (a, b) {
          return b.updated - a.updated;
        })
        .filter(function (n) {
          if (tagFilter && tagsOf(n).indexOf(tagFilter) < 0) return false;
          return !needle || (n.text || "").toLowerCase().indexOf(needle) >= 0;
        })
        .forEach(function (n) {
          var d = new Date(n.updated);
          list.append(
            el(
              "div",
              {
                class: "np-item" + (n.id === cur ? " sel" : ""),
                onclick: function () {
                  cur = n.id;
                  load();
                },
              },
              el("b", null, (n.locked ? "\uD83D\uDD12 " : "") + titleOf(n)),
              el(
                "small",
                null,
                d.getMonth() + 1 + "/" + d.getDate() + " " + fmt12(d)
              )
            )
          );
        });
      drawTags();
    }
    function stat() {
      var t = ta.value;
      w.status(
        t.length +
          " chars, " +
          (t.trim() ? t.trim().split(/\s+/).length : 0) +
          " words"
      );
    }
    var saveLabel = el(
      "span",
      { class: "np-save", title: "Notes save automatically" },
      ""
    );
    function updateSaveLabel() {
      var n = noteById(cur);
      if (!n || n.locked) {
        saveLabel.textContent = "";
        saveLabel.className = "np-save";
        return;
      }
      var ago = Date.now() - n.updated;
      if (ago < 4000) {
        saveLabel.textContent = "\u2714 Auto-saved";
        saveLabel.className = "np-save ok";
      } else if (ago < 60000) {
        saveLabel.textContent = "Saved " + Math.round(ago / 1000) + "s ago";
        saveLabel.className = "np-save";
      } else if (ago < 3600000) {
        saveLabel.textContent = "Saved " + Math.round(ago / 60000) + "m ago";
        saveLabel.className = "np-save";
      } else {
        var d = new Date(n.updated);
        saveLabel.textContent =
          "Saved " + (d.getMonth() + 1) + "/" + d.getDate();
        saveLabel.className = "np-save";
      }
    }
    function load() {
      var n = noteById(cur);
      ta.value = n ? n.text : "";
      var locked = !!(n && n.locked);
      ta.readOnly = locked;
      ta.classList.toggle("locked", locked);
      lockBar.hidden = !locked;
      previewBtn.style.display = locked ? "none" : "";
      drawList();
      stat();
      renderPreview();
      drawLinks();
      updateSaveLabel();
    }
    function renderPreview() {
      if (!mdMode) {
        preview.style.display = "none";
        return;
      }
      preview.style.display = "block";
      preview.innerHTML = mdToHtml(ta.value);
      if (!preview._wiki) {
        preview._wiki = true;
        preview.addEventListener("click", function (e) {
          var li = e.target.closest && e.target.closest("li[data-task]");
          if (li) {
            e.preventDefault();
            var n = parseInt(li.getAttribute("data-task"), 10),
              i = 0;
            var re = /^(\s*[-*]\s+)\[([ xX])\]/gm;
            var next = ta.value.replace(re, function (all, pre, mark) {
              if (i++ === n)
                return pre + "[" + (mark === " " ? "x" : " ") + "]";
              return all;
            });
            if (next !== ta.value) {
              ta.value = next;
              ta.dispatchEvent(new Event("input"));
            }
            return;
          }
          var a = e.target.closest && e.target.closest("a.wikilink");
          if (!a) return;
          e.preventDefault();
          openNoteByTitle(a.getAttribute("data-note"));
        });
      }
    }
    function wrapSel(before, after, placeholder) {
      var start = ta.selectionStart,
        end = ta.selectionEnd;
      var sel = ta.value.slice(start, end) || placeholder || "text";
      var newText = before + sel + after;
      ta.value = ta.value.slice(0, start) + newText + ta.value.slice(end);
      ta.focus();
      ta.selectionStart = start + before.length;
      ta.selectionEnd = start + before.length + sel.length;
      ta.dispatchEvent(new Event("input"));
    }
    function lineToggle(prefix) {
      var start = ta.selectionStart;
      var before = ta.value.slice(0, start);
      var lineStart = before.lastIndexOf("\n") + 1;
      var after = ta.value.slice(lineStart);
      var lineEndRel = after.indexOf("\n");
      var lineEnd = lineEndRel < 0 ? ta.value.length : lineStart + lineEndRel;
      var lineText = ta.value.slice(lineStart, lineEnd);
      var has = lineText.indexOf(prefix) === 0;
      if (has) {
        ta.value =
          ta.value.slice(0, lineStart) +
          lineText.slice(prefix.length) +
          ta.value.slice(lineEnd);
        ta.selectionStart = ta.selectionEnd = Math.max(
          lineStart,
          start - prefix.length
        );
      } else {
        ta.value =
          ta.value.slice(0, lineStart) +
          prefix +
          lineText +
          ta.value.slice(lineEnd);
        ta.selectionStart = ta.selectionEnd = start + prefix.length;
      }
      ta.focus();
      ta.dispatchEvent(new Event("input"));
    }
    function fmtBtn(label, title, fn) {
      return el(
        "button",
        {
          class: "btn sm",
          title: title,
          style: "min-width:0;padding:3px 7px;font-weight:bold",
          onclick: fn,
        },
        label
      );
    }
    var previewBtn = el(
      "button",
      {
        class: "btn sm",
        title: "Toggle live preview (renders Markdown as you type)",
        style: "min-width:0;padding:3px 8px;margin-left:auto",
        onclick: function () {
          mdMode = !mdMode;
          this.classList.toggle("on", mdMode);
          renderPreview();
        },
      },
      "Preview"
    );
    var sizeInput = el("input", {
      class: "in",
      type: "number",
      min: "8",
      max: "96",
      step: "1",
      value: S.prefs.noteSize || 13,
      title: "Editor text size (8–96 px)",
      oninput: function () {
        var v = parseInt(this.value, 10);
        if (!isNum(v)) return;
        v = Math.max(8, Math.min(96, v));
        S.prefs.noteSize = v;
        ta.style.fontSize = v + "px";
        preview.style.fontSize = v + "px";
        save();
      },
    });
    var toolbar = el(
      "div",
      {
        class: "row",
        style:
          "gap:2px;flex-wrap:wrap;padding:2px 4px;background:var(--face);border:1px solid #909090",
      },
      fmtBtn("H1", "Title (H1)", function () {
        lineToggle("# ");
      }),
      fmtBtn("H2", "Subtitle (H2)", function () {
        lineToggle("## ");
      }),
      fmtBtn("H3", "Heading (H3)", function () {
        lineToggle("### ");
      }),
      el("span", { style: "width:6px" }),
      fmtBtn("B", "Bold — **text**", function () {
        wrapSel("**", "**", "bold text");
      }),
      fmtBtn("I", "Italic — *text*", function () {
        wrapSel("*", "*", "italic text");
      }),
      fmtBtn("S", "Strikethrough — ~~text~~", function () {
        wrapSel("~~", "~~", "struck text");
      }),
      fmtBtn("==", "Highlight — ==text==", function () {
        wrapSel("==", "==", "highlighted");
      }),
      fmtBtn("<>", "Inline code — `code`", function () {
        wrapSel("`", "`", "code");
      }),
      el("span", { style: "width:6px" }),
      fmtBtn("•", "Bullet list", function () {
        lineToggle("- ");
      }),
      fmtBtn("1.", "Numbered list", function () {
        lineToggle("1. ");
      }),
      fmtBtn("\u2610", "Task list — - [ ] item", function () {
        lineToggle("- [ ] ");
      }),
      fmtBtn("\u201C\u201D", "Blockquote — > text", function () {
        lineToggle("> ");
      }),
      fmtBtn("\u2014", "Horizontal rule", function () {
        lineToggle("--- ");
      }),
      fmtBtn("\u21E5", "Indent", function () {
        lineToggle("    ");
      }),
      fmtBtn("\u25A6", "Insert table", function () {
        ins("\n| Column A | Column B |\n|---|---|\n|  |  |\n|  |  |\n");
      }),
      fmtBtn("\uD83D\uDDBC", "Add an image (or paste / drop one)", function () {
        imgIn.click();
      }),
      el("span", { style: "width:6px" }),
      fmtBtn("[[", "Link to another note", function () {
        wrapSel("[[", "]]", "Note Title");
      }),
      fmtBtn("\uD83D\uDD17", "Web link", function () {
        wrapSel("[", "](https://example.com)", "link text");
      }),
      fmtBtn("#", "Add a tag", function () {
        wrapSel(" #", "", "tag");
      }),
      el("span", { style: "width:6px" }),
      el("span", { class: "np-size" }, "Size", sizeInput),
      saveLabel,
      previewBtn
    );
    var imgIn = el("input", {
      type: "file",
      accept: "image/*",
      style: "display:none",
      onchange: function () {
        var f = this.files && this.files[0];
        this.value = "";
        if (!f) return;
        addImageFile(f, function (id, err) {
          if (err) {
            msgBox({ title: "Add Image", icon: "warn", text: err });
            return;
          }
          var alt = (f.name || "image").replace(/\.[a-z0-9]+$/i, "").replace(/[\[\]\n]/g, "");
          ins("![" + clip(alt, 40) + "](img:" + id + ")");
        });
      },
    });
    w.body.append(imgIn);
    var NOTE_TEMPLATES = {
      "Cornell Notes":
        "# Topic\n\nDate: \n\n| Cues / Questions | Notes |\n|---|---|\n|  |  |\n\n## Summary\n",
      "Lab Report":
        "# Title\n\n**Name:** \n**Date:** \n\n## Purpose\n\n## Materials\n- \n\n## Procedure\n1. \n\n## Data\n\n## Analysis\n\n## Conclusion\n",
      "Essay Outline":
        "# Thesis\n\n## I. Introduction\n- Hook\n- Background\n- Thesis\n\n## II. Body 1\n- \n\n## III. Body 2\n- \n\n## IV. Conclusion\n",
      "Lecture Notes":
        "# Course\n\nDate: \nTopic: \n\n## Key ideas\n- \n\n## Details\n\n## Questions to follow up\n- \n",
      "Reading Log":
        "# Title\n\n**Author:** \n**Pages:** \n\n## Summary\n\n## Key quotes\n> \n\n## My thoughts\n",
      "Task List": "# To do\n- [ ] \n- [ ] \n\n# Done\n- [x] \n",
    };
    try {
      var _customs = JSON.parse(
        localStorage.getItem("focusdesk96.templates") || "{}"
      );
      if (isObj(_customs))
        Object.keys(_customs)
          .slice(0, 50)
          .forEach(function (k) {
            if (isStr(_customs[k]))
              NOTE_TEMPLATES[clip(k, 60)] = clip(_customs[k], 50000);
          });
    } catch (e) {}
    function newFromTemplate(name) {
      var t = NOTE_TEMPLATES[name];
      if (!t) return;
      var n = { id: uid(), text: t, updated: Date.now() };
      S.notes.push(n);
      cur = n.id;
      save();
      load();
      setTimeout(function () {
        ta.focus();
      }, 0);
    }
    function delNote() {
      var n = noteById(cur);
      if (!n) return;
      if (n.locked) {
        msgBox({
          title: "Notepad",
          icon: "info",
          text: "This note is a version log and can't be deleted.",
        });
        return;
      }
      msgBox({
        title: "Confirm Delete",
        icon: "q",
        text: 'Move "' + titleOf(n) + '" to the Recycle Bin?',
        buttons: [
          {
            label: "Yes",
            fn: function () {
              softDelete("notes", function (x) {
                return x.id === cur;
              });
              if (!S.notes.length)
                S.notes.push({
                  id: uid(),
                  text: "# Untitled\n\n",
                  updated: Date.now(),
                });
              cur = S.notes[0].id;
              save();
              load();
            },
          },
          { label: "No" },
        ],
      });
    }
    function saveNote() {
      var n = noteById(cur);
      if (!n) return;
      saveFile(
        (titleOf(n)
          .replace(/[^\w\- ]+/g, "")
          .trim()
          .slice(0, 40) || "note") + ".md",
        inlineImages(n.text || " ")
      );
    }
    function stamp() {
      var d = new Date();
      ins(
        fmt12(d) +
          " " +
          (d.getMonth() + 1) +
          "/" +
          d.getDate() +
          "/" +
          d.getFullYear()
      );
    }
    function ins(s) {
      var a = ta.selectionStart,
        b = ta.selectionEnd;
      ta.value = ta.value.slice(0, a) + s + ta.value.slice(b);
      ta.selectionStart = ta.selectionEnd = a + s.length;
      ta.dispatchEvent(new Event("input"));
    }
    attachImagePaste(ta, ins);
    function findReplace() {
      var qf = el("input", {
        class: "in",
        placeholder: "Find text",
        style: "width:100%",
      });
      var rf = el("input", {
        class: "in",
        placeholder: "Replace with",
        style: "width:100%;margin-top:4px",
      });
      msgBox({
        title: "Find and Replace",
        icon: "find",
        width: 380,
        text: "Search this note:",
        extra: el("div", null, qf, rf),
        buttons: [
          {
            label: "Replace All",
            fn: function () {
              var f = qf.value;
              if (!f) {
                qf.focus();
                return false;
              }
              var n = 0;
              var re = new RegExp(
                f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                "g"
              );
              ta.value = ta.value.replace(re, function () {
                n++;
                return rf.value;
              });
              ta.dispatchEvent(new Event("input"));
              msgBox({
                title: "Find and Replace",
                icon: "info",
                text: "Replaced " + n + " occurrence(s).",
              });
            },
          },
          { label: "Cancel" },
        ],
      });
    }
    ta.addEventListener("input", function () {
      var n = noteById(cur);
      if (!n) {
        n = { id: cur, text: "", updated: 0 };
        S.notes.push(n);
      }
      if (n.locked) {
        ta.value = n.text;
        return;
      }
      n.text = ta.value;
      n.updated = Date.now();
      save();
      stat();
      drawList();
      renderPreview();
      drawLinks();
      updateSaveLabel();
    });
    ta.addEventListener("keydown", function (e) {
      if (e.key === "F5") {
        e.preventDefault();
        stamp();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey) {
        var k = e.key.toLowerCase();
        if (k === "b") {
          e.preventDefault();
          wrapSel("**", "**", "bold text");
        } else if (k === "i") {
          e.preventDefault();
          wrapSel("*", "*", "italic text");
        }
      }
    });
    w.menus([
      {
        label: "File",
        items: function () {
          return [
            {
              label: "New Note",
              fn: function () {
                var n = {
                  id: uid(),
                  text: "# Untitled\n\n",
                  updated: Date.now(),
                };
                S.notes.push(n);
                cur = n.id;
                save();
                load();
                setTimeout(function () {
                  ta.focus();
                }, 0);
              },
            },
            {
              label: "New from Template",
              sub: Object.keys(NOTE_TEMPLATES).map(function (k) {
                return {
                  label: k,
                  fn: function () {
                    newFromTemplate(k);
                  },
                };
              }),
            },
            {
              label: "Import template from file…",
              fn: function () {
                var inp = el("input", {
                  type: "file",
                  accept: ".txt,.md,text/plain",
                  style: "display:none",
                });
                document.body.append(inp);
                inp.addEventListener("change", function () {
                  var f = this.files && this.files[0];
                  inp.remove();
                  if (!f) return;
                  var r = new FileReader();
                  r.onload = function () {
                    var name = f.name.replace(/\.[^.]+$/, "");
                    msgBox({
                      title: "Import Template",
                      icon: "q",
                      text:
                        'Add "' + clip(name, 40) + '" to your template list?',
                      buttons: [
                        {
                          label: "Add",
                          fn: function () {
                            var customs = {};
                            try {
                              customs = JSON.parse(
                                localStorage.getItem("focusdesk96.templates") ||
                                  "{}"
                              );
                            } catch (e) {}
                            customs[name] = clip(String(r.result), 50000);
                            try {
                              localStorage.setItem(
                                "focusdesk96.templates",
                                JSON.stringify(customs)
                              );
                            } catch (e) {}
                            NOTE_TEMPLATES[name] = customs[name];
                            msgBox({
                              title: "Import Template",
                              icon: "info",
                              text: 'Template "' + name + '" added.',
                            });
                          },
                        },
                        { label: "Cancel" },
                      ],
                    });
                  };
                  r.readAsText(f);
                });
                inp.click();
              },
            },
            { label: "Delete Note…", fn: delNote },
            { label: "Save As .md…", fn: saveNote },
            { sep: 1 },
            {
              label: "Add to Folder\u2026",
              fn: function () {
                openFolderPicker("note", cur, null);
              },
            },
            { sep: 1 },
            {
              label: "Exit",
              fn: function () {
                closeWin(w);
              },
            },
          ];
        },
      },
      {
        label: "Edit",
        items: function () {
          return [
            { label: "Time/Date  F5", fn: stamp },
            {
              label: "Insert Note Link…",
              fn: function () {
                askText(
                  "Insert Note Link",
                  "Which note title?",
                  "",
                  function (v) {
                    ins("[[" + v + "]]");
                  }
                );
              },
            },
            { label: "Find and Replace…", fn: findReplace },
            {
              label: "Word Wrap",
              check: wrapOn,
              fn: function () {
                wrapOn = !wrapOn;
                ta.style.whiteSpace = wrapOn ? "pre-wrap" : "pre";
                ta.style.overflowX = wrapOn ? "hidden" : "auto";
              },
            },
            {
              label: "Markdown Preview",
              check: mdMode,
              fn: function () {
                mdMode = !mdMode;
                previewBtn.classList.toggle("on", mdMode);
                renderPreview();
              },
            },
          ];
        },
      },
      {
        label: "Format",
        items: function () {
          return [
            {
              label: "Custom size…",
              fn: function () {
                askText(
                  "Font Size",
                  "Editor text size in pixels (8–96):",
                  String(S.prefs.noteSize || 13),
                  function (v) {
                    var n = Math.max(8, Math.min(96, parseInt(v, 10) || 13));
                    S.prefs.noteSize = n;
                    ta.style.fontSize = n + "px";
                    preview.style.fontSize = n + "px";
                    if (sizeInput) sizeInput.value = n;
                    save();
                  }
                );
              },
            },
            { sep: 1 },
          ].concat(
            [10, 12, 13, 16, 20, 24].map(function (n) {
              return {
                label: "Font size " + n,
                check: (S.prefs.noteSize || 13) === n,
                fn: function () {
                  S.prefs.noteSize = n;
                  ta.style.fontSize = n + "px";
                  preview.style.fontSize = n + "px";
                  if (sizeInput) sizeInput.value = n;
                  save();
                },
              };
            })
          );
        },
      },
      {
        label: "Help",
        items: function () {
          return [
            {
              label: "About Notepad",
              fn: function () {
                msgBox({
                  title: "About Notepad",
                  icon: "info",
                  text: "FocusDesk Notepad\n\nMarkdown syntax:\n# H1  ## H2  ### H3\n**bold**  *italic*  ~~strike~~  ==highlight==\n`code`  > quote  --- rule\n- bullet  1. numbered  - [ ] task\n[text](url)  [[Note Title]]  #tag\n\nClick Preview to render the note below the editor. Task boxes become clickable there.",
                });
              },
            },
          ];
        },
      },
    ]);
    w.body.append(
      el(
        "div",
        { class: "col", style: "flex:1;min-height:0;padding:4px;gap:4px" },
        toolbar,
        el(
          "div",
          { class: "row", style: "flex:1;min-height:0;gap:4px" },
          left,
          editorCol
        )
      )
    );
    w.select = function (id) {
      if (findNote(id)) {
        cur = id;
        load();
      }
    };
    w.refresh = drawList;
    load();
    var saveTick = setInterval(updateSaveLabel, 3000);
    w.stop = function () {
      clearInterval(saveTick);
    };
    setTimeout(function () {
      ta.focus();
    }, 0);
  }

  /* ================= APP: REMINDERS ================= */
  function defaultTimeStr() {
    var d = new Date(Date.now() + 3600000);
    d.setMinutes(Math.ceil(d.getMinutes() / 5) * 5, 0, 0);
    return hm(d);
  }
  function appReminders(w) {
    var tx = el("input", {
      class: "in",
      placeholder: "Remind me to…",
      style: "flex:1 1 180px",
    });
    var dt = el("input", {
      class: "in",
      type: "date",
      value: ymd(new Date()),
      style: "width:130px",
    });
    var tm = el("input", {
      class: "in",
      type: "time",
      value: defaultTimeStr(),
      style: "width:96px",
    });
    var repSel = el(
      "select",
      { class: "in", title: "Repeat" },
      REPEATS.map(function (r) {
        return el("option", { value: r[0] }, r[1]);
      })
    );
    function addAt(ms, text) {
      S.reminders.push({
        id: uid(),
        text: text,
        at: ms,
        done: false,
        fired: false,
        repeat: repSel.value || "none",
      });
      save();
      refreshAll();
    }
    function addRem() {
      var v = tx.value.trim();
      if (!v) {
        tx.focus();
        return;
      }
      var ms = new Date(dt.value + "T" + (tm.value || "09:00")).getTime();
      if (isNaN(ms)) {
        msgBox({
          title: "Reminders",
          icon: "err",
          text: "Pick a valid date and time first.",
        });
        return;
      }
      addAt(ms, v);
      tx.value = "";
    }
    function quick(mins, label) {
      return el(
        "button",
        {
          class: "btn sm",
          onclick: function () {
            var v = tx.value.trim();
            if (!v) {
              tx.focus();
              return;
            }
            addAt(Date.now() + mins * 60000, v);
            tx.value = "";
          },
        },
        label
      );
    }
    onEnter(tx, addRem);
    var list = el("div", { class: "sunk list" });
    w.body.append(
      el(
        "div",
        { class: "row form" },
        tx,
        dt,
        tm,
        repSel,
        el("button", { class: "btn sm", onclick: addRem }, "Add")
      ),
      el(
        "div",
        { class: "row form", style: "padding-top:0" },
        el("span", null, "Quick:"),
        quick(10, "in 10 min"),
        quick(60, "in 1 hour"),
        el(
          "button",
          {
            class: "btn sm",
            onclick: function () {
              var v = tx.value.trim();
              if (!v) {
                tx.focus();
                return;
              }
              var d = new Date();
              d.setDate(d.getDate() + 1);
              d.setHours(9, 0, 0, 0);
              addAt(d.getTime(), v);
              tx.value = "";
            },
          },
          "tomorrow 9 AM"
        )
      ),
      list
    );
    function draw() {
      list.textContent = "";
      var rs = S.reminders.slice().sort(function (a, b) {
        return a.done - b.done || a.at - b.at;
      });
      if (!rs.length)
        list.append(
          el(
            "div",
            { class: "dim" },
            "No reminders yet. Type one above — a dialog box and a chime will pop up when it's time (keep this tab open)."
          )
        );
      rs.forEach(function (r) {
        var over = !r.done && r.at < Date.now();
        list.append(
          el(
            "div",
            { class: "lrow" + (r.done ? " done" : "") + (over ? " over" : "") },
            el("input", {
              type: "checkbox",
              checked: r.done,
              "aria-label": "Done",
              onchange: function () {
                var was = r.done;
                r.done = this.checked;
                if (r.done && !was && r.repeat && r.repeat !== "none")
                  rollReminder(r);
                save();
                refreshAll();
              },
            }),
            el(
              "span",
              { class: "t" },
              r.text + (r.repeat && r.repeat !== "none" ? " \u21bb" : "")
            ),
            el(
              "span",
              { class: "w" },
              whenStr(r.at) + (r.done ? "" : " (" + rel(r.at) + ")")
            ),
            el(
              "button",
              {
                class: "btn xs",
                "aria-label": "Delete",
                onclick: function () {
                  softDelete("reminders", function (x) {
                    return x.id === r.id;
                  });
                },
              },
              "X"
            )
          )
        );
      });
      w.status(
        S.reminders.filter(function (r) {
          return !r.done;
        }).length + " active reminder(s)"
      );
    }
    w.refresh = draw;
    draw();
  }
  function checkReminders() {
    var now = Date.now();
    for (var i = 0; i < S.reminders.length; i++) {
      var r = S.reminders[i];
      if (!r.done && !r.fired && r.at <= now) {
        fireReminder(r, now - r.at > 120000);
        break;
      }
    }
    for (var k in wins)
      if (k === "reminders" && wins[k].refresh) wins[k].refresh();
  }
  setInterval(checkReminders, 4000);
  function fireReminder(r, missed) {
    r.fired = true;
    save();
    chime();
    desktopNotify("Reminder", r.text);
    msgBox({
      title: "Reminder",
      icon: "bell",
      silent: true,
      text:
        r.text +
        "\n\n" +
        (missed ? "(Missed) was due " : "Due ") +
        whenStr(r.at),
      buttons: [
        {
          label: "OK",
          fn: function () {
            r.done = true;
            if (r.repeat && r.repeat !== "none") rollReminder(r);
            save();
            refreshAll();
          },
        },
        {
          label: "Snooze 5 min",
          fn: function () {
            r.at = Date.now() + 300000;
            r.fired = false;
            r.done = false;
            save();
            refreshAll();
          },
        },
      ],
      onClose: function () {
        r.done = true;
        if (r.repeat && r.repeat !== "none") rollReminder(r);
        save();
        refreshAll();
      },
    });
  }

  /* ================= APP: FOCUS TIMER ================= */
  var T = {
    mode: "focus",
    total: S.prefs.dur.focus * 60,
    left: S.prefs.dur.focus * 60,
    running: false,
    endAt: 0,
    label: "",
    cycle: 0,
  };
  function restoreTimer() {
    var t = S.timer;
    if (!t) {
      T.mode = "focus";
      T.total = T.left = S.prefs.dur.focus * 60;
      T.running = false;
      T.endAt = 0;
      T.label = "";
      T.cycle = 0;
      return;
    }
    T.mode = t.mode;
    T.total = t.total;
    T.left = t.left;
    T.label = t.label;
    T.cycle = t.cycle;
    T.running = false;
    T.endAt = 0;
    if (t.running) {
      T.endAt = t.endAt;
      T.running = true;
      T.left = Math.max(0, Math.ceil((T.endAt - Date.now()) / 1000));
    }
  }
  function saveTimer() {
    S.timer = {
      mode: T.mode,
      total: T.total,
      left: T.left,
      running: T.running,
      endAt: T.endAt,
      label: T.label,
      cycle: T.cycle,
    };
    save();
  }
  restoreTimer();
  function setMode(m) {
    T.mode = m;
    T.total = T.left = S.prefs.dur[m] * 60;
    T.running = false;
    saveTimer();
    updTimer();
  }
  function startPause() {
    ac();
    if (T.running) {
      T.left = Math.max(0, Math.ceil((T.endAt - Date.now()) / 1000));
      T.running = false;
    } else {
      if (T.left <= 0) T.left = T.total;
      T.endAt = Date.now() + T.left * 1000;
      T.running = true;
    }
    saveTimer();
    updTimer();
  }
  function resetT() {
    T.running = false;
    T.left = T.total;
    saveTimer();
    updTimer();
  }
  function mmss(s) {
    return pad(Math.floor(s / 60)) + ":" + pad(s % 60);
  }
  function updTimer() {
    var tt = $("#trayTimer");
    if (T.running || T.left < T.total) {
      tt.hidden = false;
      tt.textContent = "";
      tt.append(
        pix("hourglass", 16),
        document.createTextNode(
          (T.running ? (T.mode === "focus" ? "Focus " : "Break ") : "Paused ") +
            mmss(T.left)
        )
      );
    } else tt.hidden = true;
    if (wins.timer && wins.timer.refresh) wins.timer.refresh();
    if (window.__focusdeskTimer)
      window.__focusdeskTimer({ running: !!T.running, paused: !T.running && T.left < T.total, mode: T.mode, left: T.left });
  }
  setInterval(function () {
    if (!T.running) return;
    T.left = Math.max(0, Math.ceil((T.endAt - Date.now()) / 1000));
    if (T.left <= 0) {
      T.running = false;
      saveTimer();
      timerDone();
    }
    updTimer();
  }, 250);
  function timerDone() {
    chime();
    desktopNotify(
      T.mode === "focus" ? "Focus session complete" : "Break is over",
      T.mode === "focus" ? "Nice work! Time for a break." : "Ready for another focus session?"
    );
    if (T.mode === "focus") {
      var k = ymd(new Date()),
        d = S.stats[k] || (S.stats[k] = { sessions: 0, minutes: 0 });
      d.sessions++;
      d.minutes += S.prefs.dur.focus;
      var lb = clip((T.label || "").trim() || "(no subject)", 40);
      d.by = d.by || {};
      d.by[lb] = (d.by[lb] || 0) + S.prefs.dur.focus;
      S.sessions.push({ t: Date.now(), m: S.prefs.dur.focus, l: lb });
      if (S.sessions.length > 3000) S.sessions.splice(0, S.sessions.length - 3000);
      T.cycle++;
      save();
      var nx = T.cycle % 4 === 0 ? "long" : "short";
      msgBox({
        title: "Focus Timer",
        icon: "info",
        silent: true,
        text:
          "Focus session complete. Nice work!\n\nTime for a " +
          (nx === "long" ? "long" : "short") +
          " break (" +
          S.prefs.dur[nx] +
          " min).",
        buttons: [
          {
            label: "Start Break",
            fn: function () {
              setMode(nx);
              startPause();
            },
          },
          {
            label: "Not Now",
            fn: function () {
              setMode(nx);
            },
          },
        ],
        onClose: function () {
          setMode(nx);
        },
      });
    } else {
      msgBox({
        title: "Focus Timer",
        icon: "bulb",
        silent: true,
        text: "Break's over. Ready for another round?",
        buttons: [
          {
            label: "Start Focus",
            fn: function () {
              setMode("focus");
              startPause();
            },
          },
          {
            label: "Later",
            fn: function () {
              setMode("focus");
            },
          },
        ],
        onClose: function () {
          setMode("focus");
        },
      });
    }
  }
  function streak() {
    var n = 0,
      d = new Date();
    if (!(S.stats[ymd(d)] && S.stats[ymd(d)].sessions))
      d.setDate(d.getDate() - 1);
    while (S.stats[ymd(d)] && S.stats[ymd(d)].sessions) {
      n++;
      d.setDate(d.getDate() - 1);
    }
    return n;
  }
  function appTimer(w) {
    var modeBtns = {};
    var modes = el(
      "div",
      { class: "row modes" },
      ["focus", "short", "long"].map(function (m) {
        var b = el(
          "button",
          {
            class: "btn",
            onclick: function () {
              setMode(m);
            },
          },
          m === "focus" ? "Focus" : m === "short" ? "Short Break" : "Long Break"
        );
        modeBtns[m] = b;
        return b;
      })
    );
    var lcd = el("div", { class: "sunk lcd" }, "25:00");
    var blocks = [];
    for (var i = 0; i < 24; i++) blocks.push(el("i"));
    var bar = el("div", { class: "sunk blocks" }, blocks);
    var go = el(
      "button",
      { class: "btn", style: "flex:1", onclick: startPause },
      "Start"
    );
    var rs = el(
      "button",
      { class: "btn", style: "flex:1", onclick: resetT },
      "Reset"
    );
    var lab = el("input", {
      class: "in",
      placeholder: "e.g. Chem ch. 7 problem set",
      value: T.label,
      style: "width:100%",
      oninput: function () {
        T.label = this.value;
        saveTimer();
      },
    });
    var sToday = el("b"),
      sMin = el("b"),
      sStreak = el("b"),
      sAll = el("b");
    function num(id) {
      return el("input", {
        class: "in",
        type: "number",
        min: "1",
        max: "180",
        value: S.prefs.dur[id],
        style: "width:56px",
        onchange: function () {
          var v = Math.max(
            1,
            Math.min(180, parseInt(this.value, 10) || S.prefs.dur[id])
          );
          this.value = v;
          S.prefs.dur[id] = v;
          save();
          if (!T.running && T.mode === id) setMode(id);
        },
      });
    }
    w.body.append(
      el(
        "div",
        { class: "col tm" },
        modes,
        lcd,
        bar,
        el("div", { class: "row", style: "gap:6px" }, go, rs),
        el("fieldset", null, el("legend", null, "I'm working on"), lab),
        el(
          "fieldset",
          null,
          el("legend", null, "Progress"),
          el(
            "div",
            { class: "stats" },
            el("span", null, "Sessions today:"),
            sToday,
            el("span", null, "Minutes focused today:"),
            sMin,
            el("span", null, "Day streak:"),
            sStreak,
            el("span", null, "Total sessions:"),
            sAll
          )
        ),
        el(
          "fieldset",
          null,
          el("legend", null, "Background sound"),
          el(
            "div",
            { class: "row", style: "gap:8px;align-items:center" },
            el(
              "select",
              {
                class: "in",
                onchange: function () {
                  setAmbient(this.value);
                },
              },
              [
                ["off", "Off"],
                ["brown", "Brown noise"],
                ["white", "White noise"],
                ["rain", "Rain"],
              ].map(function (o) {
                return el(
                  "option",
                  { value: o[0], selected: amb.kind === o[0] },
                  o[1]
                );
              })
            ),
            el(
              "span",
              { class: "dim", style: "padding:0" },
              "Plays until you turn it off"
            )
          )
        ),
        el(
          "fieldset",
          null,
          el("legend", null, "Lengths (minutes)"),
          el(
            "div",
            {
              class: "row",
              style: "gap:10px;align-items:center;flex-wrap:wrap",
            },
            el("span", null, "Focus"),
            num("focus"),
            el("span", null, "Short"),
            num("short"),
            el("span", null, "Long"),
            num("long")
          )
        )
      )
    );
    function paint() {
      lcd.textContent = mmss(T.left);
      var done = Math.round((1 - T.left / T.total) * 24);
      blocks.forEach(function (b, i) {
        b.className = i < done ? "f" : "";
      });
      go.textContent = T.running
        ? "Pause"
        : T.left < T.total && T.left > 0
        ? "Resume"
        : "Start";
      for (var m in modeBtns) modeBtns[m].classList.toggle("on", m === T.mode);
      var d = S.stats[ymd(new Date())] || { sessions: 0, minutes: 0 },
        all = 0;
      for (var k in S.stats) all += S.stats[k].sessions || 0;
      sToday.textContent = d.sessions;
      sMin.textContent = d.minutes;
      sStreak.textContent = streak();
      sAll.textContent = all;
      w.status(
        T.running
          ? T.mode === "focus"
            ? "Focusing… stay on task."
            : "On a break."
          : "Timer stopped."
      );
    }
    w.refresh = paint;
    paint();
  }

  /* ================= APP: CALENDAR LINK ================= */
  function appCanvas(w) {
    var fileIn = el("input", {
      type: "file",
      accept: ".ics,text/calendar",
      style: "display:none",
      onchange: function () {
        var f = this.files && this.files[0];
        if (!f) return;
        var r = new FileReader();
        r.onload = function () {
          doImport(String(r.result));
        };
        r.readAsText(f);
        this.value = "";
      },
    });
    var paste = el("textarea", {
      class: "in",
      rows: 3,
      placeholder: "…or paste the text of the .ics file here",
      style: 'width:100%;resize:vertical;font:11px "Courier New",monospace',
    });
    var how = el(
      "details",
      { class: "pad", open: !S.assign.length },
      el(
        "summary",
        { style: "cursor:default;font-weight:bold" },
        "How to connect a calendar"
      ),
      el(
        "ol",
        { style: "margin:6px 0 6px;padding-left:20px;line-height:1.5" },
        el(
          "li",
          null,
          "In Canvas, open Calendar and click “Calendar Feed” (lower right). Copy the link."
        ),
        el(
          "li",
          null,
          "Paste that link in a new browser tab. It downloads a .ics file."
        ),
        el(
          "li",
          null,
          "Load that file below. Assignments land in this list and on your Calendar."
        )
      ),
      el(
        "div",
        { class: "ic-ics" },
        el(
          "details",
          null,
          el("summary", null, "Import from Apple Calendar (iCloud)"),
          el(
            "ol",
            null,
            el(
              "li",
              null,
              "In Apple Calendar on Mac, or at icloud.com → Calendar, right-click the calendar you want."
            ),
            el(
              "li",
              null,
              "Choose “Export…” (Mac) or “Share Calendar” then copy the public webcal link."
            ),
            el("li", null, "Load the downloaded .ics below.")
          )
        ),
        el(
          "details",
          null,
          el("summary", null, "Import from Infinite Campus"),
          el(
            "ol",
            null,
            el("li", null, "Sign in to your school's Infinite Campus portal."),
            el(
              "li",
              null,
              "Open Calendar, then look for “Export” or “Subscribe to Calendar”."
            ),
            el(
              "li",
              null,
              "Copy the .ics link, or download the file, and load it below. If your district doesn't expose one, ask your IT department whether calendar export is enabled."
            )
          )
        ),
        el(
          "details",
          null,
          el("summary", null, "Import from another .ics source"),
          el(
            "ol",
            null,
            el(
              "li",
              null,
              "Any calendar app that can export .ics will work: Google Calendar, Outlook, Zimbra, your school portal."
            ),
            el("li", null, "Load the .ics file below.")
          )
        )
      ),
      el(
        "div",
        { class: "row", style: "gap:6px;margin-bottom:6px;flex-wrap:wrap" },
        el(
          "button",
          {
            class: "btn",
            onclick: function () {
              fileIn.click();
            },
          },
          "Browse for .ics…"
        ),
        el(
          "button",
          {
            class: "btn",
            onclick: function () {
              if (paste.value.trim()) {
                doImport(paste.value);
                paste.value = "";
              } else paste.focus();
            },
          },
          "Import pasted text"
        ),
        fileIn
      ),
      paste,
      el(
        "div",
        { class: "dim", style: "padding:6px 0 0" },
        "A web page can't log in to Canvas directly, so the feed file is the link. Re-import any time; duplicates are skipped."
      )
    );
    function doImport(txt) {
      var evs = parseICS(txt);
      if (!evs.length) {
        msgBox({
          title: "Calendar Import",
          icon: "err",
          text: "No events found. Make sure this is a valid .ics calendar file.",
        });
        return;
      }
      var na = 0,
        ne = 0,
        dup = 0;
      evs.forEach(function (e) {
        var d = icsDate(e.DTSTART || e.DUE);
        if (!d) return;
        var sum = unesc(e.SUMMARY),
          m = sum.match(/\[([^\]]+)\]\s*$/),
          course = m ? m[1] : "",
          title = m ? sum.slice(0, m.index).trim() : sum;
        var id = e.UID || sum + e.DTSTART,
          isA = /assignment/i.test(id);
        if (isA) {
          if (
            S.assign.some(function (a) {
              return a.uid === id;
            })
          ) {
            dup++;
            return;
          }
          S.assign.push({
            id: uid(),
            uid: id,
            title: title || "(untitled)",
            course: course,
            due: d.ms,
            allDay: d.allDay,
            done: false,
            src: "canvas",
            url: /^https?:\/\//i.test(e.URL || "") ? clip(e.URL, 600) : "",
          });
          na++;
        } else {
          if (
            S.events.some(function (x) {
              return x.uid === id;
            })
          ) {
            dup++;
            return;
          }
          var dd = new Date(d.ms);
          S.events.push({
            id: uid(),
            uid: id,
            title: (course ? course + ": " : "") + title,
            date: ymd(dd),
            time: d.allDay ? "" : hm(dd),
            kind: "class",
            src: "canvas",
            repeat: "none",
          });
          ne++;
        }
      });
      save();
      refreshAll();
      msgBox({
        title: "Calendar Import",
        icon: "info",
        text:
          "Import complete.\n\n" +
          na +
          " assignment(s) added\n" +
          ne +
          " calendar event(s) added\n" +
          dup +
          " duplicate(s) skipped",
      });
    }
    var mTitle = el("input", {
      class: "in",
      placeholder: "Assignment title",
      style: "flex:1 1 140px",
    });
    var mCourse = el("input", {
      class: "in",
      placeholder: "Course",
      style: "width:90px",
    });
    var mDate = el("input", {
      class: "in",
      type: "date",
      value: ymd(new Date(Date.now() + 86400000)),
      style: "width:130px",
    });
    var mTime = el("input", {
      class: "in",
      type: "time",
      value: "23:59",
      style: "width:96px",
    });
    function addManual() {
      var t = mTitle.value.trim();
      if (!t) {
        mTitle.focus();
        return;
      }
      var ms = new Date(mDate.value + "T" + (mTime.value || "23:59")).getTime();
      if (isNaN(ms)) {
        msgBox({
          title: "Calendar Link",
          icon: "err",
          text: "Pick a valid due date.",
        });
        return;
      }
      S.assign.push({
        id: uid(),
        uid: "manual-" + uid(),
        title: t,
        course: mCourse.value.trim(),
        due: ms,
        allDay: false,
        done: false,
        src: "manual",
      });
      mTitle.value = "";
      save();
      refreshAll();
    }
    onEnter(mTitle, addManual);
    var manual = el(
      "div",
      { class: "row form" },
      mTitle,
      mCourse,
      mDate,
      mTime,
      el("button", { class: "btn sm", onclick: addManual }, "Add")
    );
    var fCourse = el("select", { class: "in", onchange: draw });
    var hideDone = el("input", {
      type: "checkbox",
      checked: true,
      onchange: draw,
    });
    var filt = el(
      "div",
      { class: "row form", style: "padding-top:0" },
      el("span", null, "Course:"),
      fCourse,
      el(
        "label",
        { style: "display:flex;align-items:center" },
        hideDone,
        "Hide completed"
      ),
      el(
        "button",
        {
          class: "btn sm",
          style: "margin-left:auto",
          onclick: function () {
            msgBox({
              title: "Clear Imported",
              icon: "q",
              text: "Move everything imported from a calendar to the Recycle Bin?\nAssignments you added by hand stay.",
              buttons: [
                {
                  label: "Yes",
                  fn: function () {
                    softDelete("assign", function (a) {
                      return a.src === "canvas";
                    });
                    softDelete("events", function (e) {
                      return e.src === "canvas";
                    });
                  },
                },
                { label: "No" },
              ],
            });
          },
        },
        "Clear imported"
      )
    );
    var list = el("div", {
      class: "sunk list",
      style: "min-height:140px;flex:1 0 140px",
    });
    w.body.append(how, manual, filt, list);
    function draw() {
      var courses = {};
      S.assign.forEach(function (a) {
        if (a.course) courses[a.course] = 1;
      });
      var prev = fCourse.value;
      fCourse.textContent = "";
      fCourse.append(el("option", { value: "" }, "All courses"));
      Object.keys(courses)
        .sort()
        .forEach(function (c) {
          fCourse.append(el("option", { value: c }, c));
        });
      fCourse.value = courses[prev] ? prev : "";
      list.textContent = "";
      var now = Date.now(),
        rows = S.assign
          .filter(function (a) {
            if (fCourse.value && a.course !== fCourse.value) return false;
            if (hideDone.checked && a.done) return false;
            return true;
          })
          .sort(function (a, b) {
            return a.due - b.due;
          });
      if (!rows.length)
        list.append(
          el(
            "div",
            { class: "dim" },
            S.assign.length
              ? "Nothing to show with these filters."
              : "No assignments yet. Import a calendar above, or add one by hand."
          )
        );
      rows.forEach(function (a) {
        var over = !a.done && a.due < now,
          soon = !a.done && !over && a.due - now < 172800000;
        list.append(
          el(
            "div",
            {
              class:
                "lrow" +
                (a.done ? " done" : "") +
                (over ? " over" : "") +
                (soon ? " soon" : ""),
            },
            el("input", {
              type: "checkbox",
              checked: a.done,
              "aria-label": "Completed",
              onchange: function () {
                a.done = this.checked;
                save();
                refreshAll();
              },
            }),
            a.course ? el("span", { class: "tag" }, a.course) : null,
            el(
              "span",
              {
                class: "t",
                style: "cursor:default",
                onclick: function () {
                  openAssignmentViewer(a.id);
                },
                title: "Click to open the assignment viewer",
              },
              a.url
                ? el(
                    "a",
                    {
                      href: a.url,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      style: "color:#0000c0",
                      onclick: function (e) {
                        e.stopPropagation();
                      },
                    },
                    a.title
                  )
                : a.title
            ),
            el(
              "span",
              { class: "w" },
              whenStr(a.due, a.allDay) + (a.done ? "" : " \u00b7 " + rel(a.due))
            ),
            el(
              "button",
              {
                class: "btn xs",
                "aria-label": "Details",
                onclick: function () {
                  openAssignmentViewer(a.id);
                },
              },
              "\u25B8"
            ),
            el(
              "button",
              {
                class: "btn xs",
                "aria-label": "Delete",
                onclick: function () {
                  softDelete("assign", function (x) {
                    return x.id === a.id;
                  });
                },
              },
              "X"
            )
          )
        );
      });
      var open = S.assign.filter(function (a) {
        return !a.done;
      });
      w.status(
        open.length +
          " open · " +
          open.filter(function (a) {
            return a.due < now;
          }).length +
          " overdue · " +
          S.assign.length +
          " total"
      );
    }
    w.refresh = draw;
    draw();
  }

  /* ================= APP: FLASH CARDS (SRS) ================= */
  function appCards(w) {
    var mode = "study",
      deck = "",
      flipped = false,
      curCard = null,
      studyMode = "due";
    var deckSel = el("select", {
      class: "in",
      onchange: function () {
        deck = this.value;
        curCard = null;
        draw();
      },
    });
    var modeSel = el(
      "select",
      {
        class: "in",
        title: "Cards to study",
        onchange: function () {
          studyMode = this.value;
          curCard = null;
          draw();
        },
      },
      [
        ["due", "Due / new only"],
        ["all", "All cards"],
      ].map(function (o) {
        return el("option", { value: o[0] }, o[1]);
      })
    );
    var bStudy = el(
      "button",
      {
        class: "btn sm",
        onclick: function () {
          mode = "study";
          draw();
        },
      },
      "Study"
    );
    var bMng = el(
      "button",
      {
        class: "btn sm",
        onclick: function () {
          mode = "manage";
          draw();
        },
      },
      "Cards"
    );
    var top = el(
      "div",
      { class: "row", style: "gap:4px;align-items:center;flex-wrap:wrap" },
      el("span", null, "Deck:"),
      deckSel,
      el("span", null, "Show:"),
      modeSel,
      el("span", { style: "flex:1" }),
      bStudy,
      bMng
    );
    var main = el("div", {
      class: "col",
      style: "flex:1;min-height:0;gap:6px",
    });
    w.body.append(el("div", { class: "col fc" }, top, main));
    function pool() {
      return S.cards.filter(function (c) {
        return !deck || c.deck === deck;
      });
    }
    function dueNow(c) {
      return !c.dueAt || c.dueAt <= Date.now();
    }
    function dueCards() {
      var p = pool();
      if (studyMode === "all") return p;
      return p.filter(dueNow);
    }
    function pick() {
      var p = dueCards();
      if (!p.length) return null;
      var newCards = p.filter(function (c) {
        return (c.reps || 0) === 0;
      });
      var candidateSet = newCards.length && Math.random() < 0.35 ? newCards : p;
      var c2 = candidateSet.filter(function (c) {
        return !curCard || c.id !== curCard.id || candidateSet.length === 1;
      });
      return c2[Math.floor(Math.random() * c2.length)];
    }
    function grade(c, g) {
      var now = Date.now();
      c.reps = c.reps || 0;
      c.ease = c.ease || 2.5;
      c.interval = c.interval || 0;
      if (g === 0) {
        c.lapses = (c.lapses || 0) + 1;
        c.reps = 0;
        c.ease = Math.max(1.3, c.ease - 0.2);
        c.interval = 0;
        c.dueAt = now + 60 * 1000;
        c.box = 0;
      } else if (g === 1) {
        c.ease = Math.max(1.3, c.ease - 0.15);
        c.interval = c.interval < 1 ? 1 : c.interval * 1.2;
        c.dueAt = now + c.interval * 86400000;
        c.box = Math.min(3, (c.box || 0) + 1);
      } else if (g === 2) {
        c.reps++;
        if (c.interval < 1) c.interval = 1;
        else if (c.interval < 6) c.interval = 6;
        else c.interval = c.interval * c.ease;
        c.dueAt = now + c.interval * 86400000;
        c.box = Math.min(3, (c.box || 0) + 1);
      } else {
        c.reps++;
        c.ease = Math.min(3.5, c.ease + 0.15);
        c.interval = c.interval < 1 ? 3 : c.interval * c.ease * 1.3;
        c.dueAt = now + c.interval * 86400000;
        c.box = 3;
      }
      save();
    }
    function drawDecks() {
      var ds = {};
      S.cards.forEach(function (c) {
        ds[c.deck] = 1;
      });
      deckSel.textContent = "";
      deckSel.append(el("option", { value: "" }, "All decks"));
      Object.keys(ds)
        .sort()
        .forEach(function (d) {
          deckSel.append(el("option", { value: d }, d));
        });
      if (!ds[deck]) deck = "";
      deckSel.value = deck;
    }
    function drawStudy() {
      main.textContent = "";
      var p = pool();
      if (!p.length) {
        main.append(
          el(
            "div",
            { class: "sunk card" },
            el("div", null, "No cards yet.\nOpen “Cards” to add some.")
          )
        );
        return;
      }
      var due = dueCards();
      if (!due.length) {
        var nextCard = p.slice().sort(function (a, b) {
          return (a.dueAt || 0) - (b.dueAt || 0);
        })[0];
        var when = nextCard ? nextCard.dueAt : 0;
        main.append(
          el(
            "div",
            { class: "sunk card" },
            el(
              "div",
              null,
              el("small", null, "All caught up"),
              "No cards are due right now.\n\n" +
                (when ? "Next card due " + whenStr(when) + "." : "") +
                "\n\nSwitch Show to “All cards” to review anyway."
            )
          )
        );
        return;
      }
      if (
        !curCard ||
        !due.some(function (c) {
          return c.id === curCard.id;
        })
      ) {
        curCard = pick();
        flipped = false;
      }
      if (!curCard) return;
      var dueCount = due.length;
      var newCount = p.filter(function (c) {
        return (c.reps || 0) === 0;
      }).length;
      var card = el(
        "div",
        {
          class: "sunk card",
          onclick: function () {
            flipped = !flipped;
            drawStudy();
          },
        },
        el(
          "div",
          null,
          el(
            "small",
            null,
            flipped ? "Answer (click to flip back)" : "Question (click to flip)"
          ),
          cardFace(curCard, flipped)
        )
      );
      var btns;
      if (!flipped) {
        btns = el(
          "div",
          { class: "row", style: "gap:6px;justify-content:center" },
          el(
            "button",
            {
              class: "btn",
              onclick: function () {
                flipped = true;
                drawStudy();
              },
            },
            "Show Answer"
          )
        );
      } else {
        btns = el(
          "div",
          {
            class: "row",
            style: "gap:6px;justify-content:center;flex-wrap:wrap",
          },
          el(
            "button",
            {
              class: "btn",
              style: "background:#c00000;color:#fff",
              onclick: function () {
                grade(curCard, 0);
                curCard = pick();
                flipped = false;
                drawStudy();
              },
            },
            "Again (0)"
          ),
          el(
            "button",
            {
              class: "btn",
              style: "background:#a05000;color:#fff",
              onclick: function () {
                grade(curCard, 1);
                curCard = pick();
                flipped = false;
                drawStudy();
              },
            },
            "Hard (1)"
          ),
          el(
            "button",
            {
              class: "btn",
              style: "background:#006000;color:#fff",
              onclick: function () {
                grade(curCard, 2);
                curCard = pick();
                flipped = false;
                drawStudy();
              },
            },
            "Good (2)"
          ),
          el(
            "button",
            {
              class: "btn",
              style: "background:#000080;color:#fff",
              onclick: function () {
                grade(curCard, 3);
                curCard = pick();
                flipped = false;
                drawStudy();
              },
            },
            "Easy (3)"
          )
        );
      }
      main.append(card, btns);
      w.status(
        dueCount +
          " due · " +
          newCount +
          " new · " +
          p.length +
          " total in deck"
      );
    }
    function importCards(deckName) {
      var ta = el("textarea", {
        class: "in",
        rows: 8,
        placeholder:
          "photosynthesis\tTurning light into chemical energy\nmitosis - cell division",
        style:
          'width:100%;resize:vertical;margin-top:8px;font:12px "Courier New",monospace',
      });
      var dn = el("input", {
        class: "in",
        value: deckName || "Imported",
        style: "width:100%;margin-top:8px",
      });
      msgBox({
        title: "Import Cards",
        icon: "info",
        width: 430,
        text: 'Paste one card per line: the term, then a tab, " - ", " | ", ";" or "," and the definition. Works with Quizlet exports. Deck name:',
        extra: el("div", null, dn, ta),
        buttons: [
          {
            label: "Import",
            fn: function () {
              var n = 0;
              ta.value.split(/\r?\n/).forEach(function (line) {
                line = line.trim();
                if (!line) return;
                var seps = ["\t", " | ", " - ", ";", ","],
                  q2 = "",
                  a2 = "";
                for (var i = 0; i < seps.length; i++) {
                  var ix = line.indexOf(seps[i]);
                  if (ix > 0) {
                    q2 = line.slice(0, ix).trim();
                    a2 = line.slice(ix + seps[i].length).trim();
                    break;
                  }
                }
                if (q2 && a2 && S.cards.length < 5000) {
                  S.cards.push({
                    id: uid(),
                    deck: clip(dn.value.trim() || "Imported", 40),
                    q: clip(q2, 1000),
                    a: clip(a2, 2000),
                    box: 0,
                    dueAt: Date.now(),
                    interval: 0,
                    ease: 2.5,
                    reps: 0,
                    lapses: 0,
                  });
                  n++;
                }
              });
              save();
              curCard = null;
              drawDecks();
              drawManage();
              msgBox({
                title: "Import Cards",
                icon: "info",
                text:
                  n +
                  " card(s) imported." +
                  (n
                    ? ""
                    : "\nNo line had a separator between the term and the definition."),
              });
            },
          },
          { label: "Cancel" },
        ],
      });
    }
    function drawManage() {
      main.textContent = "";
      var dIn = el("input", {
        class: "in",
        placeholder: "Deck",
        list: "decklist",
        value: deck,
        style: "width:110px",
      });
      var dl = el(
        "datalist",
        { id: "decklist" },
        Object.keys(
          S.cards.reduce(function (o, c) {
            o[c.deck] = 1;
            return o;
          }, {})
        ).map(function (d) {
          return el("option", { value: d });
        })
      );
      var q = el("input", {
        class: "in",
        placeholder: "Front (question)",
        style: "flex:1 1 120px",
      });
      var a = el("input", {
        class: "in",
        placeholder: "Back (answer)",
        style: "flex:1 1 120px",
      });
      function addCard() {
        var qq = q.value.trim(),
          aa = a.value.trim();
        if (!qq || !aa) {
          (qq ? a : q).focus();
          return;
        }
        S.cards.push({
          id: uid(),
          deck: dIn.value.trim() || "General",
          q: qq,
          a: aa,
          box: 0,
          dueAt: Date.now(),
          interval: 0,
          ease: 2.5,
          reps: 0,
          lapses: 0,
        });
        save();
        curCard = null;
        drawDecks();
        drawManage();
      }
      onEnter(a, addCard);
      onEnter(q, function () {
        a.focus();
      });
      attachImagePaste(q, function (md) {
        insertAtCursor(q, md);
      });
      attachImagePaste(a, function (md) {
        insertAtCursor(a, md);
      });
      var list = el("div", { class: "sunk list", style: "margin:0" });
      pool().forEach(function (c) {
        var stats =
          (c.reps || 0) === 0
            ? "new"
            : c.interval < 1
            ? "learning"
            : Math.round(c.interval) + "d";
        list.append(
          el(
            "div",
            { class: "lrow" },
            el("span", { class: "tag" }, c.deck),
            el("span", { class: "t" }, cardLabel(c)),
            el(
              "span",
              { class: "w", style: "font-size:10px;color:#606060" },
              stats
            ),
            c.cloze || c.occ
              ? el(
                  "button",
                  {
                    class: "btn xs",
                    "aria-label": "Edit",
                    onclick: function () {
                      (c.occ ? occDialog : clozeDialog)(c.deck, function () {
                        curCard = null;
                        drawDecks();
                        drawManage();
                      }, c);
                    },
                  },
                  "Edit"
                )
              : null,
            el(
              "button",
              {
                class: "btn xs",
                "aria-label": "Delete",
                onclick: function () {
                  softDelete("cards", function (x) {
                    return x.id === c.id;
                  });
                  curCard = null;
                  drawDecks();
                  drawManage();
                },
              },
              "X"
            )
          )
        );
      });
      if (!pool().length)
        list.append(
          el("div", { class: "dim" }, "Empty. Add your first card above.")
        );
      main.append(
        el(
          "div",
          { class: "row", style: "gap:4px;flex-wrap:wrap" },
          dIn,
          dl,
          q,
          a,
          el("button", { class: "btn sm", onclick: addCard }, "Add"),
          el(
            "button",
            {
              class: "btn sm",
              onclick: function () {
                importCards(dIn.value.trim());
              },
            },
            "Import\u2026"
          ),
          el(
            "button",
            {
              class: "btn sm",
              title: "Fill-in-the-blank cards from {{c1::text}}",
              onclick: function () {
                clozeDialog(dIn.value.trim(), function () {
                  curCard = null;
                  drawDecks();
                  drawManage();
                });
              },
            },
            "Cloze\u2026"
          ),
          el(
            "button",
            {
              class: "btn sm",
              title: "Hide parts of a diagram",
              onclick: function () {
                occDialog(dIn.value.trim(), function () {
                  curCard = null;
                  drawDecks();
                  drawManage();
                });
              },
            },
            "Occlusion\u2026"
          )
        ),
        list
      );
      w.status(pool().length + " cards");
    }
    function draw() {
      drawDecks();
      bStudy.classList.toggle("on", mode === "study");
      bMng.classList.toggle("on", mode === "manage");
      if (mode === "study") drawStudy();
      else drawManage();
    }
    if (!S.cards.length) {
      S.cards.push(
        {
          id: uid(),
          deck: "Sample",
          q: "What is the Pomodoro Technique?",
          a: "Work in focused 25-minute blocks separated by short breaks.",
          box: 0,
          dueAt: Date.now(),
          interval: 0,
          ease: 2.5,
          reps: 0,
          lapses: 0,
        },
        {
          id: uid(),
          deck: "Sample",
          q: "Why test yourself instead of re-reading?",
          a: "Retrieval practice strengthens memory far more than passive review.",
          box: 0,
          dueAt: Date.now(),
          interval: 0,
          ease: 2.5,
          reps: 0,
          lapses: 0,
        }
      );
      save();
    }
    w.refresh = draw;
    draw();
  }

  /* ================= APP: RESEARCH ================= */
  var ENGINES = [
    ["Google", "https://www.google.com/search?q="],
    ["Wikipedia", "https://en.wikipedia.org/w/index.php?search="],
    ["YouTube", "https://www.youtube.com/results?search_query="],
    ["Scholar", "https://scholar.google.com/scholar?q="],
    ["Khan Academy", "https://www.google.com/search?q=site%3Akhanacademy.org+"],
    ["MIT OCW", "https://www.google.com/search?q=site%3Aocw.mit.edu+"],
    ["Quizlet", "https://quizlet.com/search?query="],
    ["Wolfram|Alpha", "https://www.wolframalpha.com/input?i="],
  ];
  var WHERE = {
    google: 0,
    wikipedia: 1,
    youtube: 2,
    scholar: 3,
    khan: 4,
    ocw: 5,
    quizlet: 6,
    wolfram: 7,
  };
  function engUrl(i, q) {
    return ENGINES[i][1] + encodeURIComponent(q);
  }

  function appResearch(w) {
    var ctl = null,
      lastText = "";
    var lastTopic = "";
    var lastResearchText = "";
    function clipyHasContent() {
      return !!(lastTopic || lastResearchText);
    }
    function summarizeInline(got, q) {
      var lines = [];
      lines.push("Topic: " + q);
      if (got.ddg) {
        var dd = got.ddg;
        if (dd.answer) lines.push("Quick answer: " + dd.answer);
        if (dd.abstract)
          lines.push(
            (dd.heading || "Summary") +
              ": " +
              dd.abstract +
              (dd.source ? " (source: " + dd.source + ")" : "")
          );
      }
      if (got.wiki && got.wiki.length) {
        lines.push("\nWikipedia:");
        got.wiki.forEach(function (r) {
          lines.push("- " + r.title + ": " + r.snippet);
        });
      }
      if (got.papers && got.papers.length) {
        lines.push("\nAcademic papers:");
        got.papers.forEach(function (r) {
          lines.push(
            "- " +
              r.title +
              (r.authors ? " \u2014 " + r.authors : "") +
              (r.year ? " (" + r.year + ")" : "")
          );
        });
      }
      if (got.books && got.books.length) {
        lines.push("\nBooks:");
        got.books.forEach(function (r) {
          lines.push(
            "- " + r.title + (r.authors ? " \u2014 " + r.authors : "")
          );
        });
      }
      if (got.terms && got.terms.length) {
        lines.push("\nRelated terms: " + got.terms.join(", "));
      }
      return lines.join("\n");
    }
    var tIn = el("input", {
      class: "in",
      placeholder: "What are you studying? e.g. mitosis vs meiosis",
      style: "flex:1 1 200px",
    });
    var noteSel = el("select", { class: "in", style: "max-width:170px" });
    function fillNotes() {
      var v = noteSel.value;
      noteSel.textContent = "";
      noteSel.append(el("option", { value: "" }, "(none)"));
      S.notes.forEach(function (n) {
        var t = (n.text || "").split("\n")[0].trim() || "(untitled)";
        noteSel.append(el("option", { value: n.id }, clip(t, 28)));
      });
      noteSel.value = S.notes.some(function (n) {
        return n.id === v;
      })
        ? v
        : "";
    }
    function topic() {
      var t = tIn.value.trim();
      if (!t && noteSel.value) {
        var n = findNote(noteSel.value);
        if (n) t = clip((n.text || "").split("\n")[0].trim(), 80);
      }
      return t;
    }
    function noteBody() {
      var n = noteSel.value ? findNote(noteSel.value) : null;
      return n ? clip(n.text, 12000) : "";
    }
    var stateLine = el("div", { class: "res-status" });
    var out = el(
      "div",
      { class: "sunk out" },
      "Results appear below when you search inside the window."
    );
    var results = el("div", { class: "col", style: "gap:2px" });
    var resPanel = el("div", { class: "res-panel" });
    var claudeBtns = [];
    var stopBtn = el(
      "button",
      {
        class: "btn sm",
        hidden: true,
        onclick: function () {
          if (ctl) ctl.abort();
        },
      },
      "Stop"
    );
    var SRC = [
      { key: "wiki", label: "Wikipedia", on: true },
      { key: "ddg", label: "Quick answer", on: true },
      { key: "papers", label: "Papers", on: true },
      { key: "books", label: "Books", on: true },
      { key: "terms", label: "Related terms", on: true },
    ];
    var srcBoxes = {};
    var srcRow = el(
      "div",
      {
        class: "row",
        style: "gap:8px;flex-wrap:wrap;padding:2px 0;font-size:11px",
      },
      SRC.map(function (s) {
        var cb = el("input", {
          type: "checkbox",
          checked: s.on,
          onchange: function () {
            s.on = this.checked;
          },
        });
        srcBoxes[s.key] = cb;
        return el(
          "label",
          { style: "display:flex;align-items:center;gap:3px" },
          cb,
          s.label
        );
      })
    );
    var busy = false;
    function setBusy(b) {
      busy = b;
      claudeBtns.forEach(function (x) {
        x.disabled = b;
      });
      stopBtn.hidden = !b;
    }
    function wikiSearch(q) {
      return fetch(
        "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" +
          encodeURIComponent(q) +
          "&format=json&origin=*&srlimit=6"
      )
        .then(function (r) {
          return r.json();
        })
        .then(function (j) {
          var list = (j && j.query && j.query.search) || [];
          return list.map(function (x) {
            return {
              title: x.title,
              snippet: String(x.snippet || "").replace(/<[^>]*>/g, ""),
              url:
                "https://en.wikipedia.org/wiki/" +
                encodeURIComponent(x.title.replace(/ /g, "_")),
            };
          });
        });
    }
    function ddgSearch(q) {
      return fetch(
        "https://api.duckduckgo.com/?q=" +
          encodeURIComponent(q) +
          "&format=json&no_html=1&skip_disambig=1&t=focusdesk96"
      )
        .then(function (r) {
          return r.json();
        })
        .then(function (j) {
          if (!j) return null;
          return {
            answer: j.Answer || "",
            abstract: j.AbstractText || "",
            source: j.AbstractSource || "",
            url: j.AbstractURL || "",
            heading: j.Heading || "",
          };
        });
    }
    function crossrefSearch(q) {
      return fetch(
        "https://api.crossref.org/works?query=" +
          encodeURIComponent(q) +
          "&rows=5&select=title,author,DOI,published,container-title"
      )
        .then(function (r) {
          return r.json();
        })
        .then(function (j) {
          var items = (j && j.message && j.message.items) || [];
          return items
            .map(function (x) {
              var au = (x.author || [])
                .slice(0, 3)
                .map(function (a) {
                  return ((a.given || "") + " " + (a.family || "")).trim();
                })
                .filter(Boolean)
                .join(", ");
              var yr =
                x.published &&
                x.published["date-parts"] &&
                x.published["date-parts"][0] &&
                x.published["date-parts"][0][0];
              return {
                title: (x.title && x.title[0]) || "",
                authors: au,
                journal:
                  (x["container-title"] && x["container-title"][0]) || "",
                year: yr,
                url: x.DOI ? "https://doi.org/" + x.DOI : "",
              };
            })
            .filter(function (x) {
              return x.title;
            });
        });
    }
    function openLibSearch(q) {
      return fetch(
        "https://openlibrary.org/search.json?q=" +
          encodeURIComponent(q) +
          "&limit=5"
      )
        .then(function (r) {
          return r.json();
        })
        .then(function (j) {
          return ((j && j.docs) || []).map(function (x) {
            return {
              title: x.title,
              authors: (x.author_name || []).slice(0, 2).join(", "),
              year: x.first_publish_year,
              url: x.key ? "https://openlibrary.org" + x.key : "",
            };
          });
        });
    }
    function datamuseRelated(q) {
      return fetch(
        "https://api.datamuse.com/words?ml=" + encodeURIComponent(q) + "&max=14"
      )
        .then(function (r) {
          return r.json();
        })
        .then(function (j) {
          return j.map(function (x) {
            return x.word;
          });
        });
    }
    function section(title, count, children) {
      var box = el("div", { class: "res-section" });
      var h = el("h4", null, title);
      if (count != null)
        h.append(el("span", { class: "rn" }, "(" + count + ")"));
      box.append(h);
      children.forEach(function (c) {
        if (c) box.append(c);
      });
      return box;
    }
    function card(title, snippet, meta, url) {
      return el(
        "div",
        {
          class: "res-card",
          onclick: function () {
            if (url) openUrl(url);
          },
          title: url ? "Click to open in a new tab" : "",
        },
        el("div", { class: "rt" }, clip(title, 200)),
        snippet ? el("div", { class: "rs" }, clip(snippet, 260)) : null,
        meta ? el("div", { class: "rm" }, meta) : null
      );
    }
    function termChips(words) {
      return el(
        "div",
        { class: "res-terms" },
        words.map(function (wd) {
          return el(
            "span",
            {
              onclick: function () {
                tIn.value = wd;
                runInlineSearch();
              },
            },
            wd
          );
        })
      );
    }
    function runInlineSearch() {
      var q = topic();
      if (!q) {
        tIn.focus();
        stateLine.textContent = "Type a topic first.";
        return;
      }
      if (busy) return;
      resPanel.textContent = "";
      out.textContent = "";
      results.textContent = "";
      stateLine.textContent = "Searching for \u201c" + q + "\u201d\u2026";
      var pending = [];
      if (srcBoxes.wiki.checked)
        pending.push(
          wikiSearch(q).then(
            function (r) {
              return { k: "wiki", v: r };
            },
            function () {
              return { k: "wiki", v: [] };
            }
          )
        );
      if (srcBoxes.ddg.checked)
        pending.push(
          ddgSearch(q).then(
            function (r) {
              return { k: "ddg", v: r };
            },
            function () {
              return { k: "ddg", v: null };
            }
          )
        );
      if (srcBoxes.papers.checked)
        pending.push(
          crossrefSearch(q).then(
            function (r) {
              return { k: "papers", v: r };
            },
            function () {
              return { k: "papers", v: [] };
            }
          )
        );
      if (srcBoxes.books.checked)
        pending.push(
          openLibSearch(q).then(
            function (r) {
              return { k: "books", v: r };
            },
            function () {
              return { k: "books", v: [] };
            }
          )
        );
      if (srcBoxes.terms.checked)
        pending.push(
          datamuseRelated(q).then(
            function (r) {
              return { k: "terms", v: r };
            },
            function () {
              return { k: "terms", v: [] };
            }
          )
        );
      var got = {};
      Promise.all(pending).then(function (list) {
        list.forEach(function (x) {
          got[x.k] = x.v;
        });
        resPanel.textContent = "";
        var total = 0;
        if (got.ddg) {
          var dd = got.ddg,
            rows = [];
          if (dd.answer)
            rows.push(
              el(
                "div",
                { style: "font-weight:bold;color:#006000;padding:4px 6px" },
                dd.answer
              )
            );
          if (dd.abstract)
            rows.push(
              el(
                "div",
                {
                  class: "res-card",
                  onclick: function () {
                    if (dd.url) openUrl(dd.url);
                  },
                },
                el("div", { class: "rt" }, dd.heading || q),
                el("div", { class: "rs" }, clip(dd.abstract, 400)),
                dd.source
                  ? el("div", { class: "rm" }, "Source: " + dd.source)
                  : null
              )
            );
          if (rows.length) {
            resPanel.append(section("Quick answer", null, rows));
            total += rows.length;
          }
        }
        if (got.wiki && got.wiki.length) {
          resPanel.append(
            section(
              "Wikipedia",
              got.wiki.length,
              got.wiki.map(function (r) {
                return card(r.title, r.snippet, "en.wikipedia.org", r.url);
              })
            )
          );
          total += got.wiki.length;
        }
        if (got.papers && got.papers.length) {
          resPanel.append(
            section(
              "Academic papers",
              got.papers.length,
              got.papers.map(function (r) {
                var meta = [];
                if (r.authors) meta.push(r.authors);
                if (r.journal) meta.push("* " + r.journal);
                if (r.year) meta.push("(" + r.year + ")");
                return card(r.title, "", meta.join(" ") || "Crossref", r.url);
              })
            )
          );
          total += got.papers.length;
        }
        if (got.books && got.books.length) {
          resPanel.append(
            section(
              "Books",
              got.books.length,
              got.books.map(function (r) {
                var m = [];
                if (r.authors) m.push(r.authors);
                if (r.year) m.push("(" + r.year + ")");
                return card(r.title, "", m.join(" ") || "Open Library", r.url);
              })
            )
          );
          total += got.books.length;
        }
        if (got.terms && got.terms.length) {
          resPanel.append(
            section("Related terms", got.terms.length, [termChips(got.terms)])
          );
          total += got.terms.length;
        }
        if (!total) {
          resPanel.append(
            el(
              "div",
              { class: "dim", style: "padding:8px" },
              "No results came back. Your browser may be offline, or all the sources are blocked. Try the engine buttons below — they open the search in a new tab."
            )
          );
          stateLine.textContent = "No results.";
        } else {
          stateLine.textContent =
            total +
            " result(s) from " +
            Object.keys(got).filter(function (k) {
              return got[k] && (Array.isArray(got[k]) ? got[k].length : 1);
            }).length +
            " source(s). Click any card to open it in a new tab.";
        }
        lastTopic = q;
        lastResearchText = total ? summarizeInline(got, q) : "";
        if (clipyBtn) clipyBtn.disabled = !clipyHasContent();
      });
    }
    onEnter(tIn, runInlineSearch);
    var inlineBtn = el(
      "button",
      { class: "btn sm", style: "font-weight:bold", onclick: runInlineSearch },
      "\uD83D\uDD0E Search inside window"
    );
    var engRow = el(
      "div",
      { class: "row", style: "gap:4px;flex-wrap:wrap" },
      ENGINES.map(function (en, i) {
        return el(
          "button",
          {
            class: "btn sm",
            onclick: function () {
              var q = topic();
              if (!q) {
                tIn.focus();
                stateLine.textContent = "Type a topic first.";
                return;
              }
              openUrl(engUrl(i, q));
            },
          },
          en[0]
        );
      })
    );
    function cbtn(label, fn) {
      var b = el("button", { class: "btn sm", onclick: fn }, label);
      claudeBtns.push(b);
      return b;
    }
    function ask(prompt, asJson, onDone, heading) {
      ctl = new AbortController();
      setBusy(true);
      results.textContent = "";
      lastText = "";
      stateLine.textContent = "Thinking…";
      out.classList.remove("rich");
      out.textContent = "";
      var opts = {
        signal: ctl.signal,
        onText: function (u) {
          stateLine.textContent = "Writing…";
          if (!asJson) {
            lastText = u.text;
            renderOut();
          }
        },
      };
      var p;
      var bk = backend();
      try {
        p = !bk
          ? Promise.reject({ code: "no_backend" })
          : asJson
          ? bk.json(prompt, opts)
          : bk.text(prompt, opts);
      } catch (err) {
        p = Promise.reject({ code: "upstream_error" });
      }
      var capturedTopic = topic();
      return p
        .then(
          function (r) {
            stateLine.textContent =
              !asJson && r && r.truncated ? "The answer was cut short." : "";
            if (asJson) {
              out.classList.remove("rich");
              out.textContent = heading || "";
            }
            if (!asJson && r && r.text) {
              lastTopic = capturedTopic || lastTopic;
              lastResearchText = r.text;
              if (clipyBtn) clipyBtn.disabled = !clipyHasContent();
            }
            if (onDone) onDone(r);
          },
          function (e) {
            stateLine.textContent = copyFor(e);
            if (!asJson && e && e.text) {
              lastText = e.text;
              renderOut();
            }
            if (asJson) {
              out.classList.remove("rich");
              out.textContent = "";
            }
          }
        )
        .then(function () {
          setBusy(false);
          ctl = null;
        });
    }
    var PLAIN =
      "Write in plain text only: no markdown symbols (no #, *, _ or backticks). Use short paragraphs and simple numbered lists. ";
    function need() {
      var t = topic();
      if (!t) {
        tIn.focus();
        stateLine.textContent = "Type a topic or pick a note first.";
        return null;
      }
      return t;
    }
    function ctx() {
      var b = noteBody();
      return b
        ? '\n\nMy class notes (use them as context):\n"""\n' + b + '\n"""'
        : "";
    }
    function doExplain() {
      var t = need();
      if (!t) return;
      ask(
        PLAIN +
          'Explain "' +
          t +
          '" to a college student. Start with a two-sentence plain-English summary, then the key ideas, then one worked example, then three common mistakes.' +
          ctx(),
        false
      );
    }
    function doQuiz() {
      var t = need();
      if (!t) return;
      ask(
        PLAIN +
          'Write 6 practice questions about "' +
          t +
          '", mixing recall and application. After the questions, add a line of dashes and the word ANSWERS, then give each answer with a one-line explanation.' +
          ctx(),
        false
      );
    }
    function doSummary() {
      var b = noteBody();
      if (!b) {
        stateLine.textContent = "Pick a note to summarize first.";
        return;
      }
      ask(
        PLAIN +
          'Summarize my class notes about "' +
          (topic() || "this topic") +
          '": one short paragraph, then the six most important points, then three questions I should be able to answer after studying.\n\n"""\n' +
          b +
          '\n"""',
        false
      );
    }
    function doOutline() {
      var t = need();
      if (!t) return;
      ask(
        PLAIN +
          'Create a clear outline for an essay on "' +
          t +
          '": a working thesis idea, three or four main sections each with supporting points to look for, and a conclusion.' +
          ctx(),
        false
      );
    }
    function doCheck() {
      var b = noteBody();
      if (!b) {
        stateLine.textContent = "Pick a note with your writing first.";
        return;
      }
      ask(
        PLAIN +
          "Review my writing for clarity, grammar and structure. Give: 1) three strengths, 2) the five most important fixes, each with a short example quoted from my text, 3) one suggestion to strengthen the argument. Do not rewrite the whole piece.\n\nMY WRITING:\n---\n" +
          b +
          "\n---",
        false
      );
    }
    function doIdeas() {
      var t = need();
      if (!t) return;
      ask(
        'I am studying "' +
          t +
          '".' +
          ctx() +
          '\n\nI will do the searching myself and you cannot browse. Reply with only a JSON array of 6 objects like {"query":"mitosis stages explained","why":"Clear visual overview","where":"youtube"}. "where" must be one of google, wikipedia, youtube, scholar, khan, ocw, quizlet, wolfram. "why" is under 14 words. Mix beginner explainers, worked problems and deeper sources. Do not include URLs.',
        true,
        function (arr) {
          showIdeas(arr);
        },
        "Search ideas for \u201c" + t + "\u201d:"
      );
    }
    function showIdeas(arr) {
      var rows = (Array.isArray(arr) ? arr : [])
        .filter(function (x) {
          return isObj(x) && isStr(x.query) && x.query.trim();
        })
        .slice(0, 8);
      if (!rows.length) {
        out.textContent = "No usable ideas came back. Try again.";
        return;
      }
      rows.forEach(function (x) {
        var key = String(x.where).toLowerCase(),
          wi = Object.prototype.hasOwnProperty.call(WHERE, key)
            ? WHERE[key]
            : 0;
        results.append(
          el(
            "div",
            { class: "lrow" },
            el(
              "span",
              { class: "t" },
              el("b", null, clip(x.query, 120)),
              el("br"),
              el(
                "span",
                { style: "color:#606060" },
                isStr(x.why) ? clip(x.why, 140) : ""
              )
            ),
            el(
              "button",
              {
                class: "btn xs",
                style: "padding:2px 6px",
                onclick: function () {
                  openUrl(engUrl(wi, x.query));
                },
              },
              ENGINES[wi][0]
            ),
            wi !== 0
              ? el(
                  "button",
                  {
                    class: "btn xs",
                    style: "padding:2px 6px",
                    onclick: function () {
                      openUrl(engUrl(0, x.query));
                    },
                  },
                  "Google"
                )
              : null
          )
        );
      });
    }
    function doCards() {
      var t = need();
      if (!t) return;
      ask(
        'Make 10 flash cards about "' +
          t +
          '" for a college student.' +
          ctx() +
          '\n\nReply with only a JSON array of objects like {"q":"What does ATP stand for?","a":"Adenosine triphosphate"}. Keep each q under 140 characters and each a under 220 characters. Plain text only.',
        true,
        function (arr) {
          showCards(arr, t);
        },
        "Review these cards, untick any you don't want, then add them to a deck."
      );
    }
    function showCards(arr, t) {
      var rows = (Array.isArray(arr) ? arr : [])
        .filter(function (x) {
          return (
            isObj(x) && isStr(x.q) && isStr(x.a) && x.q.trim() && x.a.trim()
          );
        })
        .slice(0, 20);
      if (!rows.length) {
        out.textContent = "No usable cards came back. Try again.";
        return;
      }
      var checks = rows.map(function (x) {
        var c = el("input", { type: "checkbox", checked: true });
        results.append(
          el(
            "label",
            { class: "lrow", style: "align-items:flex-start" },
            c,
            el(
              "span",
              { class: "t" },
              el("b", null, clip(x.q, 300)),
              el("br"),
              clip(x.a, 500)
            )
          )
        );
        return c;
      });
      var deck = el("input", {
        class: "in",
        value: clip(t, 30),
        style: "width:170px",
      });
      var addBtn = el(
        "button",
        {
          class: "btn sm",
          onclick: function () {
            var n = 0;
            rows.forEach(function (x, i) {
              if (checks[i].checked) {
                S.cards.push({
                  id: uid(),
                  deck: clip(deck.value.trim() || "General", 40),
                  q: clip(x.q.trim(), 1000),
                  a: clip(x.a.trim(), 2000),
                  box: 0,
                  dueAt: Date.now(),
                  interval: 0,
                  ease: 2.5,
                  reps: 0,
                  lapses: 0,
                });
                n++;
              }
            });
            save();
            refreshAll();
            addBtn.disabled = true;
            stateLine.textContent =
              n + " card(s) added to the deck \u201c" + deck.value + "\u201d.";
          },
        },
        "Add to Flash Cards"
      );
      results.append(
        el(
          "div",
          { class: "row", style: "gap:6px;align-items:center;padding-top:6px" },
          el("span", null, "Deck:"),
          deck,
          addBtn
        )
      );
    }
    var richMode = false;
    var richBtn = el(
      "button",
      {
        class: "btn sm",
        title: "Render the assistant's answer as formatted text",
        onclick: function () {
          richMode = !richMode;
          this.classList.toggle("on", richMode);
          renderOut();
        },
      },
      "Format answer"
    );
    function renderOut() {
      if (richMode && lastText) {
        out.classList.add("rich");
        out.innerHTML = mdToHtml(lastText);
      } else {
        out.classList.remove("rich");
        out.textContent = lastText;
      }
    }
    var saveBtn = el(
      "button",
      {
        class: "btn sm",
        onclick: function () {
          if (!lastText.trim()) {
            stateLine.textContent = "Nothing to save yet.";
            return;
          }
          S.notes.push({
            id: uid(),
            text: (topic() || "Research") + "\n\n" + lastText,
            updated: Date.now(),
          });
          save();
          refreshAll();
          stateLine.textContent = "Saved to Notepad.";
        },
      },
      "Save answer to Notepad"
    );
    var clipyBtn = el(
      "button",
      {
        class: "btn sm",
        disabled: true,
        title: "Run a search or ask the assistant first",
        style: "display:flex;align-items:center;gap:5px",
        onclick: function () {
          if (!clipyHasContent()) {
            stateLine.textContent =
              "Run a search or ask the assistant first, then continue with Clipy.";
            return;
          }
          continueWithClipy(lastTopic || topic(), lastResearchText);
        },
      },
      pix("clippy", 14),
      "Continue with Clipy"
    );
    var claudeBox = el(
      "fieldset",
      { class: "ai-box" },
      el("legend", null, "Assistant")
    );
    var cbody = el("div", { style: "padding:0" });
    claudeBox.append(cbody);
    function mode() {
      var m = S.prefs.ai;
      if (m === "off") return "off";
      if (PROVIDERS[m]) return m;
      if (capSample) return "helpy";
      if (getKey("openrouter")) return "lolbit";
      if (getKey("openai")) return "handunit";
      if (getKey("deepseek")) return "carnie";
      if (getKey("gemini")) return "mystic";
      if (S.prefs.localUrl || aiModel("ollama")) return "ollama";
      return "off";
    }
    function backend() {
      var m = mode();
      if (m === "off") return null;
      return {
        text: function (p, o) {
          return aiChat(m, p, o);
        },
        json: function (p, o) {
          return aiChat(m, p, Object.assign({}, o, { json: true }));
        },
      };
    }
    function renderAssistant() {
      cbody.textContent = "";
      claudeBtns = [];
      var m = mode();
      var info = el("div", { style: "padding:4px 0 0" });
      if (m === "off") {
        info.append(
          el(
            "div",
            { class: "dim", style: "padding:0" },
            "The assistant is off. Pick one in Control Panel → Assistant. Inline search above still works without any key."
          )
        );
        cbody.append(info);
        return;
      }
      var p = PROVIDERS[m];
      cbody.append(
        el(
          "div",
          { class: "row", style: "gap:8px;align-items:center;margin-top:4px" },
          pix(p.icon, 24),
          el("b", null, p.name),
          el("span", { class: "dim", style: "padding:0" }, p.blurb)
        )
      );
      var isClaudeApi = m === "helpy" && S.prefs.claudeMode === "api";
      var hasKey = m === "ollama" ? true : !!getKey(p.kind);
      if (m === "helpy" && !isClaudeApi && !capSample) {
        cbody.append(
          el(
            "div",
            { class: "dim", style: "padding:6px 0 0" },
            "Helpy is Claude, and this page isn't running inside Claude right now. Switch Helpy to API mode in Control Panel, or pick another assistant."
          )
        );
        return;
      }
      if ((isClaudeApi || m !== "helpy") && !hasKey) {
        cbody.append(
          el(
            "div",
            { class: "dim", style: "padding:6px 0 0" },
            "No API key saved for " +
              p.name +
              " yet. Add one in Control Panel → Assistant."
          )
        );
        return;
      }
      cbody.append(
        el(
          "div",
          { class: "dim", style: "padding:6px 0 0" },
          "Keys, models and the Claude mode toggle all live in Control Panel → Assistant."
        )
      );
      cbody.append(
        el(
          "div",
          { class: "row", style: "margin-top:8px" },
          cbtn("Explain it", doExplain),
          cbtn("Quiz me", doQuiz),
          cbtn("Summarize note", doSummary),
          cbtn("Search ideas", doIdeas),
          cbtn("Make flash cards", doCards),
          cbtn("Essay outline", doOutline),
          cbtn("Check my writing", doCheck)
        )
      );
    }
    cbody.append(
      el("div", { class: "dim", style: "padding:0" }, "Checking for Helpy…")
    );
    getCap("sample").then(function (sm) {
      capSample = typeof sm === "function" ? sm : null;
      renderAssistant();
    });
    w.abort = function () {
      if (ctl) ctl.abort();
    };
    w.body.append(
      el(
        "div",
        {
          class: "col",
          style: "flex:1;min-height:0;padding:6px;gap:6px;overflow:auto",
        },
        el(
          "div",
          { class: "row", style: "gap:4px;flex-wrap:wrap;align-items:center" },
          tIn,
          inlineBtn,
          el("span", null, "Note:"),
          noteSel
        ),
        el(
          "div",
          {
            class: "row",
            style: "gap:4px;flex-wrap:wrap;align-items:center;font-size:11px",
          },
          el("span", { style: "color:#606060" }, "Sources:"),
          srcRow
        ),
        resPanel,
        stateLine,
        el(
          "fieldset",
          null,
          el("legend", null, "Open a full search in a new tab"),
          engRow
        ),
        claudeBox,
        out,
        results,
        el(
          "div",
          { class: "row", style: "gap:4px;flex-wrap:wrap" },
          saveBtn,
          clipyBtn,
          richBtn,
          stopBtn
        )
      )
    );
    clipyBtn.disabled = !clipyHasContent();
    w.refresh = fillNotes;
    fillNotes();
    setTimeout(function () {
      tIn.focus();
    }, 0);
  }

  /* ================= APP: RECYCLE BIN ================= */
  function appBin(w) {
    var head = el("div", { class: "row form" });
    var list = el("div", { class: "sunk list" });
    w.body.append(head, list);
    function draw() {
      head.textContent = "";
      head.append(
        el("span", null, S.trash.length + " item(s)"),
        el("span", { style: "flex:1" }),
        el(
          "button",
          {
            class: "btn sm",
            onclick: function () {
              if (!S.trash.length) return;
              var n = S.trash.length;
              S.trash
                .slice()
                .reverse()
                .forEach(function (t) {
                  restoreTrash(t.id);
                });
              msgBox({
                title: "Recycle Bin",
                icon: "info",
                text: "Restored " + n + " item(s).",
              });
            },
          },
          "Restore All"
        ),
        el(
          "button",
          {
            class: "btn sm",
            onclick: function () {
              if (!S.trash.length) return;
              msgBox({
                title: "Recycle Bin",
                icon: "q",
                text: "Permanently erase everything in the Recycle Bin?\nThis cannot be undone.",
                buttons: [
                  {
                    label: "Erase",
                    fn: function () {
                      S.trash = [];
                      save();
                      refreshAll();
                    },
                  },
                  { label: "Cancel" },
                ],
              });
            },
          },
          "Empty Bin"
        )
      );
      list.textContent = "";
      if (!S.trash.length) {
        list.append(
          el(
            "div",
            { class: "dim" },
            "The Recycle Bin is empty.\n\nWhen you delete notes, tasks, events, flash cards, assignments, classes, habits, countdowns, favorites, citations or sticky notes they land here so you can bring them back."
          )
        );
        w.status("Empty");
        return;
      }
      S.trash.forEach(function (t) {
        var d = new Date(t.at);
        list.append(
          el(
            "div",
            { class: "lrow" },
            el("span", { class: "tag" }, TRASH_LABELS[t.kind] || t.kind),
            el(
              "span",
              { class: "t" },
              el("b", null, t.label || "(untitled)"),
              el("br"),
              el(
                "span",
                { class: "dim", style: "padding:0;font-size:11px" },
                "deleted " +
                  (d.getMonth() + 1) +
                  "/" +
                  d.getDate() +
                  " " +
                  fmt12(d)
              )
            ),
            el(
              "button",
              {
                class: "btn sm",
                onclick: function () {
                  restoreTrash(t.id);
                },
              },
              "Restore"
            ),
            el(
              "button",
              {
                class: "btn xs",
                "aria-label": "Delete permanently",
                onclick: function () {
                  purgeTrash(t.id);
                },
              },
              "X"
            )
          )
        );
      });
      w.status(S.trash.length + " item(s) in the bin");
    }
    w.refresh = draw;
    draw();
  }

  /* ================= APP: FOLDERS ================= */
  var FOLDER_COLORS = [
    "#e8a34a",
    "#5a9b5a",
    "#4a7cc9",
    "#b05a9b",
    "#a05050",
    "#5a8ba0",
    "#8a6a3a",
    "#607060",
  ];
  function folderById(id) {
    return S.folders.filter(function (f) {
      return f.id === id;
    })[0];
  }
  function foldersOfAssign(id) {
    return S.folders.filter(function (f) {
      return f.assign.indexOf(id) >= 0;
    });
  }
  function removeItemFromFolder(fid, kind, refId) {
    var f = folderById(fid);
    if (!f) return;
    f[kind] = f[kind].filter(function (x) {
      return x !== refId;
    });
    save();
    refreshAll();
  }
  function addItemToFolder(fid, kind, refId) {
    var f = folderById(fid);
    if (!f) return;
    if (f[kind].indexOf(refId) < 0) f[kind].push(refId);
    save();
    refreshAll();
  }

  function openAssignmentViewer(id) {
    var a = S.assign.filter(function (x) {
      return x.id === id;
    })[0];
    if (!a) {
      msgBox({
        title: "Assignment",
        icon: "warn",
        text: "That assignment is no longer around.",
      });
      return;
    }
    var winId = "assign-" + id;
    if (wins[winId]) {
      focusWin(wins[winId]);
      return;
    }
    var app = {
      id: winId,
      title: a.title || "Assignment",
      icon: "book",
      w: 480,
      h: 560,
      build: function (w) {
        buildAssignmentViewer(w, id);
      },
    };
    var w = makeWin(app);
    wins[winId] = w;
    try {
      app.build(w);
    } catch (err) {
      closeWin(w);
      msgBox({
        title: "Assignment",
        icon: "err",
        text:
          "Couldn't open that assignment.\n" +
          (err && err.message ? err.message : "unknown error"),
      });
      return;
    }
    focusWin(w);
  }

  function buildAssignmentViewer(w, id) {
    var a = S.assign.filter(function (x) {
      return x.id === id;
    })[0];
    if (!a) {
      w.body.append(el("div", { class: "dim" }, "This assignment is gone."));
      return;
    }
    var top = el("div", { class: "col", style: "padding:8px;gap:6px" });
    var titleEl = el(
      "div",
      {
        style:
          "font:bold 16px/1.25 'Times New Roman',Georgia,serif;overflow-wrap:anywhere",
      },
      a.title || "(untitled)"
    );
    var courseRow = el("div", {
      class: "row",
      style: "gap:6px;flex-wrap:wrap;align-items:center",
    });
    var toggleBtn = el(
      "button",
      {
        class: "btn sm",
        onclick: function () {
          a.done = !a.done;
          save();
          refreshAll();
          paintMeta();
          toggleBtn.textContent = a.done ? "Mark as open" : "Mark as done";
        },
      },
      a.done ? "Mark as open" : "Mark as done"
    );
    function paintMeta() {
      courseRow.textContent = "";
      if (a.course) courseRow.append(el("span", { class: "tag" }, a.course));
      courseRow.append(
        el(
          "span",
          { class: "dim", style: "padding:0" },
          (a.done ? "\u2714 Done" : "\u25CB Open") +
            "  \u00b7  Due " +
            whenStr(a.due, a.allDay)
        )
      );
      var now = Date.now();
      if (!a.done && a.due < now)
        courseRow.append(
          el(
            "span",
            { class: "tag", style: "background:#c00000" },
            "Overdue " + rel(a.due)
          )
        );
      else if (!a.done && a.due - now < 172800000)
        courseRow.append(
          el("span", { class: "tag", style: "background:#a05000" }, rel(a.due))
        );
      courseRow.append(
        el(
          "span",
          { class: "dim", style: "padding:0;font-size:11px" },
          a.src === "canvas" ? "Imported" : "Manual"
        )
      );
    }
    paintMeta();
    var srcBtn = a.url
      ? el(
          "button",
          {
            class: "btn sm",
            onclick: function () {
              openUrl(a.url);
            },
          },
          "Open source"
        )
      : null;
    var folderBtn = el(
      "button",
      {
        class: "btn sm",
        onclick: function () {
          openFolderPicker("assign", a.id, paintFolders);
        },
      },
      "Add to folder\u2026"
    );
    top.append(
      titleEl,
      courseRow,
      el(
        "div",
        { class: "row", style: "gap:6px;flex-wrap:wrap;margin-top:4px" },
        toggleBtn,
        srcBtn,
        folderBtn
      )
    );

    var folderRow = el("div", {
      class: "row",
      style: "gap:4px;flex-wrap:wrap;padding:6px 8px 0",
    });
    function paintFolders() {
      folderRow.textContent = "";
      var mine = foldersOfAssign(a.id);
      if (!mine.length) {
        folderRow.append(
          el(
            "span",
            { class: "dim", style: "padding:0;font-size:11px" },
            "Not in any folder yet."
          )
        );
        return;
      }
      folderRow.append(
        el("span", { style: "font-size:11px;color:#606060" }, "In:")
      );
      mine.forEach(function (f) {
        folderRow.append(
          el(
            "span",
            {
              class: "tag",
              style:
                "background:" +
                FOLDER_COLORS[f.color % FOLDER_COLORS.length] +
                ";color:#000;cursor:default",
              title: "Click to remove from this folder",
              onclick: function () {
                removeItemFromFolder(f.id, "assign", a.id);
                paintFolders();
              },
            },
            f.name + " \u00d7"
          )
        );
      });
    }
    paintFolders();

    var noteHead = el(
      "div",
      { style: "font-weight:bold;padding:10px 8px 2px" },
      "My notes on this assignment"
    );
    var noteArea = el("textarea", {
      class: "in",
      spellcheck: "false",
      placeholder:
        "Brain dump, outline, submission checklist\u2026 (saves automatically)",
      style:
        'flex:1;min-height:120px;width:100%;resize:vertical;font:13px/1.5 "Courier New",monospace;padding:6px',
    });
    noteArea.value = S.assignNotes[a.id] || "";
    var saveT = null;
    var savedLabel = el(
      "span",
      { class: "np-save", style: "padding:0 6px" },
      ""
    );
    noteArea.addEventListener("input", function () {
      S.assignNotes[a.id] = clip(noteArea.value, 5000);
      clearTimeout(saveT);
      savedLabel.textContent = "Saving\u2026";
      savedLabel.className = "np-save";
      saveT = setTimeout(function () {
        save();
        savedLabel.textContent = "\u2714 Saved";
        savedLabel.className = "np-save ok";
      }, 250);
    });

    w.body.append(
      el(
        "div",
        { class: "col", style: "flex:1;min-height:0" },
        top,
        folderRow,
        noteHead,
        el(
          "div",
          {
            class: "col",
            style: "flex:1;min-height:0;padding:0 8px 8px;gap:4px",
          },
          noteArea,
          savedLabel
        )
      )
    );

    w.menus([
      {
        label: "File",
        items: function () {
          return [
            {
              label: a.done ? "Mark as open" : "Mark as done",
              fn: function () {
                a.done = !a.done;
                save();
                refreshAll();
                paintMeta();
                toggleBtn.textContent = a.done
                  ? "Mark as open"
                  : "Mark as done";
              },
            },
            {
              label: "Add to folder\u2026",
              fn: function () {
                openFolderPicker("assign", a.id, paintFolders);
              },
            },
            { sep: 1 },
            {
              label: "Close",
              fn: function () {
                closeWin(w);
              },
            },
          ];
        },
      },
    ]);
  }

  function openNoteViewer(id) {
    openApp("notepad");
    if (wins.notepad && wins.notepad.select) wins.notepad.select(id);
  }

  function openFolderPicker(kind, refId, doneCb) {
    var list = el("div", {
      class: "col",
      style:
        "gap:2px;max-height:240px;overflow:auto;padding:6px;background:#fff",
    });
    var checks = [];
    S.folders.forEach(function (f) {
      var inHere = f[kind].indexOf(refId) >= 0;
      var cb = el("input", { type: "checkbox", checked: inHere });
      checks.push({ f: f, cb: cb });
      list.append(
        el(
          "label",
          {
            style:
              "display:flex;align-items:center;gap:8px;padding:4px 6px;cursor:default",
          },
          cb,
          el("span", {
            style:
              "width:12px;height:12px;border:1px solid #808080;background:" +
              FOLDER_COLORS[f.color % FOLDER_COLORS.length],
          }),
          el("span", null, f.name)
        )
      );
    });
    if (!S.folders.length)
      list.append(
        el(
          "div",
          { class: "dim" },
          "You don't have any folders yet.\nType a name below to create your first one."
        )
      );
    var newName = el("input", {
      class: "in",
      placeholder: "Create a new folder\u2026",
      style: "width:100%;margin-top:6px",
    });
    msgBox({
      title: "Add to Folder",
      icon: "folder",
      width: 400,
      text: "Tick the folders this should appear in:",
      extra: el("div", null, list, newName),
      buttons: [
        {
          label: "Save",
          fn: function () {
            var nn = newName.value.trim();
            if (nn) {
              var nf = {
                id: uid(),
                name: clip(nn, 60),
                color: S.folders.length % FOLDER_COLORS.length,
                assign: [],
                note: [],
                created: Date.now(),
              };
              nf[kind].push(refId);
              S.folders.push(nf);
            }
            checks.forEach(function (x) {
              var isIn = x.f[kind].indexOf(refId) >= 0;
              if (x.cb.checked && !isIn) x.f[kind].push(refId);
              else if (!x.cb.checked && isIn)
                x.f[kind] = x.f[kind].filter(function (z) {
                  return z !== refId;
                });
            });
            save();
            refreshAll();
            if (doneCb) doneCb();
          },
        },
        { label: "Cancel" },
      ],
    });
  }

  function appFolders(w) {
    var curId = S.folders.length ? S.folders[0].id : null;
    var query = "";
    var classFilter = "";
    var listLeft = el("div", {
      class: "sunk fl-list",
      style: "flex:1;min-height:0;overflow:auto;margin:0",
    });
    var rightBox = el("div", {
      class: "col",
      style: "flex:1;min-width:0;gap:0",
    });
    var header = el("div", { class: "row fl-header" });
    var toolbar = el("div", { class: "fl-toolbar" });
    var items = el("div", {
      class: "sunk",
      style: "flex:1;min-height:0;overflow:auto;margin:0;padding:0",
    });

    function newFolder() {
      askText("New Folder", "Folder name:", "", function (v) {
        var f = {
          id: uid(),
          name: clip(v, 60),
          color: S.folders.length % FOLDER_COLORS.length,
          assign: [],
          note: [],
          created: Date.now(),
        };
        S.folders.push(f);
        curId = f.id;
        query = "";
        classFilter = "";
        save();
        refreshAll();
        draw();
      });
    }
    function renameFolder() {
      var f = folderById(curId);
      if (!f) return;
      askText("Rename Folder", "Folder name:", f.name, function (v) {
        f.name = clip(v, 60);
        save();
        refreshAll();
        draw();
      });
    }
    function colorFolder() {
      var f = folderById(curId);
      if (!f) return;
      f.color = (f.color + 1) % FOLDER_COLORS.length;
      save();
      refreshAll();
      draw();
    }
    function deleteFolder() {
      var f = folderById(curId);
      if (!f) return;
      msgBox({
        title: "Delete Folder",
        icon: "q",
        text:
          "Delete the folder \u201c" +
          f.name +
          "\u201d?\n\nThe items inside it are not deleted \u2014 they just leave the folder.",
        buttons: [
          {
            label: "Delete",
            fn: function () {
              S.folders = S.folders.filter(function (x) {
                return x.id !== f.id;
              });
              curId = S.folders.length ? S.folders[0].id : null;
              query = "";
              classFilter = "";
              save();
              refreshAll();
              draw();
            },
          },
          { label: "Cancel" },
        ],
      });
    }

    var newBtn = el(
      "button",
      { class: "btn sm", onclick: newFolder },
      "+ New Folder"
    );

    function paintLeft() {
      listLeft.textContent = "";
      if (!S.folders.length) {
        listLeft.append(
          el(
            "div",
            { class: "dim", style: "padding:14px 12px;text-align:center" },
            "No folders yet.\n\nClick \u201c+ New Folder\u201d to create one."
          )
        );
        return;
      }
      S.folders.forEach(function (f) {
        var count = (f.assign || []).length + (f.note || []).length;
        listLeft.append(
          el(
            "div",
            {
              class: "fl-fl" + (f.id === curId ? " sel" : ""),
              onclick: function () {
                curId = f.id;
                query = "";
                classFilter = "";
                draw();
              },
            },
            el("span", {
              class: "fl-dot",
              style:
                "background:" + FOLDER_COLORS[f.color % FOLDER_COLORS.length],
            }),
            el("span", { class: "fl-nm" }, f.name),
            el("span", { class: "fl-ct" }, String(count))
          )
        );
      });
    }

    function addItemsPicker() {
      var f = folderById(curId);
      if (!f) return;
      var tabs = "assign";
      var tabRow = el("div", { class: "row", style: "gap:4px" });
      var listBox = el("div", {
        class: "sunk",
        style: "max-height:280px;overflow:auto;padding:4px;background:#fff",
      });
      function paint() {
        tabRow.textContent = "";
        [
          ["assign", "Assignments"],
          ["note", "Notes"],
        ].forEach(function (t) {
          tabRow.append(
            el(
              "button",
              {
                class: "btn sm" + (tabs === t[0] ? " on" : ""),
                onclick: function () {
                  tabs = t[0];
                  paint();
                },
              },
              t[1]
            )
          );
        });
        listBox.textContent = "";
        var source = tabs === "assign" ? S.assign : S.notes;
        if (!source.length) {
          listBox.append(el("div", { class: "dim" }, "Nothing here yet."));
          return;
        }
        source.slice(0, 300).forEach(function (x) {
          var id = x.id;
          var isIn = f[tabs].indexOf(id) >= 0;
          var label =
            tabs === "assign"
              ? (x.course ? "[" + x.course + "] " : "") +
                (x.title || "(untitled)") +
                " \u2014 " +
                whenStr(x.due, x.allDay)
              : (x.text || "")
                  .split("\n")[0]
                  .trim()
                  .replace(/^#+\s*/, "") || "(untitled)";
          var cb = el("input", {
            type: "checkbox",
            checked: isIn,
            onchange: function () {
              if (this.checked) addItemToFolder(f.id, tabs, id);
              else removeItemFromFolder(f.id, tabs, id);
            },
          });
          listBox.append(
            el(
              "label",
              {
                style:
                  "display:flex;gap:8px;align-items:flex-start;padding:5px 6px;cursor:default;border-bottom:1px solid #eee",
              },
              cb,
              el(
                "span",
                { style: "flex:1;min-width:0;overflow-wrap:anywhere" },
                label
              )
            )
          );
        });
      }
      paint();
      msgBox({
        title: "Add to \u201c" + f.name + "\u201d",
        icon: "folder",
        width: 460,
        text: "Tick to add. Untick to remove.",
        extra: el("div", { class: "col", style: "gap:6px" }, tabRow, listBox),
        buttons: [
          {
            label: "Done",
            fn: function () {
              draw();
            },
          },
        ],
      });
    }

    function matchesSearch(text) {
      if (!query) return true;
      return (
        String(text || "")
          .toLowerCase()
          .indexOf(query) >= 0
      );
    }

    function paintRight() {
      header.textContent = "";
      toolbar.textContent = "";
      items.textContent = "";

      var f = folderById(curId);
      if (!f) {
        header.append(
          el(
            "div",
            { style: "font-weight:bold;flex:1;padding:2px 0" },
            "No folder selected"
          ),
          newBtn
        );
        items.append(
          el(
            "div",
            { class: "dim", style: "padding:20px;text-align:center" },
            "Pick a folder on the left, or create a new one with \u201c+ New Folder\u201d."
          )
        );
        w.status(S.folders.length + " folder(s)");
        return;
      }

      var total = f.assign.length + f.note.length;

      header.append(
        el("span", {
          class: "fl-dot",
          style:
            "width:16px;height:16px;background:" +
            FOLDER_COLORS[f.color % FOLDER_COLORS.length],
        }),
        el("div", { class: "fl-title" }, f.name),
        el(
          "span",
          { class: "fl-hdr-count" },
          total + " item" + (total === 1 ? "" : "s")
        ),
        el("div", { style: "flex:1" }),
        el(
          "button",
          { class: "btn sm", onclick: addItemsPicker },
          "Add items\u2026"
        ),
        el(
          "button",
          {
            class: "btn sm",
            onclick: colorFolder,
            title: "Cycle folder colour",
          },
          "Colour"
        ),
        el("button", { class: "btn sm", onclick: renameFolder }, "Rename"),
        el("button", { class: "btn sm", onclick: deleteFolder }, "Delete")
      );

      var searchInp = el("input", {
        class: "in fl-search",
        placeholder: "Search this folder\u2026",
        value: query,
        oninput: function () {
          query = this.value.toLowerCase();
          paintItems();
        },
      });

      var classSel = el("select", {
        class: "in fl-class",
        title: "Filter assignments and notes by class",
        onchange: function () {
          classFilter = this.value;
          paintItems();
        },
      });

      var courses = {};
      S.assign.forEach(function (a) {
        if (a.course) courses[a.course] = 1;
      });
      var courseList = Object.keys(courses).sort();
      classSel.append(el("option", { value: "" }, "All classes"));
      courseList.forEach(function (c) {
        classSel.append(el("option", { value: c }, c));
      });
      classSel.value = courseList.indexOf(classFilter) >= 0 ? classFilter : "";
      classFilter = classSel.value;

      toolbar.append(
        el("span", { class: "fl-search-ic" }, pix("find", 14)),
        searchInp,
        el("span", { class: "fl-tb-label" }, "Class:"),
        classSel
      );

      paintItems();
    }

    function paintItems() {
      items.textContent = "";
      var f = folderById(curId);
      if (!f) return;

      var assigns = f.assign
        .map(function (aid) {
          return S.assign.filter(function (x) {
            return x.id === aid;
          })[0];
        })
        .filter(Boolean);

      var notes = f.note
        .map(function (nid) {
          return S.notes.filter(function (x) {
            return x.id === nid;
          })[0];
        })
        .filter(Boolean);

      assigns = assigns.filter(function (a) {
        return matchesSearch((a.title || "") + " " + (a.course || ""));
      });
      notes = notes.filter(function (n) {
        return matchesSearch(n.text || "");
      });

      if (classFilter) {
        assigns = assigns.filter(function (a) {
          return a.course === classFilter;
        });
        notes = notes.filter(function (n) {
          return (
            String(n.text || "")
              .toLowerCase()
              .indexOf(classFilter.toLowerCase()) >= 0
          );
        });
      }

      assigns.sort(function (a, b) {
        return a.due - b.due;
      });

      if (!assigns.length && !notes.length) {
        if (f.assign.length || f.note.length) {
          items.append(
            el(
              "div",
              {
                class: "dim",
                style: "padding:24px 16px;text-align:center;line-height:1.6",
              },
              "No items match your filters.",
              el("br"),
              "Try clearing the search or picking \u201cAll classes.\u201d"
            )
          );
        } else {
          items.append(
            el(
              "div",
              {
                class: "dim",
                style: "padding:24px 16px;text-align:center;line-height:1.6",
              },
              "This folder is empty.",
              el("br"),
              "Click \u201cAdd items\u2026\u201d to include assignments or notes."
            )
          );
        }
        updateStatus();
        return;
      }

      if (assigns.length) {
        items.append(
          el(
            "div",
            { class: "fl-sec" },
            el("span", null, "Assignments"),
            el("span", { class: "fl-sec-ct" }, String(assigns.length))
          )
        );
        assigns.forEach(function (a) {
          items.append(assignRow(a, f));
        });
      }

      if (notes.length) {
        items.append(
          el(
            "div",
            { class: "fl-sec" },
            el("span", null, "Notes"),
            el("span", { class: "fl-sec-ct" }, String(notes.length))
          )
        );
        notes.forEach(function (n) {
          items.append(noteRow(n, f));
        });
      }

      updateStatus();
    }

    function assignRow(a, f) {
      var over = !a.done && a.due < Date.now();
      var soon = !a.done && !over && a.due - Date.now() < 172800000;
      var sub = a.done
        ? "\u2714 Done \u00b7 " + whenStr(a.due, a.allDay)
        : over
        ? "Overdue \u00b7 was due " + whenStr(a.due, a.allDay)
        : "Due " + whenStr(a.due, a.allDay) + " \u00b7 " + rel(a.due);
      return el(
        "div",
        {
          class:
            "fl-row" +
            (a.done ? " done" : "") +
            (over ? " over" : "") +
            (soon ? " soon" : ""),
          onclick: function () {
            openAssignmentViewer(a.id);
          },
        },
        el("span", { class: "fl-ic" }, pix("book", 16)),
        el(
          "div",
          { class: "fl-body" },
          el(
            "div",
            { class: "fl-t" },
            (a.course ? "[" + a.course + "] " : "") + (a.title || "(untitled)")
          ),
          el("div", { class: "fl-sub" }, sub)
        ),
        el(
          "button",
          {
            class: "btn xs",
            "aria-label": "Remove from folder",
            onclick: function (e) {
              e.stopPropagation();
              removeItemFromFolder(f.id, "assign", a.id);
              paintItems();
              paintLeft();
            },
          },
          "\u00d7"
        )
      );
    }

    function noteRow(n, f) {
      var title =
        (n.text || "")
          .split("\n")[0]
          .trim()
          .replace(/^#+\s*/, "") || "(untitled)";
      var d = new Date(n.updated);
      return el(
        "div",
        {
          class: "fl-row",
          onclick: function () {
            openNoteViewer(n.id);
          },
        },
        el("span", { class: "fl-ic" }, pix("notepad", 16)),
        el(
          "div",
          { class: "fl-body" },
          el("div", { class: "fl-t" }, title),
          el(
            "div",
            { class: "fl-sub" },
            "Updated " + (d.getMonth() + 1) + "/" + d.getDate() + " " + fmt12(d)
          )
        ),
        el(
          "button",
          {
            class: "btn xs",
            "aria-label": "Remove from folder",
            onclick: function (e) {
              e.stopPropagation();
              removeItemFromFolder(f.id, "note", n.id);
              paintItems();
              paintLeft();
            },
          },
          "\u00d7"
        )
      );
    }

    function updateStatus() {
      var f = folderById(curId);
      if (!f) {
        w.status(S.folders.length + " folder(s)");
        return;
      }
      var parts = [f.name];
      if (classFilter) parts.push("Class: " + classFilter);
      if (query) parts.push("Search: \u201c" + query + "\u201d");
      parts.push(
        f.assign.length + " assignment(s)",
        f.note.length + " note(s)"
      );
      w.status(parts.join("  \u00b7  "));
    }

    w.body.append(
      el(
        "div",
        { class: "col", style: "flex:1;min-height:0;padding:8px" },
        el(
          "div",
          {
            class: "row",
            style: "gap:8px;align-items:center;margin-bottom:8px",
          },
          el("div", { style: "font-weight:bold;font-size:13px" }, "Folders"),
          el("div", { style: "flex:1" }),
          newBtn
        ),
        el(
          "div",
          { class: "row", style: "flex:1;min-height:0;gap:8px" },
          el(
            "div",
            { class: "col", style: "width:200px;flex:none;gap:6px" },
            listLeft
          ),
          rightBox
        )
      )
    );
    rightBox.append(header, toolbar, items);

    function draw() {
      if (!S.folders.length) curId = null;
      else if (!folderById(curId)) curId = S.folders[0].id;
      paintLeft();
      paintRight();
    }
    w.refresh = draw;
    draw();
  }

  /* ================= APP: MIGRATE ================= */
  function appMigrate(w) {
    var curCat = "notes";
    var selected = {};
    var q = "";
    var CATS = [
      { key: "notes", label: "Notes", icon: "notepad" },
      { key: "cards", label: "Flash Cards", icon: "cards" },
      { key: "assign", label: "Assignments", icon: "book" },
      { key: "events", label: "Calendar Events", icon: "calendar" },
      { key: "tasks", label: "Tasks", icon: "tasks" },
      { key: "reminders", label: "Reminders", icon: "alarm" },
      { key: "grades", label: "Courses", icon: "grades" },
      { key: "classes", label: "Classes", icon: "schedule" },
      { key: "habits", label: "Habits", icon: "habits" },
      { key: "countdowns", label: "Countdowns", icon: "countdown" },
      { key: "links", label: "Favorites", icon: "links" },
      { key: "bib", label: "Citations", icon: "book" },
      { key: "folders", label: "Folders", icon: "folder" },
      { key: "stickies", label: "Sticky Notes", icon: "sticky" },
    ];
    var catsBox = el("div", { class: "mig-cats" });
    var itemsBox = el("div", { class: "sunk mig-items" });
    var headInfo = el("div", { class: "mig-head" });
    var statusLine = el("div", { class: "mig-status" });

    function itemLabel(cat, item) {
      if (!item) return "(missing)";
      if (cat === "notes") {
        var first = (item.text || "")
          .split("\n")[0]
          .replace(/^#+\s*/, "")
          .trim();
        return first || "(untitled)";
      }
      if (cat === "cards")
        return (item.q || "") + "  \u2192  " + (item.a || "");
      if (cat === "assign")
        return (
          (item.course ? "[" + item.course + "] " : "") +
          (item.title || "(untitled)")
        );
      if (cat === "events")
        return (
          (item.title || "(untitled)") +
          " \u00b7 " +
          (item.date || "") +
          (item.time ? " " + item.time : "")
        );
      if (cat === "tasks") return item.text || "(no text)";
      if (cat === "reminders")
        return (item.text || "") + " \u00b7 " + whenStr(item.at);
      if (cat === "grades") return item.name || "(unnamed course)";
      if (cat === "classes")
        return (
          (item.name || "") +
          " \u00b7 " +
          (item.days || [])
            .map(function (d) {
              return DAYS[d];
            })
            .join(" ") +
          " " +
          (item.start || "")
        );
      if (cat === "habits") return item.name || "(unnamed habit)";
      if (cat === "countdowns")
        return (item.name || "") + " \u00b7 " + (item.date || "");
      if (cat === "links")
        return (item.name || "") + " \u00b7 " + (item.url || "");
      if (cat === "bib") return citePlain(item.text || "").slice(0, 90);
      if (cat === "folders")
        return (
          (item.name || "") +
          "  (" +
          ((item.assign || []).length + (item.note || []).length) +
          " item" +
          ((item.assign || []).length + (item.note || []).length === 1
            ? ""
            : "s") +
          ")"
        );
      if (cat === "stickies")
        return (
          (item.text || "(empty)").split("\n")[0].slice(0, 70) || "(empty)"
        );
      return "(item)";
    }
    function countSel(cat) {
      var n = 0;
      Object.keys(selected).forEach(function (k) {
        if (k.indexOf(cat + "::") === 0) n++;
      });
      return n;
    }
    function paintCats() {
      catsBox.textContent = "";
      CATS.forEach(function (c) {
        var count = (S[c.key] || []).length;
        var selN = countSel(c.key);
        var row = el(
          "div",
          {
            class:
              "mig-cat" +
              (c.key === curCat ? " sel" : "") +
              (count === 0 ? " empty" : ""),
            onclick: function () {
              curCat = c.key;
              q = "";
              paint();
            },
          },
          pix(c.icon, 16),
          el("span", { class: "mig-cat-nm" }, c.label),
          selN > 0
            ? el("span", { class: "mig-cat-sel" }, selN + " \u2713")
            : null,
          el("span", { class: "mig-cat-ct" }, String(count))
        );
        catsBox.append(row);
      });
    }
    function paintItems() {
      itemsBox.textContent = "";
      var arr = S[curCat] || [];
      var needle = q.trim().toLowerCase();
      var rows = arr.filter(function (x) {
        if (!needle) return true;
        return itemLabel(curCat, x).toLowerCase().indexOf(needle) >= 0;
      });
      if (!rows.length) {
        itemsBox.append(
          el(
            "div",
            {
              class: "dim",
              style: "padding:20px;text-align:center;line-height:1.5",
            },
            arr.length
              ? "Nothing matches your search."
              : "No items in this category yet."
          )
        );
        return;
      }
      rows.forEach(function (item) {
        var key = curCat + "::" + item.id;
        var cb = el("input", {
          type: "checkbox",
          checked: !!selected[key],
          onchange: function () {
            if (this.checked) selected[key] = 1;
            else delete selected[key];
            paintStatus();
            paintCats();
          },
        });
        var row = el(
          "label",
          { class: "mig-item" + (selected[key] ? " sel" : "") },
          cb,
          el("span", { class: "mig-item-lbl" }, itemLabel(curCat, item))
        );
        row.addEventListener("click", function (e) {
          if (e.target.tagName === "INPUT") return;
          e.preventDefault();
          cb.checked = !cb.checked;
          if (cb.checked) selected[key] = 1;
          else delete selected[key];
          row.classList.toggle("sel", cb.checked);
          paintStatus();
          paintCats();
        });
        itemsBox.append(row);
      });
    }
    function paintStatus() {
      var total = Object.keys(selected).length;
      statusLine.textContent =
        total === 0
          ? "Tick items to move them out to a file."
          : total + " item" + (total === 1 ? "" : "s") + " selected.";
    }
    function paintHead() {
      headInfo.textContent = "";
      var cat = CATS.filter(function (c) {
        return c.key === curCat;
      })[0];
      headInfo.append(
        pix(cat.icon, 20),
        el("b", null, cat.label),
        el("span", { style: "flex:1" })
      );
      if ((S[curCat] || []).length) {
        headInfo.append(
          el(
            "button",
            {
              class: "btn sm",
              onclick: function () {
                var arr = S[curCat] || [];
                var allSel =
                  arr.length > 0 &&
                  arr.every(function (x) {
                    return selected[curCat + "::" + x.id];
                  });
                arr.forEach(function (x) {
                  var key = curCat + "::" + x.id;
                  if (allSel) delete selected[key];
                  else selected[key] = 1;
                });
                paint();
              },
            },
            "Toggle all"
          )
        );
      }
      var search = el("input", {
        class: "in",
        placeholder: "Search \u2026",
        value: q,
        style: "flex:1;max-width:220px",
        oninput: function () {
          q = this.value;
          paintItems();
        },
      });
      headInfo.append(search);
    }
    function paint() {
      paintHead();
      paintCats();
      paintItems();
      paintStatus();
    }

    function doMigrate() {
      var keys = Object.keys(selected);
      if (!keys.length) {
        msgBox({
          title: "Migrate",
          icon: "warn",
          text: "Tick at least one item first.",
        });
        return;
      }
      var byCat = {};
      keys.forEach(function (k) {
        var ix = k.indexOf("::");
        var cat = k.slice(0, ix),
          id = k.slice(ix + 2);
        (byCat[cat] = byCat[cat] || []).push(id);
      });
      /* Folders bring their contents. */
      if (byCat.folders && byCat.folders.length) {
        var addAssign = [],
          addNotes = [];
        byCat.folders.forEach(function (fid) {
          var f = S.folders.filter(function (x) {
            return x.id === fid;
          })[0];
          if (!f) return;
          f.assign.forEach(function (aid) {
            if (
              (byCat.assign || []).indexOf(aid) < 0 &&
              S.assign.some(function (x) {
                return x.id === aid;
              })
            )
              addAssign.push(aid);
          });
          f.note.forEach(function (nid) {
            if (
              (byCat.notes || []).indexOf(nid) < 0 &&
              S.notes.some(function (x) {
                return x.id === nid;
              })
            )
              addNotes.push(nid);
          });
        });
        if (addAssign.length)
          byCat.assign = (byCat.assign || []).concat(addAssign);
        if (addNotes.length) byCat.notes = (byCat.notes || []).concat(addNotes);
      }
      var payload = {};
      var counts = {};
      Object.keys(byCat).forEach(function (cat) {
        var ids = byCat[cat];
        payload[cat] = (S[cat] || []).filter(function (x) {
          return ids.indexOf(x.id) >= 0;
        });
        counts[cat] = payload[cat].length;
      });
      if (byCat.assign && byCat.assign.length) {
        var an = {};
        byCat.assign.forEach(function (id) {
          if (S.assignNotes[id]) an[id] = S.assignNotes[id];
        });
        if (Object.keys(an).length) payload.assignNotes = an;
      }
      var totalCount = 0;
      Object.keys(counts).forEach(function (c) {
        totalCount += counts[c];
      });
      saveFile(
        "focusdesk96-migrate-" + ymd(new Date()) + ".json",
        JSON.stringify(
          {
            app: "FocusDesk 96",
            kind: "migrate",
            version: VERSION,
            saved: new Date().toISOString(),
            items: payload,
            counts: counts,
          },
          null,
          2
        )
      );
      /* Remove from S. */
      Object.keys(byCat).forEach(function (cat) {
        var ids = byCat[cat];
        S[cat] = (S[cat] || []).filter(function (x) {
          return ids.indexOf(x.id) < 0;
        });
      });
      if (byCat.assign)
        byCat.assign.forEach(function (id) {
          delete S.assignNotes[id];
        });
      if (S.folders && S.folders.length) {
        S.folders.forEach(function (f) {
          f.assign = f.assign.filter(function (id) {
            return !byCat.assign || byCat.assign.indexOf(id) < 0;
          });
          f.note = f.note.filter(function (id) {
            return !byCat.notes || byCat.notes.indexOf(id) < 0;
          });
        });
      }
      selected = {};
      save();
      refreshAll();
      paint();
      var summary = Object.keys(counts)
        .map(function (c) {
          var cat = CATS.filter(function (x) {
            return x.key === c;
          })[0];
          return (
            "  \u2022 " + counts[c] + " " + (cat ? cat.label.toLowerCase() : c)
          );
        })
        .join("\n");
      msgBox({
        title: "Migrate complete",
        icon: "info",
        width: 420,
        text:
          "Moved " +
          totalCount +
          " item(s) to a migration file:\n\n" +
          summary +
          (window.__focusdeskIsDesktop
            ? "\n\nA copy is saved in the \"migrate\" folder inside your FocusDesk 96 data folder (File menu > Open Backups Folder)."
            : "\n\nThe file is in your downloads.") +
          ' To bring them back later, use "Import migrated file\u2026".',
      });
    }
    function doImport(text) {
      var p = null;
      try {
        p = JSON.parse(text);
      } catch (e) {}
      if (!isObj(p) || !isObj(p.items)) {
        msgBox({
          title: "Import Migrate File",
          icon: "err",
          text: "That file isn't a FocusDesk migration file.",
        });
        return;
      }
      var incoming = sanitize(p.items);
      var added = 0;
      TRASH_KINDS.forEach(function (kind) {
        if (!Array.isArray(incoming[kind]) || !incoming[kind].length) return;
        var have = {};
        (S[kind] || []).forEach(function (x) {
          if (x && x.id) have[x.id] = 1;
        });
        incoming[kind].forEach(function (x) {
          if (!x || !x.id || have[x.id]) return;
          S[kind].push(x);
          have[x.id] = 1;
          added++;
        });
      });
      if (Array.isArray(incoming.folders)) {
        var haveF = {};
        S.folders.forEach(function (f) {
          haveF[f.id] = 1;
        });
        incoming.folders.forEach(function (f) {
          if (!f || !f.id || haveF[f.id]) return;
          S.folders.push(f);
          haveF[f.id] = 1;
          added++;
        });
      }
      if (isObj(incoming.assignNotes)) {
        Object.keys(incoming.assignNotes).forEach(function (k) {
          if (!S.assignNotes[k]) {
            S.assignNotes[k] = incoming.assignNotes[k];
            added++;
          }
        });
      }
      if (isStr(p.wall)) {
        wallData = p.wall;
        try {
          localStorage.setItem(WALLKEY, p.wall);
        } catch (e) {}
        applyWall();
      }
      save();
      refreshAll();
      paint();
      msgBox({
        title: "Import complete",
        icon: "info",
        text: added
          ? "Added " + added + " item(s) back into FocusDesk 96."
          : "Everything in this file is already in FocusDesk 96.",
      });
    }
    var fileIn = el("input", {
      type: "file",
      accept: ".json,application/json",
      "data-pick": "migrate",
      style: "display:none",
      onchange: function () {
        var f = this.files && this.files[0];
        if (!f) return;
        var r = new FileReader();
        r.onload = function () {
          doImport(String(r.result));
        };
        r.readAsText(f);
        this.value = "";
      },
    });
    w.body.append(
      el(
        "div",
        { class: "mig" },
        el(
          "div",
          { class: "mig-top" },
          el("b", null, "Migrate"),
          el(
            "span",
            { class: "mig-hint" },
            "Move items out to a file to free up browser storage. Import them back any time."
          )
        ),
        el(
          "div",
          { class: "mig-body" },
          catsBox,
          el(
            "div",
            { class: "col", style: "flex:1;min-width:0" },
            headInfo,
            itemsBox
          )
        ),
        el(
          "div",
          { class: "mig-bottom" },
          statusLine,
          el("span", { style: "flex:1" }),
          el(
            "button",
            {
              class: "btn",
              style: "display:flex;align-items:center;gap:6px",
              onclick: doMigrate,
            },
            pix("migrate", 16),
            "Migrate selected to file\u2026"
          ),
          el(
            "button",
            {
              class: "btn",
              onclick: function () {
                fileIn.click();
              },
            },
            "Import migrated file\u2026"
          ),
          fileIn
        )
      )
    );
    w.refresh = paint;
    paint();
  }

  /* ================= APP: CONTROL PANEL ================= */
  function exportCsv() {
    var rows = [["Type", "Title", "Detail", "Date", "Time", "Status"]];
    S.assign.forEach(function (a) {
      rows.push([
        "Assignment",
        a.title,
        a.course,
        ymd(new Date(a.due)),
        a.allDay ? "" : hm(new Date(a.due)),
        a.done ? "Done" : "Open",
      ]);
    });
    S.tasks.forEach(function (t) {
      rows.push([
        "Task",
        t.text,
        t.pri,
        t.due != null ? ymd(new Date(t.due)) : "",
        "",
        t.done ? "Done" : "Open",
      ]);
    });
    S.events.forEach(function (e) {
      rows.push(["Event", e.title, e.kind, e.date, e.time || "", ""]);
    });
    S.reminders.forEach(function (r) {
      var d = new Date(r.at);
      rows.push([
        "Reminder",
        r.text,
        "",
        ymd(d),
        hm(d),
        r.done ? "Done" : "Open",
      ]);
    });
    S.classes.forEach(function (c) {
      rows.push([
        "Class",
        c.name,
        c.room,
        c.days
          .map(function (d) {
            return DAYS[d];
          })
          .join(" "),
        c.start + "-" + c.end,
        "",
      ]);
    });
    var csv = rows
      .map(function (r) {
        return r
          .map(function (c) {
            c = String(c == null ? "" : c);
            if (/^[=+\-@]/.test(c)) c = "'" + c;
            return /[",\r\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c;
          })
          .join(",");
      })
      .join("\r\n");
    saveFile("focusdesk96-export-" + ymd(new Date()) + ".csv", csv);
  }
  function appControl(w) {
    var status = el("div", { style: "font-weight:bold" });
    var info = el("div", { class: "stats" });
    var fileIn = el("input", {
      type: "file",
      accept: ".json,application/json",
      style: "display:none",
      onchange: function () {
        var f = this.files && this.files[0];
        if (!f) return;
        var r = new FileReader();
        r.onload = function () {
          tryRestore(String(r.result), false);
        };
        r.readAsText(f);
        this.value = "";
      },
    });
    var fileMerge = el("input", {
      type: "file",
      accept: ".json,application/json",
      style: "display:none",
      onchange: function () {
        var f = this.files && this.files[0];
        if (!f) return;
        var r = new FileReader();
        r.onload = function () {
          tryRestore(String(r.result), true);
        };
        r.readAsText(f);
        this.value = "";
      },
    });
    var appIn = el("input", {
      type: "file",
      accept: ".json,application/json",
      style: "display:none",
      onchange: function () {
        var f = this.files && this.files[0];
        if (!f) return;
        var r = new FileReader();
        r.onload = function () {
          var obj = null;
          try {
            obj = JSON.parse(String(r.result));
          } catch (e) {}
          if (!isObj(obj) || !isObj(obj.prefs)) {
            msgBox({
              title: "Import Appearance",
              icon: "err",
              text: "That file isn't an appearance export.",
            });
            return;
          }
          S.prefs = sanitize({ prefs: obj.prefs }).prefs;
          if (isStr(obj.wall)) {
            wallData = obj.wall;
            try {
              localStorage.setItem(WALLKEY, obj.wall);
            } catch (e) {}
          }
          applyBg();
          applyCursor();
          refreshIcons();
          setSpk();
          mountClipy();
          flush();
          refreshAll();
          draw();
          paintThemes();
          msgBox({
            title: "Import Appearance",
            icon: "info",
            text: "Appearance settings applied.",
          });
        };
        r.readAsText(f);
        this.value = "";
      },
    });
    function exportAppearance() {
      var data = {
        app: "FocusDesk 96",
        kind: "appearance",
        version: VERSION,
        saved: new Date().toISOString(),
        prefs: S.prefs,
        wall: wallData,
      };
      saveFile(
        "focusdesk96-appearance-" + ymd(new Date()) + ".json",
        JSON.stringify(data, null, 2)
      );
    }
    var paste = el("textarea", {
      class: "in",
      rows: 2,
      placeholder: "…or paste backup text here",
      style: 'width:100%;resize:vertical;font:11px "Courier New",monospace',
    });
    var storageBar = el("div", {
      class: "col",
      style: "gap:4px;margin-top:6px",
    });
    function drawStorageBar() {
      storageBar.textContent = "";
      if (window.__focusdeskIsDesktop) return; /* files on disk: no 5 MB limit */
      try {
        var total = 0;
        for (var k in localStorage)
          if (localStorage.hasOwnProperty(k))
            total += (localStorage.getItem(k) || "").length;
        var maxBytes = 5 * 1024 * 1024;
        var bytes = total * 2;
        var pct = Math.min(100, Math.round((bytes / maxBytes) * 100));
        var kb = (bytes / 1024).toFixed(1);
        var barColor = pct < 60 ? "#006000" : pct < 85 ? "#a05000" : "#c00000";
        storageBar.append(
          el(
            "div",
            { style: "font-size:11px;color:#404040" },
            "Approx. " +
              kb +
              " KB used (" +
              pct +
              "% of typical 5 MB origin limit)"
          ),
          el(
            "div",
            {
              style:
                "height:12px;background:#e8e8e8;position:relative;box-shadow:inset 1px 1px #808080,inset -1px -1px #fff",
            },
            el("i", {
              style:
                "display:block;height:100%;width:" +
                pct +
                "%;background:" +
                barColor,
            })
          )
        );
        if (pct >= 85)
          storageBar.append(
            el(
              "div",
              { style: "color:#c00000;font-size:11px;font-weight:bold" },
              "Storage is nearly full. Save a backup and consider removing old notes or cards."
            )
          );
        storageBar.append(
          el(
            "div",
            { style: "font-size:11px;color:#606060;padding-top:4px" },
            "Keys: " +
              Object.keys(localStorage).length +
              "  \u00b7  FocusDesk data: " +
              ((JSON.stringify(S).length / 1024).toFixed(1) + " KB")
          )
        );
      } catch (e) {
        storageBar.append(
          el("div", { class: "dim" }, "Storage info not available.")
        );
      }
    }
    function draw() {
      status.textContent = storageOK
        ? window.__focusdeskIsDesktop
          ? "\u2714 Saving to files on this computer."
          : "\u2714 Saving to this browser."
        : "\u26A0 Not saving! This browser is blocking storage. Download a backup now.";
      status.style.color = storageOK ? "#006000" : "#c00000";
      drawWall();
      drawIcons();
      drawAbout();
      drawStorageBar();
      info.textContent = "";
      var sessions = 0;
      for (var k in S.stats) sessions += S.stats[k].sessions || 0;
      [
        ["Calendar events", S.events.length],
        ["Assignments", S.assign.length],
        ["Notes", S.notes.length],
        ["Reminders", S.reminders.length],
        ["Tasks", S.tasks.length],
        ["Flash cards", S.cards.length],
        ["Folders", S.folders.length],
        ["Focus sessions", sessions],
        ["Recycle Bin", S.trash.length],
        ["Data size", (JSON.stringify(S).length / 1024).toFixed(1) + " KB"],
      ].forEach(function (r) {
        info.append(el("span", null, r[0] + ":"), el("b", null, r[1]));
      });
    }
    function applyData(obj) {
      for (var k in wins) if (k !== "control") closeWin(wins[k]);
      S = sanitize(obj);
      S.winpos = {};
      S.session = { open: [], active: null };
      S.reminders.forEach(function (r) {
        r.fired = false;
      });
      restoreTimer();
      flush();
      applyBg();
      updTimer();
      renderStickies();
      setSpk();
      applyCursor();
      mountClipy();
      draw();
    }
    function mergeData(obj) {
      var incoming = sanitize(obj),
        added = 0;
      TRASH_KINDS.forEach(function (kind) {
        if (!Array.isArray(incoming[kind]) || !incoming[kind].length) return;
        var have = {};
        (S[kind] || []).forEach(function (x) {
          if (x && x.id) have[x.id] = 1;
        });
        incoming[kind].forEach(function (x) {
          if (!x || !x.id || have[x.id]) return;
          S[kind].push(x);
          have[x.id] = 1;
          added++;
        });
      });
      if (Array.isArray(incoming.folders)) {
        var haveF = {};
        S.folders.forEach(function (f) {
          haveF[f.id] = 1;
        });
        incoming.folders.forEach(function (f) {
          if (!f || !f.id || haveF[f.id]) return;
          S.folders.push(f);
          haveF[f.id] = 1;
          added++;
        });
      }
      if (isObj(incoming.assignNotes)) {
        Object.keys(incoming.assignNotes).forEach(function (k) {
          if (!S.assignNotes[k]) {
            S.assignNotes[k] = incoming.assignNotes[k];
            added++;
          }
        });
      }
      if (isObj(incoming.stats)) {
        Object.keys(incoming.stats).forEach(function (k) {
          if (!S.stats[k]) S.stats[k] = { sessions: 0, minutes: 0 };
          S.stats[k].sessions = Math.max(
            S.stats[k].sessions || 0,
            incoming.stats[k].sessions || 0
          );
          S.stats[k].minutes = Math.max(
            S.stats[k].minutes || 0,
            incoming.stats[k].minutes || 0
          );
          if (isObj(incoming.stats[k].by) && !S.stats[k].by) S.stats[k].by = {};
          if (isObj(incoming.stats[k].by))
            Object.keys(incoming.stats[k].by).forEach(function (b) {
              S.stats[k].by[b] = Math.max(
                S.stats[k].by[b] || 0,
                incoming.stats[k].by[b] || 0
              );
            });
        });
      }
      if (isObj(incoming.games))
        Object.keys(incoming.games).forEach(function (k) {
          S.games[k] = Math.max(S.games[k] || 0, incoming.games[k] || 0);
        });
      /* pictures used by merged notes and cards, the focus log, and badges */
      if (isObj(incoming.images))
        Object.keys(incoming.images).forEach(function (k) {
          if (!S.images[k] && Object.keys(S.images).length < 200) {
            S.images[k] = incoming.images[k];
            added++;
          }
        });
      if (Array.isArray(incoming.sessions)) {
        var seenS = {};
        S.sessions.forEach(function (x) {
          seenS[x.t + ":" + x.m] = 1;
        });
        incoming.sessions.forEach(function (x) {
          if (seenS[x.t + ":" + x.m]) return;
          S.sessions.push(x);
          seenS[x.t + ":" + x.m] = 1;
          added++;
        });
        S.sessions.sort(function (a, b) {
          return a.t - b.t;
        });
        if (S.sessions.length > 3000) S.sessions.splice(0, S.sessions.length - 3000);
      }
      if (isObj(incoming.ach))
        Object.keys(incoming.ach).forEach(function (k) {
          if (!S.ach[k] || incoming.ach[k] < S.ach[k]) S.ach[k] = incoming.ach[k];
        });
      save();
      refreshAll();
      draw();
      return added;
    }
    function countData(o) {
      var out = {};
      TRASH_KINDS.forEach(function (k) {
        out[k] = Array.isArray(o[k]) ? o[k].length : 0;
      });
      out.folders = Array.isArray(o.folders) ? o.folders.length : 0;
      out.statsDays = isObj(o.stats) ? Object.keys(o.stats).length : 0;
      return out;
    }
    var APPEARANCE_KEYS = ["bg", "wallMode", "grey", "pattern", "theme", "accent", "cursor", "cursorColors", "iconTheme", "tritone", "iconGrid", "saver", "saverMin", "soundPack", "noteSize", "showClipy", "todayOrder"];
    function sameJ(a, b) {
      return JSON.stringify(a) === JSON.stringify(b);
    }
    function appearanceIsDefault() {
      var d = defaults().prefs;
      return !wallData && APPEARANCE_KEYS.every(function (k) {
        return sameJ(S.prefs[k], d[k]);
      });
    }
    function backupHasLook(inc, wall) {
      var d = defaults().prefs;
      return !!wall || (isObj(inc.prefs) && APPEARANCE_KEYS.some(function (k) {
        return inc.prefs[k] !== undefined && !sameJ(inc.prefs[k], d[k]);
      }));
    }
    function adoptAppearance(inc, wall) {
      if (isObj(inc.prefs))
        APPEARANCE_KEYS.forEach(function (k) {
          if (inc.prefs[k] !== undefined) S.prefs[k] = JSON.parse(JSON.stringify(inc.prefs[k]));
        });
      if (wall) {
        wallData = wall;
        try {
          localStorage.setItem(WALLKEY, wall);
        } catch (e) {}
      }
      applyWall();
      applyBg();
      applyCursor();
      refreshIcons();
      setSpk();
      mountClipy();
      flush();
      refreshAll();
      draw();
      paintThemes();
    }
    function tryRestore(text, merge) {
      var p = null;
      try {
        p = JSON.parse(text);
      } catch (e) {}
      var obj = isObj(p) && isObj(p.data) ? p.data : p;
      var topWall = isObj(p) && isStr(p.wall) ? p.wall : null;
      var ok =
        isObj(obj) &&
        ["events", "notes", "reminders", "assign", "cards"].some(function (k) {
          return Array.isArray(obj[k]);
        });
      if (!ok) {
        msgBox({
          title: merge ? "Merge" : "Restore",
          icon: "err",
          text: "That doesn't look like a FocusDesk 96 backup file.",
        });
        return;
      }
      var incoming = sanitize(obj);
      var curCounts = countData(S),
        newCounts = countData(incoming);
      var lines = ["Backup contents vs. your current data:", ""];
      [
        ["Notes", curCounts.notes, newCounts.notes],
        ["Tasks", curCounts.tasks, newCounts.tasks],
        ["Calendar events", curCounts.events, newCounts.events],
        ["Assignments", curCounts.assign, newCounts.assign],
        ["Reminders", curCounts.reminders, newCounts.reminders],
        ["Flash cards", curCounts.cards, newCounts.cards],
        ["Folders", curCounts.folders, newCounts.folders],
        ["Courses", curCounts.grades, newCounts.grades],
        ["Classes", curCounts.classes, newCounts.classes],
        ["Habits", curCounts.habits, newCounts.habits],
        ["Countdowns", curCounts.countdowns, newCounts.countdowns],
        ["Citations", curCounts.bib, newCounts.bib],
        ["Favorites", curCounts.links, newCounts.links],
        ["Sticky notes", curCounts.stickies, newCounts.stickies],
        ["Days with focus", curCounts.statsDays, newCounts.statsDays],
      ].forEach(function (r) {
        var diff = r[1] !== r[2] ? "  →  " + r[2] : "";
        lines.push("  " + r[0] + ": " + r[1] + diff);
      });
      var summary = lines.join("\n");
      function restoreWall() {
        if (topWall) {
          wallData = topWall;
          try {
            localStorage.setItem(WALLKEY, topWall);
          } catch (e) {}
          applyWall();
        }
      }
      if (merge) {
        var hasLook = backupHasLook(incoming, topWall),
          lookChk = el("input", { type: "checkbox", checked: appearanceIsDefault() });
        msgBox({
          title: "Merge Backup",
          icon: "q",
          width: 460,
          text:
            summary +
            "\n\nMerge adds any items from the backup that aren't already present.",
          extra: hasLook
            ? el(
                "label",
                { class: "row", style: "gap:6px;align-items:center;margin-top:6px;text-align:left" },
                lookChk,
                "Also bring over the backup's look: theme, icons, cursors and wallpaper" +
                  (appearanceIsDefault() ? "" : " (replaces yours)")
              )
            : null,
          buttons: [
            {
              label: "Merge",
              fn: function () {
                var n = mergeData(incoming);
                var look = hasLook && lookChk.checked;
                if (look) adoptAppearance(incoming, topWall);
                msgBox({
                  title: "Merge",
                  icon: "info",
                  text: "Merged " + n + " new item(s)." + (look ? " The backup's look was applied too." : ""),
                });
              },
            },
            { label: "Cancel" },
          ],
        });
        return;
      }
      msgBox({
        title: "Replace Backup",
        icon: "q",
        width: 460,
        text:
          summary +
          "\n\nReplace clears your CURRENT data and loads the backup. This cannot be undone.",
        buttons: [
          {
            label: "Replace",
            fn: function () {
              applyData(incoming);
              restoreWall();
              msgBox({
                title: "Restore",
                icon: "info",
                text: "Backup restored.",
              });
            },
          },
          { label: "Cancel" },
        ],
      });
    }
    function autoBackup() {
      var raw = null,
        t = 0;
      try {
        raw = localStorage.getItem(KEY + ".bak");
        t = +localStorage.getItem(KEY + ".baktime") || 0;
      } catch (e) {}
      if (!raw) {
        msgBox({
          title: "Recover",
          icon: "info",
          text: "No automatic restore point exists yet.",
        });
        return;
      }
      var obj = null;
      try {
        obj = JSON.parse(raw);
      } catch (e) {}
      if (!obj) {
        msgBox({
          title: "Recover",
          icon: "err",
          text: "The automatic restore point is damaged.",
        });
        return;
      }
      msgBox({
        title: "Recover",
        icon: "q",
        text:
          "Go back to the restore point taken at " +
          whenStr(t) +
          "?\nChanges since then will be lost.",
        buttons: [
          {
            label: "Yes",
            fn: function () {
              applyData(obj);
            },
          },
          { label: "No" },
        ],
      });
    }
    var colour = el(
      "select",
      {
        class: "in",
        onchange: function () {
          S.prefs.bg = this.value;
          applyBg();
          save();
        },
      },
      [
        ["#008080", "Teal"],
        ["#004848", "Dark Teal"],
        ["#000080", "Navy"],
        ["#5a5a5a", "Gray"],
        ["#6a2a7a", "Plum"],
        ["#2e6b3e", "Forest"],
        ["#a0522d", "Sienna"],
      ].map(function (c) {
        return el("option", { value: c[0] }, c[1]);
      })
    );
    colour.value = S.prefs.bg;
    if (colour.value !== S.prefs.bg) colour.value = "#008080";
    var snd = el("input", {
      type: "checkbox",
      checked: !S.prefs.mute,
      onchange: function () {
        S.prefs.mute = !this.checked;
        setSpk();
        save();
      },
    });
    var tips = el("input", {
      type: "checkbox",
      checked: S.prefs.tips,
      onchange: function () {
        S.prefs.tips = this.checked;
        save();
      },
    });
    var greyIn = el("input", {
      type: "checkbox",
      checked: !!S.prefs.grey,
      onchange: function () {
        S.prefs.grey = this.checked;
        applyBg();
        save();
      },
    });
    var restoreIn = el("input", {
      type: "checkbox",
      checked: S.prefs.restoreSession !== false,
      onchange: function () {
        S.prefs.restoreSession = this.checked;
        save();
      },
    });
    var saverSel = el(
      "select",
      {
        class: "in",
        onchange: function () {
          S.prefs.saver = this.value;
          save();
        },
      },
      [
        ["", "None"],
        ["stars", "Starfield"],
        ["mystify", "Mystify"],
        ["text", "Flying Text"],
        ["bubbles", "Bubbles"],
        ["matrix", "Matrix"],
        ["pipes", "Pipes"],
        ["flurry", "Flurry"],
        ["warp", "Warp Tunnel"],
      ].map(function (o) {
        return el("option", { value: o[0] }, o[1]);
      })
    );
    saverSel.value = S.prefs.saver || "";
    var saverMin = el(
      "select",
      {
        class: "in",
        onchange: function () {
          S.prefs.saverMin = parseInt(this.value, 10) || 5;
          save();
        },
      },
      [1, 2, 5, 10, 15].map(function (n) {
        return el(
          "option",
          { value: n },
          n + (n === 1 ? " minute" : " minutes")
        );
      })
    );
    saverMin.value = String(S.prefs.saverMin || 5);
    var iconsList = el("div", {
      class: "sunk",
      style: "max-height:150px;overflow:auto;padding:4px 6px",
    });
    function drawIcons() {
      iconsList.textContent = "";
      var ids = Object.keys(APPS)
        .sort(function (a, b) {
          return APPS[a].title < APPS[b].title ? -1 : 1;
        })
        .concat(["sticky", "bin"]);
      ids.forEach(function (id) {
        var iinfo = iconInfo(id);
        if (!iinfo) return;
        iconsList.append(
          el(
            "label",
            { style: "display:flex;align-items:center;gap:6px;padding:1px 0" },
            el("input", {
              type: "checkbox",
              checked: onDesk(id),
              onchange: function () {
                if (this.checked) addToDesk(id);
                else removeFromDesk(id);
              },
            }),
            pix(iinfo.glyph, 16),
            iinfo.label
          )
        );
      });
    }
    var iconsBox = el(
      "fieldset",
      null,
      el("legend", null, "Desktop Icons"),
      iconsList,
      el(
        "label",
        { style: "display:flex;align-items:center;gap:6px;padding:6px 0 0" },
        el("input", {
          type: "checkbox",
          checked: S.prefs.iconGrid !== false,
          onchange: function () {
            setIconGrid(this.checked);
          },
        }),
        "Snap icons to a grid"
      ),
      el(
        "div",
        { class: "row", style: "margin-top:6px" },
        el(
          "button",
          { class: "btn sm", onclick: arrangeByName },
          "Arrange by name"
        ),
        el(
          "button",
          { class: "btn sm", onclick: resetPositions },
          "Reset positions"
        ),
        el(
          "button",
          {
            class: "btn sm",
            onclick: function () {
              S.desk.ids = DESK_DEFAULT.slice();
              S.desk.pos = {};
              S.desk.freepos = {};
              S.desk.init = true;
              save();
              buildIcons();
              refreshAll();
            },
          },
          "Default icons"
        )
      ),
      el(
        "div",
        { class: "dim", style: "padding:6px 0 0" },
        "Tick an icon to put it on the desktop."
      )
    );
    var aiC = el("div", { class: "col", style: "gap:4px" });
    function aiKeyRow(kind, label, hint) {
      var keyIn = el("input", {
        class: "in",
        type: "password",
        autocomplete: "off",
        spellcheck: "false",
        placeholder:
          kind === "openrouter"
            ? "sk-or-v1-…"
            : kind === "openai"
            ? "sk-…"
            : "paste key here…",
        value: getKey(kind),
        style: "flex:1 1 150px",
      });
      var modelIn = el("input", {
        class: "in",
        value: (S.prefs.aiModels || {})[kind] || "",
        placeholder: aiModel(kind) || "default",
        style: "flex:1 1 130px",
        oninput: function () {
          S.prefs.aiModels = S.prefs.aiModels || {};
          var v = this.value.trim();
          if (v) S.prefs.aiModels[kind] = clip(v, 100);
          else delete S.prefs.aiModels[kind];
          save();
        },
      });
      var info2 = el("div", {
        class: "dim",
        style: "padding:0;min-height:14px",
      });
      return el(
        "div",
        {
          class: "col",
          style:
            "gap:2px;margin-top:6px;border-top:1px solid #dfdfdf;padding-top:6px",
        },
        el("b", null, label),
        el(
          "div",
          { class: "row", style: "gap:4px;flex-wrap:wrap" },
          el("span", null, "Key:"),
          keyIn,
          el(
            "button",
            {
              class: "btn sm",
              onclick: function () {
                var v = keyIn.value.trim();
                var ok = setKey(kind, v);
                info2.textContent = v
                  ? ok
                    ? "Key saved."
                    : "Kept for this session only."
                  : "Key removed.";
                drawAI();
              },
            },
            "Save"
          ),
          el(
            "button",
            {
              class: "btn sm",
              onclick: function () {
                setKey(kind, "");
                keyIn.value = "";
                info2.textContent = "Key removed.";
                drawAI();
              },
            },
            "Clear"
          )
        ),
        el(
          "div",
          { class: "row", style: "gap:4px;flex-wrap:wrap" },
          el("span", null, "Model:"),
          modelIn,
          el(
            "button",
            {
              class: "btn sm",
              onclick: function () {
                openUrl(hint);
              },
            },
            "Get a key"
          )
        ),
        info2
      );
    }
    function drawAI() {
      aiC.textContent = "";
      var pick = el("div", { class: "row", style: "gap:4px;flex-wrap:wrap" });
      [
        "helpy",
        "lolbit",
        "handunit",
        "carnie",
        "mystic",
        "ollama",
        "off",
      ].forEach(function (id) {
        var p = PROVIDERS[id];
        pick.append(
          el(
            "button",
            {
              class: "btn sm" + (S.prefs.ai === id ? " on" : ""),
              style: "display:flex;align-items:center;gap:5px",
              onclick: function () {
                S.prefs.ai = id;
                save();
                drawAI();
              },
            },
            id === "off" ? null : pix(p.icon, 16),
            id === "off" ? "Off" : p.name
          )
        );
      });
      aiC.append(pick);
      aiC.append(
        el(
          "div",
          { class: "dim", style: "padding:2px 0 6px" },
          "Which assistant Research and Clipy talk to. Each one needs its own key (except Helpy inside Claude, and M.X.E.S. which runs locally)."
        )
      );
      aiC.append(
        el(
          "label",
          { style: "display:flex;align-items:center;gap:6px;padding:2px 0" },
          el("input", {
            type: "checkbox",
            checked: S.prefs.claudeMode === "api",
            onchange: function () {
              S.prefs.claudeMode = this.checked ? "api" : "native";
              save();
              drawAI();
            },
          }),
          el(
            "span",
            null,
            "Use Helpy through the Anthropic API (needs a Claude key) instead of the built-in Claude"
          )
        )
      );
      if (S.prefs.claudeMode === "api")
        aiC.append(
          aiKeyRow(
            "claude",
            "Helpy (Claude / Anthropic)",
            "https://console.anthropic.com/settings/keys"
          )
        );
      aiC.append(
        aiKeyRow("openai", "HandUnit (OpenAI)", ENDPOINTS.openai.hint)
      );
      aiC.append(
        aiKeyRow("deepseek", "Carnie (DeepSeek)", ENDPOINTS.deepseek.hint)
      );
      aiC.append(
        aiKeyRow(
          "gemini",
          "Mystic Hippo (Gemini)",
          "https://aistudio.google.com/app/apikey"
        )
      );
      aiC.append(
        aiKeyRow("openrouter", "Lolbit (OpenRouter)", ENDPOINTS.openrouter.hint)
      );
      var mxesUrlIn = el("input", {
        class: "in",
        value: S.prefs.localUrl || "",
        placeholder:
          "http://localhost:1234 (LM Studio)  \u00b7  http://localhost:11434 (Ollama)",
        style: "flex:1 1 220px",
        oninput: function () {
          var v = this.value.trim();
          S.prefs.localUrl = /^https?:\/\//i.test(v) ? clip(v, 200) : "";
          save();
        },
      });
      var mxesModelIn = el("input", {
        class: "in",
        value: (S.prefs.aiModels || {}).ollama || "",
        placeholder: "e.g. qwen2.5-7b-instruct  \u00b7  or click Fetch models",
        style: "flex:1 1 220px",
        list: "mxes-models-list",
        oninput: function () {
          S.prefs.aiModels = S.prefs.aiModels || {};
          var v = this.value.trim();
          if (v) S.prefs.aiModels.ollama = clip(v, 100);
          else delete S.prefs.aiModels.ollama;
          save();
        },
      });
      var mxesDatalist = el("datalist", { id: "mxes-models-list" });
      var mxesInfo = el("div", {
        class: "dim",
        style: "padding:2px 0 0;font-size:11px;min-height:14px",
      });
      aiC.append(
        el(
          "div",
          {
            class: "col",
            style:
              "gap:4px;margin-top:6px;border-top:1px solid #dfdfdf;padding-top:6px",
          },
          el("b", null, "M.X.E.S. \u2014 local server (Ollama / LM Studio)"),
          el(
            "div",
            {
              class: "row",
              style: "gap:4px;flex-wrap:wrap;align-items:center",
            },
            el("span", null, "URL:"),
            mxesUrlIn,
            el(
              "button",
              {
                class: "btn sm",
                onclick: function () {
                  openUrl("https://ollama.com/download");
                },
              },
              "Get Ollama"
            ),
            el(
              "button",
              {
                class: "btn sm",
                onclick: function () {
                  openUrl("https://lmstudio.ai");
                },
              },
              "Get LM Studio"
            )
          ),
          el(
            "div",
            {
              class: "row",
              style: "gap:4px;flex-wrap:wrap;align-items:center",
            },
            el("span", null, "Model:"),
            mxesModelIn,
            el(
              "button",
              {
                class: "btn sm",
                onclick: function () {
                  var base = localBase();
                  mxesInfo.textContent =
                    "Fetching " + base + "/v1/models\u2026";
                  fetch(base + "/v1/models")
                    .then(function (r) {
                      if (!r.ok) throw new Error("HTTP " + r.status);
                      return r.json();
                    })
                    .then(function (j) {
                      var ids = ((j && j.data) || [])
                        .map(function (m) {
                          return m.id;
                        })
                        .filter(Boolean);
                      mxesDatalist.textContent = "";
                      ids.forEach(function (id) {
                        mxesDatalist.append(el("option", { value: id }));
                      });
                      if (!ids.length) {
                        mxesInfo.textContent =
                          "The server replied but returned no models. Is one loaded in LM Studio / pulled in Ollama?";
                        return;
                      }
                      if (!mxesModelIn.value) {
                        mxesModelIn.value = ids[0];
                        S.prefs.aiModels = S.prefs.aiModels || {};
                        S.prefs.aiModels.ollama = ids[0];
                        save();
                      }
                      mxesInfo.textContent =
                        ids.length +
                        " model(s) found. Click the Model field to pick one.";
                    })
                    .catch(function (e) {
                      mxesInfo.textContent =
                        "Couldn't reach " +
                        base +
                        "/v1/models (" +
                        (e && e.message ? e.message : "network error") +
                        "). Make sure the LM Studio / Ollama server is running with CORS allowed for this page.";
                    });
                },
              },
              "Fetch models"
            ),
            mxesDatalist
          ),
          mxesInfo,
          el(
            "div",
            { class: "dim", style: "padding:2px 0 0;font-size:11px" },
            "LM Studio default: http://localhost:1234  \u00b7  Ollama default: http://localhost:11434."
          )
        )
      );
      aiC.append(
        el(
          "div",
          { class: "row", style: "gap:4px;flex-wrap:wrap;margin-top:6px" },
          el(
            "button",
            {
              class: "btn sm",
              onclick: function () {
                var info3 = el("span", {
                  class: "dim",
                  style: "padding:0 6px",
                });
                aiC.append(info3);
                info3.textContent = "Testing…";
                var m = S.prefs.ai;
                if (m === "off") {
                  info3.textContent = "Pick an assistant first.";
                  return;
                }
                aiChat(
                  m,
                  "Reply with exactly: " + PROVIDERS[m].name + " online.",
                  { json: false }
                ).then(
                  function (r) {
                    info3.textContent =
                      PROVIDERS[m].name +
                      " says: " +
                      clip(String(r.text || "").trim(), 80);
                  },
                  function (e) {
                    info3.textContent = copyFor(e);
                  }
                );
              },
            },
            "Test assistant"
          ),
          el(
            "button",
            {
              class: "btn sm",
              onclick: function () {
                openUrl("https://openrouter.ai/models?max_price=0");
              },
            },
            "Browse free OpenRouter models"
          )
        )
      );
      aiC.append(
        el(
          "div",
          { class: "dim", style: "padding:4px 0 0" },
          window.__focusdeskIsDesktop
            ? "Keys stay on this computer (in keys.json) and are never written into backup files."
            : "Keys stay in this browser only and are never written into backup files."
        )
      );
    }
    var aiStatus = el("div", { class: "dim", style: "padding:0 0 4px" });
    function paintAiStatus() {
      var m = clipyAssistant(),
        st = assistantState(m);
      aiStatus.textContent =
        m === "off"
          ? "No assistant selected."
          : st.ok
          ? "Ready: " + PROVIDERS[m].name + " is available."
          : PROVIDERS[m].name + " is unavailable (" + st.why + ")." + (m !== "ollama" && st.why === "offline" ? " A local model (M.X.E.S.) still works offline." : "");
      aiStatus.style.color = m !== "off" && !st.ok ? "#c00000" : "";
    }
    aiNetListeners.cp = paintAiStatus;
    paintAiStatus();
    drawAI();
    var aiBox = el("fieldset", null, el("legend", null, "Assistant"), aiStatus, aiC);
    var aboutInfo = el("div", {
        class: "stats",
        style: "grid-template-columns:auto 1fr",
      }),
      helpyOk = null;
    function drawAbout() {
      aboutInfo.textContent = "";
      var embedded = false;
      try {
        embedded = window.self !== window.top;
      } catch (e) {
        embedded = true;
      }
      var rows = [
        ["Studio", "Apoji Studios"],
        ["Developer", "Apoji Delegraphics"],
        ["Product", "FocusDesk 96"],
        ["Version", VERSION],
        [
          "Where",
          window.__focusdeskIsDesktop
            ? "FocusDesk 96 Desktop Edition (" +
              ({ darwin: "macOS", win32: "Windows", linux: "Linux" }[window.__focusdeskPlatform] || "desktop") +
              ")"
            : embedded
            ? "Inside another page (such as Claude)"
            : location.protocol === "file:"
            ? "Browser version saved on this computer"
            : "In your web browser (online)",
        ],
        [
          "Helpy (Claude)",
          helpyOk === null
            ? "Checking…"
            : helpyOk
            ? "Built-in Claude available"
            : "Not available here (use API mode)",
        ],
        ["Assistant", S.prefs.ai || "(auto)"],
        [
          "Saving files",
          window.__focusdeskIsDesktop
            ? "Native Save As and Open dialogs"
            : helpyOk
            ? "Through the host page"
            : "Through your browser downloads",
        ],
        [
          "Full screen",
          document.documentElement.requestFullscreen ||
          document.documentElement.webkitRequestFullscreen
            ? "Supported"
            : "Not supported by this browser",
        ],
        [
          "Screen",
          innerWidth +
            " \u00d7 " +
            innerHeight +
            (coarse ? "  (touch)" : "  (mouse)"),
        ],
      ];
      rows.forEach(function (r) {
        aboutInfo.append(
          el("span", null, r[0] + ":"),
          el("b", { style: "text-align:left" }, r[1])
        );
      });
    }
    getCap("sample").then(function (sm2) {
      helpyOk = typeof sm2 === "function";
      drawAbout();
    });
    var aboutBox = el("fieldset", null, el("legend", null, "About"), aboutInfo);
    var deskBox = window.__focusdeskIsDesktop
      ? (function () {
          var P = window.__focusdeskDPrefs || {},
            D = Object.assign({}, window.__focusdeskDirs || {}),
            fdk = window.focusdesk,
            mac = window.__focusdeskPlatform === "darwin",
            tray = mac ? "menu bar" : "system tray",
            note = el("div", { class: "dim", style: "padding:0" }),
            bkPath = el("div", { style: "padding:0;word-break:break-all;font-size:11px" });
          function paintNote(extra) {
            var st = window.__focusdeskDStatus || {},
              bits = [];
            if (P.hotkey !== false && !st.hotkeyOk) bits.push("The quick capture hotkey is in use by another app, so it isn't active.");
            if (!st.trayOk) bits.push("No " + tray + " is available on this system, so tray options won't work.");
            if (extra) bits.push(extra);
            note.textContent = bits.join(" ");
          }
          function paintBk() {
            bkPath.textContent = "Daily backups go to: " + (D.backups || "") + (P.backupPath ? "" : "  (default)");
          }
          function opt(key, label, dflt) {
            return el(
              "label",
              { class: "row", style: "gap:6px;align-items:center" },
              el("input", {
                type: "checkbox",
                checked: dflt ? P[key] !== false : !!P[key],
                onchange: function () {
                  var o = {};
                  o[key] = this.checked;
                  window.__focusdeskSetPrefs(o).then(function (r) {
                    P = window.__focusdeskDPrefs || P;
                    paintNote(key === "launchAtLogin" && r && r.login && !r.login.ok ? r.login.reason || "Couldn't change the startup setting." : "");
                  });
                },
              }),
              label
            );
          }
          function btn(label, fn, title) {
            return el("button", { class: "btn sm", title: title || "", onclick: fn }, label);
          }
          var keepSel = el(
            "select",
            {
              class: "in",
              "aria-label": "How many daily backups to keep",
              onchange: function () {
                window.__focusdeskSetPrefs({ backupKeep: +this.value });
              },
            },
            [[7, "Keep the last 7"], [14, "Keep the last 14"], [30, "Keep the last 30"], [0, "Keep all of them"]].map(function (o) {
              return el("option", { value: String(o[0]), selected: (P.backupKeep === undefined ? 7 : P.backupKeep) === o[0] }, o[1]);
            })
          );
          var testOut = el("span", { class: "dim", style: "padding:0" });
          paintNote();
          paintBk();
          return el(
            "fieldset",
            null,
            el("legend", null, "Desktop"),
            el(
              "div",
              { class: "col", style: "gap:4px" },
              opt("notifications", "Native notifications for reminders and finished focus sessions", true),
              opt("notifyAlways", "...even while FocusDesk is the window in front", true),
              el(
                "div",
                { class: "row", style: "gap:6px;align-items:center" },
                btn("Send test notification", function () {
                  testOut.textContent = "Sending\u2026";
                  fdk.testNotify().then(function (r) {
                    testOut.textContent =
                      r && r.ok
                        ? "Sent. If you don't see it, check your system's notification settings and Do Not Disturb."
                        : r && r.reason === "unsupported"
                        ? "This system doesn't support notifications from FocusDesk."
                        : "Couldn't send one: " + ((r && r.reason) || "unknown reason");
                  });
                }),
                testOut
              ),
              opt("dueOverdue", "Show overdue tasks and assignments in the " + tray + " menu, too", true),
              opt("hotkey", "Quick capture hotkey: " + (mac ? "Cmd" : "Ctrl") + "+Shift+Space", true),
              opt("closeToTray", "Keep running in the " + tray + " when I close the window", false),
              opt("launchAtLogin", "Open FocusDesk when I log in", false),
              opt("startHidden", "\u2026and start hidden in the " + tray, false),
              el(
                "div",
                { class: "row", style: "gap:6px;flex-wrap:wrap" },
                btn("Quick capture\u2026", function () {
                  fdk.openCapture("task");
                }),
                btn("Ask Clipy\u2026", function () {
                  fdk.openClipy("");
                }),
                btn("Mini timer", function () {
                  fdk.openMiniTimer(false);
                })
              ),
              el("div", { style: "font-weight:bold;margin-top:6px" }, "Daily backups"),
              bkPath,
              el(
                "div",
                { class: "row", style: "gap:6px;flex-wrap:wrap;align-items:center" },
                btn("Choose folder\u2026", function () {
                  fdk.chooseBackupFolder().then(function (r) {
                    if (r && r.ok) {
                      D.backups = r.path;
                      P = r.prefs || P;
                      window.__focusdeskDPrefs = P;
                      paintBk();
                      paintNote(r.note || "");
                    } else if (r && r.error) paintNote(r.error);
                  });
                }, "For example a Dropbox or iCloud Drive folder"),
                btn("Use default", function () {
                  fdk.resetBackupFolder().then(function (r) {
                    if (r && r.ok) {
                      D.backups = r.path;
                      P = r.prefs || P;
                      window.__focusdeskDPrefs = P;
                      paintBk();
                    }
                  });
                }),
                btn("Open folder", function () {
                  fdk.openBackupDir();
                }),
                keepSel
              ),
              note
            )
          );
        })()
      : null;
    var updBox = el(
      "fieldset",
      null,
      el("legend", null, "Updates"),
      el(
        "div",
        { class: "row", style: "gap:8px;align-items:center;flex-wrap:wrap" },
        el("button", { class: "btn sm", onclick: function () { checkUpdate(true); } }, window.__focusdeskIsDesktop || location.protocol === "file:" ? "Check for updates" : "Check for the desktop app"),
        window.__focusdeskIsDesktop || location.protocol === "file:"
          ? el("label", { class: "row", style: "gap:4px;align-items:center" }, el("input", { type: "checkbox", checked: S.prefs.updAuto === true, onchange: function () { S.prefs.updAuto = this.checked; save(); } }), "Check automatically when FocusDesk starts")
          : null
      )
    );
    var wallInfo = el("div", { style: "padding:0" });
    function drawWall() {
      wallInfo.textContent = wallData
        ? "A picture is set as your desktop background."
        : "No picture set. You can also drag a picture file onto the desktop.";
    }
    var patSel = el(
      "select",
      {
        class: "in",
        onchange: function () {
          S.prefs.pattern = this.value;
          save();
          applyWall();
        },
      },
      [
        ["", "None"],
        ["dots", "Dots"],
        ["grid", "Grid"],
        ["checks", "Checks"],
        ["stripes", "Stripes"],
      ].map(function (o) {
        return el("option", { value: o[0] }, o[1]);
      })
    );
    patSel.value = S.prefs.pattern || "";
    var modeSel = el(
      "select",
      {
        class: "in",
        onchange: function () {
          S.prefs.wallMode = this.value;
          save();
          applyWall();
        },
      },
      [
        ["fill", "Fill"],
        ["stretch", "Stretch"],
        ["center", "Center"],
        ["tile", "Tile"],
      ].map(function (o) {
        return el("option", { value: o[0] }, o[1]);
      })
    );
    modeSel.value = S.prefs.wallMode || "fill";
    var picIn = el("input", {
      type: "file",
      accept: "image/*",
      style: "display:none",
      onchange: function () {
        var f = this.files && this.files[0];
        this.value = "";
        if (f) setWallFromFile(f);
      },
    });
    var themeSwatches = el("div", { class: "theme-swatches" });
    var customBg = el("input", {
      type: "color",
      value: S.prefs.bg || "#008080",
      oninput: function () {
        S.prefs.bg = this.value;
        applyBg();
        save();
      },
    });
    var customAccent = el("input", {
      type: "color",
      value: S.prefs.accent || "#000080",
      oninput: function () {
        S.prefs.accent = this.value;
        applyBg();
        save();
      },
    });
    function paintThemes() {
      themeSwatches.textContent = "";
      THEMES.forEach(function (t) {
        var b = el("button", {
          class: S.prefs.theme === t.key ? "on" : "",
          title: t.name,
          style:
            "background:linear-gradient(135deg," +
            t.bg +
            " 0 50%," +
            t.accent +
            " 50% 100%)",
          onclick: function () {
            S.prefs.theme = t.key;
            S.prefs.bg = t.bg;
            S.prefs.accent = t.accent;
            customBg.value = t.bg;
            customAccent.value = t.accent;
            if (colour) colour.value = t.bg;
            applyBg();
            save();
            paintThemes();
          },
        });
        themeSwatches.append(b);
      });
    }
    paintThemes();
    var clipyTipsIn = el("input", {
      type: "checkbox",
      checked: S.prefs.clipyTips !== false,
      onchange: function () {
        S.prefs.clipyTips = this.checked;
        save();
        scheduleClipyTips();
      },
    });
    var clipyShowIn = el("input", {
      type: "checkbox",
      checked: S.prefs.showClipy !== false,
      onchange: function () {
        S.prefs.showClipy = this.checked;
        save();
        if (this.checked) mountClipy();
        else unmountClipy();
      },
    });
    var tritonePanel = el("div", { class: "tritone-box" });
    function paintTritone() {
      tritonePanel.textContent = "";
      if (!isObj(S.prefs.tritone)) {
        S.prefs.tritone = { dark: "#000000", mid: "#808080", light: "#ffffff" };
      }
      var t = S.prefs.tritone;
      tritonePanel.append(el("div", { class: "tritone-h" }, "Tritone Colours"));
      tritonePanel.append(
        el(
          "div",
          { class: "tritone-note" },
          "Pick three colours. Every icon is redrawn using them for dark outlines, mid tones and highlights."
        )
      );
      var presetRow = el("div", { class: "tritone-row" });
      TRITONE_PRESETS.forEach(function (p) {
        presetRow.append(
          el(
            "span",
            {
              class: "tritone-swatch",
              title: p.name,
              onclick: function () {
                S.prefs.tritone = { dark: p.dark, mid: p.mid, light: p.light };
                save();
                refreshIcons();
                paintTritone();
              },
            },
            el("i", { style: "background:" + p.dark }),
            el("i", { style: "background:" + p.mid }),
            el("i", { style: "background:" + p.light })
          )
        );
      });
      tritonePanel.append(presetRow);
      var previewRow = el("div", { class: "tritone-preview" });
      function buildPreview() {
        previewRow.textContent = "";
        ["folder", "notepad", "calendar", "control", "games", "clippy"].forEach(
          function (n) {
            previewRow.append(pix(n, 32));
          }
        );
      }
      var colorsRow = el("div", { class: "tritone-colors" });
      [
        ["dark", "Dark (outlines)"],
        ["mid", "Mid (bodies)"],
        ["light", "Light (highlights)"],
      ].forEach(function (c) {
        colorsRow.append(
          el(
            "label",
            null,
            c[1],
            el("input", {
              type: "color",
              value: t[c[0]],
              oninput: function () {
                S.prefs.tritone[c[0]] = this.value;
                buildPreview();
              },
              onchange: function () {
                S.prefs.tritone[c[0]] = this.value;
                save();
                refreshIcons();
                buildPreview();
              },
            })
          )
        );
      });
      tritonePanel.append(colorsRow);
      buildPreview();
      tritonePanel.append(previewRow);
    }
    tritonePanel.hidden = S.prefs.iconTheme !== "tritone";
    if (!tritonePanel.hidden) paintTritone();
    var cursorSel = el(
      "select",
      {
        class: "in",
        onchange: function () {
          S.prefs.cursor = this.value;
          applyCursor();
          save();
          cursorOutline.disabled = this.value === "default";
          cursorFill.disabled = this.value === "default";
        },
      },
      [
        ["blocky", "Blocky arrow"],
        ["dot", "Dot"],
        ["pencil", "Pencil"],
        ["default", "System default"],
      ].map(function (o) {
        return el(
          "option",
          { value: o[0], selected: (S.prefs.cursor || "blocky") === o[0] },
          o[1]
        );
      })
    );
    var cursorOutline = el("input", {
      type: "color",
      value:
        (S.prefs.cursorColors && S.prefs.cursorColors.outline) || "#000000",
      title: "Cursor outline colour",
      style:
        "width:40px;height:24px;padding:0;border:1px solid #808080;background:none",
      disabled: (S.prefs.cursor || "blocky") === "default",
      oninput: function () {
        S.prefs.cursorColors = S.prefs.cursorColors || {
          outline: "#000000",
          fill: "#ffffff",
        };
        S.prefs.cursorColors.outline = this.value;
        applyCursor();
        save();
      },
    });
    var cursorFill = el("input", {
      type: "color",
      value: (S.prefs.cursorColors && S.prefs.cursorColors.fill) || "#ffffff",
      title: "Cursor fill colour",
      style:
        "width:40px;height:24px;padding:0;border:1px solid #808080;background:none",
      disabled: (S.prefs.cursor || "blocky") === "default",
      oninput: function () {
        S.prefs.cursorColors = S.prefs.cursorColors || {
          outline: "#000000",
          fill: "#ffffff",
        };
        S.prefs.cursorColors.fill = this.value;
        applyCursor();
        save();
      },
    });
    var displayBox = el(
      "fieldset",
      null,
      el("legend", null, "Display & Preferences"),
      el(
        "div",
        { style: "font-weight:bold;font-size:11px;margin-bottom:4px" },
        "Theme"
      ),
      themeSwatches,
      el(
        "div",
        { class: "color-row", style: "margin-top:8px" },
        el("span", null, "Desktop:"),
        customBg,
        el("span", null, "Accent:"),
        customAccent
      ),
      el(
        "div",
        { class: "row", style: "margin-top:8px" },
        el("span", null, "Pattern:"),
        patSel,
        el("span", { style: "flex:1" })
      ),
      el(
        "div",
        {
          class: "row",
          style: "margin-top:8px;flex-wrap:nowrap;align-items:flex-start",
        },
        pix("image", 32),
        el(
          "div",
          { class: "col", style: "gap:6px;flex:1;min-width:0" },
          wallInfo,
          el(
            "div",
            { class: "row" },
            el(
              "button",
              {
                class: "btn sm",
                onclick: function () {
                  picIn.click();
                },
              },
              "Choose picture\u2026"
            ),
            el(
              "button",
              {
                class: "btn sm",
                onclick: function () {
                  clearWall();
                },
              },
              "Remove"
            ),
            el("span", null, "Position:"),
            modeSel
          ),
          picIn
        )
      ),
      el(
        "div",
        { class: "row", style: "margin-top:8px;gap:10px;flex-wrap:wrap" },
        el("span", null, "Icon theme:"),
        el(
          "select",
          {
            class: "in",
            onchange: function () {
              S.prefs.iconTheme = this.value;
              save();
              refreshIcons();
              tritonePanel.hidden = this.value !== "tritone";
              if (this.value === "tritone") paintTritone();
            },
          },
          [
            ["vga", "16-colour (classic)"],
            ["mono", "Monochrome"],
            ["modern", "Modern"],
            ["tritone", "Tritone (custom colours)"],
          ].map(function (o) {
            return el(
              "option",
              { value: o[0], selected: (S.prefs.iconTheme || "vga") === o[0] },
              o[1]
            );
          })
        )
      ),
      tritonePanel,
      el(
        "div",
        {
          class: "row",
          style: "margin-top:8px;gap:10px;flex-wrap:wrap;align-items:center",
        },
        el("span", null, "Cursor:"),
        cursorSel,
        el("span", null, "Outline:"),
        cursorOutline,
        el("span", null, "Fill:"),
        cursorFill
      ),
      el(
        "div",
        { class: "row", style: "margin-top:8px;gap:10px;flex-wrap:wrap" },
        el("span", null, "Sound pack:"),
        el(
          "select",
          {
            class: "in",
            onchange: function () {
              S.prefs.soundPack = this.value;
              save();
              if (this.value !== "silent") ding();
            },
          },
          [
            ["classic", "Classic"],
            ["silent", "Silent"],
            ["chiptune", "Chiptune"],
          ].map(function (o) {
            return el(
              "option",
              {
                value: o[0],
                selected: (S.prefs.soundPack || "classic") === o[0],
              },
              o[1]
            );
          })
        )
      ),
      el(
        "div",
        { class: "row", style: "margin-top:8px;gap:10px;flex-wrap:wrap" },
        el(
          "label",
          { style: "display:flex;align-items:center" },
          snd,
          "Play sounds"
        ),
        el(
          "label",
          { style: "display:flex;align-items:center" },
          tips,
          "Show welcome tips at start"
        ),
        el(
          "label",
          { style: "display:flex;align-items:center" },
          greyIn,
          "Grey Mode"
        )
      ),
      el(
        "div",
        { class: "row", style: "margin-top:8px;gap:10px;flex-wrap:wrap" },
        el(
          "label",
          { style: "display:flex;align-items:center" },
          clipyShowIn,
          "Show Clipy"
        ),
        el(
          "label",
          { style: "display:flex;align-items:center" },
          clipyTipsIn,
          "Clipy tips when idle"
        )
      ),
      el(
        "div",
        { class: "row", style: "margin-top:8px;gap:10px;flex-wrap:wrap" },
        el(
          "label",
          { style: "display:flex;align-items:center" },
          restoreIn,
          "Reopen windows on launch"
        )
      ),
      el(
        "fieldset",
        { style: "margin-top:10px" },
        el("legend", null, "Screen Saver"),
        el(
          "div",
          { class: "row", style: "gap:6px;flex-wrap:wrap;align-items:center" },
          el("span", null, "Style:"),
          saverSel,
          el("span", null, "Wait:"),
          saverMin,
          el(
            "button",
            {
              class: "btn sm",
              onclick: function () {
                startSaver(saverSel.value || "stars");
              },
            },
            "Preview"
          )
        ),
        el(
          "div",
          { class: "dim", style: "padding:6px 0 0" },
          "Starts after the wait time with no mouse or keyboard activity."
        )
      ),
      el(
        "div",
        { class: "dim", style: "padding:6px 0 0" },
        "In Center mode, your colour and pattern stay visible behind the picture."
      )
    );
    w.body.append(
      el(
        "div",
        { class: "col cp", style: "overflow:auto" },
        el(
          "fieldset",
          null,
          el("legend", null, "Storage"),
          status,
          el("div", { style: "height:6px" }),
          info,
          storageBar
        ),
        el(
          "fieldset",
          null,
          el("legend", null, "Backup"),
          el(
            "div",
            { class: "row" },
            el(
              "button",
              {
                class: "btn",
                onclick: function () {
                  saveFile(
                    "focusdesk96-backup-" + ymd(new Date()) + ".json",
                    JSON.stringify(
                      {
                        app: "FocusDesk 96",
                        version: VERSION,
                        saved: new Date().toISOString(),
                        data: S,
                        wall: wallData,
                      },
                      null,
                      2
                    )
                  );
                  try {
                    localStorage.setItem(
                      "focusdesk96.lastbackup",
                      String(Date.now())
                    );
                  } catch (e) {}
                },
              },
              "Save backup file\u2026"
            ),
            el(
              "button",
              {
                class: "btn",
                onclick: function () {
                  fileIn.click();
                },
              },
              "Restore from file\u2026"
            ),
            fileIn,
            el(
              "button",
              {
                class: "btn",
                onclick: function () {
                  fileMerge.click();
                },
              },
              "Merge from file\u2026"
            ),
            fileMerge,
            el("button", { class: "btn", onclick: exportCsv }, "Export .csv")
          ),
          el(
            "div",
            { class: "row", style: "margin-top:6px" },
            el(
              "button",
              { class: "btn sm", onclick: exportAppearance },
              "Export appearance\u2026"
            ),
            el(
              "button",
              {
                class: "btn sm",
                onclick: function () {
                  appIn.click();
                },
              },
              "Import appearance\u2026"
            ),
            appIn,
            el(
              "button",
              {
                class: "btn sm",
                onclick: function () {
                  openApp("migrate");
                },
              },
              "Migrate items\u2026"
            )
          ),
          el("div", { style: "height:6px" }),
          paste,
          el(
            "div",
            { class: "row", style: "margin-top:6px" },
            el(
              "button",
              {
                class: "btn sm",
                onclick: function () {
                  if (paste.value.trim()) {
                    tryRestore(paste.value, false);
                    paste.value = "";
                  } else paste.focus();
                },
              },
              "Restore pasted text"
            ),
            el(
              "button",
              {
                class: "btn sm",
                onclick: function () {
                  if (paste.value.trim()) {
                    tryRestore(paste.value, true);
                    paste.value = "";
                  } else paste.focus();
                },
              },
              "Merge pasted text"
            ),
            el(
              "button",
              { class: "btn sm", onclick: autoBackup },
              "Recover last restore point"
            )
          ),
          el(
            "div",
            { class: "dim", style: "padding:6px 0 0" },
            "Replace clears everything and loads the backup. Merge keeps your current data and adds anything new from the backup. Appearance exports carry your theme, icons, cursors and wallpaper."
          )
        ),
        displayBox,
        aiBox,
        iconsBox,
        updBox,
        deskBox,
        aboutBox,
        el(
          "fieldset",
          null,
          el("legend", null, "Danger zone"),
          el(
            "button",
            {
              class: "btn",
              onclick: function () {
                msgBox({
                  title: "Erase All Data",
                  icon: "warn",
                  text: "Erase everything in FocusDesk 96?\nCalendar, notes, reminders, assignments, cards and stats will be deleted.\nThis cannot be undone.",
                  buttons: [
                    {
                      label: "Erase",
                      fn: function () {
                        clearWall();
                        applyData({});
                        msgBox({
                          title: "Erase All Data",
                          icon: "info",
                          text: "All data erased.",
                        });
                      },
                    },
                    { label: "Cancel" },
                  ],
                });
              },
            },
            "Erase all data\u2026"
          )
        ),
        el(
          "div",
          { class: "cp-footer" },
          el(
            "div",
            { class: "cp-footer-text" },
            el(
              "div",
              { class: "cp-footer-title" },
              "\u00A9 " +
                new Date().getFullYear() +
                " Apoji Delegraphics. All rights reserved."
            ),
            el(
              "div",
              { class: "cp-footer-sub" },
              "FocusDesk 96 \u2014 Version " + VERSION
            ),
            el(
              "div",
              { class: "cp-footer-sub" },
              "Designed by Apoji Studios  \u00b7  Engineered by Apoji Delegraphics"
            ),
            el(
              "div",
              { class: "cp-footer-sub" },
              "Made with care for students everywhere."
            )
          ),
          makeApojiLogo("cp-footer-logo")
        )
      )
    );
    w.refresh = draw;
    draw();
  }

  /* ================= APP: TODAY ================= */
  function appToday(w) {
    var box = el("div", { class: "sunk today" });
    w.body.append(
      el(
        "div",
        { class: "col", style: "flex:1;min-height:0;padding:6px;gap:6px" },
        box,
        el(
          "div",
          { class: "row", style: "gap:4px;flex-wrap:wrap" },
          el(
            "button",
            {
              class: "btn sm",
              onclick: function () {
                openApp("tasks");
              },
            },
            "Tasks"
          ),
          el(
            "button",
            {
              class: "btn sm",
              onclick: function () {
                openApp("calendar");
              },
            },
            "Calendar"
          ),
          el(
            "button",
            {
              class: "btn sm",
              onclick: function () {
                openApp("timer");
              },
            },
            "Start focusing"
          )
        )
      )
    );
    var SECTION_DEFS = [
      ["schedule", "Schedule"],
      ["reminders", "Reminders"],
      ["overdue", "Overdue"],
      ["due", "Due this week"],
      ["exams", "Exams"],
      ["tasks", "Tasks"],
      ["habits", "Habits"],
      ["countdowns", "Countdowns"],
      ["focus", "Focus"],
    ];
    function todayOrder() {
      var want = S.prefs.todayOrder;
      if (!Array.isArray(want) || !want.length)
        return SECTION_DEFS.map(function (d) {
          return d[0];
        });
      var have = want.filter(function (k) {
        return SECTION_DEFS.some(function (d) {
          return d[0] === k;
        });
      });
      SECTION_DEFS.forEach(function (d) {
        if (have.indexOf(d[0]) < 0) have.push(d[0]);
      });
      return have;
    }
    function sec(id, title, rows, empty) {
      var wrap = el("div", { class: "today-sec", "data-sec": id });
      var head = el(
        "div",
        {
          class: "th",
          style: "cursor:move",
          title: "Drag to reorder",
          onpointerdown: function (e) {
            if (e.pointerType === "mouse" && e.button !== 0) return;
            var items = Array.prototype.slice.call(
              box.querySelectorAll(".today-sec")
            );
            var sy = e.clientY,
              moved = false;
            try {
              head.setPointerCapture(e.pointerId);
            } catch (x) {}
            function mv(ev) {
              if (Math.abs(ev.clientY - sy) < 6) return;
              moved = true;
              head.style.opacity = "0.6";
            }
            function up(ev) {
              head.removeEventListener("pointermove", mv);
              head.removeEventListener("pointerup", up);
              head.removeEventListener("pointercancel", up);
              head.style.opacity = "";
              if (!moved) return;
              var dropY = ev.clientY;
              var idx = 0;
              items.forEach(function (wi, i) {
                var r = wi.getBoundingClientRect();
                if (dropY > r.top + r.height / 2) idx = i + 1;
              });
              var order = items.map(function (wi) {
                return wi.getAttribute("data-sec");
              });
              var fromIdx = order.indexOf(id);
              if (fromIdx >= 0) order.splice(fromIdx, 1);
              if (idx > fromIdx) idx--;
              order.splice(Math.max(0, Math.min(order.length, idx)), 0, id);
              S.prefs.todayOrder = order;
              save();
              draw();
            }
            head.addEventListener("pointermove", mv);
            head.addEventListener("pointerup", up);
            head.addEventListener("pointercancel", up);
          },
        },
        title
      );
      wrap.append(head);
      if (!rows.length)
        wrap.append(
          el("div", { class: "dim", style: "padding:2px 8px 4px" }, empty)
        );
      rows.forEach(function (r) {
        wrap.append(
          el(
            "div",
            { class: "trow" },
            el("span", { class: "tw" }, r[0]),
            el("span", { class: "tt2" }, r[1])
          )
        );
      });
      box.append(wrap);
    }
    function draw() {
      box.textContent = "";
      var now = new Date(),
        td = ymd(now),
        ms = now.getTime();
      box.append(
        el(
          "div",
          { class: "thead" },
          DAYS[now.getDay()] +
            ", " +
            MONTHS[now.getMonth()] +
            " " +
            now.getDate() +
            ", " +
            now.getFullYear()
        )
      );
      var sched = S.events
        .filter(function (e) {
          return eventOnDate(e, td);
        })
        .map(function (e) {
          return { t: e.time || "", a: e.time || "All day", b: e.title };
        })
        .concat(
          classesOn(td).map(function (c) {
            return {
              t: c.start,
              a: c.start + " - " + c.end,
              b: c.name + (c.room ? " (" + c.room + ")" : ""),
            };
          })
        )
        .sort(function (a, b) {
          return a.t < b.t ? -1 : a.t > b.t ? 1 : 0;
        });
      var open = S.assign
        .filter(function (a) {
          return !a.done;
        })
        .sort(function (a, b) {
          return a.due - b.due;
        });
      var RANK = { high: 0, normal: 1, low: 2 };
      var SECTIONS = {
        schedule: function () {
          return [
            "Schedule",
            sched.map(function (x) {
              return [x.a, x.b];
            }),
            "Nothing on the calendar today.",
          ];
        },
        reminders: function () {
          return [
            "Reminders",
            S.reminders
              .filter(function (r) {
                return !r.done && ymd(new Date(r.at)) === td;
              })
              .sort(function (a, b) {
                return a.at - b.at;
              })
              .map(function (r) {
                return [fmt12(new Date(r.at)), r.text];
              }),
            "No reminders today.",
          ];
        },
        overdue: function () {
          return [
            "Overdue",
            open
              .filter(function (a) {
                return a.due < ms;
              })
              .slice(0, 5)
              .map(function (a) {
                return [
                  rel(a.due),
                  (a.course ? "[" + a.course + "] " : "") + a.title,
                ];
              }),
            "Nothing overdue.",
          ];
        },
        due: function () {
          return [
            "Due this week",
            open
              .filter(function (a) {
                return a.due >= ms && a.due < ms + 7 * 86400000;
              })
              .slice(0, 6)
              .map(function (a) {
                return [
                  whenStr(a.due, a.allDay),
                  (a.course ? "[" + a.course + "] " : "") + a.title,
                ];
              }),
            "Nothing due in the next 7 days.",
          ];
        },
        exams: function () {
          var ex = S.events
            .filter(function (e) {
              return e.kind === "exam" && e.date >= td;
            })
            .sort(function (a, b) {
              return a.date < b.date ? -1 : 1;
            })
            .slice(0, 4);
          return [
            "Exams",
            ex.map(function (e) {
              var n = Math.round(
                (new Date(e.date + "T00:00") - new Date(td + "T00:00")) /
                  86400000
              );
              return [
                n === 0 ? "Today" : n === 1 ? "Tomorrow" : "In " + n + " days",
                e.title,
              ];
            }),
            "No exams on the calendar.",
          ];
        },
        tasks: function () {
          var tk = S.tasks
            .filter(function (t) {
              return !t.done;
            })
            .sort(function (a, b) {
              var ad = a.due == null ? Infinity : a.due,
                bd = b.due == null ? Infinity : b.due;
              return ad !== bd ? (ad < bd ? -1 : 1) : RANK[a.pri] - RANK[b.pri];
            })
            .slice(0, 6);
          return [
            "Tasks",
            tk.map(function (t) {
              return [
                t.due != null
                  ? whenStr(t.due, true)
                  : t.pri === "high"
                  ? "High priority"
                  : "",
                t.text,
              ];
            }),
            "No open tasks.",
          ];
        },
        habits: function () {
          if (!S.habits.length) return null;
          return [
            "Habits",
            S.habits.map(function (h) {
              var v = h.log[td];
              var note = isObj(v) && v.note ? " (" + v.note + ")" : "";
              return [v ? "Done" + note : "To do", h.name];
            }),
            "",
          ];
        },
        countdowns: function () {
          var cds = S.countdowns
            .map(function (c) {
              return {
                c: c,
                n: Math.round(
                  (new Date(c.date + "T00:00") - new Date(td + "T00:00")) /
                    86400000
                ),
              };
            })
            .filter(function (x) {
              return x.n >= 0 && x.n <= 90;
            })
            .sort(function (a, b) {
              return a.n - b.n;
            })
            .slice(0, 3);
          if (!cds.length) return null;
          return [
            "Countdowns",
            cds.map(function (x) {
              return [
                x.n === 0
                  ? "Today"
                  : x.n === 1
                  ? "Tomorrow"
                  : "In " + x.n + " days",
                x.c.name,
              ];
            }),
            "",
          ];
        },
        focus: function () {
          var st = S.stats[td] || { sessions: 0, minutes: 0 };
          return [
            "Focus",
            [
              [
                st.sessions + " session(s)",
                st.minutes + " minutes focused today",
              ],
              ["Streak", streak() + " day(s)"],
            ],
            "",
          ];
        },
      };
      todayOrder().forEach(function (id) {
        var fn = SECTIONS[id];
        if (!fn) return;
        var r = fn();
        if (!r) return;
        sec(id, r[0], r[1], r[2]);
      });
    }
    w.refresh = draw;
    draw();
  }
  setInterval(function () {
    if (wins.today && !wins.today.min) wins.today.refresh();
  }, 30000);

  /* ================= APP: TASKS ================= */
  function appTasks(w) {
    var lastSelTask = null;
    var txt = el("input", {
      class: "in",
      placeholder: "New task…",
      style: "flex:1 1 150px",
    });
    var pri = el(
      "select",
      { class: "in" },
      [
        ["normal", "Normal"],
        ["high", "High"],
        ["low", "Low"],
      ].map(function (p) {
        return el("option", { value: p[0] }, p[1]);
      })
    );
    var due = el("input", {
      class: "in",
      type: "date",
      style: "width:130px",
      title: "Optional due date",
    });
    var repSel = el(
      "select",
      {
        class: "in",
        title: "Repeat",
        onchange: function () {
          if (this.value !== "none" && !due.value) due.value = ymd(new Date());
        },
      },
      REPEATS.map(function (r) {
        return el("option", { value: r[0] }, r[1]);
      })
    );
    var showDone = el("input", {
      type: "checkbox",
      onchange: function () {
        draw();
      },
    });
    var list = el("div", { class: "sunk list" });
    function addT() {
      var v = txt.value.trim();
      if (!v) {
        txt.focus();
        return;
      }
      var ms = due.value ? new Date(due.value + "T23:59").getTime() : null;
      S.tasks.push({
        id: uid(),
        text: clip(v, 300),
        done: false,
        pri: pri.value,
        due: isNum(ms) ? ms : null,
        created: Date.now(),
        repeat: repSel.value || "none",
      });
      txt.value = "";
      save();
      refreshAll();
    }
    function rollTask(t) {
      if (!t.repeat || t.repeat === "none" || t.due == null) return;
      var d = new Date(t.due),
        now = Date.now();
      do {
        if (t.repeat === "daily") d.setDate(d.getDate() + 1);
        else if (t.repeat === "weekdays") {
          do {
            d.setDate(d.getDate() + 1);
          } while (d.getDay() === 0 || d.getDay() === 6);
        } else if (t.repeat === "weekly") d.setDate(d.getDate() + 7);
        else if (t.repeat === "biweekly") d.setDate(d.getDate() + 14);
        else if (t.repeat === "monthly") d.setMonth(d.getMonth() + 1);
        else break;
      } while (d.getTime() <= now);
      S.tasks.push({
        id: uid(),
        text: t.text,
        done: false,
        pri: t.pri,
        due: d.getTime(),
        created: Date.now(),
        repeat: t.repeat,
      });
    }
    onEnter(txt, addT);
    w.body.append(
      el(
        "div",
        { class: "row form" },
        txt,
        pri,
        due,
        repSel,
        el("button", { class: "btn sm", onclick: addT }, "Add")
      ),
      el(
        "div",
        { class: "row form", style: "padding-top:0" },
        el(
          "label",
          { style: "display:flex;align-items:center" },
          showDone,
          "Show completed"
        ),
        el(
          "button",
          {
            class: "btn sm",
            style: "margin-left:auto",
            onclick: function () {
              softDelete("tasks", function (t) {
                return t.done;
              });
            },
          },
          "Clear completed"
        )
      ),
      list
    );
    var RANK = { high: 0, normal: 1, low: 2 };
    function draw() {
      list.textContent = "";
      var sel = {};
      var rows = S.tasks
        .filter(function (t) {
          return showDone.checked || !t.done;
        })
        .sort(function (a, b) {
          if (a.done !== b.done) return a.done ? 1 : -1;
          var ad = a.due == null ? Infinity : a.due,
            bd = b.due == null ? Infinity : b.due;
          if (ad !== bd) return ad < bd ? -1 : 1;
          return RANK[a.pri] - RANK[b.pri] || a.created - b.created;
        });
      if (!rows.length)
        list.append(
          el("div", { class: "dim" }, "Nothing to do. Add a task above.")
        );
      rows.forEach(function (t) {
        var over = !t.done && t.due != null && t.due < Date.now();
        var row = el(
          "div",
          {
            class: "lrow" + (t.done ? " done" : "") + (over ? " over" : ""),
            "data-id": t.id,
            style: "cursor:default",
            onclick: function (e) {
              if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON")
                return;
              if (e.shiftKey && lastSelTask) {
                var startIdx = rows.indexOf(lastSelTask),
                  endIdx = rows.indexOf(t);
                var lo = Math.min(startIdx, endIdx),
                  hi = Math.max(startIdx, endIdx);
                for (var i = lo; i <= hi; i++) sel[rows[i].id] = 1;
              } else if (e.ctrlKey || e.metaKey) {
                sel[t.id] = sel[t.id] ? 0 : 1;
                lastSelTask = t;
              } else {
                var only = Object.keys(sel).filter(function (k) {
                  return sel[k];
                });
                if (only.length === 1 && only[0] === t.id) {
                  sel = {};
                  lastSelTask = null;
                } else {
                  sel = {};
                  sel[t.id] = 1;
                  lastSelTask = t;
                }
              }
              paintSel();
            },
          },
          el("input", {
            type: "checkbox",
            checked: t.done,
            "aria-label": "Done",
            onchange: function () {
              var was = t.done;
              t.done = this.checked;
              if (t.done && !was) rollTask(t);
              save();
              refreshAll();
            },
          }),
          t.pri !== "normal"
            ? el(
                "span",
                {
                  class: "tag",
                  style:
                    "background:" + (t.pri === "high" ? "#c00000" : "#808080"),
                },
                t.pri === "high" ? "High" : "Low"
              )
            : null,
          el(
            "span",
            { class: "t" },
            t.text + (t.repeat && t.repeat !== "none" ? " \u21bb" : "")
          ),
          t.due != null
            ? el(
                "span",
                { class: "w" },
                whenStr(t.due, true) + (t.done ? "" : " (" + rel(t.due) + ")")
              )
            : null,
          el(
            "button",
            {
              class: "btn xs",
              "aria-label": "Delete",
              onclick: function (e) {
                e.stopPropagation();
                var ids = Object.keys(sel).filter(function (k) {
                  return sel[k];
                });
                if (ids.indexOf(t.id) < 0) ids = [t.id];
                softDelete("tasks", function (x) {
                  return ids.indexOf(x.id) >= 0;
                });
                sel = {};
                lastSelTask = null;
              },
            },
            "X"
          )
        );
        list.append(row);
      });
      function paintSel() {
        var isGrey = document.documentElement.classList.contains("grey");
        list.querySelectorAll(".lrow").forEach(function (r) {
          r.style.background = sel[r.getAttribute("data-id")]
            ? isGrey
              ? "#3a3a5a"
              : "#d8d8ff"
            : "";
        });
        var count = Object.keys(sel).filter(function (k) {
          return sel[k];
        }).length;
        if (count > 0)
          w.status(
            count +
              " selected \u2014 shift-click for range, ctrl-click to toggle"
          );
        else
          w.status(
            S.tasks.filter(function (t) {
              return !t.done;
            }).length + " open task(s)"
          );
      }
    }
    w.refresh = draw;
    draw();
  }

  /* ================= APP: GRADES ================= */
  function letterOf(p) {
    var T2 = [
      [97, "A+", 4],
      [93, "A", 4],
      [90, "A-", 3.7],
      [87, "B+", 3.3],
      [83, "B", 3],
      [80, "B-", 2.7],
      [77, "C+", 2.3],
      [73, "C", 2],
      [70, "C-", 1.7],
      [67, "D+", 1.3],
      [63, "D", 1],
      [60, "D-", 0.7],
    ];
    for (var i = 0; i < T2.length; i++)
      if (p >= T2[i][0]) return { l: T2[i][1], g: T2[i][2] };
    return { l: "F", g: 0 };
  }
  function parseScore(str) {
    str = String(str || "")
      .trim()
      .replace(/%$/, "")
      .trim();
    if (!str) return null;
    var m = str.match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/);
    if (m) {
      var b = parseFloat(m[2]);
      return b > 0
        ? Math.max(0, Math.min(300, (parseFloat(m[1]) / b) * 100))
        : null;
    }
    var v = parseFloat(str);
    return isFinite(v) ? Math.max(0, Math.min(300, v)) : null;
  }
  function gradeOf(g) {
    if (g.mode === "points") {
      var E = 0,
        Pg = 0,
        Pt = 0;
      g.items.forEach(function (i) {
        Pt += i.pts;
        if (i.earned != null) {
          E += i.earned;
          Pg += i.pts;
        }
      });
      return {
        mode: "points",
        current: Pg > 0 ? (E / Pg) * 100 : null,
        gradedW: Pg,
        remaining: Math.max(0, Pt - Pg),
        earned: E,
        total: Pt,
      };
    }
    var gw = 0,
      pts = 0,
      tw = 0;
    g.items.forEach(function (i) {
      tw += i.weight;
      if (i.score != null) {
        gw += i.weight;
        pts += (i.score * i.weight) / 100;
      }
    });
    return {
      mode: "weighted",
      current: gw > 0 ? (pts / gw) * 100 : null,
      gradedW: gw,
      remaining: Math.max(0, Math.max(100, tw) - gw),
      points: pts,
    };
  }
  function needFor(r, target) {
    if (r.remaining <= 0) return null;
    if (r.mode === "points")
      return (((target / 100) * r.total - r.earned) / r.remaining) * 100;
    return (target - r.points) / (r.remaining / 100);
  }
  function evenWeights(g) {
    var n = g.items.length;
    if (!n) return;
    var base = Math.floor(1000 / n) / 10;
    g.items.forEach(function (i) {
      i.weight = base;
    });
    g.items[n - 1].weight = Math.round((base + (100 - base * n)) * 10) / 10;
  }
  function setWeightsPreset(g, defs) {
    var existing = g.items,
      byName = {};
    existing.forEach(function (x) {
      byName[(x.name || "").toLowerCase().trim()] = x;
    });
    var next = [];
    defs.forEach(function (d, i) {
      var e0 = byName[d[0].toLowerCase()] || existing[i];
      if (e0) {
        e0.name = e0.name || d[0];
        e0.weight = d[1];
        next.push(e0);
      } else next.push({ id: uid(), name: d[0], cid: "", weight: d[1], score: null, raw: "", pts: 0, earned: null });
    });
    existing.forEach(function (x) {
      if (next.indexOf(x) < 0) next.push(x);
    });
    g.items = next;
  }
  function canvasCourseMap() {
    var m = {};
    S.assign.forEach(function (a) {
      if (a.course) (m[a.course] = m[a.course] || []).push(a);
    });
    return m;
  }
  function canvasPending() {
    var map = canvasCourseMap(),
      n = 0;
    Object.keys(map).forEach(function (code) {
      var g = S.grades.filter(function (x) {
        return x.canvas === code;
      })[0];
      if (!g) {
        n++;
        return;
      }
      var have = {};
      g.items.forEach(function (i) {
        if (i.cid) have[i.cid] = 1;
      });
      if (
        map[code].some(function (a) {
          return !have[a.uid];
        })
      )
        n++;
    });
    return n;
  }
  function syncCanvas() {
    var map = canvasCourseMap(),
      courses = 0,
      items = 0;
    Object.keys(map)
      .sort()
      .forEach(function (code) {
        var list = map[code].slice().sort(function (a, b) {
          return a.due - b.due;
        });
        var g = S.grades.filter(function (x) {
            return x.canvas === code;
          })[0],
          fresh = !g;
        if (fresh) {
          g = {
            id: uid(),
            name: clip(code, 60),
            canvas: code,
            mode: "weighted",
            credits: 3,
            items: [],
          };
          S.grades.push(g);
          courses++;
        }
        var have = {};
        g.items.forEach(function (i) {
          if (i.cid) have[i.cid] = 1;
        });
        var added = 0;
        list.forEach(function (a) {
          if (have[a.uid] || g.items.length >= 200) return;
          g.items.push({
            id: uid(),
            name: clip(a.title, 80),
            cid: a.uid,
            weight: 0,
            score: null,
            raw: "",
            pts: 0,
            earned: null,
          });
          added++;
        });
        items += added;
        if (fresh) evenWeights(g);
      });
    S.grades = S.grades.slice(0, 30);
    save();
    return { courses: courses, items: items };
  }
  function markDone(cid) {
    if (!cid) return;
    var a = S.assign.filter(function (x) {
      return x.uid === cid;
    })[0];
    if (a && !a.done) {
      a.done = true;
      save();
      refreshAll();
    }
  }
  function appGrades(w) {
    var cur = S.grades.length ? S.grades[0].id : null,
      target = 90,
      wiX = null;
    function find() {
      return S.grades.filter(function (g) {
        return g.id === cur;
      })[0];
    }
    var sel = el("select", {
      class: "in",
      style: "flex:1 1 150px",
      onchange: function () {
        cur = this.value;
        drawBody();
      },
    });
    var credits = el("input", {
      class: "in",
      type: "number",
      min: "0",
      max: "12",
      step: "0.5",
      style: "width:58px",
      title: "Credit hours",
      oninput: function () {
        var g = find();
        if (!g) return;
        var v = parseFloat(this.value);
        g.credits = isNum(v) ? Math.max(0, Math.min(12, v)) : 3;
        save();
        drawSummary();
      },
    });
    var modeSel = el(
      "select",
      {
        class: "in",
        title: "How this course is graded",
        onchange: function () {
          var g = find();
          if (!g) return;
          g.mode = this.value;
          save();
          drawBody();
        },
      },
      [
        ["weighted", "Weighted (percent categories)"],
        ["points", "Total points"],
      ].map(function (o) {
        return el("option", { value: o[0] }, o[1]);
      })
    );
    var hint = el("span", { class: "gr-hint" });
    var syncBtn = el(
      "button",
      {
        class: "btn sm",
        onclick: function () {
          if (!Object.keys(canvasCourseMap()).length) {
            msgBox({
              title: "Calendar Link",
              icon: "info",
              text: "No imported classes found yet.\n\nOpen Calendar Link and import your .ics file first.",
            });
            return;
          }
          var r = syncCanvas();
          var first = S.grades.filter(function (g) {
            return g.canvas;
          })[0];
          if (!cur && first) cur = first.id;
          fillSel();
          drawBody();
          msgBox({
            title: "Calendar Link",
            icon: "info",
            text:
              r.courses || r.items
                ? r.courses +
                  " class(es) added and " +
                  r.items +
                  " assignment(s) added."
                : "Everything is already here.",
          });
        },
      },
      "Sync with imports"
    );
    var rowsBox = el("div", { class: "sunk gr-rows" });
    var summary = el("div", { class: "sunk gr-sum" });
    function fillSel() {
      sel.textContent = "";
      S.grades.forEach(function (g) {
        var r = gradeOf(g);
        sel.append(
          el(
            "option",
            { value: g.id },
            g.name +
              (g.canvas ? " [" + g.canvas + "]" : "") +
              (r.current != null ? "  (" + r.current.toFixed(1) + "%)" : "")
          )
        );
      });
      if (cur && find()) sel.value = cur;
      else {
        cur = S.grades.length ? S.grades[0].id : null;
        if (cur) sel.value = cur;
      }
      var n = canvasPending();
      hint.textContent = n ? n + " imported class(es) ready to sync" : "";
    }
    function drawBody() {
      var g = find();
      rowsBox.textContent = "";
      if (!g) {
        rowsBox.append(
          el(
            "div",
            { class: "dim" },
            canvasPending()
              ? "Your imported classes are ready. Click Sync with imports to add them."
              : "No courses yet. Click New Course, or import assignments from Calendar Link."
          )
        );
        credits.value = "";
        credits.disabled = true;
        modeSel.disabled = true;
        drawSummary();
        return;
      }
      credits.disabled = false;
      modeSel.disabled = false;
      credits.value = g.credits;
      modeSel.value = g.mode;
      var pm = g.mode === "points";
      rowsBox.append(
        el(
          "div",
          { class: "gr-row gr-hd" },
          el("span", { style: "flex:1" }, "Item"),
          el("span", { style: "width:66px" }, pm ? "Earned" : "Weight %"),
          el(
            "span",
            { style: "width:" + (pm ? 66 : 76) + "px" },
            pm ? "Out of" : "Score"
          ),
          el("span", { style: "width:22px" })
        )
      );
      g.items.forEach(function (it) {
        var f1, f2;
        if (pm) {
          f1 = el("input", {
            class: "in",
            type: "number",
            min: "0",
            step: "any",
            value: it.earned == null ? "" : it.earned,
            placeholder: "--",
            style: "width:66px",
            oninput: function () {
              var v = parseFloat(this.value);
              it.earned =
                this.value.trim() === "" || !isNum(v) ? null : Math.max(0, v);
              if (it.earned != null) markDone(it.cid);
              save();
              drawSummary();
            },
          });
          f2 = el("input", {
            class: "in",
            type: "number",
            min: "0",
            step: "any",
            value: it.pts || "",
            placeholder: "pts",
            style: "width:66px",
            oninput: function () {
              var v = parseFloat(this.value);
              it.pts = isNum(v) ? Math.max(0, v) : 0;
              save();
              drawSummary();
            },
          });
        } else {
          f1 = el("input", {
            class: "in",
            type: "number",
            min: "0",
            max: "100",
            step: "any",
            value: it.weight,
            style: "width:66px",
            oninput: function () {
              var v = parseFloat(this.value);
              it.weight = isNum(v) ? Math.max(0, Math.min(100, v)) : 0;
              save();
              drawSummary();
            },
          });
          f2 = el("input", {
            class: "in",
            value:
              it.raw ||
              (it.score != null ? String(Math.round(it.score * 10) / 10) : ""),
            placeholder: "92 or 45/50",
            style: "width:76px",
            oninput: function () {
              it.raw = clip(this.value, 20);
              it.score = parseScore(this.value);
              if (it.score != null) markDone(it.cid);
              save();
              drawSummary();
            },
          });
        }
        rowsBox.append(
          el(
            "div",
            { class: "gr-row" },
            el("input", {
              class: "in",
              value: it.name,
              placeholder: "e.g. Midterm",
              title: it.cid ? "Imported" : "",
              style: "flex:1",
              oninput: function () {
                it.name = clip(this.value, 80);
                save();
              },
            }),
            f1,
            f2,
            el(
              "button",
              {
                class: "btn xs",
                "aria-label": "Remove item",
                onclick: function () {
                  g.items = g.items.filter(function (x) {
                    return x.id !== it.id;
                  });
                  save();
                  drawBody();
                },
              },
              "X"
            )
          )
        );
      });
      var wsetInput = el("input", {
        class: "in",
        type: "number",
        min: "0",
        max: "100",
        step: "any",
        placeholder: "10",
        style: "width:50px;padding:1px 3px",
      });
      var presetRow = pm
        ? null
        : el(
            "span",
            { class: "row", style: "gap:4px;flex-wrap:wrap" },
            el(
              "button",
              {
                class: "btn sm",
                title: "Split 100% evenly across all items",
                onclick: function () {
                  evenWeights(g);
                  save();
                  drawBody();
                },
              },
              "Even"
            ),
            el(
              "button",
              {
                class: "btn sm",
                onclick: function () {
                  setWeightsPreset(g, [
                    ["Homework", 20],
                    ["Midterm", 25],
                    ["Project", 25],
                    ["Final Exam", 30],
                  ]);
                  save();
                  drawBody();
                },
              },
              "20/25/25/30"
            ),
            el(
              "button",
              {
                class: "btn sm",
                onclick: function () {
                  setWeightsPreset(g, [
                    ["Homework", 30],
                    ["Quizzes", 20],
                    ["Midterm", 20],
                    ["Final Exam", 30],
                  ]);
                  save();
                  drawBody();
                },
              },
              "30/20/20/30"
            ),
            el(
              "span",
              { class: "gr-wset" },
              "set all to",
              wsetInput,
              "%",
              el(
                "button",
                {
                  class: "btn sm",
                  onclick: function () {
                    var v = parseFloat(wsetInput.value);
                    if (!isNum(v)) {
                      wsetInput.focus();
                      return;
                    }
                    v = Math.max(0, Math.min(100, v));
                    g.items.forEach(function (i) {
                      i.weight = v;
                    });
                    save();
                    drawBody();
                  },
                },
                "Go"
              )
            )
          );
      rowsBox.append(
        el(
          "div",
          { class: "row", style: "gap:6px;margin-top:6px;flex-wrap:wrap" },
          el(
            "button",
            {
              class: "btn sm",
              onclick: function () {
                if (g.items.length >= 200) return;
                g.items.push({
                  id: uid(),
                  name: "",
                  cid: "",
                  weight: 0,
                  score: null,
                  raw: "",
                  pts: 0,
                  earned: null,
                });
                save();
                drawBody();
              },
            },
            "Add item"
          ),
          presetRow
        )
      );
      drawSummary();
    }
    function projectFinal(x, X) {
      var r = gradeOf(x);
      if (r.mode === "points")
        return r.total > 0 ? ((r.earned + (X / 100) * r.remaining) / r.total) * 100 : null;
      var tot = r.gradedW + r.remaining;
      return tot > 0 ? ((r.points + (X * r.remaining) / 100) / tot) * 100 : null;
    }
    function projGPA(X) {
      var tc = 0,
        tg = 0;
      S.grades.forEach(function (x) {
        var r = gradeOf(x);
        if (r.current == null || !(x.credits > 0)) return;
        var f = projectFinal(x, X == null ? r.current : X);
        if (f == null) return;
        tc += x.credits;
        tg += letterOf(f).g * x.credits;
      });
      return tc ? tg / tc : null;
    }
    function whatIfPanel(g) {
      var r = gradeOf(g);
      if (r.current == null) return;
      var out1 = el("div"),
        out2 = el("div", { style: "margin-top:2px" }),
        lab = el("b", { style: "width:40px;text-align:right" });
      var slider = el("input", {
        type: "range",
        min: "0",
        max: "100",
        step: "1",
        value: String(wiX == null ? Math.round(Math.min(100, r.current)) : wiX),
        style: "flex:1",
        "aria-label": "Average score on the remaining work",
        oninput: function () {
          wiX = +this.value;
          upd();
        },
      });
      function fmt(n) {
        return n == null ? "\u2014" : n.toFixed(2);
      }
      function upd() {
        var X = wiX == null ? r.current : wiX;
        lab.textContent = Math.round(X) + "%";
        if (r.remaining > 0) {
          var f = projectFinal(g, X);
          out1.textContent = "Average " + Math.round(X) + "% on the rest and " + g.name + " finishes at " + f.toFixed(1) + "% (" + letterOf(f).l + ").";
        } else out1.textContent = "Everything in this course is already graded.";
        out2.textContent = "Semester GPA: best " + fmt(projGPA(100)) + " (100% on the rest) \u00b7 likely " + fmt(projGPA(wiX)) + (wiX == null ? " (keeping your averages)" : "") + " \u00b7 worst " + fmt(projGPA(60)) + " (60% on the rest)";
      }
      summary.append(
        el(
          "div",
          { style: "margin-top:6px;border-top:1px solid #c0c0c0;padding-top:4px" },
          el("div", { style: "font-weight:bold" }, "What if\u2026"),
          el("div", { class: "row", style: "gap:6px;align-items:center" }, "Rest of the work:", slider, lab, el("button", { class: "btn xs", onclick: function () { wiX = null; slider.value = String(Math.round(Math.min(100, r.current))); upd(); } }, "Reset")),
          out1,
          out2
        )
      );
      upd();
    }
    function drawSummary() {
      summary.textContent = "";
      var g = find();
      if (!g) {
        summary.append(
          el(
            "div",
            { class: "dim", style: "padding:0" },
            "Add a course to see your grade."
          )
        );
        return;
      }
      var r = gradeOf(g);
      var opt = sel.options[sel.selectedIndex];
      if (opt)
        opt.textContent =
          g.name +
          (g.canvas ? " [" + g.canvas + "]" : "") +
          (r.current != null ? "  (" + r.current.toFixed(1) + "%)" : "");
      if (r.mode === "weighted") {
        var tw = 0;
        g.items.forEach(function (i) {
          tw += i.weight;
        });
        if (Math.abs(tw - 100) > 0.05)
          summary.append(
            el(
              "div",
              { style: "color:#800000" },
              "Weights add up to " + Math.round(tw * 10) / 10 + "%, not 100%."
            )
          );
      }
      if (r.current == null)
        summary.append(
          el("div", null, "Enter at least one score to see your current grade.")
        );
      else {
        var L = letterOf(r.current);
        summary.append(
          el(
            "div",
            null,
            "Current grade: ",
            el("b", null, r.current.toFixed(1) + "%  " + L.l),
            r.mode === "points"
              ? "  (" +
                  Math.round(r.earned * 100) / 100 +
                  " of " +
                  Math.round(r.gradedW * 100) / 100 +
                  " graded points)"
              : "  (on " + r.gradedW.toFixed(0) + "% of the course so far)"
          )
        );
      }
      if (r.remaining > 0 && r.current != null) {
        summary.append(
          el(
            "div",
            { style: "margin-top:4px;font-weight:bold" },
            "Score needed on the rest (" +
              (r.mode === "points"
                ? Math.round(r.remaining * 100) / 100 + " points"
                : r.remaining.toFixed(0) + "%") +
              "):"
          )
        );
        [
          [90, "A"],
          [80, "B"],
          [70, "C"],
        ].forEach(function (t2) {
          summary.append(
            el(
              "div",
              null,
              "For a " +
                t2[1] +
                " (" +
                t2[0] +
                "%): " +
                needTxt(needFor(r, t2[0]))
            )
          );
        });
        var tIn2 = el("input", {
          class: "in",
          type: "number",
          min: "0",
          max: "100",
          value: target,
          style: "width:56px",
          oninput: function () {
            var v = parseFloat(this.value);
            target = isNum(v) ? v : 90;
            out.textContent = needTxt(needFor(r, target));
          },
        });
        var out = el("b", null, needTxt(needFor(r, target)));
        summary.append(
          el(
            "div",
            { class: "row", style: "gap:6px;align-items:center" },
            "Or a custom goal of",
            tIn2,
            "%: ",
            out
          )
        );
      } else if (r.current != null)
        summary.append(el("div", null, "Everything is graded."));
      var tc = 0,
        tgp = 0;
      S.grades.forEach(function (x) {
        var rr = gradeOf(x);
        if (rr.current != null && x.credits > 0) {
          tc += x.credits;
          tgp += letterOf(rr.current).g * x.credits;
        }
      });
      if (tc > 0)
        summary.append(
          el(
            "div",
            {
              style:
                "margin-top:6px;border-top:1px solid #c0c0c0;padding-top:4px",
            },
            "Overall GPA (current grades): ",
            el("b", null, (tgp / tc).toFixed(2))
          )
        );
      whatIfPanel(g);
      var bars = [];
      S.grades.forEach(function (x) {
        var rr = gradeOf(x);
        if (rr.current != null) bars.push({ name: x.name, grade: rr.current });
      });
      if (bars.length) {
        bars.sort(function (a, b) {
          return b.grade - a.grade;
        });
        var barBox = el("div", {
          style: "margin-top:6px;border-top:1px solid #c0c0c0;padding-top:6px",
        });
        barBox.append(
          el(
            "div",
            { style: "font-weight:bold;margin-bottom:4px" },
            "Current grade by course"
          )
        );
        bars.forEach(function (b) {
          var pct = Math.max(0, Math.min(100, b.grade));
          var col =
            pct >= 90
              ? "#006000"
              : pct >= 80
              ? "#000080"
              : pct >= 70
              ? "#806000"
              : "#800000";
          barBox.append(
            el(
              "div",
              {
                class: "row",
                style:
                  "gap:6px;align-items:center;padding:1px 0;font-size:11px",
              },
              el(
                "span",
                {
                  style:
                    "width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap",
                },
                b.name
              ),
              el(
                "div",
                {
                  style:
                    "flex:1;height:10px;background:#e8e8e8;position:relative",
                },
                el("i", {
                  style:
                    "display:block;height:100%;width:" +
                    pct +
                    "%;background:" +
                    col,
                })
              ),
              el(
                "span",
                { style: "width:44px;text-align:right;font-weight:bold" },
                b.grade.toFixed(1) + "%"
              )
            )
          );
        });
        summary.append(barBox);
      }
    }
    function needTxt(n) {
      if (n == null) return "nothing left to grade";
      if (n <= 0) return "already secured";
      if (n > 100)
        return Math.round(n) + "% (out of reach without extra credit)";
      return Math.round(n * 10) / 10 + "%";
    }
    var top = el(
      "div",
      { class: "row form", style: "padding-bottom:0" },
      sel,
      el("span", null, "Credits:"),
      credits
    );
    var top2 = el(
      "div",
      { class: "row gr-bar" },
      el(
        "button",
        {
          class: "btn sm",
          onclick: function () {
            askText("New Course", "Course name:", "", function (v) {
              var g = {
                id: uid(),
                name: clip(v, 60),
                canvas: "",
                mode: "weighted",
                credits: 3,
                items: [
                  {
                    id: uid(),
                    name: "Homework",
                    cid: "",
                    weight: 20,
                    score: null,
                    raw: "",
                    pts: 0,
                    earned: null,
                  },
                  {
                    id: uid(),
                    name: "Midterm",
                    cid: "",
                    weight: 25,
                    score: null,
                    raw: "",
                    pts: 0,
                    earned: null,
                  },
                  {
                    id: uid(),
                    name: "Project",
                    cid: "",
                    weight: 25,
                    score: null,
                    raw: "",
                    pts: 0,
                    earned: null,
                  },
                  {
                    id: uid(),
                    name: "Final Exam",
                    cid: "",
                    weight: 30,
                    score: null,
                    raw: "",
                    pts: 0,
                    earned: null,
                  },
                ],
              };
              S.grades.push(g);
              cur = g.id;
              save();
              fillSel();
              drawBody();
            });
          },
        },
        "New Course"
      ),
      syncBtn,
      el(
        "button",
        {
          class: "btn sm",
          onclick: function () {
            var g = find();
            if (!g) return;
            askText("Rename Course", "Course name:", g.name, function (v) {
              g.name = clip(v, 60);
              save();
              fillSel();
              drawSummary();
            });
          },
        },
        "Rename"
      ),
      el(
        "button",
        {
          class: "btn sm",
          onclick: function () {
            var g = find();
            if (!g) return;
            msgBox({
              title: "Delete Course",
              icon: "q",
              text:
                'Move "' +
                g.name +
                '" and all of its grades to the Recycle Bin?',
              buttons: [
                {
                  label: "Yes",
                  fn: function () {
                    softDelete("grades", function (x) {
                      return x.id === g.id;
                    });
                    cur = S.grades.length ? S.grades[0].id : null;
                    save();
                    fillSel();
                    drawBody();
                  },
                },
                { label: "No" },
              ],
            });
          },
        },
        "Delete"
      ),
      modeSel,
      hint
    );
    w.body.append(
      el(
        "div",
        { class: "col", style: "flex:1;min-height:0;overflow:auto" },
        top,
        top2,
        el(
          "div",
          { class: "col", style: "padding:6px;gap:6px;flex:1;min-height:0" },
          rowsBox,
          summary
        )
      )
    );
    w.refresh = function () {
      fillSel();
    };
    fillSel();
    drawBody();
  }

  /* ================= APP: CALCULATOR ================= */
  function appCalc(w) {
    var cur = "0",
      acc = null,
      op = null,
      fresh = true,
      mem = 0;
    var disp = el("div", { class: "sunk calc-disp" }, "0");
    var ind = el("div", { class: "calc-ind" });
    function show() {
      disp.textContent = cur.length > 16 ? cur.slice(0, 16) : cur;
      ind.textContent = mem !== 0 ? "M" : "";
    }
    function setCur(n) {
      cur = isFinite(n) ? String(parseFloat(n.toPrecision(12))) : "Error";
    }
    function val() {
      var v = parseFloat(cur);
      return isFinite(v) ? v : 0;
    }
    function clearAll() {
      cur = "0";
      acc = null;
      op = null;
      fresh = true;
      show();
    }
    function digit(d) {
      if (cur === "Error") clearAll();
      if (fresh) {
        cur = d === "." ? "0." : d;
        fresh = false;
      } else {
        if (d === "." && cur.indexOf(".") >= 0) return;
        if (cur === "0" && d !== ".") cur = d;
        else if (cur.replace(/[-.]/g, "").length < 14) cur += d;
      }
      show();
    }
    function compute(a, b, o) {
      if (o === "+") return a + b;
      if (o === "-") return a - b;
      if (o === "*") return a * b;
      if (o === "/") return b === 0 ? NaN : a / b;
      return b;
    }
    function doOp(o) {
      if (cur === "Error") return;
      var v = val();
      if (op !== null && !fresh) {
        acc = compute(acc, v, op);
        setCur(acc);
      } else acc = v;
      op = o;
      fresh = true;
      show();
    }
    function equals() {
      if (cur === "Error") return;
      if (op !== null) {
        acc = compute(acc, val(), op);
        setCur(acc);
        op = null;
        fresh = true;
      }
      show();
    }
    function unary(f) {
      if (cur === "Error") return;
      setCur(f(val()));
      fresh = true;
      show();
    }
    function back() {
      if (fresh || cur === "Error") return;
      cur = cur.length > 1 ? cur.slice(0, -1) : "0";
      if (cur === "-") cur = "0";
      show();
    }
    function neg() {
      if (cur === "Error" || cur === "0") return;
      cur = cur.charAt(0) === "-" ? cur.slice(1) : "-" + cur;
      show();
    }
    var KEYS = [
      ["Back", back, "k-m", 2],
      [
        "CE",
        function () {
          cur = "0";
          fresh = true;
          show();
        },
        "k-m",
        1,
      ],
      ["C", clearAll, "k-m", 2],
      [
        "MC",
        function () {
          mem = 0;
          show();
        },
        "k-m",
      ],
      [
        "7",
        function () {
          digit("7");
        },
        "k-n",
      ],
      [
        "8",
        function () {
          digit("8");
        },
        "k-n",
      ],
      [
        "9",
        function () {
          digit("9");
        },
        "k-n",
      ],
      [
        "/",
        function () {
          doOp("/");
        },
        "k-o",
      ],
      [
        "sqrt",
        function () {
          unary(function (v) {
            return v < 0 ? NaN : Math.sqrt(v);
          });
        },
        "k-n",
      ],
      [
        "MR",
        function () {
          cur = String(mem);
          fresh = true;
          show();
        },
        "k-m",
      ],
      [
        "4",
        function () {
          digit("4");
        },
        "k-n",
      ],
      [
        "5",
        function () {
          digit("5");
        },
        "k-n",
      ],
      [
        "6",
        function () {
          digit("6");
        },
        "k-n",
      ],
      [
        "*",
        function () {
          doOp("*");
        },
        "k-o",
      ],
      [
        "%",
        function () {
          unary(function (v) {
            return acc !== null && op ? (acc * v) / 100 : v / 100;
          });
        },
        "k-n",
      ],
      [
        "MS",
        function () {
          mem = val();
          fresh = true;
          show();
        },
        "k-m",
      ],
      [
        "1",
        function () {
          digit("1");
        },
        "k-n",
      ],
      [
        "2",
        function () {
          digit("2");
        },
        "k-n",
      ],
      [
        "3",
        function () {
          digit("3");
        },
        "k-n",
      ],
      [
        "-",
        function () {
          doOp("-");
        },
        "k-o",
      ],
      [
        "1/x",
        function () {
          unary(function (v) {
            return v === 0 ? NaN : 1 / v;
          });
        },
        "k-n",
      ],
      [
        "M+",
        function () {
          mem += val();
          fresh = true;
          show();
        },
        "k-m",
      ],
      [
        "0",
        function () {
          digit("0");
        },
        "k-n",
      ],
      ["+/-", neg, "k-n"],
      [
        ".",
        function () {
          digit(".");
        },
        "k-n",
      ],
      [
        "+",
        function () {
          doOp("+");
        },
        "k-o",
      ],
      ["=", equals, "k-o"],
    ];
    var grid = el("div", { class: "calc-grid" }, ind);
    KEYS.forEach(function (k) {
      grid.append(
        el(
          "button",
          {
            class: "btn " + k[2],
            style: k[3] ? "grid-column:span " + k[3] : "",
            onclick: k[1],
          },
          k[0] === "*" ? "\u00d7" : k[0] === "/" ? "\u00f7" : k[0]
        )
      );
    });
    var root = el("div", { class: "col calc", tabindex: "0" }, disp, grid);
    root.addEventListener("keydown", function (e) {
      var k = e.key;
      if (/^[0-9]$/.test(k)) digit(k);
      else if (k === "." || k === ",") digit(".");
      else if (k === "+" || k === "-" || k === "*" || k === "/") {
        e.preventDefault();
        doOp(k);
      } else if (k === "Enter" || k === "=") {
        e.preventDefault();
        equals();
      } else if (k === "Backspace") {
        e.preventDefault();
        back();
      } else if (k === "Escape") clearAll();
      else if (k === "%")
        unary(function (v) {
          return acc !== null && op ? (acc * v) / 100 : v / 100;
        });
    });
    w.body.append(root);
    show();
    w.refresh = null;
    setTimeout(function () {
      root.focus();
    }, 0);
  }

  /* ================= APP: MINESWEEPER ================= */
  function appMines(w) {
    var LV = {
      beginner: { r: 9, c: 9, m: 10, n: "Beginner" },
      intermediate: { r: 16, c: 16, m: 40, n: "Intermediate" },
    };
    var lvl = "beginner",
      cfg = LV.beginner,
      cells = [],
      over = false,
      won = false,
      started = false,
      flags = 0,
      secs = 0,
      opened = 0,
      tmr = null,
      flagMode = false,
      lp = false,
      lpT = null,
      cs = 24;
    var cnt = el("div", { class: "lcd3" }),
      clk = el("div", { class: "lcd3" });
    var face = el("button", {
      class: "btn",
      "aria-label": "New game",
      style: "min-width:0;padding:2px;line-height:0",
      onclick: function () {
        newGame();
      },
    });
    var grid = el("div", { class: "ms-grid" });
    var modeBtn = el(
      "button",
      {
        class: "btn sm",
        onclick: function () {
          flagMode = !flagMode;
          modeBtn.classList.toggle("on", flagMode);
        },
      },
      "Flag mode"
    );
    w.body.append(
      el(
        "div",
        { class: "col ms" },
        el("div", { class: "raise ms-top" }, cnt, face, clk),
        grid,
        el(
          "div",
          { class: "row", style: "gap:6px;align-items:center" },
          modeBtn,
          el(
            "span",
            { class: "dim", style: "padding:0" },
            "Right-click or long-press to flag"
          )
        )
      )
    );
    function pad3(n) {
      n = Math.max(-99, Math.min(999, n));
      return n < 0
        ? "-" + String(Math.abs(n)).padStart(2, "0")
        : String(n).padStart(3, "0");
    }
    function stopT() {
      if (tmr) {
        clearInterval(tmr);
        tmr = null;
      }
    }
    w.stop = stopT;
    function nb(i) {
      var r = Math.floor(i / cfg.c),
        c = i % cfg.c,
        out = [];
      for (var dr = -1; dr <= 1; dr++)
        for (var dc = -1; dc <= 1; dc++) {
          if (!dr && !dc) continue;
          var rr = r + dr,
            cc = c + dc;
          if (rr >= 0 && rr < cfg.r && cc >= 0 && cc < cfg.c)
            out.push(rr * cfg.c + cc);
        }
      return out;
    }
    function newGame() {
      stopT();
      cfg = LV[lvl];
      cs = Math.max(
        18,
        Math.min(24, Math.floor((Math.min(innerWidth, 560) - 48) / cfg.c))
      );
      cells = [];
      for (var i = 0; i < cfg.r * cfg.c; i++)
        cells.push({ m: false, o: false, f: false, n: 0 });
      over = won = started = false;
      flags = 0;
      secs = 0;
      opened = 0;
      grid.style.gridTemplateColumns = "repeat(" + cfg.c + "," + cs + "px)";
      grid.style.setProperty("--cs", cs + "px");
      if (!w.el.classList.contains("max")) {
        w.el.style.width = Math.min(cfg.c * cs + 62, innerWidth - 8) + "px";
        w.el.style.height =
          Math.min(cfg.r * cs + 168, desk.clientHeight - 8) + "px";
      }
      paint();
    }
    function place(safe) {
      var ban = {};
      ban[safe] = 1;
      nb(safe).forEach(function (j) {
        ban[j] = 1;
      });
      var pool = [];
      for (var i = 0; i < cells.length; i++) if (!ban[i]) pool.push(i);
      if (pool.length < cfg.m) {
        pool = [];
        for (var k = 0; k < cells.length; k++) if (k !== safe) pool.push(k);
      }
      for (var m = 0; m < cfg.m; m++) {
        var j = Math.floor(Math.random() * pool.length);
        cells[pool.splice(j, 1)[0]].m = true;
      }
      cells.forEach(function (c, i) {
        c.n = nb(i).filter(function (j) {
          return cells[j].m;
        }).length;
      });
    }
    function reveal(i) {
      var c = cells[i];
      if (over || c.o || c.f) return;
      if (!started) {
        started = true;
        place(i);
        tmr = setInterval(function () {
          secs = Math.min(999, secs + 1);
          paintHud();
        }, 1000);
      }
      if (c.m) {
        lose(i);
        return;
      }
      var st = [i];
      while (st.length) {
        var k = st.pop(),
          ck = cells[k];
        if (ck.o || ck.f) continue;
        ck.o = true;
        opened++;
        if (ck.n === 0)
          nb(k).forEach(function (j) {
            if (!cells[j].o && !cells[j].f) st.push(j);
          });
      }
      if (opened === cells.length - cfg.m) win();
      paint();
    }
    function flag(i) {
      var c = cells[i];
      if (over || c.o) return;
      c.f = !c.f;
      flags += c.f ? 1 : -1;
      paint();
    }
    function chord(i) {
      var c = cells[i];
      if (over || !c.o || !c.n) return;
      var ns = nb(i),
        f = ns.filter(function (j) {
          return cells[j].f;
        }).length;
      if (f !== c.n) return;
      ns.forEach(function (j) {
        if (!cells[j].f && !cells[j].o) reveal(j);
      });
    }
    function lose(i) {
      over = true;
      won = false;
      stopT();
      cells[i].bang = true;
      paint();
    }
    function win() {
      over = won = true;
      stopT();
      flags = cfg.m;
      cells.forEach(function (c) {
        if (c.m) c.f = true;
      });
      var rec = false;
      if (!S.mines[lvl] || secs < S.mines[lvl]) {
        S.mines[lvl] = Math.max(1, secs);
        save();
        rec = true;
      }
      setTimeout(function () {
        msgBox({
          title: "Minesweeper",
          icon: "info",
          text:
            "You cleared the minefield in " +
            secs +
            " second(s)!" +
            (rec ? "\nThat's a new best time for " + cfg.n + "." : ""),
        });
      }, 60);
    }
    function paintHud() {
      cnt.textContent = pad3(cfg.m - flags);
      clk.textContent = pad3(secs);
    }
    function paintFace(kind) {
      face.textContent = "";
      face.append(
        pix(kind || (over ? (won ? "f_cool" : "f_dead") : "f_smile"), 32)
      );
    }
    function paint() {
      paintHud();
      paintFace();
      grid.textContent = "";
      cells.forEach(function (c, i) {
        var cls = "mc",
          kid = null;
        if (c.o) {
          cls += " o" + (c.n ? " n" + c.n : "");
          kid = c.n ? String(c.n) : null;
        } else if (over && !won && c.m && !c.f) {
          cls += " o" + (c.bang ? " bang" : "");
          kid = pix("mine", 16);
        } else if (c.f) {
          kid = pix("mflag", 16);
          if (over && !won && !c.m) cls += " o";
        }
        grid.append(el("div", { class: cls, "data-i": i }, kid));
      });
    }
    function idx(e) {
      var t = e.target.closest && e.target.closest(".mc");
      return t ? +t.getAttribute("data-i") : -1;
    }
    grid.addEventListener("click", function (e) {
      var i = idx(e);
      if (i < 0) return;
      if (lp) {
        lp = false;
        return;
      }
      if (flagMode && !cells[i].o) flag(i);
      else if (cells[i].o) chord(i);
      else reveal(i);
    });
    grid.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      if (lp) return;
      var i = idx(e);
      if (i >= 0) flag(i);
    });
    grid.addEventListener("pointerdown", function (e) {
      var i = idx(e);
      if (i < 0 || over) return;
      if (e.pointerType !== "mouse" || e.button === 0) paintFace("f_wow");
      if (e.pointerType !== "mouse") {
        clearTimeout(lpT);
        lpT = setTimeout(function () {
          lp = true;
          flag(i);
          setTimeout(function () {
            lp = false;
          }, 500);
        }, 450);
      }
    });
    function up() {
      clearTimeout(lpT);
      paintFace();
    }
    grid.addEventListener("pointerup", up);
    grid.addEventListener("pointerleave", up);
    grid.addEventListener("pointercancel", up);
    w.menus([
      {
        label: "Game",
        items: function () {
          return [
            { label: "New Game", fn: newGame },
            { sep: 1 },
            {
              label: "Beginner",
              check: lvl === "beginner",
              fn: function () {
                lvl = "beginner";
                newGame();
              },
            },
            {
              label: "Intermediate",
              check: lvl === "intermediate",
              fn: function () {
                lvl = "intermediate";
                newGame();
              },
            },
            { sep: 1 },
            {
              label: "Best Times\u2026",
              fn: function () {
                msgBox({
                  title: "Best Times",
                  icon: "info",
                  text:
                    "Beginner:  " +
                    (S.mines.beginner ? S.mines.beginner + " seconds" : "---") +
                    "\nIntermediate:  " +
                    (S.mines.intermediate
                      ? S.mines.intermediate + " seconds"
                      : "---"),
                });
              },
            },
          ];
        },
      },
    ]);
    w.refresh = null;
    newGame();
  }

  /* ================= APP: SKETCH PAD ================= */
  function appPaint(w) {
    var W = 480,
      H = 300;
    var cv = el("canvas", { width: W, height: H });
    var ctx = cv.getContext && cv.getContext("2d");
    if (!ctx) {
      w.body.append(
        el("div", { class: "dim" }, "Drawing isn't supported in this browser.")
      );
      return;
    }
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);
    var COLORS = [
      "#000000",
      "#808080",
      "#800000",
      "#808000",
      "#008000",
      "#008080",
      "#000080",
      "#800080",
      "#ffffff",
      "#c0c0c0",
      "#ff0000",
      "#ffff00",
      "#00ff00",
      "#00ffff",
      "#0000ff",
      "#ff00ff",
    ];
    var tool = "pencil",
      fg = "#000000",
      size = 2,
      drawing = false,
      start = null,
      last = null,
      snap = null,
      undo = [];
    function hexRgb(h) {
      return [
        parseInt(h.slice(1, 3), 16),
        parseInt(h.slice(3, 5), 16),
        parseInt(h.slice(5, 7), 16),
      ];
    }
    function pushUndo() {
      try {
        undo.push(ctx.getImageData(0, 0, W, H));
        if (undo.length > 15) undo.shift();
      } catch (e) {}
    }
    function doUndo() {
      var u = undo.pop();
      if (u) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, W, H);
        ctx.putImageData(u, 0, 0);
      }
    }
    function pos(e) {
      var r = cv.getBoundingClientRect();
      return {
        x: Math.max(
          0,
          Math.min(W - 1, Math.floor(((e.clientX - r.left) * W) / r.width))
        ),
        y: Math.max(
          0,
          Math.min(H - 1, Math.floor(((e.clientY - r.top) * H) / r.height))
        ),
      };
    }
    function dot(x, y, sz, col) {
      ctx.fillStyle = col;
      ctx.fillRect(Math.round(x - sz / 2), Math.round(y - sz / 2), sz, sz);
    }
    function line(x0, y0, x1, y1, sz, col) {
      var dx = Math.abs(x1 - x0),
        dy = -Math.abs(y1 - y0),
        sx = x0 < x1 ? 1 : -1,
        sy = y0 < y1 ? 1 : -1,
        e = dx + dy,
        n = 0;
      while (n++ < 2000) {
        dot(x0, y0, sz, col);
        if (x0 === x1 && y0 === y1) break;
        var e2 = 2 * e;
        if (e2 >= dy) {
          e += dy;
          x0 += sx;
        }
        if (e2 <= dx) {
          e += dx;
          y0 += sy;
        }
      }
    }
    function box(a, b, sz, col) {
      line(a.x, a.y, b.x, a.y, sz, col);
      line(b.x, a.y, b.x, b.y, sz, col);
      line(b.x, b.y, a.x, b.y, sz, col);
      line(a.x, b.y, a.x, a.y, sz, col);
    }
    function fbox(a, b, col) {
      var x = Math.min(a.x, b.x),
        y = Math.min(a.y, b.y),
        w = Math.abs(b.x - a.x),
        h = Math.abs(b.y - a.y);
      ctx.fillStyle = col;
      ctx.fillRect(x, y, Math.max(1, w), Math.max(1, h));
    }
    function ellipse(a, b, sz, col, filled) {
      var cx = (a.x + b.x) / 2,
        cy = (a.y + b.y) / 2,
        rx = Math.max(1, Math.abs(b.x - a.x) / 2),
        ry = Math.max(1, Math.abs(b.y - a.y) / 2);
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      if (filled) {
        ctx.fillStyle = col;
        ctx.fill();
      } else {
        ctx.lineWidth = Math.max(1, sz);
        ctx.strokeStyle = col;
        ctx.stroke();
      }
    }
    function fillAt(x, y, hex) {
      var img = ctx.getImageData(0, 0, W, H),
        d = img.data,
        rgb = hexRgb(hex),
        i0 = (y * W + x) * 4,
        tr = d[i0],
        tg = d[i0 + 1],
        tb = d[i0 + 2];
      if (tr === rgb[0] && tg === rgb[1] && tb === rgb[2]) return;
      var st = [x, y];
      function same(k) {
        return d[k] === tr && d[k + 1] === tg && d[k + 2] === tb;
      }
      while (st.length) {
        var yy = st.pop(),
          xx = st.pop();
        if (!same((yy * W + xx) * 4)) continue;
        var l = xx,
          r = xx;
        while (l > 0 && same((yy * W + l - 1) * 4)) l--;
        while (r < W - 1 && same((yy * W + r + 1) * 4)) r++;
        for (var q = l; q <= r; q++) {
          var m = (yy * W + q) * 4;
          d[m] = rgb[0];
          d[m + 1] = rgb[1];
          d[m + 2] = rgb[2];
          d[m + 3] = 255;
          if (yy > 0 && same(((yy - 1) * W + q) * 4)) st.push(q, yy - 1);
          if (yy < H - 1 && same(((yy + 1) * W + q) * 4)) st.push(q, yy + 1);
        }
      }
      ctx.putImageData(img, 0, 0);
    }
    function brush() {
      return tool === "pencil"
        ? 1
        : tool === "eraser"
        ? Math.max(6, size * 3)
        : size;
    }
    function colour() {
      return tool === "eraser" ? "#ffffff" : fg;
    }
    function constrainShape(a, b, tool2) {
      var dx = b.x - a.x,
        dy = b.y - a.y;
      if (tool2 === "line") {
        var angle = Math.atan2(dy, dx),
          step = Math.PI / 4,
          snapped = Math.round(angle / step) * step,
          len = Math.sqrt(dx * dx + dy * dy);
        return {
          x: Math.round(a.x + Math.cos(snapped) * len),
          y: Math.round(a.y + Math.sin(snapped) * len),
        };
      }
      if (
        tool2 === "box" ||
        tool2 === "fbox" ||
        tool2 === "ellipse" ||
        tool2 === "fellipse"
      ) {
        var sz = Math.max(Math.abs(dx), Math.abs(dy)),
          sx = dx >= 0 ? 1 : -1,
          sy = dy >= 0 ? 1 : -1;
        return { x: a.x + sx * sz, y: a.y + sy * sz };
      }
      return b;
    }
    cv.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      var p = pos(e);
      pushUndo();
      if (tool === "fill") {
        fillAt(p.x, p.y, fg);
        return;
      }
      if (tool === "text") {
        var str = prompt("Text to draw:", "");
        if (str) {
          ctx.fillStyle = fg;
          ctx.font = Math.max(10, size * 6) + "px Tahoma, sans-serif";
          ctx.fillText(str, p.x, p.y);
        }
        drawing = false;
        return;
      }
      try {
        cv.setPointerCapture(e.pointerId);
      } catch (x) {}
      drawing = true;
      start = last = p;
      if (
        tool === "line" ||
        tool === "box" ||
        tool === "fbox" ||
        tool === "ellipse" ||
        tool === "fellipse"
      ) {
        try {
          snap = ctx.getImageData(0, 0, W, H);
        } catch (x) {
          snap = null;
        }
      } else dot(p.x, p.y, brush(), colour());
    });
    cv.addEventListener("pointermove", function (e) {
      if (!drawing) return;
      var p = pos(e);
      if (
        tool === "line" ||
        tool === "box" ||
        tool === "fbox" ||
        tool === "ellipse" ||
        tool === "fellipse"
      ) {
        if (e.shiftKey) p = constrainShape(start, p, tool);
        if (snap) ctx.putImageData(snap, 0, 0);
        if (tool === "line") line(start.x, start.y, p.x, p.y, size, fg);
        else if (tool === "box") box(start, p, size, fg);
        else if (tool === "fbox") fbox(start, p, fg);
        else ellipse(start, p, size, fg, tool === "fellipse");
      } else {
        line(last.x, last.y, p.x, p.y, brush(), colour());
        last = p;
      }
    });
    function end() {
      drawing = false;
      snap = null;
    }
    cv.addEventListener("pointerup", end);
    cv.addEventListener("pointercancel", end);
    var toolBtns = {};
    var tools = el(
      "div",
      { class: "pt-tools" },
      [
        ["pencil", "Pencil"],
        ["brush", "Brush"],
        ["eraser", "Eraser"],
        ["line", "Line"],
        ["box", "Box"],
        ["fbox", "Filled box"],
        ["ellipse", "Ellipse"],
        ["fellipse", "Filled ellipse"],
        ["text", "Text"],
        ["fill", "Fill"],
      ].map(function (t2) {
        var b = el(
          "button",
          {
            class: "btn" + (t2[0] === tool ? " on" : ""),
            onclick: function () {
              tool = t2[0];
              for (var k in toolBtns)
                toolBtns[k].classList.toggle("on", k === tool);
            },
          },
          t2[1]
        );
        toolBtns[t2[0]] = b;
        return b;
      })
    );
    var sz = el(
      "select",
      {
        class: "in",
        title: "Line width",
        onchange: function () {
          size = parseInt(this.value, 10) || 2;
        },
      },
      [1, 2, 4, 8].map(function (n) {
        return el("option", { value: n, selected: n === 2 }, n + " px");
      })
    );
    var cur = el("div", { class: "pt-cur", style: "background:" + fg });
    var picker = el("input", {
      type: "color",
      value: fg,
      title: "Any colour",
      oninput: function () {
        fg = this.value;
        cur.style.background = fg;
        if (tool === "eraser") {
          tool = "pencil";
          for (var k in toolBtns)
            toolBtns[k].classList.toggle("on", k === tool);
        }
      },
    });
    tools.append(
      sz,
      picker,
      el("button", { class: "btn", onclick: doUndo }, "Undo")
    );
    var sw = el(
      "div",
      { class: "pt-sw" },
      COLORS.map(function (c) {
        return el("i", {
          style: "background:" + c,
          title: c,
          onclick: function () {
            fg = c;
            cur.style.background = c;
            if (picker) picker.value = c;
            if (tool === "eraser") {
              tool = "pencil";
              for (var k in toolBtns)
                toolBtns[k].classList.toggle("on", k === tool);
            }
          },
        });
      })
    );
    function clearAll() {
      pushUndo();
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, W, H);
    }
    w.menus([
      {
        label: "File",
        items: function () {
          return [
            { label: "New", fn: clearAll },
            {
              label: "Set as Desktop Background",
              fn: function () {
                try {
                  setWall(cv.toDataURL("image/jpeg", 0.9));
                } catch (e) {}
              },
            },
            {
              label: "Save as PNG\u2026",
              fn: function () {
                cv.toBlob(function (b) {
                  if (b) saveFile("sketch-" + ymd(new Date()) + ".png", b);
                  else
                    msgBox({
                      title: "Sketch Pad",
                      icon: "err",
                      text: "Couldn't create the image.",
                    });
                });
              },
            },
          ];
        },
      },
      {
        label: "Edit",
        items: function () {
          return [
            { label: "Undo", fn: doUndo },
            { label: "Clear Image", fn: clearAll },
          ];
        },
      },
    ]);
    var area = el("div", { class: "pt-area" }, cv);
    w.body.append(
      el(
        "div",
        { class: "pt" },
        tools,
        area,
        el("div", { class: "pt-pal" }, cur, sw),
        el(
          "div",
          { class: "dim", style: "padding:4px 0 0;font-size:11px" },
          "Hold Shift while dragging a line, box or ellipse to constrain it."
        )
      )
    );
    function fit() {
      var aw = Math.floor(area.clientWidth - 6),
        ah = Math.floor(area.clientHeight - 6);
      if (!(aw > 0 && ah > 0)) return;
      var nw = Math.max(W, aw),
        nh = Math.max(H, ah);
      if (nw === W && nh === H) return;
      var old = document.createElement("canvas");
      old.width = W;
      old.height = H;
      var octx = old.getContext("2d");
      octx.drawImage(cv, 0, 0);
      cv.width = nw;
      cv.height = nh;
      W = nw;
      H = nh;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, W, H);
      ctx.drawImage(old, 0, 0);
    }
    if (typeof ResizeObserver !== "undefined") {
      try {
        new ResizeObserver(function () {
          fit();
        }).observe(area);
      } catch (e) {}
    }
    w.onresize = fit;
    setTimeout(fit, 0);
    setTimeout(fit, 250);
    w.refresh = null;
  }

  /* ================= APP: CLASS SCHEDULE ================= */
  function appSchedule(w) {
    var OTHER = "__other";
    var clsSel = el("select", {
      class: "in",
      style: "flex:1 1 180px",
      onchange: function () {
        syncName();
      },
    });
    var name = el("input", {
      class: "in",
      placeholder: "Class name",
      style: "flex:1 1 140px",
    });
    var boxes = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(function (
      n,
      i
    ) {
      var c = el("input", { type: "checkbox" });
      return {
        i: i,
        c: c,
        l: el(
          "label",
          { style: "display:flex;align-items:center;margin-right:6px" },
          c,
          n
        ),
      };
    });
    var st = el("input", {
        class: "in",
        type: "time",
        value: "09:00",
        style: "width:94px",
      }),
      en = el("input", {
        class: "in",
        type: "time",
        value: "09:50",
        style: "width:94px",
      });
    var room = el("input", {
      class: "in",
      placeholder: "Room",
      style: "width:84px",
    });
    var from = el("input", {
      class: "in",
      type: "date",
      title: "First day (optional)",
      style: "width:128px",
    });
    var until = el("input", {
      class: "in",
      type: "date",
      title: "Last day (optional)",
      style: "width:128px",
    });
    var banner = el("div", { style: "padding:2px 8px 0;min-height:18px" });
    var cpanel = el("div", {
      class: "sunk list",
      style: "flex:none;max-height:118px;margin:0 6px 4px",
    });
    var advance = false;
    function canvasCodes() {
      var seen = {},
        out = [];
      S.assign.forEach(function (a) {
        if (a.course && !seen[a.course]) {
          seen[a.course] = 1;
          out.push(a.course);
        }
      });
      return out.sort();
    }
    function hasTimes(code) {
      return S.classes.some(function (c) {
        return c.canvas === code;
      });
    }
    function syncName() {
      var other = clsSel.value === OTHER;
      name.hidden = !other;
      if (!other) name.value = "";
    }
    function fillSel() {
      var codes = canvasCodes(),
        v = clsSel.value;
      clsSel.textContent = "";
      codes.forEach(function (c) {
        clsSel.append(
          el(
            "option",
            { value: c },
            c + (hasTimes(c) ? "" : "   (needs times)")
          )
        );
      });
      clsSel.append(
        el(
          "option",
          { value: OTHER },
          codes.length
            ? "Other class (type a name)\u2026"
            : "Type a class name\u2026"
        )
      );
      var ok = [].some.call(clsSel.options, function (o) {
        return o.value === v;
      });
      var first = codes.filter(function (c) {
        return !hasTimes(c);
      })[0];
      clsSel.value =
        advance && first ? first : ok ? v : first || codes[0] || OTHER;
      advance = false;
      if (!codes.length) clsSel.value = OTHER;
      syncName();
    }
    function addClass() {
      var code = clsSel.value === OTHER ? "" : clsSel.value;
      var n = code || name.value.trim();
      if (!n) {
        name.focus();
        return;
      }
      var days = boxes
        .filter(function (b) {
          return b.c.checked;
        })
        .map(function (b) {
          return b.i;
        });
      if (!days.length) {
        msgBox({
          title: "Class Schedule",
          icon: "warn",
          text: "Tick the days this class meets.",
        });
        return;
      }
      if (!st.value || !en.value || en.value <= st.value) {
        msgBox({
          title: "Class Schedule",
          icon: "warn",
          text: "The end time must be after the start time.",
        });
        return;
      }
      if (S.classes.length >= 60) return;
      S.classes.push({
        id: uid(),
        name: clip(n, 60),
        canvas: code,
        days: days,
        start: st.value,
        end: en.value,
        room: clip(room.value.trim(), 40),
        from: from.value || "",
        until: until.value || "",
      });
      name.value = "";
      room.value = "";
      boxes.forEach(function (b) {
        b.c.checked = false;
      });
      advance = true;
      save();
      refreshAll();
    }
    onEnter(name, addClass);
    var grid = el(
      "div",
      { class: "sunk sch-wrap" },
      el("div", { class: "sch-grid" })
    );
    var list = el("div", {
      class: "sunk list",
      style: "flex:none;max-height:120px;margin-top:0",
    });
    w.body.append(
      el(
        "div",
        { class: "col", style: "flex:1;min-height:0;overflow:auto" },
        banner,
        cpanel,
        el(
          "div",
          { class: "row form", style: "padding-bottom:2px" },
          el("span", null, "Class:"),
          clsSel,
          name,
          st,
          el("span", null, "to"),
          en,
          room
        ),
        el(
          "div",
          { class: "row form", style: "padding:0 6px" },
          boxes.map(function (b) {
            return b.l;
          })
        ),
        el(
          "div",
          { class: "row form", style: "padding-top:2px" },
          el("span", null, "Semester:"),
          from,
          el("span", null, "to"),
          until,
          el(
            "button",
            { class: "btn sm", onclick: addClass },
            "Add meeting time"
          )
        ),
        el(
          "div",
          { class: "col", style: "padding:0 6px 4px;flex:1;min-height:120px" },
          grid
        ),
        list
      )
    );
    function draw() {
      var codes = canvasCodes(),
        missing = codes.filter(function (c) {
          return !hasTimes(c);
        });
      banner.textContent = "";
      if (!codes.length)
        banner.append(
          el(
            "span",
            { class: "dim", style: "padding:0" },
            "No imported classes yet. Import a calendar in Calendar Link, or add a class by hand below."
          )
        );
      else if (missing.length)
        banner.append(
          el(
            "b",
            { style: "color:#800000" },
            missing.length + " imported class(es) need meeting times."
          ),
          " Pick the class below and tick its days and times."
        );
      else
        banner.append(
          el(
            "span",
            { style: "color:#006000" },
            "All your imported classes have meeting times."
          )
        );
      cpanel.textContent = "";
      cpanel.hidden = !codes.length;
      codes.forEach(function (code) {
        var mine = S.classes.filter(function (c) {
          return c.canvas === code;
        });
        cpanel.append(
          el(
            "div",
            { class: "lrow" },
            el("span", { class: "tag" }, "Imported"),
            el(
              "span",
              { class: "t" },
              el("b", null, code),
              "  ",
              mine.length
                ? mine
                    .map(function (c) {
                      return (
                        c.days
                          .map(function (d) {
                            return DAYS[d];
                          })
                          .join(" ") +
                        " " +
                        c.start +
                        "-" +
                        c.end
                      );
                    })
                    .join("; ")
                : "needs meeting times"
            ),
            el(
              "button",
              {
                class: "btn xs",
                style: "padding:2px 6px",
                onclick: function () {
                  clsSel.value = code;
                  syncName();
                  boxes[1].c.focus();
                },
              },
              mine.length ? "Add another" : "Set times"
            )
          )
        );
      });
      fillSel();
      var g = grid.firstChild;
      g.textContent = "";
      var order = [1, 2, 3, 4, 5, 6, 0],
        today = new Date().getDay();
      order.forEach(function (d) {
        var col = el(
          "div",
          { class: "sch-col" },
          el(
            "div",
            { class: "sch-dh" + (d === today ? " today" : "") },
            DAYS[d]
          )
        );
        S.classes
          .filter(function (c) {
            return c.days.indexOf(d) >= 0;
          })
          .sort(function (a, b) {
            return a.start < b.start ? -1 : 1;
          })
          .forEach(function (c) {
            var idx = S.classes.indexOf(c);
            col.append(
              el(
                "div",
                {
                  class: "sch-blk",
                  style:
                    "background:" + CLASS_COLORS[idx % CLASS_COLORS.length],
                  title: c.name,
                },
                el("b", null, c.name),
                el("br"),
                c.start + "-" + c.end,
                c.room ? el("br") : null,
                c.room || ""
              )
            );
          });
        g.append(col);
      });
      list.textContent = "";
      if (!S.classes.length)
        list.append(
          el(
            "div",
            { class: "dim" },
            "No meeting times yet. Add one above and it shows on your Calendar and Today pages."
          )
        );
      S.classes.forEach(function (c) {
        list.append(
          el(
            "div",
            { class: "lrow" },
            el(
              "span",
              { class: "t" },
              c.name +
                "  (" +
                c.days
                  .map(function (d) {
                    return DAYS[d];
                  })
                  .join(" ") +
                ", " +
                c.start +
                "-" +
                c.end +
                (c.room ? ", " + c.room : "") +
                ")"
            ),
            el(
              "button",
              {
                class: "btn xs",
                "aria-label": "Delete",
                onclick: function () {
                  softDelete("classes", function (x) {
                    return x.id === c.id;
                  });
                },
              },
              "X"
            )
          )
        );
      });
      w.status(S.classes.length + " meeting time(s)");
    }
    w.refresh = draw;
    draw();
  }

  /* ================= APP: STATS ================= */
  function appStats(w) {
    var chart = el("div", { class: "sunk st-chart" });
    var info = el("div", { class: "sunk st-info" });
    var heat = el("div", { class: "sunk", style: "padding:6px;overflow:auto" });
    var tod = el("div", { class: "sunk", style: "padding:6px" });
    var goalIn = el("input", {
      class: "in",
      type: "number",
      min: "0",
      max: "6000",
      step: "30",
      value: S.prefs.goal,
      style: "width:76px",
      oninput: function () {
        var v = parseInt(this.value, 10);
        S.prefs.goal = isNum(v) ? Math.max(0, Math.min(6000, v)) : 0;
        save();
        draw();
      },
    });
    var sub = el("input", {
      class: "in",
      placeholder: "Subject (optional)",
      style: "flex:1 1 110px",
    });
    var mins = el("input", {
      class: "in",
      type: "number",
      min: "5",
      max: "600",
      value: "30",
      style: "width:66px",
    });
    function logIt() {
      var m = parseInt(mins.value, 10);
      if (!isNum(m) || m < 1) return;
      m = Math.min(600, m);
      var k = ymd(new Date()),
        d = S.stats[k] || (S.stats[k] = { sessions: 0, minutes: 0 });
      d.minutes += m;
      var lb = clip(sub.value.trim() || "(no subject)", 40);
      d.by = d.by || {};
      d.by[lb] = (d.by[lb] || 0) + m;
      save();
      refreshAll();
      sub.value = "";
    }
    onEnter(sub, logIt);
    w.body.append(
      el(
        "div",
        {
          class: "col",
          style: "flex:1;min-height:0;padding:6px;gap:6px;overflow:auto",
        },
        el(
          "div",
          { style: "font-weight:bold" },
          "Minutes studied, last 14 days"
        ),
        chart,
        el(
          "div",
          { class: "row", style: "gap:6px;align-items:center;flex-wrap:wrap" },
          "Log time:",
          sub,
          mins,
          "min",
          el("button", { class: "btn sm", onclick: logIt }, "Add"),
          el("span", { style: "margin-left:auto" }, "Weekly goal:"),
          goalIn,
          "min"
        ),
        info,
        el(
          "div",
          { style: "font-weight:bold;margin-top:6px" },
          "Focus heatmap (last 6 months)"
        ),
        heat,
        el("div", { style: "font-weight:bold;margin-top:6px" }, "When do you focus best?"),
        tod
      )
    );
    function draw() {
      var now = new Date(),
        days = [],
        max = 60;
      for (var i = 13; i >= 0; i--) {
        var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i),
          k = ymd(d),
          m = (S.stats[k] && S.stats[k].minutes) || 0;
        days.push({ d: d, k: k, m: m });
        if (m > max) max = m;
      }
      chart.textContent = "";
      days.forEach(function (x, i) {
        chart.append(
          el(
            "div",
            {
              class: "st-col" + (i === 13 ? " today" : ""),
              title:
                DAYS[x.d.getDay()] +
                " " +
                (x.d.getMonth() + 1) +
                "/" +
                x.d.getDate() +
                ": " +
                x.m +
                " min",
            },
            el("div", {
              class: "st-bar",
              style: "height:" + Math.round((x.m / max) * 100) + "%",
            }),
            el("div", { class: "st-lab" }, x.d.getDate())
          )
        );
      });
      var week = days.slice(7).reduce(function (a, x) {
          return a + x.m;
        }, 0),
        all = 0,
        sess = 0,
        best = 0,
        bestK = "",
        by = {};
      for (var k in S.stats) {
        var s = S.stats[k];
        all += s.minutes || 0;
        sess += s.sessions || 0;
        if ((s.minutes || 0) > best) {
          best = s.minutes;
          bestK = k;
        }
        if (s.by) for (var b in s.by) by[b] = (by[b] || 0) + s.by[b];
      }
      info.textContent = "";
      var goal = S.prefs.goal || 0,
        pct = goal > 0 ? Math.min(100, Math.round((week / goal) * 100)) : 0;
      info.append(
        el(
          "div",
          null,
          "This week (last 7 days): ",
          el("b", null, week + " min"),
          goal ? "  of " + goal + " (" + pct + "%)" : ""
        )
      );
      if (goal)
        info.append(
          el(
            "div",
            { class: "st-row" },
            el(
              "div",
              { class: "bar", style: "height:14px" },
              el("i", {
                style:
                  "width:" +
                  pct +
                  "%;background:" +
                  (pct >= 100 ? "#006000" : "#000080"),
              })
            )
          )
        );
      info.append(
        el(
          "div",
          null,
          "All time: ",
          el("b", null, (all / 60).toFixed(1) + " hours"),
          "  in " + sess + " timer session(s)"
        )
      );
      info.append(
        el("div", null, "Current streak: ", el("b", null, streak() + " day(s)"))
      );
      if (best)
        info.append(
          el(
            "div",
            null,
            "Best day: ",
            el("b", null, best + " min"),
            "  on " + bestK
          )
        );
      var subs = Object.keys(by)
        .sort(function (a, b) {
          return by[b] - by[a];
        })
        .slice(0, 8);
      info.append(
        el("div", { style: "margin-top:6px;font-weight:bold" }, "By subject")
      );
      if (!subs.length)
        info.append(
          el(
            "div",
            { class: "dim", style: "padding:0" },
            "Type a subject in the Focus Timer's \"I'm working on\" box, or log time above."
          )
        );
      subs.forEach(function (n) {
        info.append(
          el(
            "div",
            { class: "st-row" },
            el("span", { class: "nm" }, n),
            el(
              "div",
              { class: "bar" },
              el("i", {
                style: "width:" + Math.round((by[n] / by[subs[0]]) * 100) + "%",
              })
            ),
            el("span", null, by[n] + " min")
          )
        );
      });
      drawHeat();
      w.status(week + " min this week");
    }
    function drawHeat() {
      heat.textContent = "";
      var weeks = 26;
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      var todayDow = today.getDay();
      var thisSunday = new Date(today);
      thisSunday.setDate(today.getDate() - todayDow);
      var startWeek = new Date(thisSunday);
      startWeek.setDate(thisSunday.getDate() - (weeks - 1) * 7);
      var max = 0;
      for (var kk in S.stats)
        if ((S.stats[kk].minutes || 0) > max) max = S.stats[kk].minutes;
      if (max < 60) max = 60;
      function colorFor(min) {
        if (!min) return "#ebebeb";
        var t = Math.min(1, min / max);
        if (t < 0.25) return "#c6e8c6";
        if (t < 0.5) return "#83c983";
        if (t < 0.75) return "#3d9a3d";
        return "#14571c";
      }
      var dowLabels = ["Sun", "", "Tue", "", "Thu", "", "Sat"];
      var body = el("div", {
        style:
          "display:grid;grid-template-columns:auto 1fr;gap:4px;align-items:start",
      });
      var labels = el("div", {
        style:
          "display:grid;grid-template-rows:repeat(7,12px);gap:1px;font-size:9px;color:#606060",
      });
      for (var d = 0; d < 7; d++)
        labels.append(
          el(
            "div",
            { style: "line-height:12px;text-align:right;padding-right:4px" },
            dowLabels[d]
          )
        );
      var gridBox = el("div", {
        style:
          "display:grid;grid-auto-flow:column;grid-template-rows:repeat(7,12px);gap:1px",
      });
      for (var w2 = 0; w2 < weeks; w2++) {
        for (var dd = 0; dd < 7; dd++) {
          var dcell = new Date(startWeek);
          dcell.setDate(startWeek.getDate() + w2 * 7 + dd);
          var key = ymd(dcell);
          var future = dcell.getTime() > today.getTime();
          var min2 = (S.stats[key] && S.stats[key].minutes) || 0;
          var c3 = future ? "transparent" : colorFor(min2);
          gridBox.append(
            el("div", {
              title: future ? "" : key + " \u2014 " + min2 + " min",
              style:
                "width:12px;height:12px;background:" +
                c3 +
                ";border-radius:1px",
            })
          );
        }
      }
      body.append(labels, gridBox);
      heat.append(body);
      var legend = el(
        "div",
        {
          style:
            "display:flex;align-items:center;gap:4px;font-size:10px;color:#606060;margin-top:6px",
        },
        el("span", null, "Less"),
        [0, 0.15, 0.35, 0.65, 1].map(function (t) {
          return el("div", {
            style:
              "width:12px;height:12px;background:" +
              (t === 0 ? "#ebebeb" : colorFor(t * max)) +
              ";border-radius:1px",
          });
        }),
        el("span", null, "More")
      );
      heat.append(legend);
      drawTod(tod);
    }
    w.refresh = draw;
    draw();
  }

  /* ================= APP: WEEKLY REVIEW ================= */
  function appWeekly(w) {
    var offsetWeeks = 0;
    var head = el("div", { class: "row form" });
    var content = el("div", {
      class: "col",
      style: "flex:1;min-height:0;padding:6px;gap:8px;overflow:auto",
    });
    w.body.append(head, content);
    function startOfWeek(ms) {
      var d = new Date(ms);
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - d.getDay());
      return d.getTime();
    }
    function draw() {
      head.textContent = "";
      var thisWeekStart = startOfWeek(Date.now());
      var weekStart = thisWeekStart - offsetWeeks * 7 * 86400000;
      var weekEnd = weekStart + 7 * 86400000;
      var startDate = new Date(weekStart);
      var endDate = new Date(weekEnd - 1);
      head.append(
        el(
          "button",
          {
            class: "btn sm",
            onclick: function () {
              offsetWeeks++;
              draw();
            },
          },
          "\u25C0 Older"
        ),
        el(
          "span",
          { style: "font-weight:bold;flex:1;text-align:center" },
          "Week of " +
            (startDate.getMonth() + 1) +
            "/" +
            startDate.getDate() +
            " \u2013 " +
            (endDate.getMonth() + 1) +
            "/" +
            endDate.getDate() +
            " " +
            startDate.getFullYear()
        ),
        el(
          "button",
          {
            class: "btn sm",
            disabled: offsetWeeks <= 0,
            onclick: function () {
              if (offsetWeeks > 0) {
                offsetWeeks--;
                draw();
              }
            },
          },
          "Newer \u25B6"
        )
      );
      content.textContent = "";
      var totalMin = 0,
        sessions = 0,
        byDay = [],
        daysWithFocus = 0,
        bySub = {};
      for (var i = 0; i < 7; i++) {
        var dk = ymd(new Date(weekStart + i * 86400000));
        var st = S.stats[dk] || { sessions: 0, minutes: 0 };
        byDay.push({
          day: DAYS[(startDate.getDay() + i) % 7],
          d: new Date(weekStart + i * 86400000),
          min: st.minutes || 0,
          sess: st.sessions || 0,
        });
        totalMin += st.minutes || 0;
        sessions += st.sessions || 0;
        if ((st.minutes || 0) > 0) daysWithFocus++;
        if (st.by) for (var b in st.by) bySub[b] = (bySub[b] || 0) + st.by[b];
      }
      var tasksDone = S.tasks.filter(function (t) {
        return t.done && t.created >= weekStart && t.created < weekEnd;
      }).length;
      var tasksCreated = S.tasks.filter(function (t) {
        return t.created >= weekStart && t.created < weekEnd;
      }).length;
      var assignDone = S.assign.filter(function (a) {
        return a.due >= weekStart && a.due < weekEnd && a.done;
      }).length;
      var assignDue = S.assign.filter(function (a) {
        return a.due >= weekStart && a.due < weekEnd;
      }).length;
      var notesNew = S.notes.filter(function (n) {
        return n.updated >= weekStart && n.updated < weekEnd;
      }).length;
      var habitPossible = S.habits.length * 7,
        habitDone = 0;
      S.habits.forEach(function (h) {
        for (var i2 = 0; i2 < 7; i2++) {
          var k = ymd(new Date(weekStart + i2 * 86400000));
          if (h.log[k]) habitDone++;
        }
      });
      var remDone = S.reminders.filter(function (r) {
        return r.done && r.at >= weekStart && r.at < weekEnd;
      }).length;
      function card(title, rows) {
        var box = el("div", { class: "sunk", style: "padding:8px 10px" });
        box.append(
          el(
            "div",
            { style: "font-weight:bold;margin-bottom:4px;font-size:13px" },
            title
          )
        );
        rows.forEach(function (r) {
          box.append(
            el(
              "div",
              {
                style:
                  "display:flex;justify-content:space-between;padding:2px 0",
              },
              el("span", null, r[0]),
              el("b", null, r[1])
            )
          );
        });
        return box;
      }
      content.append(
        card("Focus", [
          ["Sessions completed", sessions],
          ["Minutes focused", totalMin],
          ["Hours focused", (totalMin / 60).toFixed(1)],
          ["Days with any focus", daysWithFocus + " / 7"],
          ["Daily average (min)", Math.round(totalMin / 7)],
          [
            "Weekly goal",
            (S.prefs.goal || 0) +
              " min (" +
              (S.prefs.goal
                ? Math.round((totalMin / S.prefs.goal) * 100) + "%"
                : "no goal set") +
              ")",
          ],
        ])
      );
      var chartBox = el("div", { class: "sunk", style: "padding:8px 10px" });
      chartBox.append(
        el(
          "div",
          { style: "font-weight:bold;margin-bottom:4px;font-size:13px" },
          "Day by day"
        )
      );
      var maxMin = Math.max(
        1,
        byDay.reduce(function (a, x) {
          return Math.max(a, x.min);
        }, 0)
      );
      byDay.forEach(function (d) {
        chartBox.append(
          el(
            "div",
            {
              class: "row",
              style: "gap:6px;align-items:center;padding:1px 0;font-size:11px",
            },
            el("span", { style: "width:32px;color:#606060" }, d.day),
            el(
              "div",
              { style: "flex:1;height:10px;background:#e8e8e8" },
              el("i", {
                style:
                  "display:block;height:100%;width:" +
                  Math.round((d.min / maxMin) * 100) +
                  "%;background:#000080",
              })
            ),
            el("span", { style: "width:52px;text-align:right" }, d.min + " min")
          )
        );
      });
      content.append(chartBox);
      var subs = Object.keys(bySub)
        .sort(function (a, b) {
          return bySub[b] - bySub[a];
        })
        .slice(0, 5);
      if (subs.length) {
        var subBox = el("div", { class: "sunk", style: "padding:8px 10px" });
        subBox.append(
          el(
            "div",
            { style: "font-weight:bold;margin-bottom:4px;font-size:13px" },
            "Top subjects"
          )
        );
        subs.forEach(function (n) {
          subBox.append(
            el(
              "div",
              {
                style:
                  "display:flex;justify-content:space-between;padding:2px 0;font-size:12px",
              },
              el("span", null, n),
              el("b", null, bySub[n] + " min")
            )
          );
        });
        content.append(subBox);
      }
      weeklySessions(content, weekStart, weekEnd);
      content.append(
        card("Work", [
          ["Tasks created", tasksCreated],
          ["Tasks completed", tasksDone],
          ["Assignments due", assignDue],
          ["Assignments completed", assignDone],
          ["Reminders completed", remDone],
          ["Notes updated", notesNew],
        ])
      );
      if (S.habits.length) {
        content.append(
          card("Habits", [
            ["Habits tracked", S.habits.length],
            ["Days checked", habitDone + " / " + habitPossible],
            [
              "Completion",
              habitPossible
                ? Math.round((habitDone / habitPossible) * 100) + "%"
                : "\u2014",
            ],
          ])
        );
      }
      var verdict;
      if (totalMin === 0 && tasksDone === 0)
        verdict =
          "Quiet week \u2014 no focus sessions or completed tasks recorded.";
      else if (totalMin >= (S.prefs.goal || 300))
        verdict = "Strong week \u2014 you hit your focus goal.";
      else if (totalMin > 0) verdict = "Steady progress.";
      else verdict = "No focus sessions logged this week.";
      content.append(
        el(
          "div",
          {
            style:
              "text-align:center;color:#404040;padding:6px;font-style:italic",
          },
          verdict
        )
      );
      w.status(
        "Week " +
          (offsetWeeks === 0 ? "(this week)" : offsetWeeks + " week(s) ago")
      );
    }
    w.refresh = draw;
    draw();
  }

  /* ================= APP: CITATION MAKER ================= */
  var MON_L = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var MON_S = [
    "Jan.",
    "Feb.",
    "Mar.",
    "Apr.",
    "May",
    "June",
    "July",
    "Aug.",
    "Sept.",
    "Oct.",
    "Nov.",
    "Dec.",
  ];
  function citeHtml(t) {
    return citeEsc(t).replace(/\*([^*]+)\*/g, "<i>$1</i>");
  }
  function citePlain(t) {
    return String(t).replace(/\*/g, "");
  }
  function cDot(t) {
    return /[.?!]$/.test(t) ? t : t + ".";
  }
  function cItal(t) {
    return "*" + t + "*" + (/[.?!]$/.test(t) ? "" : ".");
  }
  function cQuote(t) {
    return '"' + (/[.?!]$/.test(t) ? t : t + ".") + '"';
  }
  function cDate(str) {
    str = String(str || "").trim();
    var m = str.match(/^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/);
    if (m) return { y: +m[1], m: m[2] ? +m[2] : 0, d: m[3] ? +m[3] : 0 };
    var y = str.match(/\b(1[5-9]\d\d|20\d\d)\b/);
    return y ? { y: +y[1], m: 0, d: 0 } : null;
  }
  function cAuthors(txt) {
    return String(txt || "")
      .split(/\r?\n/)
      .map(function (l) {
        return l.replace(/\*/g, "").trim();
      })
      .filter(Boolean)
      .slice(0, 30)
      .map(function (line) {
        var p = line.split(","),
          last,
          first;
        if (p.length >= 2) {
          last = p[0].trim();
          first = p.slice(1).join(" ").trim();
        } else {
          var ws = line.split(/\s+/);
          last = ws.pop();
          first = ws.join(" ");
        }
        return { last: last, first: first };
      });
  }
  function cInit(first) {
    return first
      .split(/[\s-]+/)
      .filter(Boolean)
      .map(function (n) {
        return n.charAt(0).toUpperCase() + ".";
      })
      .join(" ");
  }
  function cAuthApa(a) {
    var l = a.map(function (x) {
      return x.first ? x.last + ", " + cInit(x.first) : x.last;
    });
    if (!l.length) return "";
    if (l.length === 1) return l[0];
    if (l.length <= 20)
      return l.slice(0, -1).join(", ") + ", & " + l[l.length - 1];
    return l.slice(0, 19).join(", ") + ", . . . " + l[l.length - 1];
  }
  function cAuthMla(a) {
    if (!a.length) return "";
    var f = a[0].first ? a[0].last + ", " + a[0].first : a[0].last;
    if (a.length === 1) return f;
    if (a.length === 2)
      return (
        f + ", and " + (a[1].first ? a[1].first + " " + a[1].last : a[1].last)
      );
    return f + ", et al.";
  }
  function cAuthChi(a) {
    if (!a.length) return "";
    var f = a[0].first ? a[0].last + ", " + a[0].first : a[0].last;
    var rest = a.slice(1).map(function (x) {
      return x.first ? x.first + " " + x.last : x.last;
    });
    if (!rest.length) return f;
    if (rest.length === 1) return f + ", and " + rest[0];
    return (
      f + ", " + rest.slice(0, -1).join(", ") + ", and " + rest[rest.length - 1]
    );
  }
  function formatCite(style, type, f) {
    var a = cAuthors(f.authors),
      dt = cDate(f.date),
      yr = dt ? String(dt.y) : "n.d.";
    var T = String(f.title || "")
        .replace(/\*/g, "")
        .trim(),
      C = String(f.container || "")
        .replace(/\*/g, "")
        .trim(),
      U = String(f.url || "").trim(),
      P = String(f.publisher || "")
        .replace(/\*/g, "")
        .trim(),
      City = String(f.city || "")
        .replace(/\*/g, "")
        .trim(),
      V = String(f.vol || "")
        .replace(/\*/g, "")
        .trim(),
      I = String(f.issue || "")
        .replace(/\*/g, "")
        .trim(),
      Pg = String(f.pages || "")
        .replace(/\*/g, "")
        .trim();
    if (!T) return "";
    var parts = [];
    if (style === "apa") {
      var au = cAuthApa(a);
      var ds =
        "(" +
        (type === "web" && dt && dt.m
          ? dt.y + ", " + MON_L[dt.m - 1] + (dt.d ? " " + dt.d : "")
          : yr) +
        ").";
      if (type === "web") {
        if (au) parts = [cDot(au), ds, cItal(T)];
        else parts = [cItal(T), ds];
        if (C) parts.push(cDot(C));
        if (U) parts.push(U);
      } else if (type === "book") {
        if (au) parts = [cDot(au), ds, cItal(T)];
        else parts = [cItal(T), ds];
        if (P) parts.push(cDot(P));
        if (U) parts.push(U);
      } else {
        var jr =
          "*" +
          C +
          "*" +
          (V ? ", *" + V + "*" + (I ? "(" + I + ")" : "") : "") +
          (Pg ? ", " + Pg : "") +
          ".";
        if (au) parts = [cDot(au), ds, cDot(T)];
        else parts = [cDot(T), ds];
        if (C) parts.push(jr);
        if (U) parts.push(U);
      }
    } else if (style === "mla") {
      var am = cAuthMla(a);
      var md = function (d) {
        return !d
          ? ""
          : d.d
          ? d.d + " " + MON_S[d.m - 1] + " " + d.y
          : d.m
          ? MON_S[d.m - 1] + " " + d.y
          : String(d.y);
      };
      if (am) parts.push(cDot(am));
      if (type === "web") {
        parts.push(cQuote(T));
        var pc = [];
        if (C) pc.push("*" + C + "*");
        if (dt) pc.push(md(dt));
        if (U) pc.push(U);
        if (pc.length) parts.push(pc.join(", ") + ".");
        var acc = cDate(f.accessed);
        if (acc && acc.m) parts.push("Accessed " + md(acc) + ".");
      } else if (type === "book") {
        parts.push(cItal(T));
        parts.push((P ? P + ", " : "") + (dt ? yr : "n.d.") + ".");
        if (U) parts.push(U + ".");
      } else {
        parts.push(cQuote(T));
        var jc = [];
        if (C) jc.push("*" + C + "*");
        if (V) jc.push("vol. " + V);
        if (I) jc.push("no. " + I);
        if (dt) jc.push(yr);
        if (Pg) jc.push((/[-\u2013]/.test(Pg) ? "pp. " : "p. ") + Pg);
        if (U) jc.push(U);
        if (jc.length) parts.push(jc.join(", ") + ".");
      }
    } else {
      var ac = cAuthChi(a);
      if (ac) parts.push(cDot(ac));
      if (type === "web") {
        parts.push(cQuote(T));
        if (C) parts.push(cDot(C));
        if (dt)
          parts.push(
            cDot(
              dt.m
                ? MON_L[dt.m - 1] + (dt.d ? " " + dt.d + "," : "") + " " + dt.y
                : String(dt.y)
            )
          );
        if (U) parts.push(U + ".");
      } else if (type === "book") {
        parts.push(cItal(T));
        parts.push((City ? City + ": " : "") + (P ? P + ", " : "") + yr + ".");
        if (U) parts.push(U + ".");
      } else {
        parts.push(cQuote(T));
        parts.push(
          "*" +
            C +
            "*" +
            (V ? " " + V : "") +
            (I ? ", no. " + I : "") +
            " (" +
            yr +
            ")" +
            (Pg ? ": " + Pg : "") +
            "."
        );
        if (U) parts.push(U + ".");
      }
    }
    return parts.join(" ");
  }
  function copyText(t) {
    function fb() {
      try {
        var ta = document.createElement("textarea");
        ta.value = t;
        ta.style.cssText = "position:fixed;opacity:0;left:-999px";
        document.body.append(ta);
        ta.select();
        var ok = document.execCommand("copy");
        ta.remove();
        return ok;
      } catch (e) {
        return false;
      }
    }
    var p;
    try {
      p =
        navigator.clipboard && navigator.clipboard.writeText
          ? navigator.clipboard.writeText(t)
          : Promise.reject();
    } catch (e) {
      p = Promise.reject();
    }
    return p.then(
      function () {
        return true;
      },
      function () {
        return fb();
      }
    );
  }
  function appCite(w) {
    var type = "web",
      style = "apa";
    var typeSel = el(
      "select",
      {
        class: "in",
        onchange: function () {
          type = this.value;
          layout();
          upd();
        },
      },
      [
        ["web", "Website"],
        ["book", "Book"],
        ["journal", "Journal article"],
      ].map(function (o) {
        return el("option", { value: o[0] }, o[1]);
      })
    );
    var styleSel = el(
      "select",
      {
        class: "in",
        onchange: function () {
          style = this.value;
          layout();
          upd();
        },
      },
      [
        ["apa", "APA 7"],
        ["mla", "MLA 9"],
        ["chicago", "Chicago"],
      ].map(function (o) {
        return el("option", { value: o[0] }, o[1]);
      })
    );
    var F = {};
    function field(key, label, ph, area) {
      var inp = area
        ? el("textarea", {
            class: "in",
            rows: 2,
            placeholder: ph,
            style: "resize:vertical",
          })
        : el("input", { class: "in", placeholder: ph });
      inp.addEventListener("input", upd);
      F[key] = inp;
      var box = el("div", { class: "cite-f" }, el("label", null, label), inp);
      box._key = key;
      return box;
    }
    var boxes = [
      field(
        "authors",
        "Authors (one per line: Last, First)",
        "Smith, Jane\nLee, Chris",
        true
      ),
      field("title", "Title", "Title of the page, book or article"),
      field("container", "Website name", "e.g. National Geographic"),
      field("date", "Date or year", "2024-03-15 or 2024"),
      field("url", "URL or DOI", "https://\u2026"),
      field("vol", "Volume", "12"),
      field("issue", "Issue", "3"),
      field("pages", "Pages", "45-67"),
      field("publisher", "Publisher", "e.g. Oxford University Press"),
      field("city", "City (Chicago)", "New York"),
      field("accessed", "Accessed date (MLA, optional)", "2025-01-20"),
    ];
    var byKey = {};
    boxes.forEach(function (b) {
      byKey[b._key] = b;
    });
    var form = el("div", { class: "col", style: "gap:6px" }, boxes);
    var out = el(
      "div",
      { class: "sunk cite-out" },
      "Fill in the fields to build a citation."
    );
    var bibBox = el("div", {
      class: "sunk list",
      style: "flex:none;min-height:90px;max-height:200px;margin:0",
    });
    var cur = "";
    function layout() {
      var show = { authors: 1, title: 1, date: 1, url: 1 };
      if (type === "web") {
        show.container = 1;
        if (style === "mla") show.accessed = 1;
      }
      if (type === "book") {
        show.publisher = 1;
        if (style === "chicago") show.city = 1;
      }
      if (type === "journal") {
        show.container = 1;
        show.vol = 1;
        show.issue = 1;
        show.pages = 1;
      }
      boxes.forEach(function (b) {
        b.hidden = !show[b._key];
      });
      byKey.container.firstChild.textContent =
        type === "journal" ? "Journal name" : "Website name";
      F.container.placeholder =
        type === "journal" ? "e.g. Nature" : "e.g. National Geographic";
    }
    function vals() {
      var o = {};
      for (var k in F) o[k] = F[k].value;
      return o;
    }
    function upd() {
      cur = formatCite(style, type, vals());
      if (cur) out.innerHTML = citeHtml(cur);
      else out.textContent = "Fill in the fields to build a citation.";
    }
    function drawBib() {
      bibBox.textContent = "";
      if (!S.bib.length)
        bibBox.append(
          el("div", { class: "dim" }, "Your bibliography is empty.")
        );
      S.bib
        .slice()
        .sort(function (a, b) {
          return citePlain(a.text).toLowerCase() <
            citePlain(b.text).toLowerCase()
            ? -1
            : 1;
        })
        .forEach(function (b) {
          var t = el("div", { class: "t cite-bib" });
          t.innerHTML = citeHtml(b.text);
          bibBox.append(
            el(
              "div",
              { class: "lrow", style: "align-items:flex-start" },
              t,
              el(
                "button",
                {
                  class: "btn xs",
                  "aria-label": "Remove",
                  onclick: function () {
                    softDelete("bib", function (x) {
                      return x.id === b.id;
                    });
                  },
                },
                "X"
              )
            )
          );
        });
    }
    function sortedPlain() {
      return S.bib
        .slice()
        .sort(function (a, b) {
          return citePlain(a.text).toLowerCase() <
            citePlain(b.text).toLowerCase()
            ? -1
            : 1;
        })
        .map(function (b) {
          return citePlain(b.text);
        });
    }
    function note(t) {
      msgBox({ title: "Citation Maker", icon: "info", text: t });
    }
    w.body.append(
      el(
        "div",
        {
          class: "col",
          style: "flex:1;min-height:0;padding:6px;gap:6px;overflow:auto",
        },
        el(
          "div",
          { class: "row", style: "gap:6px;align-items:center;flex-wrap:wrap" },
          el("span", null, "Source:"),
          typeSel,
          el("span", null, "Style:"),
          styleSel
        ),
        form,
        out,
        el(
          "div",
          { class: "row", style: "gap:6px;flex-wrap:wrap" },
          el(
            "button",
            {
              class: "btn sm",
              onclick: function () {
                if (!cur) {
                  note("Fill in at least a title first.");
                  return;
                }
                copyText(citePlain(cur)).then(function (ok) {
                  note(
                    ok ? "Citation copied." : "Couldn't copy automatically."
                  );
                });
              },
            },
            "Copy"
          ),
          el(
            "button",
            {
              class: "btn sm",
              onclick: function () {
                if (!cur) {
                  note("Fill in at least a title first.");
                  return;
                }
                if (S.bib.length >= 300) return;
                S.bib.push({ id: uid(), text: clip(cur, 1500), style: style });
                save();
                refreshAll();
              },
            },
            "Add to bibliography"
          )
        ),
        el("div", { style: "font-weight:bold;margin-top:4px" }, "Bibliography"),
        bibBox,
        el(
          "div",
          { class: "row", style: "gap:6px;flex-wrap:wrap" },
          el(
            "button",
            {
              class: "btn sm",
              onclick: function () {
                if (!S.bib.length) return;
                copyText(sortedPlain().join("\n\n")).then(function (ok) {
                  note(ok ? "Bibliography copied." : "Couldn't copy.");
                });
              },
            },
            "Copy all"
          ),
          el(
            "button",
            {
              class: "btn sm",
              onclick: function () {
                if (!S.bib.length) return;
                S.notes.push({
                  id: uid(),
                  text: "Bibliography\n\n" + sortedPlain().join("\n\n"),
                  updated: Date.now(),
                });
                save();
                refreshAll();
                note("Saved to a new note in Notepad.");
              },
            },
            "Save to Notepad"
          )
        ),
        el(
          "div",
          { class: "dim", style: "padding:0" },
          "These follow the common formats, but always double-check against your instructor's style guide."
        )
      )
    );
    w.refresh = drawBib;
    layout();
    upd();
    drawBib();
  }

  /* ================= APP: FIND ================= */
  function appFind(w) {
    var q = el("input", {
      class: "in",
      placeholder: "Search notes, tasks, assignments, cards\u2026",
      style: "flex:1",
    });
    var list = el("div", { class: "sunk list", style: "margin-top:0" });
    w.body.append(el("div", { class: "row form" }, q), list);
    function hit(t, n) {
      return (
        String(t || "")
          .toLowerCase()
          .indexOf(n) >= 0
      );
    }
    function snip(t, n) {
      t = String(t || "");
      var i = t.toLowerCase().indexOf(n),
        a = Math.max(0, i - 30);
      return (
        (a > 0 ? "\u2026" : "") +
        t.slice(a, a + 90).replace(/\s+/g, " ") +
        (t.length > a + 90 ? "\u2026" : "")
      );
    }
    function run() {
      list.textContent = "";
      var n = q.value.trim().toLowerCase();
      if (n.length < 2) {
        list.append(
          el(
            "div",
            { class: "dim" },
            "Type at least two letters to search everything in FocusDesk 96."
          )
        );
        w.status("");
        return;
      }
      var res = [];
      S.notes.forEach(function (x) {
        if (hit(x.text, n))
          res.push({
            t: "Note",
            s: snip(x.text, n),
            go: function () {
              openNoteViewer(x.id);
            },
          });
      });
      S.tasks.forEach(function (x) {
        if (hit(x.text, n))
          res.push({
            t: "Task",
            s: x.text + (x.done ? " (done)" : ""),
            go: function () {
              openApp("tasks");
            },
          });
      });
      S.assign.forEach(function (x) {
        if (hit(x.title, n) || hit(x.course, n))
          res.push({
            t: "Assignment",
            s:
              (x.course ? "[" + x.course + "] " : "") +
              x.title +
              " \u2013 due " +
              whenStr(x.due, x.allDay),
            go: function () {
              openAssignmentViewer(x.id);
            },
          });
      });
      S.events.forEach(function (x) {
        if (hit(x.title, n))
          res.push({
            t: "Event",
            s: x.title + " \u2013 " + x.date,
            go: function () {
              openApp("calendar");
            },
          });
      });
      S.reminders.forEach(function (x) {
        if (hit(x.text, n))
          res.push({
            t: "Reminder",
            s: x.text + " \u2013 " + whenStr(x.at),
            go: function () {
              openApp("reminders");
            },
          });
      });
      S.classes.forEach(function (x) {
        if (hit(x.name, n) || hit(x.room, n))
          res.push({
            t: "Class",
            s: x.name + (x.room ? " (" + x.room + ")" : ""),
            go: function () {
              openApp("schedule");
            },
          });
      });
      S.cards.forEach(function (x) {
        if (hit(x.q, n) || hit(x.a, n))
          res.push({
            t: "Card",
            s: x.q + "  \u2192  " + x.a,
            go: function () {
              openApp("games");
            },
          });
      });
      S.grades.forEach(function (x) {
        if (hit(x.name, n))
          res.push({
            t: "Course",
            s: x.name,
            go: function () {
              openApp("grades");
            },
          });
      });
      S.habits.forEach(function (x) {
        if (hit(x.name, n))
          res.push({
            t: "Habit",
            s: x.name,
            go: function () {
              openApp("habits");
            },
          });
      });
      S.countdowns.forEach(function (x) {
        if (hit(x.name, n))
          res.push({
            t: "Countdown",
            s: x.name + " \u2013 " + x.date,
            go: function () {
              openApp("countdown");
            },
          });
      });
      S.bib.forEach(function (x) {
        if (hit(x.text, n))
          res.push({
            t: "Citation",
            s: citePlain(x.text).slice(0, 120),
            go: function () {
              openApp("cite");
            },
          });
      });
      S.folders.forEach(function (x) {
        if (hit(x.name, n))
          res.push({
            t: "Folder",
            s: x.name,
            go: function () {
              openApp("folders");
            },
          });
      });
      if (!res.length)
        list.append(
          el(
            "div",
            { class: "dim" },
            "Nothing found for \u201c" + clip(q.value.trim(), 40) + "\u201d."
          )
        );
      res.slice(0, 80).forEach(function (r) {
        list.append(
          el(
            "div",
            { class: "lrow", style: "cursor:default", onclick: r.go },
            el("span", { class: "tag" }, r.t),
            el("span", { class: "t" }, r.s)
          )
        );
      });
      w.status(
        res.length + " result(s)" + (res.length > 80 ? " (showing 80)" : "")
      );
    }
    q.addEventListener("input", run);
    w.refresh = null;
    run();
    setTimeout(function () {
      q.focus();
    }, 0);
  }

  /* ================= APP: HABITS ================= */
  function appHabits(w) {
    var nm = el("input", {
      class: "in",
      placeholder: "New habit (e.g. Read 30 minutes)",
      style: "flex:1 1 170px",
    });
    var box = el("div", { class: "sunk list" });
    function add() {
      var v = nm.value.trim();
      if (!v) {
        nm.focus();
        return;
      }
      if (S.habits.length >= 40) return;
      S.habits.push({ id: uid(), name: clip(v, 60), log: {} });
      nm.value = "";
      save();
      refreshAll();
    }
    onEnter(nm, add);
    var dayCount = 7;
    var toggle = el("div", { class: "row", style: "gap:4px" });
    var boxWrap = el("div", { class: "col", style: "flex:1;min-height:0" });
    function paintToggle() {
      toggle.textContent = "";
      [
        [7, "7 days"],
        [14, "14 days"],
        [30, "30 days"],
        [90, "90 days"],
      ].forEach(function (o) {
        toggle.append(
          el(
            "button",
            {
              class: "btn sm" + (dayCount === o[0] ? " on" : ""),
              onclick: function () {
                dayCount = o[0];
                paintToggle();
                draw();
              },
            },
            o[1]
          )
        );
      });
    }
    function bestStreak(h) {
      var keys = Object.keys(h.log).sort(),
        best = 0,
        run = 0,
        prev = null;
      keys.forEach(function (k) {
        if (prev) {
          var pd = new Date(prev + "T00:00"),
            cd = new Date(k + "T00:00");
          if (Math.round((cd - pd) / 86400000) === 1) run++;
          else run = 1;
        } else run = 1;
        if (run > best) best = run;
        prev = k;
      });
      return best;
    }
    function hstreak(h) {
      var d = new Date();
      if (!h.log[ymd(d)]) d.setDate(d.getDate() - 1);
      var n = 0;
      while (h.log[ymd(d)] && n < 2000) {
        n++;
        d.setDate(d.getDate() - 1);
      }
      return n;
    }
    function cellFor(h, d) {
      var k = ymd(d);
      var entry = h.log[k];
      var on = !!entry;
      var note = isObj(entry) && isStr(entry.note) ? entry.note : "";
      return el(
        "button",
        {
          class: "btn hb-cell" + (on ? " on" : "") + (note ? " has-note" : ""),
          "aria-label": h.name + " on " + k,
          title: note ? "Note: " + note : on ? "Done" : "Not done",
          onclick: function () {
            if (on) delete h.log[k];
            else h.log[k] = { done: 1, note: "" };
            save();
            refreshAll();
          },
          oncontextmenu: function (e) {
            e.preventDefault();
            e.stopPropagation();
            popMenu(e.clientX, e.clientY, [
              {
                label: on ? "Mark not done" : "Mark done",
                fn: function () {
                  if (on) delete h.log[k];
                  else h.log[k] = { done: 1, note: note };
                  save();
                  refreshAll();
                },
              },
              { sep: 1 },
              {
                label: note ? "Edit note\u2026" : "Add note\u2026",
                fn: function () {
                  askText(
                    "Habit note",
                    "What happened on " + k + "?",
                    note,
                    function (v) {
                      if (!h.log[k]) h.log[k] = { done: 1 };
                      if (isObj(h.log[k])) h.log[k].note = clip(v, 200);
                      else h.log[k] = { done: 1, note: clip(v, 200) };
                      save();
                      refreshAll();
                    }
                  );
                },
              },
              {
                label: "Clear note",
                dis: !note,
                fn: function () {
                  if (isObj(h.log[k])) h.log[k].note = "";
                  save();
                  refreshAll();
                },
              },
            ]);
          },
        },
        on ? "\u2713" : ""
      );
    }
    function draw() {
      box.textContent = "";
      if (!S.habits.length) {
        box.append(
          el(
            "div",
            { class: "dim" },
            "No habits yet. Add one above, then tick each day you do it."
          )
        );
        w.status("");
        return;
      }
      var days = [];
      for (var i = dayCount - 1; i >= 0; i--) {
        var d = new Date();
        d.setDate(d.getDate() - i);
        days.push(d);
      }
      box.append(
        el(
          "div",
          { class: "hb-row hb-head" },
          el("span", { class: "hb-n" }, "Habit"),
          days.map(function (d) {
            return el(
              "span",
              { class: "hb-c" },
              DAYS[d.getDay()].charAt(0) + d.getDate()
            );
          }),
          el("span", { class: "hb-s" }, "Streak"),
          el("span", { style: "width:22px" })
        )
      );
      var done = 0;
      S.habits.forEach(function (h) {
        if (h.log[ymd(new Date())]) done++;
        box.append(
          el(
            "div",
            { class: "hb-row" },
            el("span", { class: "hb-n" }, h.name),
            days.map(function (d) {
              return cellFor(h, d);
            }),
            el(
              "span",
              { class: "hb-s", title: "Current / best streak" },
              hstreak(h) + "d / " + bestStreak(h) + "d"
            ),
            el(
              "button",
              {
                class: "btn xs",
                "aria-label": "Delete habit",
                onclick: function () {
                  msgBox({
                    title: "Delete Habit",
                    icon: "q",
                    text:
                      'Move "' +
                      h.name +
                      '" and its history to the Recycle Bin?',
                    buttons: [
                      {
                        label: "Yes",
                        fn: function () {
                          softDelete("habits", function (x) {
                            return x.id === h.id;
                          });
                        },
                      },
                      { label: "No" },
                    ],
                  });
                },
              },
              "X"
            )
          )
        );
      });
      var today = new Date();
      var monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      var mDays = 0,
        mHit = 0,
        totalHit = 0,
        totalPossible = 0;
      S.habits.forEach(function (h) {
        for (var q = 0; q < dayCount; q++) {
          var dd = new Date(today);
          dd.setDate(today.getDate() - q);
          if (dd < monthStart) continue;
          mDays++;
          if (h.log[ymd(dd)]) mHit++;
        }
        Object.keys(h.log).forEach(function (k) {
          totalHit++;
        });
      });
      mDays = S.habits.length * Math.min(today.getDate(), 31);
      totalPossible = S.habits.length * dayCount;
      var mPct = mDays ? Math.round((mHit / mDays) * 100) : 0;
      var wPct = totalPossible
        ? Math.round((totalHit / totalPossible) * 100)
        : 0;
      box.append(
        el(
          "div",
          { class: "hb-sum" },
          "This month: " +
            mHit +
            "/" +
            mDays +
            " (" +
            mPct +
            "%)   \u00b7   Last " +
            dayCount +
            " days: " +
            totalHit +
            "/" +
            totalPossible +
            " (" +
            wPct +
            "%)"
        )
      );
      w.status(
        done +
          " of " +
          S.habits.length +
          " done today \u2014 right-click a cell for notes"
      );
    }
    paintToggle();
    boxWrap.append(box);
    w.body.append(
      el(
        "div",
        { class: "row form" },
        nm,
        el("button", { class: "btn sm", onclick: add }, "Add")
      ),
      el("div", { style: "padding:0 6px 4px" }, toggle),
      boxWrap
    );
    w.refresh = draw;
    draw();
  }

  /* ================= 2.7: APP: HABIT BREAKER ================= */
  function dayDiff(a, b) {
    return Math.round((new Date(b + "T00:00") - new Date(a + "T00:00")) / 86400000);
  }
  /* Clean days run from the start date to today; a logged slip breaks the run. */
  function breakerRuns(b) {
    var today = ymd(new Date()),
      start = b.start > today ? today : b.start,
      n = dayDiff(start, today),
      run = 0,
      best = 0,
      slips = 0;
    for (var i = 0; i <= n; i++) {
      var d = new Date(start + "T00:00");
      d.setDate(d.getDate() + i);
      if (b.log[ymd(d)]) {
        run = 0;
        slips++;
      } else {
        run++;
        if (run > best) best = run;
      }
    }
    return { run: run, best: best, slips: slips };
  }
  function appBreaker(w) {
    var nm = el("input", {
      class: "in",
      placeholder: "Habit to quit (e.g. Energy drinks)",
      style: "flex:1 1 170px",
    });
    var dt = el("input", {
      class: "in",
      type: "date",
      value: ymd(new Date()),
      title: "Quit date (your first clean day)",
      style: "width:134px",
    });
    var box = el("div", { class: "sunk list" });
    var dayCount = 7,
      toggle = el("div", { class: "row", style: "gap:4px" });
    function add() {
      var v = nm.value.trim();
      if (!v) {
        nm.focus();
        return;
      }
      if (S.breakers.length >= 40) return;
      var st = /^\d{4}-\d{2}-\d{2}$/.test(dt.value) ? dt.value : ymd(new Date());
      if (st > ymd(new Date())) st = ymd(new Date());
      S.breakers.push({ id: uid(), name: clip(v, 60), start: st, log: {}, record: 0 });
      nm.value = "";
      save();
      refreshAll();
    }
    onEnter(nm, add);
    function paintToggle() {
      toggle.textContent = "";
      [[7, "7 days"], [14, "14 days"], [30, "30 days"]].forEach(function (o) {
        toggle.append(
          el(
            "button",
            {
              class: "btn sm" + (dayCount === o[0] ? " on" : ""),
              onclick: function () {
                dayCount = o[0];
                paintToggle();
                draw();
              },
            },
            o[1]
          )
        );
      });
    }
    function checkRecord(b) {
      var r = breakerRuns(b);
      if (r.run > b.record) {
        var old = b.record;
        b.record = r.run;
        save();
        if (old >= 3) {
          S.ach._rec = Date.now();
          msgBox({
            title: "New Record!",
            icon: "bulb",
            text:
              "\u201c" + b.name + "\u201d: " + r.run + " clean days in a row. That's longer than your previous best of " + old + ". Nicely done \u2014 keep it going.",
          });
        }
      }
    }
    function slipLog(b) {
      var keys = Object.keys(b.log).sort().reverse(),
        wk = [0, 0, 0, 0, 0, 0, 0];
      keys.forEach(function (k) {
        wk[new Date(k + "T00:00").getDay()]++;
      });
      var top = Math.max.apply(null, wk),
        bars = el("div", { class: "tod-bars", style: "height:64px" });
      wk.forEach(function (n, i) {
        bars.append(
          el(
            "div",
            { class: "tod-col", title: DAYS[i] + ": " + n + " slip" + (n === 1 ? "" : "s") },
            el("div", { class: "tod-bar" + (n === top && n > 0 ? " risk" : ""), style: "height:" + Math.round((n / Math.max(top, 1)) * 100) + "%" }),
            el("span", { style: "font-size:10px" }, DAYS[i].charAt(0))
          )
        );
      });
      var note = el("textarea", {
        class: "in",
        rows: 3,
        placeholder: "Notes about this habit: why you're quitting, what helps, what to watch for\u2026",
        style: "width:100%;resize:vertical;margin-top:2px",
        oninput: function () {
          b.note = clip(this.value, 500);
          save();
        },
      });
      note.value = b.note || "";
      var list = el("div", { style: "max-height:130px;overflow:auto;text-align:left" });
      if (!keys.length) list.append(el("div", { class: "dim" }, "No slips logged. Clean so far."));
      keys.forEach(function (k) {
        var nt = b.log[k] && b.log[k].note;
        list.append(
          el(
            "div",
            { style: "padding:3px 0;border-bottom:1px solid #d0d0d0" },
            el("b", null, k + " (" + DAYS[new Date(k + "T00:00").getDay()] + ")"),
            nt ? " \u2014 " + nt : el("span", { class: "dim" }, "  (no note)")
          )
        );
      });
      var r = breakerRuns(b),
        hint = top > 0 ? "Most slips: " + DAYS[wk.indexOf(top)] + " (" + top + "). " : "";
      msgBox({
        title: "Habit: " + b.name,
        icon: "info",
        width: 440,
        text: "Quit date " + b.start + " \u00b7 clean run " + r.run + "d \u00b7 best " + r.best + "d \u00b7 " + keys.length + " slip" + (keys.length === 1 ? "" : "s") + ". " + hint,
        extra: el(
          "div",
          { style: "text-align:left" },
          el("b", null, "Slips by weekday"),
          bars,
          el("b", { style: "display:block;margin-top:8px" }, "Notes"),
          note,
          el("b", { style: "display:block;margin-top:8px" }, "Slip log"),
          list
        ),
        buttons: [
          {
            label: "Change quit date\u2026",
            fn: function () {
              askText("Quit date", "The first day without it (YYYY-MM-DD):", b.start, function (v) {
                v = String(v || "").trim();
                if (!/^\d{4}-\d{2}-\d{2}$/.test(v) || isNaN(new Date(v + "T00:00")) || v > ymd(new Date())) {
                  msgBox({ title: "Quit date", icon: "warn", text: "Use a date like 2026-10-01 that isn't in the future." });
                  return;
                }
                b.start = v;
                save();
                refreshAll();
              });
            },
          },
          { label: "Close" },
        ],
      });
    }
    function cellFor(b, d, today) {
      var k = ymd(d),
        entry = b.log[k],
        slip = !!entry,
        before = k < b.start,
        future = k > today,
        note = slip && isStr(entry.note) ? entry.note : "";
      return el(
        "button",
        {
          class:
            "btn hb-cell" + (slip ? " slip" : !before && !future ? " on" : "") + (note ? " has-note" : ""),
          disabled: before || future,
          "aria-label": b.name + " on " + k,
          title: before ? "Before your quit date" : future ? "" : slip ? "Slip" + (note ? ": " + note : "") + " (click to undo)" : "Clean day (click to log a slip)",
          onclick: function () {
            if (slip) delete b.log[k];
            else b.log[k] = { note: "" };
            save();
            refreshAll();
          },
          oncontextmenu: function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (before || future) return;
            popMenu(e.clientX, e.clientY, [
              {
                label: slip ? "Edit what triggered it\u2026" : "Log a slip with a note\u2026",
                fn: function () {
                  askText("Slip on " + k, "What triggered it?", note, function (v) {
                    b.log[k] = { note: clip(v, 200) };
                    save();
                    refreshAll();
                  });
                },
              },
              {
                label: "Clear slip",
                dis: !slip,
                fn: function () {
                  delete b.log[k];
                  save();
                  refreshAll();
                },
              },
            ]);
          },
        },
        before || future ? "" : slip ? "\u2717" : "\u2713"
      );
    }
    function draw() {
      box.textContent = "";
      if (!S.breakers.length) {
        box.append(el("div", { class: "dim" }, "Nothing here yet. Add a habit you want to quit and set the day you stopped. Every day without a slip is a clean day."));
        w.status("");
        return;
      }
      var today = ymd(new Date()),
        days = [];
      for (var i = dayCount - 1; i >= 0; i--) {
        var d = new Date();
        d.setDate(d.getDate() - i);
        days.push(d);
      }
      box.append(
        el(
          "div",
          { class: "hb-row hb-head" },
          el("span", { class: "hb-n", style: "min-width:84px" }, "Habit"),
          days.map(function (d) {
            return el("span", { class: "hb-c" }, DAYS[d.getDay()].charAt(0) + d.getDate());
          }),
          el("span", { class: "hb-s" }, "Days since"),
          el("span", { style: "width:46px" })
        )
      );
      var cleanToday = 0;
      S.breakers.forEach(function (b) {
        var r = breakerRuns(b);
        if (!b.log[today]) cleanToday++;
        box.append(
          el(
            "div",
            { class: "hb-row" },
            el("span", { class: "hb-n", style: "min-width:84px", title: "Quit date " + b.start + (b.note ? "\n" + b.note : "") }, b.name),
            days.map(function (d) {
              return cellFor(b, d, today);
            }),
            el("span", { class: "hb-s", title: "Current clean run / best run" }, r.run + "d / " + r.best + "d"),
            el("button", { class: "btn xs", "aria-label": "Slip log", title: "Slip log", onclick: function () { slipLog(b); } }, "\u2630"),
            el(
              "button",
              {
                class: "btn xs",
                "aria-label": "Delete habit",
                onclick: function () {
                  msgBox({
                    title: "Delete Habit",
                    icon: "q",
                    text: 'Move "' + b.name + '" and its history to the Recycle Bin?',
                    buttons: [
                      {
                        label: "Yes",
                        fn: function () {
                          softDelete("breakers", function (x) {
                            return x.id === b.id;
                          });
                        },
                      },
                      { label: "No" },
                    ],
                  });
                },
              },
              "X"
            )
          )
        );
        checkRecord(b);
      });
      w.status(cleanToday + " of " + S.breakers.length + " clean today \u2014 click a day to log a slip, right-click to add a note");
    }
    paintToggle();
    w.body.append(
      el("div", { class: "row form" }, nm, dt, el("button", { class: "btn sm", onclick: add }, "Add")),
      el("div", { style: "padding:0 6px 4px" }, toggle),
      el("div", { class: "col", style: "flex:1;min-height:0" }, box)
    );
    w.refresh = draw;
    draw();
  }

  /* ================= 2.7: ACHIEVEMENTS ================= */
  function longestStudyStreak() {
    var keys = Object.keys(S.stats)
        .filter(function (k) {
          return S.stats[k].sessions > 0;
        })
        .sort(),
      best = 0,
      run = 0,
      prev = null;
    keys.forEach(function (k) {
      run = prev && dayDiff(prev, k) === 1 ? run + 1 : 1;
      if (run > best) best = run;
      prev = k;
    });
    return best;
  }
  function achBadge() {
    var b = pix("trophy", 32);
    b.classList.add("ach-badge");
    return b;
  }
  function achCtx() {
    var c = { sessions: 0, minutes: 0 };
    Object.keys(S.stats).forEach(function (k) {
      c.sessions += S.stats[k].sessions || 0;
      c.minutes += S.stats[k].minutes || 0;
    });
    c.streak = longestStudyStreak();
    c.habits = S.habits.length;
    c.habitBest = 0;
    S.habits.forEach(function (h) {
      var keys = Object.keys(h.log).sort(),
        run = 0,
        prev = null;
      keys.forEach(function (k) {
        run = prev && dayDiff(prev, k) === 1 ? run + 1 : 1;
        if (run > c.habitBest) c.habitBest = run;
        prev = k;
      });
    });
    c.breakBest = 0;
    S.breakers.forEach(function (b) {
      c.breakBest = Math.max(c.breakBest, breakerRuns(b).best);
    });
    c.recordBroken = S.ach._rec ? 1 : 0;
    c.cards = S.cards.length;
    c.reviews = 0;
    S.cards.forEach(function (x) {
      c.reviews += x.reps || 0;
    });
    c.notes = S.notes.length;
    c.mathNotes = S.notes.filter(function (n) {
      return /\$[^$\n]+\$/.test(n.text || "");
    }).length;
    c.tasksDone = S.tasks.filter(function (t) {
      return t.done;
    }).length;
    c.assignDone = S.assign.filter(function (a) {
      return a.done;
    }).length;
    c.bestGrade = 0;
    S.grades.forEach(function (g) {
      var r = gradeOf(g);
      if (r.current != null && r.current > c.bestGrade) c.bestGrade = r.current;
    });
    c.g2048 = S.games.g2048 || 0;
    c.snake = S.games.snakeBest || 0;
    c.tetris = S.games.tetrisBest || 0;
    c.wpm = S.games.wpmBest || 0;
    return c;
  }
  function achDef(id, name, desc, key, goal) {
    return { id: id, n: name, d: desc, k: key, g: goal };
  }
  var ACH = [
    achDef("s1", "First Focus", "Finish a focus session", "sessions", 1),
    achDef("s10", "Warming Up", "Finish 10 focus sessions", "sessions", 10),
    achDef("s50", "In the Zone", "Finish 50 focus sessions", "sessions", 50),
    achDef("s100", "Centurion", "Finish 100 focus sessions", "sessions", 100),
    achDef("s250", "Marathoner", "Finish 250 focus sessions", "sessions", 250),
    achDef("h10", "Ten Hours", "Study for 10 hours in total", "minutes", 600),
    achDef("h50", "Fifty Hours", "Study for 50 hours in total", "minutes", 3000),
    achDef("h100", "Hundred Hours", "Study for 100 hours in total", "minutes", 6000),
    achDef("st3", "Hat Trick", "Study 3 days in a row", "streak", 3),
    achDef("st7", "Full Week", "Study 7 days in a row", "streak", 7),
    achDef("st14", "Fortnight", "Study 14 days in a row", "streak", 14),
    achDef("st30", "Unstoppable", "Study 30 days in a row", "streak", 30),
    achDef("c10", "Deck Builder", "Make 10 flash cards", "cards", 10),
    achDef("r50", "Flashy", "Review cards 50 times", "reviews", 50),
    achDef("r250", "Sharp Memory", "Review cards 250 times", "reviews", 250),
    achDef("r1000", "Memory Palace", "Review cards 1000 times", "reviews", 1000),
    achDef("hb1", "Habit Former", "Start tracking a habit", "habits", 1),
    achDef("hb7", "Week Strong", "Keep a habit going for 7 days", "habitBest", 7),
    achDef("hb30", "Month Strong", "Keep a habit going for 30 days", "habitBest", 30),
    achDef("br7", "Clean Week", "7 clean days in a row with Habit Breaker", "breakBest", 7),
    achDef("br30", "Clean Month", "30 clean days in a row with Habit Breaker", "breakBest", 30),
    achDef("brr", "Record Breaker", "Beat your own best clean run", "recordBroken", 1),
    achDef("n10", "Scribe", "Keep 10 notes", "notes", 10),
    achDef("math", "Mathematician", "Write a note with LaTeX in it", "mathNotes", 1),
    achDef("t25", "Taskmaster", "Complete 25 tasks", "tasksDone", 25),
    achDef("as10", "Homework Hero", "Complete 10 assignments", "assignDone", 10),
    achDef("gr90", "Honor Roll", "Reach 90% in a course", "bestGrade", 90),
    achDef("g2048", "2048!", "Reach the 2048 tile", "g2048", 2048),
    achDef("snk", "Snake Charmer", "Score 20 in Snake", "snake", 20),
    achDef("wpm", "Fast Fingers", "Type 60 words per minute", "wpm", 60),
  ];
  var achT = 0;
  function checkAch() {
    var ctx = achCtx(),
      fresh = [],
      first = !S.ach._init;
    ACH.forEach(function (a) {
      if (!S.ach[a.id] && ctx[a.k] >= a.g) {
        S.ach[a.id] = Date.now();
        fresh.push(a);
      }
    });
    if (first) S.ach._init = 1;
    if (!fresh.length && !first) return;
    save();
    refreshAll();
    if (!fresh.length) return;
    chime();
    var list = el("div", { style: "text-align:left;max-height:220px;overflow:auto" });
    fresh.slice(0, 8).forEach(function (a) {
      list.append(
        el(
          "div",
          { class: "ach-row" },
          achBadge(),
          el("div", null, el("b", null, a.n), el("div", { class: "dim", style: "padding:0" }, a.d))
        )
      );
    });
    if (fresh.length > 8) list.append(el("div", { class: "dim" }, "\u2026and " + (fresh.length - 8) + " more."));
    msgBox({
      title: first ? "Achievements" : "Achievement Unlocked!",
      icon: "bulb",
      silent: true,
      width: 360,
      text: first
        ? "Welcome to Achievements! You've already earned " + fresh.length + " badge" + (fresh.length === 1 ? "" : "s") + ":"
        : fresh.length === 1
        ? "You earned a new badge:"
        : "You earned " + fresh.length + " new badges:",
      extra: list,
    });
  }
  function appAch(w) {
    var list = el("div", { class: "sunk list" });
    function draw() {
      list.textContent = "";
      var ctx = achCtx(),
        have = 0;
      ACH.forEach(function (a) {
        var got = S.ach[a.id],
          cur = Math.min(a.g, Math.floor(ctx[a.k] || 0));
        if (got) have++;
        list.append(
          el(
            "div",
            { class: "ach-row" + (got ? "" : " locked") },
            achBadge(),
            el(
              "div",
              { style: "flex:1" },
              el("b", null, a.n),
              el("div", { class: "dim", style: "padding:0" }, a.d),
              got
                ? el("div", { style: "font-size:11px;color:#006000" }, "Unlocked " + new Date(got).toLocaleDateString())
                : el("div", { style: "font-size:11px;color:#606060" }, (a.k === "minutes" ? Math.floor(cur / 60) + " / " + a.g / 60 + " h" : cur + " / " + a.g))
            )
          )
        );
      });
      w.status(have + " of " + ACH.length + " unlocked");
    }
    w.body.append(el("div", { class: "col", style: "flex:1;min-height:0" }, list));
    w.refresh = draw;
    draw();
  }

  /* ================= 2.7: FOCUS SESSION LOG VIEWS ================= */
  function hm12(d) {
    var h = d.getHours(),
      m = d.getMinutes();
    return (h % 12 || 12) + ":" + (m < 10 ? "0" : "") + m + (h < 12 ? " AM" : " PM");
  }
  function hourLabel(h) {
    return (h % 12 || 12) + (h < 12 ? " AM" : " PM");
  }
  function drawTod(box) {
    box.textContent = "";
    var hrs = [];
    for (var i = 0; i < 24; i++) hrs.push(0);
    var count = S.sessions.length;
    S.sessions.forEach(function (s) {
      hrs[new Date(s.t - s.m * 60000).getHours()] += s.m;
    });
    if (count < 5) {
      box.append(
        el("div", { class: "dim", style: "padding:0" }, count + " of 5 sessions logged. Finish a few focus sessions with the Focus Timer to see which hours you focus best.")
      );
      return;
    }
    var max = Math.max.apply(null, hrs),
      bestH = hrs.indexOf(max),
      bars = el("div", { class: "tod-bars" });
    hrs.forEach(function (m, h) {
      bars.append(
        el(
          "div",
          { class: "tod-col", title: hourLabel(h) + ": " + m + " min" },
          el("div", { class: "tod-bar" + (h === bestH ? " best" : ""), style: "height:" + Math.round((m / max) * 100) + "%" }),
          el("span", null, h % 3 === 0 ? String(h % 12 || 12) : "")
        )
      );
    });
    box.append(
      el("div", { style: "margin-bottom:4px" }, "Your best hour: ", el("b", null, hourLabel(bestH) + " \u2013 " + hourLabel((bestH + 1) % 24)), " (" + max + " min across " + count + " sessions)"),
      bars
    );
  }
  function weeklySessions(content, ws, we) {
    var rows = S.sessions
      .filter(function (s) {
        var st = s.t - s.m * 60000;
        return st >= ws && st < we;
      })
      .sort(function (a, b) {
        return a.t - b.t;
      });
    if (!rows.length) return;
    var b = el("div", { class: "sunk", style: "padding:8px 10px;max-height:180px;overflow:auto" });
    b.append(el("div", { style: "font-weight:bold;margin-bottom:4px;font-size:13px" }, "Focus sessions (" + rows.length + ")"));
    rows.forEach(function (s) {
      var st = new Date(s.t - s.m * 60000);
      b.append(
        el(
          "div",
          { style: "display:flex;justify-content:space-between;gap:8px;padding:2px 0;font-size:12px" },
          el("span", null, DAYS[st.getDay()] + " " + hm12(st) + " \u00b7 " + (s.l || "(no subject)")),
          el("b", null, s.m + " min")
        )
      );
    });
    content.append(b);
  }

  /* ================= 2.7: CLOZE + IMAGE OCCLUSION DIALOGS ================= */
  function newCardBase(deck, q, extra) {
    return Object.assign(
      { id: uid(), deck: clip(deck, 40), q: clip(q, 1000), a: "", box: 0, dueAt: Date.now(), interval: 0, ease: 2.5, reps: 0, lapses: 0 },
      extra || {}
    );
  }
  /* Cloze: create, or edit an existing cloze card (all cards from the same note). */
  function clozeDialog(deckName, done, edit) {
    var sibs = edit
      ? edit.grp
        ? S.cards.filter(function (c) {
            return c.grp === edit.grp && c.cloze;
          })
        : [edit]
      : [];
    var ta = el("textarea", {
      class: "in",
      rows: edit ? 3 : 6,
      placeholder: "The capital of France is {{c1::Paris}}.\n{{c1::Mitochondria}} make {{c2::ATP}}.",
      style: 'width:100%;resize:vertical;margin-top:8px;font:12px "Courier New",monospace',
    });
    if (edit) ta.value = edit.q;
    var dn = el("input", { class: "in", value: edit ? edit.deck : deckName || "Cloze", style: "width:100%;margin-top:8px" });
    msgBox({
      title: edit ? "Edit Cloze Card" : "Cloze Cards",
      icon: "info",
      width: 430,
      text: edit
        ? "Change the text or the {{c1::...}} parts. Clozes you keep keep their review history, new ones are added, and removed ones go to the Recycle Bin. Deck name:"
        : "Wrap the part to hide in {{c1::...}}. Add a hint with {{c1::answer::hint}}. Each different number (c1, c2...) on a line becomes its own card. One line per note. Deck name:",
      extra: el("div", null, dn, ta),
      buttons: [
        {
          label: edit ? "Save" : "Create",
          fn: function () {
            var deck = clip(dn.value.trim() || "Cloze", 40);
            if (edit) {
              var line = ta.value.replace(/\s*\r?\n\s*/g, " ").trim(),
                nums = clozeNums(line);
              if (!nums.length) {
                msgBox({ title: "Cloze Cards", icon: "warn", text: "The text needs at least one {{c1::...}} part." });
                return false;
              }
              var grp = edit.grp || uid();
              sibs.forEach(function (c) {
                if (nums.indexOf(c.cloze) >= 0) {
                  c.q = clip(line, 1000);
                  c.deck = deck;
                  c.grp = grp;
                } else
                  softDelete("cards", function (x) {
                    return x.id === c.id;
                  });
              });
              nums.forEach(function (num) {
                if (S.cards.length < 5000 && !sibs.some(function (c) { return c.cloze === num; }))
                  S.cards.push(newCardBase(deck, line, { cloze: num, grp: grp }));
              });
              save();
              done();
              return;
            }
            var n = 0,
              skipped = 0;
            ta.value.split(/\r?\n/).forEach(function (line) {
              line = line.trim();
              if (!line) return;
              var nums = clozeNums(line);
              if (!nums.length) {
                skipped++;
                return;
              }
              var grp = uid();
              nums.forEach(function (num) {
                if (S.cards.length >= 5000) return;
                S.cards.push(newCardBase(deck, line, { cloze: num, grp: grp }));
                n++;
              });
            });
            save();
            done();
            msgBox({
              title: "Cloze Cards",
              icon: "info",
              text: n + " card(s) created." + (skipped ? "\n" + skipped + " line(s) had no {{c1::...}} and were skipped." : ""),
            });
          },
        },
        { label: "Cancel" },
      ],
    });
  }
  /* Image occlusion: create, or edit an existing set (add or remove boxes; kept boxes keep their history). */
  function occDialog(deckName, done, edit) {
    var sibs = edit
      ? edit.grp
        ? S.cards.filter(function (c) {
            return c.grp === edit.grp && c.occ;
          })
        : [edit]
      : [];
    var imgId = edit ? edit.occ.img : null,
      boxes = edit
        ? edit.occ.boxes.map(function (b, i) {
            return { x: b.x, y: b.y, w: b.w, h: b.h, key: i };
          })
        : [],
      drag = null,
      stage = el("div", { class: "occ-stage" }),
      chips = el("div", { class: "row", style: "gap:4px;flex-wrap:wrap;margin-top:4px" }),
      info = el("div", { class: "dim", style: "padding:0" }, "Add an image, then drag rectangles over the parts to hide."),
      dn = el("input", { class: "in", value: edit ? edit.deck : deckName || "Images", style: "flex:1" });
    function paint() {
      stage.textContent = "";
      chips.textContent = "";
      if (!imgId) {
        stage.append(el("div", { class: "dim", style: "padding:20px;text-align:center" }, "Paste, drop or choose an image"));
        return;
      }
      stage.append(el("img", { class: "occ-img", src: S.images[imgId], draggable: "false", alt: "" }));
      boxes.forEach(function (b, j) {
        stage.append(
          el("div", { class: "occ-box occ-edit", style: "left:" + b.x * 100 + "%;top:" + b.y * 100 + "%;width:" + b.w * 100 + "%;height:" + b.h * 100 + "%" }, String(j + 1))
        );
        chips.append(
          el(
            "button",
            {
              class: "btn xs",
              title: "Remove box " + (j + 1),
              onclick: function () {
                boxes.splice(j, 1);
                paint();
              },
            },
            j + 1 + " \u2715"
          )
        );
      });
      info.textContent = boxes.length + " box(es) = " + boxes.length + " card(s). Drag on the image to add one" + (boxes.length ? "; use the buttons to remove one." : ".");
    }
    function setImage(id) {
      imgId = id;
      boxes = [];
      paint();
    }
    function point(e) {
      var r = stage.getBoundingClientRect();
      return {
        x: Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)),
        y: Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)),
      };
    }
    stage.addEventListener("pointerdown", function (e) {
      if (!imgId) return;
      e.preventDefault();
      drag = point(e);
      try {
        stage.setPointerCapture(e.pointerId);
      } catch (x) {}
    });
    stage.addEventListener("pointermove", function (e) {
      if (!drag) return;
      var p = point(e);
      paint();
      stage.append(
        el("div", {
          class: "occ-box occ-edit",
          style: "left:" + Math.min(drag.x, p.x) * 100 + "%;top:" + Math.min(drag.y, p.y) * 100 + "%;width:" + Math.abs(p.x - drag.x) * 100 + "%;height:" + Math.abs(p.y - drag.y) * 100 + "%",
        })
      );
    });
    stage.addEventListener("pointerup", function (e) {
      if (!drag) return;
      var p = point(e),
        b = { x: Math.min(drag.x, p.x), y: Math.min(drag.y, p.y), w: Math.abs(p.x - drag.x), h: Math.abs(p.y - drag.y), key: null };
      drag = null;
      if (b.w > 0.015 && b.h > 0.015 && boxes.length < 40) boxes.push(b);
      paint();
    });
    var pick = el("input", {
      type: "file",
      accept: "image/*",
      style: "display:none",
      onchange: function () {
        var f = this.files && this.files[0];
        this.value = "";
        if (f) take(f);
      },
    });
    function take(f) {
      addImageFile(f, function (id, err) {
        if (err) msgBox({ title: "Image Occlusion", icon: "warn", text: err });
        else setImage(id);
      });
    }
    if (!edit)
      attachImagePaste(stage, function (md) {
        var m = /img:([A-Za-z0-9_-]+)/.exec(md);
        if (m) setImage(m[1]);
      });
    paint();
    msgBox({
      title: edit ? "Edit Image Occlusion" : "Image Occlusion",
      icon: "info",
      width: 560,
      text: edit
        ? "Add or remove boxes. Boxes you keep keep their review history; removed ones go to the Recycle Bin."
        : "Hide parts of a diagram. Every rectangle becomes its own card.",
      extra: el(
        "div",
        null,
        el(
          "div",
          { class: "row", style: "gap:6px;margin:6px 0" },
          edit ? null : el("button", { class: "btn sm", onclick: function () { pick.click(); } }, "Choose image\u2026"),
          "Deck:",
          dn,
          pick
        ),
        stage,
        chips,
        el("div", { class: "row", style: "gap:6px;margin-top:4px" }, info, edit ? null : el("button", { class: "btn xs", style: "margin-left:auto", onclick: function () { boxes.pop(); paint(); } }, "Undo box"))
      ),
      buttons: [
        {
          label: edit ? "Save" : "Create cards",
          fn: function () {
            if (!imgId || !boxes.length) {
              info.textContent = edit ? "Keep at least one box." : "Add an image and draw at least one box first.";
              return false;
            }
            var deck = clip(dn.value.trim() || "Images", 40),
              grp = (edit && edit.grp) || uid(),
              plain = function () {
                return boxes.map(function (b) {
                  return { x: b.x, y: b.y, w: b.w, h: b.h };
                });
              };
            if (edit) {
              sibs.forEach(function (c) {
                var j = -1;
                boxes.forEach(function (b, k) {
                  if (b.key === c.occ.i) j = k;
                });
                if (j >= 0) {
                  c.occ.boxes = plain();
                  c.occ.i = j;
                  c.deck = deck;
                  c.grp = grp;
                } else
                  softDelete("cards", function (x) {
                    return x.id === c.id;
                  });
              });
            }
            boxes.forEach(function (b, k) {
              if (edit && b.key != null) return;
              if (S.cards.length >= 5000) return;
              S.cards.push(newCardBase(deck, "[Image occlusion]", { occ: { img: imgId, boxes: plain(), i: k }, grp: grp }));
            });
            save();
            done();
          },
        },
        {
          label: "Cancel",
          fn: function () {
            if (imgId && !edit) pruneImages();
          },
        },
      ],
    });
  }

  /* ================= 2.7: UPDATE CHECKER (GitHub releases) ================= */
  var REPO = "apojidelegraphics/FocusDesk-96";
  function checkUpdate(manual) {
    S.prefs.updLast = Date.now();
    save();
    return fetch("https://api.github.com/repos/" + REPO + "/releases/latest", { headers: { Accept: "application/vnd.github+json" } })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (rel) {
        var tag = String(rel.tag_name || "").replace(/^v/i, ""),
          url = /^https:\/\/github\.com\//.test(rel.html_url || "") ? rel.html_url : "https://github.com/" + REPO + "/releases";
        if (!tag) throw new Error("no release");
        var isDesk = !!window.__focusdeskIsDesktop;
        /* Browser copies compare against the Browser zip attached to the release. */
        var brz = null;
        if (!isDesk && location.protocol === "file:")
          (rel.assets || []).forEach(function (a) {
            var m = /^FocusDesk-96-Browser-(\d+(?:\.\d+)*)\.zip$/.exec((a && a.name) || "");
            if (m && /^https:\/\/github\.com\//.test(a.browser_download_url || "") && (!brz || verCmp(brz.v, m[1]) < 0))
              brz = { v: m[1], url: a.browser_download_url };
          });
        if (brz) {
          if (verCmp(VERSION, brz.v) < 0) {
            if (manual || S.prefs.updSeen !== "b" + brz.v) {
              S.prefs.updSeen = "b" + brz.v;
              save();
              msgBox({
                title: "Update Available",
                icon: "bulb",
                width: 380,
                text:
                  "Browser version " + brz.v + " is available (you have " + VERSION + ").\n\nThis downloads the BROWSER version as a zip. Unzip it and open index.html. Before you switch, use Control Panel \u2192 Save backup file so your data is safe.",
                buttons: [
                  { label: "Download zip", fn: function () { window.open(brz.url, "_blank", "noopener"); } },
                  { label: "Later" },
                ],
              });
            }
          } else if (manual)
            msgBox({ title: "Updates", icon: "info", text: "You're up to date. Browser version " + VERSION + " is the newest." });
          return;
        }
        if (isDesk && verCmp(VERSION, tag) < 0) {
          if (!manual && S.prefs.updSeen === tag) return;
          S.prefs.updSeen = tag;
          save();
          msgBox({
            title: "Update Available",
            icon: "bulb",
            text: "FocusDesk 96 " + tag + " is available (you have " + VERSION + ").\n\nDownload the new installer and run it over your current copy. Your data is kept.",
            buttons: [
              { label: "Download", fn: function () { window.open(url, "_blank", "noopener"); } },
              { label: "Later" },
            ],
          });
        } else if (manual) {
          msgBox({
            title: "Updates",
            icon: "info",
            text: isDesk
              ? "You're up to date. FocusDesk 96 " + VERSION + " is the newest release."
              : "Desktop app " + tag + " is available. You're using the browser version " + VERSION + ".",
            buttons: isDesk ? [{ label: "OK" }] : [{ label: "Get the desktop app", fn: function () { window.open(url, "_blank", "noopener"); } }, { label: "Close" }],
          });
        }
      })
      .catch(function () {
        if (manual) msgBox({ title: "Updates", icon: "warn", text: "Couldn't reach GitHub to check for updates. Check your connection and try again." });
      });
  }
  function autoUpdateCheck() {
    if (!S.prefs.updAuto) return;
    if (!window.__focusdeskIsDesktop && location.protocol !== "file:") return;
    if (Date.now() - (S.prefs.updLast || 0) < 12 * 3600000) return;
    setTimeout(function () {
      checkUpdate(false);
    }, 8000);
  }

  function checkAchSoon() {
    if (achT) return;
    achT = setTimeout(function () {
      achT = 0;
      try {
        checkAch();
      } catch (e) {
        console.error(e);
      }
    }, 1500);
  }

  /* ================= DESKTOP 1.1: native notifications + quick capture ================= */
  function desktopNotify(title, body) {
    if (window.__focusdeskNotify)
      try {
        window.__focusdeskNotify(title, body);
      } catch (e) {}
  }
  /* "call mom tomorrow at 5pm", "in 30 min", "at 7:15 pm" -> { text, d (Date|null), hasTime } */
  function captureWhen(text) {
    var now = new Date(),
      t = String(text),
      d = null,
      hasTime = false,
      m;
    if ((m = /\bin\s+(\d{1,3})\s*(min|mins|minutes?|h|hr|hrs|hours?)\b/i.exec(t))) {
      d = new Date(now.getTime() + (/^h/i.test(m[2]) ? +m[1] * 60 : +m[1]) * 60000);
      hasTime = true;
      t = t.replace(m[0], " ");
    } else {
      var dayOff = null,
        h = 0,
        mi = 0;
      if ((m = /\btomorrow\b/i.exec(t))) {
        dayOff = 1;
        t = t.replace(m[0], " ");
      } else if ((m = /\btoday\b/i.exec(t))) {
        dayOff = 0;
        t = t.replace(m[0], " ");
      }
      var tm = /\bat\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i.exec(t) || /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i.exec(t);
      if (tm) {
        h = +tm[1];
        mi = tm[2] ? +tm[2] : 0;
        var ap = tm[3] && tm[3].toLowerCase();
        if (ap === "pm" && h < 12) h += 12;
        if (ap === "am" && h === 12) h = 0;
        if (h <= 23 && mi <= 59) {
          hasTime = true;
          t = t.replace(tm[0], " ");
        }
      }
      if (dayOff != null || hasTime) {
        d = new Date(now);
        d.setDate(d.getDate() + (dayOff || 0));
        if (hasTime) d.setHours(h, mi, 0, 0);
        else d.setHours(9, 0, 0, 0);
        if (dayOff == null && d.getTime() < now.getTime()) d.setDate(d.getDate() + 1); // "at 8am" said at 3pm means tomorrow
      }
    }
    t = t.replace(/\s+/g, " ").trim();
    return { text: t || String(text).trim(), d: d, hasTime: hasTime };
  }
  if (window.__focusdeskIsDesktop) {
    window.__focusdeskCapture = function (kind, text) {
      text = String(text || "").trim();
      if (!text) return { ok: false, msg: "" };
      var w = captureWhen(text),
        label = clip(w.text, 300),
        now = Date.now(),
        msg;
      if (kind === "task") {
        if (S.tasks.length >= 500) return { ok: false, msg: "Your task list is full (500)." };
        S.tasks.push({ id: uid(), text: label, done: false, pri: "normal", due: w.d ? w.d.getTime() : null, created: now, repeat: "none" });
        msg = "Task added: " + clip(label, 60);
      } else if (kind === "note") {
        S.notes.unshift({ id: uid(), text: clip(text, 300000), updated: now });
        msg = "Note saved: " + clip(text, 60);
      } else if (kind === "reminder") {
        S.reminders.push({ id: uid(), text: label, at: w.d ? w.d.getTime() : now + 3600000, done: false, fired: false, repeat: "none" });
        msg = "Reminder set for " + whenStr(w.d ? w.d.getTime() : now + 3600000) + ": " + clip(label, 50);
      } else if (kind === "event") {
        var ed = w.d || new Date();
        S.events.push({ id: uid(), title: label, date: ymd(ed), time: w.hasTime ? pad(ed.getHours()) + ":" + pad(ed.getMinutes()) : "", kind: "other", repeat: "none" });
        msg = "Event added for " + ymd(ed) + ": " + clip(label, 50);
      } else return { ok: false, msg: "" };
      save();
      refreshAll();
      return { ok: true, msg: msg };
    };
    window.__focusdeskCmd = function (cmd) {
      cmd = String(cmd || "");
      if (cmd === "focus") {
        openApp("timer");
        if (T.mode !== "focus") setMode("focus");
        if (!T.running) startPause();
      } else if (cmd === "timer-toggle") startPause();
      else if (cmd === "timer-reset") resetT();
      else if (cmd === "new-note") {
        S.notes.unshift({ id: uid(), text: "# Untitled\n\n", updated: Date.now() });
        save();
        refreshAll();
        openApp("notepad");
      } else if (cmd === "clipy") openClipyPopout("");
      else if (cmd.indexOf("clipy:") === 0) openClipyPopout(cmd.slice(6));
      else if (cmd === "backup-now") quickBackup();
      else if (cmd === "check-updates") checkUpdate(true);
      else if (cmd.indexOf("open:") === 0) {
        var id = cmd.slice(5);
        if (APPS[id]) openApp(id);
      }
    };
    /* Due counts for the tray menu and the Windows taskbar badge. */
    var dueT = 0;
    function makeBadge(n) {
      var cv = document.createElement("canvas");
      cv.width = cv.height = 32;
      var g = cv.getContext("2d");
      g.fillStyle = "#c00000";
      g.beginPath();
      g.arc(16, 16, 15, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "#fff";
      g.font = "bold 19px Arial, sans-serif";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText(n > 9 ? "9+" : String(n), 16, 17);
      return cv.toDataURL("image/png");
    }
    window.__focusdeskDue = function () {
      if (!window.focusdesk || !window.focusdesk.setDueCounts) return;
      var now = Date.now(),
        sod = new Date(),
        eod = new Date();
      sod.setHours(0, 0, 0, 0);
      eod.setHours(23, 59, 59, 999);
      var overOn = (window.__focusdeskDPrefs || {}).dueOverdue !== false;
      var cards = S.cards.filter(function (c) {
        return (c.dueAt || 0) <= now;
      }).length;
      function split(list) {
        var today = [],
          over = [];
        list.forEach(function (x) {
          if (x.done || !x.due) return;
          if (x.due >= sod.getTime() && x.due <= eod.getTime()) today.push(x);
          else if (x.due < sod.getTime() && overOn) over.push(x);
        });
        return { today: today, over: over };
      }
      var t = split(S.tasks),
        a = split(S.assign);
      var items = a.over
        .concat(a.today)
        .sort(function (x, y) {
          return x.due - y.due;
        })
        .slice(0, 10)
        .map(function (x) {
          var d = new Date(x.due),
            late = x.due < sod.getTime(),
            when = late || x.allDay ? d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }) : fmt12(d);
          return clip((late ? "Overdue: " : "") + x.title + (x.course ? " (" + x.course + ")" : ""), 48) + " \u2014 " + when;
        });
      var total = cards + t.today.length + t.over.length + a.today.length + a.over.length;
      window.focusdesk.setDueCounts({
        cards: cards,
        tasks: t.today.length + t.over.length,
        tasksOver: t.over.length,
        assign: a.today.length + a.over.length,
        assignOver: a.over.length,
        items: items,
        badge: window.__focusdeskPlatform === "win32" && total > 0 ? makeBadge(total) : null,
      });
    };
    window.addEventListener("focusdesk-katex", function () {
      try {
        refreshAll();
      } catch (e) {}
    });
    window.__focusdeskScheduleDue = function () {
      if (dueT) return;
      dueT = setTimeout(function () {
        dueT = 0;
        try {
          window.__focusdeskDue();
        } catch (e) {}
      }, 3000);
    };
    setInterval(function () {
      try {
        window.__focusdeskDue();
      } catch (e) {}
    }, 60000);
    setTimeout(function () {
      try {
        window.__focusdeskDue();
      } catch (e) {}
    }, 4000);
  }

  /* ---- Clipy in its own always-on-top window (desktop): the same panel, built into a child window ---- */
  var clipyPop = null,
    lastDoc = document;
  function dlgHost() {
    try {
      if (clipyPop && !clipyPop.closed && lastDoc === clipyPop.document && clipyPop.document.body) return clipyPop.document.body;
    } catch (e) {}
    return desk;
  }
  ["pointerdown", "keydown"].forEach(function (ev) {
    document.addEventListener(
      ev,
      function () {
        lastDoc = document;
      },
      true
    );
  });
  function openClipyPopout(question) {
    question = String(question || "").trim();
    if (clipyPop && !clipyPop.closed) {
      try {
        clipyPop.focus();
      } catch (e) {}
      if (question && clipyController && clipyController.ask) clipyController.ask(question);
      return;
    }
    var w = window.open("", "focusdesk-clipy", "width=400,height=580");
    if (!w) return;
    clipyPop = w;
    var d = w.document;
    d.open();
    d.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Clipy</title></head><body></body></html>');
    d.close();
    // same look as the main window: theme classes/variables and every stylesheet
    d.documentElement.className = document.documentElement.className;
    d.documentElement.style.cssText = document.documentElement.style.cssText;
    d.body.className = document.body.className;
    Array.prototype.forEach.call(document.querySelectorAll('link[rel="stylesheet"], style'), function (n) {
      d.head.appendChild(n.cloneNode(true));
    });
    var st = d.createElement("style");
    st.textContent =
      "html,body{margin:0;height:100%;overflow:hidden}body{position:relative;display:flex;flex-direction:column;background:#c0c0c0}";
    d.head.appendChild(st);
    var body = d.createElement("div");
    body.className = "wbody";
    body.style.cssText = "flex:1;min-height:0;overflow:hidden;margin:2px";
    d.body.appendChild(body);
    ["pointerdown", "keydown"].forEach(function (ev) {
      d.addEventListener(
        ev,
        function () {
          lastDoc = d;
        },
        true
      );
    });
    w.addEventListener("unload", function () {
      if (clipyPop === w) clipyPop = null;
    });
    buildClipyContent(body, { popout: true });
    lastDoc = d;
    setTimeout(function () {
      var ta = d.querySelector("textarea");
      if (ta) ta.focus();
    }, 50);
    if (question && clipyController && clipyController.ask) clipyController.ask(question);
  }

  function quickBackup() {
    saveFile(
      "focusdesk96-backup-" + ymd(new Date()) + ".json",
      JSON.stringify({ app: "FocusDesk 96", version: VERSION, saved: new Date().toISOString(), data: S, wall: wallData }, null, 2)
    );
    try {
      localStorage.setItem("focusdesk96.lastbackup", String(Date.now()));
    } catch (e) {}
  }

  /* ================= APP: COUNTDOWNS ================= */
  function appCountdown(w) {
    var nm = el("input", {
      class: "in",
      placeholder: "Event (e.g. Chem final)",
      style: "flex:1 1 160px",
    });
    var dt = el("input", { class: "in", type: "date", style: "width:134px" });
    var list = el("div", { class: "sunk list" });
    function add() {
      var v = nm.value.trim();
      if (!v) {
        nm.focus();
        return;
      }
      if (!dt.value) {
        dt.focus();
        return;
      }
      if (S.countdowns.length >= 60) return;
      S.countdowns.push({ id: uid(), name: clip(v, 60), date: dt.value });
      nm.value = "";
      save();
      refreshAll();
    }
    onEnter(nm, add);
    w.body.append(
      el(
        "div",
        { class: "row form" },
        nm,
        dt,
        el("button", { class: "btn sm", onclick: add }, "Add")
      ),
      list
    );
    function draw() {
      list.textContent = "";
      var today = ymd(new Date());
      var rows = S.countdowns
        .map(function (c) {
          return {
            c: c,
            n: Math.round(
              (new Date(c.date + "T00:00") - new Date(today + "T00:00")) /
                86400000
            ),
          };
        })
        .sort(function (a, b) {
          var ap = a.n < 0,
            bp = b.n < 0;
          return ap !== bp ? (ap ? 1 : -1) : ap ? b.n - a.n : a.n - b.n;
        });
      if (!rows.length)
        list.append(
          el(
            "div",
            { class: "dim" },
            "Nothing to count down to yet. Add a finals week, a trip, graduation\u2026"
          )
        );
      rows.forEach(function (x) {
        var big = x.n === 0 ? "Today" : String(Math.abs(x.n));
        var lab =
          x.n === 0
            ? "It's today!"
            : x.n > 0
            ? x.n === 1
              ? "day left"
              : "days left"
            : x.n === -1
            ? "day ago"
            : "days ago";
        list.append(
          el(
            "div",
            {
              class:
                "cd-row" +
                (x.n < 0 ? " past" : "") +
                (x.n >= 0 && x.n <= 7 ? " soon" : ""),
            },
            el("div", { class: "cd-n" }, big),
            el(
              "div",
              { style: "flex:1;min-width:0" },
              el(
                "div",
                { style: "font-weight:bold;overflow-wrap:anywhere" },
                x.c.name
              ),
              el(
                "div",
                { class: "dim", style: "padding:0" },
                lab + "  \u00b7  " + x.c.date
              )
            ),
            el(
              "button",
              {
                class: "btn xs",
                "aria-label": "Delete",
                onclick: function () {
                  softDelete("countdowns", function (y) {
                    return y.id === x.c.id;
                  });
                },
              },
              "X"
            )
          )
        );
      });
      w.status(S.countdowns.length + " countdown(s)");
    }
    w.refresh = draw;
    draw();
  }

  /* ================= APP: UNIT CONVERTER ================= */
  var UNITS = {
    Length: {
      m: 1,
      km: 1000,
      cm: 0.01,
      mm: 0.001,
      mile: 1609.344,
      yard: 0.9144,
      foot: 0.3048,
      inch: 0.0254,
    },
    Mass: {
      kg: 1,
      g: 0.001,
      mg: 0.000001,
      lb: 0.45359237,
      oz: 0.028349523125,
      tonne: 1000,
    },
    Volume: {
      L: 1,
      mL: 0.001,
      "US gallon": 3.785411784,
      "US quart": 0.946352946,
      "US cup": 0.2365882365,
      "fl oz": 0.0295735295625,
      tbsp: 0.01478676478125,
      tsp: 0.00492892159375,
    },
    Speed: { "m/s": 1, "km/h": 0.2777777778, mph: 0.44704, knot: 0.5144444444 },
    Area: {
      "m\u00b2": 1,
      "km\u00b2": 1000000,
      hectare: 10000,
      acre: 4046.8564224,
      "ft\u00b2": 0.09290304,
    },
    Time: { second: 1, minute: 60, hour: 3600, day: 86400, week: 604800 },
    Data: { byte: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776 },
    Temperature: { "\u00b0C": 1, "\u00b0F": 1, K: 1 },
  };
  function convUnit(cat, v, from, to) {
    if (cat === "Temperature") {
      var c =
        from === "\u00b0C"
          ? v
          : from === "\u00b0F"
          ? ((v - 32) * 5) / 9
          : v - 273.15;
      return to === "\u00b0C"
        ? c
        : to === "\u00b0F"
        ? (c * 9) / 5 + 32
        : c + 273.15;
    }
    return (v * UNITS[cat][from]) / UNITS[cat][to];
  }
  function fmtNum(n) {
    if (!isFinite(n)) return "---";
    var a = Math.abs(n);
    if (a !== 0 && (a >= 1e12 || a < 1e-6)) return n.toExponential(5);
    return String(parseFloat(n.toPrecision(9)));
  }
  function appConvert(w) {
    var cat = "Length";
    var catSel = el(
      "select",
      {
        class: "in",
        onchange: function () {
          cat = this.value;
          fillUnits();
          upd();
        },
      },
      Object.keys(UNITS).map(function (k) {
        return el("option", { value: k }, k);
      })
    );
    var val = el("input", {
      class: "in",
      type: "number",
      step: "any",
      value: "1",
      style: "width:120px",
      oninput: function () {
        upd();
      },
    });
    var from = el("select", {
        class: "in",
        onchange: function () {
          upd();
        },
      }),
      to = el("select", {
        class: "in",
        onchange: function () {
          upd();
        },
      });
    var out = el("div", { class: "sunk cv-out" }),
      tbl = el("div", {
        class: "sunk list",
        style: "margin:0;min-height:120px",
      });
    function fillUnits() {
      var names = Object.keys(UNITS[cat]);
      [from, to].forEach(function (s2) {
        s2.textContent = "";
        names.forEach(function (n) {
          s2.append(el("option", { value: n }, n));
        });
      });
      from.value = names[0];
      to.value = names[1] || names[0];
    }
    function upd() {
      var v = parseFloat(val.value);
      if (!isFinite(v)) {
        out.textContent = "Enter a number";
        tbl.textContent = "";
        return;
      }
      out.textContent =
        fmtNum(v) +
        " " +
        from.value +
        " = " +
        fmtNum(convUnit(cat, v, from.value, to.value)) +
        " " +
        to.value;
      tbl.textContent = "";
      Object.keys(UNITS[cat]).forEach(function (u) {
        tbl.append(
          el(
            "div",
            { class: "lrow" },
            el("span", { class: "t" }, u),
            el(
              "span",
              {
                class: "w",
                style:
                  'font-family:"Courier New",monospace;font-size:12px;color:#000',
              },
              fmtNum(convUnit(cat, v, from.value, u))
            )
          )
        );
      });
    }
    w.body.append(
      el(
        "div",
        { class: "col cv" },
        el(
          "div",
          { class: "row", style: "gap:6px;align-items:center;flex-wrap:wrap" },
          el("span", null, "Type:"),
          catSel
        ),
        el(
          "div",
          { class: "row", style: "gap:6px;align-items:center;flex-wrap:wrap" },
          val,
          from,
          el("span", null, "to"),
          to,
          el(
            "button",
            {
              class: "btn sm",
              onclick: function () {
                var a = from.value;
                from.value = to.value;
                to.value = a;
                upd();
              },
            },
            "Swap"
          )
        ),
        out,
        el("div", { style: "font-weight:bold" }, "All units"),
        tbl
      )
    );
    w.refresh = null;
    fillUnits();
    upd();
  }

  /* ================= APP: TYPING TEST ================= */
  var TYPE_BUILTIN = [
    "The mitochondria is the part of the cell that releases most of the energy a cell needs to work.",
    "Good notes are short, clear and written in your own words so you can review them quickly later.",
    "Spacing your study sessions over several days helps you remember far more than cramming the night before.",
    "A strong thesis makes one clear claim and tells the reader exactly what the rest of the essay will prove.",
    "Testing yourself with flash cards is one of the best ways to move facts into long term memory.",
    "The scientific method starts with a question, builds a hypothesis, tests it and then shares the results.",
    "Take a short break every twenty five minutes so your brain has time to rest and absorb what you learned.",
    "Primary sources are first hand accounts, while secondary sources explain or interpret those accounts.",
    "When you solve a math problem, write each step down so you can find your mistake if the answer is wrong.",
    "A balanced argument looks at more than one side before it explains why one side is the stronger choice.",
    "Water moves from an area of low solute concentration to an area of high solute concentration by osmosis.",
    "Start big assignments early, break them into small tasks and cross each one off as you finish it.",
  ];
  function appTyping(w) {
    var srcSel = el(
      "select",
      {
        class: "in",
        onchange: function () {
          reset();
        },
      },
      [
        ["mix", "Study sentences"],
        ["notes", "My notes"],
        ["cards", "My flash cards"],
      ].map(function (o) {
        return el("option", { value: o[0] }, o[1]);
      })
    );
    var durSel = el(
      "select",
      {
        class: "in",
        onchange: function () {
          reset();
        },
      },
      [30, 60, 120].map(function (n) {
        return el("option", { value: n, selected: n === 60 }, n + " seconds");
      })
    );
    var disp = el("div", { class: "sunk ty-text" });
    var inp = el("textarea", {
      class: "in",
      rows: 3,
      placeholder: "Start typing here\u2026",
      spellcheck: "false",
      autocomplete: "off",
      style: 'width:100%;resize:none;font:14px "Courier New",monospace',
    });
    var info = el("div", { style: "font-weight:bold;min-height:18px" });
    var target = "",
      spans = [],
      started = false,
      finished = false,
      t0 = 0,
      tmr = null;
    function norm(t) {
      return String(t)
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201c\u201d]/g, '"')
        .replace(/[\u2013\u2014]/g, "-")
        .replace(/\s+/g, " ")
        .trim();
    }
    function lines() {
      var v = srcSel.value,
        list = [];
      if (v === "notes")
        S.notes.forEach(function (n) {
          String(n.text || "")
            .split(/\n+/)
            .forEach(function (l) {
              l = norm(l);
              if (l.length >= 30 && l.length <= 240) list.push(l);
            });
        });
      else if (v === "cards")
        S.cards.forEach(function (c) {
          var l = norm(c.a);
          if (l.length >= 20 && l.length <= 240) list.push(l);
        });
      if (list.length < 3) list = TYPE_BUILTIN.slice();
      return list;
    }
    function build() {
      var L = lines(),
        out = [],
        len = 0;
      while (len < 520) {
        var l = L[Math.floor(Math.random() * L.length)];
        out.push(l);
        len += l.length + 1;
      }
      return norm(out.join(" "));
    }
    function dur() {
      return parseInt(durSel.value, 10) || 60;
    }
    function stats(ok, typed) {
      var el0 = started ? (Date.now() - t0) / 1000 : 0,
        left = Math.max(0, dur() - el0);
      var wpm = el0 > 1 ? Math.round(ok / 5 / (el0 / 60)) : 0,
        acc = typed ? Math.round((ok / typed) * 100) : 100;
      info.textContent =
        "Time left: " +
        Math.ceil(left) +
        "s     Speed: " +
        wpm +
        " WPM     Accuracy: " +
        acc +
        "%";
    }
    function reset() {
      if (tmr) {
        clearInterval(tmr);
        tmr = null;
      }
      started = false;
      finished = false;
      inp.value = "";
      inp.disabled = false;
      target = build();
      disp.textContent = "";
      disp.scrollTop = 0;
      spans = [];
      for (var i = 0; i < target.length; i++) {
        var sp = el("span", null, target.charAt(i));
        spans.push(sp);
        disp.append(sp);
      }
      if (spans[0]) spans[0].className = "cur";
      stats(0, 0);
      setTimeout(function () {
        inp.focus();
      }, 0);
    }
    function counts() {
      var v = inp.value,
        ok = 0;
      for (var i = 0; i < v.length && i < target.length; i++)
        if (v.charAt(i) === target.charAt(i)) ok++;
      return { ok: ok, typed: v.length };
    }
    function finish() {
      if (finished) return;
      finished = true;
      if (tmr) {
        clearInterval(tmr);
        tmr = null;
      }
      inp.disabled = true;
      var c = counts(),
        secs = Math.max(1, Math.min(dur(), (Date.now() - t0) / 1000)),
        wpm = Math.round(c.ok / 5 / (secs / 60)),
        acc = c.typed ? Math.round((c.ok / c.typed) * 100) : 100;
      var rec = false;
      if (
        dur() >= 30 &&
        acc >= 85 &&
        (!S.games.wpmBest || wpm > S.games.wpmBest)
      ) {
        S.games.wpmBest = wpm;
        save();
        rec = true;
      }
      msgBox({
        title: "Typing Test",
        icon: "info",
        text:
          "Time's up!\n\nSpeed: " +
          wpm +
          " words per minute\nAccuracy: " +
          acc +
          "%" +
          (rec
            ? "\nThat's a new personal best!"
            : S.games.wpmBest
            ? "\nPersonal best: " + S.games.wpmBest + " WPM"
            : ""),
        buttons: [{ label: "Try Again", fn: reset }, { label: "Close" }],
      });
    }
    function tick() {
      var c = counts();
      stats(c.ok, c.typed);
      if ((Date.now() - t0) / 1000 >= dur()) finish();
    }
    inp.addEventListener("paste", function (e) {
      e.preventDefault();
    });
    inp.addEventListener("input", function () {
      if (finished) return;
      if (!started) {
        started = true;
        t0 = Date.now();
        tmr = setInterval(tick, 250);
      }
      var v = inp.value;
      for (var i = 0; i < spans.length; i++) {
        var cls = "";
        if (i < v.length) cls = v.charAt(i) === target.charAt(i) ? "ok" : "bad";
        else if (i === v.length) cls = "cur";
        spans[i].className = cls;
      }
      var sp = spans[Math.min(v.length, spans.length - 1)];
      if (sp && sp.offsetTop > disp.scrollTop + disp.clientHeight - 34)
        disp.scrollTop = sp.offsetTop - 40;
      var c = counts();
      stats(c.ok, c.typed);
      if (v.length >= target.length) finish();
    });
    w.body.append(
      el(
        "div",
        {
          class: "col",
          style: "flex:1;min-height:0;padding:6px;gap:6px;overflow:auto",
        },
        el(
          "div",
          { class: "row", style: "gap:6px;align-items:center;flex-wrap:wrap" },
          el("span", null, "Text:"),
          srcSel,
          durSel,
          el("button", { class: "btn sm", onclick: reset }, "New Text"),
          el(
            "span",
            { style: "margin-left:auto" },
            S.games.wpmBest ? "Best: " + S.games.wpmBest + " WPM" : ""
          )
        ),
        disp,
        inp,
        info,
        el(
          "div",
          { class: "dim", style: "padding:0" },
          "Type the text exactly as shown. The clock starts with your first key."
        )
      )
    );
    w.stop = function () {
      if (tmr) {
        clearInterval(tmr);
        tmr = null;
      }
    };
    w.refresh = null;
    reset();
  }

  /* ================= APP: LINKS ================= */
  var QUICK_LINKS = [
    ["Google Scholar", "https://scholar.google.com"],
    ["Khan Academy", "https://www.khanacademy.org"],
    ["Wikipedia", "https://www.wikipedia.org"],
    ["Quizlet", "https://quizlet.com"],
    ["YouTube", "https://www.youtube.com"],
    ["Desmos", "https://www.desmos.com/calculator"],
    ["Wolfram|Alpha", "https://www.wolframalpha.com"],
    ["Purdue OWL", "https://owl.purdue.edu"],
    ["Infinite Campus", "https://www.infinitecampus.com"],
    ["Apple iCloud Calendar", "https://www.icloud.com/calendar"],
  ];
  function fixUrl(u) {
    u = String(u || "").trim();
    if (!u) return null;
    if (!/^[a-z][a-z0-9+.\-]*:/i.test(u)) u = "https://" + u;
    try {
      var x = new URL(u);
      if (x.protocol !== "http:" && x.protocol !== "https:") return null;
      return x.href;
    } catch (e) {
      return null;
    }
  }
  function appLinks(w) {
    var nm = el("input", {
      class: "in",
      placeholder: "Name (e.g. My Canvas)",
      style: "flex:1 1 120px",
    });
    var url = el("input", {
      class: "in",
      placeholder: "Address (e.g. yourschool.instructure.com)",
      style: "flex:2 1 170px",
    });
    var quick = el("div", {
      class: "row",
      style: "gap:4px;flex-wrap:wrap;padding:0 6px",
    });
    var list = el("div", { class: "sunk list" });
    function add(n, u) {
      var h = fixUrl(u);
      if (!h) {
        msgBox({
          title: "Favorites",
          icon: "warn",
          text: "That doesn't look like a web address. Try something like https://example.com",
        });
        return false;
      }
      if (S.links.length >= 100) return false;
      if (
        S.links.some(function (l) {
          return l.url === h;
        })
      )
        return false;
      S.links.push({
        id: uid(),
        name: clip(
          (n || "").trim() ||
            h.replace(/^https?:\/\/(www\.)?/, "").replace(/\/.*$/, ""),
          60
        ),
        url: clip(h, 500),
      });
      save();
      refreshAll();
      return true;
    }
    function addForm() {
      if (!url.value.trim()) {
        url.focus();
        return;
      }
      if (add(nm.value, url.value)) {
        nm.value = "";
        url.value = "";
      }
    }
    onEnter(url, addForm);
    onEnter(nm, function () {
      url.focus();
    });
    w.body.append(
      el(
        "div",
        { class: "row form" },
        nm,
        url,
        el("button", { class: "btn sm", onclick: addForm }, "Add")
      ),
      el("div", { style: "padding:0 6px 2px;font-weight:bold" }, "Quick add"),
      quick,
      list,
      el(
        "div",
        { class: "dim" },
        "Tip: add your school's Canvas address so it is one click away."
      )
    );
    function draw() {
      quick.textContent = "";
      QUICK_LINKS.filter(function (q) {
        var h = fixUrl(q[1]);
        return !S.links.some(function (l) {
          return l.url === h;
        });
      }).forEach(function (q) {
        quick.append(
          el(
            "button",
            {
              class: "btn sm",
              onclick: function () {
                add(q[0], q[1]);
              },
            },
            "+ " + q[0]
          )
        );
      });
      list.textContent = "";
      if (!S.links.length)
        list.append(
          el(
            "div",
            { class: "dim" },
            "No favorites yet. Add a site above or use Quick add."
          )
        );
      S.links.forEach(function (l) {
        list.append(
          el(
            "div",
            { class: "lk-row" },
            pix("links", 16),
            el(
              "div",
              { style: "flex:1;min-width:0" },
              el(
                "div",
                { style: "font-weight:bold;overflow-wrap:anywhere" },
                l.name
              ),
              el(
                "div",
                {
                  class: "dim",
                  style: "padding:0;font-size:11px;overflow-wrap:anywhere",
                },
                l.url
              )
            ),
            el(
              "button",
              {
                class: "btn sm",
                onclick: function () {
                  openUrl(l.url);
                },
              },
              "Open"
            ),
            el(
              "button",
              {
                class: "btn xs",
                "aria-label": "Delete",
                onclick: function () {
                  softDelete("links", function (x) {
                    return x.id === l.id;
                  });
                },
              },
              "X"
            )
          )
        );
      });
      w.status(S.links.length + " favorite(s)");
    }
    w.refresh = draw;
    draw();
  }

  /* ================= APP: RANDOMIZER ================= */
  function appDice(w) {
    var tab = "coin",
      pickText = "",
      teamText = "",
      heads = 0,
      tails = 0,
      pickRes = "",
      lastRoll = null,
      sides = 6,
      count = 2,
      groups = 2;
    var tabs = el("div", { class: "row", style: "gap:4px;padding:6px 6px 0" });
    var body = el("div", {
      class: "col",
      style: "gap:8px;flex:1;min-height:0;overflow:auto;padding:6px",
    });
    var TABS = [
      ["coin", "Coin"],
      ["dice", "Dice"],
      ["pick", "Picker"],
      ["teams", "Teams"],
    ];
    function rnd(n) {
      return Math.floor(Math.random() * n);
    }
    function shuffle(a) {
      a = a.slice();
      for (var i = a.length - 1; i > 0; i--) {
        var j = rnd(i + 1),
          t = a[i];
        a[i] = a[j];
        a[j] = t;
      }
      return a;
    }
    function names(t) {
      return String(t)
        .split(/\r?\n/)
        .map(function (x) {
          return x.trim();
        })
        .filter(Boolean)
        .slice(0, 100);
    }
    function paint() {
      tabs.textContent = "";
      TABS.forEach(function (t) {
        tabs.append(
          el(
            "button",
            {
              class: "btn sm" + (tab === t[0] ? " on" : ""),
              onclick: function () {
                tab = t[0];
                paint();
              },
            },
            t[1]
          )
        );
      });
      body.textContent = "";
      if (tab === "coin") {
        var big = el("div", { class: "sunk rnd-big" }, "Flip it!");
        var tally = el("div", null, "Heads: " + heads + "    Tails: " + tails);
        body.append(
          big,
          el(
            "div",
            { class: "row", style: "gap:8px;align-items:center" },
            el(
              "button",
              {
                class: "btn",
                onclick: function () {
                  var h = rnd(2) === 0;
                  if (h) heads++;
                  else tails++;
                  big.textContent = h ? "HEADS" : "TAILS";
                  tally.textContent = "Heads: " + heads + "    Tails: " + tails;
                },
              },
              "Flip coin"
            )
          )
        );
        body.append(tally);
      } else if (tab === "dice") {
        var sSel = el(
          "select",
          {
            class: "in",
            onchange: function () {
              sides = parseInt(this.value, 10);
            },
          },
          [4, 6, 8, 10, 12, 20].map(function (n) {
            return el("option", { value: n, selected: n === sides }, "d" + n);
          })
        );
        var cSel = el(
          "select",
          {
            class: "in",
            onchange: function () {
              count = parseInt(this.value, 10);
            },
          },
          [1, 2, 3, 4, 5, 6].map(function (n) {
            return el(
              "option",
              { value: n, selected: n === count },
              n + (n === 1 ? " die" : " dice")
            );
          })
        );
        var res = el("div", {
          class: "sunk",
          style: "min-height:70px;padding:8px;text-align:center",
        });
        function show() {
          res.textContent = "";
          if (!lastRoll) {
            res.append(el("span", { class: "dim" }, "Roll the dice!"));
            return;
          }
          lastRoll.forEach(function (v) {
            res.append(el("span", { class: "rnd-die" }, v));
          });
          res.append(
            el(
              "div",
              { style: "margin-top:6px;font-weight:bold" },
              "Total: " +
                lastRoll.reduce(function (a, b) {
                  return a + b;
                }, 0)
            )
          );
        }
        body.append(
          el(
            "div",
            {
              class: "row",
              style: "gap:8px;align-items:center;flex-wrap:wrap",
            },
            cSel,
            sSel,
            el(
              "button",
              {
                class: "btn",
                onclick: function () {
                  lastRoll = [];
                  for (var i = 0; i < count; i++) lastRoll.push(rnd(sides) + 1);
                  show();
                },
              },
              "Roll"
            )
          ),
          res
        );
        show();
      } else if (tab === "pick") {
        var ta = el("textarea", {
          class: "in",
          rows: 6,
          placeholder: "One name per line",
          style: "width:100%;resize:vertical",
          oninput: function () {
            pickText = this.value;
          },
        });
        ta.value = pickText;
        var out = el("div", { class: "sunk rnd-big" }, pickRes || "Who's up?");
        body.append(
          ta,
          el(
            "div",
            { class: "row", style: "gap:6px;flex-wrap:wrap" },
            el(
              "button",
              {
                class: "btn",
                onclick: function () {
                  var n = names(ta.value);
                  if (!n.length) {
                    out.textContent = "Add some names first.";
                    return;
                  }
                  pickRes = n[rnd(n.length)];
                  out.textContent = pickRes;
                },
              },
              "Pick one"
            ),
            el(
              "button",
              {
                class: "btn",
                onclick: function () {
                  var n = names(ta.value);
                  if (!n.length) {
                    out.textContent = "Add some names first.";
                    return;
                  }
                  var i = rnd(n.length);
                  pickRes = n[i];
                  n.splice(i, 1);
                  ta.value = n.join("\n");
                  pickText = ta.value;
                  out.textContent = pickRes;
                },
              },
              "Pick and remove"
            )
          ),
          out
        );
      } else {
        var tb = el("textarea", {
          class: "in",
          rows: 6,
          placeholder: "One name per line",
          style: "width:100%;resize:vertical",
          oninput: function () {
            teamText = this.value;
          },
        });
        tb.value = teamText;
        var gSel = el(
          "select",
          {
            class: "in",
            onchange: function () {
              groups = parseInt(this.value, 10);
            },
          },
          [2, 3, 4, 5, 6, 7, 8].map(function (n) {
            return el(
              "option",
              { value: n, selected: n === groups },
              n + " teams"
            );
          })
        );
        var tout = el("div", { class: "row", style: "gap:6px;flex-wrap:wrap" });
        body.append(
          tb,
          el(
            "div",
            { class: "row", style: "gap:6px;align-items:center" },
            gSel,
            el(
              "button",
              {
                class: "btn",
                onclick: function () {
                  var n = shuffle(names(tb.value));
                  tout.textContent = "";
                  if (n.length < 2) {
                    tout.append(
                      el("div", { class: "dim" }, "Add at least two names.")
                    );
                    return;
                  }
                  var g = Math.min(groups, n.length),
                    teams = [];
                  for (var i = 0; i < g; i++) teams.push([]);
                  n.forEach(function (x, i) {
                    teams[i % g].push(x);
                  });
                  teams.forEach(function (t, i) {
                    tout.append(
                      el(
                        "div",
                        { class: "sunk rnd-team" },
                        el("b", null, "Team " + (i + 1)),
                        t.map(function (x) {
                          return el("div", null, x);
                        })
                      )
                    );
                  });
                },
              },
              "Make teams"
            )
          ),
          tout
        );
      }
    }
    w.body.append(tabs, body);
    w.refresh = null;
    paint();
  }

  /* ================= APP: EQUATION SOLVER ================= */
  function appEquation(w) {
    var inp = el("input", {
      class: "in",
      value: "2x + 5 = 13",
      style: "flex:1",
      placeholder: "e.g. 2x + 5 = 13  or  x^2 - 5x + 6 = 0",
    });
    var out = el("div", { class: "sunk out", style: "min-height:80px" });
    function parseSide(s) {
      s = String(s || "")
        .replace(/\s+/g, "")
        .replace(/\*/g, "");
      var a2 = 0,
        a1 = 0,
        a0 = 0;
      s = s.replace(/-/g, "+-");
      var terms = s.split("+").filter(function (t) {
        return t !== "";
      });
      terms.forEach(function (t) {
        if (!t) return;
        var sign = 1;
        if (t.charAt(0) === "-") {
          sign = -1;
          t = t.slice(1);
        }
        var m;
        if ((m = t.match(/^([0-9.]*)x\^?2$/i)))
          a2 += sign * (m[1] ? parseFloat(m[1]) : 1);
        else if ((m = t.match(/^([0-9.]*)x$/i)))
          a1 += sign * (m[1] ? parseFloat(m[1]) : 1);
        else if (/^[0-9.]+$/.test(t)) a0 += sign * parseFloat(t);
        else throw "Cannot parse: " + t;
      });
      return { a2: a2, a1: a1, a0: a0 };
    }
    function solve() {
      out.textContent = "";
      var raw = inp.value.trim();
      if (!raw) {
        out.append(
          el("div", { class: "dim" }, "Type an equation, e.g. 2x + 5 = 13.")
        );
        return;
      }
      var parts = raw.split("=");
      if (parts.length !== 2) {
        out.append(
          el("div", { style: "color:#c00000" }, "Please use one equals sign.")
        );
        return;
      }
      var L, R;
      try {
        L = parseSide(parts[0]);
        R = parseSide(parts[1]);
      } catch (e) {
        out.append(el("div", { style: "color:#c00000" }, String(e)));
        return;
      }
      var a2 = L.a2 - R.a2,
        a1 = L.a1 - R.a1,
        a0 = L.a0 - R.a0;
      var eq = "";
      function term(coef, sym) {
        if (coef === 0) return "";
        var sign = coef > 0 ? "+" : "-";
        var abs = Math.abs(coef);
        var coeffStr =
          abs === 1 && sym ? "" : String(Math.round(abs * 10000) / 10000);
        return " " + sign + " " + coeffStr + (sym || "");
      }
      if (a2)
        eq +=
          (a2 > 0 ? "" : "- ") +
          (Math.abs(a2) === 1 ? "" : String(Math.abs(a2))) +
          "x\u00b2";
      if (a1)
        eq += eq
          ? term(a1, "x")
          : (a1 > 0 ? "" : "- ") +
            (Math.abs(a1) === 1 ? "" : String(Math.abs(a1))) +
            "x";
      if (a0) eq += eq ? term(a0) : String(a0);
      if (!eq) eq = "0";
      out.append(
        el(
          "div",
          { style: "font-weight:bold;margin-bottom:6px" },
          "Normalized: " + eq + " = 0"
        )
      );
      if (a2 === 0 && a1 === 0) {
        out.append(
          el("div", a0 === 0 ? "Any value of x works." : "No solution.")
        );
        return;
      }
      if (a2 === 0) {
        var x = -a0 / a1;
        out.append(
          el(
            "div",
            { style: "font-size:15px" },
            "Linear equation. x = " + fmtNum(x)
          )
        );
        return;
      }
      var D = a1 * a1 - 4 * a2 * a0;
      out.append(
        el(
          "div",
          { style: "font-size:13px" },
          "Quadratic: a = " + a2 + ", b = " + a1 + ", c = " + a0
        )
      );
      out.append(
        el("div", { style: "font-size:13px" }, "Discriminant: " + fmtNum(D))
      );
      if (D < 0) {
        out.append(el("div", { style: "color:#800000" }, "No real roots."));
        var re = -a1 / (2 * a2),
          im = Math.sqrt(-D) / (2 * a2);
        out.append(
          el(
            "div",
            null,
            "Complex roots: x = " +
              fmtNum(re) +
              " \u00b1 " +
              fmtNum(Math.abs(im)) +
              "i"
          )
        );
      } else if (D === 0) {
        out.append(
          el(
            "div",
            { style: "font-size:15px" },
            "One repeated root: x = " + fmtNum(-a1 / (2 * a2))
          )
        );
      } else {
        var r1 = (-a1 - Math.sqrt(D)) / (2 * a2);
        var r2 = (-a1 + Math.sqrt(D)) / (2 * a2);
        out.append(
          el(
            "div",
            { style: "font-size:15px" },
            "Two roots: x\u2081 = " + fmtNum(r1) + ", x\u2082 = " + fmtNum(r2)
          )
        );
      }
    }
    onEnter(inp, solve);
    inp.addEventListener("input", function () {
      clearTimeout(solve._t);
      solve._t = setTimeout(solve, 300);
    });
    w.body.append(
      el(
        "div",
        { class: "col", style: "flex:1;min-height:0;padding:6px;gap:6px" },
        el(
          "div",
          { class: "row", style: "gap:6px" },
          inp,
          el("button", { class: "btn sm", onclick: solve }, "Solve")
        ),
        out,
        el(
          "div",
          { class: "dim", style: "padding:0" },
          "Handles linear and quadratic equations. Use x for the variable, ^ for powers."
        )
      )
    );
    w.refresh = null;
    solve();
    setTimeout(function () {
      inp.focus();
      inp.select();
    }, 0);
  }

  /* ================= APP: ASSIGNMENT PLANNER ================= */
  function appPlanner(w) {
    var days = 21;
    function startOfDay(ms) {
      var d = new Date(ms);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    }
    function draw() {
      w.body.textContent = "";
      var box = el("div", {
        class: "col",
        style: "flex:1;min-height:0;padding:6px;gap:6px;overflow:auto",
      });
      var today = startOfDay(Date.now());
      var open = S.assign
        .filter(function (a) {
          return !a.done;
        })
        .sort(function (a, b) {
          return a.due - b.due;
        });
      if (!open.length) {
        box.append(
          el(
            "div",
            { class: "dim" },
            "No open assignments yet.\n\nImport a calendar feed in Calendar Link or add assignments by hand there, and they'll appear here on the timeline."
          )
        );
        w.body.append(box);
        w.status("Nothing to plan");
        return;
      }
      var head = el("div", {
        class: "row",
        style: "align-items:flex-end;gap:2px;padding-left:180px",
      });
      for (var i = 0; i < days; i++) {
        var dd = new Date(today + i * 86400000);
        var isToday = i === 0;
        head.append(
          el(
            "div",
            {
              style:
                "flex:1;text-align:center;font-size:10px;color:" +
                (isToday ? "#000080" : "#606060") +
                ";" +
                (isToday ? "font-weight:bold" : ""),
            },
            dd.getMonth() + 1 + "/" + dd.getDate()
          )
        );
      }
      box.append(head);
      var grid = el("div", {
        style: "position:relative;display:flex;flex-direction:column;gap:4px",
      });
      open.forEach(function (a) {
        var due = startOfDay(a.due);
        var dayOffset = Math.round((due - today) / 86400000);
        var overdue = dayOffset < 0;
        var offDisp = Math.max(0, Math.min(days - 1, dayOffset));
        var row = el("div", {
          style: "display:flex;gap:8px;align-items:stretch;min-height:34px",
        });
        var title = el(
          "div",
          {
            style:
              "width:172px;flex:none;font-size:11px;line-height:1.25;padding:2px 4px;overflow:hidden;display:flex;flex-direction:column;justify-content:center",
            title:
              (a.course ? "[" + a.course + "] " : "") +
              a.title +
              " \u2014 due " +
              whenStr(a.due, a.allDay),
            onclick: function () {
              openAssignmentViewer(a.id);
            },
          },
          el(
            "div",
            {
              style:
                "font-weight:bold;overflow:hidden;text-overflow:ellipsis;white-space:nowrap",
            },
            (a.course ? "[" + a.course + "] " : "") + a.title
          ),
          el(
            "div",
            {
              style:
                "color:" +
                (overdue ? "#c00000" : "#606060") +
                ";font-size:10px",
            },
            overdue
              ? rel(a.due)
              : "Due " +
                  (new Date(a.due).getMonth() + 1) +
                  "/" +
                  new Date(a.due).getDate()
          )
        );
        row.append(title);
        var barWrap = el("div", {
          style:
            "flex:1;position:relative;background:repeating-linear-gradient(90deg,transparent 0 calc(100%/21 - 1px),#e0e0e0 calc(100%/21 - 1px) calc(100%/21))",
        });
        var endPct = ((offDisp + 1) / days) * 100;
        var barColor = overdue
          ? "#c00000"
          : dayOffset <= 3
          ? "#a05000"
          : dayOffset <= 7
          ? "#000080"
          : "#006000";
        var bar = el(
          "div",
          {
            style:
              "position:absolute;left:0;width:" +
              endPct +
              "%;top:7px;height:20px;background:" +
              barColor +
              ";opacity:.85;border-radius:3px;cursor:default",
            title: a.title,
          },
          el(
            "span",
            {
              style:
                "color:#fff;font-size:10px;padding-left:4px;line-height:20px",
            },
            overdue
              ? "OVERDUE"
              : offDisp === 0
              ? "DUE TODAY"
              : offDisp + " days left"
          )
        );
        barWrap.append(bar);
        row.append(barWrap);
        row.append(
          el(
            "div",
            { style: "flex:none;display:flex;gap:4px;align-items:center" },
            el(
              "button",
              {
                class: "btn xs",
                title: "Mark done",
                onclick: function () {
                  a.done = true;
                  save();
                  refreshAll();
                },
              },
              "\u2713"
            ),
            el(
              "button",
              {
                class: "btn xs",
                title: "Open assignment",
                onclick: function () {
                  openAssignmentViewer(a.id);
                },
              },
              "\u25B8"
            )
          )
        );
        grid.append(row);
      });
      box.append(grid);
      box.append(
        el(
          "div",
          { class: "dim", style: "padding:6px 0 0;font-size:11px" },
          "Bars show how long each assignment has been open, ending at its due date."
        )
      );
      w.body.append(box);
      w.status(open.length + " open assignment(s)");
    }
    w.refresh = draw;
    draw();
  }

  /* ================= APP: MATH GRAPHER ================= */
  function appGrapher(w) {
    var GW = 520,
      GH = 400;
    var cv = el("canvas", {
      width: GW,
      height: GH,
      style:
        "display:block;background:#fff;touch-action:none;cursor:crosshair;outline:none",
    });
    cv.tabIndex = 0;
    var ctx = cv.getContext("2d");
    var PALETTE = [
      "#c74440",
      "#2d70b3",
      "#388c46",
      "#6042a6",
      "#fa7e19",
      "#000000",
    ];
    var view = { xMin: -10, xMax: 10, yMin: -6, yMax: 6 };
    var defaultView = { xMin: -10, xMax: 10, yMin: -6, yMax: 6 };
    var rows = [];
    var rowId = 0;
    var sliders = {};
    function parseExpr(str, paramVals) {
      str = String(str || "").trim();
      if (!str) return null;
      if (!/^[\s0-9xX+\-*/().^a-zA-Z,_]+$/.test(str)) return null;
      var s = str.replace(/\^/g, "**");
      s = s.replace(/\bpi\b/gi, "Math.PI");
      s = s.replace(
        /\b(sin|cos|tan|asin|acos|atan|sinh|cosh|tanh|sqrt|abs|log|ln|exp|floor|ceil|round|min|max|pow|sign)\s*\(/g,
        function (m, name) {
          var lower = name.toLowerCase();
          if (lower === "ln") return "Math.log(";
          if (lower === "log") return "Math.log10(";
          return "Math." + lower + "(";
        }
      );
      var names = ["x"];
      Object.keys(paramVals || {}).forEach(function (k) {
        names.push(k);
      });
      try {
        var f = new Function(names.join(","), "return (" + s + ");");
        return function (x) {
          var args = [x];
          Object.keys(paramVals || {}).forEach(function (k) {
            args.push(paramVals[k]);
          });
          try {
            return f.apply(null, args);
          } catch (e) {
            return NaN;
          }
        };
      } catch (e) {
        return null;
      }
    }
    function scanParams(expr) {
      var out = [];
      var reserved = {
        x: 1,
        pi: 1,
        e: 1,
        sin: 1,
        cos: 1,
        tan: 1,
        asin: 1,
        acos: 1,
        atan: 1,
        sinh: 1,
        cosh: 1,
        tanh: 1,
        sqrt: 1,
        abs: 1,
        log: 1,
        ln: 1,
        exp: 1,
        floor: 1,
        ceil: 1,
        round: 1,
        min: 1,
        max: 1,
        pow: 1,
        sign: 1,
      };
      var m = String(expr || "").match(/[a-zA-Z]+/g) || [];
      m.forEach(function (wd) {
        wd = wd.toLowerCase();
        if (reserved[wd]) return;
        if (out.indexOf(wd) < 0) out.push(wd);
      });
      return out;
    }
    var sideBox = el("div", { class: "des-side" });
    var graphWrap = el("div", { class: "des-graph" }, cv);
    w.body.append(el("div", { class: "des-wrap" }, sideBox, graphWrap));
    function xToPx(x) {
      return ((x - view.xMin) / (view.xMax - view.xMin)) * GW;
    }
    function yToPx(y) {
      return GH - ((y - view.yMin) / (view.yMax - view.yMin)) * GH;
    }
    function pxToX(px) {
      return view.xMin + (px / GW) * (view.xMax - view.xMin);
    }
    function pxToY(py) {
      return view.yMin + (1 - py / GH) * (view.yMax - view.yMin);
    }
    function niceStep(range, target) {
      var rough = range / target;
      var mag = Math.pow(10, Math.floor(Math.log10(rough)));
      var norm = rough / mag;
      if (norm < 1.5) return mag;
      if (norm < 3) return 2 * mag;
      if (norm < 7) return 5 * mag;
      return 10 * mag;
    }
    function draw() {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, GW, GH);
      var xStep = niceStep(view.xMax - view.xMin, 10);
      var yStep = niceStep(view.yMax - view.yMin, 8);
      ctx.strokeStyle = "#e8e8e8";
      ctx.lineWidth = 1;
      var xStart = Math.ceil(view.xMin / xStep) * xStep;
      for (var gx = xStart; gx <= view.xMax; gx += xStep) {
        var gpx = xToPx(gx);
        ctx.beginPath();
        ctx.moveTo(gpx, 0);
        ctx.lineTo(gpx, GH);
        ctx.stroke();
      }
      var yStart = Math.ceil(view.yMin / yStep) * yStep;
      for (var gy = yStart; gy <= view.yMax; gy += yStep) {
        var gpy = yToPx(gy);
        ctx.beginPath();
        ctx.moveTo(0, gpy);
        ctx.lineTo(GW, gpy);
        ctx.stroke();
      }
      ctx.strokeStyle = "#808080";
      ctx.lineWidth = 1;
      if (view.yMin <= 0 && view.yMax >= 0) {
        var py0 = yToPx(0);
        ctx.beginPath();
        ctx.moveTo(0, py0);
        ctx.lineTo(GW, py0);
        ctx.stroke();
      }
      if (view.xMin <= 0 && view.xMax >= 0) {
        var px0 = xToPx(0);
        ctx.beginPath();
        ctx.moveTo(px0, 0);
        ctx.lineTo(px0, GH);
        ctx.stroke();
      }
      ctx.fillStyle = "#606060";
      ctx.font = "10px Tahoma, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      var xLabelY = Math.min(GH - 12, Math.max(2, yToPx(0) + 3));
      for (var lx = xStart; lx <= view.xMax; lx += xStep) {
        if (Math.abs(lx) < xStep / 100) continue;
        var lpx = xToPx(lx);
        if (lpx < 12 || lpx > GW - 12) continue;
        ctx.fillText(String(Math.round(lx * 1000) / 1000), lpx, xLabelY);
      }
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      var xRight = Math.min(GW - 4, Math.max(30, xToPx(0) - 4));
      for (var ly = yStart; ly <= view.yMax; ly += yStep) {
        if (Math.abs(ly) < yStep / 100) continue;
        var lpy = yToPx(ly);
        if (lpy < 10 || lpy > GH - 10) continue;
        ctx.fillText(String(Math.round(ly * 1000) / 1000), xRight, lpy);
      }
      rows.forEach(function (r) {
        if (!r.on || !r.expr.trim()) return;
        var myParams = {};
        scanParams(r.expr).forEach(function (p) {
          var sv = sliders[p];
          myParams[p] = sv != null ? sv : 1;
        });
        var f = parseExpr(r.expr, myParams);
        if (!f) return;
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        var started = false,
          prevPy = null;
        for (var px = 0; px < GW; px++) {
          var xx = pxToX(px),
            yy = f(xx);
          if (typeof yy !== "number" || !isFinite(yy)) {
            started = false;
            prevPy = null;
            continue;
          }
          var pyy = yToPx(yy);
          if (pyy < -GH * 4 || pyy > GH * 5) {
            started = false;
            prevPy = null;
            continue;
          }
          if (started && prevPy != null && Math.abs(pyy - prevPy) > GH * 1.5)
            started = false;
          if (!started) {
            ctx.moveTo(px, pyy);
            started = true;
          } else ctx.lineTo(px, pyy);
          prevPy = pyy;
        }
        ctx.stroke();
      });
    }
    function resetView() {
      view = Object.assign({}, defaultView);
      draw();
    }
    function zoom(factor, cx, cy) {
      if (cx == null) cx = GW / 2;
      if (cy == null) cy = GH / 2;
      var xAt = pxToX(cx),
        yAt = pxToY(cy);
      view.xMin = xAt + (view.xMin - xAt) * factor;
      view.xMax = xAt + (view.xMax - xAt) * factor;
      view.yMin = yAt + (view.yMin - yAt) * factor;
      view.yMax = yAt + (view.yMax - yAt) * factor;
      draw();
    }
    var dragging = false,
      dragStartX = 0,
      dragStartY = 0,
      viewStart = null;
    cv.addEventListener(
      "wheel",
      function (e) {
        e.preventDefault();
        var r = cv.getBoundingClientRect();
        var cx = ((e.clientX - r.left) * GW) / r.width;
        var cy = ((e.clientY - r.top) * GH) / r.height;
        zoom(e.deltaY > 0 ? 1.15 : 1 / 1.15, cx, cy);
      },
      { passive: false }
    );
    cv.addEventListener("pointerdown", function (e) {
      try {
        cv.setPointerCapture(e.pointerId);
      } catch (x) {}
      dragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      viewStart = Object.assign({}, view);
      cv.style.cursor = "grabbing";
      e.preventDefault();
    });
    cv.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var r = cv.getBoundingClientRect();
      var dx =
        ((e.clientX - dragStartX) * (viewStart.xMax - viewStart.xMin)) /
        r.width;
      var dy =
        ((e.clientY - dragStartY) * (viewStart.yMax - viewStart.yMin)) /
        r.height;
      view.xMin = viewStart.xMin - dx;
      view.xMax = viewStart.xMax - dx;
      view.yMin = viewStart.yMin + dy;
      view.yMax = viewStart.yMax + dy;
      draw();
    });
    cv.addEventListener("pointerup", function (e) {
      dragging = false;
      cv.style.cursor = "crosshair";
      try {
        cv.releasePointerCapture(e.pointerId);
      } catch (x) {}
    });
    cv.addEventListener("pointerleave", function () {
      dragging = false;
      cv.style.cursor = "crosshair";
    });
    function addSlider(name) {
      var val = sliders[name] != null ? sliders[name] : 1;
      sliders[name] = val;
      var range = el("input", {
        type: "range",
        min: "-10",
        max: "10",
        step: "0.01",
        value: val,
        oninput: function () {
          sliders[name] = parseFloat(this.value);
          num.value = this.value;
          draw();
        },
      });
      var num = el("input", {
        class: "in",
        type: "number",
        step: "0.01",
        value: val,
        oninput: function () {
          var v = parseFloat(this.value);
          if (isFinite(v)) {
            sliders[name] = v;
            range.value = String(Math.max(-10, Math.min(10, v)));
            draw();
          }
        },
      });
      return el(
        "div",
        { class: "des-slider" },
        el("span", { class: "nm" }, name),
        range,
        num
      );
    }
    function rebuildSliderRow(r, container) {
      container.textContent = "";
      scanParams(r.expr).forEach(function (p) {
        if (sliders[p] == null) sliders[p] = 1;
        container.append(addSlider(p));
      });
    }
    function newRow(initialExpr) {
      var r = {
        id: ++rowId,
        expr: initialExpr || "",
        color: PALETTE[rows.length % PALETTE.length],
        on: true,
      };
      rows.push(r);
      var row = el("div", { class: "des-row", "data-id": r.id });
      var colorIn = el("input", {
        type: "color",
        value: r.color,
        oninput: function () {
          r.color = this.value;
          draw();
        },
      });
      var exprIn = el("input", {
        class: "expr in",
        value: r.expr,
        placeholder: "e.g. sin(x), a x^2 + b",
        oninput: function () {
          r.expr = this.value;
          rebuildSliderRow(r, slidersBox);
          draw();
        },
      });
      var onChk = el("input", {
        type: "checkbox",
        checked: true,
        onchange: function () {
          r.on = this.checked;
          draw();
        },
      });
      var kill = el(
        "button",
        {
          class: "btn xs kill",
          title: "Remove this expression",
          onclick: function () {
            rows = rows.filter(function (x) {
              return x.id !== r.id;
            });
            row.remove();
            draw();
          },
        },
        "X"
      );
      var slidersBox = el("div", { class: "des-sliders" });
      row.append(
        el(
          "div",
          { class: "line1" },
          onChk,
          colorIn,
          el("span", { class: "eq" }, "y ="),
          exprIn,
          kill
        ),
        slidersBox
      );
      sideBox.append(row);
      rebuildSliderRow(r, slidersBox);
    }
    var ctrl = el(
      "div",
      { class: "row", style: "gap:4px;flex-wrap:wrap;margin-bottom:4px" },
      el(
        "button",
        {
          class: "btn sm",
          onclick: function () {
            newRow("");
          },
        },
        "Add expression"
      ),
      el(
        "button",
        {
          class: "btn sm",
          onclick: function () {
            zoom(1 / 1.3);
          },
        },
        "Zoom in"
      ),
      el(
        "button",
        {
          class: "btn sm",
          onclick: function () {
            zoom(1.3);
          },
        },
        "Zoom out"
      ),
      el("button", { class: "btn sm", onclick: resetView }, "Reset view"),
      el(
        "button",
        {
          class: "btn sm",
          onclick: function () {
            try {
              cv.toBlob(function (b) {
                if (b) saveFile("graph-" + ymd(new Date()) + ".png", b);
              });
            } catch (e) {}
          },
        },
        "Save PNG"
      ),
      el(
        "button",
        {
          class: "btn sm",
          onclick: function () {
            var txt = rows
              .map(function (r) {
                return r.expr + "\t" + r.color;
              })
              .join("\n");
            S.notes.push({
              id: uid(),
              text: "# Graph\n\n```\n" + txt + "\n```\n",
              updated: Date.now(),
            });
            save();
            refreshAll();
            msgBox({
              title: "Math Grapher",
              icon: "info",
              text: "Expressions saved to a new Notepad note.",
            });
          },
        },
        "Save to Notepad"
      )
    );
    sideBox.append(ctrl);
    sideBox.append(
      el(
        "div",
        { class: "dim", style: "padding:4px 0;font-size:11px" },
        "Type any expression. Free letters become sliders you can drag. Scroll to zoom, drag to pan. Try: sin(x), a x^2 + b, 1/x, sqrt(x)."
      )
    );
    newRow("sin(x)");
    newRow("a x^2 + b");
    newRow("");
    w.onresize = draw;
    w.refresh = null;
    draw();
  }

  /* ================= APP: PERIODIC TABLE ================= */
  var ELEMENTS = [
    [1, "H", "Hydrogen", 1.008, "n", 1, 1],
    [2, "He", "Helium", 4.0026, "ng", 18, 1],
    [3, "Li", "Lithium", 6.94, "am", 1, 2],
    [4, "Be", "Beryllium", 9.0122, "ae", 2, 2],
    [5, "B", "Boron", 10.81, "ml", 13, 2],
    [6, "C", "Carbon", 12.011, "n", 14, 2],
    [7, "N", "Nitrogen", 14.007, "n", 15, 2],
    [8, "O", "Oxygen", 15.999, "n", 16, 2],
    [9, "F", "Fluorine", 18.998, "h", 17, 2],
    [10, "Ne", "Neon", 20.18, "ng", 18, 2],
    [11, "Na", "Sodium", 22.99, "am", 1, 3],
    [12, "Mg", "Magnesium", 24.305, "ae", 2, 3],
    [13, "Al", "Aluminium", 26.982, "pt", 13, 3],
    [14, "Si", "Silicon", 28.085, "ml", 14, 3],
    [15, "P", "Phosphorus", 30.974, "n", 15, 3],
    [16, "S", "Sulfur", 32.06, "n", 16, 3],
    [17, "Cl", "Chlorine", 35.45, "h", 17, 3],
    [18, "Ar", "Argon", 39.948, "ng", 18, 3],
    [19, "K", "Potassium", 39.098, "am", 1, 4],
    [20, "Ca", "Calcium", 40.078, "ae", 2, 4],
    [21, "Sc", "Scandium", 44.956, "tm", 3, 4],
    [22, "Ti", "Titanium", 47.867, "tm", 4, 4],
    [23, "V", "Vanadium", 50.942, "tm", 5, 4],
    [24, "Cr", "Chromium", 51.996, "tm", 6, 4],
    [25, "Mn", "Manganese", 54.938, "tm", 7, 4],
    [26, "Fe", "Iron", 55.845, "tm", 8, 4],
    [27, "Co", "Cobalt", 58.933, "tm", 9, 4],
    [28, "Ni", "Nickel", 58.693, "tm", 10, 4],
    [29, "Cu", "Copper", 63.546, "tm", 11, 4],
    [30, "Zn", "Zinc", 65.38, "tm", 12, 4],
    [31, "Ga", "Gallium", 69.723, "pt", 13, 4],
    [32, "Ge", "Germanium", 72.63, "ml", 14, 4],
    [33, "As", "Arsenic", 74.922, "ml", 15, 4],
    [34, "Se", "Selenium", 78.971, "n", 16, 4],
    [35, "Br", "Bromine", 79.904, "h", 17, 4],
    [36, "Kr", "Krypton", 83.798, "ng", 18, 4],
    [37, "Rb", "Rubidium", 85.468, "am", 1, 5],
    [38, "Sr", "Strontium", 87.62, "ae", 2, 5],
    [39, "Y", "Yttrium", 88.906, "tm", 3, 5],
    [40, "Zr", "Zirconium", 91.224, "tm", 4, 5],
    [41, "Nb", "Niobium", 92.906, "tm", 5, 5],
    [42, "Mo", "Molybdenum", 95.95, "tm", 6, 5],
    [43, "Tc", "Technetium", 98, "tm", 7, 5],
    [44, "Ru", "Ruthenium", 101.07, "tm", 8, 5],
    [45, "Rh", "Rhodium", 102.91, "tm", 9, 5],
    [46, "Pd", "Palladium", 106.42, "tm", 10, 5],
    [47, "Ag", "Silver", 107.87, "tm", 11, 5],
    [48, "Cd", "Cadmium", 112.41, "tm", 12, 5],
    [49, "In", "Indium", 114.82, "pt", 13, 5],
    [50, "Sn", "Tin", 118.71, "pt", 14, 5],
    [51, "Sb", "Antimony", 121.76, "ml", 15, 5],
    [52, "Te", "Tellurium", 127.6, "ml", 16, 5],
    [53, "I", "Iodine", 126.9, "h", 17, 5],
    [54, "Xe", "Xenon", 131.29, "ng", 18, 5],
    [55, "Cs", "Caesium", 132.91, "am", 1, 6],
    [56, "Ba", "Barium", 137.33, "ae", 2, 6],
    [57, "La", "Lanthanum", 138.91, "ln", 3, 6],
    [58, "Ce", "Cerium", 140.12, "ln", 4, 6],
    [59, "Pr", "Praseodymium", 140.91, "ln", 5, 6],
    [60, "Nd", "Neodymium", 144.24, "ln", 6, 6],
    [61, "Pm", "Promethium", 145, "ln", 7, 6],
    [62, "Sm", "Samarium", 150.36, "ln", 8, 6],
    [63, "Eu", "Europium", 151.96, "ln", 9, 6],
    [64, "Gd", "Gadolinium", 157.25, "ln", 10, 6],
    [65, "Tb", "Terbium", 158.93, "ln", 11, 6],
    [66, "Dy", "Dysprosium", 162.5, "ln", 12, 6],
    [67, "Ho", "Holmium", 164.93, "ln", 13, 6],
    [68, "Er", "Erbium", 167.26, "ln", 14, 6],
    [69, "Tm", "Thulium", 168.93, "ln", 15, 6],
    [70, "Yb", "Ytterbium", 173.05, "ln", 16, 6],
    [71, "Lu", "Lutetium", 174.97, "ln", 17, 6],
    [72, "Hf", "Hafnium", 178.49, "tm", 4, 7],
    [73, "Ta", "Tantalum", 180.95, "tm", 5, 7],
    [74, "W", "Tungsten", 183.84, "tm", 6, 7],
    [75, "Re", "Rhenium", 186.21, "tm", 7, 7],
    [76, "Os", "Osmium", 190.23, "tm", 8, 7],
    [77, "Ir", "Iridium", 192.22, "tm", 9, 7],
    [78, "Pt", "Platinum", 195.08, "tm", 10, 7],
    [79, "Au", "Gold", 196.97, "tm", 11, 7],
    [80, "Hg", "Mercury", 200.59, "tm", 12, 7],
    [81, "Tl", "Thallium", 204.38, "pt", 13, 7],
    [82, "Pb", "Lead", 207.2, "pt", 14, 7],
    [83, "Bi", "Bismuth", 208.98, "pt", 15, 7],
    [84, "Po", "Polonium", 209, "pt", 16, 7],
    [85, "At", "Astatine", 210, "h", 17, 7],
    [86, "Rn", "Radon", 222, "ng", 18, 7],
    [87, "Fr", "Francium", 223, "am", 1, 8],
    [88, "Ra", "Radium", 226, "ae", 2, 8],
    [89, "Ac", "Actinium", 227, "an", 3, 8],
    [90, "Th", "Thorium", 232.04, "an", 4, 8],
    [91, "Pa", "Protactinium", 231.04, "an", 5, 8],
    [92, "U", "Uranium", 238.03, "an", 6, 8],
    [93, "Np", "Neptunium", 237, "an", 7, 8],
    [94, "Pu", "Plutonium", 244, "an", 8, 8],
    [95, "Am", "Americium", 243, "an", 9, 8],
    [96, "Cm", "Curium", 247, "an", 10, 8],
    [97, "Bk", "Berkelium", 247, "an", 11, 8],
    [98, "Cf", "Californium", 251, "an", 12, 8],
    [99, "Es", "Einsteinium", 252, "an", 13, 8],
    [100, "Fm", "Fermium", 257, "an", 14, 8],
    [101, "Md", "Mendelevium", 258, "an", 15, 8],
    [102, "No", "Nobelium", 259, "an", 16, 8],
    [103, "Lr", "Lawrencium", 266, "an", 17, 8],
    [104, "Rf", "Rutherfordium", 267, "tm", 4, 9],
    [105, "Db", "Dubnium", 268, "tm", 5, 9],
    [106, "Sg", "Seaborgium", 269, "tm", 6, 9],
    [107, "Bh", "Bohrium", 270, "tm", 7, 9],
    [108, "Hs", "Hassium", 269, "tm", 8, 9],
    [109, "Mt", "Meitnerium", 278, "tm", 9, 9],
    [110, "Ds", "Darmstadtium", 281, "tm", 10, 9],
    [111, "Rg", "Roentgenium", 282, "tm", 11, 9],
    [112, "Cn", "Copernicium", 285, "tm", 12, 9],
    [113, "Nh", "Nihonium", 286, "pt", 13, 9],
    [114, "Fl", "Flerovium", 289, "pt", 14, 9],
    [115, "Mc", "Moscovium", 290, "pt", 15, 9],
    [116, "Lv", "Livermorium", 293, "pt", 16, 9],
    [117, "Ts", "Tennessine", 294, "h", 17, 9],
    [118, "Og", "Oganesson", 294, "ng", 18, 9],
  ];
  var CAT_NAMES = {
    n: "Nonmetal",
    ng: "Noble gas",
    am: "Alkali metal",
    ae: "Alkaline earth metal",
    tm: "Transition metal",
    pt: "Post-transition metal",
    ml: "Metalloid",
    h: "Halogen",
    ln: "Lanthanide",
    an: "Actinide",
  };
  var CAT_COLORS = {
    n: "#a0e0a0",
    ng: "#c0c0ff",
    am: "#ffb0b0",
    ae: "#ffd0a0",
    tm: "#ffd0d0",
    pt: "#c0c0c0",
    ml: "#c0e0e0",
    h: "#ffe0a0",
    ln: "#e0c0ff",
    an: "#ffc0e0",
  };
  function appPeriodic(w) {
    var info = el(
      "div",
      { class: "sunk pt-info" },
      "Click an element to see details. Colours show element families."
    );
    var grid = el("div", { class: "pt-grid" });
    var byPos = {};
    ELEMENTS.forEach(function (e) {
      byPos[e[5] + "-" + e[6]] = e;
    });
    for (var r = 1; r <= 9; r++) {
      for (var c = 1; c <= 18; c++) {
        if (r === 6 && c >= 3 && c <= 17) {
          grid.append(el("div", { style: "visibility:hidden" }));
          continue;
        }
        if (r === 7 && c >= 3 && c <= 17 && c !== 4) {
          grid.append(el("div", { style: "visibility:hidden" }));
          continue;
        }
        if (r === 8 && c >= 3) {
          grid.append(el("div", { style: "visibility:hidden" }));
          continue;
        }
        if (r === 9 && (c === 1 || c === 2 || c === 3 || c >= 18)) {
          grid.append(el("div", { style: "visibility:hidden" }));
          continue;
        }
        var elem = byPos[c + "-" + r];
        if (!elem) {
          grid.append(el("div"));
          continue;
        }
        (function (E) {
          var cell = el(
            "div",
            {
              class: "pt-el",
              style: "background:" + (CAT_COLORS[E[4]] || "#ddd"),
            },
            el("small", null, E[0]),
            el("b", null, E[1]),
            el("small", null, E[2]),
            el("small", null, E[3])
          );
          cell.addEventListener("click", function () {
            info.textContent = "";
            info.append(
              el(
                "div",
                { style: "font-size:18px;font-weight:bold" },
                E[2] + " (" + E[1] + ")"
              ),
              el("div", null, "Atomic number: " + E[0]),
              el("div", null, "Atomic mass: " + E[3] + " u"),
              el("div", null, "Category: " + (CAT_NAMES[E[4]] || E[4])),
              el("div", null, "Group: " + E[5] + "    Period: " + E[6])
            );
          });
          grid.append(cell);
        })(elem);
      }
    }
    w.body.append(
      el(
        "div",
        {
          class: "col",
          style: "flex:1;min-height:0;overflow:auto;padding:6px;gap:6px",
        },
        info,
        el("div", { style: "overflow:auto" }, grid),
        el(
          "div",
          { class: "dim", style: "padding:0" },
          "Click an element for details. Colours show element families."
        )
      )
    );
    w.refresh = null;
  }

  /* ================= APP: FORMULA SHEET ================= */
  var FORMULAS = {
    Algebra: [
      ["Quadratic formula", "x = (-b \u00b1 \u221a(b\u00b2 - 4ac)) / 2a"],
      ["Slope", "m = (y\u2082 - y\u2081) / (x\u2082 - x\u2081)"],
      ["Slope-intercept line", "y = mx + b"],
      ["Point-slope line", "y - y\u2081 = m(x - x\u2081)"],
      [
        "Distance formula",
        "d = \u221a((x\u2082-x\u2081)\u00b2 + (y\u2082-y\u2081)\u00b2)",
      ],
      ["Midpoint", "((x\u2081+x\u2082)/2, (y\u2081+y\u2082)/2)"],
      ["Difference of squares", "a\u00b2 - b\u00b2 = (a+b)(a-b)"],
      ["Perfect square", "(a \u00b1 b)\u00b2 = a\u00b2 \u00b1 2ab + b\u00b2"],
      ["Logarithm product", "log(xy) = log x + log y"],
      ["Logarithm power", "log(x\u207f) = n log x"],
    ],
    Geometry: [
      ["Circle area", "A = \u03c0r\u00b2"],
      ["Circumference", "C = 2\u03c0r"],
      ["Triangle area", "A = \u00bd b h"],
      ["Trapezoid area", "A = \u00bd (b\u2081 + b\u2082) h"],
      ["Sphere volume", "V = (4/3)\u03c0r\u00b3"],
      ["Sphere surface", "S = 4\u03c0r\u00b2"],
      ["Cylinder volume", "V = \u03c0r\u00b2h"],
      ["Cone volume", "V = \u2153 \u03c0r\u00b2h"],
      ["Pythagorean theorem", "a\u00b2 + b\u00b2 = c\u00b2"],
    ],
    Trigonometry: [
      [
        "SOH CAH TOA",
        "sin \u03b8 = opp/hyp, cos \u03b8 = adj/hyp, tan \u03b8 = opp/adj",
      ],
      ["Pythagorean identity", "sin\u00b2\u03b8 + cos\u00b2\u03b8 = 1"],
      ["Double angle (sin)", "sin 2\u03b8 = 2 sin \u03b8 cos \u03b8"],
      ["Double angle (cos)", "cos 2\u03b8 = cos\u00b2\u03b8 - sin\u00b2\u03b8"],
      ["Law of sines", "a / sin A = b / sin B = c / sin C"],
      ["Law of cosines", "c\u00b2 = a\u00b2 + b\u00b2 - 2ab cos C"],
    ],
    Calculus: [
      ["Power rule", "d/dx x\u207f = n x\u207f\u207b\u00b9"],
      ["Product rule", "(uv)' = u'v + uv'"],
      ["Quotient rule", "(u/v)' = (u'v - uv') / v\u00b2"],
      ["Chain rule", "(f(g(x)))' = f'(g(x)) g'(x)"],
      ["Derivative of sin", "d/dx sin x = cos x"],
      ["Derivative of cos", "d/dx cos x = -sin x"],
      ["Derivative of e\u02e3", "d/dx e\u02e3 = e\u02e3"],
      ["Derivative of ln x", "d/dx ln x = 1/x"],
      [
        "Power rule (integral)",
        "\u222b x\u207f dx = x\u207f\u207a\u00b9/(n+1) + C",
      ],
    ],
    Physics: [
      ["Newton's second law", "F = ma"],
      ["Kinematic 1", "v = v\u2080 + at"],
      ["Kinematic 2", "x = x\u2080 + v\u2080t + \u00bd a t\u00b2"],
      ["Kinematic 3", "v\u00b2 = v\u2080\u00b2 + 2a(x - x\u2080)"],
      ["Momentum", "p = mv"],
      ["Kinetic energy", "KE = \u00bd m v\u00b2"],
      ["Potential energy (gravity)", "PE = mgh"],
      ["Work", "W = F d cos \u03b8"],
      ["Power", "P = W / t"],
      ["Ohm's law", "V = I R"],
      ["Density", "\u03c1 = m / V"],
      ["Wave speed", "v = f \u03bb"],
    ],
    Chemistry: [
      ["Ideal gas law", "PV = nRT"],
      ["Molarity", "M = moles of solute / L of solution"],
      ["Dilution", "M\u2081V\u2081 = M\u2082V\u2082"],
      ["Percent yield", "(actual / theoretical) \u00d7 100"],
      ["Density", "\u03c1 = m / V"],
      ["pH", "pH = -log[H\u207a]"],
      ["pOH", "pOH = -log[OH\u207b], pH + pOH = 14"],
      ["Avogadro's number", "6.022 \u00d7 10\u00b2\u00b3 particles / mol"],
    ],
    Statistics: [
      ["Mean", "x\u0304 = (\u03a3x) / n"],
      ["Variance (sample)", "s\u00b2 = \u03a3(x - x\u0304)\u00b2 / (n-1)"],
      ["Standard deviation", "s = \u221a(variance)"],
      ["Z-score", "z = (x - \u03bc) / \u03c3"],
      ["Probability (independent)", "P(A and B) = P(A) \u00d7 P(B)"],
      ["Probability (union)", "P(A or B) = P(A) + P(B) - P(A and B)"],
    ],
  };
  function appFormula(w) {
    var cats = Object.keys(FORMULAS);
    var filter = el("input", {
      class: "in",
      placeholder: "Filter formulas\u2026",
      style: "flex:1",
    });
    var box = el("div", { class: "col", style: "gap:8px" });
    function draw() {
      box.textContent = "";
      var needle = filter.value.trim().toLowerCase();
      cats.forEach(function (cat) {
        var rows = FORMULAS[cat].filter(function (r) {
          return (
            !needle || (r[0] + " " + r[1]).toLowerCase().indexOf(needle) >= 0
          );
        });
        if (!rows.length) return;
        box.append(
          el(
            "div",
            {
              style:
                "font-weight:bold;background:#000080;color:#fff;padding:2px 8px",
            },
            cat
          )
        );
        rows.forEach(function (r) {
          box.append(
            el(
              "div",
              { style: "padding:4px 8px;border-bottom:1px solid #e4e4e4" },
              el("div", { style: "font-weight:bold" }, r[0]),
              el(
                "div",
                {
                  style:
                    'font-family:"Courier New",monospace;font-size:13px;user-select:text;-webkit-user-select:text',
                },
                r[1]
              )
            )
          );
        });
      });
    }
    filter.addEventListener("input", draw);
    w.body.append(
      el(
        "div",
        {
          class: "col",
          style: "flex:1;min-height:0;padding:6px;gap:6px;overflow:hidden",
        },
        el("div", { class: "row" }, filter),
        el(
          "div",
          {
            class: "sunk",
            style: "flex:1;min-height:0;overflow:auto;padding:6px",
          },
          box
        )
      )
    );
    w.refresh = null;
    draw();
  }

  /* ================= APP: DICTIONARY ================= */
  function appDict(w) {
    var inp = el("input", {
      class: "in",
      placeholder: "Type a word\u2026",
      style: "flex:1",
    });
    var out = el(
      "div",
      { class: "sunk", style: "flex:1;min-height:0;overflow:auto;padding:8px" },
      el(
        "div",
        { class: "dim" },
        "Type a word and press Enter. Tries dictionaryapi.dev, then Wiktionary, then Datamuse."
      )
    );
    var busy = false;
    function esc(s) {
      return String(s || "")
        .replace(/<[^>]*>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"');
    }
    function showError(word, reason) {
      out.textContent = "";
      out.append(
        el(
          "div",
          { style: "color:#c00000;padding-bottom:6px;font-weight:bold" },
          "No result for \u201c" + word + "\u201d."
        )
      );
      out.append(
        el(
          "div",
          { style: "font-size:11px;color:#606060;line-height:1.5" },
          reason
        )
      );
      out.append(
        el(
          "div",
          { class: "row", style: "gap:6px;margin-top:10px;flex-wrap:wrap" },
          el(
            "button",
            {
              class: "btn sm",
              onclick: function () {
                openUrl(
                  "https://www.merriam-webster.com/dictionary/" +
                    encodeURIComponent(word)
                );
              },
            },
            "Open in Merriam-Webster"
          ),
          el(
            "button",
            {
              class: "btn sm",
              onclick: function () {
                openUrl(
                  "https://en.wiktionary.org/wiki/" + encodeURIComponent(word)
                );
              },
            },
            "Open in Wiktionary"
          ),
          el(
            "button",
            {
              class: "btn sm",
              onclick: function () {
                openUrl(
                  "https://www.google.com/search?q=define+" +
                    encodeURIComponent(word)
                );
              },
            },
            "Search Google"
          )
        )
      );
    }
    function render(word, arr, source) {
      out.textContent = "";
      out.append(
        el(
          "div",
          {
            style:
              "display:flex;align-items:baseline;gap:8px;margin-bottom:4px;flex-wrap:wrap",
          },
          el("span", { style: "font-weight:bold;font-size:18px" }, word),
          el("span", { style: "font-size:11px;color:#606060" }, source)
        )
      );
      var phon = null;
      for (var i = 0; i < arr.length && !phon; i++) {
        if (arr[i].phonetic) phon = arr[i].phonetic;
        else if (arr[i].phonetics)
          for (var j = 0; j < arr[i].phonetics.length; j++)
            if (arr[i].phonetics[j].text) {
              phon = arr[i].phonetics[j].text;
              break;
            }
      }
      if (phon)
        out.append(
          el(
            "div",
            { style: "color:#404040;margin-bottom:6px;font-size:12px" },
            phon
          )
        );
      var any = false;
      arr.forEach(function (entry) {
        (entry.meanings || []).forEach(function (m) {
          if (!m.definitions || !m.definitions.length) return;
          any = true;
          if (m.partOfSpeech)
            out.append(el("div", { class: "dict-pos" }, m.partOfSpeech));
          m.definitions.slice(0, 8).forEach(function (d, idx) {
            out.append(
              el(
                "div",
                { class: "dict-row" },
                el("div", null, idx + 1 + ". " + (d.definition || "")),
                d.example
                  ? el(
                      "div",
                      {
                        class: "dim",
                        style: "padding:2px 0 0;font-style:italic",
                      },
                      "e.g. " + d.example
                    )
                  : null
              )
            );
          });
          var syns = [];
          (m.synonyms || []).forEach(function (s) {
            if (syns.indexOf(s) < 0) syns.push(s);
          });
          (m.definitions || []).forEach(function (d) {
            (d.synonyms || []).forEach(function (s) {
              if (syns.indexOf(s) < 0) syns.push(s);
            });
          });
          if (syns.length)
            out.append(
              el(
                "div",
                { style: "padding:6px 0;font-size:12px" },
                el("b", null, "Synonyms: "),
                syns.slice(0, 20).join(", ")
              )
            );
          var ants = [];
          (m.antonyms || []).forEach(function (s) {
            if (ants.indexOf(s) < 0) ants.push(s);
          });
          (m.definitions || []).forEach(function (d) {
            (d.antonyms || []).forEach(function (s) {
              if (ants.indexOf(s) < 0) ants.push(s);
            });
          });
          if (ants.length)
            out.append(
              el(
                "div",
                { style: "padding:2px 0;font-size:12px" },
                el("b", null, "Antonyms: "),
                ants.slice(0, 20).join(", ")
              )
            );
          out.append(el("div", { class: "msep" }));
        });
      });
      if (!any) showError(word, "No definitions found.");
    }
    function fromDictionaryApi(word) {
      return fetch(
        "https://api.dictionaryapi.dev/api/v2/entries/en/" +
          encodeURIComponent(word)
      )
        .then(function (r) {
          if (!r.ok) throw { skip: true };
          return r.json();
        })
        .then(function (arr) {
          if (!Array.isArray(arr) || !arr.length) throw { skip: true };
          render(word, arr, "dictionaryapi.dev");
        });
    }
    function fromWiktionary(word) {
      return fetch(
        "https://en.wiktionary.org/api/rest_v1/page/definition/" +
          encodeURIComponent(word)
      )
        .then(function (r) {
          if (!r.ok) throw { skip: true };
          return r.json();
        })
        .then(function (j) {
          var en = (j && j.en) || [];
          if (!en.length) throw { skip: true };
          var meanings = en.map(function (entry) {
            return {
              partOfSpeech: entry.partOfSpeech || "",
              definitions: (entry.definitions || []).map(function (d) {
                return {
                  definition: esc(d.definition),
                  example:
                    d.examples && d.examples[0] ? esc(d.examples[0]) : null,
                };
              }),
            };
          });
          render(
            word,
            [{ word: word, meanings: meanings }],
            "en.wiktionary.org"
          );
        });
    }
    function fromDatamuse(word) {
      return fetch(
        "https://api.datamuse.com/words?sp=" +
          encodeURIComponent(word) +
          "&md=d&max=1"
      )
        .then(function (r) {
          return r.json();
        })
        .then(function (arr) {
          if (!arr || !arr.length || !arr[0].defs || !arr[0].defs.length)
            throw { skip: true };
          var byPos = {};
          arr[0].defs.forEach(function (d) {
            var parts = d.split("\t");
            var pos = parts.length > 1 ? parts[0] : "";
            var def = esc(
              parts.length > 1 ? parts.slice(1).join(" ") : parts[0]
            );
            if (!byPos[pos])
              byPos[pos] = { partOfSpeech: pos, definitions: [] };
            byPos[pos].definitions.push({ definition: def });
          });
          render(
            word,
            [
              {
                word: word,
                meanings: Object.keys(byPos).map(function (k) {
                  return byPos[k];
                }),
              },
            ],
            "datamuse.com"
          );
        });
    }
    function lookup() {
      var raw = inp.value.trim();
      if (!raw || busy) return;
      var word = raw
        .split(/\s+/)[0]
        .toLowerCase()
        .replace(/[^a-z\-']/g, "");
      if (!word) return;
      busy = true;
      out.textContent = "";
      out.append(
        el("div", { class: "dim" }, "Looking up \u201c" + word + "\u201d\u2026")
      );
      fromDictionaryApi(word)
        .catch(function () {
          return fromWiktionary(word);
        })
        .catch(function () {
          return fromDatamuse(word);
        })
        .catch(function () {
          showError(word, "Couldn't reach any dictionary service.");
        })
        .then(function () {
          busy = false;
        });
    }
    onEnter(inp, lookup);
    w.body.append(
      el(
        "div",
        { class: "col", style: "flex:1;min-height:0;padding:6px;gap:6px" },
        el(
          "div",
          { class: "row", style: "gap:6px" },
          inp,
          el("button", { class: "btn sm", onclick: lookup }, "Look up")
        ),
        out
      )
    );
    w.refresh = null;
    setTimeout(function () {
      inp.focus();
    }, 0);
  }

  /* ================= GAMES ================= */
  function app2048(w) {
    var grid,
      score = 0,
      best = S.games.g2048 || 0,
      over = false;
    var boardEl = el("div", { class: "g2048-board" });
    var status = el("div", {
      style: "text-align:center;font-weight:bold;padding:6px",
    });
    function newGame() {
      grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
      score = 0;
      over = false;
      addTile();
      addTile();
      draw();
    }
    function addTile() {
      var empty = [];
      for (var r = 0; r < 4; r++)
        for (var c = 0; c < 4; c++) if (!grid[r][c]) empty.push([r, c]);
      if (!empty.length) return;
      var p = empty[Math.floor(Math.random() * empty.length)];
      grid[p[0]][p[1]] = Math.random() < 0.9 ? 2 : 4;
    }
    function slide(row) {
      var arr = row.filter(function (v) {
        return v;
      });
      for (var i = 0; i < arr.length - 1; i++)
        if (arr[i] === arr[i + 1]) {
          arr[i] *= 2;
          score += arr[i];
          arr.splice(i + 1, 1);
        }
      while (arr.length < 4) arr.push(0);
      return arr;
    }
    function move(dir) {
      if (over) return;
      var before = JSON.stringify(grid);
      if (dir === "left") grid = grid.map(slide);
      else if (dir === "right")
        grid = grid.map(function (r) {
          return slide(r.slice().reverse()).reverse();
        });
      else if (dir === "up")
        for (var c = 0; c < 4; c++) {
          var col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]],
            sl = slide(col);
          for (var r = 0; r < 4; r++) grid[r][c] = sl[r];
        }
      else if (dir === "down")
        for (var c2 = 0; c2 < 4; c2++) {
          var col2 = [grid[3][c2], grid[2][c2], grid[1][c2], grid[0][c2]],
            sl2 = slide(col2);
          for (var r2 = 0; r2 < 4; r2++) grid[3 - r2][c2] = sl2[r2];
        }
      if (JSON.stringify(grid) !== before) addTile();
      if (score > best) {
        best = score;
        S.games.g2048 = score;
        save();
      }
      if (isOver()) over = true;
      draw();
    }
    function isOver() {
      for (var r = 0; r < 4; r++)
        for (var c = 0; c < 4; c++) {
          if (!grid[r][c]) return false;
          if (r < 3 && grid[r][c] === grid[r + 1][c]) return false;
          if (c < 3 && grid[r][c] === grid[r][c + 1]) return false;
        }
      return true;
    }
    function draw() {
      boardEl.textContent = "";
      for (var r = 0; r < 4; r++)
        for (var c = 0; c < 4; c++) {
          var v = grid[r][c];
          boardEl.append(
            el("div", { class: "g2048-cell v" + (v || 0) }, v ? String(v) : "")
          );
        }
      status.textContent =
        "Score: " +
        score +
        "   Best: " +
        best +
        (over ? "   \u2014 Game over!" : "");
    }
    var root = el(
      "div",
      {
        class: "col",
        style: "flex:1;min-height:0;padding:6px;gap:6px;outline:none",
        tabindex: "0",
      },
      el(
        "div",
        { class: "row", style: "gap:6px;justify-content:center" },
        el("button", { class: "btn sm", onclick: newGame }, "New Game")
      ),
      status,
      el("div", { style: "display:flex;justify-content:center" }, boardEl),
      el(
        "div",
        { class: "dim", style: "text-align:center;padding:6px 0 0" },
        "Use the arrow keys (or W A S D), or swipe on touch."
      )
    );
    root.addEventListener("keydown", function (e) {
      var k = e.key.toLowerCase(),
        dir = null;
      if (k === "arrowleft" || k === "a") dir = "left";
      else if (k === "arrowright" || k === "d") dir = "right";
      else if (k === "arrowup" || k === "w") dir = "up";
      else if (k === "arrowdown" || k === "s") dir = "down";
      if (dir) {
        e.preventDefault();
        move(dir);
      }
    });
    var sx = 0,
      sy = 0;
    root.addEventListener("pointerdown", function (e) {
      sx = e.clientX;
      sy = e.clientY;
    });
    root.addEventListener("pointerup", function (e) {
      var dx = e.clientX - sx,
        dy = e.clientY - sy;
      if (Math.abs(dx) + Math.abs(dy) < 30) return;
      if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? "right" : "left");
      else move(dy > 0 ? "down" : "up");
    });
    w.body.append(root);
    w.refresh = null;
    setTimeout(function () {
      root.focus();
    }, 0);
    newGame();
  }

  function appSnake(w) {
    var COLS = 20,
      ROWS = 20,
      CS = 16;
    var cv = el("canvas", {
      width: COLS * CS,
      height: ROWS * CS,
      class: "snake-canvas",
      tabindex: "0",
      style:
        "display:block;margin:0 auto;background:#000;touch-action:none;outline:none",
    });
    var ctx = cv.getContext("2d");
    var snake,
      dir,
      food,
      alive,
      score,
      best = S.games.snakeBest || 0,
      tmr = null,
      paused = true;
    var status = el("div", {
      style: "text-align:center;font-weight:bold;padding:4px",
    });
    function rnd(n) {
      return Math.floor(Math.random() * n);
    }
    function placeFood() {
      var ok = false;
      while (!ok) {
        food = { x: rnd(COLS), y: rnd(ROWS) };
        ok = !snake.some(function (s) {
          return s.x === food.x && s.y === food.y;
        });
      }
    }
    function newGame() {
      snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 },
      ];
      dir = { x: 1, y: 0 };
      score = 0;
      alive = true;
      paused = true;
      placeFood();
      if (tmr) {
        clearInterval(tmr);
        tmr = null;
      }
      draw();
      status.textContent =
        "Score: 0   Best: " +
        best +
        "   \u2014 Press an arrow key or tap to start";
    }
    function start() {
      if (!paused || !alive) return;
      paused = false;
      status.textContent = "Score: " + score + "   Best: " + best;
      if (tmr) clearInterval(tmr);
      tmr = setInterval(step, 130);
    }
    function step() {
      if (paused || !alive) return;
      var head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
        die();
        return;
      }
      if (
        snake.some(function (s) {
          return s.x === head.x && s.y === head.y;
        })
      ) {
        die();
        return;
      }
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        score++;
        if (score > best) {
          best = score;
          S.games.snakeBest = score;
          save();
        }
        placeFood();
      } else snake.pop();
      status.textContent = "Score: " + score + "   Best: " + best;
      draw();
    }
    function die() {
      alive = false;
      if (tmr) {
        clearInterval(tmr);
        tmr = null;
      }
      msgBox({
        title: "Snake",
        icon: "info",
        text:
          "Game over!\n\nScore: " +
          score +
          (score >= best ? "\nNew best!" : "\nBest: " + best),
        buttons: [{ label: "Play Again", fn: newGame }, { label: "Close" }],
      });
    }
    function draw() {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.strokeStyle = "#0a2a0a";
      ctx.lineWidth = 1;
      for (var i = 1; i < COLS; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CS, 0);
        ctx.lineTo(i * CS, ROWS * CS);
        ctx.stroke();
      }
      for (var j = 1; j < ROWS; j++) {
        ctx.beginPath();
        ctx.moveTo(0, j * CS);
        ctx.lineTo(COLS * CS, j * CS);
        ctx.stroke();
      }
      if (food) {
        ctx.fillStyle = "#c00";
        ctx.beginPath();
        ctx.arc(
          food.x * CS + CS / 2,
          food.y * CS + CS / 2,
          CS / 2 - 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      snake.forEach(function (s, i) {
        ctx.fillStyle = i === 0 ? "#7fff7f" : "#3fbf3f";
        ctx.fillRect(s.x * CS + 1, s.y * CS + 1, CS - 2, CS - 2);
        if (i === 0) {
          ctx.fillStyle = "#000";
          ctx.fillRect(s.x * CS + 3, s.y * CS + 3, 3, 3);
          ctx.fillRect(s.x * CS + CS - 6, s.y * CS + 3, 3, 3);
        }
      });
    }
    function setDir(nx, ny) {
      if (!alive) return;
      if (dir.x === -nx && dir.y === -ny) return;
      if (dir.x === nx && dir.y === ny) return;
      dir = { x: nx, y: ny };
    }
    function onKey(e) {
      var k = e.key.toLowerCase(),
        used = true;
      if (k === "arrowleft" || k === "a") setDir(-1, 0);
      else if (k === "arrowright" || k === "d") setDir(1, 0);
      else if (k === "arrowup" || k === "w") setDir(0, -1);
      else if (k === "arrowdown" || k === "s") setDir(0, 1);
      else if (k === " ") {
        if (paused) start();
      } else used = false;
      if (used) {
        e.preventDefault();
        if (paused) start();
      }
    }
    var root = el(
      "div",
      { class: "col snake-wrap", tabindex: "0", style: "outline:none" },
      el(
        "div",
        { class: "row", style: "gap:6px;justify-content:center" },
        el("button", { class: "btn sm", onclick: newGame }, "New Game")
      ),
      status,
      cv,
      el(
        "div",
        { class: "dim", style: "text-align:center;padding:4px 0 0" },
        "Use the arrow keys or W A S D. On a phone, swipe the board."
      )
    );
    root.addEventListener("keydown", onKey);
    cv.addEventListener("keydown", onKey);
    var sx0 = 0,
      sy0 = 0;
    cv.addEventListener("pointerdown", function (e) {
      cv.focus();
      e.preventDefault();
      sx0 = e.clientX;
      sy0 = e.clientY;
    });
    cv.addEventListener("pointerup", function (e) {
      var dx = e.clientX - sx0,
        dy = e.clientY - sy0;
      if (Math.abs(dx) + Math.abs(dy) < 20) {
        if (paused) start();
        return;
      }
      if (Math.abs(dx) > Math.abs(dy)) setDir(dx > 0 ? 1 : -1, 0);
      else setDir(0, dy > 0 ? 1 : -1);
      if (paused) start();
    });
    w.body.append(root);
    w.stop = function () {
      if (tmr) {
        clearInterval(tmr);
        tmr = null;
      }
    };
    w.refresh = null;
    setTimeout(function () {
      root.focus();
      cv.focus();
    }, 0);
    newGame();
  }

  function appTetris(w) {
    var COLS = 10,
      ROWS = 20,
      CS = 22;
    var cv = el("canvas", {
      width: COLS * CS,
      height: ROWS * CS,
      tabindex: "0",
      style:
        "display:block;margin:0 auto;background:#000;touch-action:none;outline:none",
    });
    var ctx = cv.getContext("2d");
    var board,
      piece,
      score,
      lines,
      over,
      tmr = null,
      paused = true,
      best = S.games.tetrisBest || 0,
      level = 1;
    var status = el("div", {
      style: "text-align:center;font-weight:bold;padding:4px",
    });
    var PIECES = [
      { c: "#00ffff", s: [[1, 1, 1, 1]] },
      {
        c: "#ffff00",
        s: [
          [1, 1],
          [1, 1],
        ],
      },
      {
        c: "#aa00ff",
        s: [
          [0, 1, 0],
          [1, 1, 1],
        ],
      },
      {
        c: "#00ff00",
        s: [
          [0, 1, 1],
          [1, 1, 0],
        ],
      },
      {
        c: "#ff0000",
        s: [
          [1, 1, 0],
          [0, 1, 1],
        ],
      },
      {
        c: "#0000ff",
        s: [
          [1, 0, 0],
          [1, 1, 1],
        ],
      },
      {
        c: "#ff8000",
        s: [
          [0, 0, 1],
          [1, 1, 1],
        ],
      },
    ];
    function rnd(n) {
      return Math.floor(Math.random() * n);
    }
    function newPiece() {
      var p = PIECES[rnd(PIECES.length)];
      return {
        c: p.c,
        s: p.s.map(function (r) {
          return r.slice();
        }),
        x: Math.floor((COLS - p.s[0].length) / 2),
        y: 0,
      };
    }
    function collide(pc, ox, oy, shape) {
      var sh = shape || pc.s;
      for (var r = 0; r < sh.length; r++)
        for (var c = 0; c < sh[r].length; c++) {
          if (!sh[r][c]) continue;
          var x = pc.x + c + ox,
            y = pc.y + r + oy;
          if (x < 0 || x >= COLS || y >= ROWS) return true;
          if (y >= 0 && board[y][x]) return true;
        }
      return false;
    }
    function rotate(sh) {
      var R = sh.length,
        C = sh[0].length,
        out = [];
      for (var c = 0; c < C; c++) {
        out.push([]);
        for (var r = R - 1; r >= 0; r--) out[c].push(sh[r][c]);
      }
      return out;
    }
    function merge() {
      piece.s.forEach(function (row, r) {
        row.forEach(function (v, c) {
          if (v) board[piece.y + r][piece.x + c] = piece.c;
        });
      });
    }
    function clearLines() {
      var n = 0;
      for (var r = ROWS - 1; r >= 0; r--) {
        if (
          board[r].every(function (v) {
            return v;
          })
        ) {
          board.splice(r, 1);
          board.unshift(new Array(COLS).fill(null));
          n++;
          r++;
        }
      }
      if (n) {
        score += [0, 100, 300, 500, 800][n] || 800;
        lines += n;
        var newLevel = 1 + Math.floor(lines / 10);
        if (newLevel !== level) {
          level = newLevel;
          restartTimer();
        }
      }
    }
    function stop() {
      if (tmr) {
        clearInterval(tmr);
        tmr = null;
      }
    }
    function tick() {
      if (paused || over) return;
      if (!collide(piece, 0, 1)) piece.y++;
      else lock();
      draw();
    }
    function restartTimer() {
      if (paused || over) return;
      stop();
      var speed = Math.max(100, 500 - (level - 1) * 45);
      tmr = setInterval(tick, speed);
    }
    function lock() {
      merge();
      clearLines();
      piece = newPiece();
      if (collide(piece, 0, 0)) {
        over = true;
        stop();
        if (score > best) {
          best = score;
          S.games.tetrisBest = score;
          save();
        }
        msgBox({
          title: "Tetris",
          icon: "info",
          text:
            "Game over!\n\nScore: " +
            score +
            "\nLines: " +
            lines +
            "\nLevel: " +
            level +
            (score >= best ? "\nNew best!" : "\nBest: " + best),
          buttons: [{ label: "Play Again", fn: newGame }, { label: "Close" }],
        });
      }
    }
    function draw() {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.strokeStyle = "#1a1a1a";
      ctx.lineWidth = 1;
      for (var x = 1; x < COLS; x++) {
        ctx.beginPath();
        ctx.moveTo(x * CS, 0);
        ctx.lineTo(x * CS, ROWS * CS);
        ctx.stroke();
      }
      for (var y = 1; y < ROWS; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * CS);
        ctx.lineTo(COLS * CS, y * CS);
        ctx.stroke();
      }
      board.forEach(function (row, r) {
        row.forEach(function (v, c) {
          if (!v) return;
          ctx.fillStyle = v;
          ctx.fillRect(c * CS + 1, r * CS + 1, CS - 2, CS - 2);
        });
      });
      if (piece && !over) {
        var gy = 0;
        while (!collide(piece, 0, gy + 1)) gy++;
        ctx.fillStyle = "rgba(255,255,255,.08)";
        piece.s.forEach(function (row, r) {
          row.forEach(function (v, c) {
            if (v)
              ctx.fillRect(
                (piece.x + c) * CS + 1,
                (piece.y + r + gy) * CS + 1,
                CS - 2,
                CS - 2
              );
          });
        });
        ctx.fillStyle = piece.c;
        piece.s.forEach(function (row, r) {
          row.forEach(function (v, c) {
            if (v)
              ctx.fillRect(
                (piece.x + c) * CS + 1,
                (piece.y + r) * CS + 1,
                CS - 2,
                CS - 2
              );
          });
        });
      }
      status.textContent =
        "Score: " +
        score +
        "   Lines: " +
        lines +
        "   Level: " +
        level +
        "   Best: " +
        best +
        (paused && !over ? "   \u2014 Press a key to start" : "");
    }
    function newGame() {
      board = [];
      for (var r = 0; r < ROWS; r++) board.push(new Array(COLS).fill(null));
      piece = newPiece();
      score = 0;
      lines = 0;
      level = 1;
      over = false;
      paused = true;
      stop();
      draw();
    }
    function start() {
      if (!paused || over) return;
      paused = false;
      restartTimer();
      draw();
    }
    function onKey(e) {
      if (over) return;
      var k = e.key,
        used = true;
      if (k === "ArrowLeft") move(-1);
      else if (k === "ArrowRight") move(1);
      else if (k === "ArrowDown") {
        if (paused) start();
        if (!collide(piece, 0, 1)) {
          piece.y++;
          score += 1;
          draw();
        }
      } else if (k === "ArrowUp") rotateP();
      else if (k === " ") hardDrop();
      else if (k === "p" || k === "P") {
        if (paused) {
          paused = false;
          restartTimer();
        } else {
          paused = true;
          stop();
        }
        draw();
      } else used = false;
      if (used) {
        e.preventDefault();
        if (paused && k !== "p" && k !== "P") start();
      }
    }
    function move(dx) {
      if (over) return;
      if (!collide(piece, dx, 0)) {
        piece.x += dx;
        draw();
      }
    }
    function rotateP() {
      if (over) return;
      var sh = rotate(piece.s);
      var kicks = [0, -1, 1, -2, 2];
      for (var i = 0; i < kicks.length; i++)
        if (!collide(piece, kicks[i], 0, sh)) {
          piece.s = sh;
          piece.x += kicks[i];
          draw();
          return;
        }
    }
    function hardDrop() {
      if (over) return;
      while (!collide(piece, 0, 1)) {
        piece.y++;
        score += 2;
      }
      lock();
      draw();
    }
    var root = el(
      "div",
      {
        class: "col",
        style: "flex:1;min-height:0;padding:6px;gap:6px;outline:none",
        tabindex: "0",
      },
      el(
        "div",
        { class: "row", style: "gap:6px;justify-content:center" },
        el("button", { class: "btn sm", onclick: newGame }, "New Game")
      ),
      status,
      cv,
      el(
        "div",
        { class: "dim", style: "text-align:center;padding:4px 0 0" },
        "Arrow keys move, Up rotates, Space hard-drops, P pauses."
      )
    );
    root.addEventListener("keydown", onKey);
    cv.addEventListener("keydown", onKey);
    cv.addEventListener("pointerdown", function () {
      cv.focus();
    });
    w.body.append(root);
    w.stop = stop;
    w.refresh = null;
    setTimeout(function () {
      root.focus();
      cv.focus();
    }, 0);
    newGame();
  }

  function appPong(w) {
    var W = 480,
      H = 320;
    var cv = el("canvas", {
      width: W,
      height: H,
      tabindex: "0",
      style:
        "display:block;margin:0 auto;background:#000;touch-action:none;outline:none",
    });
    var ctx = cv.getContext("2d");
    var padH = 70,
      padW = 10;
    var leftY,
      rightY,
      ball,
      scoreL,
      scoreR,
      over,
      raf = null,
      paused = true,
      best = S.games.pongBest || 0;
    var status = el("div", {
      style: "text-align:center;font-weight:bold;padding:4px",
    });
    function newGame() {
      leftY = H / 2 - padH / 2;
      rightY = H / 2 - padH / 2;
      ball = {
        x: W / 2,
        y: H / 2,
        vx: 3.5,
        vy: (Math.random() < 0.5 ? -1 : 1) * 2.4,
        r: 6,
      };
      scoreL = 0;
      scoreR = 0;
      over = false;
      paused = true;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = null;
      }
      draw();
      status.textContent =
        "You " +
        scoreL +
        "  \u2014  " +
        scoreR +
        " CPU   Best CPU streak: " +
        best +
        "   \u2014 Press a key or tap";
    }
    function start() {
      if (!paused || over) return;
      paused = false;
      if (raf) cancelAnimationFrame(raf);
      loop();
    }
    function loop() {
      if (paused || over) return;
      ball.x += ball.vx;
      ball.y += ball.vy;
      if (ball.y - ball.r < 0) {
        ball.y = ball.r;
        ball.vy = -ball.vy;
      }
      if (ball.y + ball.r > H) {
        ball.y = H - ball.r;
        ball.vy = -ball.vy;
      }
      if (
        ball.x - ball.r < padW + 4 &&
        ball.y > leftY &&
        ball.y < leftY + padH &&
        ball.vx < 0
      ) {
        ball.x = padW + 4 + ball.r;
        ball.vx = -ball.vx * 1.05;
        ball.vy += (ball.y - (leftY + padH / 2)) * 0.08;
        if (ball.vx > 12) ball.vx = 12;
      }
      if (
        ball.x + ball.r > W - padW - 4 &&
        ball.y > rightY &&
        ball.y < rightY + padH &&
        ball.vx > 0
      ) {
        ball.x = W - padW - 4 - ball.r;
        ball.vx = -ball.vx * 1.05;
        ball.vy += (ball.y - (rightY + padH / 2)) * 0.08;
        if (ball.vx < -12) ball.vx = -12;
      }
      var target = ball.y - padH / 2,
        cpuSpeed = 3.2 + Math.min(2, Math.abs(ball.vx) * 0.15);
      if (rightY + padH / 2 < target + padH / 2 - 4) rightY += cpuSpeed;
      else if (rightY + padH / 2 > target + padH / 2 + 4) rightY -= cpuSpeed;
      rightY = Math.max(0, Math.min(H - padH, rightY));
      if (ball.x < -20) {
        scoreR++;
        if (scoreR > best) {
          best = scoreR;
          S.games.pongBest = scoreR;
          save();
        }
        serve();
      } else if (ball.x > W + 20) {
        scoreL++;
        serve();
      }
      draw();
      raf = requestAnimationFrame(loop);
    }
    function serve() {
      ball = {
        x: W / 2,
        y: H / 2,
        vx: (Math.random() < 0.5 ? -1 : 1) * 3.5,
        vy: (Math.random() < 0.5 ? -1 : 1) * 2.4,
        r: 6,
      };
      status.textContent =
        "You " +
        scoreL +
        "  \u2014  " +
        scoreR +
        " CPU   Best CPU streak: " +
        best;
      if (scoreL >= 7 || scoreR >= 7) {
        over = true;
        if (raf) {
          cancelAnimationFrame(raf);
          raf = null;
        }
        var msg = scoreL >= 7 ? "You won!" : "CPU won!";
        msgBox({
          title: "Pong",
          icon: "info",
          text: msg + "\n\nFinal: You " + scoreL + " \u2014 " + scoreR + " CPU",
          buttons: [{ label: "Play Again", fn: newGame }, { label: "Close" }],
        });
        return;
      }
      paused = true;
      status.textContent += "   \u2014 Press a key or tap";
    }
    function draw() {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "#333";
      ctx.setLineDash([5, 8]);
      ctx.beginPath();
      ctx.moveTo(W / 2, 0);
      ctx.lineTo(W / 2, H);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#fff";
      ctx.fillRect(4, leftY, padW, padH);
      ctx.fillRect(W - padW - 4, rightY, padW, padH);
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "bold 24px Courier New, monospace";
      ctx.fillStyle = "#555";
      ctx.fillText(String(scoreL), W / 2 - 40, 32);
      ctx.fillText(String(scoreR), W / 2 + 30, 32);
    }
    function movePaddle(dy) {
      leftY = Math.max(0, Math.min(H - padH, leftY + dy));
      draw();
    }
    function onKey(e) {
      var k = e.key.toLowerCase(),
        used = true;
      if (k === "arrowup" || k === "w") movePaddle(-22);
      else if (k === "arrowdown" || k === "s") movePaddle(22);
      else if (k === " ") {
        if (paused) start();
      } else used = false;
      if (used) {
        e.preventDefault();
        if (paused && k !== " ") start();
      }
    }
    var root = el(
      "div",
      {
        class: "col",
        style: "flex:1;min-height:0;padding:6px;gap:6px;outline:none",
        tabindex: "0",
      },
      el(
        "div",
        { class: "row", style: "gap:6px;justify-content:center" },
        el("button", { class: "btn sm", onclick: newGame }, "New Game")
      ),
      status,
      cv,
      el(
        "div",
        { class: "dim", style: "text-align:center;padding:4px 0 0" },
        "You are the left paddle. Move with Up/Down or W/S. First to 7 wins."
      )
    );
    var touchY = null;
    cv.addEventListener("pointerdown", function (e) {
      cv.focus();
      e.preventDefault();
      if (paused) {
        start();
        return;
      }
      touchY = e.clientY;
    });
    cv.addEventListener("pointermove", function (e) {
      if (touchY === null) return;
      var rect = cv.getBoundingClientRect();
      var y = (e.clientY - rect.top) * (H / rect.height);
      leftY = Math.max(0, Math.min(H - padH, y - padH / 2));
      touchY = e.clientY;
      draw();
    });
    cv.addEventListener("pointerup", function () {
      touchY = null;
    });
    root.addEventListener("keydown", onKey);
    cv.addEventListener("keydown", onKey);
    w.body.append(root);
    w.stop = function () {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    };
    w.refresh = null;
    setTimeout(function () {
      root.focus();
      cv.focus();
    }, 0);
    newGame();
  }

  function appSudoku(w) {
    var diff = "medium";
    var puzzle = [],
      solution = [],
      given = [],
      sel = -1,
      notes = [],
      secs = 0,
      tmr = null,
      noteMode = false;
    var DIFFS = { easy: 45, medium: 36, hard: 28, expert: 22 };
    function shuffle(a) {
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1)),
          t = a[i];
        a[i] = a[j];
        a[j] = t;
      }
      return a;
    }
    function canPlace(bd, r, c, v) {
      for (var i = 0; i < 9; i++) {
        if (bd[r][i] === v) return false;
        if (bd[i][c] === v) return false;
      }
      var br = Math.floor(r / 3) * 3,
        bc = Math.floor(c / 3) * 3;
      for (var dr = 0; dr < 3; dr++)
        for (var dc = 0; dc < 3; dc++)
          if (bd[br + dr][bc + dc] === v) return false;
      return true;
    }
    function solve(bd) {
      for (var r = 0; r < 9; r++)
        for (var c = 0; c < 9; c++)
          if (!bd[r][c]) {
            var nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            for (var i = 0; i < 9; i++) {
              var v = nums[i];
              if (canPlace(bd, r, c, v)) {
                bd[r][c] = v;
                if (solve(bd)) return true;
                bd[r][c] = 0;
              }
            }
            return false;
          }
      return true;
    }
    function countSolutions(bd, cap) {
      var count = 0;
      function rec() {
        if (count >= cap) return;
        for (var r = 0; r < 9; r++)
          for (var c = 0; c < 9; c++)
            if (!bd[r][c]) {
              for (var v = 1; v <= 9; v++)
                if (canPlace(bd, r, c, v)) {
                  bd[r][c] = v;
                  rec();
                  bd[r][c] = 0;
                  if (count >= cap) return;
                }
              return;
            }
        count++;
      }
      rec();
      return count;
    }
    function generate(difficulty) {
      var bd = [];
      for (var r = 0; r < 9; r++) bd.push([0, 0, 0, 0, 0, 0, 0, 0, 0]);
      solve(bd);
      solution = bd.map(function (row) {
        return row.slice();
      });
      var clues = DIFFS[difficulty] || 36;
      var cells = [];
      for (var i = 0; i < 81; i++) cells.push(i);
      shuffle(cells);
      var remove = 81 - clues;
      for (var k = 0; k < remove; k++) {
        var idx = cells[k],
          r0 = Math.floor(idx / 9),
          c0 = idx % 9;
        if (!bd[r0][c0]) continue;
        var save = bd[r0][c0];
        bd[r0][c0] = 0;
        if (
          countSolutions(
            bd.map(function (x) {
              return x.slice();
            }),
            2
          ) !== 1
        )
          bd[r0][c0] = save;
      }
      puzzle = bd.map(function (row) {
        return row.slice();
      });
      given = bd.map(function (row) {
        return row.map(function (v) {
          return !!v;
        });
      });
    }
    var board = el("div", { class: "sudoku-board" });
    var pad = el("div", { class: "sudoku-pad" });
    var info = el("div", {
      style: "font-weight:bold;min-height:18px;text-align:center",
    });
    var diffSel = el(
      "select",
      {
        class: "in",
        onchange: function () {
          diff = this.value;
          newGame();
        },
      },
      [
        ["easy", "Easy"],
        ["medium", "Medium"],
        ["hard", "Hard"],
        ["expert", "Expert"],
      ].map(function (o) {
        return el("option", { value: o[0], selected: o[0] === diff }, o[1]);
      })
    );
    function newGame() {
      if (tmr) {
        clearInterval(tmr);
        tmr = null;
      }
      generate(diff);
      notes = [];
      for (var i = 0; i < 81; i++) notes.push([]);
      sel = -1;
      secs = 0;
      paint();
      tmr = setInterval(function () {
        secs++;
        paintInfo();
      }, 1000);
      w.status("New " + diff + " puzzle");
    }
    function conflicts() {
      var bad = {};
      for (var r = 0; r < 9; r++)
        for (var c = 0; c < 9; c++) {
          var v = puzzle[r][c];
          if (!v) continue;
          for (var i = 0; i < 9; i++) {
            if (i !== c && puzzle[r][i] === v) {
              bad[r + "," + c] = 1;
              bad[r + "," + i] = 1;
            }
            if (i !== r && puzzle[i][c] === v) {
              bad[i + "," + c] = 1;
              bad[r + "," + c] = 1;
            }
          }
          var br = Math.floor(r / 3) * 3,
            bc = Math.floor(c / 3) * 3;
          for (var dr = 0; dr < 3; dr++)
            for (var dc = 0; dc < 3; dc++) {
              var r2 = br + dr,
                c2 = bc + dc;
              if ((r2 !== r || c2 !== c) && puzzle[r2][c2] === v) {
                bad[r + "," + c] = 1;
                bad[r2 + "," + c2] = 1;
              }
            }
        }
      return bad;
    }
    function paintInfo() {
      var filled = 0;
      for (var r = 0; r < 9; r++)
        for (var c = 0; c < 9; c++) if (puzzle[r][c]) filled++;
      info.textContent =
        mmss(secs) + "  \u00b7  " + filled + "/81  \u00b7  " + diff;
    }
    function paint() {
      var bad = conflicts();
      board.textContent = "";
      for (var r = 0; r < 9; r++)
        for (var c = 0; c < 9; c++) {
          var v = puzzle[r][c];
          var cls = "sudoku-cell" + (given[r][c] ? " given" : "");
          if (sel >= 0) {
            var sr = Math.floor(sel / 9),
              sc = sel % 9;
            if (sr === r && sc === c) cls += " sel";
            else if (
              sr === r ||
              sc === c ||
              (Math.floor(sr / 3) === Math.floor(r / 3) &&
                Math.floor(sc / 3) === Math.floor(c / 3))
            )
              cls += " peer";
            if (v && v === puzzle[sr][sc]) cls += " same";
          }
          if (bad[r + "," + c]) cls += " err";
          var txt = v
            ? String(v)
            : notes[r * 9 + c] && notes[r * 9 + c].length
            ? notes[r * 9 + c].join("")
            : "";
          var cell = el(
            "div",
            {
              class: cls,
              "data-r": r,
              "data-c": c,
              style:
                !v && notes[r * 9 + c] && notes[r * 9 + c].length
                  ? "font-size:10px;color:#606060;font-family:Tahoma,sans-serif"
                  : "",
            },
            txt
          );
          cell.addEventListener(
            "click",
            (function (rr, cc) {
              return function () {
                sel = rr * 9 + cc;
                paint();
              };
            })(r, c)
          );
          board.append(cell);
        }
      paintInfo();
      var done = true;
      for (var rr2 = 0; rr2 < 9 && done; rr2++)
        for (var cc2 = 0; cc2 < 9 && done; cc2++)
          if (puzzle[rr2][cc2] !== solution[rr2][cc2]) done = false;
      if (done && tmr) {
        clearInterval(tmr);
        tmr = null;
        setTimeout(function () {
          msgBox({
            title: "Sudoku",
            icon: "info",
            text: "Solved in " + mmss(secs) + "!",
            buttons: [{ label: "New Game", fn: newGame }, { label: "Close" }],
          });
        }, 200);
      }
    }
    function place(v) {
      if (sel < 0 || given[Math.floor(sel / 9)][sel % 9]) return;
      puzzle[Math.floor(sel / 9)][sel % 9] = v;
      notes[sel] = [];
      paint();
    }
    function toggleNote(v) {
      if (
        sel < 0 ||
        given[Math.floor(sel / 9)][sel % 9] ||
        puzzle[Math.floor(sel / 9)][sel % 9]
      )
        return;
      var arr = notes[sel];
      var i = arr.indexOf(v);
      if (i >= 0) arr.splice(i, 1);
      else arr.push(v);
      arr.sort();
      paint();
    }
    var noteBtn = el(
      "button",
      {
        class: "btn sm",
        onclick: function () {
          noteMode = !noteMode;
          noteBtn.classList.toggle("on", noteMode);
        },
      },
      "Note mode"
    );
    for (var n = 1; n <= 9; n++)
      (function (v) {
        pad.append(
          el(
            "button",
            {
              class: "btn",
              onclick: function () {
                if (noteMode) toggleNote(v);
                else place(v);
              },
            },
            String(v)
          )
        );
      })(n);
    function erase() {
      if (sel >= 0 && !given[Math.floor(sel / 9)][sel % 9]) {
        puzzle[Math.floor(sel / 9)][sel % 9] = 0;
        notes[sel] = [];
        paint();
      }
    }
    function hint() {
      if (sel < 0) {
        w.status("Pick a cell first");
        return;
      }
      var r = Math.floor(sel / 9),
        c = sel % 9;
      if (given[r][c]) return;
      puzzle[r][c] = solution[r][c];
      paint();
    }
    function keyHand(e) {
      if (!wins.games || wins.games !== active) return;
      if (
        !w.el.contains(document.activeElement) &&
        document.activeElement !== document.body
      )
        return;
      if (/^[1-9]$/.test(e.key)) {
        e.preventDefault();
        if (noteMode) toggleNote(+e.key);
        else place(+e.key);
      } else if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        erase();
      } else if (e.key === "ArrowUp" && sel >= 9) {
        e.preventDefault();
        sel -= 9;
        paint();
      } else if (e.key === "ArrowDown" && sel < 72) {
        e.preventDefault();
        sel += 9;
        paint();
      } else if (e.key === "ArrowLeft" && sel % 9 > 0) {
        e.preventDefault();
        sel--;
        paint();
      } else if (e.key === "ArrowRight" && sel % 9 < 8) {
        e.preventDefault();
        sel++;
        paint();
      }
    }
    document.addEventListener("keydown", keyHand);
    w.body.append(
      el(
        "div",
        { class: "sudoku-wrap" },
        el(
          "div",
          {
            class: "row",
            style: "gap:6px;flex-wrap:wrap;justify-content:center",
          },
          diffSel,
          el("button", { class: "btn sm", onclick: newGame }, "New Puzzle"),
          noteBtn,
          el("button", { class: "btn sm", onclick: erase }, "Erase"),
          el("button", { class: "btn sm", onclick: hint }, "Hint")
        ),
        board,
        pad,
        info
      )
    );
    w.stop = function () {
      if (tmr) {
        clearInterval(tmr);
        tmr = null;
      }
      document.removeEventListener("keydown", keyHand);
    };
    w.refresh = null;
    newGame();
  }

  function appBoard(w) {
    var pick = el("div", { class: "board-tabs" });
    var host = el("div", { class: "board-wrap" });
    var status = el("div", { class: "board-info" });
    var cur = "ttt";
    function newTtt() {
      var b = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      function winner(s) {
        var L = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6],
        ];
        for (var i = 0; i < L.length; i++) {
          var a = L[i];
          if (s[a[0]] && s[a[0]] === s[a[1]] && s[a[1]] === s[a[2]])
            return s[a[0]];
        }
        return 0;
      }
      function moves(s) {
        var o = [];
        for (var i = 0; i < 9; i++) if (!s[i]) o.push(i);
        return o;
      }
      function minimax(s, player, depth) {
        var wn = winner(s);
        if (wn === 2) return { s: 10 - depth };
        if (wn === 1) return { s: depth - 10 };
        if (!moves(s).length) return { s: 0 };
        var best = { s: player === 2 ? -Infinity : Infinity, i: -1 };
        moves(s).forEach(function (i) {
          s[i] = player;
          var r = minimax(s, player === 2 ? 1 : 2, depth + 1);
          s[i] = 0;
          if (player === 2) {
            if (r.s > best.s) best = { s: r.s, i: i };
          } else {
            if (r.s < best.s) best = { s: r.s, i: i };
          }
        });
        return best;
      }
      function render() {
        host.textContent = "";
        var grid = el("div", {
          style:
            "display:grid;grid-template-columns:repeat(3,1fr);gap:4px;width:min(300px,80vw);margin:0 auto",
        });
        b.forEach(function (v, i) {
          var cell = el(
            "div",
            {
              style:
                "aspect-ratio:1;display:flex;align-items:center;justify-content:center;background:#fff;font:bold 60px Arial;cursor:default;box-shadow:inset 1px 1px #808080,inset -1px -1px #fff",
            },
            v === 1 ? "X" : v === 2 ? "O" : ""
          );
          cell.style.color = v === 1 ? "#000080" : "#c00000";
          cell.addEventListener("click", function () {
            if (b[i] || winner(b)) return;
            b[i] = 1;
            var wn = winner(b);
            if (!wn && moves(b).length) {
              var m = minimax(b.slice(), 2, 0);
              if (m.i >= 0) b[m.i] = 2;
              wn = winner(b);
            }
            render();
            var w2 = winner(b);
            if (w2 === 1) status.textContent = "You win!";
            else if (w2 === 2) status.textContent = "CPU wins.";
            else if (!moves(b).length) status.textContent = "Draw.";
            else status.textContent = "Your move.";
          });
          grid.append(cell);
        });
        host.append(grid);
      }
      render();
      status.textContent = "Your move \u2014 you are X.";
    }
    function newC4() {
      var COLS = 7,
        ROWS = 6;
      var b = [];
      for (var r = 0; r < ROWS; r++) b.push(new Array(COLS).fill(0));
      function drop(col, who) {
        for (var r = ROWS - 1; r >= 0; r--)
          if (!b[r][col]) {
            b[r][col] = who;
            return r;
          }
        return -1;
      }
      function winnerFor(who) {
        for (var r = 0; r < ROWS; r++)
          for (var c = 0; c < COLS; c++) {
            if (b[r][c] !== who) continue;
            var dirs = [
              [0, 1],
              [1, 0],
              [1, 1],
              [1, -1],
            ];
            for (var d = 0; d < dirs.length; d++) {
              var dr = dirs[d][0],
                dc = dirs[d][1],
                ok = true;
              for (var k = 1; k < 4; k++) {
                var rr = r + dr * k,
                  cc = c + dc * k;
                if (
                  rr < 0 ||
                  rr >= ROWS ||
                  cc < 0 ||
                  cc >= COLS ||
                  b[rr][cc] !== who
                ) {
                  ok = false;
                  break;
                }
              }
              if (ok) return true;
            }
          }
        return false;
      }
      function bestCpu() {
        var ordered = [3, 2, 4, 1, 5, 0, 6];
        for (var i = 0; i < ordered.length; i++) {
          var c = ordered[i];
          if (b[0][c]) continue;
          var r = drop(c, 2);
          if (winnerFor(2)) {
            b[r][c] = 0;
            return c;
          }
          b[r][c] = 0;
        }
        for (var i2 = 0; i2 < ordered.length; i2++) {
          var c2 = ordered[i2];
          if (b[0][c2]) continue;
          var r2 = drop(c2, 1);
          if (winnerFor(1)) {
            b[r2][c2] = 0;
            return c2;
          }
          b[r2][c2] = 0;
        }
        for (var i3 = 0; i3 < ordered.length; i3++)
          if (!b[0][ordered[i3]]) return ordered[i3];
        return -1;
      }
      function render() {
        host.textContent = "";
        var grid = el("div", {
          style:
            "display:grid;grid-template-columns:repeat(7,1fr);gap:3px;background:#000080;padding:4px;width:min(360px,84vw)",
        });
        for (var r = 0; r < ROWS; r++)
          for (var c = 0; c < COLS; c++) {
            var v = b[r][c];
            var cell = el("div", {
              style:
                "aspect-ratio:1;border-radius:50%;background:" +
                (v === 1 ? "#c00000" : v === 2 ? "#ffd000" : "#fff") +
                ";cursor:default",
            });
            (function (cc) {
              cell.addEventListener("click", function () {
                if (b[0][cc] || winnerFor(1) || winnerFor(2)) return;
                drop(cc, 1);
                if (!winnerFor(1)) {
                  var mc = bestCpu();
                  if (mc >= 0) drop(mc, 2);
                }
                render();
                if (winnerFor(1)) status.textContent = "You win!";
                else if (winnerFor(2)) status.textContent = "CPU wins.";
                else if (
                  b[0].every(function (x) {
                    return x;
                  })
                )
                  status.textContent = "Draw.";
                else status.textContent = "Your move \u2014 click a column.";
              });
            })(c);
            grid.append(cell);
          }
        host.append(grid);
      }
      render();
      status.textContent = "You are red. Click a column to drop.";
    }
    function newCheckers() {
      var b = [];
      for (var r = 0; r < 8; r++) {
        b.push([]);
        for (var c = 0; c < 8; c++) {
          var dark = (r + c) % 2 === 1,
            piece = 0;
          if (dark && r < 3) piece = 2;
          else if (dark && r > 4) piece = 1;
          b[r].push(piece);
        }
      }
      var turn = 1,
        sel = null;
      function king(p) {
        return p === 3 || p === 4;
      }
      function own(p, who) {
        return who === 1 ? p === 1 || p === 3 : p === 2 || p === 4;
      }
      function enemy(p, who) {
        return who === 1 ? p === 2 || p === 4 : p === 1 || p === 3;
      }
      function dirsFor(p) {
        if (king(p))
          return [
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1],
          ];
        return own(p, 1)
          ? [
              [-1, -1],
              [-1, 1],
            ]
          : [
              [1, -1],
              [1, 1],
            ];
      }
      function jumpsFrom(r, c) {
        var out = [],
          p = b[r][c];
        dirsFor(p).forEach(function (d) {
          var mr = r + d[0],
            mc = c + d[1],
            tr = r + 2 * d[0],
            tc = c + 2 * d[1];
          if (tr < 0 || tr > 7 || tc < 0 || tc > 7) return;
          if (enemy(b[mr][mc], 1) && !b[tr][tc])
            out.push({ to: [tr, tc], cap: [mr, mc] });
        });
        return out;
      }
      function movesFrom(r, c) {
        var j = jumpsFrom(r, c);
        if (j.length) return j;
        var out = [],
          p = b[r][c];
        dirsFor(p).forEach(function (d) {
          var tr = r + d[0],
            tc = c + d[1];
          if (tr < 0 || tr > 7 || tc < 0 || tc > 7) return;
          if (!b[tr][tc]) out.push({ to: [tr, tc] });
        });
        return out;
      }
      function applyMove(r, c, mv) {
        var p = b[r][c];
        b[r][c] = 0;
        b[mv.to[0]][mv.to[1]] = p;
        if (mv.cap) b[mv.cap[0]][mv.cap[1]] = 0;
        if (p === 1 && mv.to[0] === 0) b[mv.to[0]][mv.to[1]] = 3;
        if (p === 2 && mv.to[0] === 7) b[mv.to[0]][mv.to[1]] = 4;
      }
      function cpuTurn() {
        if (turn !== 2) return;
        var best = null;
        for (var r = 0; r < 8; r++)
          for (var c = 0; c < 8; c++) {
            if (!own(b[r][c], 2)) continue;
            var ms = movesFrom(r, c);
            ms.forEach(function (m) {
              var score = m.cap ? 10 : 1;
              if (m.to[0] === 7) score += 5;
              if (!best || score > best.score)
                best = { r: r, c: c, m: m, score: score };
            });
          }
        if (!best) {
          turn = 1;
          status.textContent = "CPU cannot move \u2014 your turn.";
          render();
          return;
        }
        applyMove(best.r, best.c, best.m);
        turn = 1;
        render();
        status.textContent = "Your move.";
      }
      function render() {
        host.textContent = "";
        var grid = el("div", {
          style:
            "display:grid;grid-template-columns:repeat(8,1fr);width:min(400px,86vw);background:#8b5a2b;padding:4px",
        });
        for (var r = 0; r < 8; r++)
          for (var c = 0; c < 8; c++) {
            var dark = (r + c) % 2 === 1;
            var cell = el("div", {
              style:
                "aspect-ratio:1;background:" +
                (dark ? "#5a3410" : "#f0d9b5") +
                ";display:flex;align-items:center;justify-content:center;cursor:default",
            });
            if (sel && sel.r === r && sel.c === c)
              cell.style.outline = "3px solid #ffff00";
            var p = b[r][c];
            if (p) {
              var isK = king(p),
                isUser = own(p, 1);
              cell.append(
                el("div", {
                  style:
                    "width:70%;aspect-ratio:1;border-radius:50%;background:" +
                    (isUser ? "#c00000" : "#101010") +
                    ";box-shadow:inset -2px -2px 0 rgba(0,0,0,.4),inset 2px 2px 0 rgba(255,255,255,.25);" +
                    (isK ? "border:3px solid #ffd000;" : ""),
                })
              );
            }
            (function (rr, cc, dk) {
              cell.addEventListener("click", function () {
                if (!dk || turn !== 1) return;
                if (sel) {
                  var ms = movesFrom(sel.r, sel.c);
                  var m = ms.filter(function (x) {
                    return x.to[0] === rr && x.to[1] === cc;
                  })[0];
                  if (m) {
                    applyMove(sel.r, sel.c, m);
                    sel = null;
                    var cpuLost = !b.some(function (row) {
                      return row.some(function (v) {
                        return own(v, 2);
                      });
                    });
                    if (cpuLost) {
                      render();
                      status.textContent = "You win!";
                      return;
                    }
                    var userLost = !b.some(function (row) {
                      return row.some(function (v) {
                        return own(v, 1);
                      });
                    });
                    if (userLost) {
                      render();
                      status.textContent = "CPU wins.";
                      return;
                    }
                    turn = 2;
                    render();
                    setTimeout(cpuTurn, 250);
                    return;
                  }
                }
                if (own(b[rr][cc], 1)) {
                  sel = { r: rr, c: cc };
                  render();
                } else {
                  sel = null;
                  render();
                }
              });
            })(r, c, dark);
            grid.append(cell);
          }
        host.append(grid);
      }
      render();
      status.textContent =
        "You are red (bottom). Click a piece, then a square.";
    }
    var tabs = [
      ["ttt", "Tic-Tac-Toe", newTtt],
      ["c4", "Connect Four", newC4],
      ["checkers", "Checkers", newCheckers],
    ];
    function activate(k) {
      cur = k;
      host.textContent = "";
      status.textContent = "";
      pick.textContent = "";
      tabs.forEach(function (t) {
        pick.append(
          el(
            "button",
            {
              class: "btn sm" + (cur === t[0] ? " on" : ""),
              onclick: function () {
                activate(t[0]);
              },
            },
            t[1]
          )
        );
      });
      tabs.filter(function (t) {
        return t[0] === k;
      })[0][2]();
    }
    w.body.append(
      el(
        "div",
        { class: "col", style: "flex:1;min-height:0;overflow:auto" },
        pick,
        status,
        host
      )
    );
    w.refresh = null;
    activate("ttt");
  }

  var MEM_SAMPLE = [
    ["Photosynthesis", "Plants turning light into sugar"],
    ["Mitosis", "Cell division making identical cells"],
    ["Osmosis", "Water moving across a membrane"],
    ["Inertia", "Resistance to a change in motion"],
    ["Democracy", "Government by the people"],
    ["Metaphor", "Describing one thing as another"],
    ["Algorithm", "Step-by-step way to solve a problem"],
    ["Erosion", "Wearing away of rock and soil"],
    ["Hypothesis", "A testable explanation"],
    ["Ecosystem", "Living things and their environment"],
  ];
  function appMemory(w) {
    var deckSel = el("select", {
      class: "in",
      onchange: function () {
        newGame();
      },
    });
    var pairsSel = el(
      "select",
      {
        class: "in",
        onchange: function () {
          newGame();
        },
      },
      [6, 8, 10].map(function (n) {
        return el("option", { value: n, selected: n === 8 }, n + " pairs");
      })
    );
    var grid = el("div", { class: "mem-grid" });
    var tiles = [],
      first = null,
      lock = false,
      moves = 0,
      found = 0,
      pairs = 0,
      secs = 0,
      tmr = null,
      started = false,
      pend = [];
    function fillDecks() {
      var v = deckSel.value,
        ds = {};
      S.cards.forEach(function (c) {
        ds[c.deck] = (ds[c.deck] || 0) + 1;
      });
      deckSel.textContent = "";
      deckSel.append(el("option", { value: "" }, "Sample words"));
      deckSel.append(
        el(
          "option",
          { value: "*" },
          "All my flash cards (" + S.cards.length + ")"
        )
      );
      Object.keys(ds)
        .sort()
        .forEach(function (d) {
          deckSel.append(
            el("option", { value: "d:" + d }, d + " (" + ds[d] + ")")
          );
        });
      var ok = [].some.call(deckSel.options, function (o) {
        return o.value === v;
      });
      deckSel.value = ok ? v : S.cards.length >= 4 ? "*" : "";
    }
    function stopT() {
      if (tmr) {
        clearInterval(tmr);
        tmr = null;
      }
      pend.forEach(clearTimeout);
      pend = [];
    }
    w.stop = stopT;
    function bar() {
      w.status(
        "Moves: " +
          moves +
          "     Time: " +
          mmss(secs) +
          "     Matched: " +
          found +
          "/" +
          pairs
      );
    }
    function source() {
      var v = deckSel.value,
        list;
      if (v === "")
        list = MEM_SAMPLE.map(function (p) {
          return { q: p[0], a: p[1] };
        });
      else if (v === "*") list = S.cards.slice();
      else
        list = S.cards.filter(function (c) {
          return "d:" + c.deck === v;
        });
      if (list.length < 3)
        list = MEM_SAMPLE.map(function (p) {
          return { q: p[0], a: p[1] };
        });
      return list;
    }
    function newGame() {
      stopT();
      first = null;
      lock = false;
      moves = 0;
      found = 0;
      secs = 0;
      started = false;
      var list = source();
      for (var i = list.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1)),
          t = list[i];
        list[i] = list[j];
        list[j] = t;
      }
      var n = Math.min(parseInt(pairsSel.value, 10) || 8, list.length);
      pairs = n;
      tiles = [];
      list.slice(0, n).forEach(function (c, idx) {
        tiles.push(
          { id: idx, text: clip(c.q, 80), up: false, done: false },
          { id: idx, text: clip(c.a, 90), up: false, done: false }
        );
      });
      for (var k = tiles.length - 1; k > 0; k--) {
        var m = Math.floor(Math.random() * (k + 1)),
          tt = tiles[k];
        tiles[k] = tiles[m];
        tiles[m] = tt;
      }
      grid.textContent = "";
      tiles.forEach(function (t) {
        t.el = el("div", {
          class: "mt back",
          role: "button",
          tabindex: "0",
          onclick: function () {
            flip(t);
          },
          onkeydown: function (e) {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              flip(t);
            }
          },
        });
        grid.append(t.el);
      });
      bar();
    }
    function paintTile(t) {
      t.el.className = "mt " + (t.done ? "done" : t.up ? "up" : "back");
      t.el.textContent = t.up || t.done ? t.text : "";
    }
    function flip(t) {
      if (lock || t.up || t.done) return;
      if (!started) {
        started = true;
        tmr = setInterval(function () {
          secs++;
          bar();
        }, 1000);
      }
      t.up = true;
      paintTile(t);
      if (!first) {
        first = t;
        bar();
        return;
      }
      moves++;
      if (first.id === t.id) {
        first.done = t.done = true;
        paintTile(first);
        paintTile(t);
        found++;
        first = null;
        if (found === pairs) finish();
      } else {
        lock = true;
        var a = first,
          b = t;
        first = null;
        pend.push(
          setTimeout(function () {
            a.up = b.up = false;
            paintTile(a);
            paintTile(b);
            lock = false;
          }, 950)
        );
      }
      bar();
    }
    function finish() {
      stopT();
      var rec = false;
      if (pairs === 8 && (!S.games.memBest || moves < S.games.memBest)) {
        S.games.memBest = moves;
        save();
        rec = true;
      }
      setTimeout(function () {
        msgBox({
          title: "Memory Match",
          icon: "info",
          text:
            "You matched all " +
            pairs +
            " pairs in " +
            moves +
            " moves and " +
            mmss(secs) +
            "." +
            (rec
              ? "\nThat's a new best for 8 pairs!"
              : "\n" +
                (S.games.memBest
                  ? "Best for 8 pairs: " + S.games.memBest + " moves."
                  : "")),
          buttons: [{ label: "Play Again", fn: newGame }, { label: "Close" }],
        });
      }, 250);
    }
    w.body.append(
      el(
        "div",
        { class: "col mem" },
        el(
          "div",
          { class: "row", style: "gap:6px;align-items:center;flex-wrap:wrap" },
          el("span", null, "Deck:"),
          deckSel,
          pairsSel,
          el("button", { class: "btn sm", onclick: newGame }, "New Game")
        ),
        el(
          "div",
          { class: "dim", style: "padding:0" },
          "Match each term with its definition. Your own flash cards make this a study session."
        ),
        grid
      )
    );
    w.refresh = function () {
      fillDecks();
    };
    fillDecks();
    newGame();
  }

  var RANKS = [
    "",
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  var SUIT_IC = ["su_s", "su_h", "su_c", "su_d"];
  function appSolitaire(w) {
    var G = null,
      undo = [],
      sel = null,
      drawN = 3,
      secs = 0,
      tmr = null,
      started = false,
      won = false,
      raf = 0,
      cvs = null,
      cw = 70,
      ch = 98,
      field = null;
    var area = el("div", { class: "sol-area" });
    function stopT() {
      if (tmr) {
        clearInterval(tmr);
        tmr = null;
      }
    }
    function stopCascade() {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      if (cvs) {
        cvs.remove();
        cvs = null;
      }
    }
    w.stop = function () {
      stopT();
      stopCascade();
    };
    function bar() {
      if (G)
        w.status(
          "Score: " +
            G.score +
            "     Time: " +
            mmss(secs) +
            "     Moves: " +
            G.moves +
            "     Draw " +
            (drawN === 3 ? "three" : "one")
        );
    }
    function snap() {
      undo.push(JSON.stringify(G));
      if (undo.length > 300) undo.shift();
    }
    function begin() {
      if (started) return;
      started = true;
      S.games.solPlayed = (S.games.solPlayed || 0) + 1;
      save();
      tmr = setInterval(function () {
        secs++;
        bar();
      }, 1000);
    }
    function newGame() {
      stopT();
      stopCascade();
      var deck = [],
        s0,
        r0;
      for (s0 = 0; s0 < 4; s0++)
        for (r0 = 1; r0 <= 13; r0++) deck.push({ r: r0, s: s0, up: false });
      for (var i = deck.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1)),
          t = deck[i];
        deck[i] = deck[j];
        deck[j] = t;
      }
      G = {
        stock: [],
        waste: [],
        found: [[], [], [], []],
        tab: [[], [], [], [], [], [], []],
        score: 0,
        moves: 0,
        pass: 0,
      };
      for (var c = 0; c < 7; c++)
        for (var k = 0; k <= c; k++) {
          var cd = deck.pop();
          cd.up = k === c;
          G.tab[c].push(cd);
        }
      G.stock = deck;
      undo = [];
      sel = null;
      secs = 0;
      started = false;
      won = false;
      paint();
    }
    function canFound(c) {
      return !!c && c.r === G.found[c.s].length + 1;
    }
    function toFound(src) {
      var pile = src === "waste" ? G.waste : G.tab[src],
        c = pile[pile.length - 1];
      if (!canFound(c)) return false;
      pile.pop();
      G.found[c.s].push(c);
      G.score += 10;
      if (src !== "waste") {
        var nt = pile[pile.length - 1];
        if (nt && !nt.up) {
          nt.up = true;
          G.score += 5;
        }
      }
      return true;
    }
    function drawStock() {
      if (G.stock.length) {
        var n = Math.min(drawN, G.stock.length);
        for (var j = 0; j < n; j++) {
          var c = G.stock.pop();
          c.up = true;
          G.waste.push(c);
        }
      } else if (G.waste.length) {
        G.pass++;
        if (drawN === 1) G.score = Math.max(0, G.score - 100);
        G.stock = G.waste.reverse().map(function (c) {
          c.up = false;
          return c;
        });
        G.waste = [];
      }
    }
    function cardsOf(sl) {
      if (sl.p === "waste") return [G.waste[G.waste.length - 1]];
      if (sl.p === "found") return [G.found[sl.i][G.found[sl.i].length - 1]];
      return G.tab[sl.i].slice(sl.k);
    }
    function tryMove(sl, p, i) {
      if (p === "stock" || p === "waste") return false;
      var cards = cardsOf(sl);
      if (!cards.length || !cards[0]) return false;
      var f = cards[0];
      if (p === "found") {
        if (
          cards.length !== 1 ||
          f.s !== i ||
          f.r !== G.found[i].length + 1 ||
          sl.p === "found"
        )
          return false;
      } else {
        if (sl.p === "tab" && sl.i === i) return false;
        var pile = G.tab[i],
          top = pile[pile.length - 1];
        if (!pile.length) {
          if (f.r !== 13) return false;
        } else if (!top.up || top.r !== f.r + 1 || top.s % 2 === f.s % 2)
          return false;
      }
      snap();
      begin();
      if (sl.p === "waste") G.waste.pop();
      else if (sl.p === "found") G.found[sl.i].pop();
      else {
        G.tab[sl.i].splice(sl.k);
        var nt = G.tab[sl.i][G.tab[sl.i].length - 1];
        if (nt && !nt.up) {
          nt.up = true;
          G.score += 5;
        }
      }
      if (p === "found") {
        G.found[i].push(f);
        G.score += 10;
      } else {
        cards.forEach(function (c) {
          G.tab[i].push(c);
        });
        if (sl.p === "waste") G.score += 5;
        else if (sl.p === "found") G.score = Math.max(0, G.score - 15);
      }
      G.moves++;
      sel = null;
      afterMove();
      return true;
    }
    function afterMove() {
      checkWin();
      paint();
    }
    function checkWin() {
      if (won) return;
      for (var s0 = 0; s0 < 4; s0++) if (G.found[s0].length !== 13) return;
      won = true;
      stopT();
      G.score += secs > 30 ? Math.round(700000 / secs) : 0;
      var g = S.games;
      g.solWins = (g.solWins || 0) + 1;
      if (!g.solBest || G.score > g.solBest) g.solBest = G.score;
      save();
      setTimeout(function () {
        cascade();
        msgBox({
          title: "Solitaire",
          icon: "info",
          text:
            "Congratulations, you won!\n\nTime: " +
            mmss(secs) +
            "\nScore: " +
            G.score,
          buttons: [{ label: "Deal Again", fn: newGame }, { label: "Close" }],
        });
      }, 80);
    }
    function autoAll() {
      if (won) return;
      snap();
      begin();
      var n = 0,
        again = true;
      while (again && n < 120) {
        again = false;
        if (toFound("waste")) {
          again = true;
          n++;
        }
        for (var t = 0; t < 7; t++)
          if (toFound(t)) {
            again = true;
            n++;
          }
      }
      if (n) {
        G.moves += n;
        sel = null;
        afterMove();
      } else undo.pop();
    }
    function doUndo() {
      if (won || !undo.length) return;
      G = JSON.parse(undo.pop());
      sel = null;
      paint();
    }
    function click(p, i, k) {
      if (p === "stock") {
        if (!G.stock.length && !G.waste.length) return;
        snap();
        begin();
        drawStock();
        G.moves++;
        sel = null;
        paint();
        return;
      }
      if (sel) {
        var same = sel.p === p && sel.i === i && sel.k === k;
        if (same) {
          sel = null;
          paint();
          return;
        }
        if (tryMove(sel, p, i)) return;
      }
      sel = null;
      if (p === "waste") {
        if (G.waste.length) sel = { p: "waste", i: 0, k: G.waste.length - 1 };
      } else if (p === "found") {
        if (G.found[i].length)
          sel = { p: "found", i: i, k: G.found[i].length - 1 };
      } else if (p === "tab") {
        var pile = G.tab[i];
        if (k >= 0 && k < pile.length && pile[k].up)
          sel = { p: "tab", i: i, k: k };
      }
      paint();
    }
    function target(e) {
      var t = e.target.closest && e.target.closest("[data-p]");
      return t
        ? {
            p: t.getAttribute("data-p"),
            i: +t.getAttribute("data-i"),
            k: +t.getAttribute("data-k"),
          }
        : null;
    }
    area.addEventListener("click", function (e) {
      if (cvs) {
        stopCascade();
        paint();
        return;
      }
      if (won) return;
      var t = target(e);
      if (!t) {
        sel = null;
        paint();
        return;
      }
      click(t.p, t.i, t.k);
    });
    area.addEventListener("dblclick", function (e) {
      if (won) return;
      var t = target(e);
      if (!t) return;
      var src = null;
      if (t.p === "waste" && G.waste.length) src = "waste";
      else if (
        t.p === "tab" &&
        t.k >= 0 &&
        t.k === G.tab[t.i].length - 1 &&
        G.tab[t.i][t.k].up
      )
        src = t.i;
      if (src === null) return;
      var pile = src === "waste" ? G.waste : G.tab[src];
      if (!canFound(pile[pile.length - 1])) return;
      snap();
      begin();
      toFound(src);
      G.moves++;
      sel = null;
      afterMove();
    });
    function slot(x, y, p, i, extra, icon) {
      return el(
        "div",
        {
          class: "psl" + (extra ? " " + extra : ""),
          style:
            "left:" +
            x +
            "px;top:" +
            y +
            "px;width:" +
            cw +
            "px;height:" +
            ch +
            "px",
          "data-p": p,
          "data-i": i,
          "data-k": -1,
        },
        icon ? pix(icon, 32) : null
      );
    }
    function cardEl(c, x, y, data, isSel) {
      var d = el("div", {
        class: "pc " + (c.up ? "up" : "down") + (isSel ? " sel" : ""),
        style:
          "left:" +
          x +
          "px;top:" +
          y +
          "px;width:" +
          cw +
          "px;height:" +
          ch +
          "px",
      });
      if (data) {
        d.setAttribute("data-p", data.p);
        d.setAttribute("data-i", data.i);
        d.setAttribute("data-k", data.k);
      }
      if (c.up) {
        d.style.color = c.s % 2 === 1 ? "#c00000" : "#000";
        d.append(el("div", { class: "ph" }, RANKS[c.r], pix(SUIT_IC[c.s], 16)));
        d.append(
          el("div", { class: "pm" }, pix(SUIT_IC[c.s], cw >= 56 ? 32 : 16))
        );
      }
      return d;
    }
    function paint() {
      if (!G) return;
      var aw = area.clientWidth || 620;
      var gap = Math.max(4, Math.round(aw * 0.012));
      cw = Math.max(40, Math.min(84, Math.floor((aw - gap * 8) / 7)));
      ch = Math.round(cw * 1.4);
      var dDown = Math.round(ch * 0.13),
        dUp = Math.round(ch * 0.27);
      var X = function (c) {
          return gap + c * (cw + gap);
        },
        topY = gap,
        tabY = gap * 2 + ch + 8;
      if (field) field.remove();
      field = el("div", { class: "sol-field" });
      var maxY = tabY + ch,
        s0,
        t,
        k,
        j;
      field.append(slot(X(0), topY, "stock", 0, G.stock.length ? null : "rec"));
      if (G.stock.length)
        field.append(
          cardEl(
            { r: 1, s: 0, up: false },
            X(0),
            topY,
            { p: "stock", i: 0, k: 0 },
            false
          )
        );
      var wn = G.waste.length,
        show = Math.min(drawN === 3 ? 3 : 1, wn),
        off = Math.round(cw * 0.22);
      field.append(slot(X(1), topY, "waste", 0));
      for (j = 0; j < show; j++) {
        var idx = wn - show + j,
          isTop = idx === wn - 1;
        field.append(
          cardEl(
            G.waste[idx],
            X(1) + j * off,
            topY,
            isTop ? { p: "waste", i: 0, k: idx } : null,
            isTop && !!sel && sel.p === "waste"
          )
        );
      }
      for (s0 = 0; s0 < 4; s0++) {
        field.append(slot(X(3 + s0), topY, "found", s0, null, SUIT_IC[s0]));
        var f = G.found[s0];
        if (f.length)
          field.append(
            cardEl(
              f[f.length - 1],
              X(3 + s0),
              topY,
              { p: "found", i: s0, k: f.length - 1 },
              !!sel && sel.p === "found" && sel.i === s0
            )
          );
      }
      for (t = 0; t < 7; t++) {
        field.append(slot(X(t), tabY, "tab", t));
        var pile = G.tab[t],
          y = tabY;
        for (k = 0; k < pile.length; k++) {
          var c = pile[k];
          field.append(
            cardEl(
              c,
              X(t),
              y,
              { p: "tab", i: t, k: k },
              !!sel && sel.p === "tab" && sel.i === t && k >= sel.k
            )
          );
          if (y + ch > maxY) maxY = y + ch;
          y += c.up ? dUp : dDown;
        }
      }
      field.style.height = maxY + gap + "px";
      area.append(field);
      bar();
    }
    function cdraw(ctx, c, x, y) {
      ctx.fillStyle = "#fff";
      ctx.fillRect(x, y, cw, ch);
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, cw - 1, ch - 1);
      ctx.fillStyle = c.s % 2 === 1 ? "#c00000" : "#000";
      ctx.font = "bold 14px Arial,sans-serif";
      ctx.textBaseline = "top";
      ctx.fillText(RANKS[c.r], x + 3, y + 3);
      var rows = ICONS[SUIT_IC[c.s]],
        ox = x + Math.round((cw - 32) / 2),
        oy = y + Math.round((ch - 32) / 2) + 6;
      for (var yy = 0; yy < 16; yy++)
        for (var xx = 0; xx < 16; xx++) {
          var chh = rows[yy].charAt(xx);
          if (chh !== ".") {
            ctx.fillStyle = VGA[chh];
            ctx.fillRect(ox + xx * 2, oy + yy * 2, 2, 2);
          }
        }
    }
    function cascade() {
      var W = area.clientWidth || 600,
        H = area.clientHeight || 400;
      cvs = el("canvas", {
        width: W,
        height: H,
        style: "position:absolute;left:0;top:0;pointer-events:none;z-index:30",
      });
      var ctx = cvs.getContext && cvs.getContext("2d");
      if (!ctx) {
        cvs = null;
        return;
      }
      area.append(cvs);
      var list = [],
        r0,
        s0;
      for (r0 = 13; r0 >= 1; r0--)
        for (s0 = 0; s0 < 4; s0++) list.push({ r: r0, s: s0 });
      var idx = 0,
        cur = null,
        gap = Math.max(4, Math.round(W * 0.012));
      function step() {
        if (!cvs) return;
        if (!cur) {
          if (idx >= list.length) {
            raf = 0;
            return;
          }
          var c = list[idx++];
          cur = {
            c: c,
            x: gap + (3 + c.s) * (cw + gap),
            y: gap,
            vx: (Math.random() < 0.5 ? -1 : 1) * (1.5 + Math.random() * 3),
            vy: -Math.random() * 4,
          };
        }
        for (var q = 0; q < 3 && cur; q++) {
          cur.x += cur.vx;
          cur.y += cur.vy;
          cur.vy += 0.45;
          if (cur.y + ch > H) {
            cur.y = H - ch;
            cur.vy = -cur.vy * 0.82;
            if (Math.abs(cur.vy) < 1.2) cur.vy = -6.5;
          }
          cdraw(ctx, cur.c, Math.round(cur.x), Math.round(cur.y));
          if (cur.x < -cw || cur.x > W) cur = null;
        }
        raf = requestAnimationFrame(step);
      }
      step();
    }
    var toolbar = el(
      "div",
      { class: "sol-bar" },
      el("button", { class: "btn sm", onclick: newGame }, "New Game"),
      el("button", { class: "btn sm", onclick: doUndo }, "Undo"),
      el(
        "button",
        {
          class: "btn sm",
          title: "Move every available card to the foundations",
          onclick: autoAll,
        },
        "Auto"
      ),
      el(
        "button",
        {
          class: "btn sm",
          onclick: function () {
            drawN = drawN === 3 ? 1 : 3;
            newGame();
          },
        },
        "Draw 1/3"
      ),
      el(
        "span",
        { class: "dim", style: "padding:0 4px" },
        "Tap a card, then tap where it goes."
      )
    );
    w.menus([
      {
        label: "Game",
        items: function () {
          return [
            { label: "Deal", fn: newGame },
            { label: "Undo", fn: doUndo },
            { label: "Auto-move to Foundations", fn: autoAll },
            { sep: 1 },
            {
              label: "Draw One",
              check: drawN === 1,
              fn: function () {
                drawN = 1;
                newGame();
              },
            },
            {
              label: "Draw Three",
              check: drawN === 3,
              fn: function () {
                drawN = 3;
                newGame();
              },
            },
            { sep: 1 },
            {
              label: "Statistics\u2026",
              fn: function () {
                var g = S.games;
                msgBox({
                  title: "Statistics",
                  icon: "info",
                  text:
                    "Games played: " +
                    (g.solPlayed || 0) +
                    "\nGames won: " +
                    (g.solWins || 0) +
                    "\nBest score: " +
                    (g.solBest || "---"),
                });
              },
            },
          ];
        },
      },
    ]);
    w.body.append(el("div", { class: "sol" }, toolbar, area));
    w.refresh = null;
    w.onresize = function () {
      if (!cvs) paint();
    };
    window.setTimeout(newGame, 0);
  }

  /* ================= APP: GAMES HUB ================= */
  function appGames(w) {
    var TABS = [
      ["sol", "Solitaire", appSolitaire],
      ["mem", "Memory", appMemory],
      ["g2048", "2048", app2048],
      ["snake", "Snake", appSnake],
      ["tetris", "Tetris", appTetris],
      ["pong", "Pong", appPong],
      ["mines", "Minesweeper", appMines],
      ["typing", "Typing", appTyping],
      ["sudoku", "Sudoku", appSudoku],
      ["board", "Board Games", appBoard],
    ];
    var cur = null,
      curKey = null;
    var tabBar = el("div", { class: "games-tabs" });
    var host = el("div", { class: "games-host" });
    function frameFor(buildFn) {
      var menuBar = el("div", { class: "menubar", hidden: true });
      var body = el("div", { class: "wbody", style: "flex:1;min-height:0" });
      var statusBar = el("div", { class: "status", hidden: true });
      var wrapper = el(
        "div",
        { class: "col", style: "flex:1;min-height:0" },
        menuBar,
        body,
        statusBar
      );
      var fake = {
        body: body,
        el: w.el,
        min: false,
        max: w.el.classList.contains("max"),
        status: function (t) {
          statusBar.hidden = false;
          statusBar.textContent = t;
        },
        menus: function (defs) {
          menuBar.hidden = false;
          menuBar.textContent = "";
          defs.forEach(function (d) {
            var b = el(
              "div",
              {
                class: "mb",
                onpointerdown: function (e) {
                  e.stopPropagation();
                  var r = b.getBoundingClientRect();
                  popMenu(r.left, r.bottom, d.items());
                },
              },
              d.label
            );
            menuBar.append(b);
          });
        },
        refresh: null,
        onresize: null,
        stop: null,
        savePos: function () {},
      };
      buildFn(fake);
      return { wrapper: wrapper, fake: fake };
    }
    function activate(key) {
      if (cur && cur.fake && typeof cur.fake.stop === "function") {
        try {
          cur.fake.stop();
        } catch (e) {}
      }
      curKey = key;
      host.textContent = "";
      var t = TABS.filter(function (x) {
        return x[0] === key;
      })[0];
      if (!t) return;
      paintTabs();
      var f = frameFor(t[2]);
      cur = f;
      host.append(f.wrapper);
    }
    function paintTabs() {
      tabBar.textContent = "";
      TABS.forEach(function (t) {
        tabBar.append(
          el(
            "button",
            {
              class: "games-tab" + (curKey === t[0] ? " on" : ""),
              onclick: function () {
                activate(t[0]);
              },
            },
            t[1]
          )
        );
      });
    }
    w.body.append(tabBar, host);
    w.onresize = function () {
      if (cur && cur.fake && cur.fake.onresize) cur.fake.onresize();
    };
    w.stop = function () {
      if (cur && cur.fake && typeof cur.fake.stop === "function")
        cur.fake.stop();
    };
    w.refresh = null;
    activate("sol");
  }

  /* ================= NEW APP BADGES ================= */
  function isNewApp(id) {
    var t = S.newApps[id];
    if (!isNum(t) || t <= 0) return false;
    return Date.now() - t < 7 * 86400000;
  }
  function markAppSeen(id) {
    if (S.newApps[id]) {
      S.newApps[id] = 0;
      save();
      buildIcons();
      if (!sm.hidden) buildStart();
    }
  }
  function flagNewApps() {
    var last = S.prefs.lastVersion || "";
    if (last === VERSION) return;
    var fresh = PATCHES.filter(function (p) {
      return verCmp(last, p.v) < 0;
    });
    fresh.forEach(function (p) {
      (p.apps || []).forEach(function (id) {
        if (!APPS[id] && id !== "sticky" && id !== "bin") return;
        if (S.newApps[id] === 0) return;
        S.newApps[id] = Date.now();
      });
    });
    S.prefs.lastVersion = VERSION;
    save();
  }
  function autoAddNewApps() {
    var known = S.desk.known || [];
    var all = Object.keys(APPS).concat(["sticky", "bin"]);
    var added = 0;
    all.forEach(function (id) {
      if (known.indexOf(id) >= 0) return;
      if (S.desk.ids.indexOf(id) < 0) {
        S.desk.ids.push(id);
        added++;
      }
    });
    S.desk.known = all;
    if (added) save();
    return added;
  }
  var CURSOR_SHAPES = {
    blocky: {
      hot: [0, 0],
      rows: [
        "X...............",
        "XX..............",
        "XoX.............",
        "XooX............",
        "XoooX...........",
        "XooooX..........",
        "XoooooX.........",
        "XooooooX........",
        "XoooooooX.......",
        "XooooooooX......",
        "XoooooXXXXXX....",
        "XooXooX.........",
        "XoX.XooX........",
        "XX..XooX........",
        "X....XooX.......",
        "......XXX.......",
      ],
    },
    dot: {
      hot: [7, 7],
      rows: [
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
        "......XXXX......",
        ".....XooooX.....",
        ".....XooooX.....",
        "......XXXX......",
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
      ],
    },
    pencil: {
      hot: [5, 15],
      rows: [
        "................",
        "................",
        "................",
        "................",
        "................",
        "..............XX",
        ".............Xoo",
        "............XooX",
        "...........XooX.",
        "..........XooX..",
        ".........XooX...",
        "........XooX....",
        ".......XooX.....",
        "......XooX......",
        ".....XXoX.......",
        ".....XX.........",
      ],
    },
    hand: {
      hot: [6, 1],
      rows: [
        "......XX........",
        ".....XooX.......",
        ".....XooX.......",
        ".....XooX.......",
        ".....XooX.XX....",
        ".....XooXXooX...",
        ".....XooXooXoX..",
        ".....XooXooXoX..",
        ".....XooXooXoXX.",
        ".....XooooooooX.",
        "......XoooooooX.",
        "......XoooooooX.",
        ".......XXoXXoXX.",
        ".........X..X...",
        "................",
        "................",
      ],
    },
    ibeam: {
      hot: [7, 7],
      rows: [
        "................",
        "................",
        "................",
        "......XX........",
        "......XX........",
        "......XX........",
        "......XX........",
        "....XXXXXX......",
        "....XooooX......",
        "....XXXXXX......",
        "......XX........",
        "......XX........",
        "......XX........",
        "......XX........",
        "................",
        "................",
      ],
    },
    cross: {
      hot: [7, 7],
      rows: [
        "................",
        ".......XX.......",
        ".......XX.......",
        ".......XX.......",
        ".......XX.......",
        ".......XX.......",
        ".......XX.......",
        "..XXXXXXXXXXXX..",
        "..XXXXXXXXXXXX..",
        ".......XX.......",
        ".......XX.......",
        ".......XX.......",
        ".......XX.......",
        ".......XX.......",
        ".......XX.......",
        "................",
      ],
    },
    move: {
      hot: [7, 7],
      rows: [
        ".......XX.......",
        "......XXXX......",
        ".....XXooXX.....",
        "....XXooooXX....",
        "....XXooooXX....",
        "....XXooooXX....",
        "....XXooooXX....",
        "..XXXXooooXXXX..",
        "..XooooooooooX..",
        "..XXXXXXXXXXXX..",
        ".......XX.......",
        ".......XX.......",
        ".......XX.......",
        ".......XX.......",
        ".......XX.......",
        "................",
      ],
    },
    ns: {
      hot: [7, 7],
      rows: [
        ".......XX.......",
        "......XXXX......",
        ".....XXooXX.....",
        "....XXooooXX....",
        "....XXooooXX....",
        ".......oo.......",
        ".......oo.......",
        ".......oo.......",
        ".......oo.......",
        ".......oo.......",
        ".......oo.......",
        "....XXooooXX....",
        "....XXooooXX....",
        ".....XXooXX.....",
        "......XXXX......",
        ".......XX.......",
      ],
    },
    ew: {
      hot: [7, 7],
      rows: [
        "................",
        "................",
        "................",
        "................",
        ".......oo.......",
        ".......oo.......",
        "..XXX..oo..XXX..",
        "..Xoo.oooo.ooX..",
        "..XXX.oooo.XXX..",
        "..XXX.oooo.XXX..",
        "..XXX..oo..XXX..",
        ".......oo.......",
        ".......oo.......",
        "................",
        "................",
        "................",
      ],
    },
    nwse: {
      hot: [7, 7],
      rows: [
        "..XX............",
        "..XoXX..........",
        "...XXoXX........",
        "....XXoXX.......",
        ".....XXoXX......",
        "......XXoXX.....",
        ".......XXoXX....",
        "........XXooX...",
        ".........XooXX..",
        "..........XooXX.",
        "...........XooX.",
        "............XX..",
        "................",
        "................",
        "................",
        "................",
      ],
    },
    nesw: {
      hot: [7, 7],
      rows: [
        "............XX..",
        "..........XXoX..",
        "........XXoXX...",
        ".......XXoXX....",
        "......XXoXX.....",
        ".....XXoXX......",
        "....XXoXX.......",
        "...XXooX........",
        "..XXooX.........",
        "..XooX..........",
        "..XXX...........",
        "................",
        "................",
        "................",
        "................",
        "................",
      ],
    },
    no: {
      hot: [7, 7],
      rows: [
        ".....XXXXXX.....",
        "...XX......XX...",
        "..X..........X..",
        ".X............X.",
        ".X...........XX.",
        "X...........XX..",
        "X..........XX...",
        "X.........XX....",
        "X........XX.....",
        "X.......XX......",
        ".X.....XX......X",
        ".X....XX......X.",
        "..X..XX......X..",
        "...XX......XX...",
        ".....XXXXXX.....",
        "................",
      ],
    },
    help: {
      hot: [0, 0],
      rows: [
        "XX..............",
        "XoX.............",
        "XooX............",
        "XoooX...........",
        "XooooX..........",
        "XoooooX.........",
        "XooooooX........",
        "XoooooooX.......",
        "XoooooXXXXX.....",
        "XooXooX....X....",
        "XoX.XooX........",
        "XX..XooX...X....",
        "X....XooX.XXX...",
        "......XXX..X....",
        "..........X.....",
        ".........XXX....",
      ],
    },
    wait: {
      hot: [7, 7],
      rows: [
        "................",
        "................",
        "..XXXXXXXXXX....",
        "..XooooooooX....",
        "..XoXXXXXXoX....",
        "...XoXXXXoX.....",
        "....XoXXoX......",
        ".....XooX.......",
        ".....XooX.......",
        "....XoXXoX......",
        "...XoXXXXoX.....",
        "..XoXXXXXXoX....",
        "..XooooooooX....",
        "..XXXXXXXXXX....",
        "................",
        "................",
      ],
    },
  };
  function buildCursorSvg(shape, outline, fill) {
    var s = CURSOR_SHAPES[shape];
    if (!s) return null;
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" shape-rendering="crispEdges">';
    s.rows.forEach(function (row, y) {
      var x = 0;
      while (x < 16) {
        var ch = row.charAt(x);
        if (ch === ".") {
          x++;
          continue;
        }
        var x2 = x;
        while (x2 < 16 && row.charAt(x2) === ch) x2++;
        var col = ch === "X" ? outline : fill;
        svg +=
          '<rect x="' +
          x +
          '" y="' +
          y +
          '" width="' +
          (x2 - x) +
          '" height="1" fill="' +
          col +
          '"/>';
        x = x2;
      }
    });
    svg += "</svg>";
    return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
  }
  function applyCursor() {
    var st = document.getElementById("cursorStyle");
    if (!st) {
      st = document.createElement("style");
      st.id = "cursorStyle";
      document.head.append(st);
    }
    document.documentElement.removeAttribute("data-cursor");
    var c = S.prefs.cursor || "blocky";
    if (c === "default") {
      st.textContent = "";
      return;
    }
    var shape = CURSOR_SHAPES[c];
    if (!shape) {
      st.textContent = "";
      return;
    }
    var cols = S.prefs.cursorColors || { outline: "#000000", fill: "#ffffff" };
    document.documentElement.setAttribute("data-cursor", "on");
    function u(name) {
      var sh = CURSOR_SHAPES[name];
      if (!sh) return null;
      return {
        url: buildCursorSvg(name, cols.outline, cols.fill),
        hot: sh.hot,
      };
    }
    function rule(sel, cur, fallback) {
      if (!cur) return "";
      return (
        'html[data-cursor="on"] ' +
        sel +
        "{cursor:" +
        cur.url +
        " " +
        cur.hot[0] +
        " " +
        cur.hot[1] +
        "," +
        fallback +
        " !important}"
      );
    }
    var base = u(c),
      hand = u("hand"),
      ibeam = u("ibeam"),
      cross = u("cross"),
      move = u("move"),
      ns = u("ns"),
      ew = u("ew"),
      nwse = u("nwse"),
      nesw = u("nesw"),
      no = u("no"),
      help = u("help");
    var css = "";
    css += rule("*", base, "auto");
    css += rule(
      ".btn,button,a,[role='button'],.mi,.games-tab,.tagbar span.tg,.res-terms span,.tritone-swatch,.theme-swatches button,.pt-sw i",
      hand,
      "pointer"
    );
    css += rule("input,textarea,[contenteditable='true']", ibeam, "text");
    css += rule(".pt-area canvas,.des-graph canvas", cross, "crosshair");
    css += rule(
      ".title,.sticky .sh,.grip,.ic-ics summary,summary",
      move,
      "move"
    );
    css += rule(
      ".cal-chips .chip[style*='grab'],.week-chip .rz,.week-chip",
      ns,
      "ns-resize"
    );
    css += rule(".grip", nwse, "nw-resize");
    css += rule(".btn:disabled,button:disabled,.mi.dis", no, "not-allowed");
    css += rule(
      "input:disabled,select:disabled,textarea:disabled",
      no,
      "not-allowed"
    );
    css += rule(".res-status,.clipy-tip", help, "help");
    st.textContent = css;
  }

  /* ================= CLIPY ================= */
  var WOTD_LIST = [
    ["serendipity", "noun", "finding something good without looking for it"],
    ["ephemeral", "adjective", "lasting for a very short time"],
    ["ubiquitous", "adjective", "present everywhere at once"],
    ["paradigm", "noun", "a typical example or pattern of something"],
    ["eloquent", "adjective", "fluent or persuasive in speaking or writing"],
    ["tenacious", "adjective", "holding firmly; persistent"],
    [
      "pragmatic",
      "adjective",
      "dealing with things sensibly and realistically",
    ],
    ["ambiguous", "adjective", "open to more than one interpretation"],
    ["resilient", "adjective", "able to recover quickly from difficulty"],
    ["candid", "adjective", "truthful and straightforward"],
    ["meticulous", "adjective", "showing great attention to detail"],
    ["verbose", "adjective", "using more words than needed"],
    ["succinct", "adjective", "briefly and clearly expressed"],
    ["aberration", "noun", "a departure from what is normal"],
    ["juxtapose", "verb", "place close together for contrast"],
    ["esoteric", "adjective", "understood by only a small group"],
    ["gregarious", "adjective", "fond of company; sociable"],
    ["lucid", "adjective", "expressed clearly; easy to understand"],
    ["obsolete", "adjective", "no longer in use; out of date"],
    ["vehement", "adjective", "showing strong feeling; forceful"],
    ["insidious", "adjective", "proceeding in a gradual, harmful way"],
    ["myriad", "noun", "a countless or extremely great number"],
    ["nuance", "noun", "a subtle difference in meaning or expression"],
    ["empirical", "adjective", "based on observation rather than theory"],
    ["rhetoric", "noun", "the art of persuasive speaking or writing"],
    ["arbitrary", "adjective", "based on random choice rather than reason"],
    ["cogent", "adjective", "clear, logical and convincing"],
    ["dichotomy", "noun", "a contrast between two things"],
    ["extol", "verb", "praise enthusiastically"],
    ["flippant", "adjective", "not showing a serious attitude"],
    ["hegemony", "noun", "leadership or dominance by one group"],
    ["impetus", "noun", "the force that makes something happen"],
    [
      "languish",
      "verb",
      "lose vitality; be forced to remain in an unpleasant situation",
    ],
    ["mitigate", "verb", "make less severe or serious"],
    ["nefarious", "adjective", "wicked or criminal"],
    ["opulent", "adjective", "ostentatiously rich and luxurious"],
    ["penchant", "noun", "a strong liking for something"],
    ["quell", "verb", "put an end to; suppress"],
    ["reverence", "noun", "deep respect"],
    ["sanctimonious", "adjective", "making a show of being morally superior"],
    ["taciturn", "adjective", "saying little; reserved"],
    ["ubiquity", "noun", "the state of being everywhere at once"],
    ["venerate", "verb", "regard with great respect"],
    ["wary", "adjective", "feeling caution about possible dangers"],
    ["zealous", "adjective", "showing great energy for a cause"],
    ["acquiesce", "verb", "accept something reluctantly but without protest"],
    ["belligerent", "adjective", "aggressive; ready to fight"],
    ["circumvent", "verb", "find a way around an obstacle"],
    ["deleterious", "adjective", "causing harm or damage"],
    ["enigmatic", "adjective", "difficult to interpret; mysterious"],
  ];
  var FUN_FACTS = [
    "The human brain uses about 20% of your body's total energy \u2014 even at rest.",
    "Honey never spoils. Archaeologists have found 3,000-year-old honey in Egyptian tombs that's still edible.",
    "Octopuses have three hearts and blue blood.",
    "A day on Venus is longer than its year.",
    "The Eiffel Tower can be 15 cm taller in summer because the iron expands.",
    "Bananas are berries; strawberries are not.",
    "There are more possible games of chess than atoms in the observable universe.",
    "The first computer bug was a real moth, taped into the Harvard Mark II logbook in 1947.",
    "Your stomach lining replaces itself every few days, or it would digest itself.",
    "The word 'algebra' comes from the Arabic 'al-jabr', meaning 'reunion of broken parts'.",
    "Sharks existed before trees. They've been around ~450 million years; trees ~350 million.",
    "Sound travels about 4 times faster in water than in air.",
    "The 'QWERTY' keyboard layout was designed in the 1870s to slow typists down so typewriter arms wouldn't jam.",
    "A single lightning bolt can heat the air around it to 30,000\u00b0C \u2014 five times hotter than the sun's surface.",
    "The shortest war in history was between Britain and Zanzibar in 1896 \u2014 it lasted 38 minutes.",
    "Cows have best friends and get stressed when separated.",
    "The Great Wall of China is not visible from space with the naked eye, despite the myth.",
    "There's enough gold in the Earth's core to coat the entire surface in a 1.5-foot layer.",
    "Butterflies taste with their feet.",
    "Pi has been calculated to over 100 trillion digits. You only need 39 for a universe-sized circle.",
    "The average person walks the equivalent of 5 times around the world in a lifetime.",
    "Hot water can freeze faster than cold water under certain conditions \u2014 the Mpemba effect.",
    "The word 'set' has the most definitions of any English word \u2014 over 430.",
    "A group of flamingos is called a 'flamboyance'.",
    "The inventor of the Pringles can is buried in one.",
    "The first email was sent in 1971 by Ray Tomlinson, who also chose the @ symbol.",
    "Your body contains about 37 trillion cells.",
    "There is a species of jellyfish that is biologically immortal.",
    "The Empire State Building has its own zip code.",
    "Sunsets on Mars are blue.",
    "The average cloud weighs about 1.1 million pounds.",
    "Starfish don't have brains.",
    "The dot over the letter 'i' is called a tittle.",
    "Pineapples take about two years to grow.",
    "Antarctica is the world's largest desert.",
    "Cats can't taste sweetness.",
    "A teaspoon of neutron star material would weigh about 6 billion tons.",
    "The Statue of Liberty was originally intended for Egypt.",
    "Sloths can hold their breath longer than dolphins.",
    "Wombat poop is cube-shaped.",
  ];
  var factQueue = [];
  function nextFact() {
    if (!factQueue.length) {
      factQueue = FUN_FACTS.slice();
      for (var i = factQueue.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = factQueue[i];
        factQueue[i] = factQueue[j];
        factQueue[j] = t;
      }
    }
    return factQueue.pop();
  }
  function wotdFor(d) {
    var day = Math.floor(d.getTime() / 86400000);
    return WOTD_LIST[
      ((day % WOTD_LIST.length) + WOTD_LIST.length) % WOTD_LIST.length
    ];
  }
  function tipFor(d) {
    var day = Math.floor(d.getTime() / 86400000);
    return TIPS[(((day * 11 + 5) % TIPS.length) + TIPS.length) % TIPS.length];
  }
  function clipyContext() {
    var now = new Date(),
      td = ymd(now),
      L = [];
    L.push(
      "Date: " +
        DAYS[now.getDay()] +
        ", " +
        MONTHS[now.getMonth()] +
        " " +
        now.getDate() +
        ", " +
        now.getFullYear()
    );
    var sched = classesOn(td).map(function (c) {
      return c.start + "-" + c.end + " " + c.name;
    });
    if (sched.length) L.push("Classes today: " + sched.join(" | "));
    var openTasks = S.tasks.filter(function (t) {
      return !t.done;
    });
    if (openTasks.length)
      L.push(
        "Open tasks (" +
          openTasks.length +
          "): " +
          openTasks
            .slice(0, 8)
            .map(function (t) {
              return (
                t.text +
                (t.due != null ? " (due " + ymd(new Date(t.due)) + ")" : "")
              );
            })
            .join(" | ")
      );
    var openA = S.assign
      .filter(function (a) {
        return !a.done;
      })
      .sort(function (a, b) {
        return a.due - b.due;
      })
      .slice(0, 6);
    if (openA.length)
      L.push(
        "Upcoming assignments: " +
          openA
            .map(function (a) {
              return (
                a.title +
                (a.course ? " [" + a.course + "]" : "") +
                " due " +
                ymd(new Date(a.due))
              );
            })
            .join(" | ")
      );
    var week = 0;
    for (var i = 0; i < 7; i++) {
      var k = ymd(new Date(Date.now() - i * 86400000));
      if (S.stats[k]) week += S.stats[k].minutes || 0;
    }
    L.push(
      "Focus last 7 days: " +
        week +
        " min (weekly goal " +
        (S.prefs.goal || 300) +
        " min)"
    );
    L.push("Day streak: " + streak());
    if (S.habits.length)
      L.push(
        "Habits: " +
          S.habits
            .map(function (h) {
              return h.name + (h.log[td] ? " (done today)" : "");
            })
            .join(", ")
      );
    var cds = S.countdowns
      .map(function (c) {
        return {
          n: c.name,
          d: Math.round(
            (new Date(c.date + "T00:00") - new Date(td + "T00:00")) / 86400000
          ),
        };
      })
      .filter(function (x) {
        return x.d >= 0;
      })
      .sort(function (a, b) {
        return a.d - b.d;
      })
      .slice(0, 4);
    if (cds.length)
      L.push(
        "Countdowns: " +
          cds
            .map(function (x) {
              return x.n + " in " + x.d + " day(s)";
            })
            .join(", ")
      );
    var over = S.reminders.filter(function (r) {
      return !r.done && ymd(new Date(r.at)) === td;
    });
    if (over.length)
      L.push(
        "Reminders today: " +
          over
            .map(function (r) {
              return fmt12(new Date(r.at)) + " " + r.text;
            })
            .join(" | ")
      );
    if (S.cards.length) {
      var due = S.cards.filter(function (c) {
        return !c.dueAt || c.dueAt <= Date.now();
      }).length;
      L.push("Flash cards: " + due + " due out of " + S.cards.length);
    }
    if (S.folders.length)
      L.push(
        "Folders: " +
          S.folders
            .map(function (f) {
              return f.name + " (" + (f.assign.length + f.note.length) + ")";
            })
            .join(", ")
      );
    return L.join("\n");
  }
  function clipyAssistant() {
    var m = S.prefs.ai;
    if (m === "off") return "off";
    if (PROVIDERS[m]) return m;
    if (capSample) return "helpy";
    if (getKey("openrouter")) return "lolbit";
    if (getKey("openai")) return "handunit";
    if (getKey("deepseek")) return "carnie";
    if (getKey("gemini")) return "mystic";
    if (S.prefs.localUrl || aiModel("ollama")) return "ollama";
    return "off";
  }
  var clipy = {
    node: null,
    bubble: null,
    panel: null,
    open: false,
    tipTimer: null,
    bubbleT: null,
  };
  function hideClipyBubble() {
    if (clipy.bubble) clipy.bubble.hidden = true;
    if (clipy.bubbleT) {
      clearTimeout(clipy.bubbleT);
      clipy.bubbleT = null;
    }
  }
  function randomTip() {
    var list =
      typeof TIPS !== "undefined" && TIPS && TIPS.length
        ? TIPS
        : ["Stay curious \u2014 there's a tip for that."];
    return list[Math.floor(Math.random() * list.length)];
  }
  function randomFact() {
    try {
      var f = nextFact();
      if (f) return f;
    } catch (e) {}
    return "Octopuses have three hearts and blue blood.";
  }
  function tipMsg(kind) {
    if (kind === "fact") {
      return {
        text: "Fun fact: " + randomFact(),
        label: "Another fact",
        act: function () {
          showClipyTip("fact");
        },
      };
    }
    if (kind === "tip") {
      return {
        text: "Tip: " + randomTip(),
        label: "Another tip",
        act: function () {
          showClipyTip("tip");
        },
      };
    }
    return Math.random() < 0.5 ? tipMsg("fact") : tipMsg("tip");
  }
  function suggestClipyTip(kind) {
    if (kind === "fact") return tipMsg("fact");
    if (kind === "tip") return tipMsg("tip");
    if (kind === "either") return tipMsg("either");
    var now = Date.now();
    if (Math.random() < 0.45) return tipMsg("either");
    var over = S.assign.filter(function (a) {
      return !a.done && a.due < now;
    });
    if (over.length)
      return {
        text:
          over.length +
          " assignment" +
          (over.length > 1 ? "s are" : " is") +
          " overdue.",
        label: "Open",
        act: function () {
          openApp("canvas");
        },
      };
    var soon = S.assign
      .filter(function (a) {
        return !a.done && a.due >= now && a.due - now < 86400000;
      })
      .sort(function (a, b) {
        return a.due - b.due;
      });
    if (soon.length)
      return {
        text: soon[0].title + " is due " + rel(soon[0].due) + ".",
        label: "Open",
        act: function () {
          openApp("canvas");
        },
      };
    var hh = new Date().getHours(),
      todayMin = (S.stats[ymd(new Date())] || {}).minutes || 0;
    if (todayMin === 0 && hh >= 9 && hh <= 21)
      return {
        text: "You haven't focused yet today. Start a 25-minute session?",
        label: "Start",
        act: function () {
          openApp("timer");
        },
      };
    var openTasks = S.tasks.filter(function (t) {
      return !t.done;
    });
    if (openTasks.length >= 6)
      return {
        text: "You have " + openTasks.length + " open tasks. Knock one out?",
        label: "Tasks",
        act: function () {
          openApp("tasks");
        },
      };
    var due = S.cards.filter(function (c) {
      return !c.dueAt || c.dueAt <= Date.now();
    }).length;
    if (due >= 10)
      return {
        text: due + " flash cards are due. Review a few?",
        label: "Cards",
        act: function () {
          openApp("games");
        },
      };
    return tipMsg("either");
  }
  function showClipyTip(kind) {
    if (!clipy.node || clipy.open) return;
    if (!S.prefs.showClipy) return;
    var forced = kind === true || typeof kind === "string";
    if (S.prefs.clipyTips === false && !forced) return;
    var t = suggestClipyTip(typeof kind === "string" ? kind : undefined);
    clipy.bubble.textContent = "";
    clipy.bubble.append(
      el("div", null, t.text),
      el(
        "div",
        { class: "clipy-tip-actions" },
        el(
          "button",
          {
            onclick: function (e) {
              e.stopPropagation();
              hideClipyBubble();
              t.act();
            },
          },
          t.label
        ),
        el(
          "button",
          {
            onclick: function (e) {
              e.stopPropagation();
              hideClipyBubble();
            },
          },
          "Later"
        )
      )
    );
    clipy.bubble.hidden = false;
    if (clipy.bubbleT) clearTimeout(clipy.bubbleT);
    clipy.bubbleT = setTimeout(hideClipyBubble, 14000);
  }
  function scheduleClipyTips() {
    if (clipy.tipTimer) clearInterval(clipy.tipTimer);
    if (S.prefs.clipyTips === false) return;
    var mins = S.prefs.clipyTipMin || 20;
    clipy.tipTimer = setInterval(function () {
      if (!S.prefs.showClipy) return;
      if (clipy.open) return;
      if (Date.now() - lastInput < 60000) return;
      showClipyTip();
    }, mins * 60000);
  }
  function unmountClipy() {
    if (clipy.panel) {
      clipy.panel.remove();
      clipy.panel = null;
      clipy.open = false;
    }
    if (clipy.node) {
      clipy.node.remove();
      clipy.node = null;
      clipy.bubble = null;
    }
    if (clipy.tipTimer) {
      clearInterval(clipy.tipTimer);
      clipy.tipTimer = null;
    }
    if (clipy.bubbleT) {
      clearTimeout(clipy.bubbleT);
      clipy.bubbleT = null;
    }
  }
  function mountClipy() {
    unmountClipy();
    if (!S.prefs.showClipy) return;
    var node = el(
      "div",
      {
        class: "clipy-float",
        id: "clipyFloat",
        title: "Clipy \u2014 click for help",
        role: "button",
        tabindex: "0",
      },
      pix("clippy", 56)
    );
    var bubble = el("div", {
      class: "clipy-tip",
      hidden: true,
      role: "status",
    });
    node.append(bubble);
    node.addEventListener("click", function (e) {
      if (e.target.closest(".clipy-tip")) return;
      openClipyPanel();
    });
    node.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openClipyPanel();
      }
    });
    node.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      e.stopPropagation();
      popMenu(e.clientX, e.clientY, [
        { label: "Open chat", ic: "helpy", fn: openClipyPanel },
        {
          label: "Show a study tip",
          ic: "bulb",
          fn: function () {
            showClipyTip("tip");
          },
        },
        {
          label: "Show a fun fact",
          ic: "bulb",
          fn: function () {
            showClipyTip("fact");
          },
        },
        {
          label: "Surprise me",
          ic: "dice",
          fn: function () {
            showClipyTip("either");
          },
        },
        { sep: 1 },
        {
          label: "Sticky Word of the Day",
          check: S.prefs.wotdMode === "sticky",
          fn: function () {
            S.prefs.wotdMode =
              S.prefs.wotdMode === "sticky" ? "daily" : "sticky";
            save();
            msgBox({
              title: "Word of the Day",
              icon: "info",
              text:
                S.prefs.wotdMode === "sticky"
                  ? "Sticky mode is on. Your current word stays put until you click \u201cNew word.\u201d"
                  : "Daily mode is on. A fresh word is chosen once per calendar day.",
            });
          },
        },
        {
          label: "Tips",
          check: S.prefs.clipyTips !== false,
          fn: function () {
            S.prefs.clipyTips = S.prefs.clipyTips === false ? true : false;
            save();
            scheduleClipyTips();
          },
        },
        {
          label: "Hide Clipy",
          ic: "bin",
          fn: function () {
            S.prefs.showClipy = false;
            save();
            unmountClipy();
          },
        },
        { sep: 1 },
        {
          label: "Clipy options\u2026",
          ic: "control",
          fn: function () {
            openApp("control");
          },
        },
      ]);
    });
    desk.append(node);
    clipy.node = node;
    clipy.bubble = bubble;
    scheduleClipyTips();
    if (S.prefs.clipyTips !== false)
      setTimeout(function () {
        if (!clipy.open) showClipyTip();
      }, 5000);
  }
  function closeClipyPanel() {
    if (clipy.panel) {
      clipy.panel.remove();
      clipy.panel = null;
    }
    clipy.open = false;
    clipyController = null;
    document.removeEventListener("keydown", clipyPanelEsc, true);
  }
  function clipyPanelEsc(e) {
    if (e.key === "Escape") closeClipyPanel();
  }
  var clipyController = null;
  var pendingClipySeed = null;
  function clipTextForPrompt(t) {
    t = String(t || "");
    if (t.length <= 4000) return t;
    return t.slice(0, 4000) + "\n\u2026[trimmed for length]";
  }
  function continueWithClipy(topic, text) {
    var seed = {
      topic: String(topic || "").trim(),
      text: String(text || "").trim(),
      at: Date.now(),
    };
    if (!seed.topic && !seed.text) return;
    if (!S.prefs.showClipy) {
      S.prefs.showClipy = true;
      save();
      mountClipy();
    }
    if (
      clipy.open &&
      clipyController &&
      typeof clipyController.seed === "function"
    ) {
      clipyController.seed(seed);
    } else {
      pendingClipySeed = seed;
      if (!clipy.open) openClipyPanel();
    }
  }
  function openClipyPanel() {
    if (clipy.open) return;
    hideClipyBubble();
    var dr = desk.getBoundingClientRect();
    var pw = Math.min(400, dr.width - 20),
      ph = Math.min(560, dr.height - 100);
    var left = Math.max(10, dr.width - pw - 18),
      top = Math.max(10, dr.height - ph - 88);
    var panel = el("div", {
      class: "clipy-panel",
      id: "clipyPanel",
      style:
        "left:" +
        left +
        "px;top:" +
        top +
        "px;width:" +
        pw +
        "px;height:" +
        ph +
        "px",
    });
    var titleBar = el(
      "div",
      { class: "title" },
      el("span", { class: "ti" }, pix("clippy", 16)),
      el("span", { class: "tt" }, "Clipy"),
      el(
        "span",
        { class: "tb" },
        el(
          "button",
          { class: "bx", "aria-label": "Close", onclick: closeClipyPanel },
          "\u00d7"
        )
      )
    );
    var body = el("div", {
      class: "wbody",
      style: "flex:1;min-height:0;margin-top:2px;overflow:hidden",
    });
    panel.append(titleBar, body);
    desk.append(panel);
    clipy.panel = panel;
    clipy.open = true;
    drag(titleBar, panel);
    buildClipyContent(body);
    document.addEventListener("keydown", clipyPanelEsc, true);
    setTimeout(function () {
      var ta = panel.querySelector("textarea");
      if (ta) ta.focus();
    }, 0);
  }
  function buildClipyContent(body, opts) {
    opts = opts || {};
    if (!S.clipy || !Array.isArray(S.clipy.msgs))
      S.clipy = { msgs: [], wotd: null, wotdHistory: [] };
    if (!S.clipy.wotdHistory) S.clipy.wotdHistory = [];
    var busy = false;
    var todayK = ymd(new Date());
    var stickyMode = S.prefs.wotdMode === "sticky";
    var curWotd = null;
    if (S.clipy.wotd && S.clipy.wotd.word) {
      if (stickyMode) curWotd = S.clipy.wotd;
      else if (S.clipy.wotd.date === todayK) curWotd = S.clipy.wotd;
    }
    var wotdBusy = false;
    var who = el("div", { class: "clipy-top" });
    var msgs = el("div", { class: "clipy-msgs" });
    var typing = null;
    var inp = el("textarea", {
      class: "in",
      placeholder:
        "Ask Clipy anything\u2026 (Enter to send, Shift+Enter for a new line)",
      onkeydown: function (e) {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          send(this.value);
        }
      },
    });
    var sendBtn = el(
      "button",
      {
        class: "btn",
        onclick: function () {
          send(inp.value);
        },
      },
      "Send"
    );
    var inpRow = el("div", { class: "clipy-in" }, inp, sendBtn);
    var sugs = el("div", { class: "clipy-sugs" });
    function staticWotd() {
      var wd = wotdFor(new Date());
      return {
        date: todayK,
        word: wd[0],
        pos: wd[1],
        def: wd[2],
        example: "",
        why: "",
        from: "list",
      };
    }
    function refreshWotd(force) {
      if (wotdBusy) return;
      var m = clipyAssistant();
      if (m === "off") {
        if (!curWotd) {
          curWotd = staticWotd();
          S.clipy.wotd = curWotd;
          save();
          paintMsgs();
        }
        return;
      }
      wotdBusy = true;
      paintMsgs();
      var recent = S.clipy.wotdHistory.slice(-25).join(", ");
      var avoid = recent
        ? "\n\nDo NOT pick any of these words \u2014 they've been used recently: " +
          recent
        : "";
      var prompt =
        "Pick one interesting English vocabulary word for a college student. " +
        "Not too basic, not archaic \u2014 something they could actually use in essays, exams or conversation. " +
        "Vary the part of speech across days (noun, verb, adjective, adverb)." +
        avoid +
        "\n\nReply with ONLY a JSON object, no commentary:\n" +
        '{"word":"serendipity","pos":"noun","definition":"one short sentence under 22 words","example":"one natural example sentence using the word","why":"one short sentence about why it is worth knowing"}';
      aiChat(m, prompt, { json: true, maxTokens: 500 })
        .then(function (j) {
          wotdBusy = false;
          if (!isObj(j) || !isStr(j.word) || !isStr(j.definition))
            throw { code: "invalid_json" };
          var wd2 = (j.word || "").toLowerCase().replace(/[^a-z\-']/g, "");
          if (!wd2 || wd2.length > 30) throw { code: "invalid_json" };
          var newWotd = {
            date: todayK,
            word: wd2,
            pos: isStr(j.pos) ? clip(j.pos.toLowerCase(), 20) : "",
            def: clip(j.definition, 300),
            example: isStr(j.example) ? clip(j.example, 300) : "",
            why: isStr(j.why) ? clip(j.why, 200) : "",
            from: "ai",
          };
          curWotd = newWotd;
          S.clipy.wotd = newWotd;
          if (S.clipy.wotdHistory.indexOf(wd2) < 0) {
            S.clipy.wotdHistory.push(wd2);
            if (S.clipy.wotdHistory.length > 60) S.clipy.wotdHistory.shift();
          }
          save();
          paintMsgs();
        })
        .catch(function () {
          wotdBusy = false;
          if (!curWotd) {
            curWotd = staticWotd();
            S.clipy.wotd = curWotd;
            save();
          }
          paintMsgs();
        });
    }
    function paintWho() {
      who.textContent = "";
      var m = clipyAssistant();
      var p =
        m === "off" ? { name: "No assistant", icon: "info" } : PROVIDERS[m];
      who.append(
        opts.popout ? pix("clippy", 28) : pix(p.icon, 28),
        el(
          "div",
          { class: "who" },
          el("b", null, "Clipy"),
          el(
            "small",
            null,
            m === "off"
              ? "pick an assistant in Control Panel \u2192 Assistant"
              : "powered by " + p.name,
            m !== "off" && !assistantState(m).ok
              ? el("span", { class: "clipy-offline" }, " \u2022 " + assistantState(m).why)
              : null
          )
        ),
        el(
          "button",
          {
            class: "btn sm",
            onclick: function () {
              msgBox({
                title: "New Chat",
                icon: "q",
                text: "Clear this conversation?",
                buttons: [
                  {
                    label: "Yes",
                    fn: function () {
                      S.clipy.msgs = [];
                      save();
                      paintMsgs();
                    },
                  },
                  { label: "No" },
                ],
              });
            },
          },
          "New chat"
        )
      );
    }
    function pushMsg(role, text) {
      var m = { role: role, text: text, at: Date.now() };
      S.clipy.msgs.push(m);
      if (S.clipy.msgs.length > 200)
        S.clipy.msgs.splice(0, S.clipy.msgs.length - 200);
      save();
      paintMsgs();
      return m;
    }
    function bubble(m) {
      if (m.role === "user") return el("div", { class: "cm user" }, m.text);
      if (m.role === "sys") return el("div", { class: "cm sys" }, m.text);
      if (m.role === "plan") {
        var card = el(
          "div",
          { class: "cm assistant" },
          el("span", { class: "who2" }, "Clipy \u2014 proposed study blocks"),
          el(
            "div",
            { style: "margin-top:6px;max-height:220px;overflow:auto" },
            m.plan.map(function (x) {
              var d = new Date(x.date + "T00:00");
              return el(
                "div",
                { style: "display:flex;gap:6px;padding:2px 0;font-size:12px" },
                el(
                  "span",
                  { style: "width:72px;flex:none;color:#606060" },
                  DAYS[d.getDay()] +
                    " " +
                    (d.getMonth() + 1) +
                    "/" +
                    d.getDate()
                ),
                el("span", { style: "width:46px;flex:none" }, x.time),
                el(
                  "span",
                  { style: "flex:1;min-width:0;overflow-wrap:anywhere" },
                  x.title
                ),
                el("span", { style: "flex:none;color:#606060" }, x.min + "m")
              );
            })
          )
        );
        var addBtn = el(
          "button",
          {
            class: "btn sm",
            onclick: function () {
              m.plan.forEach(function (x) {
                S.events.push({
                  id: uid(),
                  title: "Study: " + x.title + " (" + x.min + "m)",
                  date: x.date,
                  time: x.time,
                  kind: "study",
                  repeat: "none",
                });
              });
              save();
              refreshAll();
              addBtn.disabled = true;
              addBtn.textContent = "Added \u2713";
              pushMsg(
                "sys",
                m.plan.length + " study block(s) added to your Calendar."
              );
            },
          },
          "Add all to Calendar"
        );
        card.append(
          el("div", { style: "margin-top:8px;display:flex;gap:6px" }, addBtn)
        );
        return card;
      }
      return el(
        "div",
        { class: "cm assistant" },
        el("span", { class: "who2" }, "Clipy"),
        m.text
      );
    }
    function wotdCard() {
      var w = curWotd;
      var card = el("div", { class: "wotd" });
      if (!w) {
        card.append(
          el(
            "div",
            { class: "wotd-head" },
            el("h4", null, "Word of the day"),
            wotdBusy ? el("span", { class: "ai-tag" }, "GENERATING") : null
          ),
          el(
            "div",
            { class: "wotd-busy" },
            wotdBusy
              ? "Picking a word for today\u2026"
              : "Not available right now."
          )
        );
        return card;
      }
      card.append(
        el(
          "div",
          { class: "wotd-head" },
          el("h4", null, w.word),
          w.pos ? el("span", { class: "pos" }, w.pos) : null,
          w.from === "ai" ? el("span", { class: "ai-tag" }, "AI") : null,
          wotdBusy
            ? el(
                "span",
                { class: "ai-tag", style: "background:#606060" },
                "UPDATING"
              )
            : null
        ),
        el("div", null, w.def),
        w.example
          ? el("div", { class: "ex" }, "\u201C" + w.example + "\u201D")
          : null,
        w.why ? el("div", { class: "why" }, "Why it's useful: " + w.why) : null,
        el(
          "div",
          { class: "wotd-actions" },
          el(
            "button",
            {
              class: "btn xs",
              disabled: wotdBusy || clipyAssistant() === "off",
              title:
                clipyAssistant() === "off"
                  ? "Pick an assistant in Control Panel"
                  : "Ask for a different word",
              onclick: function () {
                refreshWotd(true);
              },
            },
            "New word"
          ),
          w.from === "ai"
            ? el(
                "button",
                {
                  class: "btn xs",
                  onclick: function () {
                    openUrl(
                      "https://www.merriam-webster.com/dictionary/" +
                        encodeURIComponent(w.word)
                    );
                  },
                },
                "Look up"
              )
            : null
        )
      );
      // node.append(null) writes the text "null"; drop those strays (empty example / reason lines)
      Array.prototype.slice.call(card.childNodes).forEach(function (n) {
        if (n.nodeType === 3 && n.data === "null") n.remove();
      });
      return card;
    }
    function paintMsgs() {
      msgs.textContent = "";
      msgs.append(wotdCard());
      /* always the first message, even in a fresh chat; it isn't part of the saved conversation */
      msgs.append(
        el(
          "div",
          { class: "cm assistant greet" },
          el("span", { class: "who2" }, "Clipy"),
          "Hey, I'm Clipy. Ask me anything about your schedule, what's due, or just say hi."
        )
      );
      S.clipy.msgs.slice(-60).forEach(function (m) {
        msgs.append(bubble(m));
      });
      if (typing) msgs.append(typing);
      msgs.scrollTop = msgs.scrollHeight;
    }
    function send(text, contextPrefix) {
      var v = String(text || "").trim();
      if (!v || busy) return;
      inp.value = "";
      pushMsg("user", v);
      var m = clipyAssistant();
      if (m === "off") {
        pushMsg(
          "sys",
          "Pick an assistant in Control Panel \u2192 Assistant, then try again."
        );
        return;
      }
      if (navigator.onLine === false && m !== "ollama") {
        pushMsg("sys", "You're offline, so " + PROVIDERS[m].name + " can't be reached. Fun facts, tips and the word of the day still work. Try again when you're back online.");
        return;
      }
      busy = true;
      sendBtn.disabled = true;
      typing = el(
        "div",
        { class: "cm assistant typing" },
        el("span", { class: "who2" }, "Clipy"),
        "typing\u2026"
      );
      paintMsgs();
      var hist = S.clipy.msgs
        .slice(-10, -1)
        .map(function (mm) {
          return (mm.role === "user" ? "User: " : "Clipy: ") + mm.text;
        })
        .join("\n");
      var prompt =
        "You are Clipy, a warm, concise study companion built into FocusDesk 96. " +
        "Answer in plain text (no markdown headers, no asterisks). Be practical and specific. " +
        "If you don't know something about the user, say so instead of guessing.\n\n" +
        "What you know about the user right now:\n" +
        clipyContext() +
        (contextPrefix
          ? "\n\nEarlier, in the Research window:\n---\n" +
            clipTextForPrompt(contextPrefix) +
            "\n---"
          : "") +
        "\n\n" +
        (hist ? "Conversation so far:\n" + hist + "\n\n" : "") +
        "User: " +
        v +
        "\n\nClipy:";
      aiChat(m, prompt, { maxTokens: 1500 }).then(
        function (r) {
          typing = null;
          busy = false;
          sendBtn.disabled = false;
          var t = ((r && r.text) || "").trim() || "(no reply)";
          pushMsg("assistant", t);
        },
        function (e) {
          typing = null;
          busy = false;
          sendBtn.disabled = false;
          pushMsg("sys", copyFor(e));
        }
      );
    }
    clipyController = {
      ask: function (t) {
        send(t);
      },
      seed: function (s) {
        if (!s || (!s.topic && !s.text)) return;
        var greeting = s.topic
          ? 'Let\u2019s keep going on "' + clipTextForPrompt(s.topic) + '".'
          : "Let\u2019s keep going on what we were researching.";
        var context =
          (s.topic ? "Topic: " + s.topic + "\n\n" : "") +
          (s.text ? "What I already have:\n" + s.text : "");
        send(greeting, context);
      },
    };
    if (pendingClipySeed) {
      var s0 = pendingClipySeed;
      pendingClipySeed = null;
      clipyController.seed(s0);
    }
    function localReply(kind) {
      if (kind === "fact") pushMsg("assistant", "Fun fact: " + nextFact());
      else if (kind === "tip")
        pushMsg("assistant", "Tip: " + tipFor(new Date()));
    }
    function clipyPlanWeek() {
      askText(
        "Plan my week",
        "How many hours can you study per day? (0.5\u201312)",
        "2",
        function (v) {
          var h = Math.max(0.5, Math.min(12, parseFloat(v) || 2));
          doClipyPlan(h);
        }
      );
    }
    function doClipyPlan(hours) {
      var now = Date.now();
      var open = S.assign
        .filter(function (a) {
          return !a.done && a.due > now - 86400000;
        })
        .sort(function (a, b) {
          return a.due - b.due;
        })
        .slice(0, 30);
      if (!open.length) {
        pushMsg(
          "sys",
          "No open assignments yet. Add some in Calendar Link and try again."
        );
        return;
      }
      var m = clipyAssistant();
      if (m === "off") {
        pushMsg(
          "sys",
          "Pick an assistant in Control Panel \u2192 Assistant, then try again."
        );
        return;
      }
      pushMsg(
        "user",
        "Plan my week \u2014 I can study about " +
          hours +
          " hour" +
          (hours === 1 ? "" : "s") +
          " a day."
      );
      var list = open
        .map(function (a) {
          return (
            "- " +
            a.title +
            (a.course ? " [" + a.course + "]" : "") +
            ", due " +
            ymd(new Date(a.due)) +
            " " +
            hm(new Date(a.due))
          );
        })
        .join("\n");
      var prompt =
        "Today is " +
        ymd(new Date()) +
        ". I can study about " +
        hours +
        " hours per day. My open assignments:\n" +
        list +
        '\n\nBuild a realistic study schedule covering at most the next 14 days. Reply with only a JSON array of objects like {"date":"2026-10-12","time":"16:00","minutes":50,"title":"Draft essay outline"}. Use 24-hour times between 08:00 and 22:00, minutes between 20 and 120, titles under 60 characters.';
      busy = true;
      sendBtn.disabled = true;
      typing = el(
        "div",
        { class: "cm assistant typing" },
        el("span", { class: "who2" }, "Clipy"),
        "planning your week\u2026"
      );
      paintMsgs();
      aiChat(m, prompt, { json: true, maxTokens: 2000 }).then(
        function (arr) {
          typing = null;
          busy = false;
          sendBtn.disabled = false;
          showClipyPlan(arr);
        },
        function (e) {
          typing = null;
          busy = false;
          sendBtn.disabled = false;
          pushMsg("sys", copyFor(e));
        }
      );
    }
    function showClipyPlan(arr) {
      var today = ymd(new Date()),
        max = ymd(new Date(Date.now() + 30 * 86400000));
      var rows = (Array.isArray(arr) ? arr : [])
        .filter(function (x) {
          return (
            isObj(x) &&
            isStr(x.title) &&
            x.title.trim() &&
            isStr(x.date) &&
            /^\d{4}-\d{2}-\d{2}$/.test(x.date) &&
            x.date >= today &&
            x.date <= max
          );
        })
        .map(function (x) {
          return {
            date: x.date,
            time:
              isStr(x.time) && /^\d{2}:\d{2}$/.test(x.time) ? x.time : "16:00",
            min: isNum(x.minutes)
              ? Math.max(10, Math.min(240, Math.round(x.minutes)))
              : 45,
            title: clip(x.title.trim(), 80),
          };
        })
        .sort(function (a, b) {
          return a.date < b.date
            ? -1
            : a.date > b.date
            ? 1
            : a.time < b.time
            ? -1
            : a.time > b.time
            ? 1
            : 0;
        })
        .slice(0, 40);
      if (!rows.length) {
        pushMsg("sys", "No usable plan came back. Try again.");
        return;
      }
      S.clipy.msgs.push({ role: "plan", text: "", at: Date.now(), plan: rows });
      if (S.clipy.msgs.length > 200)
        S.clipy.msgs.splice(0, S.clipy.msgs.length - 200);
      save();
      paintMsgs();
    }
    sugs.append(
      el(
        "button",
        {
          onclick: function () {
            var w = curWotd;
            if (!w) {
              if (wotdBusy) {
                pushMsg("sys", "Picking a word\u2026");
                return;
              }
              refreshWotd(false);
              return;
            }
            pushMsg(
              "assistant",
              w.word +
                " (" +
                (w.pos || "word") +
                ")\n" +
                w.def +
                (w.example ? "\n\nExample: " + w.example : "") +
                (w.why ? "\n\nWhy it's useful: " + w.why : "")
            );
          },
        },
        "Word of the day"
      ),
      el(
        "button",
        {
          onclick: function () {
            localReply("fact");
          },
        },
        "Fun fact"
      ),
      el(
        "button",
        {
          onclick: function () {
            localReply("tip");
          },
        },
        "Tip"
      ),
      el(
        "button",
        {
          onclick: function () {
            send("What's due in the next few days?");
          },
        },
        "What's due?"
      ),
      el(
        "button",
        {
          onclick: function () {
            send("How did my focus go this week?");
          },
        },
        "How's my week?"
      ),
      el(
        "button",
        {
          onclick: function () {
            send("Quiz me on my notes.");
          },
        },
        "Quiz me"
      ),
      el(
        "button",
        {
          onclick: function () {
            send("I have 30 minutes. What should I do first?");
          },
        },
        "30-min plan"
      ),
      el(
        "button",
        {
          onclick: function () {
            clipyPlanWeek();
          },
        },
        "Plan my week"
      )
    );
    body.append(
      el(
        "div",
        { class: "clipy-wrap", style: "flex:1;min-height:0" },
        who,
        msgs,
        sugs,
        inpRow
      )
    );
    paintWho();
    paintMsgs();
    /* keep the "offline" marker honest when the connection comes and goes */
    aiNetListeners[opts.popout ? "clipyPop" : "clipy"] = function () {
      paintWho();
      inp.placeholder =
        clipyAssistant() !== "off" && !assistantState(clipyAssistant()).ok
          ? "Clipy's assistant is unavailable right now (" + assistantState(clipyAssistant()).why + ")"
          : "Ask Clipy anything\u2026 (Enter to send, Shift+Enter for a new line)";
    };
    aiNetListeners[opts.popout ? "clipyPop" : "clipy"]();
    if (!curWotd) refreshWotd(false);
  }

  /* ================= RUN DIALOG ================= */
  var RUNMAP = {
    calc: "calc",
    calculator: "calc",
    notepad: "notepad",
    note: "notepad",
    notes: "notepad",
    cal: "calendar",
    calendar: "calendar",
    todo: "tasks",
    tasks: "tasks",
    remind: "reminders",
    reminders: "reminders",
    timer: "timer",
    focus: "timer",
    pomodoro: "timer",
    canvas: "canvas",
    ics: "canvas",
    calendarimport: "canvas",
    cards: "cards",
    flash: "cards",
    research: "research",
    search: "research",
    grades: "grades",
    gpa: "grades",
    control: "control",
    settings: "control",
    today: "today",
    paint: "paint",
    mspaint: "paint",
    sketch: "paint",
    schedule: "schedule",
    classes: "schedule",
    timetable: "schedule",
    stats: "stats",
    log: "stats",
    cite: "cite",
    citation: "cite",
    bib: "cite",
    find: "find",
    bin: "bin",
    trash: "bin",
    recycle: "bin",
    games: "games",
    game: "games",
    play: "games",
    memory: "games",
    match: "games",
    habit: "habits",
    habits: "habits",
    countdown: "countdown",
    countdowns: "countdown",
    convert: "convert",
    converter: "convert",
    units: "convert",
    typing: "games",
    type: "games",
    wpm: "games",
    links: "links",
    favorites: "links",
    bookmarks: "links",
    dice: "dice",
    random: "dice",
    randomizer: "dice",
    coin: "dice",
    graph: "grapher",
    grapher: "grapher",
    plot: "grapher",
    desmos: "grapher",
    periodic: "periodic",
    elements: "periodic",
    element: "periodic",
    formula: "formula",
    formulas: "formula",
    dict: "dict",
    dictionary: "dict",
    thesaurus: "dict",
    equation: "equation",
    solve: "equation",
    solver: "equation",
    planner: "planner",
    plan: "planner",
    assignment: "planner",
    assignments: "planner",
    folders: "folders",
    folder: "folders",
    files: "folders",
    file: "folders",
    migrate: "migrate",
    export: "migrate",
    import: "migrate",
    backup: "migrate",
    storage: "migrate",
    weekly: "weekly",
    review: "weekly",
    week: "weekly",
  };
  function showRun() {
    var inp = el("input", {
      class: "in",
      list: "runlist",
      placeholder: "calc, notepad, games, paint\u2026",
      style: "width:100%;margin-top:8px",
    });
    var dl = el(
      "datalist",
      { id: "runlist" },
      Object.keys(RUNMAP).map(function (k) {
        return el("option", { value: k });
      })
    );
    var box = el("div", null, inp, dl);
    function go() {
      var v = inp.value
        .trim()
        .toLowerCase()
        .replace(/\.exe$/, "");
      if (!v) {
        inp.focus();
        return false;
      }
      if (v === "sticky" || v === "stickynote" || v === "stickies") {
        newSticky();
        return;
      }
      if (v === "fullscreen" || v === "full") {
        toggleFullscreen();
        return;
      }
      var id = RUNMAP[v] || (APPS[v] ? v : null);
      if (!id) {
        msgBox({
          title: clip(inp.value.trim(), 30),
          icon: "err",
          text:
            "Cannot find '" +
            clip(inp.value.trim(), 40) +
            "'. Make sure you typed the name correctly.",
        });
        return;
      }
      openApp(id);
    }
    var d = msgBox({
      title: "Run",
      icon: "run",
      width: 380,
      text: "Type the name of a program and FocusDesk 96 will open it for you.",
      extra: box,
      buttons: [{ label: "OK", fn: go }, { label: "Cancel" }],
    });
    onEnter(inp, function () {
      if (go() !== false) d.close();
    });
    setTimeout(function () {
      inp.focus();
    }, 0);
  }

  /* ================= STICKY NOTES ================= */
  var STICKY_COLORS = ["#ffff99", "#ffc8d8", "#c8f5c8", "#c8e4ff"];
  function renderStickies() {
    desk.querySelectorAll(".sticky").forEach(function (n) {
      n.remove();
    });
    S.stickies.forEach(function (st) {
      var node;
      var ta = el("textarea", {
        placeholder: "Type a note\u2026",
        spellcheck: "false",
      });
      ta.value = st.text;
      ta.addEventListener("input", function () {
        st.text = clip(ta.value, 3000);
        save();
      });
      var head = el(
        "div",
        { class: "sh" },
        el(
          "button",
          {
            title: "Change colour",
            "aria-label": "Change colour",
            onclick: function () {
              st.color = (st.color + 1) % 4;
              node.style.background = STICKY_COLORS[st.color];
              save();
            },
          },
          "C"
        ),
        el(
          "button",
          {
            title: "Delete note",
            "aria-label": "Delete note",
            onclick: function () {
              softDelete("stickies", function (x) {
                return x.id === st.id;
              });
              node.remove();
            },
          },
          "X"
        )
      );
      node = el(
        "div",
        {
          class: "sticky",
          "data-id": st.id,
          style:
            "left:" +
            st.x +
            "px;top:" +
            st.y +
            "px;width:" +
            st.w +
            "px;height:" +
            st.h +
            "px;background:" +
            STICKY_COLORS[st.color],
        },
        head,
        ta
      );
      head.addEventListener("pointerdown", function (e) {
        if (e.target.closest("button")) return;
        var r = node.getBoundingClientRect(),
          dr = desk.getBoundingClientRect(),
          ox = e.clientX - r.left,
          oy = e.clientY - r.top;
        try {
          head.setPointerCapture(e.pointerId);
        } catch (x) {}
        function mv(ev) {
          var x = Math.max(
              0,
              Math.min(dr.width - 40, ev.clientX - ox - dr.left)
            ),
            y = Math.max(0, Math.min(dr.height - 20, ev.clientY - oy - dr.top));
          node.style.left = x + "px";
          node.style.top = y + "px";
          st.x = x;
          st.y = y;
        }
        function up() {
          head.removeEventListener("pointermove", mv);
          head.removeEventListener("pointerup", up);
          head.removeEventListener("pointercancel", up);
          save();
        }
        head.addEventListener("pointermove", mv);
        head.addEventListener("pointerup", up);
        head.addEventListener("pointercancel", up);
      });
      node.addEventListener("pointerup", function () {
        if (
          node.offsetWidth &&
          (Math.abs(node.offsetWidth - st.w) > 2 ||
            Math.abs(node.offsetHeight - st.h) > 2)
        ) {
          st.w = node.offsetWidth;
          st.h = node.offsetHeight;
          save();
        }
      });
      desk.append(node);
    });
  }
  function newSticky() {
    if (S.stickies.length >= 30) {
      msgBox({
        title: "Sticky Notes",
        icon: "warn",
        text: "That's plenty of sticky notes! Delete a few first.",
      });
      return;
    }
    var n = S.stickies.length,
      id = uid();
    S.stickies.push({
      id: id,
      x: Math.max(8, (desk.clientWidth || 800) - 214 - (n % 4) * 26),
      y: 16 + (n % 6) * 28,
      w: 190,
      h: 150,
      text: "",
      color: n % 4,
    });
    save();
    renderStickies();
    var ta = desk.querySelector('.sticky[data-id="' + id + '"] textarea');
    if (ta) ta.focus();
  }

  /* ================= SCREEN SAVER ================= */
  var saverOn = false,
    saverRaf = 0,
    saverStart = 0,
    lastInput = Date.now();
  function stopSaver() {
    saverOn = false;
    cancelAnimationFrame(saverRaf);
    var sv = document.getElementById("saver");
    if (sv) sv.style.display = "none";
    lastInput = Date.now();
  }
  function startSaver(kind) {
    var sv = document.getElementById("saver");
    if (!sv || saverOn) return;
    var cv = sv.querySelector("canvas"),
      ctx = cv.getContext && cv.getContext("2d");
    if (!ctx) return;
    var W = (cv.width = innerWidth),
      H = (cv.height = innerHeight);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
    sv.style.display = "block";
    saverOn = true;
    saverStart = Date.now();
    kind = kind || S.prefs.saver || "stars";
    var stars = [],
      i;
    function resetStar(st, far) {
      st.x = Math.random() * 2 - 1;
      st.y = Math.random() * 2 - 1;
      st.z = far ? 1 : Math.random();
    }
    for (i = 0; i < 240; i++) {
      var st0 = {};
      resetStar(st0, false);
      stars.push(st0);
    }
    function poly() {
      var p = [];
      for (var k = 0; k < 4; k++)
        p.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() < 0.5 ? -1 : 1) * (2 + Math.random() * 3),
          vy: (Math.random() < 0.5 ? -1 : 1) * (2 + Math.random() * 3),
        });
      return p;
    }
    var polys = [poly(), poly()],
      hue = 0,
      tx = 40,
      ty = 80,
      tvx = 2.2,
      tvy = 1.6;
    window.__bub = [];
    window.__mx = null;
    window.__pipe = null;
    window.__fl = null;
    window.__wp = null;
    function frame() {
      if (!saverOn) return;
      if (kind === "stars") {
        ctx.fillStyle = "rgba(0,0,0,.4)";
        ctx.fillRect(0, 0, W, H);
        stars.forEach(function (s2) {
          s2.z -= 0.012;
          if (s2.z <= 0.02) resetStar(s2, true);
          var sx = W / 2 + (s2.x / s2.z) * W * 0.22,
            sy = H / 2 + (s2.y / s2.z) * W * 0.22,
            r = (1 - s2.z) * 2.6 + 0.4;
          if (sx < 0 || sx > W || sy < 0 || sy > H) {
            resetStar(s2, true);
            return;
          }
          var b = Math.round(130 + (1 - s2.z) * 125);
          ctx.fillStyle = "rgb(" + b + "," + b + "," + b + ")";
          ctx.fillRect(sx, sy, r, r);
        });
      } else if (kind === "mystify") {
        ctx.fillStyle = "rgba(0,0,0,.09)";
        ctx.fillRect(0, 0, W, H);
        hue = (hue + 1.4) % 360;
        polys.forEach(function (p, pi) {
          p.forEach(function (v) {
            v.x += v.vx;
            v.y += v.vy;
            if (v.x < 0 || v.x > W) v.vx = -v.vx;
            if (v.y < 0 || v.y > H) v.vy = -v.vy;
          });
          ctx.strokeStyle = "hsl(" + ((hue + pi * 140) % 360) + ",100%,60%)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(p[0].x, p[0].y);
          for (var k = 1; k < 4; k++) ctx.lineTo(p[k].x, p[k].y);
          ctx.closePath();
          ctx.stroke();
        });
      } else if (kind === "bubbles") {
        ctx.fillStyle = "rgba(0,0,0,.06)";
        ctx.fillRect(0, 0, W, H);
        var bub = window.__bub;
        while (bub.length < 42)
          bub.push({
            x: Math.random() * W,
            y: H + Math.random() * 200,
            r: 6 + Math.random() * 28,
            v: 0.4 + Math.random() * 1.6,
            h: Math.random() * 360,
          });
        bub.forEach(function (b) {
          b.y -= b.v;
          b.x += Math.sin((b.y + b.r) / 60) * 0.5;
          if (b.y + b.r < -20) {
            b.y = H + Math.random() * 120;
            b.x = Math.random() * W;
            b.h = Math.random() * 360;
          }
          ctx.strokeStyle = "hsla(" + b.h + ",90%,65%,.85)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.stroke();
        });
      } else if (kind === "matrix") {
        ctx.fillStyle = "rgba(0,0,0,.09)";
        ctx.fillRect(0, 0, W, H);
        var fs = 14,
          cols = Math.ceil(W / fs);
        if (!window.__mx || window.__mx.length !== cols) {
          window.__mx = [];
          for (var q = 0; q < cols; q++) window.__mx.push(Math.random() * H);
        }
        ctx.font = "bold " + fs + "px monospace";
        for (var c2 = 0; c2 < cols; c2++) {
          var ch2 = String.fromCharCode(
            0x30a0 + Math.floor(Math.random() * 96)
          );
          ctx.fillStyle =
            Math.random() < 0.06 ? "#ffffff" : "rgba(0,255,80,.85)";
          ctx.fillText(ch2, c2 * fs, window.__mx[c2]);
          window.__mx[c2] += fs;
          if (window.__mx[c2] > H && Math.random() > 0.94) window.__mx[c2] = 0;
        }
      } else if (kind === "pipes") {
        ctx.fillStyle = "rgba(0,0,0,.04)";
        ctx.fillRect(0, 0, W, H);
        if (!window.__pipe || window.__pipe.sx !== W)
          window.__pipe = { x: W / 2, y: H / 2, a: 0, sx: W };
        var pp = window.__pipe;
        pp.a += (Math.random() - 0.5) * 0.18;
        var r2 = 6 + Math.random() * 3;
        pp.x += Math.cos(pp.a) * r2;
        pp.y += Math.sin(pp.a) * r2;
        if (pp.x < 0 || pp.x > W || pp.y < 0 || pp.y > H) {
          pp.x = W / 2;
          pp.y = H / 2;
          pp.a = Math.random() * Math.PI * 2;
        }
        hue = (hue + 1) % 360;
        ctx.fillStyle = "hsl(" + hue + ",95%,60%)";
        ctx.fillRect(pp.x, pp.y, 3, 3);
      } else if (kind === "flurry") {
        ctx.fillStyle = "rgba(0,0,0,.07)";
        ctx.fillRect(0, 0, W, H);
        if (!window.__fl || window.__fl.W !== W) {
          window.__fl = { W: W, arms: [] };
          for (var fa = 0; fa < 7; fa++)
            window.__fl.arms.push({
              a: Math.random() * 6.28,
              s: 0.006 + Math.random() * 0.014,
              r: 0.4 + Math.random() * 0.5,
              h: Math.random() * 360,
              p: Math.random() * 6.28,
            });
        }
        var fl = window.__fl;
        ctx.save();
        ctx.translate(W / 2, H / 2);
        fl.arms.forEach(function (arm) {
          arm.a += arm.s;
          arm.p += 0.02;
          var rad = Math.min(W, H) * arm.r * (0.85 + Math.sin(arm.p) * 0.15);
          ctx.strokeStyle = "hsla(" + arm.h + ",100%,62%,.85)";
          ctx.lineWidth = 1.6;
          for (var k2 = 0; k2 < 4; k2++) {
            var aa = arm.a + (k2 * Math.PI) / 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(aa) * rad, Math.sin(aa) * rad);
            ctx.stroke();
          }
        });
        ctx.restore();
      } else if (kind === "warp") {
        ctx.fillStyle = "rgba(0,0,0,.22)";
        ctx.fillRect(0, 0, W, H);
        if (!window.__wp || window.__wp.W !== W) {
          window.__wp = { W: W, pts: [] };
          for (var wi = 0; wi < 160; wi++)
            window.__wp.pts.push({
              a: Math.random() * 6.28,
              r: Math.random() * 0.05,
              z: 0.02 + Math.random() * 0.98,
            });
        }
        var wp = window.__wp;
        ctx.save();
        ctx.translate(W / 2, H / 2);
        wp.pts.forEach(function (p2) {
          var pz = p2.z;
          p2.z -= 0.012;
          if (p2.z <= 0.02) {
            p2.z = 1;
            p2.a = Math.random() * 6.28;
            p2.r = Math.random() * 0.05;
          }
          var scale = Math.min(W, H) * 0.55;
          var x1 = (Math.cos(p2.a) * p2.r * scale) / pz,
            y1 = (Math.sin(p2.a) * p2.r * scale) / pz;
          var x2 = (Math.cos(p2.a) * p2.r * scale) / (pz + 0.03),
            y2 = (Math.sin(p2.a) * p2.r * scale) / (pz + 0.03);
          if (Math.abs(x1) > W || Math.abs(y1) > H) return;
          var br = Math.round(120 + (1 - p2.z) * 135);
          ctx.strokeStyle = "rgb(" + br + "," + Math.round(br * 0.7) + ",255)";
          ctx.lineWidth = (1 - p2.z) * 2.4 + 0.4;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        });
        ctx.restore();
      } else {
        ctx.fillStyle = "rgba(0,0,0,.18)";
        ctx.fillRect(0, 0, W, H);
        hue = (hue + 2) % 360;
        ctx.font = 'italic bold 54px Georgia,"Times New Roman",serif';
        var tw = ctx.measureText("FocusDesk 96").width;
        tx += tvx;
        ty += tvy;
        if (tx < 0 || tx + tw > W) tvx = -tvx;
        if (ty < 60 || ty > H - 10) tvy = -tvy;
        ctx.fillStyle = "hsl(" + hue + ",100%,60%)";
        ctx.fillText("FocusDesk 96", tx, ty);
      }
      saverRaf = requestAnimationFrame(frame);
    }
    frame();
  }
  ["pointermove", "pointerdown", "keydown", "wheel", "touchstart"].forEach(
    function (ev) {
      document.addEventListener(
        ev,
        function () {
          if (saverOn) {
            if (Date.now() - saverStart > 700) stopSaver();
          } else lastInput = Date.now();
        },
        true
      );
    }
  );
  setInterval(function () {
    if (
      !saverOn &&
      S.prefs.saver &&
      Date.now() - lastInput > (S.prefs.saverMin || 5) * 60000
    )
      startSaver();
  }, 5000);

  /* ================= APP REGISTRY ================= */
  var APPS = {
    today: {
      id: "today",
      title: "Today",
      icon: "sun",
      w: 440,
      h: 540,
      build: appToday,
    },
    calendar: {
      id: "calendar",
      title: "Calendar",
      icon: "calendar",
      w: 660,
      h: 660,
      build: appCalendar,
    },
    tasks: {
      id: "tasks",
      title: "Tasks",
      icon: "tasks",
      w: 480,
      h: 420,
      build: appTasks,
    },
    notepad: {
      id: "notepad",
      title: "Notepad",
      icon: "notepad",
      w: 620,
      h: 480,
      build: appNotepad,
    },
    reminders: {
      id: "reminders",
      title: "Reminders",
      icon: "alarm",
      w: 480,
      h: 400,
      build: appReminders,
    },
    timer: {
      id: "timer",
      title: "Focus Timer",
      icon: "hourglass",
      w: 360,
      h: 690,
      build: appTimer,
    },
    canvas: {
      id: "canvas",
      title: "Calendar Link",
      icon: "cap",
      w: 560,
      h: 560,
      build: appCanvas,
    },
    cards: {
      id: "cards",
      title: "Flash Cards",
      icon: "cards",
      w: 460,
      h: 400,
      build: appCards,
    },
    research: {
      id: "research",
      title: "Research",
      icon: "magnifier",
      w: 600,
      h: 620,
      build: appResearch,
      onclose: function (w) {
        if (w.abort) w.abort();
      },
    },
    grades: {
      id: "grades",
      title: "Grade Calculator",
      icon: "grades",
      w: 540,
      h: 600,
      build: appGrades,
    },
    control: {
      id: "control",
      title: "Control Panel",
      icon: "control",
      w: 470,
      h: 560,
      build: appControl,
    },
    calc: {
      id: "calc",
      title: "Calculator",
      icon: "calc",
      w: 270,
      h: 330,
      build: appCalc,
    },
    paint: {
      id: "paint",
      title: "Sketch Pad",
      icon: "paint",
      w: 540,
      h: 540,
      build: appPaint,
    },
    schedule: {
      id: "schedule",
      title: "Class Schedule",
      icon: "schedule",
      w: 620,
      h: 560,
      build: appSchedule,
    },
    stats: {
      id: "stats",
      title: "Study Stats",
      icon: "stats",
      w: 480,
      h: 620,
      build: appStats,
    },
    weekly: {
      id: "weekly",
      title: "Weekly Review",
      icon: "stats",
      w: 560,
      h: 620,
      build: appWeekly,
    },
    cite: {
      id: "cite",
      title: "Citation Maker",
      icon: "book",
      w: 500,
      h: 640,
      build: appCite,
    },
    find: {
      id: "find",
      title: "Find",
      icon: "find",
      w: 480,
      h: 420,
      build: appFind,
    },
    bin: {
      id: "bin",
      title: "Recycle Bin",
      icon: "bin",
      w: 480,
      h: 460,
      build: appBin,
    },
    habits: {
      id: "habits",
      title: "Habit Tracker",
      icon: "habits",
      w: 540,
      h: 440,
      build: appHabits,
    },
    breaker: {
      id: "breaker",
      title: "Habit Breaker",
      icon: "breaker",
      w: 640,
      h: 440,
      build: appBreaker,
    },
    achievements: {
      id: "achievements",
      title: "Achievements",
      icon: "trophy",
      w: 420,
      h: 480,
      build: appAch,
    },
    countdown: {
      id: "countdown",
      title: "Countdowns",
      icon: "countdown",
      w: 440,
      h: 420,
      build: appCountdown,
    },
    convert: {
      id: "convert",
      title: "Unit Converter",
      icon: "convert",
      w: 420,
      h: 520,
      build: appConvert,
    },
    links: {
      id: "links",
      title: "Favorites",
      icon: "links",
      w: 500,
      h: 500,
      build: appLinks,
    },
    dice: {
      id: "dice",
      title: "Randomizer",
      icon: "dice",
      w: 440,
      h: 480,
      build: appDice,
    },
    grapher: {
      id: "grapher",
      title: "Math Grapher",
      icon: "grapher",
      w: 640,
      h: 620,
      build: appGrapher,
    },
    periodic: {
      id: "periodic",
      title: "Periodic Table",
      icon: "periodic",
      w: 720,
      h: 480,
      build: appPeriodic,
    },
    formula: {
      id: "formula",
      title: "Formula Sheet",
      icon: "formula",
      w: 540,
      h: 560,
      build: appFormula,
    },
    dict: {
      id: "dict",
      title: "Dictionary / Thesaurus",
      icon: "dict",
      w: 500,
      h: 560,
      build: appDict,
    },
    equation: {
      id: "equation",
      title: "Equation Solver",
      icon: "equation",
      w: 460,
      h: 380,
      build: appEquation,
    },
    planner: {
      id: "planner",
      title: "Assignment Planner",
      icon: "schedule",
      w: 720,
      h: 500,
      build: appPlanner,
    },
    folders: {
      id: "folders",
      title: "Folders",
      icon: "folder",
      w: 700,
      h: 540,
      build: appFolders,
    },
    migrate: {
      id: "migrate",
      title: "Migrate",
      icon: "migrate",
      w: 660,
      h: 520,
      build: appMigrate,
    },
    games: {
      id: "games",
      title: "Games",
      icon: "games",
      w: 720,
      h: 620,
      build: appGames,
      onclose: function (w) {
        if (w.stop) w.stop();
      },
    },
  };

  /* ================= DESKTOP ICONS ================= */
  var icons = $("#icons");
  var ICW = 84,
    ICH = 88,
    lastDrag = 0;
  var DESK_DEFAULT = [
    "today",
    "calendar",
    "schedule",
    "tasks",
    "planner",
    "folders",
    "notepad",
    "reminders",
    "timer",
    "stats",
    "weekly",
    "canvas",
    "cards",
    "research",
    "grades",
    "cite",
    "games",
    "control",
    "bin",
  ];
  function deselect() {
    icons.querySelectorAll(".ico.sel").forEach(function (i) {
      i.classList.remove("sel");
    });
  }
  function iconInfo(id) {
    var custom = (S.desk.names || {})[id];
    if (id === "bin")
      return {
        glyph: "bin",
        label: custom || "Recycle Bin",
        open: function () {
          openApp("bin");
        },
      };
    if (id === "sticky")
      return {
        glyph: "sticky",
        label: custom || "Sticky Note",
        open: function () {
          newSticky();
        },
      };
    var a = APPS[id];
    return a
      ? {
          glyph: a.icon,
          label: custom || a.title,
          open: function () {
            openApp(id);
          },
        }
      : null;
  }
  function ensureDesk() {
    var dk = S.desk;
    if (!dk.init) {
      dk.ids = DESK_DEFAULT.slice();
      dk.pos = {};
      dk.freepos = {};
      dk.init = true;
      save();
    }
    if (!Array.isArray(dk.known)) dk.known = [];
    if (!isObj(dk.names)) dk.names = {};
    if (!isObj(dk.freepos)) dk.freepos = {};
  }
  function onDesk(id) {
    return S.desk.ids.indexOf(id) >= 0;
  }
  function addToDesk(id) {
    if (!iconInfo(id) || onDesk(id)) return;
    S.desk.ids.push(id);
    delete S.desk.pos[id];
    delete S.desk.freepos[id];
    save();
    buildIcons();
    refreshAll();
  }
  function removeFromDesk(id) {
    S.desk.ids = S.desk.ids.filter(function (x) {
      return x !== id;
    });
    delete S.desk.pos[id];
    delete S.desk.freepos[id];
    save();
    buildIcons();
    refreshAll();
  }
  function deskGrid() {
    var w0 = desk.clientWidth || innerWidth || 900,
      h0 = desk.clientHeight || innerHeight || 600;
    return {
      cols: Math.max(1, Math.floor(w0 / ICW)),
      rows: Math.max(1, Math.floor(h0 / ICH)),
    };
  }
  function layoutCells() {
    var g = deskGrid(),
      used = {},
      cells = {},
      pending = [],
      dirty = false;
    S.desk.ids.forEach(function (id) {
      if (!iconInfo(id)) return;
      var p = S.desk.pos[id];
      if (p && p[0] < g.cols && p[1] < g.rows && !used[p[0] + "," + p[1]]) {
        used[p[0] + "," + p[1]] = id;
        cells[id] = [p[0], p[1]];
      } else pending.push(id);
    });
    pending.forEach(function (id) {
      var placed = false;
      for (var c = 0; c < g.cols && !placed; c++)
        for (var r = 0; r < g.rows && !placed; r++) {
          if (!used[c + "," + r]) {
            used[c + "," + r] = id;
            cells[id] = [c, r];
            placed = true;
            if (!S.desk.pos[id]) {
              S.desk.pos[id] = [c, r];
              dirty = true;
            }
          }
        }
      if (!placed) cells[id] = [g.cols - 1, g.rows - 1];
    });
    if (dirty) save();
    return { cells: cells, used: used, g: g };
  }
  function iconPixelPos(id, L) {
    if (S.prefs.iconGrid === false && S.desk.freepos && S.desk.freepos[id]) {
      var fp = S.desk.freepos[id];
      if (Array.isArray(fp) && isNum(fp[0]) && isNum(fp[1]))
        return [fp[0], fp[1]];
    }
    var cell = L.cells[id];
    if (!cell) return [4, 6];
    return [cell[0] * ICW + 4, cell[1] * ICH + 6];
  }
  function setIconGrid(on) {
    var was = S.prefs.iconGrid !== false;
    on = !!on;
    if (was === on) return;
    if (!on) {
      S.desk.freepos = S.desk.freepos || {};
      var L = layoutCells();
      S.desk.ids.forEach(function (id) {
        var cell = L.cells[id];
        if (cell) S.desk.freepos[id] = [cell[0] * ICW + 4, cell[1] * ICH + 6];
      });
    } else {
      var L2 = layoutCells();
      S.desk.ids.forEach(function (id) {
        var fp = S.desk.freepos && S.desk.freepos[id];
        if (fp) {
          var cx = Math.max(0, Math.round((fp[0] - 4) / ICW));
          var cy = Math.max(0, Math.round((fp[1] - 6) / ICH));
          L2.cells[id] = [cx, cy];
          S.desk.pos[id] = [cx, cy];
        }
      });
      S.desk.freepos = {};
    }
    S.prefs.iconGrid = on;
    save();
    buildIcons();
  }
  function arrangeByName() {
    S.desk.ids.sort(function (a, b) {
      var x = iconInfo(a),
        y = iconInfo(b);
      return (x ? x.label : a) < (y ? y.label : b) ? -1 : 1;
    });
    S.desk.pos = {};
    S.desk.freepos = {};
    save();
    buildIcons();
  }
  function resetPositions() {
    S.desk.pos = {};
    S.desk.freepos = {};
    save();
    buildIcons();
  }
  function iconMenu(x, y, id, info) {
    popMenu(x, y, [
      { label: "Open", fn: info.open },
      { sep: 1 },
      {
        label: "Rename\u2026",
        fn: function () {
          askText(
            "Rename Icon",
            "New name for this icon:",
            info.label,
            function (v) {
              S.desk.names = S.desk.names || {};
              S.desk.names[id] = clip(v, 60);
              save();
              buildIcons();
            }
          );
        },
      },
      {
        label: "Reset name",
        dis: !(S.desk.names || {})[id],
        fn: function () {
          if (S.desk.names) {
            delete S.desk.names[id];
            save();
            buildIcons();
          }
        },
      },
      { sep: 1 },
      {
        label: "Remove from Desktop",
        fn: function () {
          removeFromDesk(id);
        },
      },
    ]);
  }
  function deskMenu(x, y) {
    var missing = Object.keys(APPS)
      .filter(function (id) {
        return !onDesk(id);
      })
      .sort(function (a, b) {
        return APPS[a].title < APPS[b].title ? -1 : 1;
      });
    if (!onDesk("sticky")) missing.push("sticky");
    if (!onDesk("bin")) missing.push("bin");
    var addSub = missing.map(function (id) {
      var i = iconInfo(id);
      return {
        label: i.label,
        ic: i.glyph,
        fn: function () {
          addToDesk(id);
        },
      };
    });
    popMenu(x, y, [
      {
        label: "Add to Desktop",
        sub: addSub.length
          ? addSub
          : [{ label: "(everything is already here)", dis: true }],
      },
      {
        label: "Arrange Icons",
        sub: [
          { label: "By Name", fn: arrangeByName },
          { label: "Reset Positions", fn: resetPositions },
        ],
      },
      { sep: 1 },
      { label: "New Sticky Note", ic: "sticky", fn: newSticky },
      { label: "Full Screen", ic: "full", fn: toggleFullscreen },
      {
        label: "Desktop Picture\u2026",
        ic: "image",
        fn: function () {
          openApp("control");
        },
      },
    ]);
  }
  function dropIcon(id, c, r) {
    var L = layoutCells(),
      occ = L.used[c + "," + r];
    if (occ === id) {
      buildIcons();
      return;
    }
    if (occ === "bin" && id !== "bin") {
      var inf = iconInfo(id);
      msgBox({
        title: "Recycle Bin",
        icon: "q",
        text: 'Remove "' + inf.label + '" from the desktop?',
        buttons: [
          {
            label: "Yes",
            fn: function () {
              removeFromDesk(id);
            },
          },
          {
            label: "No",
            fn: function () {
              buildIcons();
            },
          },
        ],
        onClose: function () {
          buildIcons();
        },
      });
      return;
    }
    var old = L.cells[id];
    if (occ && old) S.desk.pos[occ] = [old[0], old[1]];
    S.desk.pos[id] = [c, r];
    save();
    buildIcons();
  }
  function iconDrag(node, id) {
    node.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      var sx = e.clientX,
        sy = e.clientY,
        rc = node.getBoundingClientRect(),
        ox = sx - rc.left,
        oy = sy - rc.top,
        moved = false,
        pid = e.pointerId,
        lpT = null;
      if (e.pointerType !== "mouse") {
        lpT = setTimeout(function () {
          lpT = null;
          if (!moved) {
            lastDrag = Date.now();
            cleanup();
            var inf = iconInfo(id);
            if (inf) iconMenu(sx, sy, id, inf);
          }
        }, 650);
      }
      function mv(ev) {
        if (ev.pointerId !== pid) return;
        if (!moved) {
          if (Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) < 7) return;
          moved = true;
          clearTimeout(lpT);
          lpT = null;
          node.classList.add("drag");
          deselect();
          node.classList.add("sel");
        }
        var dr = desk.getBoundingClientRect();
        var ix = ev.clientX - ox - dr.left;
        var iy = ev.clientY - oy - dr.top;
        node.style.left = ix + "px";
        node.style.top = iy + "px";
        if (S.prefs.iconGrid !== false) {
          var g = deskGrid();
          var cx = Math.max(0, Math.min(g.cols - 1, Math.floor(ix / ICW)));
          var cy = Math.max(0, Math.min(g.rows - 1, Math.floor(iy / ICH)));
          snapInd.style.left = cx * ICW + 2 + "px";
          snapInd.style.top = cy * ICH + 4 + "px";
          snapInd.hidden = false;
        } else {
          snapInd.hidden = true;
        }
      }
      function cleanup() {
        clearTimeout(lpT);
        snapInd.hidden = true;
        document.removeEventListener("pointermove", mv);
        document.removeEventListener("pointerup", up);
        document.removeEventListener("pointercancel", up);
      }
      function up(ev) {
        if (ev.pointerId !== pid) return;
        cleanup();
        snapInd.hidden = true;
        if (!moved) return;
        lastDrag = Date.now();
        node.classList.remove("drag");
        var dr = desk.getBoundingClientRect();
        if (S.prefs.iconGrid === false) {
          var fx = Math.max(
            0,
            Math.min(dr.width - ICW, ev.clientX - ox - dr.left)
          );
          var fy = Math.max(
            0,
            Math.min(dr.height - ICH, ev.clientY - oy - dr.top)
          );
          S.desk.freepos = S.desk.freepos || {};
          S.desk.freepos[id] = [Math.round(fx), Math.round(fy)];
          save();
          buildIcons();
        } else {
          var g = deskGrid();
          var cx = Math.max(
            0,
            Math.min(g.cols - 1, Math.floor((ev.clientX - ox - dr.left) / ICW))
          );
          var cy = Math.max(
            0,
            Math.min(g.rows - 1, Math.floor((ev.clientY - oy - dr.top) / ICH))
          );
          dropIcon(id, cx, cy);
        }
      }
      document.addEventListener("pointermove", mv);
      document.addEventListener("pointerup", up);
      document.addEventListener("pointercancel", up);
    });
  }
  function buildIcons() {
    ensureDesk();
    icons.textContent = "";
    var L = layoutCells();
    S.desk.ids.forEach(function (id) {
      var info = iconInfo(id);
      if (!info) return;
      var pos = iconPixelPos(id, L);
      var node = el(
        "div",
        {
          class: "ico" + (isNewApp(id) ? " new" : ""),
          "data-id": id,
          tabindex: "0",
          role: "button",
          style: "left:" + pos[0] + "px;top:" + pos[1] + "px",
        },
        pix(info.glyph, 32),
        el("div", null, el("span", { class: "l" }, info.label))
      );
      node.addEventListener("click", function () {
        if (Date.now() - lastDrag < 400) return;
        deselect();
        node.classList.add("sel");
        if (coarse) info.open();
      });
      node.addEventListener("dblclick", function () {
        if (Date.now() - lastDrag < 400) return;
        info.open();
      });
      node.addEventListener("keydown", function (e) {
        if (e.key === "Enter") info.open();
      });
      node.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        e.stopPropagation();
        iconMenu(e.clientX, e.clientY, id, info);
      });
      iconDrag(node, id);
      icons.append(node);
    });
  }
  desk.addEventListener("contextmenu", function (e) {
    if (e.target !== desk && e.target !== icons) return;
    e.preventDefault();
    deskMenu(e.clientX, e.clientY);
  });
  desk.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "mouse" || (e.target !== desk && e.target !== icons))
      return;
    var sx = e.clientX,
      sy = e.clientY,
      t = setTimeout(function () {
        end();
        deskMenu(sx, sy);
      }, 650);
    function mv(ev) {
      if (Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) > 10) end();
    }
    function end() {
      clearTimeout(t);
      desk.removeEventListener("pointerup", end);
      desk.removeEventListener("pointercancel", end);
      desk.removeEventListener("pointermove", mv);
    }
    desk.addEventListener("pointerup", end);
    desk.addEventListener("pointercancel", end);
    desk.addEventListener("pointermove", mv);
  });

  /* ================= START MENU ================= */
  var sm = $("#startmenu"),
    smItems = $("#startitems");
  function applyBg() {
    var th = themeByKey(S.prefs.theme);
    var deskCol =
      S.prefs.bg && /^#[0-9a-f]{6}$/i.test(S.prefs.bg) ? S.prefs.bg : th.bg;
    var accentCol =
      S.prefs.accent && /^#[0-9a-f]{6}$/i.test(S.prefs.accent)
        ? S.prefs.accent
        : th.accent;
    document.documentElement.style.setProperty("--desk", deskCol);
    document.documentElement.style.setProperty("--navy", accentCol);
    document.documentElement.classList.toggle("grey", !!S.prefs.grey);
    applyWall();
  }
  function toggleGrey() {
    S.prefs.grey = !S.prefs.grey;
    applyBg();
    save();
  }
  function toggleMute() {
    S.prefs.mute = !S.prefs.mute;
    setSpk();
    save();
    if (!S.prefs.mute) {
      ac();
      ding();
    }
  }
  var GROUPS = [
    {
      name: "Study",
      apps: [
        "today",
        "calendar",
        "schedule",
        "tasks",
        "planner",
        "folders",
        "habits",
        "breaker",
        "countdown",
        "reminders",
        "timer",
        "stats",
        "weekly",
        "canvas",
        "cards",
        "research",
        "grades",
        "cite",
        "links",
        "achievements",
      ],
    },
    {
      name: "Reference",
      apps: ["formula", "periodic", "dict", "convert", "grapher", "equation"],
    },
    {
      name: "Accessories",
      apps: [
        "notepad",
        {
          label: "Sticky Note",
          ic: "sticky",
          fn: function () {
            newSticky();
          },
        },
        "calc",
        "dice",
        "paint",
        "find",
        "migrate",
        "bin",
      ],
    },
    { name: "Games", apps: ["games"] },
  ];
  function appItem(id) {
    var a = APPS[id];
    return {
      label: a.title + (isNewApp(id) ? "\u2003NEW" : ""),
      ic: a.icon,
      app: id,
      fn: function () {
        openApp(id);
      },
    };
  }
  function buildStart() {
    smItems.textContent = "";
    function big(ic, label, fn, sub) {
      var row = el(
        "div",
        {
          class: "mi big",
          onclick: function (e) {
            e.stopPropagation();
            if (sub) {
              var r = row.getBoundingClientRect();
              popMenu(r.right - 2, r.top - 3, sub(), 0);
              return;
            }
            hideStart();
            fn();
          },
          onmouseenter: function () {
            if (coarse) return;
            if (sub) {
              var r = row.getBoundingClientRect();
              popMenu(r.right - 2, r.top - 3, sub(), 0);
            } else closePop(0);
          },
        },
        pix(ic, 32),
        el("span", { class: "ml" }, label),
        sub ? el("span", { class: "arr" }, "\u25B6") : null
      );
      smItems.append(row);
    }
    big("programs", "Programs", null, function () {
      return GROUPS.map(function (g) {
        return {
          label: g.name,
          ic: "folder",
          sub: g.apps.map(function (a) {
            return typeof a === "string" ? appItem(a) : a;
          }),
        };
      });
    });
    big("control", "Settings", null, function () {
      return [
        {
          label: "Control Panel",
          ic: "control",
          fn: function () {
            openApp("control");
          },
        },
        {
          label: "Assistant\u2026",
          ic: "helpy",
          fn: function () {
            openApp("control");
          },
        },
        {
          label: "Desktop Picture\u2026",
          ic: "image",
          fn: function () {
            openApp("control");
          },
        },
        {
          label: "Themes\u2026",
          ic: "paint",
          fn: function () {
            openApp("control");
          },
        },
        {
          label: "Desktop Icons\u2026",
          ic: "folder",
          fn: function () {
            openApp("control");
          },
        },
        { label: "Full Screen  (Alt+Enter)", ic: "full", fn: toggleFullscreen },
        {
          label: S.prefs.grey ? "Grey Mode: On" : "Grey Mode: Off",
          ic: "control",
          fn: toggleGrey,
        },
        {
          label: S.prefs.mute ? "Sound: Off" : "Sound: On",
          ic: S.prefs.mute ? "spk0" : "spk",
          fn: toggleMute,
        },
      ];
    });
    big("find", "Find", function () {
      openApp("find");
    });
    big("bulb", "Help & Tips", function () {
      showWelcome();
    });
    big("run", "Run\u2026", showRun);
    smItems.append(el("div", { class: "msep" }));
    big("shutdown", "Shut Down\u2026", function () {
      msgBox({
        title: "Shut Down FocusDesk 96",
        icon: "q",
        text: "Are you sure you want to shut down?",
        buttons: [{ label: "Yes", fn: shutDown }, { label: "No" }],
      });
    });
  }
  function hideStart() {
    sm.hidden = true;
    $("#startbtn").classList.remove("on");
    closePop(0);
  }
  $("#startbtn").addEventListener("click", function (e) {
    e.stopPropagation();
    if (sm.hidden) {
      buildStart();
      sm.hidden = false;
      this.classList.add("on");
    } else hideStart();
  });
  document.addEventListener("pointerdown", function (e) {
    var inPop = e.target.closest(".pop"),
      inMenu = e.target.closest("#startmenu");
    if (!inPop && !inMenu) closePop(0);
    if (!inPop && !inMenu && !e.target.closest("#startbtn")) hideStart();
    if (!e.target.closest(".ico")) deselect();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closePop(0);
      hideStart();
    }
  });
  $("#spk").addEventListener("click", toggleMute);
  $("#saveWarn").append(pix("warn", 16));
  setSpk();
  function shutDown() {
    shutdownSound();
    stopAmbient();
    stopSaver();
    /* Snapshot the open-window layout so it survives the reboot.
       closeWin() normally updates S.session, but during shutdown we
       want to keep the pre-shutdown state so restoreSession() has
       something to restore when the user comes back. */
    suspendSessionSave = true;
    for (var k in wins) closeWin(wins[k]);
    suspendSessionSave = false;
    T.running = false;
    saveTimer();
    updTimer();
    flush();
    var s = $("#shutdown");
    s.style.display = "flex";
    s.onclick = function () {
      s.style.display = "none";
      s.onclick = null;
      boot();
    };
  }

  /* ================= CLOCK ================= */
  function tick() {
    var d = new Date();
    $("#clock").textContent = fmt12(d);
    $("#clock").title =
      DAYS[d.getDay()] +
      ", " +
      MONTHS[d.getMonth()] +
      " " +
      d.getDate() +
      ", " +
      d.getFullYear();
  }
  tick();
  setInterval(tick, 5000);
  function showClockFlyout() {
    var cur = new Date();
    var vy = cur.getFullYear(),
      vm = cur.getMonth();
    var wrap = el("div", { class: "col", style: "gap:4px;min-width:230px" });
    var head = el(
      "div",
      { class: "row", style: "gap:4px;align-items:center" },
      el(
        "button",
        {
          class: "btn xs",
          "aria-label": "Previous month",
          onclick: function () {
            vm--;
            if (vm < 0) {
              vm = 11;
              vy--;
            }
            draw();
          },
        },
        "\u25C0"
      ),
      el("div", { style: "flex:1;text-align:center;font-weight:bold" }, ""),
      el(
        "button",
        {
          class: "btn xs",
          "aria-label": "Next month",
          onclick: function () {
            vm++;
            if (vm > 11) {
              vm = 0;
              vy++;
            }
            draw();
          },
        },
        "\u25B6"
      )
    );
    var titleEl = head.children[1];
    var grid = el("div", {
      style:
        "display:grid;grid-template-columns:repeat(7,1fr);gap:2px;text-align:center;font-size:11px",
    });
    wrap.append(head, grid);
    function draw() {
      titleEl.textContent = MONTHS[vm] + " " + vy;
      grid.textContent = "";
      ["S", "M", "T", "W", "T", "F", "S"].forEach(function (d) {
        grid.append(
          el(
            "div",
            { style: "font-weight:bold;color:#404040;padding:2px 0" },
            d
          )
        );
      });
      var first = new Date(vy, vm, 1),
        start = new Date(vy, vm, 1 - first.getDay()),
        todayS = ymd(new Date());
      for (var i = 0; i < 42; i++) {
        var d = new Date(
            start.getFullYear(),
            start.getMonth(),
            start.getDate() + i
          ),
          s = ymd(d);
        grid.append(
          el(
            "div",
            {
              style:
                "padding:4px 0;cursor:default;" +
                (d.getMonth() !== vm ? "color:#a0a0a0;" : "") +
                (s === todayS
                  ? "background:#000080;color:#fff;font-weight:bold;"
                  : ""),
            },
            d.getDate()
          )
        );
      }
    }
    draw();
    var r = $("#clock").getBoundingClientRect();
    popMenu(
      r.right - 240,
      r.top - 260,
      [{ label: "", dis: true, fn: function () {} }],
      0
    );
    var pop = pops[pops.length - 1];
    if (pop) {
      pop.textContent = "";
      pop.append(wrap);
      var pr = pop.getBoundingClientRect();
      pop.style.left =
        Math.max(2, Math.min(r.right - pr.width, innerWidth - pr.width - 2)) +
        "px";
      pop.style.top = Math.max(2, r.top - pr.height - 6) + "px";
    }
  }
  $("#clock").addEventListener("click", function (e) {
    e.stopPropagation();
    if (pops.length) {
      closePop(0);
      return;
    }
    showClockFlyout();
  });

  /* ================= WELCOME / TIPS ================= */
  var TIPS = [
    "Clipy lives in the corner \u2014 right-click him for options. He knows your stats.",
    "Notepad has a formatting toolbar: H1, bold, italic, strikethrough, highlight, lists, quotes, note links and web links.",
    "Click Preview in Notepad to see rendered Markdown below the editor. Task checkboxes become clickable there.",
    "Ctrl+B and Ctrl+I (Cmd on Mac) apply bold and italic inside Notepad.",
    "Sketch Pad: hold Shift while drawing a line, box or ellipse to constrain.",
    "The Dictionary tries dictionaryapi.dev, then Wiktionary, then Datamuse.",
    "On Mac, use Cmd+1..9 to jump between open windows, and Cmd+Enter for full screen.",
    "Flash Cards use real spaced repetition. Grade each card Again / Hard / Good / Easy.",
    "Weekly Review summarizes your focus, tasks and habits for any week.",
    "Toggle Grey Mode in Control Panel \u2192 Preferences, or pick one of 12 themes.",
    "Type [[Note Title]] in Notepad to link to another note.",
    "Calendar Week view lets you click any hour to add a study block.",
    "Alt+1..9 (Option on Mac) jumps to the Nth open window.",
    "Drag an event chip to another day in Month view to reschedule it.",
    "In Week view, drag the bottom edge of an event chip to change its length.",
    "Drag section headers on the Today page to reorder them.",
    "Right-click any habit day cell to attach a note.",
    "Run Ollama or LM Studio and pick M.X.E.S. in Control Panel \u2014 everything stays on your machine.",
    "Games hub: Sudoku has four difficulties and note mode. Board Games includes unbeatable Tic-Tac-Toe.",
    "Math Grapher has sliders \u2014 type 'a x^2 + b' and drag a and b to explore.",
    "Clipy can plan your week \u2014 click the 'Plan my week' chip in his panel.",
    "Pick a Tritone icon theme in Control Panel \u2192 Display & Preferences and every icon redraws in your colours.",
    "Your cursors can be coloured too \u2014 outline and fill, right under the icon theme picker.",
    'Turn off "Snap icons to a grid" and desktop icons stay wherever you drop them.',
    "Clipy mixes study tips and fun facts in with his reminders so he never gets boring.",
    "Create a Folder to group related assignments and notes together \u2014 try it from Control Panel or the desktop.",
    "Click any assignment in Calendar Link to open its own detail window with a notes area.",
    "Research has a \u201cContinue with Clipy\u201d button \u2014 after a search or an assistant answer, one click hands it off.",
    "Session persistence: reopen the page and every window you had open comes back where you left it.",
    "FocusDesk 96 is made by Apoji Studios \u2014 everything lives in your browser, no accounts, no cloud.",
  ];
  var tipI = Math.floor(Math.random() * TIPS.length);
  function showWelcome() {
    var now = Date.now(),
      open = S.assign.filter(function (a) {
        return !a.done;
      });
    var week = open.filter(function (a) {
      return a.due >= now && a.due < now + 7 * 86400000;
    }).length;
    var over = open.filter(function (a) {
      return a.due < now;
    }).length;
    var rToday = S.reminders.filter(function (r) {
      return !r.done && ymd(new Date(r.at)) === ymd(new Date());
    }).length;
    var parts = [];
    if (S.assign.length)
      parts.push(
        week +
          " assignment(s) due in the next 7 days" +
          (over ? ", " + over + " overdue" : "")
      );
    parts.push(rToday + " reminder(s) today");
    parts.push(
      S.tasks.filter(function (t) {
        return !t.done;
      }).length + " open task(s)"
    );
    var chk = el("input", {
      type: "checkbox",
      checked: S.prefs.tips,
      onchange: function () {
        S.prefs.tips = this.checked;
        save();
      },
    });
    var d;
    function text() {
      return (
        "FocusDesk 96 \u2014 by Apoji Studios\n\n" +
        parts.join("\n") +
        "\n\nDid you know\u2026\n" +
        TIPS[tipI]
      );
    }
    d = msgBox({
      title: "Welcome to FocusDesk 96",
      icon: "bulb",
      width: 380,
      text: text(),
      extra: el(
        "label",
        { style: "display:flex;align-items:center;margin-top:12px" },
        chk,
        "Show this Welcome Screen next time"
      ),
      buttons: [
        { label: "Close" },
        {
          label: "Next Tip",
          fn: function () {
            tipI = (tipI + 1) % TIPS.length;
            d.setText(text());
            return false;
          },
        },
      ],
    });
  }

  /* ================= BOOT ================= */
  function dailyBackup() {
    if (window.__focusdeskIsDesktop) return; /* main.js writes backups/YYYY-MM-DD.json */
    try {
      var today = new Date().toDateString();
      var last = localStorage.getItem("focusdesk96.lastdaybak") || "";
      if (last === today) return;
      var dateKey = ymd(new Date());
      localStorage.setItem(
        "focusdesk96.bak.daily." + dateKey,
        JSON.stringify(S)
      );
      localStorage.setItem("focusdesk96.lastdaybak", today);
      var daily = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf("focusdesk96.bak.daily.") === 0) daily.push(k);
      }
      daily.sort();
      while (daily.length > 7) localStorage.removeItem(daily.shift());
    } catch (e) {}
  }
  function checkBackupAge() {
    if (window.__focusdeskIsDesktop) return; /* desktop backs up automatically */
    var last = 0;
    try {
      last = +localStorage.getItem("focusdesk96.lastbackup") || 0;
    } catch (e) {}
    var days = last ? Math.floor((Date.now() - last) / 86400000) : 999;
    if (days < 7) return;
    var hasData =
      S.notes.length ||
      S.tasks.length ||
      S.events.length ||
      S.cards.length ||
      S.assign.length ||
      S.habits.length ||
      S.countdowns.length ||
      S.links.length;
    if (!hasData) return;
    msgBox({
      title: "Back Up FocusDesk 96",
      icon: "warn",
      width: 400,
      text:
        (last
          ? "It's been " + days + " days since your last backup."
          : "You've never saved a backup file.") +
        "\n\nEverything lives in this browser only. Clearing site data, or a browser cleanup, erases it permanently.",
      buttons: [
        {
          label: "Save backup now",
          fn: function () {
            saveFile(
              "focusdesk96-backup-" + ymd(new Date()) + ".json",
              JSON.stringify(
                {
                  app: "FocusDesk 96",
                  version: VERSION,
                  saved: new Date().toISOString(),
                  data: S,
                  wall: wallData,
                },
                null,
                2
              )
            );
            try {
              localStorage.setItem(
                "focusdesk96.lastbackup",
                String(Date.now())
              );
            } catch (e) {}
          },
        },
        { label: "Remind me later" },
      ],
    });
  }
  function boot() {
    var b = $("#boot"),
      bar = $("#bootbar");
    var lg = $("#bootlogo");
    if (lg && !lg.firstChild) lg.append(pix("app", 64));
    var h1 = b.querySelector("h1");
    if (h1 && !h1.querySelector(".byline")) {
      h1.append(el("small", { class: "byline" }, "by Apoji Studios"));
    }
    if (!b.querySelector(".devby")) {
      b.append(el("div", { class: "devby" }, "A product of Apoji Delegraphics"));
    }
    if (
      !b.querySelector(".apojilogo") &&
      !b.querySelector(".apojilogo-missing")
    ) {
      b.append(makeApojiLogo("apojilogo"));
    }
    b.style.display = "flex";
    var major = parseInt(String(VERSION).split(".")[0], 10) || 2;
    b.setAttribute("data-family", major >= 3 ? "silver" : "classic");
    bar.textContent = "";
    var segs = [];
    for (var i = 0; i < 16; i++) {
      var s = el("i");
      segs.push(s);
      bar.append(s);
    }
    var n = 0,
      done = false;
    function finish() {
      if (done) return;
      done = true;
      clearInterval(iv);
      b.style.display = "none";
      try {
        dailyBackup();
      } catch (e) {}
      if (corruptLoad) {
        corruptLoad = false;
        msgBox({
          title: "FocusDesk 96",
          icon: "warn",
          text:
            "Your saved data couldn't be read, so FocusDesk started fresh.\nThe damaged copy was kept aside. Restore a backup in Control Panel if you have one." +
            (window.__focusdeskCorruptNote || ""),
        });
      }
      try {
        flagNewApps();
      } catch (e) {}
      try {
        autoAddNewApps();
      } catch (e) {}
      buildIcons();
      var hadUpdate = false;
      try {
        hadUpdate = applyPatchNotes(S);
      } catch (e) {}
      if (hadUpdate) save();
      try {
        ensureReleaseGuide();
      } catch (e) {}
      startupSound();
      applyCursor();
      mountClipy();
      try {
        restoreSession();
      } catch (e) {}
      if (S.prefs.tips) showWelcome();
      checkBackupAge();
      pruneImages();
      autoUpdateCheck();
      checkAchSoon();
    }
    var iv = setInterval(function () {
      if (n < segs.length) segs[n++].style.opacity = 1;
      else finish();
    }, 90);
    b.onclick = finish;
  }
  var lastErr = 0;
  function reportErr(msg) {
    var n = Date.now();
    if (n - lastErr < 5000) return;
    lastErr = n;
    try {
      msgBox({
        title: "FocusDesk 96",
        icon: "err",
        text:
          "A program ran into a problem:\n" +
          clip(msg || "unknown error", 140) +
          "\n\nYour data is safe.",
      });
    } catch (x) {}
  }
  window.addEventListener("error", function (e) {
    reportErr(e.message);
  });
  window.addEventListener("unhandledrejection", function (e) {
    var r = e.reason;
    if (r && r.code === "cancelled") return;
    reportErr(r && r.message ? r.message : "a background task failed");
  });
  window.addEventListener("storage", function (e) {
    if (e.key !== KEY || !e.newValue) return;
    try {
      S = sanitize(JSON.parse(e.newValue));
    } catch (x) {
      return;
    }
    applyBg();
    refreshAll();
    if (S.prefs.showClipy) mountClipy();
  });
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
      tick();
      checkReminders();
      refreshAll();
    }
  });
  document.addEventListener("dragover", function (e) {
    var ty = e.dataTransfer && e.dataTransfer.types;
    if (ty && Array.prototype.indexOf.call(ty, "Files") >= 0)
      e.preventDefault();
  });
  document.addEventListener("drop", function (e) {
    var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (!f) return;
    e.preventDefault();
    if (!/^image\//.test(f.type || "")) {
      msgBox({
        title: "Desktop",
        icon: "warn",
        text: "That file isn't a picture I can use as a background.",
      });
      return;
    }
    msgBox({
      title: "Desktop Background",
      icon: "q",
      text:
        "Use \u201c" + clip(f.name, 40) + "\u201d as your desktop background?",
      buttons: [
        {
          label: "Yes",
          fn: function () {
            setWallFromFile(f);
          },
        },
        { label: "No" },
      ],
    });
  });
  document.addEventListener("fullscreenchange", updFs);
  document.addEventListener("webkitfullscreenchange", updFs);
  $("#fsbtn").addEventListener("click", toggleFullscreen);
  $("#fsbtn").addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFullscreen();
    }
  });
  document.addEventListener("keydown", function (e) {
    var isMac = /Mac|iPhone|iPad/.test(
      navigator.platform || navigator.userAgent
    );
    if (
      (e.altKey || (isMac && e.metaKey)) &&
      (e.code === "Enter" || e.code === "NumpadEnter")
    ) {
      e.preventDefault();
      toggleFullscreen();
      return;
    }
    var modKey = e.altKey || (isMac && e.metaKey);
    if (modKey && /^Digit[1-9]$/.test(e.code)) {
      e.preventDefault();
      var ordered = [];
      for (var k in wins) ordered.push(wins[k]);
      ordered.sort(function (a, b) {
        return (+b.el.style.zIndex || 0) - (+a.el.style.zIndex || 0);
      });
      var idx = parseInt(e.code.replace("Digit", ""), 10) - 1;
      if (ordered[idx]) {
        if (ordered[idx].min) restoreWin(ordered[idx]);
        focusWin(ordered[idx]);
      }
      return;
    }
  });
  updFs();
  var rzT;
  window.addEventListener("resize", function () {
    clearTimeout(rzT);
    rzT = setTimeout(function () {
      buildIcons();
      for (var k in wins) {
        var ww = wins[k];
        if (ww.onresize) ww.onresize();
      }
    }, 120);
  });
  updSave();
  updTimer();
  renderStickies();
  applyBg();
  applyCursor();
  buildIcons();
  boot();
  window.addEventListener("resize", function () {
    if (innerWidth < 700)
      for (var k in wins) {
        wins[k].max = true;
        wins[k].el.classList.add("max");
      }
  });
})();
