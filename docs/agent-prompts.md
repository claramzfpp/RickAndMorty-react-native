# Agent prompts

Paste one per agent/worktree. Create each worktree from an up-to-date `develop` (after 00 is merged, for 01-04).

## Template

```
Implement docs/features/<spec>.md.
Read AGENTS.md and docs/workflow.md first, then follow the spec exactly.
Stay within the spec's "Allowed files"; if you need anything else, stop and report.
Do not install packages. Validate with `npx tsc --noEmit` only; do not run the app.
Use the design image named in the spec as a visual reference while building.
When done, summarize what you built and any deviation or doubt.
```

## Per spec

| Worktree branch | `<spec>` |
|---|---|
| `feat/00-foundation` | `00-foundation` |
| `feat/01-season-episodes` | `01-season-episodes` |
| `feat/02-character-details` | `02-character-details` |
| `feat/03-location-details` | `03-location-details` |
| `feat/04-favorites-screen` | `04-favorites-screen` |
| `feat/05-card-navigation` | `05-card-navigation` |

Add to the 00 prompt: "`@react-native-async-storage/async-storage` is already installed; do not touch package.json."

## Reviewer prompt (one per PR, separate agent/session)

```
Review the diff of this branch against develop for docs/features/<spec>.md.
Use docs/review-checklist.md, AGENTS.md and docs/architecture.md.
Do not modify any file. Report every failed checklist item as
`file:line - problem - rule`, most severe first, or say that all items pass.
```
