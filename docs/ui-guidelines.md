# UI guidelines

Source of truth for visuals: the Pencil file (`pencil-welcome-desktop.pen`). Agents in worktrees cannot open it, so the relevant frames are exported to `docs/design/` and summarized here. **Open the PNG referenced in your spec before building the screen.**

| Screen | Image |
|---|---|
| Character details | `docs/design/character-details.png` |
| Location details | `docs/design/location-details.png` |
| Season episodes | `docs/design/season-episodes.png` (see deviation below) |
| Favorites | `docs/design/favorites.png` |
| All characters (reference for Favorites grid) | `docs/design/all-characters.png` |

If the PNG and a spec disagree, the **spec wins** and the deviation is listed in the spec.

## Tokens (design -> code)

| Design token | Value | Code |
|---|---|---|
| bg-primary / gray | `#89847E` | `Colors.light.gray` |
| rm-green | `#97CE4C` | `Colors.light.green` (titles) |
| rm-pink | `#E89AC7` | `Colors.light.pink` (favorite heart) |
| rm-yellow / rm-red / rm-brown | `#F0E14A` / `#E10F0F` / `#1E0C0C` | `Colors.light.yellow/red/brown` |
| bg-secondary (info tiles, circles) | `#E9E6DF` | `Surfaces.surface` (`@/constants/Surfaces`, new file from spec 00) |
| border-color (row dividers) | `#BFBCB7` | `Surfaces.border` (`@/constants/Surfaces`, new file from spec 00) |
| text-primary | `#1E0C0C` | `Colors.light.brown` |
| text-secondary | existing cards use `rgb(95, 99, 100)` | keep that value |
| Status alive/dead/unknown | `#97CE4C` / `#E10F0F` / `#5C584F` on `#FFFFFF99` | reuse `StatusPill` |

Fonts in the design are Space Grotesk / Work Sans; the app currently uses system fonts. **Do not add fonts.** Match sizes and weights only.

## Details screen anatomy (character and location)

- Full-bleed hero (character: photo, 390x340; location: 390x260 `surface` background with a centered 72px icon in pink).
- Transparent native header over the hero (`headerTransparent: true`, same pattern as `app/(features)/characters/index.tsx`): back via the existing `headerBackButtonItem` (top-left) and, for characters, a favorite heart as a header-right custom item (top-right) following `headerSearchButtonItem`. `HeaderCircleButton` has a fixed color and must not be edited, so the heart is a new component that copies its look and turns pink when filled. The hero starts at the very top of the screen (no top padding). The PNG's 40px white circles are approximated by these; the owner polishes visuals manually.
- Bottom **sheet** overlapping the hero: `gray` background, top corners radius 24, padding `24/20/20/20`, vertical gap 16.
  - Title: 26px, green, display style. Character: name + `StatusPill` on the same row.
  - **Info grid**: row of tiles, gap 12, each tile `surface` background, radius 14, padding 14, vertical gap 8: icon (18, green), label (11px, 600, secondary), value (13px, 600, primary). Character: Species / Gender / Origin (3 tiles). Location: Type / Dimension (2 tiles).
- 6px accent bar at the very bottom: four equal segments green / yellow / pink / red.
- Out of scope (present in the design but not built): location residents row, episode details screen.

## Lists

- Row divider: 1px `border`. Row padding 14 vertical. Circle badge: 36x36, `surface`, green icon.
- Row title: 14px, 600-700, primary. Row subtitle: 11px, secondary. **Title + subtitle follow `LocationCard`**: name bold 15 / subtitle 11 weight 500.
- Favorites grid: same 2-column `CharacterCard` grid as `app/(features)/characters/index.tsx`.

## States

Loading, error, and empty states reuse `components/shared/SearchStateViews.tsx` or follow its look. Favorites empty state copy: "No favorites yet" / "Tap the heart on a character to save it."

## Season episodes: deviation from the design

The Pencil frame shows a numbered badge and no date. The product decision is: **TV icon inside a circle, episode name as title, air date as subtitle.** Follow the spec, not the PNG, for the row content; the header (back button, "Season N", "N episodes") matches the PNG.
