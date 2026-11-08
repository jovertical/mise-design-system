# mise-design-system — grouping by purpose, and the React package as a reference

Agreed with the user on 2026-11-05, between round 3 and round 4.

## Why

The React package grew over time and was never restructured. The port copied
two of its accidents:

- **Stories are grouped by provenance.** `docs/naming.md` §7 put a story under
  `Primitives/` when its React origin was shadcn/ui and under `Components/`
  otherwise. That answers a question no reader of Storybook asks, and it puts
  `Sidebar`, a whole navigation shell, next to `Label`. Provenance is already
  recorded on each file's `Origin:` line.
- **Overlapping components keep their React names.** `LoadingState` and
  `LoadingStatus` read as the same thing. They are not (a panel and an inline
  line), but nothing in the names says so. `SectionTitle` is a `CardTitle`
  with an icon. The unported React set has more of the same: four number
  inputs, three Fact parts, four Metric parts.

The package is private, has no consumers, and has 39 component families. A
rename costs least now and more with every round.

## Decisions

| # | Decision | Detail |
| --- | --- | --- |
| S1 | The React package is a reference, not a contract | mise keeps its look and behaviour, and may merge, rename and reshape the API. Every departure is recorded on the component's `Diverged:` line. Replaces D5 and D9 of the port spec (see "Changes to the port spec") |
| S2 | Group by purpose | A component goes in the group for the question it answers on a screen. Provenance stays in the `Origin:` header |
| S3 | Folders are the groups | `src/lib/components/<group>/<component>/`. The story title is the folder: `forms/select/` is `Forms/Select`. A test enforces it |
| S4 | The public barrel stays flat | `import { Select } from '@jovertical/mise-design-system'` is unchanged. Only internal relative paths move |
| S5 | A `shadcn` badge on shadcn-derived stories | `tags: ['shadcn']` in the story meta, shown as a sidebar badge by `storybook-addon-tag-badges`. A test ties the tag to the `Origin:` header |
| S6 | Two merges now | `LoadingStatus` folds into `Spinner`; `SectionTitle` folds into `CardTitle` |
| S7 | Later merges are decided at port time | Round 4 and 5 candidates are listed below; each is settled in its round's plan, not here |

## Groups

In sidebar order. Every ported family is placed. `[s]` marks the ones that get
the `shadcn` badge.

| Group | Folder | Holds |
| --- | --- | --- |
| Foundations | `stories/foundations/` | Palette, Geometry, Theming. Tokens only, no component |
| Typography | `typography/` | Heading, Text |
| Actions | `actions/` | Button [s], DropdownMenu [s] |
| Forms | `forms/` | Field [s], Label [s], Input [s], InputGroup [s], Textarea [s], Checkbox [s], Switch [s], RadioGroup [s], Select [s], Toggle [s], ToggleGroup [s] |
| Navigation | `navigation/` | Sidebar [s], Breadcrumb, Tabs [s] |
| Layout | `layout/` | PageLayout, PageHeader, Card [s], Separator [s] |
| Overlays | `overlays/` | Dialog [s], AlertDialog [s], Sheet [s], Popover [s], Tooltip [s] |
| Feedback | `feedback/` | Alert [s], Toaster (`sonner/`) [s], Spinner [s], Skeleton [s], Empty [s], EmptyState, LoadingState |
| Data display | `data-display/` | Badge [s], Avatar [s], IconChip |
| Patterns | `stories/patterns/` | Whole screens composed from the groups above, with no component of their own. Empty until a round ports one |

Placement calls worth recording:

- **Toggle and ToggleGroup are Forms**, not Actions: they pick a value.
- **Typography is its own group**, not part of Data display.
- **DropdownMenu is Actions**: it is a menu of things to do. Select is the
  form control.
- **Breadcrumb has no badge.** React wrote it against shadcn's API rather than
  porting it, and its `Origin:` line says so.
- `IsMobile` is a hook with no story; it stays in `src/lib/hooks/`.

A family nests under its root, as before: `Forms/Select`, and later
`Data display/DataTable/Toolbar`.

## The two merges

### `LoadingStatus` into `Spinner`

`Spinner` takes optional `children`, a short caption naming what is being
waited on.

- Without children: unchanged. The icon alone, `role="status"`,
  `aria-label="Loading"`.
- With children: a `<span role="status">` holding the icon (now
  `aria-hidden`) and the caption, in `LoadingStatus`'s classes:
  `text-muted-foreground inline-flex items-center gap-2 text-sm`. The live
  region announces the caption. *Amended 2026-11-05 during Task 53: this said
  the caption becomes the accessible name, but `role="status"` takes its name
  from the author only, never from its content.*

