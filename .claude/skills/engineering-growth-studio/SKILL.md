---
name: engineering-growth-studio
description: >-
  Launch or maintain a local React app for leveling up engineering through legally accessible technical reading, curated learning paths, practice projects, and progress tracking. Use this when the user asks for engineering growth, technical reading, demo projects, local ebooks/documents, or references /engineering-growth-studio.
---

# Engineering Growth Studio

Launch the local React app for private, browser-based engineering growth through technical reading and hands-on project practice.

Usage: `/engineering-growth-studio`

App launcher:
`.claude\skills\engineering-growth-studio\app\Invoke-EngineeringGrowthStudio.ps1`

## Scope and safety

- Do not help bypass DRM, strip copy protection, or access books the user is not authorized to read.
- The app supports local DRM-free or user-owned files such as EPUB, PDF, TXT, HTML, and Markdown.
- If the user asks about Amazon Kindle AZW/KFX/MOBI files, explain that encrypted Kindle purchases are not supported and suggest using Amazon's official Kindle apps or a legitimately exported DRM-free format.
- Keep reading local-first: do not upload book files to third-party services.

## Workflow

1. Run the launcher script:

```powershell
& '.claude\skills\engineering-growth-studio\app\Invoke-EngineeringGrowthStudio.ps1'
```

2. If dependencies are missing, the launcher installs them with `npm install`.
3. The launcher starts the Vite dev server and opens the app in the browser.

## Reporting

- If Node.js or npm is missing, tell the user to install Node.js LTS and rerun the skill.
- If the launcher succeeds, tell the user: `Engineering Growth Studio launched in your browser.`
- If the launcher fails, surface the actual failure and do not invent fallback results.

## Notes

- The skill should stay thin. Put reader behavior in the React app, not in this prompt.
- Book contents stay in the browser memory/session; the app does not persist imported files.
