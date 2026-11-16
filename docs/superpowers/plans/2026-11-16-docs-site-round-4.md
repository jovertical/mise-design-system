# Docs site, round 4: Forms, fields to choices — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline, as rounds 1–3). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pages for seventeen form components: Field, Label, Input, Textarea, InputGroup, NumberInput, QuantityInput, InputOTP, Checkbox, CheckboxGroup, RadioGroup, ChoiceRow, Switch, SwitchField, Toggle, ToggleGroup, ButtonGroup.

**Architecture:** No new machinery. Each page is the round 1 pattern (hero `Preview`, `Anatomy`, examples, "When to use", `ApiTable`, keys where the component takes them), its examples drawn from that component's own stories, which already show what mise thinks each is for. Round 5 does the rest of Forms: Combobox, Calendar, DatePicker, MonthPicker, TimePicker, MediaDropzone and Form (the pickers are overlays and use round 2's inline recipe).

**Tech Stack:** as rounds 1–3.

**Spec:** `docs/specs/2026-11-10-docs-site-design.md`. Conventions: `site/README.md` ("Adding a component page"), rounds 1–3's plans.

## Global Constraints

- Branch `docs/site-round-4`; one pull request into `main` at the end, after the user's word; never push to `main`.
- Commits `docs(site)` or `docs`; nothing moves mise's version.
- Built only from mise; a gap in mise stops the round and is reported.
- Semantic tokens only; the clean-code guide holds.
- Example copy: locations, shifts, orders, stock. An example uses only props its component's source and stories use.
- Gate by exit code before each commit: `pnpm test`, `pnpm build:storybook`, `pnpm --filter mise-docs test`; before the pull request, `pnpm build:pages && pnpm --filter mise-docs smoke`.
- Every commit ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Every page, the same steps

For each component in a task:

1. Read its folder: the Props types and their JSDoc, the `data-slot`s, and its `*.stories.svelte` (the stories named below).
2. Write its `examples/`: a `basic.svelte` hero, one file per example listed, and `anatomy.svelte`. Controls that hold a value bind it to local `$state`.
3. Write `+page.md` in `site/src/routes/components/forms/<folder>/`: frontmatter (`title` the root export, `description` from the Props JSDoc where it has one, `section: Forms`, `order` from the table below), the hero, a sentence or two on what it is for, `## Anatomy` with every `data-slot` the folder renders that a reader would point at (placements chosen in the browser so no line crosses text), `## Examples`, `## When to use` (plain text for components without a page yet: a link to a page that does not exist fails the prerender), `## API reference` with `<ApiTable component="…" />`, and `## Keyboard` where the component takes keys.
4. Look at it in the browser, light and dark: every marker drawn, no crossed lines, examples working.

Sidebar order within Forms (Select, round 2, moves from 1 to 9):

| Order | Page | Order | Page |
| --- | --- | --- | --- |
| 1 | Field | 10 | Checkbox |
| 2 | Label | 11 | CheckboxGroup |
| 3 | Input | 12 | RadioGroup |
| 4 | Textarea | 13 | ChoiceRow |
| 5 | InputGroup | 14 | Switch |
| 6 | NumberInput | 15 | SwitchField |
| 7 | QuantityInput | 16 | Toggle |
| 8 | InputOTP | 17 | ToggleGroup |
| 9 | Select | 18 | ButtonGroup |

## Phases

| Phase | Tasks | Gate |
| --- | --- | --- |
| A | 1–5 | Stop, report, wait for the user |
| B | 6–7 | Stop, report; the pull request on the user's word |

### Task 1: Field and Label

- **Field** (stories: Orientations, States, With addon, In a form card, Grouped with legend). Examples: orientations, states (description, error, disabled), grouped in a `FieldSet` with a `FieldLegend`. Anatomy: `field`, `field-label`, `field-content`, `field-description`, `field-error`, and in a second anatomy or the same example `field-set`, `field-legend`, `field-separator` if they fit cleanly. A paragraph: every input on these pages sits in a `Field`.
- **Label** (stories: With checkbox). Examples: with an input, with a checkbox. Anatomy: `label`. "When to use": `FieldLabel` inside a `Field`; `Label` on its own beside a control outside one.
- Also: Select's `order` becomes 9.
- Commit: `docs(site): the Field and Label pages`.