`LoadingStatus` rendered a `<p>`; the merged form is a `<span>`, so it can sit
inside a button or a line of text. A caller that wants a paragraph wraps it.
`LoadingStatus`, its folder, its barrel line and its `EXPECTED_EXPORTS` entry
go. Its stories, Basic and Specific, become Spinner's `WithCaption`.

### `SectionTitle` into `CardTitle`

`CardTitle` takes two optional props, carried over unchanged from
`SectionTitle`:

- `icon`: a snippet. Bare, muted, `size-4` when `iconTone` is absent.
- `iconTone`: a `Tone`. Draws the icon in an `IconChip` of that tone. Never a
  status tone.

Without `icon`, `CardTitle` is unchanged. `SectionTitle`, its folder, barrel
line and export go. Its stories, Default and TintedChip, become Card's
`TitleWithIcon` and `TitleWithTintedIcon`.

`CardTitle` then imports `IconChip`, so `layout/card` depends on
`data-display/icon-chip`. That direction is fine: Layout may use Data display,
never the reverse.

Both merges add a `Diverged:` line to the surviving component naming what it
absorbed.

## Candidates for rounds 4 and 5

Listed so each round's plan starts from them. None is decided here (S7); each row records its round's decision once made.

| Candidate | Would absorb | Group |
| --- | --- | --- |
| `NumberInput` with a `format` prop | CountInput, CurrencyInput, DecimalInput; QuantityInput kept, composing it (round 6, R6-4) | Forms |
| `FactList` + `FactListItem` | FactField, FactList, FactRow | Data display. **Merged in round 4a**, with `orientation` |
| A `Metric` family | MetricBar, MetricGrid, MetricRow, StatTile | Data display. **Kept apart in round 4a**: each answers a different question, and the names already share a prefix |
| A `Sortable` family | Draggable, Droppable, Sortable | Data display |
| A `Stepper` family | Stepper, StepperNavigation: one family in round 7 (R7-5), `orientation` renamed `variant` | Navigation |
| `ErrorState` beside EmptyState and LoadingState | ErrorPage | Feedback |
| One checklist | ChecklistCard, TaskChecklist: one family in round 8 (R8-4), two components over a shared row, TaskChecklist renamed Checklist | Data display |
| Triage with `HoverCard` | Waterfall | Data display. Out of round 4b, as it needs `HoverCard` |
| Dropped | ProductLogo (brand) | — |

## Tests

The structural suites walk one folder level today. They move to two:
`components/<group>/<component>/`.

- **`stories.test.ts`**: every story's `title` equals its folder, group and
  component both, through one map from folder name to group title
  (`data-display` → `Data display`). An unknown group folder fails.
- **`provenance.test.ts`**: a story meta has `tags: ['shadcn']` exactly when
  the component's `Origin:` line names shadcn/ui. Neither direction can drift.
- **`barrel.test.ts`**: reads the two-level paths. `EXPECTED_EXPORTS` loses
  `LoadingStatus` and `SectionTitle` and their prop types.
- **Behaviour tests**: Spinner gains the caption cases (role on the wrapper,
  icon hidden, caption as the name). Card gains the icon cases (bare and
  muted; in an `IconChip` with a tone). `empty-loading.test.ts` drops the
  LoadingStatus cases; `section-title.test.ts` is folded into
  `card.test.ts`.

## Dependency

`storybook-addon-tag-badges` 3.1.0 (peer `storybook ^10`). The user installs
it. It is configured in `.storybook/manager.ts` to show the `shadcn` tag as a
sidebar badge, with a tooltip reading "Ported from shadcn/ui".

## Changes to the port spec and the docs

- **D5** becomes: flat names from the root entry, `Dialog`, `DialogContent`.
  Names follow React unless a `Diverged:` line says otherwise.
- **D9** becomes: the React package is the reference for look and behaviour;
  mise owns its API. shadcn-svelte stays the reference for bits-ui wiring.
- **`docs/naming.md` §7** is rewritten to S2 and S3 and the group table above.
- **`docs/handoff.md`**, `CLAUDE.md` / `AGENTS.md`, and the `authors-components`
  and `documents-updates` skills: the folder layout, the badge rule, and
  "reference, not contract".
- **Story ids change** (`primitives-sidebar--default` becomes
  `navigation-sidebar--default`). Nothing outside the repo links to them.

## Out of scope

- Any rename or merge beyond S6.
- The deferred stories (Hint, Progress, CardList, MetricBar, RadialStat
  blockers). They stay deferred.
- Round 4 itself. Its plan is written after this lands.
