# Claude PR Review Checklist

Review the diff in this pull request against the house rules below. Be
concise and actionable: point at specific files/lines, explain briefly why
something is a problem, and suggest a fix. Do not restate rules that don't
apply to the changed files. If the diff looks clean against a section, say so
briefly rather than omitting the section.

**Delivery (required, do this last):** write your full review to a temp
file (e.g. `/tmp/claude-review.md`) and post it as a comment on this pull
request by running:

```
gh pr comment "$PR_NUMBER" --body-file /tmp/claude-review.md
```

`PR_NUMBER` and a `gh`-authenticated `GITHUB_TOKEN` are already available
in your environment. This step is not optional — a review that isn't
posted as a PR comment provides no value to the team.

## Architecture (Clean Architecture layering)

- **No framework/API/DB leakage into `Domain`.** Domain entities, value
  objects, use cases, and repository interfaces must be pure — flag any
  import of React/React Native, Expo, `fetch`/HTTP clients, or raw
  API/DB response shapes inside domain code.
- **DTOs must be mapped, not leaked.** External API/DB payloads should be
  typed as DTOs and explicitly mapped into domain entities before use —
  flag any DTO/raw JSON shape passed directly into a domain entity,
  use case, presenter, or component prop.
- **Repository interfaces live in Domain; implementations live in Data.**
  Flag use cases or components that depend directly on a concrete
  repository/API client instead of a repository interface.
- **No anemic domain models.** Domain entities should hold behavior, not
  just plain data with getters/setters — flag entities that are pure data
  bags with logic living elsewhere (in a service, util, or component).
- **No primitive obsession.** Flag primitives (raw `string`/`number`) used
  for concepts that deserve a self-validating value object (e.g. an id,
  email, money amount, or similar domain concept) instead of a wrapped
  type.

## Testing (TDD compliance)

- **Every new/changed production file should have a corresponding test
  file.** Flag missing tests for new logic, especially in `services/`,
  domain entities, use cases, and repository implementations.
- **Naming convention:** test files should mirror the production file name,
  e.g. `UserService.ts` → `UserService.test.ts`, in a test directory that
  mirrors the production folder structure. Flag mismatched names/locations.
- **Tests should cover boundary/edge cases:** null/empty inputs and network
  failures, not just the happy path.

## TypeScript

- **No `any`.** Flag any use of `any` (explicit or via untyped casts) —
  suggest a concrete type, generic, or `unknown` with narrowing instead.
- Flag missing/loose types on public function signatures, especially at
  layer boundaries (repository interfaces, use case inputs/outputs).

## Style / Process

- **Errors must not be swallowed.** Flag empty `catch` blocks, ignored
  promise rejections, or generic catches that discard the original error
  without logging/rethrowing/handling it.
- **Null/empty/network-failure edge cases must be handled explicitly** in
  new code paths, not just in tests — flag unhandled `null`/`undefined`
  branches or missing error handling around network/async calls.
- **Doc comments are a separate pass.** Flag PRs that mix new JSDoc doc
  comments into the same commit/diff as a `feat:`/`refactor:` change —
  doc comments should land in their own `docs:` commit, added after the
  feature is green, and should explain non-obvious WHY (not restate the
  WHAT already clear from the name/signature).
