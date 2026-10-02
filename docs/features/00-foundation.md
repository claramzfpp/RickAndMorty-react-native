# 00 — Foundation (favorites data layer, route stubs, shared tokens)

- **Branch:** `feat/00-foundation`
- **Depends on:** none. **Run alone and merge before any other spec.**
- **Design reference:** none

## Goal

Create everything the feature specs share so that 01-04 never edit the same files: the favorites persistence layer, a batch character lookup, the route stubs, and two color tokens in a **new** file. This spec edits no existing screen or UI component.

## Out of scope

- The real UI of any details/episodes/favorites screen (specs 01-04 replace the stubs).
- Installing packages: `@react-native-async-storage/async-storage` (2.2.0) is already in `package.json`. Do not touch `package.json` or the lockfile.

## Read first

- `AGENTS.md`, `docs/architecture.md` (both recipes), `docs/conventions.md`

## Contracts

New domain interface, `services/domain/repository/FavoritesRepository.ts`:

```ts
export interface FavoritesRepository {
    // resolves to [] when nothing has been saved yet
    getFavoriteIds(): Promise<CharacterId[]>;
    isFavorite(id: CharacterId): Promise<boolean>;
    // idempotent: adding an existing id keeps a single entry
    add(id: CharacterId): Promise<void>;
    // idempotent: removing an absent id is a no-op
    remove(id: CharacterId): Promise<void>;
}
```

Extend `services/domain/repository/CharacterRepository.ts`:

```ts
// resolves to [] for an empty list without any request; ids unknown to the API are omitted
getCharactersByIds(ids: CharacterId[]): Promise<Character[]>;
```

New composition getter: `getFavoritesRepository(): FavoritesRepository` in `services/composition/repositories.ts`.

New tokens file, `constants/Surfaces.ts`: `export const Surfaces = { surface: '#E9E6DF', border: '#BFBCB7' } as const;`

Route contracts (all params are strings in the URL; navigation from existing cards is wired separately in spec 05):

| Route file | URL |
|---|---|
| `app/(features)/characters/[id].tsx` | `/characters/<id>` |
| `app/(features)/locations/[id].tsx` | `/locations/<id>` |
| `app/(features)/seasons/[season].tsx` | `/seasons/<season>` |

## Allowed files

Create:
- `services/domain/repository/FavoritesRepository.ts`
- `services/data/repositoryImplementation/FavoritesRepositoryImpl.ts` (AsyncStorage)
- `constants/Surfaces.ts`
- `app/(features)/characters/[id].tsx`, `app/(features)/locations/[id].tsx`, `app/(features)/seasons/[season].tsx` — **stubs**: render the received param in a `Text`, plus the standard back button header

Modify:
- `services/domain/repository/CharacterRepository.ts` — add `getCharactersByIds`
- `services/data/repositoryImplementation/CharacterRepositoryImpl.ts` — implement it
- `services/composition/repositories.ts` — add `getFavoritesRepository`

No existing screen, card, or UI component is modified. `constants/Colors.ts` is not touched.

## Behavior

1. `FavoritesRepositoryImpl` stores one JSON array of numbers under the key `favorites:characters:v1`. Ids are deduplicated on write and kept in insertion order (oldest first). `add`/`remove` are read-modify-write, so serialize all writes through a single promise chain inside the implementation; two quick calls must never lose an update. A stored value that is not valid JSON or not an array of positive integers is treated as an empty list (comment why: corrupt storage must not crash the app). Errors thrown by AsyncStorage itself are **not** swallowed; they propagate.
2. `getCharactersByIds`: empty input -> `[]` with no request. Otherwise `GET /character/<id1>,<id2>,...`. The API returns a single object (not an array) when one id is requested; normalize to an array. A 404 resolves to `[]`; other non-OK responses throw `HttpError`. Deduplicate the requested ids first. The API returns results sorted by id and ignores the requested order, so reorder client-side to match the order of `ids`. Map with `CharacterMapper.toDomain`.
3. Stubs are only placeholders; later specs overwrite them completely.

## Acceptance criteria

- [ ] `npx tsc --noEmit` clean.
- [ ] Only the files under **Allowed files** changed; `package.json` and the lockfile are untouched.
- [ ] `getCharactersByIds([])` returns `[]` before any `fetch` call (code path).
- [ ] The single-object response for one id is normalized to an array.
- [ ] All `FavoritesRepositoryImpl` writes go through the serialized chain.

## Commit plan

1. `feat: add FavoritesRepository with AsyncStorage implementation`
2. `feat: add getCharactersByIds to CharacterRepository`
3. `feat: add details route stubs`
4. `feat: add surface and border color tokens`
