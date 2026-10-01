# 03 — Location details

- **Branch:** `feat/03-location-details`
- **Depends on:** 00
- **Design reference:** `docs/design/location-details.png`

## Goal

Tapping a location opens a details screen, similar to character details, with the data we already have in the `Location` domain model (name, type, dimension).

## Out of scope

- Residents row (in the design, not in the domain).
- Favorites for locations.
- Anything in `components/characters/details/` (owned by spec 02); build your own tile component to avoid a cross-spec dependency.

## Read first

- `docs/ui-guidelines.md` ("Details screen anatomy")
- `components/locationsCarousel/LocationCard.tsx` (icon mapping by `type`)

## Contracts

Consumes `getLocationRepository().getLocationById(id)`.

```ts
export type LocationDetailsUIState =
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | { status: 'loaded'; location: Location };

useLocationDetailsViewModel(locations: LocationRepository, rawId: string) // { state, retry }
```

## Allowed files

Create:
- `components/locationsCarousel/details/LocationDetailsView.tsx`
- `components/locationsCarousel/details/LocationInfoTile.tsx`
- `components/locationsCarousel/details/locationDetailsViewModel.ts`
- `components/locationsCarousel/details/locationDetailsUIState.ts`

Modify:
- `app/(features)/locations/[id].tsx` — replace the stub

## Behavior

1. Layout follows the PNG: hero area (`Surfaces.surface` (`@/constants/Surfaces`)) with a centered 72px icon in pink, floating back button, bottom sheet with the location name (green, 26px) and two tiles: Type, Dimension. Accent bar at the bottom.
2. Hero icon follows the same `type` -> symbol mapping as `LocationCard` (globe for Planet, etc.). Do not edit `LocationCard`; duplicate the small mapping or, if you prefer, report it as tech debt in the PR.
3. `rawId` -> `new LocationId(Number(rawId))`; invalid -> error state.
4. Values that are empty strings in the API (`dimension` is sometimes `unknown`) are displayed as-is; never render blank.
5. Loading: `ActivityIndicator`. Error: message + "Try again".

## Acceptance criteria

- [ ] `npx tsc --noEmit` clean.
- [ ] Opening "Earth (C-137)" shows type Planet and dimension Dimension C-137 (as returned by the API).
- [ ] Hero icon changes with the location type.
- [ ] `/locations/abc` and `/locations/999999` show the error state, no crash.

## Commit plan

1. `feat: add location details view model and UI state`
2. `feat: add location details view components`
3. `feat: build location details screen`
