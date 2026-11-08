# mise-design-system Round 4a Implementation Plan: metrics and stats

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline execution, as chosen by the user). Steps use checkbox (`- [ ]`) syntax.

**Goal:** Port the half of round 4 that needs no new dependency: the figures, bars and tiles of a dashboard, plus the four components they stand on. The round ends at a Storybook review with the user. Round 4b (Table, Command, the DataTable family, Chart) follows, once the user has installed `@tanstack/table-core` and `layerchart`.

**Architecture:** As in rounds 2 and 3. Each component follows `.claude/skills/authors-components/SKILL.md` and the per-task loop in `docs/superpowers/plans/2026-11-04-svelte-port-round-2.md`, lands in its purpose group (`docs/naming.md` §7), and has its stories on the skeleton (`docs/specs/2026-11-05-story-skeleton-design.md`). This plan states only what differs per component.

**Spec:** `docs/specs/2026-11-04-svelte-port-design.md`, "Rounds", row 4, split in two with the user on 2026-11-05. Merges follow `docs/specs/2026-11-05-structure-design.md` S7.

## Global Constraints

- **The commit gate is `pnpm test` and `pnpm build:storybook`,** both checked by exit code.
- **No new dependency.** Progress comes from bits-ui, already installed. Sparkline is plain SVG.
- **Stories on the skeleton.** Each React story is renamed to its rank's name, merged into an axis or `States`, or kept as a scenario; the commit lists the mapping. `tests/stories.test.ts` enforces it.
- **Story copy:** generic operations, no pesos and no real names. React's `₱` becomes `$`.
- **Icons:** `@tabler/icons-react` becomes the matching `@lucide/svelte` icon, imported one file at a time (D8).
- **Visual check before each phase gate:** the new stories in light and dark.
- **Phase gates:** stop after Tasks 65, 70 and 72, report in the phase-gates format, and push only after approval.

## Shared decisions

| # | Decision | Ruling |
|---|---|---|
| R4-1 | The Fact family | Merged (user, 2026-11-05). `FactList` (the `dl`) and `FactListItem`, with `orientation: 'horizontal' \| 'vertical'`, default `horizontal`. Horizontal is React's `FactRow`: label left, value right, `items-baseline justify-between`, `tabular-nums` value. Vertical is React's `FactField`: label above value, with `icon` and `iconShape` (vertical only). Each item renders `<div>` around its `dt`/`dd` pair, which HTML allows in a `dl`. `FactList` keeps React's `compact`. Both modules record the merge on `Diverged:` |
| R4-2 | The Metric components | Kept apart, not merged. `MetricBar` (one figure, bar indented), `MetricRow` (several labelled figures, full-width bar), `MetricGrid` (the breakdown as a grid) and `StatTile` answer different questions, and React's comments say which. They already share a prefix. Recorded in the structure spec's candidate table |
| R4-3 | Sparkline | Plain SVG: a `<polyline>` (and an area `<path>` if React draws one) scaled into a `viewBox`, no chart library. React uses recharts only to draw a line; a dependency for that is not worth its weight |
| R4-4 | Groups | `Progress` in Feedback. `CardGrid` and `CardList` in Layout. Everything else in Data display |
| R4-5 | `ReactNode` props | As R3-4: a `Snippet` prop of the same name, typed `string \| Snippet` where React's was usually a string |
| R4-6 | Deferred stories | Ported in the task that unblocks them: Dialog's GenerateAndDownload (Task 61), Card's AsAList (Task 62) and ProgressPanel (Task 69). Card's TitleWithHint and Tooltip's InBothThemes stay deferred on Hint. CardList's WithItemRows is deferred on Item |

## Phases

- **Phase P (Tasks 61–65):** Progress, CardGrid + CardList, the Fact family, DeltaBadge, Sparkline
- **Phase Q (Tasks 66–70):** MetricBar + MetricRank, MetricRow, MetricGrid, RadialStat, SegmentedBar
- **Phase R (Tasks 71–72):** StatTile, the round gate

## Per-task specifics

Read every React file a task names, and its stories, before writing the test. Each task's tests cover at least what is listed.

