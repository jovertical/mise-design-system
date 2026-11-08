# mise-design-system Round 6 Implementation Plan: overlays and forms

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline execution, as chosen by the user). Steps use checkbox (`- [ ]`) syntax.

**Goal:** Port the first round after the triage: the small overlays (`Hint`, `HoverCard`, `Drawer`), `Collapsible`, and the form controls (`ButtonGroup`, `SwitchField`, `ChoiceRow`, `InputOTP`, `Combobox`, `NumberInput`, `QuantityInput`, `Form`). Hint unblocks two deferred stories. The round ends at a Storybook review with the user.

**Architecture:** As in rounds 4a and 4b. Each component follows `.claude/skills/authors-components/SKILL.md` and the per-task loop in `docs/superpowers/plans/2026-11-04-svelte-port-round-2.md`, lands in its purpose group (`docs/naming.md` §7), and has its stories on the skeleton (`docs/specs/2026-11-05-story-skeleton-design.md`). This plan states only what differs per component.

**Tech Stack:** bits-ui (`Tooltip`, `LinkPreview`, `Collapsible`, `PinInput`, `Combobox`), `vaul-svelte` 1 for Drawer, `formsnap` 2 on `sveltekit-superforms` 3 for Form.

**Spec:** `docs/specs/2026-11-05-round-5-triage-design.md`, "Proposed rounds after the gate", round 6. Merges follow `docs/specs/2026-11-05-structure-design.md` and are decided here (R6-3, R6-4).

## Global Constraints

- **The commit gate is `pnpm test` and `pnpm build:storybook`,** both checked by exit code.
- **New dependencies, installed by the user before the task that needs them:**
  - Before Task 87 (Drawer): `pnpm add vaul-svelte@1.0.0-next.7`, the Svelte 5 line shadcn-svelte pins. `latest` (0.3.2) is the Svelte 4 line.
  - Before Task 94 (Form): `pnpm add -D formsnap sveltekit-superforms zod`. The plan then moves `formsnap` and `sveltekit-superforms` into optional peers (R6-5); `zod` stays a dev dependency, used only by tests and stories.
  - Nothing else. Hint, HoverCard, Collapsible, InputOTP and Combobox are bits-ui, already installed.
