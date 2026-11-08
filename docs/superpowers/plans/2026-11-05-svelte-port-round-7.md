# mise-design-system Round 7 Implementation Plan: dates and flows

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline execution, as chosen by the user). Steps use checkbox (`- [ ]`) syntax.

**Goal:** Port the second round after the triage: the date and time controls (`Calendar` with `RangeCalendar`, `DatePicker`, `TimePicker`), two read-only displays (`SegmentedCode`, `Timeline`), and the `Stepper` family (`Stepper`, `StepperNavigation`). The round ends at a Storybook review with the user.

**Architecture:** As in round 6. Each component follows `.claude/skills/authors-components/SKILL.md` and the per-task loop in `docs/superpowers/plans/2026-11-04-svelte-port-round-2.md`, lands in its purpose group (`docs/naming.md` §7), and has its stories on the skeleton (`docs/specs/2026-11-05-story-skeleton-design.md`). This plan states only what differs per component.

**Tech Stack:** bits-ui (`Calendar`, `RangeCalendar`, `Popover`, `Select`) and `@internationalized/date`, both already installed. No new dependency.

**Spec:** `docs/specs/2026-11-05-round-5-triage-design.md`, "Proposed rounds after the gate", round 7. The Stepper family is the triage's merge row, decided here (R7-5).

## Global Constraints

- **The commit gate is `pnpm test` and `pnpm build:storybook`,** both checked by exit code.
- **No new dependency.** React's `react-day-picker` and `date-fns` are replaced by bits-ui and `@internationalized/date` (R7-1).
- **Stories on the skeleton.** Each React story is renamed to its rank's name, merged into an axis or `States`, or kept as a scenario; the commit lists the mapping.
- **Story copy:** generic operations, no pesos and no real names. Dates in stories are fixed (`new CalendarDate(2026, 3, 14)`), never "today", so screenshots do not drift; a story about past dates passes its own `today`.
- **Icons:** Tabler and `lucide-react` to the matching `@lucide/svelte` icon, one file at a time, by its canonical file.
- **Visual check before each phase gate:** the new stories in light and dark. Open overlays (DatePicker) by setting the story's args in the file temporarily, as round 6 did.
- **Phase gates:** stop after Tasks 100 and 103, report in the phase-gates format, and push only after approval.

## Shared decisions

| # | Decision | Ruling |
|---|---|---|
| R7-1 | Date values | `@internationalized/date` throughout, as bits-ui speaks it: a day is a `DateValue` (in practice `CalendarDate`), a range is bits-ui's `DateRange` (`{ start, end }`), a time of day is a `Time`. React passed JS `Date`s, whose time zone and time-of-day parts are noise on a day picker and a trap on a business day. Formatting is `DateFormatter` from the same package, for React's `date-fns` `format` |
| R7-2 | Calendar and RangeCalendar | Two components, as bits-ui and shadcn-svelte have them, for React's one `Calendar` with `mode`. Their values have different types (`DateValue` against `DateRange`), and one component switching primitives on a prop would type `value` as a union every caller narrows. They share the day, cell, grid, header, nav and caption parts, which live in `forms/calendar/` and are exported under `Calendar*` names. React's `classNames` and `components` (react-day-picker's override maps) have no counterpart; the parts are the override. `captionLayout` keeps React's values, with shadcn-svelte's month and year selects for the dropdown layouts |
| R7-3 | Disabled dates | React's `disabledDates` (react-day-picker `Matcher`) becomes bits-ui's `isDateDisabled: (date: DateValue) => boolean`, plus `minValue` and `maxValue` for the common bounds. DatePicker passes them through |
| R7-4 | DatePicker | Keeps React's `mode: 'single' \| 'range'`, a discriminated union on `value`, since a picker is where the caller chooses the shape once. `value` is bindable, `onValueChange` for React's `onChange`. Built on Popover, Button and R7-2's two calendars. The trigger label is `DateFormatter` with `dateStyle: 'medium'` in the calendar's `locale` (default `en-US`) |
| R7-5 | The Stepper family | Stepper and StepperNavigation in one folder, `navigation/stepper/`, the triage's merge row: one family, two parts, not one component. React's `orientation` (`vertical`, `horizontal`, `condensed`, `compact`) becomes `variant`: only two of its values are orientations, and the vocabulary keeps `orientation` for an axis. React's `tourTarget` is dropped (the React package's product tour, as R4b-6). `StepDefinition`'s `icon` and `badge` become snippets |
| R7-6 | TimePicker | React's three Selects (hour, minute, AM/PM), kept: no popover and no dial. `value` is a `Time` (R7-1) where React carried a `Date` whose date part passed through untouched; a caller with a full datetime composes `DatePicker` and `TimePicker` and joins them. A partial pick fills the rest from the current value or 12:00 AM, as React's does |
| R7-7 | Groups | `Calendar`, `RangeCalendar`, `DatePicker` and `TimePicker` in Forms. `SegmentedCode` and `Timeline` in Data display. The Stepper family in Navigation |
| R7-8 | `ReactNode` props | As R6-7: a `Snippet` prop of the same name, `string \| Snippet` where React's was usually a string |