- **61 Progress** (`feedback/progress`, shadcn): bits-ui `Progress`. Test the indicator's `transform` for a value, `role="progressbar"` with `aria-valuenow`, and `data-slot`. Stories: Playground (React's Default merges into it). Then port Dialog's GenerateAndDownload, and drop its "Deferred" comment.
- **62 CardGrid + CardList** (`layout/card-grid`, `layout/card-list`, the React package), one commit each. CardGrid: `items` and `columns` (2, 3, 4), bordered cells; test the column classes. Stories: Playground (Plain), Sizes or a `Columns` scenario for FourColumns (an axis if `columns` reads as one). CardList: the negative margin reads `--card-spacing`, `divide-y` with its colour, `compact`; test both. Stories: Playground (Basic), With … for PlainRows, CompactRows; WithItemRows deferred on Item. Then port Card's AsAList.
- **63 Fact family** (`data-display/fact-list`, the React package, merged per R4-1): test the `dl` > `div` > `dt` + `dd` structure, both orientations' classes, the icon chip only in vertical, `compact`, and a missing value rendering React's placeholder. Stories: Playground; Orientations (horizontal, vertical); With icon; States if a missing value has a treatment; then React's scenarios (TwoBlocks, TotalsBlock, IdentityStrip, GroupedFacts, TwoLineValue, Multiline) under their own names.
- **64 DeltaBadge** (`data-display/delta-badge`, the React package): sign → tone (up `success`, down `critical`, zero flat and muted), `invert`, units, the currency prefix. Test each. Stories: Playground; Variants; then Directions, Inverted, Units, Currency prefix as scenarios, or Directions as `States` if it reads as one.
- **65 Sparkline** (`data-display/sparkline`, the React package, R4-3): points scale into the `viewBox`; tone sets the stroke from `TONE_STROKE_CLASS`; fewer than two points renders React's not-enough-data treatment. Test the polyline's point count and the empty case. Stories: Playground; Tones; Direction and NotEnoughData as scenarios (or `States` for the latter).
- **66 MetricBar + MetricRank** (`data-display/metric-bar`, the React package): figure on the label's line, bar indented past the chip, tone on the fill only, clamping above 100. MetricRank: the muted `size-6` circle. Stories: Playground; Tones (Toned); With context; Long content or Clamped as a scenario; ByStatus and Ranked as scenarios.
- **67 MetricRow** (`data-display/metric-row`, the React package): several labelled stats, the full-width bar, the inline-bar variant, clamping. Stories map InCardList to `In a card list`, the rest to With … or scenarios.
- **68 MetricGrid** (`data-display/metric-grid`, the React package): `CardGrid` with a `MetricBar` per cell. Stories: Playground (ByCategory); Two columns; Toned as Tones.
- **69 RadialStat** (`data-display/radial-stat`, the React package): stroke and cap derived from the diameter, `thickness`, tone, value bounds. Test the arc length for a value and the clamp at 0 and 100. Stories: Playground; Sizes; Tones; Thickness as `Weights`, or a new `Thicknesses` axis added to the test; Small shares and Bounds as scenarios; HealthList as `In a list`. Then port Card's ProgressPanel.
- **70 SegmentedBar** (`data-display/segmented-bar`, the React package): widths as shares, the neutral segment as track colour, labels dropped below about 6 %, `size`, the empty bar. Stories: Playground (Basic); Sizes (Slim); States (Empty); Narrow segments and Bare as scenarios.
- **71 StatTile** (`data-display/stat-tile`, the React package): the largest port (554 React lines, 19 stories). Its rows are `FactListItem`s (R4-1). Test tone and icon tone, `size`, `surface`, the loading and error states, the corner action and the footer. Stories: Playground (Row); Matrix if size × icon size is a real cross; Sizes, Tones, Shapes, Surfaces (a new axis name if needed); States (LoadingAndError); With delta, With corner action, With footer, With rows, With visual, With units; the rest as scenarios. Expect it to take most of Phase R.
- **72 Round gate:** clean-tree gate, pack check, every round 4a story screenshotted in both schemes, the deferred list re-checked, hand over for review.

## Docs

- Task 63 updates the structure spec's candidate table: the Fact row reads "merged in round 4a", the Metric row "kept apart in round 4a (R4-2)".
- Task 72 updates `docs/handoff.md`.
