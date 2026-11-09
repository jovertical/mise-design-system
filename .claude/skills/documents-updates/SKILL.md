---
name: documents-updates
description: >-
  Guides keeping mise's written record in step with the code — component headers and prose
  comments, docs/naming.md, the spec and plan, README.md, the .ai guidelines, and CLAUDE.md /
  AGENTS.md — so a rule never outlives the code it describes. Activates after porting, adding,
  renaming or removing a component, changing a default or a token, or changing the tooling;
  or when the user mentions docs, documentation, README, naming, spec, plan, or stale docs.
metadata:
  internal: true
---

# Documents Updates

Adapted from the React package's `documents-updates` skill.

## The map

| What changed | Update |
| --- | --- |
| A component's decision | its prose comment, on the Props type |
| A divergence from the React package or shadcn-svelte | its `Diverged:` line |
| A name or a prop name | `docs/naming.md` |
| A new group, or a component moving group | `docs/naming.md` §7 and `GROUPS` in `tests/groups.ts` |
| A theme contract change | `.ai/guidelines/theming/guide.md`, and the README's token list if it is public |
| An entry point, a peer, consumer setup | `README.md` |
| Where a file goes, how a port works | `.ai/guidelines/architecture/guide.md` |
| Lint, format, comments, story copy | `.ai/guidelines/style/guide.md` |
| A decision the spec or plan got wrong | amend `docs/specs/…` or `docs/superpowers/plans/…`, and say what changed and when |
| A rule every session needs | `CLAUDE.md`, then `cp CLAUDE.md AGENTS.md` |
| A Props type, its JSDoc or a default | `pnpm build:skill`; and `skills/mise/recipes/` if a recipe uses it |
| A new or renamed component | the index in `skills/mise/SKILL.md`, then `pnpm build:skill` |
| Consumer setup, theming, the CLI | `skills/mise/setup.md` or `theming.md`, as well as `README.md` |

## Rules

- **`AGENTS.md` is a copy of `CLAUDE.md`.** Edit `CLAUDE.md`, then copy it.
- **Do not write counts that will rot.** Point at the file that holds the list.
- **Record the why.** A constraint without its reason gets undone by the next
  contributor.
- **A doc that contradicts the code is a bug in the doc.** Fix it if it is inside
  the change, and flag it to the user if it is not.
- **No new doc files** unless the user asks. Extend an existing one.

## Checklist

1. Identify what changed.
2. Update the places the map names.
3. Search for the old name or value: `rg -n '<old name>' docs README.md .ai .claude src`.
4. If `CLAUDE.md` changed, `cp CLAUDE.md AGENTS.md`.
