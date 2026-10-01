# 02 — Character details + favorite button

- **Branch:** `feat/02-character-details`
- **Depends on:** 00
- **Design reference:** `docs/design/character-details.png`

## Goal

Tapping a character opens a details screen with the photo, the character's data, and a button to add/remove the character from favorites. Favorites persist between sessions (only the id is stored).

## Out of scope

- The Favorites tab screen (spec 04).
- Episodes/location of the character.
- Any change to repository code (00 owns it).

## Read first

- `docs/ui-guidelines.md` ("Details screen anatomy")
- `app/(features)/characters/index.tsx` (header pattern), `components/characters/StatusPill.tsx`, `components/shared/HeaderCircleButton.tsx`

## Contracts

Consumes `getCharacterRepository().getCharacterById(id)` and `getFavoritesRepository()` (`isFavorite`, `add`, `remove`).

```ts
export type CharacterDetailsUIState =
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | { status: 'loaded'; character: Character; isFavorite: boolean };

// returns { state, toggleFavorite, retry }
useCharacterDetailsViewModel(characters: CharacterRepository, favorites: FavoritesRepository, rawId: string)
```

## Allowed files

Create:
- `components/characters/details/CharacterDetailsView.tsx`
- `components/characters/details/InfoTile.tsx`
- `components/characters/details/characterDetailsViewModel.ts`
- `components/characters/details/characterDetailsUIState.ts`
- `components/characters/details/FavoriteButton.tsx`

Modify:
- `app/(features)/characters/[id].tsx` — replace the stub

## Behavior

1. Layout follows the PNG: hero photo (`character.image`, cover), floating back button (top-left), floating favorite button (top-right), bottom sheet with name + `StatusPill`, then three `InfoTile`s: Species, Gender, Origin. Accent bar at the bottom.
2. `rawId` -> `new CharacterId(Number(rawId))`; if it throws (non-numeric, <= 0) go to the error state.
3. Load character and `isFavorite` together; show `loading` until both resolve.
4. `FavoriteButton`: heart outline when not favorite, filled pink heart when favorite (`SymbolView` `heart` / `heart.fill`; android `favorite_border` / `favorite`). Accessibility label "Add to favorites" / "Remove from favorites".
5. `toggleFavorite` updates the UI optimistically, then calls `add`/`remove`. If the call fails, roll back the UI and surface the failure (inline message or `Alert`); do not swallow it. Ignore taps while a toggle is in flight.
6. Error state shows the message and a "Try again" button calling `retry`.

## Acceptance criteria

- [ ] `npx tsc --noEmit` clean.
- [ ] Opening a character shows photo, name, status, species, gender, origin matching the data from the list.
- [ ] Tapping the heart fills it; fully closing and reopening the app and revisiting the same character shows it still filled (persistence).
- [ ] Tapping again clears it, also persisted.
- [ ] `/characters/abc` and `/characters/999999` show the error state, no crash.
- [ ] Rapid double-tap on the heart leaves a consistent state (no duplicate or lost entry).

## Commit plan

1. `feat: add character details view model and UI state`
2. `feat: add character details view components`
3. `feat: build character details screen with favorite toggle`
