# Third-Party Notices

FocusDesk 96 is released under the MIT License (see `LICENSE`). The FocusDesk 96 code has no runtime dependencies: the browser version is plain HTML, CSS, and JavaScript with no libraries from other projects. The Desktop Edition adds KaTeX for math (listed below).

The Desktop Edition is packaged with the following third-party software.

## Shipped inside the Desktop Edition

**Electron** (MIT License)
Copyright (c) Electron contributors. Copyright (c) 2013-2020 GitHub Inc.
https://github.com/electron/electron

Electron includes **Chromium** and its own third-party components, which are licensed under their respective open-source licenses. The complete notices are included with every installed copy of the Desktop Edition in the files `LICENSE` and `LICENSES.chromium.html` in the application folder.

**KaTeX** (MIT License), including its chemistry extension (mhchem) and math fonts
Copyright (c) 2013-2020 Khan Academy and other contributors.
https://github.com/KaTeX/KaTeX

The Desktop Edition renders math with KaTeX. A copy of its license is included with the app in `vendor/katex/LICENSE`. The Browser Edition uses FocusDesk's own built-in math renderer and does not include KaTeX.

## Used only to build the installers (not shipped)

These tools are used on the developer's machine and in GitHub Actions. They are not part of the installed application.

* **electron-builder** (MIT License). Builds the macOS, Windows, and Linux installers. https://github.com/electron-userland/electron-builder
* **sharp** (Apache License 2.0). Resizes the application icon during the build. https://github.com/lovell/sharp

## Services contacted at the user's request

FocusDesk 96 can contact third-party web services when You use features that need them (the update check, dictionary and Research lookups, and the optional AI assistant). Those services are not part of FocusDesk 96 and are governed by their own terms. See Section 3.4 of `TERMS.md` for the list.

## FocusDesk 96 brand assets

The names "FocusDesk 96," "Apoji Studios," and "Apoji Delegraphics," the Apoji logo, and the application icon are described in Section 2.2 of `TERMS.md`.
