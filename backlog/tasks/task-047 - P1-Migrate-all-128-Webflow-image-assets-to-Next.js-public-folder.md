---
id: TASK-047
title: '[P1] Migrate all 128 Webflow image assets to Next.js public folder'
status: Done
assignee: []
created_date: '2026-03-17 11:13'
updated_date: '2026-03-17 11:38'
labels:
  - assets
  - P1
  - images
milestone: m-1
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The Webflow source has 128 image assets in `al-hayaat.webflow/images/` that are referenced throughout all pages. The Next.js `public/` folder currently only has the logo and generic Next.js placeholders. No page can achieve visual fidelity until images are available.

**Action:**
- Copy all 128 images from `al-hayaat.webflow/images/` → `public/images/`
- Key images identified across pages:
  - `glitter-bg.webp`, `dashlines.webp`, `Framedots.webp` (home hero backgrounds)
  - `islam-written.webp` (home feature section)
  - `MUN03197-3241.png` (home teacher photo)
  - `MUN03200-1.png`, `MUN03349-1.png`, `MUN03448-1.png`, `MUN03541-1.png`, `MUN03667.png`, `MUN03627.png` (about page carousel)
  - `decor-about-1.webp`, `decor-about-2.webp` (about hero decorations)
  - `al-hayaat-logo-img.png` (nav logo)
  - `list-check.svg` (school plans bullet icon)
  - `Polygon-46.svg` (about page tab indicator)
  - All `-p-500.png`, `-p-800.png`, `-p-1080.png`, `-p-1600.png`, `-p-2000.png` responsive variants
- Update `src/content/*.json` image references to use `/images/` path prefix
- Verify `next/image` domains config in `next.config.ts` allows local static assets (should work by default)
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 All 128 images copied to public/images/ with exact filenames preserved
- [ ] #2 next/image components referencing /images/* resolve without 404
- [ ] #3 Logo renders in the navigation bar
- [ ] #4 Hero background images render on home page
- [ ] #5 No broken image icons visible on any page
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Copied 128 Webflow assets from `al-hayaat.webflow/images/` into `public/images/` and updated shared logo usage to point at the migrated asset path.
<!-- SECTION:FINAL_SUMMARY:END -->
