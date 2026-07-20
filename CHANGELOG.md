# Changelog

This retrospective milestone log preserves the useful product history without freezing bundle sizes, test counts, or vocabulary totals that change as the project evolves.

## M7 - Reliable round completion

- Added an explicit end-of-round choice to replay the current round or continue to the next one.
- Fixed rapid repeated grading that could skip cards, progress leaking when switching profiles, seed refreshes overwriting imported words, unbounded imports, and keyboard focus reaching the hidden side of a card.
- Added code splitting and lazy loading for the import panel.

## M6 - Delivery and portability

- Added the Band 9 tier, calendar month navigation, and CSV / Anki text export.
- Added root-level CI for builds and tests.
- Added GitHub Pages deployment from the generated `dist/` artifact.

## M5 - Broader study modes

- Expanded the checked-in Band-graded vocabulary data while retaining earlier seed entries.
- Added “due only” and “all in this band” review modes, including a recovery path when no cards are currently due.
- Added data-invariant tests for vocabulary quality and Band coverage.

## M4 - Session-based review

- Added configurable study batches and session rounds.
- Returned `again` and `hard` cards to later rounds while allowing `good` and `easy` cards to leave the active pool.
- Added the persistent study calendar and immediate daily study logging.

## M3 - Import and study experience

- Added CSV and Anki text import with validation, rejected-row reporting, and injection screening.
- Added pronunciation, a virtualized vocabulary list, an import dialog, and reduced-motion-aware flashcard transitions.

## M2 - Local persistence

- Added Band-graded seed vocabulary.
- Moved vocabulary and scheduling state into Dexie-backed IndexedDB for local-first persistence.

## M1 - Scheduling foundation

- Established the React, TypeScript, and Vite application structure and vocabulary pipeline.
- Integrated `ts-fsrs` behind a dedicated service with tests for scheduling behavior.
