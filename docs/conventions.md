# Conventions

Copy the closest existing file instead of inventing a new pattern.

## Reference files

| Need | Copy from |
|---|---|
| Paginated list view model + UI state | `components/characters/charactersCarousel/characterListViewModel.ts`, `characterListUIState.ts` |
| Single-resource load view model | `components/season+episodes/seasonViewModel.ts` (cancel flag in `useEffect`, error -> `message`) |
| Full screen with transparent header + back button | `app/(features)/characters/index.tsx` |
| Card with press feedback | `components/characters/CharacterCard.tsx`, `components/locationsCarousel/LocationCard.tsx` |
| Loading / empty / error views | `components/shared/SearchStateViews.tsx` |
| Domain value object | `services/domain/model/CharacterId.ts` |

## Naming and files

- View models: `use<Thing>ViewModel` in `<thing>ViewModel.ts` (camelCase file). UI state: `<thing>UIState.ts`.
- Components: PascalCase file = component name. Props interface `<Component>Props`.
- Imports use the `@/` alias, not relative paths (except inside `services/`, which uses relative).
- Domain repository methods carry a one-line comment stating resolve/reject behavior (see existing interfaces).

## React / TypeScript

- Functional components + hooks only. No `any`. No non-null `!` to silence errors.
- Async effects use an `isCancelled` flag and cleanup, as in the existing view models.
- Errors: `error instanceof Error ? error.message : 'Unknown error'`. Surface them in UI state; never swallow.
- Every screen handles: loading, error (with retry where it makes sense), empty, loaded.
- Previews: components may end with `if (__DEV__) { preview(...) }` using `radon-ide` and `__mocks__` data, as existing cards do. Optional for new screens.
- Comments explain WHY only. No JSDoc until the separate `docs:` pass (see `AGENTS.md`).

## Styling

- `StyleSheet.create` at the bottom of the file. Colors from `@/constants/Colors` (`Colors.light.*`), not hardcoded hex, unless a token is missing and the spec says otherwise.
- Use `Themed` `Text`/`View` from `components/shared/Themed` only where the surrounding screens do.
- Icons: `SymbolView` from `expo-symbols` with `{ ios, android, web }` names (see `LocationCard`).
