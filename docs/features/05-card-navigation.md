# 05 — Card navigation wiring (edits existing files)

- **Branch:** `feat/05-card-navigation`
- **Depends on:** 00
- **Design reference:** none

> Approved by the project owner. It is the only spec that edits existing screens/components, which is why it ships as its own small PR, separate from 00. It adds behavior only (`onPress`); **no visual change**.

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
- [ ] `git diff` shows only `onPress` additions and the `router` import in the listed files.

## Commit plan

1. `feat: navigate from cards to details screens`
