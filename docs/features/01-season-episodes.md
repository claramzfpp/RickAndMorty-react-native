# 01 — Season episodes screen

- **Branch:** `feat/01-season-episodes`
- **Depends on:** 00
- **Design reference:** `docs/design/season-episodes.png` (header and layout only; row content deviates, see below)

## Goal

Tapping a season card opens a screen listing every episode of that season with its air date.

## Out of scope

- Episode details screen, episode characters.
- Seasons 6-9 (cards are disabled; the API has no data).

## Read first

- `docs/ui-guidelines.md` (Lists, "Season episodes: deviation from the design")
- `components/season+episodes/seasonViewModel.ts` (pattern), `components/locationsCarousel/LocationCard.tsx` (title/subtitle style)

## Contracts

Consumes `EpisodeRepository` (`loadAllEpisodes`, `getEpisodesBySeason(season)`) via `getEpisodeRepository()`. Route: `app/(features)/seasons/[season].tsx` created by 00.

```ts
export type SeasonEpisodesScreenUIState =
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | { status: 'loaded'; season: number; episodes: Episode[] };
```

## Allowed files

Create:
- `components/season+episodes/EpisodeRow.tsx`
- `components/season+episodes/seasonEpisodesScreenViewModel.ts` — `useSeasonEpisodesScreenViewModel(repository, season)`
- `components/season+episodes/seasonEpisodesScreenUIState.ts`

Modify:
- `app/(features)/seasons/[season].tsx` — replace the stub

## Behavior

1. Header: back button + title "Season N" (green, 22px) and subtitle "X episodes" (secondary, 12px), as in the PNG.
2. Scrollable list (`FlatList`), one `EpisodeRow` per episode ordered by `episodeNumber`.
3. `EpisodeRow` (not pressable): a 36x36 circle (`Surfaces.surface` (`@/constants/Surfaces`)) containing a TV icon (`SymbolView`: ios `tv.fill`, android `tv`, web `tv`, green), then a vertical text block: **title** = episode name (bold 15, brown), **subtitle** = `airDate` as returned by the API (11px, weight 500, `rgb(95, 99, 100)`). Bottom divider 1px `Surfaces.border` (`@/constants/Surfaces`). Same title/subtitle look as `LocationCard`.
4. The view model calls `loadAllEpisodes()` only when `repository.episodes` is empty, then `getEpisodesBySeason(season)`. Never call it otherwise: it has no concurrency guard and appends duplicates if called twice (known debt, do not fix here).
5. `season` param: parse with `Number`; if not an integer >= 1, or the season has no episodes, show the error state with a clear message (do not crash).
6. Loading: `ActivityIndicator`. Error: message + "Try again" that re-runs the load.

## Acceptance criteria

- [ ] `npx tsc --noEmit` clean.
- [ ] Only the files under **Allowed files** changed.
- [ ] Invalid `season` param and empty season both resolve to the error state in the view model (no throw).
- [ ] Loading, error (with retry), and loaded states are all rendered.

## Commit plan

1. `feat: add season episodes view model and UI state`
2. `feat: add EpisodeRow component`
3. `feat: build season episodes screen`
