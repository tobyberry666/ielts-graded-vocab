# Third-Party Data Notices

This repository includes generated vocabulary data assembled from original entries and third-party sources. This notice records the provenance and license information verified for those sources. It is not legal advice and does not make conclusions beyond the facts stated below.

## ECDICT

- Upstream source: [skywind3000/ECDICT](https://github.com/skywind3000/ECDICT)
- Entry points: `scripts/enrich_ecdict.py` and `scripts/enrich_full.py` read ECDICT data.
- Generated or derived content: ECDICT-derived material may appear in `src/data/words.ts` and `src/data/seed-bulk.ts`.
- Verified license information: the upstream ECDICT repository includes the MIT License and identifies the copyright holder as Linwei, copyright 2025. That MIT license covers ECDICT material under its terms.

## dictionaryapi.dev / freeDictionaryAPI

- Service: [dictionaryapi.dev](https://dictionaryapi.dev/)
- Service implementation: [meetDeveloper/freeDictionaryAPI](https://github.com/meetDeveloper/freeDictionaryAPI)
- Entry points: `scripts/enrich-bulk.mjs`, `scripts/enrich_ecdict.py`, and `scripts/enrich_full.py` consume output from dictionaryapi.dev, directly or through cached data.
- Generated or derived content: dictionaryapi.dev-derived definitions, phonetics, examples, and sense data may appear in `src/data/words.ts` and `src/data/seed-bulk.ts`.
- Verified license information: the freeDictionaryAPI implementation repository is licensed under GPL-3.0. That license applies to the API implementation and does not by itself establish a license for all dictionary content returned by the service. No separate license for redistribution of all returned dictionary content was identified during the provenance audit.

## Youdao

- Upstream service endpoint: [Youdao Dictionary JSON API](https://dict.youdao.com/jsonapi)
- Entry point: `scripts/enrich_full.py` consumes Youdao JSON API definitions and bilingual examples.
- Generated or derived content: Youdao-derived definitions and examples may appear in `src/data/words.ts` and `src/data/seed-bulk.ts`.
- Verified license information: no express redistribution license for this derived content was identified in this repository or during the provenance audit. Redistribution rights for Youdao-derived content therefore remain unverified.

## Combined Distribution

The generated files `src/data/words.ts` and `src/data/seed-bulk.ts` combine original entries with material from the sources described above. This repository currently provides no blanket license grant for the combined source and data distribution. Users must evaluate the applicable third-party terms and obtain any permissions they require before redistributing third-party or combined content.
