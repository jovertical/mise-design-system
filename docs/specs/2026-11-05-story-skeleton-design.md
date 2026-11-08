# mise-design-system — one story skeleton

Agreed with the user on 2026-11-05, after the structure change.

## Why

The stories were ported one React file at a time, and each kept its file's
habits. The same seven kinds of story recur across the package under different
names, in different orders, with hand-drawn layouts:

- The first story has eight names (Playground, Default, Basic, Plain, Fallback,
  Parts, Text line, Listing). Only five are `Playground`, the one wired to
  controls and the docs page.
- Button's `Matrix`, Badge's `Matrix` and IconChip's `Sizes and shapes` are
  the same labelled grid, written three times with three gaps.
- A size axis is `Sizes` in four files and `Small` in two; states are `States`
  in two files and `Invalid` + `Disabled` in another.
- "On a card" is phrased six ways.

## The skeleton

Every story file follows this order. Only `Playground` is required.

| Rank | Story | Shows |
| --- | --- | --- |
| 1 | `Playground` | The component on `args`, wired to controls. The docs page's primary story |
| 2 | `Matrix` | Two visual axes crossed, drawn with `StoryMatrix` |
| 3 | An axis: `Variants`, `Sizes`, `Tones`, `Shapes`, `Sides`, `Types`, `Weights`, `Orientations`, `Themes`, `Thicknesses`, `Surfaces`, `Densities`, `Formats` (`Themes` added for Sidebar's `sidetheme`, `Thicknesses` for RadialStat's `thickness`, `Surfaces` for StatTile's `surface`, `Densities` for Table's `compact`, `Formats` for NumberInput's `format`) | One prop's values, named after the prop in the plural, drawn with `StoryAxis` |
| 4 | `States` | Disabled, invalid, checked, loading: each labelled |
| 5 | `With <part>` | An optional part or slot: `With icon`, `With actions`, `With description` |
| 6 | `Long content` | Overflow and truncation |
| 7 | `In <context>` / `On <context>` | Where a screen puts it: `In a card`, `In a form`, `On a page` |
| 8 | A scenario | An arrangement a screen really uses, named freely: `Primary and secondary`, `Listing` |

Rules:

- **Ranks never go down** through a file. Scenarios come last.
- **Banned names:** `Default`, `Basic`, `Plain`, `Small`. Each is either the
  Playground or an axis.
- **An axis name comes from the list above.** A new axis adds its name to the
  list in `tests/stories.test.ts`, which is a deliberate act.
- **A `Matrix` story uses `StoryMatrix`.**
- **Every story after `Playground` opens with a comment** saying what it shows
  and why a screen wants it. This was already the React package's rule.
- **No story repeats another.** A story that only shows what the Playground
  or the Matrix already shows goes. A scheme variant of a story (Toaster's
  `Types dark`) goes too: the toolbar switches scheme.

## The helpers

In `stories/`, beside `on-a-card.svelte`. They are story scaffolding, not
package exports.

- **`story-matrix.svelte`**: `rows` and `columns` (readonly string arrays) and
  a `cell` snippet taking `(row, column)`. Draws a grid with the column labels
  across the top and the row labels down the side, in `text-muted-foreground
  text-xs`, with `gap-x-4 gap-y-3`.
- **`story-axis.svelte`**: `values` (a readonly string array), an `item`
  snippet taking `(value)`, and `orientation` (`horizontal`, the default, or
  `vertical`). Horizontal puts each label under its item; vertical puts it to
  the left, for items too wide to sit side by side (text, alerts).

## The test

In `tests/stories.test.ts`, over every component story file:

- the first `<Story name>` is `Playground`;
- no banned name is used;
- ranks never go down;
- a `Matrix` story's file imports `story-matrix.svelte`;
- every story after the first is preceded by an HTML comment.

## Out of scope

- Foundation stories, which show tokens, not a component.
- Story copy, which already follows the style guide.
