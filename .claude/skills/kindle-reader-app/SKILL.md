---
name: kindle-reader-app
description: >-
  Launch or maintain a local React reader app for legally accessible Kindle-related books and documents. Use this when the user asks to read Kindle books, local ebooks, EPUB/PDF/TXT files, or references /kindle-reader-app.
---

# Kindle Reader App

Launch the local React reader app for private, browser-based reading of legally accessible ebook files.

Usage: `/kindle-reader-app`

App launcher:
`.claude/skills/kindle-reader-app/app/Invoke-KindleReaderApp.ps1`

## Scope and safety

- Do not help bypass DRM, strip copy protection, or access books the user is not authorized to read.
- The app supports local DRM-free or user-owned files such as EPUB, PDF, TXT, HTML, and Markdown.
- If the user asks about Amazon Kindle AZW/KFX/MOBI files, explain that encrypted Kindle purchases are not supported and suggest using Amazon's official Kindle apps or a legitimately exported DRM-free format.
- Keep reading local-first: do not upload book files to third-party services.

## Workflow

1. Run the launcher script:

```powershell
& '.claude\skills\kindle-reader-app\app\Invoke-KindleReaderApp.ps1'
```

2. If dependencies are missing, the launcher installs them with `npm install`.
3. The launcher starts the Vite dev server and opens the app in the browser.

## Reporting

- If Node.js or npm is missing, tell the user to install Node.js LTS and rerun the skill.
- If the launcher succeeds, tell the user: `Kindle reader app launched in your browser.`
- If the launcher fails, surface the actual failure and do not invent fallback results.

## Notes

- The skill should stay thin. Put reader behavior in the React app, not in this prompt.
- Book contents stay in the browser memory/session; the app does not persist imported files.
