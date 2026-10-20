# FocusDesk 96 — Desktop Edition 1.0.0

The complete FocusDesk 96 study environment, now as a native desktop app for macOS, Windows and Linux. Same apps, same look, same features as the browser version (2.6.1). Your data now lives in real files on your computer instead of browser storage.

## What's new in the desktop version

- **Real files.** Your data is saved as plain, readable JSON in your OS's standard app-data folder, so you can back it up, sync it with Dropbox, or copy it to another machine.
- **Automatic daily backups.** Seven rolling daily snapshots, written straight to disk.
- **Safe saving.** Every write goes to a temporary file first and is swapped in, so a crash can't corrupt your data. If a file is ever unreadable, it's set aside and you're told.
- **Native dialogs.** Save and open backups, `.ics` calendars, Migrate files, sketches, graphs and note exports with your OS's real file dialogs.
- **Migrate archive.** Every Migrate export is also kept in a `migrate` folder inside your data folder.
- **Native menus** on every platform, and the window remembers its size and position.

## Download

| Platform | File |
| --- | --- |
| macOS (Apple Silicon) | `FocusDesk-96-1.0.0-arm64.dmg` |
| macOS (Intel) | `FocusDesk-96-1.0.0-x64.dmg` |
| Windows | `FocusDesk-96-Setup-1.0.0.exe` |
| Linux | `FocusDesk-96-1.0.0.AppImage` |

## First launch

These builds are unsigned. That's normal for indie software and doesn't mean anything is wrong.

- **macOS:** after dragging the app to Applications, open Terminal and run:
xattr -cr "/Applications/FocusDesk 96.app"
codesign --force --deep --sign - "/Applications/FocusDesk 96.app"
xattr -cr "/Applications/FocusDesk 96.app"
Then open it normally. You only need to do this once.
- **Windows:** if SmartScreen appears, click **More info → Run anyway**.
- **Linux:** make the file executable with `chmod +x FocusDesk-96-1.0.0.AppImage`, then run it.

## Your data

- **macOS:** `~/Library/Application Support/FocusDesk 96/`
- **Windows:** `%APPDATA%\FocusDesk 96\`
- **Linux:** `~/.config/FocusDesk 96/`

Use **File → Open Backups Folder** in the app to jump there. API keys for the AI assistant are stored unencrypted in `keys.json` in that folder, so keep it private.

## Moving from the browser version

In the browser version, open Control Panel and save a backup file. In the desktop app, use Control Panel → Restore from file.
