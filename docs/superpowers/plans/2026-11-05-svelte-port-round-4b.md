# mise-design-system Round 4b Implementation Plan: tables and charts

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline execution, as chosen by the user). Steps use checkbox (`- [ ]`) syntax.

**Goal:** Port the second half of round 4: `Table`, `Command`, `Chart`, and the `DataTable` family (`DataTable`, its toolbar, faceted filter, column header, column toggle, view toggle, export menu and row actions). The round ends at a Storybook review with the user.

**Architecture:** As in round 4a. Each component follows `.claude/skills/authors-components/SKILL.md` and the per-task loop in `docs/superpowers/plans/2026-11-04-svelte-port-round-2.md`, lands in its purpose group (`docs/naming.md` §7), and has its stories on the skeleton (`docs/specs/2026-11-05-story-skeleton-design.md`).

**Tech Stack:** `@tanstack/svelte-table` 9 (TanStack Table's official Svelte 5 adapter), `layerchart` 2 with `d3-scale` and `d3-shape`, bits-ui `Command`.

**Spec:** `docs/specs/2026-11-04-svelte-port-design.md`, "Rounds", row 4, second half; the dependency rows are amended by this round (R4b-1, R4b-2).

## Global Constraints

- **The commit gate is `pnpm test` and `pnpm build:storybook`,** both checked by exit code.
- **No further dependency.** The four the user installed are enough.
- **Stories on the skeleton.** Each React story is renamed to its rank's name, merged into an axis or `States`, or kept as a scenario; the commit lists the mapping.
- **Story copy:** generic operations, no pesos and no real names.
- **Icons:** Tabler to the matching Lucide icon, one file at a time.
- **Visual check before each phase gate:** the new stories in light and dark, at desktop width for the tables.
- **Phase gates:** stop after Tasks 77 and 82, report, and push only after approval.

## Shared decisions

| # | Decision | Ruling |
|---|---|---|
| R4b-1 | Table library | `@tanstack/svelte-table` 9, chosen with the user over `@tanstack/table-core` 8. It is TanStack's official Svelte 5 adapter: rune-reactive tables, `FlexRender`, `renderComponent` and `renderSnippet` built in, and what shadcn-svelte's own data-table examples now use. React is on v8, so v9's API differs (features are declared up front, state through `createTableState`): the DataTable port is a translation, not a copy. Each translated call records the v8 name it replaces on `Diverged:` |
| R4b-2 | Dependencies | Ordinary `dependencies`, not peers, so a consumer installs in one step (the spec's rule for bits-ui). A consumer who draws no chart pays install size but no bundle size |
| R4b-3 | Groups | `Table`, `Chart` and the `DataTable` family in Data display. `Command` in Actions, beside `DropdownMenu`: a filterable list of things to do or pick. The family lives in one folder, `data-display/data-table/`, and its part stories are titled `Data display/DataTable/<Part>` (naming §7) |
| R4b-4 | Merges | None. The DataTable parts already share the `DataTable` prefix and each does one job; `ViewToggle` and `ExportMenu` are small, but a toolbar composes them and a screen uses them alone |
| R4b-5 | Chart | shadcn-svelte's `chart` parts (`ChartContainer`, `ChartTooltip`, `ChartStyle`, the config and its utilities) on LayerChart, with React's `chart-defaults.ts` (axis, grid, area fill, stroke width, comparison series) translated to LayerChart's props. Stories draw with LayerChart's own components, as React's draw with recharts |
| R4b-6 | Dropped from React | `DataTable`'s `tourTarget`, which hooks the React package's product tour. React's `ReactNode` props become snippets, as R4-5 |
| R4b-7 | Waterfall | Not in this round. It is a timeline drawn with `HoverCard`, not a recharts chart, and `HoverCard` is not ported. Round 5's triage takes both |

## Phases

- **Phase S (Tasks 73–77):** Table, Command, Chart, DataTable core, DataTable views
- **Phase T (Tasks 78–82):** ColumnHeader + RowActions, ColumnToggle + ViewToggle + ExportMenu, FacetedFilter, Toolbar, the round gate

## Per-task specifics

Read every React file a task names, and its stories, before writing the test.

- **73 Table** (`data-display/table`, shadcn): the parts React exports (`Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`) and any density or variant React adds. Test the slots and the density classes. Stories (12 in React): Playground (Default); `Sizes` or `States` for Density if it is a prop; the card compositions (In a card, compact, bordered, with footer, with figures) as `In …` and scenarios; EditableRowsWithInvalidState as `States`.
- **74 Command** (`actions/command`, shadcn): bits-ui `Command` with its parts and `CommandDialog`. Test filtering by typed text, the empty state, and `CommandDialog` opening. Stories: Playground (Default); a dialog scenario.
- **75 Chart** (`data-display/chart`, shadcn): R4b-5. Test that `ChartStyle` writes each config colour as `--color-<key>` for light and dark, and that `ChartTooltip` renders a row per series with its config label. Stories: Playground (Area); With comparison, With markers; SeriesPalette as `Tones` or a scenario.
- **76 DataTable core** (`data-display/data-table`, the React package): `createTable` with the features the core uses (sorting, filtering, pagination or load-more, row selection, column visibility), the table render through `Table` and `FlexRender`, the title and description, loading skeleton rows, the empty state, the footer, `onRowClick`, `getRowClassName`. Test sorting by a header, selection, the loading and empty states. Stories: Playground (Default); States (Loading, EmptyState); With title, With toolbar (a plain snippet until Task 81), Custom footer, Row selection.
- **77 DataTable views**: the grid view (`viewMode`, `cardRenderer`, `cardSkeleton`), expandable rows (`getSubRows`), and load more (`hasNextPage`, `fetchNextPage`). Test each. Stories: Grid view, Expandable rows, Load more.
- **78 ColumnHeader + RowActions**: the sortable header button with its direction icon and the bare variant; the row's `⋯` menu on `DropdownMenu`, with its disabled state. Stories map React's AgainstPlainHeaders and Bare; Default, Disabled (`States`), In a table.
- **79 ColumnToggle + ViewToggle + ExportMenu**: visibility checkboxes in a `DropdownMenu`; the table/grid `ToggleGroup`; the export `DropdownMenu` (copy, CSV, print). Stories: each a Playground; ExportMenu's CopyOnly and PrintOnly as scenarios.
- **80 FacetedFilter**: a `Popover` with a `Command` list of options, counts, selected badges and clear. Test selecting two options and clearing. Stories: Playground (Default); With all label.
- **81 Toolbar**: the search `Input`, the faceted filters, the view and column toggles, the export menu and extras, composed. Then replace Task 76's plain-snippet toolbar story with the real one. Stories: Playground (Default); Multiple selections, With extras, With view toggle, No search.
- **82 Round gate:** clean-tree gate, pack check, every round 4b story in both schemes, the deferred list re-checked, `docs/handoff.md` updated, hand over for review.

## Docs

- The plan's commit amends the port spec: the round 4 row and the package-shape paragraph name `@tanstack/svelte-table` 9 and record R4b-2.
- The structure spec's candidate table gains Waterfall under round 5 (R4b-7).