- **Stories on the skeleton.** Each React story is renamed to its rank's name, merged into an axis or `States`, or kept as a scenario; the commit lists the mapping. `tests/stories.test.ts` enforces it.
- **Story copy:** generic operations, no pesos and no real names. React's `₱` becomes `$`.
- **Icons:** Tabler to the matching Lucide icon, one file at a time, by its canonical file (the handoff's alias note).
- **Visual check before each phase gate:** the new stories in light and dark.
- **Phase gates:** stop after Tasks 87, 92 and 95, report in the phase-gates format, and push only after approval.

## Shared decisions

| # | Decision | Ruling |
|---|---|---|
| R6-1 | Groups | `Hint`, `HoverCard` and `Drawer` in Overlays. `Collapsible` in Layout. `ButtonGroup`, `SwitchField`, `ChoiceRow`, `InputOTP`, `Combobox`, `NumberInput`, `QuantityInput` and `Form` in Forms |
| R6-2 | Primitives | bits-ui wherever it has the primitive: `LinkPreview` for HoverCard (bits-ui's name; the mise parts keep `HoverCard*`), `Collapsible`, `PinInput` for InputOTP, `Combobox` for React's base-ui Combobox. Each bits-ui name that differs from React's goes on `Diverged:` |
| R6-3 | The NumberInput merge | `NumberInput` absorbs CountInput, DecimalInput and CurrencyInput. One text field with a numeric keypad (never `type="number"`, for React's reasons), a focus draft, and a commit on blur. Props: `format: 'integer' \| 'decimal' \| 'currency'` (default `decimal`); `value: number \| null`, bindable; `min` (default `0`; a negative floor allows a minus sign), `max`, `step` (default `1`; Shift moves ten times), `precision` (decimal only; `integer` is 0, `currency` is 2); `clearable` (default `true`: an emptied field commits `null`; `false` commits `min`, CountInput's behaviour); `controls` (default `false`: the − and + buttons in an `InputGroup`, each disabled at its end of the range); `prefix` (a string or snippet ahead of the number). `currency` speaks minor units: `value` is an integer count of cents, shown with two places, and only two places can be typed. No default currency symbol. Defaults do not change with `format`, so a reader never has to know one to predict another |
| R6-4 | QuantityInput | Kept as its own component, composing `NumberInput` (`format="decimal"`) and `Select`. It has a second value (the unit), its own layout axis and a grouped unit menu, which a `format` cannot carry. This amends the triage's merge row: NumberInput absorbs three, not four |
| R6-5 | Form and its dependencies | shadcn-svelte's Form parts on `formsnap`, ported from its registry, with the classes moved onto mise's `Field` family where the two overlap. Form ships from a **separate entry point**, `mise/form` (`src/lib/form.ts`, a `./form` export in `package.json`), and never from the main barrel. `formsnap` and `sveltekit-superforms` are `peerDependencies` marked optional in `peerDependenciesMeta`. Why: superforms 3 needs `@sveltejs/kit` and Svelte ≥ 5.56.4, while mise's peer range is any Svelte 5 and its consumers include Inertia apps with no Kit. A consumer who never imports `mise/form` installs nothing new |
| R6-6 | React's comma handling | React's DecimalInput drops a comma as a pasted thousands separator, "this is a peso application". Kept, since `.` as the decimal point is the only one either package accepts, and recorded on `Diverged:` with the reason reworded generically. Locale-aware separators are out of scope |
| R6-7 | `ReactNode` props | As R4-5: a `Snippet` prop of the same name, typed `string \| Snippet` where React's was usually a string. QuantityInput's `menuFooter(closeMenu)` becomes a snippet taking `closeMenu` |
| R6-8 | Deferred stories | Ported in Task 83, once Hint exists: Tooltip's InBothThemes and Card's TitleWithHint, with their "Deferred" comments dropped. CardList's WithItemRows stays deferred on Item (round 8) |

## Phases

- **Phase U (Tasks 83–87):** Hint, HoverCard, Collapsible, ButtonGroup, Drawer
- **Phase V (Tasks 88–92):** SwitchField, ChoiceRow, InputOTP, Combobox, NumberInput
- **Phase W (Tasks 93–95):** QuantityInput, Form, the round gate

## Per-task specifics

Read every React file a task names, and its stories, before writing the test. Each task's tests cover at least what is listed.

- **83 Hint** (`overlays/hint`, the React package): a `button` with the help icon inside `Tooltip`, `aria-label` from `label` with React's "More info" fallback. Test the button's accessible name both ways and that focus opens the tooltip. Stories: Playground; In a card title (OnACardTitle), In a stat tile (OnAStatTile, through StatTile's `hint` snippet); WhenNotTo as a scenario. Then R6-8.
- **84 HoverCard** (`overlays/hover-card`, shadcn, R6-2): `HoverCard`, `HoverCardTrigger`, `HoverCardContent`. Test that the content opens on the trigger's focus and has its `data-slot`. Stories: Playground (Default).
- **85 Collapsible** (`layout/collapsible`, shadcn, R6-2): the three parts, unstyled as React's are. Test that the trigger toggles the content and `aria-expanded`. Stories: Playground (Default).
- **86 ButtonGroup** (`forms/button-group`, shadcn): `ButtonGroup`, `ButtonGroupSeparator`, `ButtonGroupText`, with `orientation`. Test the orientation classes, `role="group"` and the separator. Stories: Playground (Default); Orientations (Vertical); With input, With text.
- **87 Drawer** (`overlays/drawer`, shadcn, on `vaul-svelte`): the parts React exports, with `direction`. Ask the user to install `vaul-svelte` first (Global Constraints). Test that the trigger opens it, the title names the dialog, and close closes it. Stories: Playground (Default); Sides (FromTheSide, and the other directions), as Sheet's axis.
- **88 SwitchField** (`forms/switch-field`, the React package): `Field` + `Switch` in a row, the description, the content revealed when on, and React's bordered and flush treatments. Test that the label toggles the switch and the revealed content follows `checked`. Stories: Playground (Basic); With revealed content (Expanding); In a card (StackedInACard); StackedBordered and FlushExpanding as scenarios.
- **89 ChoiceRow** (`forms/choice-row`, the React package): a whole-row label around a radio or checkbox, with badge, media, revealed content and the static (no control) form. Test that a click anywhere on the row checks it, the disabled row, and the revealed content. Stories: Playground (WithRadio); States (DisabledWithBadge); With checkbox, With media, With revealed content; Static as a scenario.
- **90 InputOTP** (`forms/input-otp`, shadcn, R6-2): `InputOTP`, `InputOTPGroup`, `InputOTPSlot`, `InputOTPSeparator` on `PinInput`. Test that typing fills the slots in order, that paste fills them, and the masked form. Stories: Playground (Default); Masked PIN as a scenario.
- **91 Combobox** (`forms/combobox`, the React package on bits-ui, R6-2): the parts React exports, including the trigger and clear buttons (`showTrigger`, `showClear`) and the multiple-value chips (`showRemove`), on `InputGroup` as React's are. base-ui ships `Chips` and `Chip`; bits-ui does not, so mise composes them from the selected values (a chip and its remove button per value), recorded on `Diverged:`. Test filtering by typed text, picking an option, clearing, the empty state, and removing a chip. Stories: Playground (Default); With chips, for the multiple form.
- **92 NumberInput** (`forms/number-input`, the React package, merged per R6-3 and R6-6): test the draft held through "0." and "-", blur clamping to `min` and `max`, an emptied field committing `null` and, with `clearable={false}`, `min`; the arrow keys and Shift; the controls stepping and disabling at each end; `precision` capping typed places; a pasted "1,500" reading as 1500; currency taking 1999 in and showing "19.99", and "1." surviving the keystroke; 0.1 + 0.2 stepping to 0.3. Stories: Playground; a `Formats` axis (integer, decimal, currency), added to `AXES` in `tests/stories.test.ts`; States (Disabled, Empty); With controls (React's CountInput Default), With prefix (OtherCurrency); In a field; Bounded, Step, Signed, Precision and Clearable as scenarios. The module's `Diverged:` line names the three React components it replaces. Phase V's report includes the visual check.
- **93 QuantityInput** (`forms/quantity-input`, the React package, R6-4): `units` with `label`, `short` and `group`, `layout` (`unit-first`, `quantity-first`), the unit and the quantity each bindable, `groupHints`, the `menuFooter` snippet (R6-7), and the trigger showing `short`. Test choosing a unit, typing a quantity, both layouts' order, and the grouped menu. Stories: Playground (Default); Quantity first, In a field, Grouped, With menu footer, as React's.
- **94 Form** (`forms/form`, shadcn, R6-5): ask the user to install the three packages first (Global Constraints). First, a spike: render one `superForm` in SPA mode with a zod schema, in vitest's jsdom and in Storybook. If either cannot run outside a Kit app, stop and report before writing parts. Then the parts shadcn-svelte's registry ships (`FormField`, `FormControl`, `FormLabel`, `FormDescription`, `FormFieldErrors`, `FormFieldset`, `FormLegend`, `FormElementField`, `FormButton`), the `./form` export, the optional peers, and an `EXPECTED_EXPORTS` list for the `mise/form` entry beside the main one. Test that a field's label points at its control, that a failed validation shows the errors and sets `aria-invalid`, and that the main barrel exports no `Form*` name. Stories: Playground (Default, React's one story, rebuilt on superforms).
- **95 Round gate:** clean-tree gate, pack check (the `./form` entry is in the tarball and the main entry does not import `formsnap`), every round 6 story screenshotted in both schemes, the deferred list re-checked, `docs/handoff.md` updated, hand over for review.

## Docs

- The plan's commit amends the triage's merge row and the structure spec's candidate table: NumberInput absorbs CountInput, DecimalInput and CurrencyInput; QuantityInput is kept and composes it (R6-4).
- Task 87 adds `vaul-svelte` to the port spec's dependency rows; Task 94 adds the `mise/form` entry and its optional peers to the package-shape paragraph (R6-5).
- Task 95 updates `docs/handoff.md`.
