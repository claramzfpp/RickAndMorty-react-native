# Review checklist

Used twice: by the implementing agent as a self-check **before opening the PR**, and by a reviewer agent (or the owner) on the PR. Check against `AGENTS.md`, the spec, and `docs/architecture.md`.

Report each failed item as `file:line - what is wrong - what the rule says`. Do not fix anything while reviewing.

## 1. Scope

- [ ] `git diff --stat develop` touches only files listed under the spec's **Allowed files**.
- [ ] No edit to an existing screen or component unless the spec allows it (spec 05 only, `onPress` additions).
- [ ] `package.json`, `package-lock.json`, `app.json`, `ios/`, `android/` untouched.
- [ ] No test files, snapshot files, or test libraries.
- [ ] No `.env` content, secrets, or hardcoded keys.

## 2. Architecture (layers)

- [ ] Views (`.tsx`) do not import from `services/data/`, do not call `fetch`, and contain no business rules.
- [ ] ViewModels take repository **interfaces** as parameters and import only from `services/domain/`.
- [ ] Repositories are obtained only via `services/composition/repositories.ts` and only in route files.
- [ ] API DTOs (`RM*`) never appear outside `services/data/`. Mapping to domain happens in a mapper.
- [ ] `services/domain/` imports nothing from React, Expo, AsyncStorage, or `services/data/`.
- [ ] Route files in `app/` are thin: obtain dependencies, call the view model, render the view.

## 3. Code quality

- [ ] No `any`, no non-null `!`, no `@ts-ignore`/`@ts-expect-error`.
- [ ] IDs use the existing value objects (`CharacterId`, ...); route params validated and failures become an error UI state.
- [ ] Async effects use the `isCancelled` cleanup pattern.
- [ ] Errors are surfaced in UI state or to the caller, never swallowed (`catch {}` with no handling is a failure).
- [ ] Loading, error (with retry where sensible), empty (where applicable), and loaded states all exist.
- [ ] Naming and file layout match `docs/conventions.md`; copied the closest reference file's pattern.
- [ ] Comments explain WHY only; no JSDoc, no commented-out code, no leftover `console.log`.

## 4. Spec fidelity

- [ ] Every numbered item in **Behavior** is implemented.
- [ ] Contract signatures (types, hook names, params) match the spec exactly, since other specs depend on them.
- [ ] Out-of-scope items were not built.
- [ ] Deviations from the spec are listed in the PR body.

## 5. Build

- [ ] `npx tsc --noEmit` is clean.
- [ ] Commits are small, Conventional (`feat:`, `fix:`, `refactor:`), no `test:` commits.
