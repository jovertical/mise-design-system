# mise-design-system Round 2 Implementation Plan: forms and overlays

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (the user chose inline execution) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port round 2 of the spec, plus the two pieces it depends on (`Separator`, `segmented-control`). That is 17 components: `Field`, `InputGroup`, `Textarea`, `Select`, `Switch`, `RadioGroup`, `Tabs`, `Toggle`, `ToggleGroup`, `Tooltip`, `Popover`, `DropdownMenu`, `Sheet`, `AlertDialog`, `Alert`, `Avatar` and toasts. The round ends at a Storybook review with the user.

**Architecture:** Each component follows the round 1 pattern exactly. The pattern is written down in `.claude/skills/authors-components/SKILL.md` and was worked through in Tasks 10–15 of `docs/superpowers/plans/2026-11-04-svelte-port-rounds-0-1.md`:
- one folder per family;
- an `Origin:` / `Svelte:` / `Diverged:` header on every module;
- `<Part>Props` exported from `<script module>`;
- React classes copied character for character, bits-ui mechanics taken from shadcn-svelte;
- a barrel line and `EXPECTED_EXPORTS` entries;
- a behaviour test, and stories ported by name with `asChild`.

This plan states only what differs per component. Anything it does not state follows the skill.

**Tech Stack:** As in round 0–1, plus `svelte-sonner` 1.2 for toasts.

**Spec:** `docs/specs/2026-11-04-svelte-port-design.md`, "Rounds", row 2.

## Global Constraints

Everything in the round 0–1 plan's Global Constraints still applies, plus:

- **Story copy:** generic operations only (locations, shifts, orders, stock, registers). Every story uses `asChild` or a `{#snippet template(args)}` (`tests/stories.test.ts`).
- **Commits and the gate:** commit only after `pnpm test` exits 0. Each component, its tests and its stories are one commit, `feat(<component>): …`.
- **Before each phase gate:** `pnpm build:storybook` must succeed, and every ported story must appear in `storybook-static/index.json`.
- **Phase gates:** stop after Tasks 21, 26, 31 and 35, and report in the phase-gates format.
- **Push:** only after the user approves a gate, then watch CI.
- **Stories that need an unported component are deferred,** with a comment at the top of the story file naming the blocker. When a later task in this round ports the blocker, that task adds the deferred story.

## Shared decisions

| # | Decision | Ruling |
|---|---|---|
| R2-1 | `segmented-control.ts` | It is a pure class module with no component and no story, so it goes to `src/lib/utils/segmented-control.ts`. Its exports are added to the barrel by name and to `EXPECTED_EXPORTS`. The header keeps its `Origin: the React package` meaning as a plain comment. The provenance suite covers `src/lib/components/` only. |
| R2-2 | Separator | Ported in Task 17, because `Field` and its stories use it. |
| R2-3 | Toaster theme | The React `Toaster` resolves light or dark from the package's `ThemeProvider`, and mise has none (D6). mise's `Toaster` takes `theme?: 'light' \| 'dark' \| 'system'`. When `theme` is not given, it follows the `.dark` class on `<html>` through a `MutationObserver`, the same class every other component answers to. It never hands `system` to svelte-sonner, which is the bug the React header records. |
| R2-4 | Toast styling | The toast block from the React `components.css` comes back as `.mise-toast`, remapped onto the role ramps: success → `--color-success-*`, error → `--color-critical-*`, warning → `--color-warning-*`, info → `--color-info-*`. The Sonner description and title rules come back unchanged. |
| R2-5 | Tooltip provider | bits-ui 2 needs a `Tooltip.Provider`. `Tooltip` wraps its root in a provider with `delayDuration = 0` unless the caller sets `delayDuration`, as the React `Tooltip` does with Radix. `TooltipProvider` is also exported for apps that want one at the root. |
| R2-6 | `Hint` | It appears in Tooltip stories and is not in this round. Those stories are deferred. |
| R2-7 | Form libraries | The React stories that use `react-hook-form` become plain forms. |

## Task order and phases

The order is chosen so that a story's dependencies are ported before it whenever the round allows.

