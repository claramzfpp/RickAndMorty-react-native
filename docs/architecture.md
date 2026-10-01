# Architecture

Summary lives in `AGENTS.md`. This file is the detailed map. Read it before creating any file.

## Folder map (real, current)

```
app/                                   Routes (expo-router). Composition only, no logic.
  _layout.tsx                          Root Stack; (tabs) has headerShown: false
  (tabs)/                              Tab screens: index.tsx (Discover), favoritesView.tsx
  (features)/characters/index.tsx      "See all" characters grid
  (features)/locations/index.tsx       "See all" locations grid
components/<feature>/                  Presentation: views (.tsx), view models (use*ViewModel), UI state types
components/shared/                     Reusable UI (Themed, SearchBar, SearchStateViews, Header*, GenericCarousel...)
hooks/                                 Generic hooks (useDebouncedValue, usePaginatedSearch)
constants/                             Colors.ts, Header.ts
services/
  domain/model/                        Entities + value objects (Character, CharacterId, Episode, Location, PagedResult)
  domain/model/__mocks__/              Mock data for previews
  domain/repository/                   Repository INTERFACES
  data/remote/<resource>/              API DTOs (RMCharacter, GetAllCharactersResponse...), HttpError, ApiConfig
  data/mapper/                         DTO -> domain entity
  data/repositoryImplementation/       Repository implementations (fetch)
  data/pagination/                     parseNextPage
  composition/repositories.ts          getXRepository() singletons: the ONLY place interface -> implementation is wired
```

## Data flow

```
API JSON -> DTO (RM*) -> Mapper -> Domain entity -> Repository (interface)
        -> ViewModel hook (use*ViewModel) -> UIState -> View (.tsx) -> Route (app/)
```

- A View never calls `fetch` and never imports from `services/data`.
- A ViewModel receives a repository **interface as a parameter** (see `useCharacterListViewModel(characterRepository)`); the route obtains it from `services/composition/repositories.ts`.
- UI state is a discriminated union: `{ status: 'loading' } | { status: 'error'; message } | { status: 'loaded'; ... }`.

## Recipe: add a new repository method

1. Add the signature (with a one-line contract comment: what it resolves/rejects with) to the interface in `services/domain/repository/`.
2. Add/extend the DTO in `services/data/remote/` if the response shape is new.
3. Map DTO -> entity in `services/data/mapper/`.
4. Implement in `services/data/repositoryImplementation/`; throw `HttpError(response.status)` for non-OK responses.
5. Expose it only through the interface; nothing else changes in `composition/`.

## Recipe: add a new repository (e.g. local storage)

1. Interface in `services/domain/repository/`.
2. Implementation in `services/data/repositoryImplementation/`.
3. Add `getXRepository()` singleton in `services/composition/repositories.ts`, same pattern as the existing three.

## Recipe: add a new screen

1. Create the route file in `app/(features)/<area>/...` (thin: gets repo, calls view model, renders view).
2. Create `components/<feature>/` with `<name>ViewModel.ts`, `<name>UIState.ts`, and the view `.tsx`.
3. Header: follow `app/(features)/characters/index.tsx` (`Stack.Screen` options, `headerBackButtonItem`, transparent header).

## Domain notes

- `Character` and `Location` are plain interfaces today; `Episode` is a class with a private constructor and `Episode.fromCode(...)`. Do not convert existing ones as a side effect of a feature.
- IDs are value objects (`CharacterId`, `LocationId`, `EpisodeId`) that throw on invalid input. Route params arrive as strings: validate with `Number(...)` and handle the thrown error as an error UI state.
- `EpisodeRepository` is load-all-then-query: call `loadAllEpisodes()` first when `episodes` is empty.
