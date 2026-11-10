# Tabler icons and CommandTrigger Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans, inline in the main session (the user's choice for this repo). Activate the authors-components, vitest-testing, git-workflow, documents-updates and writes-clean-code skills. Steps use checkbox (`- [ ]`) syntax.

**Goal:** mise draws Tabler icons, as the React package and the client portal do, and ships a filled `CommandTrigger` for the "Type to search… ⌘K" field that opens a command palette.

**Architecture:** Phase 1 swaps `@lucide/svelte` for `@tabler/icons-svelte-runes` everywhere (package, stories, test fixtures, the logistics example) through a one-off codemod driven by the lucide-to-tabler table below, then fixes by hand the few places that faked a filled icon. A test keeps Lucide out. Phase 2 adds `CommandTrigger` to the command family: a filled, input-shaped button with a search icon, a label and a `⌘K` hint, which toggles a bound `open` on click and on ⌘K / Ctrl K, so `<CommandTrigger bind:open />` and `<CommandDialog bind:open>` are the whole wiring.

**Tech Stack:** Svelte 5, Tailwind v4, `@tabler/icons-svelte-runes` 3.51, bits-ui, Vitest + Testing Library, Storybook (addon-svelte-csf).

**Spec:** the user's ruling of 2026-11-10, which amends D8 of `docs/specs/2026-11-04-svelte-port-design.md`: "Tabler should be used if the reference does", and the search trigger is a design-system component, not demo work. No separate spec; the decisions table is the spec.

## Decisions

