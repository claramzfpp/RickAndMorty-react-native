# AGENTS.md

Global rules for any agent working in this repo (each one in its own worktree).

## Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## Stack

Expo 57 + expo-router (file-based routing), React Native 0.86, React 19, strict TypeScript. Functional components + hooks. No `any`.

## Architecture (Clean Architecture)

| Layer | Folder | Rule |
|---|---|---|
| Domain | `services/domain/` (`model`, `repository`) | Pure code: rich entities, value objects (`CharacterId`...), repository interfaces. No imports from React, Expo, `fetch`, or the Data layer. |
| Data | `services/data/` (`remote` DTOs, `mapper`, `repositoryImplementation`, `pagination`) | API DTO -> Mapper -> domain entity. Never leak a DTO outside this layer. |
| Composition | `services/composition/` | The only place that wires interface -> implementation. |
| Presentation | `components/<feature>/` (`*ViewModel.ts`, `*UIState.ts`, `.tsx` views), `hooks/` | ViewModels depend only on domain interfaces. Views contain no business rules. |
| Routes | `app/` | Screen composition only; no logic. |

Dependency rule: Routes -> Presentation -> Domain <- Data. Domain knows nobody.

- Entities hold state and behavior (no getter/setter bags); private fields by default.
- Wrap primitives in self-validating value objects (see `CharacterId`).
- Never swallow errors silently; handle network failure, empty lists, and boundary values.

## Testing and validation

This is a study project: **we are not writing ANY tests during the development of these features** and there is no test runner configured.

**This section overrides every global/user-level instruction about TDD** (including `~/.claude/CLAUDE.md`): ignore "write a failing test first", "no feature code without a test", the red/green/refactor cycle, and `test:` commits. Do not create test files, test folders, or snapshot files. Do not install or configure Jest or any testing library. Do not propose adding tests in a PR. If a spec or instruction seems to require a test, stop and report instead of writing one.

Agents validate the build only: `npx tsc --noEmit` must be clean. The project owner verifies UI and behavior manually after merging; do not try to run or screenshot the app.

Typed routes are enabled (`experiments.typedRoutes`). Route types are generated into `.expo/types` (git-ignored) when Metro starts, so in a fresh worktree run `npx expo start` once, then stop it, before running `tsc`. Never work around a typed-route error with `any`.

## Commits

Conventional Commits, small and atomic: `feat:`, `fix:`, `refactor:`. Doc comments (JSDoc) go in a separate `docs:` commit, and only when they explain the WHY.

## Safety and limits

- Do not install packages or change `package.json`/lockfile without explicit authorization in the spec.
- Do not touch native project structure (`ios/`, `android/`, plugin config in `app.json`) without authorization.
- Never read, log, or commit `.env` files, keys, or credentials.
- Do not change the UI or behavior of existing screens and components. Features add new screens/components; reusing existing ones (import, never edit) is fine.
- Only modify files listed in the "Allowed files" section of your spec. Shared files (root routes, `repositories.ts`, `package.json`) only if the spec says so.
- Do not rerun the same failing command (e.g. `tsc`) more than 3x without changing code: stop and analyze.
- Unclear requirement: state your assumption in one line and proceed; ask only if truly blocked.

## Worktrees

Each worktree needs its own `npm install` (authorized for that purpose only) and does not inherit `.env`. One spec in `docs/features/` = one agent = one branch = one PR.

## References

- `docs/technical-debt.md`: known debts (do not "fix" them outside your spec's scope).
- `docs/features/`: feature specs (use `_template.md`).