## Phases

- **Phase X (Tasks 96–100):** Calendar + RangeCalendar, DatePicker, TimePicker, SegmentedCode, Timeline
- **Phase Y (Tasks 101–103):** Stepper, StepperNavigation, the round gate

## Per-task specifics

Read every React file a task names, and its stories, before writing the test. Each task's tests cover at least what is listed.

- **96 Calendar + RangeCalendar** (`forms/calendar`, shadcn, R7-1, R7-2): shadcn-svelte's `calendar` and `range-calendar` parts on bits-ui, with React's classes (the `--cell-size` variable, the transparent background inside a card or popover, the ghost day buttons, the range start, middle and end treatments, outside days shown by default). Test: picking a day binds `value`; a range binds `start` then `end` and marks the middle; `isDateDisabled` and `minValue` disable days; the month nav moves the grid. Stories: Playground (Single); Range as `With range`, or a scenario if it reads better as RangeCalendar's own Playground; a caption-dropdown scenario.
- **97 DatePicker** (`forms/date-picker`, the React package, R7-3, R7-4): trigger Button with the calendar icon and the formatted value or `placeholder`, Popover, the calendar for `mode`. Test: opening, picking a day closes and binds; range picks both ends; the trigger shows the formatted value; `disabled`; a disabled date cannot be picked. Stories: Playground (Single); States (Disabled); With range (Range); DisabledPastDates as a scenario with a fixed `today`.
- **98 TimePicker** (`forms/time-picker`, the React package, R7-6): three Selects. Test: each select binds its part, a partial pick fills the rest, 12 AM and 12 PM map to 0 and 12. Stories: Playground (Prefilled); States (Empty, Disabled).
- **99 SegmentedCode** (`data-display/segmented-code`, the React package): a code split into `groups` of characters, `size`, tone if React has one. Test the grouping, each size's classes, and a value shorter than the groups. Stories: Playground (LicenceKey, renamed to a generic key); Sizes; PairingCode as a scenario.
- **100 Timeline** (`data-display/timeline`, the React package): `Timeline`, `TimelineItem`, `TimelineDot` (tone, indicator), `TimelineConnector`, `TimelineTitle`, `TimelineContent`, `TimelineSkeleton`. Test the `ol`/`li` structure, the dot's tone classes, the connector, and the skeleton's count. Stories: Playground (Activity); Tones; States (Loading); Without icons, With presence as `With …`; ShortEntries as a scenario. Phase X's report includes the visual check.
- **101 Stepper** (`navigation/stepper`, the React package, R7-5): the largest port (456 React lines, 10 stories). Steps with name, description, optional, icon and badge; completion by position or `completedSteps`; the four variants; `showProgress` and `showCurrentStep`; selectable steps as buttons through `onStepSelect` and `selectableSteps`. Test: completion both ways, the current step's `aria-current="step"`, each variant's structure, the compact readout and bar, selectable chips as buttons and the rest not. Stories: Playground (Vertical); Variants (Vertical, Horizontal, Condensed, Compact); With … for the progress and current-step switches (CondensedWithoutLabel, CompactWithoutProgress); CondensedShort, CondensedWithSkips, ExplicitCompletion and Selectable as scenarios.
- **102 StepperNavigation** (same folder, the React package): Back and Next with labels, disabled and loading states, `leading` and `trailing` snippets. Test each button's callback, `nextLoading` disabling Next with a spinner, and the first step hiding or disabling Back as React does. Stories: Playground (Default); States (FirstStep, Submitting); With skip, With cancel; BelowTheStepBody as `In a step body` or a scenario.
- **103 Round gate:** clean-tree gate, pack check, every round 7 story in both schemes, the deferred list re-checked, `docs/handoff.md` updated, hand over for review.

## Docs

- The plan's commit adds nothing to the specs; R7-1 is recorded where it lands, on each module's `Diverged:` line.
- Task 101 updates the structure spec's candidate table: the Stepper row reads "one family in round 7 (R7-5)".
- Task 103 updates `docs/handoff.md`.
