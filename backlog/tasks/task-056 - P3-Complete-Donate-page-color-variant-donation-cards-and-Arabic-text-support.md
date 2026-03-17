---
id: TASK-056
title: >-
  [P3] Complete Donate page: color-variant donation cards and Arabic text
  support
status: Done
assignee: []
created_date: '2026-03-17 11:17'
updated_date: '2026-03-17 12:21'
labels:
  - P3
  - page-migration
  - donate
milestone: m-3
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The Donate page needs color-variant donation cards and Arabic text support. Depends on TASK-049 (ColoredBorderCard).

From al-hayaat.webflow/donate.html:
1. donate-header-wrapper: Centered title, max-width 46.75rem.
2. donate-card-container: Flex column, gap 1.5rem, each donate-card is a ColoredBorderCard.
   - Each card: border 1px #d9d9d9, border-radius 1.25rem, padding 1.75rem, colored bottom border 0.625rem
   - donate-card-text-wrap: flex row, gap 0.5rem
   - icon-embed-donate: 1.25rem x 1.25rem centered icon
   - Variants: is-yellow, is-orange, is-blue, is-green, is-red
3. Arabic text block: text-arabic class, font Amiri Quran, font-size 2rem, direction RTL, opacity-80 variant
4. text-size-24 variant: 1.5rem font size for Quranic/Arabic content

Files: src/app/donate/page.tsx, src/content/donate.json.
Dependencies: TASK-049 (ColoredBorderCard), TASK-052 (Amiri Quran font)
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Donate page renders ColoredBorderCards with is-yellow, is-orange, is-blue, is-green variants for each donation type
- [ ] #2 Each card has icon-embed-donate (1.25rem icon), heading, and description text
- [ ] #3 Arabic text block renders with Amiri Quran font, 2rem size, RTL direction
- [ ] #4 Donation amount preset buttons render with correct button styling
- [ ] #5 All donate page text sourced from src/content/donate.json including Arabic content
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Rewrote src/app/donate/page.tsx. Sections: hero with Arabic Quranic verse, two-column layout with 5 payment method ColoredBorderCards (yellow/orange/blue/green/red), and DonationForm. Arabic text rendered via .text-arabic class with Amiri font from globals.css.
<!-- SECTION:FINAL_SUMMARY:END -->
