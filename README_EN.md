[中文](README.md)

# IELTS Graded Vocab

A local-first vocabulary trainer for IELTS learners. Choose Band 5-9 graded vocabulary, let FSRS schedule reviews, and keep study progress in the current browser. The app works without an account and can import or export vocabulary as CSV or Anki text.

- [Live Demo](https://tobyberry666.github.io/ielts-graded-vocab/)
- [CI](https://github.com/tobyberry666/ielts-graded-vocab/actions/workflows/ci.yml)
- [Changelog](CHANGELOG.md)

## Core capabilities

- Band 5-9 graded vocabulary with “due only” and “all in this band” study scopes.
- Two-sided flashcards and `again`, `hard`, `good`, and `easy` grades, with FSRS calculating the next review time.
- Batched study, round replay or continuation, and a mastered-word action.
- Multiple local profiles with isolated card progress, mastered words, and study calendars.
- CSV and Anki text import/export; imports use required-field checks, a Band allowlist, and injection screening.
- Chinese and English meanings, examples, collocations, and pronunciation when the entry provides the required data.

## Design and architecture

```text
React UI
  |-- Word / Session / Import / Pronunciation services
  |-- SrsService -> ts-fsrs
  `-- VocabRepository -> Dexie / IndexedDB
                         `-- checked-in Band vocabulary data
```

`SrsService` encapsulates `ts-fsrs` without owning UI or persistence. Session orchestration and import processing also live in focused services. `VocabRepository` hides IndexedDB details from higher layers and scopes cards, study calendars, and mastered state by profile. These boundaries keep core rules testable without the UI.

The app is local-first: vocabulary and study state are stored in browser IndexedDB, with no remote account or application backend required. CSV and Anki import/export can move custom vocabulary, but the current exports do not include profiles, study calendars, or FSRS progress.

## Run locally

CI uses Node.js 20. Run from the repository root:

```bash
git clone https://github.com/tobyberry666/ielts-graded-vocab.git
cd ielts-graded-vocab
npm ci
npm run dev
```

Create a production build with:

```bash
npm run build
```

## Tests and CI

```bash
npm test
npm run build
```

Key tests exercise FSRS grading and due-date behavior, session rounds, Band and due-card filtering, import validation, profile isolation and IndexedDB migrations, calendar date boundaries, vocabulary data invariants, and pronunciation selection. The README intentionally does not freeze a test count or coverage percentage; use the current CI result instead.

The CI workflow runs `npm ci`, `npm run build`, and `npm test` from the repository root on pushes to `master` and pull requests targeting `master`. On `master` updates or manual dispatch, the Pages workflow also builds from the root and deploys the generated `dist/` directory as a Pages artifact. Users do not manually push `app/dist` or maintain a `gh-pages` branch.

## Data and licensing boundary

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for vocabulary sources, derived-data scope, and verified license information. This repository grants no blanket license for the combined code and data distribution. Before redistributing it, evaluate the applicable third-party terms and obtain any permissions you need.

## Known limitations

- Study state exists only in the current browser's storage for this site. A different device or browser, cleared site data, or a temporary browsing session will not restore it automatically.
- Local profiles are not cloud accounts, and the project currently provides no cross-device synchronization.
- CSV and Anki import/export can move vocabulary, but cannot back up or restore profiles, study calendars, or FSRS progress.
- Pronunciation availability depends on entry data, browser capabilities, and network conditions.
