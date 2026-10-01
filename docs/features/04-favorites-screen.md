# 04 — Favorites screen

- **Branch:** `feat/04-favorites-screen`
- **Depends on:** 00
- **Design reference:** `docs/design/favorites.png`, `docs/design/all-characters.png`

## Goal

The Favorites tab fetches the characters whose ids the user saved and shows them in the same 2-column grid used by "See all characters".

## Out of scope

- The favorite toggle itself (spec 02).
- Removing favorites from this screen.
- Search inside favorites.

## Read first

- `docs/ui-guidelines.md` (Favorites grid, States)
- `app/(features)/characters/index.tsx` (grid: `numColumns={2}`, `CharacterCard` with `CharacterCellSize.Grid`, shared state views)

## Contracts

Consumes `getFavoritesRepository().getFavoriteIds()` and `getCharacterRepository().getCharactersByIds(ids)` (both from 00).

```ts
export type FavoritesUIState =
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | { status: 'empty' }
    | { status: 'loaded'; characters: Character[] };

useFavoritesViewModel(favorites: FavoritesRepository, characters: CharacterRepository) // { state, reload }
```

## Allowed files

Create:
- `components/favorites/favoritesViewModel.ts`
- `components/favorites/favoritesUIState.ts`
- `components/favorites/FavoritesView.tsx`

Modify:
- `app/(tabs)/favoritesView.tsx` — replace the placeholder with the real screen

## Behavior

1. Title "Favorites" and a subtitle "N characters saved" (singular for 1), as in the PNG.
2. Reload **every time the tab gains focus** (`useFocusEffect` from `expo-router`), so a heart toggled in character details is reflected immediately. Do not show a full-screen spinner on re-focus when data is already displayed; only on the first load.
3. Flow: `getFavoriteIds()`; if empty -> `empty` without any request; otherwise `getCharactersByIds(ids)`.
4. Order: most recently favorited first (reverse of the stored order; the repository returns ids in insertion order).
5. Grid: 2 columns, `CharacterCard` (`CharacterCellSize.Grid`); pressing a card navigates to `/characters/<id>`. Bottom padding = `TAB_BAR_OCCUPIED_HEIGHT` (exported by `components/shared/CustomTabBar.tsx`) plus the bottom safe-area inset. Tabs have no header, so add the top safe-area inset (`useSafeAreaInsets`) above the title.
6. Empty state: "No favorites yet" / "Tap the heart on a character to save it."
7. Error state with "Try again" calling `reload`. Ids the API no longer knows are omitted (the repository handles it); the subtitle count reflects what is shown.

## Acceptance criteria

- [ ] `npx tsc --noEmit` clean.
- [ ] Only the files under **Allowed files** changed.
- [ ] Empty id list resolves to the `empty` state without calling `getCharactersByIds`.
- [ ] The data reloads on every focus without a full-screen spinner when data is already shown.
- [ ] Loading, error (with retry), empty, and loaded states are all rendered.

## Commit plan

1. `feat: add favorites view model and UI state`
2. `feat: build favorites screen`
