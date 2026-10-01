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
| 05 | [Card navigation wiring](features/05-card-navigation.md) — **optional, edits existing files, needs owner approval** | 00 | on hold |

## Phases

1. **Phase 0 (alone):** run 00, review, merge to `main`. Rebuild the dev client (new native module).
2. **Phase 1 (parallel, 4 worktrees):** create worktrees from the updated `main`, one agent each for 01, 02, 03, 04. Merge in any order.
3. **Final check (you):** favorite in 02, see it in 04, restart the app, confirm persistence.

## Why these can run in parallel

Allowed files of 01-04 do not overlap: each owns its own folder plus exactly one route file. Everything shared (repository interface, composition, color tokens file, route stubs) is done by 00. Card `onPress` wiring is the only edit to existing UI files and lives alone in 05.

## Known follow-ups (not specs yet)

- The Pencil frame for Season Episodes still shows a number badge and no date; update the design to match the product decision.
- Episode details and location residents exist in the Pencil file but are not planned.
- Tests and lint are not set up (study project); see `docs/technical-debt.md`.