### Task 2: Input, Textarea, InputGroup

- **Input** (Sizes, States). Examples: sizes, states (invalid, disabled, read-only), in a field. Anatomy: `input`.
- **Textarea** (States, With limit). Examples: states, with a character limit. Anatomy: `textarea`.
- **InputGroup** (With text). Examples: an icon, a prefix or suffix text, a button inside. Anatomy: `input-group`, `input-group-addon`, `input-group-control`, `input-group-button`.
- Commit: `docs(site): the Input, Textarea and InputGroup pages`.

### Task 3: NumberInput, QuantityInput, InputOTP

- **NumberInput** (Formats, Sizes, States, With controls, With prefix, In a field, Bounded, Step, Signed, Precision, Clearable). Examples: formats (currency in integer cents, stated plainly), with controls, bounded and stepped, in a field. Anatomy: `number-input` and its controls (read the rendered DOM for their slots; selectors only if a part has none). A sentence: never `Input type="number"`.
- **QuantityInput** (With menu footer, In a field, Quantity first, Grouped). Examples: in a field, with a menu footer. Anatomy: `quantity-input`, its unit select, `quantity-input-menu-footer` (open inline, round 2's recipe, if the footer is in a menu).
- **InputOTP** (Masked PIN). Examples: a six-digit code, a masked PIN. Anatomy: `input-otp`, `input-otp-group`, `input-otp-slot`, `input-otp-separator`. Keys: arrows, backspace, paste.
- Commit: `docs(site): the NumberInput, QuantityInput and InputOTP pages`.

### Task 4: Checkbox, CheckboxGroup, RadioGroup

- **Checkbox** (States). Examples: states including indeterminate, with a label. Anatomy: `checkbox`, `checkbox-indicator`. Keys: `Space`.
- **CheckboxGroup** (Orientations, States, With description, Long content, In a form). Examples: orientations, with descriptions, in a form. Anatomy: `checkbox-group` and the parts it renders (read the DOM).
- **RadioGroup** (Playground). Examples: basic, with descriptions, horizontal. Anatomy: `radio-group`, `radio-group-item`, `radio-group-indicator`. Keys: arrows move and select.
- Commit: `docs(site): the Checkbox, CheckboxGroup and RadioGroup pages`.

### Task 5: ChoiceRow, Switch, SwitchField

- **ChoiceRow** (States, With checkbox, With media, With revealed content, Static). Examples: radio rows, checkbox rows, with media, with revealed content. Anatomy: `choice-row` and its parts.
- **Switch** (States). Examples: states, with a label. Anatomy: `switch`, `switch-thumb`. Keys: `Space`.
- **SwitchField** (With revealed content, In a card, Stacked bordered, Flush expanding). Examples: with revealed content, stacked in a card. Anatomy: `switch-field` and its parts.
- Commit: `docs(site): the ChoiceRow, Switch and SwitchField pages`.

**Phase A gate:** stop and report.

### Task 6: Toggle, ToggleGroup, ButtonGroup

- **Toggle** (Variants, States, Icon only, Solid, Solid with tooltip). Examples: variants, icon only with an `aria-label`, solid. Anatomy: `toggle`.
- **ToggleGroup** (Variants, Sizes, Icon only). Examples: single and multiple, sizes, icon only. Anatomy: `toggle-group`, `toggle-group-item`. Keys: arrows between items.
- **ButtonGroup** (Orientations, With input, With text). Examples: orientations, with an input, with text. Anatomy: `button-group`, `button-group-separator`, `button-group-text`.
- Commit: `docs(site): the Toggle, ToggleGroup and ButtonGroup pages`.

### Task 7: Smoke, record, stop

- `pnpm build:pages && pnpm --filter mise-docs smoke`: every route ✓, every anatomy fully drawn.
- `docs/handoff.md`: round 3 merged and live, round 4 on its branch, round 5 next.
- Commit `docs: round 4 in the handoff`. Stop and report; push and `gh pr create --base main --title "docs: the docs site, round 4 (Forms: fields to choices)"` on the user's word; watch `check`; merge on the user's word; confirm the live pages.