- **Phase E (Tasks 17–21):** Separator + segmented-control, Textarea, Switch, RadioGroup, Tooltip
- **Phase F (Tasks 22–26):** Toggle, ToggleGroup, Tabs, Select, InputGroup
- **Phase G (Tasks 27–31):** Popover, DropdownMenu, Sheet, AlertDialog, Alert
- **Phase H (Tasks 32–35):** Avatar, toasts, Field, the round gate

---

## The per-task loop

Every component task runs these steps. Each task below lists only its specifics.

- [ ] **1. Read.** `<react-package>/src/components/<name>.tsx` and `<name>.stories.tsx`, then `/tmp/shadcn-svelte-ref/docs/src/lib/registry/ui/<name>/`.
- [ ] **2. Test first.** Write `tests/<name>.test.ts`, plus a fixture in `tests/fixtures/` when parts compose or state binds. Use the assertions the task lists, with roles, accessible names, `data-slot` and `data-state` first. Run it and see it fail on the missing export.
- [ ] **3. Write the parts** in `src/lib/components/<name>/`, then `index.ts`, the barrel line (alphabetical) and the `EXPECTED_EXPORTS` entries.
- [ ] **4. Run the test** and see it pass.
- [ ] **5. Port the stories** the task lists, with `asChild`, and add the deferral comment for any deferred story.
- [ ] **6. Gate:** `pnpm biome check --write src stories tests`, then `pnpm test`, which must exit 0. Then `pnpm build:storybook`, and check the story ids in `storybook-static/index.json`.
- [ ] **7. Commit:** `feat(<name>): …`, with a body naming any divergence and any deferred story.

---

# Phase E — Tasks 17–21

### Task 17: Separator and segmented-control

**Files:**
- Create: `src/lib/components/separator/{separator.svelte,index.ts,separator.stories.svelte}` and `src/lib/utils/segmented-control.ts`
- Modify: `src/lib/index.ts`, `tests/barrel.test.ts`
- Test: `tests/separator.test.ts`

- **Separator:** bits-ui `Separator.Root`, classes from `separator.tsx`, and `orientation` and `decorative` as in React. React has no `separator.stories.tsx` story file, so write one with two stories, **Horizontal** and **Vertical**, tagged from the header.
- **segmented-control.ts:** copied verbatim from the React `src/components/segmented-control.ts`, with any import path changed to `.js`. Its exports go into the barrel by name.
- **Tests:**
  - `data-slot="separator"`, and `data-orientation` follows the prop.
  - A decorative separator has `role="none"`; a non-decorative one has `role="separator"`. Confirm this against bits-ui's output, and assert what bits-ui renders.
  - The barrel exports the segmented-control names.

### Task 18: Textarea

- Plain `<textarea>` with `bind:value` and React's classes. Read `textarea.tsx` for any prop beyond the attributes (its stories `WithLimit` and `BelowMinimum` suggest a character-limit feature), and port it with the same names and defaults.
- **Tests:**
  - the value binds;
  - the limit or minimum behaviour renders what the React component renders, for example a counter's text;
  - `aria-invalid` passes through.
- **Stories:** Plain, WithLimit, BelowMinimum.

### Task 19: Switch

- bits-ui `Switch.Root` + `Switch.Thumb`, with `bind:checked`.
- **Tests:**
  - `role="switch"`;
  - `aria-checked` and `data-state` follow a click;
  - the label toggles it;
  - disabled ignores clicks.
- **Stories:** Default, States.

### Task 20: RadioGroup

- bits-ui `RadioGroup.Root` / `RadioGroup.Item`, with `bind:value`. The indicator draws the React icon (lucide `circle`) when the item is checked, through the item's `children({ checked })` snippet.
- **Tests:**
  - `role="radiogroup"` and `role="radio"`;
  - clicking an item selects it and binds `value`;
  - the arrow keys move the selection.
- **Stories:** Default.

### Task 21: Tooltip

- Parts: `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider` (R2-5). Content classes, arrow and sides as in React. The trigger keeps `child` for `asChild`.
- **Tests:**
  - With `open` bound true, the content renders with `role="tooltip"` and the text.
  - Hovering or focusing the trigger opens it. If jsdom cannot drive bits-ui's pointer logic, test focus only, and say so in a comment.
  - The provider default `delayDuration` is 0.
