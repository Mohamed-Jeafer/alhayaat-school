---
id: TASK-071
title: >-
  [BUG] Body font mismatch — Webflow uses IBM Plex Sans, Next.js uses Nunito for
  body text
status: To Do
assignee: []
created_date: '2026-03-17 22:22'
labels: []
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Webflow CSS body font-family: IBM Plex Sans, sans-serif. Next.js layout.tsx assigns --font-body = Nunito and globals.css applies body { font-family: var(--font-body) } = Nunito. IBM Plex Sans IS loaded in layout.tsx as --font-base but is not applied to body.

REQUIRED CHANGES to src/app/globals.css:
- Change body font-family from var(--font-body) to var(--font-base) to use IBM Plex Sans
- OR swap the font variable assignments in layout.tsx: make bodyFont = IBM_Plex_Sans and baseFont = Nunito

The Webflow font stack:
- body: IBM Plex Sans (weight 400, 500, 600, 700)
- h1 in hero: Open Sans (via .heading-style-h1 class, 4rem, font-weight 600)
- default h1/h2 headings: Dongle (display font)
- some UI elements: Nunito, Inter

In Next.js globals.css currently:
- body: var(--font-body) = Nunito ← should be IBM Plex Sans
- h1/h2: var(--font-display) = Dongle ✓
- .heading-style-h1/h2/h3: var(--font-heading) = Open Sans ✓

Fix: In globals.css change body font-family from var(--font-body) to var(--font-base).
<!-- SECTION:DESCRIPTION:END -->
