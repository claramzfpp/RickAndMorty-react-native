# Roadmap

For the human orchestrating agents (e.g. in Orca). Agents do not need this file.

## Specs

| ID | Spec | Depends on | Status |
|---|---|---|---|
| 00 | [Foundation](features/00-foundation.md) | none | todo |
| 01 | [Season episodes](features/01-season-episodes.md) | 00 | todo |
| 02 | [Character details + favorite](features/02-character-details.md) | 00 | todo |
| 03 | [Location details](features/03-location-details.md) | 00 | todo |
| 04 | [Favorites screen](features/04-favorites-screen.md) | 00 | todo |
| 05 | [Card navigation wiring](features/05-card-navigation.md) — edits existing files (onPress only), own small PR | 00 | todo |

## Phases

1. **Phase 0 (alone):** run 00, review, merge to `main`. Rebuild the dev client (new native module).
2. **Phase 1 (parallel, 5 worktrees):** create worktrees from the updated `main`, one agent each for 01, 02, 03, 04, 05. Each is its own PR. Merge 05 early: it is tiny, and without it no card opens the new screens, so manual testing of 01-03 needs it.
3. **Final check (you, manual):** all UI and behavior checks, e.g. favorite in 02, see it in 04, restart the app, confirm persistence. Fix visual inconsistencies by hand.

## Decisions

- Only characters can be favorited; locations cannot.
- Seasons 6-9 have no API data: their cards stay disabled (no navigation).
- Agents are Claude Code; `AGENTS.md` explicitly overrides the global TDD rules.

## Why these can run in parallel

Allowed files of 01-05 do not overlap: each owns its own folder plus exactly one route file. Everything shared (repository interface, composition, color tokens file, route stubs) is done by 00. Card `onPress` wiring is the only edit to existing UI files and lives alone in 05 (its files are disjoint from 01-04).

## Known follow-ups (not specs yet)

- Intentional duplication between parallel specs, candidates for a later `refactor:`: info tiles (`components/characters/details/InfoTile.tsx` vs `components/locationsCarousel/details/LocationInfoTile.tsx`), the location `type` -> icon mapping (copied from `LocationCard`), and the details-screen sheet/accent-bar layout.

- The Pencil frame for Season Episodes still shows a number badge and no date; update the design to match the product decision.
- Episode details and location residents exist in the Pencil file but are not planned.
- Tests and lint are not set up (study project); see `docs/technical-debt.md`.