| # | Decision | Ruling |
| --- | --- | --- |
| I1 | Icon set | Tabler only, `@tabler/icons-svelte-runes` (the Svelte 5 build; `@tabler/icons-svelte` is the older Svelte 3–5 one). The React package draws Tabler for 74 files and keeps Lucide only in the 14 shadcn primitives it never touched (X, chevrons, check, loader); mise does not reproduce that split, one set is enough (D8's reason still holds). **Confirm at plan review** |
| I2 | Import form | One file per icon, named as Tabler names it: `import IconSearch from '@tabler/icons-svelte-runes/icons/search'`. Never the package root: it re-exports ~6,000 icons and svelte-check loads them all (the same trap Lucide had) |
| I3 | Filled icons | Tabler has them. `circle-check` with `fill-current [&_path]:text-background` becomes `circle-check-filled`; a filled dot becomes `point-filled` or `circle-filled`. No fill hacks remain |
| I4 | Mapping | The table below. In a ported file, the React original's Tabler icon wins where it differs from the table: read the `Icon…` imports of the file its `Origin:` names, in `/Volumes/External/Code/veritypos/veritypos-design-system/src/components/` |
| I5 | Release | The swap changes `SpinnerProps` (it spreads the icon's props: Lucide's `strokeWidth` and `absoluteStrokeWidth` become Tabler's `stroke`) and redraws every icon, so it is `feat!` and release-please cuts **2.0.0**. **Confirm at plan review**, and say whether Alert's `variant`-to-`tone` change (open item 3) rides in the same major |
| I6 | `Diverged:` lines | An icon is mentioned only where mise's library differs from the React file's. Ported from a Tabler file: drop "Lucide's x for Tabler's". Ported from a Lucide file (the 14 shadcn primitives): write "Tabler's x for Lucide's" |
| I7 | Dependencies | Installed by the user: in mise `pnpm remove @lucide/svelte && pnpm add @tabler/icons-svelte-runes@^3.51.0`; in the example `pnpm --filter mise-logistics-example remove @lucide/svelte && pnpm --filter mise-logistics-example add @tabler/icons-svelte-runes@^3.51.0`. Asked for before Task 1 |
| T1 | Name and place | `CommandTrigger`, a part of the command family: `src/lib/components/actions/command/command-trigger.svelte`, exported from the command barrel, story `Actions/Command` (a `With trigger` story), not a folder of its own |
| T2 | Origin | `Origin: mise`. The React package has none; the client portal hand-rolls it in its site header. The header comment says so without naming the product |
| T3 | Look | Shaped and filled like `Input`: `bg-input/50 h-9 rounded-2xl border border-transparent px-3 text-sm shadow-xs`, `text-muted-foreground`, hover `bg-input/70 hover:text-foreground`, the input's focus ring (`focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`). Full width of its container; the app sizes it with `class`. Reviewed in screenshots in both schemes and adjusted there |
| T4 | Contents | `IconSearch` (`size-4 shrink-0`), the label (`children`, default "Type to search…", truncated), then a `kbd` with the shortcut, `ml-auto`, hidden below `sm`: `bg-background text-muted-foreground rounded-md border px-1.5 py-0.5 text-xs font-medium` |
| T5 | Props | `open = $bindable(false)`; `hotkey?: string \| false` (default `'k'`): the key that, with ⌘ or Ctrl, toggles `open`; `false` registers nothing and hides the hint; `children?: Snippet`; `ref = $bindable(null)`; the rest of `HTMLButtonAttributes`. A caller's `onclick` runs first; `event.preventDefault()` in it stops the toggle |
| T6 | The hint | `⌘K` on Apple platforms, `Ctrl K` elsewhere, decided in an `$effect` (so a server render and the first client render agree on `⌘K`). The button gets `aria-keyshortcuts="Meta+K Control+K"` |

## Global Constraints

- Component rules from the authors-components skill: header comment first (`Origin:` / `Diverged:`), exported `<Part>Props` with JSDoc, `ref = $bindable(null)`, `class` merged last through `cn`, `...rest` on the root, `data-slot` on every part, `.js` on relative imports.
- Colours only from semantic tokens and `src/lib/utils/tone.ts`; the neutral-wash rule stands.
- Story copy: generic operations (orders, shipments, stock), `$` money.
- Commit only when `pnpm test` and `pnpm build:storybook` both exit 0, checked by exit code. Run `pnpm fix:spacing` then `pnpm format` first. Example commits are `chore(example)`; the example's gate is `pnpm --filter mise-logistics-example test` and `smoke`.
- Work on branch `feat/tabler-icons`; it reaches `main` by a pull request after both phase gates are approved.
- Phase gates after Task 5 and Task 8: phase-gates report, screenshots in both schemes, wait for an explicit go before pushing.

## The lucide-to-tabler table

Every Lucide icon in the tree (125), each checked to exist in `@tabler/icons-svelte-runes` 3.51.0. Names chosen to match the React package's Tabler vocabulary where it had one (`IconCash`, `IconHelp`, `IconFilterX`, `IconArrowsExchange`, `IconLayoutColumns`, `IconPointFilled`).

| Lucide | Tabler |
| --- | --- |
| `arrow-down` | `arrow-down` |
| `arrow-left` | `arrow-left` |
| `arrow-left-right` | `arrows-exchange` |
| `arrow-right` | `arrow-right` |
| `arrow-up` | `arrow-up` |
| `arrow-up-down` | `arrows-sort` |
| `arrow-up-right` | `arrow-up-right` |
| `badge-check` | `rosette-discount-check` |
| `ban` | `ban` |
| `banknote` | `cash` |
| `barcode` | `barcode` |
| `bell` | `bell` |
| `bookmark` | `bookmark` |
| `box` | `box` |
| `boxes` | `packages` |
| `briefcase` | `briefcase` |
| `building` | `building` |
| `calendar` | `calendar` |
| `calendar-clock` | `calendar-clock` |
| `check` | `check` |
| `chevron-down` | `chevron-down` |
| `chevron-left` | `chevron-left` |
| `chevron-right` | `chevron-right` |
| `chevron-up` | `chevron-up` |
| `circle` | `circle` |
| `circle-alert` | `alert-circle` |
| `circle-check` | `circle-check` |
| `circle-dashed` | `circle-dashed` |
| `circle-dollar-sign` | `coin` |
| `circle-minus` | `circle-minus` |
| `circle-question-mark` | `help` |
| `circle-small` | `point-filled` |
| `clipboard-check` | `clipboard-check` |
| `clipboard-list` | `clipboard-list` |
| `clock` | `clock` |
| `cloud-upload` | `cloud-upload` |
| `coins` | `coins` |
| `columns-3` | `layout-columns` |
| `copy` | `copy` |
| `database` | `database` |
| `dollar-sign` | `currency-dollar` |
| `download` | `download` |
| `ellipsis` | `dots` |
| `eye` | `eye` |
| `eye-off` | `eye-off` |
| `file-check` | `file-check` |
| `file-plus` | `file-plus` |
| `file-spreadsheet` | `file-spreadsheet` |
| `file-text` | `file-text` |
| `flag` | `flag` |
| `funnel` | `filter` |
| `funnel-x` | `filter-x` |
| `gauge` | `gauge` |
| `globe` | `world` |
| `hash` | `hash` |
| `headset` | `headset` |
| `id-card` | `id` |
| `image` | `photo` |
| `info` | `info-circle` |
| `italic` | `italic` |
| `layers` | `stack-2` |
| `layout-dashboard` | `layout-dashboard` |
| `layout-grid` | `layout-grid` |
| `letter-b` | `letter-b` |
| `lightbulb` | `bulb` |
| `list` | `list` |
| `list-checks` | `list-check` |
| `loader` | `loader` |
| `loader-circle` | `loader-2` |
| `lock` | `lock` |
| `mail` | `mail` |
| `map-pin` | `map-pin` |
| `milk` | `milk` |
| `minus` | `minus` |
| `monitor` | `device-desktop` |
| `moon` | `moon` |
| `octagon-alert` | `alert-octagon` |
| `octagon-x` | `circle-x` |
| `package` | `package` |
| `package-check` | `package-import` |
| `package-x` | `package-off` |
| `panel-left` | `layout-sidebar` |
| `pause` | `player-pause` |
| `pencil` | `pencil` |
| `phone` | `phone` |
| `plus` | `plus` |
| `printer` | `printer` |
| `receipt` | `receipt` |
| `receipt-text` | `file-invoice` |
| `rotate-ccw` | `rotate` |
| `route` | `route` |
| `ruler` | `ruler` |
| `scale` | `scale` |
| `search` | `search` |
| `server` | `server` |
| `settings` | `settings` |
| `shield-check` | `shield-check` |
| `shopping-cart` | `shopping-cart` |
| `smartphone` | `device-mobile` |
| `sparkles` | `sparkles` |
| `sprout` | `plant` |
| `square-kanban` | `layout-kanban` |
| `store` | `building-store` |
| `sun` | `sun` |
| `table` | `table` |
| `tablet` | `device-tablet` |
| `tag` | `tag` |
| `terminal` | `terminal` |
| `trash` | `trash` |
| `trending-down` | `trending-down` |
| `trending-up` | `trending-up` |
| `triangle-alert` | `alert-triangle` |
| `triangle-exclamation-point` | `alert-triangle` |
| `truck` | `truck` |
| `underline` | `underline` |
| `upload` | `upload` |
| `user` | `user` |
| `user-cog` | `user-cog` |
| `user-plus` | `user-plus` |
| `user-round` | `user` |
| `users` | `users` |
| `wallet` | `wallet` |
| `warehouse` | `building-warehouse` |
| `wrench` | `tool` |
| `x` | `x` |

---

## Phase 1: Tabler everywhere

### Task 1: The guard

**Files:**
- Create: `tests/icons.test.ts`

**Interfaces:**
- Produces: a failing test that Tasks 2, 3 and 5 turn green.

- [ ] **Step 1: Ask the user to install the dependencies** (decision I7) and wait.

- [ ] **Step 2: Write the test**

```ts
/**
 * mise draws Tabler, as the React package does (2026-11-10, amending D8).
 * Lucide must not come back, and Tabler is imported one icon per file: the
 * package root re-exports every icon and svelte-check would load them all.
 */
import { readFileSync } from 'node:fs'
import { globSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const SOURCES = globSync(
  ['src/**/*.{svelte,ts}', 'stories/**/*.{svelte,ts}', 'tests/fixtures/**/*.svelte', 'examples/logistics/src/**/*.{svelte,ts}'],
  { exclude: (path) => path.includes('node_modules') },
)

const importsOf = (path: string) => readFileSync(path, 'utf8').match(/from '[^']+'/g) ?? []

describe('icons', () => {
  it('never imports Lucide', () => {
    const offenders = SOURCES.filter((path) => importsOf(path).some((line) => line.includes('lucide')))

    expect(offenders).toEqual([])
  })

  it('imports Tabler one icon per file, never from the package root', () => {
    const offenders = SOURCES.filter((path) =>
      importsOf(path).some((line) => line === "from '@tabler/icons-svelte-runes'"),
    )

    expect(offenders).toEqual([])
  })
})
```

- [ ] **Step 3: Run it and see the first case fail**

Run: `pnpm exec vitest run tests/icons.test.ts`
Expected: FAIL, `never imports Lucide`, listing about 125 files (the package, its stories and the fixtures).

No commit: it lands with Task 2.

### Task 2: The package

**Files:**
- Modify: every `src/lib/**/*.svelte` importing `@lucide/svelte` (85 files, stories excluded)
- Modify: `src/lib/components/data-display/readiness/readiness.svelte`, `src/lib/components/data-display/checklist/checklist-row-heading.svelte`, `src/lib/components/actions/dropdown-menu/dropdown-menu-radio-item.svelte` (filled icons)
- Modify: `tests/delta-badge.test.ts`, `tests/data-table-parts.test.ts` (`lucide-*` classes)
- Modify: `tests/fixtures/{fact-list,supplier-title,empty-panels,metric-bar,stat-tile}.svelte`

**Interfaces:**
- Consumes: the table, the guard.
- Produces: `SpinnerProps = ComponentProps<typeof IconLoader2> & …`; every icon in the package renders `class="tabler-icon tabler-icon-<name> …"`.

- [ ] **Step 1: Write the codemod outside the repository** at `/tmp/icon-map/codemod.py`. `/tmp` is cleared between sessions; rebuild the table file from this plan first:

```sh
mkdir -p /tmp/icon-map && grep -E '^\| `[a-z0-9-]+` \| `[a-z0-9-]+` \|$' docs/superpowers/plans/2026-11-10-tabler-icons-and-command-trigger.md | tr -d '`|' | awk '{print $1, $2}' > /tmp/icon-map/map.txt && wc -l < /tmp/icon-map/map.txt   # 125
```

The codemod:

```python
"""Rewrite @lucide/svelte imports to @tabler/icons-svelte-runes, renaming each local."""
import re
import sys

MAP = dict(line.split() for line in open('/tmp/icon-map/map.txt') if line.strip())
IMPORT = re.compile(r"^(\s*)import (\w+) from '@lucide/svelte/icons/([a-z0-9-]+)'\n", re.M)


def pascal(name):
    return ''.join(part.capitalize() for part in name.split('-'))


for path in sys.argv[1:]:
    text = open(path).read()
    seen = set()

    def rewrite(match):
        indent, local, lucide = match.groups()
        tabler = MAP[lucide]
        new = 'Icon' + pascal(tabler)
        rewrite.renames[local] = new

        if new in seen:
            return ''

        seen.add(new)

        return f"{indent}import {new} from '@tabler/icons-svelte-runes/icons/{tabler}'\n"

    rewrite.renames = {}
    text = IMPORT.sub(rewrite, text)

    for old, new in rewrite.renames.items():
        # Not inside a string or a word, and not right after a tag closes:
        # the example names icons `Settings` and `Package`, words its copy uses.
        text = re.sub(rf"(?<![\w'\"`>-]){old}(?![\w'\"`-])", new, text)

    open(path, 'w').write(text)
```

It drops a duplicate import when two Lucide icons map to one Tabler icon (`user` and `user-round`) and renames the old local where it is code. The package's locals end in `Icon` (`SearchIcon`) and never collide with copy; the example's are bare (`Plus`, `Settings`, `Package`), so after running it on the example, read the diff for a renamed word in copy: `git diff -U0 examples | grep '^+' | grep -v "import Icon"`.

- [ ] **Step 2: Run it on the package and the test fixtures**

```sh
grep -rl "@lucide/svelte/icons/" src/lib tests/fixtures --include='*.svelte' | grep -v '\.stories\.svelte$' | xargs python3 /tmp/icon-map/codemod.py
```

Then `grep -rn "lucide" src/lib tests` and fix by hand whatever is left (type imports, prose).

- [ ] **Step 3: The filled icons (I3)**

- `readiness.svelte`: `IconCircleCheck` with `fill-current [&_path]:text-background` becomes `IconCircleCheckFilled` with `text-success` only; `IconPointFilled` keeps `text-warning` and loses `fill-current`.
- `checklist-row-heading.svelte`: the same change to `IconCircleCheckFilled`.
- `dropdown-menu-radio-item.svelte`: `IconCircle class="size-2 fill-current"` becomes `IconCircleFilled class="size-2"`.

- [ ] **Step 4: Ported files: the React original wins (I4).** For each changed file whose `Origin:` names a React file, read that file's `Icon…` imports and use the same icon where it differs from the table's.

- [ ] **Step 5: The `Diverged:` lines (I6).** `grep -rln "Lucide\|Tabler" src/lib` lists 28 headers. Drop "Lucide's x for Tabler's"-style clauses; on the 14 shadcn primitives (`sheet`, `date-picker`, `input-otp`, `radio-group`, `command`, `sonner`, `dialog`, `sidebar`, `calendar`, `spinner`, `dropdown-menu`, `select`, `checkbox`) add "Tabler's <names> for Lucide's". The 2.0.0 note in `CHANGELOG` comes from the commit, not by hand.

- [ ] **Step 6: The class assertions.** `tests/delta-badge.test.ts`: `lucide-trending-up` → `tabler-icon-trending-up`, `lucide-trending-down` → `tabler-icon-trending-down`, `lucide-minus` → `tabler-icon-minus`. `tests/data-table-parts.test.ts:27`: `lucide-arrow-down` → `tabler-icon-arrow-down`.

- [ ] **Step 7: Run the unit tests and the checker**

Run: `pnpm check && pnpm test:unit`
Expected: everything passes except `icons > never imports Lucide`, which still lists the stories and the example.

No commit yet: the stories must build first (Task 3).

### Task 3: The stories

**Files:**
- Modify: the 37 `*.stories.svelte` files importing `@lucide/svelte`, `stories/**`

- [ ] **Step 1: Run the codemod**

```sh
grep -rl "@lucide/svelte/icons/" src stories --include='*.stories.svelte' | xargs python3 /tmp/icon-map/codemod.py
grep -rl "@lucide/svelte/icons/" stories | xargs python3 /tmp/icon-map/codemod.py
```

- [ ] **Step 2: Gate and commit the package**

```sh
pnpm fix:spacing && pnpm format
pnpm test; t=$?; pnpm build:storybook; s=$?
[ $t -eq 0 ] && [ $s -eq 0 ] && git add -A src stories tests package.json pnpm-lock.yaml && git commit -m "$(cat <<'EOF'
feat!: draw Tabler icons, as the React package does

mise drew Lucide (D8). The React package and the apps built on it draw
Tabler, so mise now does too, through @tabler/icons-svelte-runes, one
file per icon. Filled icons replace the fill-current workaround.

BREAKING CHANGE: @lucide/svelte is replaced by @tabler/icons-svelte-runes.
SpinnerProps spreads Tabler's icon props (stroke, size, color) instead of
Lucide's (strokeWidth, absoluteStrokeWidth), and every icon is redrawn.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

`tests/icons.test.ts` lands in this commit (`git add -A tests` covers it); it does not scan the example yet, so it passes.

- [ ] **Step 3: Screenshot** the stories with the most icons in both schemes (Sidebar, DataTable, Readiness, Checklist, Sonner, Alert, StatTile, DropdownMenu) on a contact sheet (handoff, "Visual checks"). Look for icons that changed size or weight against the previous build.

### Task 4: The record

**Files:**
- Modify: `docs/specs/2026-11-04-svelte-port-design.md` (D8), `CLAUDE.md` and `AGENTS.md` (stack line), `.ai/guidelines/clean-code/guide.md:44`, `tests/conventions-rules.test.ts:41`, `docs/handoff.md` (the Lucide lesson), `skills/mise/SKILL.md`, `docs/naming.md` if it names an icon library

- [ ] **Step 1:** D8 becomes: "`@tabler/icons-svelte-runes` only, one file per icon. *Amended 2026-11-10: it said `@lucide/svelte` only; the user ruled that mise follows the React package, which draws Tabler.*"
- [ ] **Step 2:** The stack line in `CLAUDE.md` names `@tabler/icons-svelte-runes`; copy it to `AGENTS.md`.
- [ ] **Step 3:** The clean-code example and its test fixture become `import IconX from '@tabler/icons-svelte-runes/icons/x'`.
- [ ] **Step 4:** The handoff's Lucide lesson becomes: "**Tabler:** import one file per icon (`@tabler/icons-svelte-runes/icons/<name>`), never the root. Filled icons are separate files (`circle-check-filled`). A rendered icon carries `tabler-icon tabler-icon-<name>`."
- [ ] **Step 5:** `skills/mise/SKILL.md` gains, under setup or conventions: "mise draws Tabler (`@tabler/icons-svelte-runes`). An `icon` prop takes any Svelte component; an app that wants to match imports Tabler one file per icon." Run `pnpm build:skill`.
- [ ] **Step 6:** Gate and commit: `docs: record the move to Tabler icons`.

### Task 5: The example

**Files:**
- Modify: the 34 files in `examples/logistics/src` importing `@lucide/svelte`, `examples/logistics/package.json`
- Modify: `tests/icons.test.ts` (add `examples/logistics/src/**` back)

- [ ] **Step 1:** `grep -rl "@lucide/svelte/icons/" examples/logistics/src | xargs python3 /tmp/icon-map/codemod.py`, read the diff for renamed copy (Task 2, Step 1), then fix whatever `grep -rn lucide examples/logistics` still finds. A type for a nav item's icon is `import type { Icon } from '@tabler/icons-svelte-runes'`, which the guard allows.
- [ ] **Step 1b:** Add `'examples/logistics/src/**/*.{svelte,ts}'` to `SOURCES` in `tests/icons.test.ts` and drop the comment above it.
- [ ] **Step 2:** `pnpm build && pnpm --filter mise-logistics-example test && pnpm --filter mise-logistics-example smoke`, and compare the smoke screenshots against the previous run: icons only.
- [ ] **Step 3:** Commit `chore(example): draw Tabler icons` (with the guard change).
- [ ] **Step 4: Phase gate.** Report in the phase-gates format with the contact sheet and the smoke screenshots; wait for a go.

## Phase 2: CommandTrigger

### Task 6: The component

**Files:**
- Create: `src/lib/components/actions/command/command-trigger.svelte`
- Create: `tests/command-trigger.test.ts`
- Modify: `src/lib/components/actions/command/index.ts`, `tests/barrel.test.ts` (`'CommandTrigger'` after `'CommandShortcut'`)

**Interfaces:**
- Produces: `CommandTrigger`, `CommandTriggerProps = WithElementRef<HTMLButtonAttributes> & { open?: boolean; hotkey?: string | false; children?: Snippet }`.

- [ ] **Step 1: Write the failing test**

```ts
import { fireEvent, render, screen } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { CommandTrigger } from '../src/lib/index.js'

describe('CommandTrigger', () => {
  it('is a filled, input-shaped button with a search icon and a label', () => {
    render(CommandTrigger)
    const trigger = screen.getByRole('button', { name: /type to search/i })

    expect(trigger).toHaveAttribute('data-slot', 'command-trigger')
    expect(trigger).toHaveClass('bg-input/50', 'rounded-2xl', 'h-9')
    expect(trigger.querySelector('svg')).toHaveClass('tabler-icon-search')
  })

  it('shows the shortcut and announces it', () => {
    render(CommandTrigger)
    const trigger = screen.getByRole('button')

    expect(trigger.querySelector('kbd')).toHaveTextContent(/K$/)
    expect(trigger).toHaveAttribute('aria-keyshortcuts', 'Meta+K Control+K')
  })

  it('opens on click', async () => {
    let open = false
    render(CommandTrigger, { props: { get open() { return open }, set open(value) { open = value } } })

    await userEvent.click(screen.getByRole('button'))

    expect(open).toBe(true)
  })

  it('toggles on ⌘K and Ctrl K', async () => {
    let open = false
    render(CommandTrigger, { props: { get open() { return open }, set open(value) { open = value } } })

    await fireEvent.keyDown(window, { key: 'k', metaKey: true })
    expect(open).toBe(true)

    await fireEvent.keyDown(window, { key: 'K', ctrlKey: true })
    expect(open).toBe(false)
  })

  it('ignores the key without a modifier', async () => {
    let open = false
    render(CommandTrigger, { props: { get open() { return open }, set open(value) { open = value } } })

    await fireEvent.keyDown(window, { key: 'k' })

    expect(open).toBe(false)
  })

  it('registers nothing and shows no hint when hotkey is false', async () => {
    let open = false
    render(CommandTrigger, {
      props: { hotkey: false, get open() { return open }, set open(value) { open = value } },
    })

    await fireEvent.keyDown(window, { key: 'k', metaKey: true })

    expect(open).toBe(false)
    expect(screen.getByRole('button').querySelector('kbd')).toBeNull()
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-keyshortcuts')
  })

  it("lets the caller's onclick cancel the toggle", async () => {
    let open = false
    const onclick = vi.fn((event: MouseEvent) => event.preventDefault())
    render(CommandTrigger, {
      props: { onclick, get open() { return open }, set open(value) { open = value } },
    })

    await userEvent.click(screen.getByRole('button'))

    expect(onclick).toHaveBeenCalledOnce()
    expect(open).toBe(false)
  })
})
```

If the getter/setter props form does not bind in this Testing Library version, use a harness in `tests/fixtures/command-trigger-harness.svelte` that binds `open` and prints it in a `data-testid="open"` span, as `board-harness.svelte` does for Board.

- [ ] **Step 2: Run it**

Run: `pnpm exec vitest run tests/command-trigger.test.ts`
Expected: FAIL, `CommandTrigger` is not exported.

- [ ] **Step 3: Write the part**

```svelte
<!--
  Origin: mise
  Diverged: none. The React package has no search trigger; apps built on it
    hand-roll one in their header. mise authored it (2026-11-10).
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * The "Type to search… ⌘K" field in a header, which opens a command
   * palette. A button shaped like an input, not an input: the palette owns
   * the text field, so typing here would mean two search fields to keep in
   * step. Bind `open` to the same value as the `CommandDialog`.
   */
  export type CommandTriggerProps = WithElementRef<HTMLButtonAttributes> & {
    /** Whether the palette is open. Toggled on click and on the hotkey. */
    open?: boolean
    /** The key that, with ⌘ or Ctrl, toggles `open`. `false` registers none. */
    hotkey?: string | false
    /** The label. Defaults to "Type to search…". */
    children?: Snippet
  }
</script>

<script lang="ts">
  import IconSearch from '@tabler/icons-svelte-runes/icons/search'

  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    open = $bindable(false),
    hotkey = 'k',
    class: className,
    children,
    onclick,
    ...rest
  }: CommandTriggerProps = $props()

  let modifier = $state('⌘')

  $effect(() => {
    const apple = /Mac|iPhone|iPad/.test(navigator.platform)

    modifier = apple ? '⌘' : 'Ctrl '
  })

  function onwindowkeydown(event: KeyboardEvent) {
    if (hotkey === false) {
      return
    }

    const pressed = event.key.toLowerCase() === hotkey.toLowerCase()

    if (!pressed || !(event.metaKey || event.ctrlKey)) {
      return
    }

    event.preventDefault()

    open = !open
  }

  function onbuttonclick(event: MouseEvent & { currentTarget: HTMLButtonElement }) {
    onclick?.(event)

    if (event.defaultPrevented) {
      return
    }

    open = true
  }
</script>

<svelte:window onkeydown={onwindowkeydown} />

<button
  bind:this={ref}
  type="button"
  data-slot="command-trigger"
  aria-keyshortcuts={hotkey === false ? undefined : `Meta+${hotkey.toUpperCase()} Control+${hotkey.toUpperCase()}`}
  class={cn(
    'bg-input/50 text-muted-foreground hover:bg-input/70 hover:text-foreground flex h-9 w-full min-w-0 items-center gap-2 rounded-2xl border border-transparent px-3 text-sm shadow-xs transition-[color,background-color,box-shadow] outline-none',
    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
    className,
  )}
  onclick={onbuttonclick}
  {...rest}
>
  <IconSearch class="size-4 shrink-0" />
  <span class="truncate">
    {#if children}
      {@render children()}
    {:else}
      Type to search…
    {/if}
  </span>
  {#if hotkey !== false}
    <kbd
      class="bg-background text-muted-foreground ml-auto hidden shrink-0 rounded-md border px-1.5 py-0.5 text-xs font-medium sm:inline-block"
    >
      {modifier}{hotkey.toUpperCase()}
    </kbd>
  {/if}
</button>
```

- [ ] **Step 4: Export it.** In `src/lib/components/actions/command/index.ts` add `export { type CommandTriggerProps, default as CommandTrigger } from './command-trigger.svelte'`; add `'CommandTrigger'` to `EXPECTED_EXPORTS`.

- [ ] **Step 5: Run the test**

Run: `pnpm exec vitest run tests/command-trigger.test.ts tests/barrel.test.ts tests/provenance.test.ts`
Expected: PASS.

### Task 7: The stories

**Files:**
- Modify: `src/lib/components/actions/command/command.stories.svelte`

- [ ] **Step 1:** Add, on the skeleton and with `asChild`: `With trigger` (a `CommandTrigger` and a `CommandDialog` bound to one module-level `$state` `open`, with two groups of generic items: Go to Orders / Shipments; Recent orders), and in `States` a trigger with `hotkey={false}` and one with a custom label ("Search orders…"). Add an `In a header` scenario: a `bg-card` bar with a `SidebarTrigger`-sized ghost button, the trigger at `md:w-72`, and a `ThemeToggle`, the way an app header holds it.
- [ ] **Step 2:** Gate (`pnpm test`, `pnpm build:storybook`) and screenshot `With trigger` and `In a header` in both schemes. The trigger must read as a field before hover on the canvas (`bg-muted`) and on a card; the `kbd` must read on the fill. Adjust T3/T4 classes there if not, and record the change in the decisions table.
- [ ] **Step 3:** Commit `feat(command): CommandTrigger, the search field that opens a palette`.

### Task 8: Use it, and say so

**Files:**
- Modify: `examples/logistics/src/modules/shell/components/search-palette.svelte`
- Modify: `skills/mise/SKILL.md`, `docs/handoff.md`

- [ ] **Step 1:** In `search-palette.svelte` drop the `Button`, the `IconSearch` import, `onkeydown` and `<svelte:window>`; render `<CommandTrigger bind:open class="ml-auto w-48 shrink md:w-72" />` before the `CommandDialog`.
- [ ] **Step 2:** `skills/mise/SKILL.md`, in the picking list: "- A "Type to search… ⌘K" field that opens a palette: `CommandTrigger` with `bind:open`, beside a `CommandDialog` bound to the same value". Run `pnpm build:skill`.
- [ ] **Step 3:** Handoff: add CommandTrigger to "Where it stands", and add an open item: bertos-bakery-ops moves its own icons to Tabler (it added `@lucide/svelte` itself) and bumps mise to 2.0.0.
- [ ] **Step 4:** `pnpm build`, the example's `test` and `smoke`; the header screenshot shows the filled trigger. Commit the example as `chore(example): the header search is CommandTrigger`, the docs as `docs: CommandTrigger in the consumer skill and the handoff`.
- [ ] **Step 5: Phase gate.** Report with screenshots; on a go, push the branch and open the pull request into `main`; watch CI.
