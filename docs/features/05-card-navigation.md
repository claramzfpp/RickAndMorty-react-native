# 05 — Card navigation wiring (OPTIONAL, edits existing files)

- **Branch:** `feat/05-card-navigation`
- **Depends on:** 00
- **Design reference:** none

> Requires explicit approval from the project owner: it is the only spec that edits existing screens/components. It adds behavior only (`onPress`); **no visual change**.

## Goal

Make existing cards navigate to the new screens.

## Out of scope

Any styling, layout, or prop change other than passing `onPress`.

## Contracts

`router.push` from `expo-router` to: `/characters/<id>`, `/locations/<id>`, `/seasons/<n>` (route files from 00). `CharacterCard`, `LocationCard`, and `SeasonCard` already accept `onPress`.

## Allowed files

Modify (pass `onPress` only):
- `components/characters/charactersCarousel/CharactersCarousel.tsx`
- `app/(features)/characters/index.tsx`
- `components/locationsCarousel/LocationCarousel.tsx`
- `app/(features)/locations/index.tsx`
- `components/season+episodes/SeasonEpisodesCarousel.tsx`
- `components/discover/DiscoverSearchResults.tsx` (only if it renders the cards)

## Behavior

1. Each card press calls `router.push` with the URL above. `SeasonCard` stays disabled for seasons > 5.
2. `git diff` must show only `onPress` additions and the `router` import.

## Acceptance criteria

- [ ] `npx tsc --noEmit` clean.
- [ ] Character cards (Discover and See all), location cards (both), season cards 1-5 open the right screen.
- [ ] No visual difference on any existing screen.

## Commit plan

1. `feat: navigate from cards to details screens`
