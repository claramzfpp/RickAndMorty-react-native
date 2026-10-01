# Agent workflow

One spec in `docs/features/` = one agent = one worktree = one branch = one PR.

## Start

1. Read, in order: `AGENTS.md`, your spec, then the docs the spec lists (`architecture.md`, `conventions.md`, `ui-guidelines.md`).
2. Confirm every dependency in your spec's "Depends on" is merged into `main` (`git log main`). If not, stop and report.
3. In the worktree: `npm install` (allowed for this purpose only), then `npx expo start` once and stop it to generate typed-route types. Do not copy or read `.env`.
4. Branch name: `feat/<spec-id>-<slug>`, e.g. `feat/02-character-details`.

## Build

- Touch only the files in the spec's **Allowed files**. If you need another file, stop and report instead of editing it.
- Small commits: `feat:`, `fix:`, `refactor:`. No `docs:` JSDoc commits unless the spec asks.
- Validate after each meaningful change: `npx tsc --noEmit` (baseline on `main` is clean, so any error is yours). There are no tests or lint yet. Do not run or screenshot the app; the owner verifies UI manually.
- Same failing command 3 times without a code change -> stop and analyze.

## Definition of done

- [ ] `npx tsc --noEmit` is clean.
- [ ] Every item in the spec's **Behavior** section is implemented in code.
- [ ] No files changed outside **Allowed files** (`git diff --stat main` to check).
- [ ] No new dependencies, no `package.json`/lockfile changes.

## Open a PR

- Title: Conventional Commit style, e.g. `feat: character details screen`.
- Body: what changed, deviations from the spec, and anything you were unsure about (the owner reviews UI manually).
- Target `main`. Do not merge your own PR.

## Merge order (for the human)

See `docs/ROADMAP.md`. Spec 00 merges first; the others can merge in any order afterwards.

## Native module note (for the human)

`@react-native-async-storage/async-storage` is a native module. After merging spec 00, rebuild the dev client (`npx expo run:ios` / `run:android`) before testing; a JS-only reload crashes with a null native module.