- **Stories:**
  - **Default** and **Sides** are ported.
  - **InBothThemes** is ported if it needs only the scheme toolbar; otherwise it is deferred.
  - Any story using `Hint` is deferred (R2-6).

### Phase E gate

Stop. Report, wait for approval, push and watch CI.

---

# Phase F — Tasks 22–26

### Task 22: Toggle

- bits-ui `Toggle.Root` with `bind:pressed`. Variants and sizes come from `toggle.tsx`, which reads `utils/segmented-control.ts`. If it has a cva map, it goes to `toggle-variants.ts`.
- **Tests:**
  - `aria-pressed` and `data-state` follow a click;
  - the variant and size classes;
  - disabled.
- **Stories:**
  - Default, Variants, IconOnly and Solid are ported.
  - **SolidWithTooltip** is ported too; Tooltip is in from Task 21.

### Task 23: ToggleGroup

- bits-ui `ToggleGroup.Root` / `ToggleGroup.Item`, with `type` single or multiple and `bind:value`. The items read the group's variant and size through context, as the React component does: bits-ui context or Svelte `setContext`, whichever shadcn-svelte uses.
- **Tests:**
  - single type: one item pressed at a time, and `value` binds;
  - multiple type: an array value;
  - an item inherits the group's variant classes.
- **Stories:** Segmented, Outline, SegmentedSizes, SegmentedIconOnly.

### Task 24: Tabs

- bits-ui `Tabs`: `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`. The list and trigger classes come from `segmented-control.ts`, as in React.
- **Tests:**
  - roles `tablist`, `tab` and `tabpanel`;
  - clicking a tab shows its panel and binds `value`;
  - a disabled trigger does not activate;
  - the arrow keys move focus.
- **Stories:** Basic, OnThePageSurface, InsideACard, InACardHeader, WithContent, DisabledTrigger, FullWidth.

### Task 25: Select

- bits-ui `Select`. bits-ui 2's Select is item-driven, so use shadcn-svelte's part set and map React's parts onto it: `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectGroup`, `SelectLabel`, `SelectSeparator`, plus whatever `select.tsx` exports that bits-ui supports. React's `SelectValue` has no bits-ui part. Follow shadcn-svelte, where the trigger renders the selected label, and record it on `Diverged:`. Trigger sizes and classes as in React.
- **Tests:**
  - the trigger opens a `listbox`;
  - choosing an option binds `value` and shows its label in the trigger;
  - a disabled item cannot be chosen.
  - jsdom may need extra stubs for bits-ui's floating layer. Add them to `tests/setup.ts` with a comment.
- **Stories:** Default, Small.

### Task 26: InputGroup

- Parts as exported by `input-group.tsx`, built on `Input` and `Button`. A React `ReactNode` addon becomes a snippet or children per part.
- **Tests:**
  - the addon and the input render inside the group's `data-slot`;
  - clicking an addon focuses the input, if React does that;
  - an inline button renders as `Button`.
- **Stories:** Default, WithText.

### Phase F gate

Stop. Report, wait for approval, push and watch CI.

---

# Phase G — Tasks 27–31

### Task 27: Popover

- bits-ui `Popover`: `Popover`, `PopoverTrigger`, `PopoverContent`, plus anything else `popover.tsx` exports.
- **Tests:**
  - the trigger opens the content (`role="dialog"`) and `open` binds;
  - Escape closes it.
- **Stories:** Basic, AsAForm, ShortList, ScrollingList.

### Task 28: DropdownMenu

- bits-ui `DropdownMenu`, with every part `dropdown-menu.tsx` exports: item, checkbox item, radio group and item, label, separator, shortcut, sub-menu. Item tones and variants as in React, including the destructive row.
- **Tests:**
  - the trigger opens a `menu`;
  - selecting an item fires `onSelect` and closes;
  - a checkbox item toggles `aria-checked`;
  - a destructive item carries its class or `data-variant`.
- **Stories:** Basic, EveryRowKind, Destructive.

### Task 29: Sheet

