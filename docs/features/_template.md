# <NN> — <Feature name>

- **Branch:** `feat/<NN>-<slug>`
- **Depends on:** <spec ids that must be merged first, or "none">
- **Design reference:** <docs/design/xxx.png or "none">

## Goal

<2-4 lines: what the user can do after this ships.>

## Out of scope

- <things a neighbouring spec owns, or that are deliberately not built>

## Read first

- `AGENTS.md`, `docs/workflow.md`, <architecture / conventions / ui-guidelines sections that matter>

## Contracts

<Types/interfaces this spec consumes or must expose, with exact signatures. Anything another spec depends on goes here.>

## Allowed files

Create:
- `<path>`

Modify:
- `<path>` — <what changes>

Everything else is off-limits. If you need another file, stop and report.

## Behavior

<Numbered, concrete behavior: states, navigation, edge cases (empty, invalid id, network failure).>

## Acceptance criteria

Each must be verifiable by `npx tsc --noEmit` or by running the app.

- [ ] <criterion>

## Commit plan

1. `feat: <step>`