- bits-ui `Dialog` styled as a sheet, with a `side` prop as in React. The parts mirror Dialog's.
- **Tests:**
  - opens to `role="dialog"`;
  - `data-side` or the side classes follow `side`;
  - the close button and Escape close it.
- **Stories:** Default, FromTheLeft.

### Task 30: AlertDialog

- bits-ui `AlertDialog`. `AlertDialogAction` and `AlertDialogCancel` render with `buttonVariants`, as in React, and keep React's `size` prop (Small story).
- **Tests:**
  - opens to `role="alertdialog"` with its title and description;
  - Cancel and Action close it;
  - Escape closes it;
  - an outside click does not, if bits-ui's alert dialog behaves that way. Assert what it does.
- **Stories:** Default, Small.

### Task 31: Alert

- Plain parts from `alert.tsx` (`Alert`, `AlertTitle`, `AlertDescription`, plus any action part), with `tone` and `variant` as React has them. A `ReactNode` icon or action becomes a snippet prop rendered in a `div`.
- **Tests:**
  - `role="alert"`, if React sets it;
  - the tone classes;
  - an action snippet renders in its slot.
- **Stories:** Variants, WithTitle, WithAndWithoutIcon, PartsAlone, LongContent, RichDescription, OnAPage, WithAction, WithActions, WithActionOnAPhone.

### Phase G gate

Stop. Report, wait for approval, push and watch CI.

---

# Phase H — Tasks 32–35

### Task 32: Avatar

- bits-ui `Avatar`: `Avatar`, `AvatarImage`, `AvatarFallback`, plus `size` and any status/presence parts `avatar.tsx` exports.
- **Tests:**
  - the fallback shows when the image has no `src`, or before it loads;
  - the size classes;
  - the status part's tone, if present.
- **Stories:** Default, Sizes, WithStatus, Presence.

### Task 33: Toasts

**Needs the user:** run `pnpm add svelte-sonner@^1.2.3` before this task starts.

- `Toaster` wraps svelte-sonner's `Toaster`, with the R2-3 theme logic, the React icons (lucide `circle-check`, `info`, `loader-circle`, `octagon-x`, `triangle-alert`) and the `mise-toast` class. Also export `toast`, re-exported from svelte-sonner, as React re-exports sonner's. The `Origin:` line names `sonner.tsx` and the `Svelte:` line names shadcn-svelte `sonner`.
- `components.css` gains the R2-4 block. Run `pnpm build:theme`.
- **Tests:**
  - With no `theme` prop, the Toaster's theme follows a `.dark` class added to `<html>`.
  - `toast.success('Saved')` renders an element with `data-type="success"` and the `mise-toast` class.
  - `tests/theme-cli.test.ts` still passes, since `components.css` changed.
- **Stories:** Default, Types, TypesDark, WithDescription, WithPromise, WithAction, WithActionAndCancel, PersistentToast, Stacked.

### Task 34: Field

- Every part `field.tsx` exports, built on `Label` and `Separator`. React's `--error` usage: map it to `--destructive`, the token mise has (spec: `--error` did not come over), and record that on `Diverged:`.
- **Tests:**
  - the label is associated with its control;
  - the error part renders with `role="alert"` (or whatever React renders);
  - `data-invalid` or `data-orientation` behaviour, as React has it.
- **Stories:** Default, Required, WithError, WithAddon, Horizontal, Responsive, InAFormCard, GroupedWithLegend. They use Card, Checkbox, Input, InputGroup, Select, Separator and Textarea, all ported by now.

### Task 35: Round 2 gate

- [ ] Run the clean-tree gate: `rm -rf dist storybook-static .svelte-kit && pnpm test && pnpm build && pnpm build:storybook`.
- [ ] `pnpm pack --dry-run` still lists no stories, and does list `LICENSES/`.
- [ ] Go back through every story deferred in round 1 or round 2 whose blocker is now ported, and add it:
  - Card **TitleWithHint** needs `Hint`, so it stays deferred.
  - Dialog's **WithForm** can now show the React shape more closely with Field. Update it.
- [ ] Push after approval, watch CI, start Storybook, and hand over with the review checklist:
  - every new component in both schemes and in `teal-on-stone`;
  - keyboard behaviour on the overlays;
  - the toasts.
