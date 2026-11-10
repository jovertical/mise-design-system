# Handoff: mise, 2026-11-09, with 1.2.0 out and the logistics demo live

Read this first when resuming. It records where things stand, what is open and
waiting on a decision, how the work is run, and what was learned that the code
and plans do not say. In progress: branch `feat/tabler-icons`, below.

## Where it stands

- **Branch `feat/tabler-icons` (2026-11-10), a minor release.** Plan:
  `docs/superpowers/plans/2026-11-10-tabler-icons-and-command-trigger.md`.
  Three phases, all done: Tabler icons everywhere; `CommandTrigger`,
  the filled "Type to search… ⌘K" field; and the sidebar as the portals draw
  it, with `panel` the default theme and `SidebarNav`, the menu
  drawn from data (sections, groups, badges, the current row). The example
  uses all three. Also the dark indeterminate `Checkbox` fix. Merging its
  pull request lets release-please cut the next minor. The icon swap and the
  new default would be breaking for an outside consumer; with the user's
  own apps the only consumers, they ship as `feat`, not `feat!`.
- **The package.** `@jovertical/mise-design-system` is public on npm and GitHub
  (`github.com/jovertical/mise-design-system`, branch `main`). **1.2.0** is the
  latest release: 1.0.0 was the port, 1.1.x added the consumer skill and
  `mise-theme info`, 1.2.0 added `Board` and the `SidebarInset` fix. Releases
  are cut by release-please (merge its PR) and published by npm trusted
  publishing with provenance; nothing is published by hand.
- **The port is done.** Every component the round 5 triage kept exists, is
  tested and has stories on the skeleton. Deferred: drag and drop, Mermaid.
- **The consumer skill** (`skills/mise/`) teaches an agent in an app which mise
  component does which job: a generated props catalogue (`pnpm build:skill`),
  setup and theming guides, type-checked recipes, and `mise-theme info --json`
  for live context. Apps install it with
  `npx skills add jovertical/mise-design-system --skill mise`. The six skills
  in `.claude/skills/` are for working on mise and are hidden from apps
  (`metadata.internal`).
- **The logistics demo is live** at <https://jovertical.github.io/mise-design-system/>,
  from `examples/logistics/` (its README covers running, the data and
  deploying). Every push to `main` touching mise or the example redeploys it.
  It has an overview; orders as a table and a board, with cancel and a
  detail page; detail pages for shipments, vehicles, products, clients and
  sites; a create page and an edit page for each of those six, in the client
  portal's shape (spec `docs/specs/2026-11-09-edit-pages-design.md`, plan of
  the same date); settings laid out like the client portal's; ⌘K search; an
  avatar menu in a floating top bar, its content capped at `max-w-content`;
  and a resettable demo store. It consumes mise's
  built package through the pnpm workspace, so mise is rebuilt
  (`pnpm build`, or the watcher in `pnpm dev:example`) before the example sees
  a change.
- **Gate:** `pnpm test` (561 tests, the clean-code check included), `pnpm build` (publint) and
  `pnpm build:storybook` for mise; `pnpm --filter mise-logistics-example test`
  (83 tests) and `smoke` (27 routes and 2 not-found routes, light and dark) for
  the example. Run `pnpm fix:spacing` then `pnpm format` before it.
- **Specs and plans** for the recent work: consumer skill
  (`docs/specs/2026-11-09-consumer-skill-design.md`, plan of the same date),
  logistics example (`docs/specs/2026-11-09-logistics-example-design.md`, its
  plan and the Board plan in `docs/superpowers/plans/`), and the example's
  create and edit pages (`docs/specs/2026-11-09-edit-pages-design.md`, its plan
  of the same date), and the clean-code guide with its check and the refactor
  that met it (`docs/specs/2026-11-10-clean-code-design.md`, plan of the same
  date).

What was built, round by round:

| Round | What | Plan or spec |
| --- | --- | --- |
| 0–1 | Scaffold, theme and tokens (`mise-theme` CLI), the first primitives | `docs/superpowers/plans/2026-11-04-svelte-port-rounds-0-1.md` |
| 2 | Forms and overlays | `…/2026-11-04-svelte-port-round-2.md` |
| 3 | The dashboard shell (Sidebar, PageLayout, PageHeader) | `…/2026-11-04-svelte-port-round-3.md` |
| M | Structure: `src/lib/components/<group>/<name>/`, stories titled by group, the React package a reference rather than a contract | `docs/specs/2026-11-05-structure-design.md` |
| N | The story skeleton: Playground, Matrix, axes, States, With …, Long content, In …, scenarios | `docs/specs/2026-11-05-story-skeleton-design.md` |
| 4a | Metrics and stats: Progress, CardGrid, CardList, FactList, DeltaBadge, Sparkline, the Metric components, RadialStat, SegmentedBar, StatTile | `…/2026-11-05-svelte-port-round-4a.md` |
| 4b | Tables and charts: Table, Command, Chart (LayerChart), the DataTable family on `@tanstack/svelte-table` 9 | `…/2026-11-05-svelte-port-round-4b.md` |
| 5 | Triage of the 49 remaining React components: port, merge, defer or drop | `docs/specs/2026-11-05-round-5-triage-design.md` |
| 6 | Overlays and forms: Hint, HoverCard, Collapsible, ButtonGroup, Drawer, SwitchField, ChoiceRow, InputOTP, Combobox, NumberInput, QuantityInput, Form | `…/2026-11-05-svelte-port-round-6.md` |
| 7 | Dates and flows: Calendar, RangeCalendar, DatePicker, TimePicker, SegmentedCode, Timeline, Stepper, StepperNavigation | `…/2026-11-05-svelte-port-round-7.md` |
| 8 | Content and status: Item, EntityLabel, AsideCard, SummaryCard, ErrorState, the checklist family, Readiness, TreeLeaf, NavigationProgress, ThemeToggle, FeaturePreview, LockedOverlay, MediaDropzone | `…/2026-11-06-svelte-port-round-8.md` |

Decisions made with the user along the way, each also on its module's `Diverged:` line:

- **Merges:** NumberInput absorbs CountInput, DecimalInput and CurrencyInput, with a `format` prop; QuantityInput is kept and composes `NumberInputField`. The checklist family is two components over a shared row: ChecklistCard, and Checklist (React's TaskChecklist, renamed). React's ErrorPage is ErrorState. FactRow and FactField are one FactListItem.
- **Form** is SvelteKit-only, from its own `mise/form` entry (`src/lib/form.ts`), with `formsnap` and `sveltekit-superforms` as optional peers. superforms imports `$app/*`, so a plain Vite app (Inertia) cannot bundle it.
- **Combobox** is bits-ui with the caller filtering; chips are composed by mise.
- **Dates** are `@internationalized/date` throughout: `CalendarDate`, `{ start, end }`, `Time`.
- **Stepper's** `orientation` is `variant`; a step's `icon` is a component.
- **ThemeToggle** ships with a ThemeProvider and `useTheme` ported from React, rather than `mode-watcher`.
- **The neutral wash** is `bg-foreground/[0.07]`, not `bg-muted` (`201f080`, softened from `/10` after): the canvas is `--muted`, and a neutral badge, chip, avatar or disc vanished on it; at `/10` it read a step darker than `bg-muted` on a white card. Every hard-coded neutral fill writes the same class; Skeleton alone keeps `/10` for its pulse. `bg-muted` stays for tracks, strips and row surfaces. The rule is in the authors-components skill.
- **Dropped:** the product logo, TourTooltip, CategoryIcon and its picker, the address components, CredentialCard, MediaUploader, MessageComposer, Waterfall.

Later decisions, with the user:

- **`Origin: mise`** marks a component mise authored itself, with no React
  original (Board was the first). `tests/provenance.test.ts` accepts it and its
  story is tagged `mise`.
- **Licensing:** the user wrote the React package, so mise's MIT `LICENSE`
  covers the ported code. The tree does not name the product the React package
  came from: `Origin:` lines say "the React package 2.23.0". Keep it that way.
- **Button rounding** is a theme key, `buttonRadius` (`--radius-button`),
  fully round by default to match the inputs. Inputs, selects and menus stay
  `rounded-2xl`.
- **Gaps found by an app are fixed in mise first**, released, then used: the
  example and bertos-bakery-ops never build a local look-alike.

## Open: the user's to decide

In rough order of how much they block the apps:

1. *Closed 2026-11-10:* sidebar rows. `panel` is the default and draws what
   the portals' `nav-main.tsx` overrode; `SidebarNav` replaces the hand-written
   menu.
2. **Notifications in the top bar.** The portal has a `NotificationBell` and a
   What's new button with no mise equivalent. A mise component would need a
   plan; the demo has neither.
3. **Alert's vocabulary: done on `feat/bakery-gaps`.** `Alert` takes `tone`
   (and `DropdownMenuItem` `tone="critical"`); `variant` still works, so it was
   not breaking.
4. **DataTable's faceted filter.** A faceted filter sets an array of values on
   a column; DataTable registers no array `filterFn`, so a column without its
   own may not filter. The example and the recipe give each such column one.
   Confirm in Storybook and decide whether DataTable should default to an
   `arrIncludesSome`-style filter.
5. **A mise gap the edit pages found**, worked around in the example and not
   yet fixed in mise (DatePicker's two were fixed on `feat/bakery-gaps`):
   - `ComboboxInput` does not show the selected item's label for a starting
     value; bits-ui fills the field only when an item is picked. The order
     form passes `defaultValue` itself.
6. **`homepage` in `package.json`** could point at the demo instead of the
   README; needs a yes.
7. **bertos-bakery-ops after this release:** it added `@lucide/svelte` itself; it
   moves its own icons to `@tabler/icons-svelte-runes`, bumps mise, and takes
   `CommandTrigger` and (after phase 3) `SidebarNav`.
8. **The deferred components:** Draggable, Droppable, Sortable (need a drag and
   drop library) and MermaidDiagram (heavy). Wait until a screen asks.

Not verified by a browser: uploading a logo, saving or cancelling settings,
choosing a ⌘K result, and picking a day in a `DatePicker`. Their logic is
unit-tested. The smoke shell cannot click, but a DevTools-protocol driver can
(`Input.dispatchMouseEvent` at an element's centre opens a bits-ui Select);
the edit pages' flows were checked that way, from a script kept outside the
repository.

## How the work is run

- **`main` is protected** by the ruleset *Protect main* (2026-11-10): pull
  requests only, the CI `check` job required, squash or rebase merges, no
  force-push or deletion, the admin (the user) able to bypass. Work goes on a
  branch and reaches `main` by a pull request; the git-workflow skill has the
  commands. The release PR gets no CI run (release-please uses the workflow
  token), so the user merges it with the bypass.

- **Phases:** at most 5 tasks each. Stop at every phase gate with a phase-gates report and wait for an explicit go. Push only after approval, then watch CI (`gh run watch --repo jovertical/mise-design-system --exit-status <run id>`).
- **Plans before code:** a round gets a plan in `docs/superpowers/plans/` (shared decisions table, phases, per-task specifics), approved by the user before any code.
- **Commits:** only when `pnpm test` **and** `pnpm build:storybook` both exit 0, checked by exit code, with the commit conditional on both (git-workflow skill). Self-contained (a component, its barrel lines, its tests and stories), conventional and component-scoped, ending with the Co-Authored-By trailer.
- **Execution:** inline in the main session, not subagents; the user chose this.
- **Skills:** `.claude/skills/` (authors-components, changes-tokens, git-workflow, vitest-testing, documents-updates, writes-clean-code). `CLAUDE.md` lists when to use each.
- **Dependencies** are installed by the user, never by the agent. Ask before the task that needs one.
- **Per-component loop:**
  1. Read the sibling components in its group and `docs/naming.md`. The React package is no longer read; the port is finished.
  2. Read shadcn-svelte in `/tmp/shadcn-svelte-ref/docs/src/lib/registry/ui/` (re-clone with `git clone --depth 1 https://github.com/huntabyte/shadcn-svelte.git /tmp/shadcn-svelte-ref` if `/tmp` was cleared). Its newer files use `cn-*` classes styled elsewhere; take the mechanics, not those classes.
  3. Write the test first, then the parts.
  4. Add `index.ts`, the barrel line in `src/lib/index.ts` and the `EXPECTED_EXPORTS` entries in `tests/barrel.test.ts`.
  5. Write the stories on the skeleton, with `asChild`.
  6. Gate, screenshot both schemes, commit.

## Visual checks

`pnpm test` cannot see layout; several bugs were visible only in the browser (Calendar's empty nav buttons, ButtonGroup's open seam, NavigationProgress's missing `top-0`). Screenshot new stories in both schemes before every phase report.

- **Serve Storybook on 6016.** Either the dev server, `pnpm exec storybook dev -p 6016 --no-open`, or the static build, `pnpm build:storybook` then `python3 -m http.server 6016` inside `storybook-static/`. Run either in the background with the longest timeout; the harness stops it after two hours, and it should not be restarted past that. The static build needs a rebuild after each change.
- **Chromium:** `CH=~/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell`
- **One story:**
  ```sh
  "$CH" --headless --disable-gpu --hide-scrollbars --window-size=560,320 \
    --virtual-time-budget=8000 --screenshot=out.png \
    "http://localhost:6016/iframe.html?id=<story-id>&viewMode=story&globals=scheme:dark"
  ```
- **Several stories:** a contact sheet of iframes, each story in light and dark, served over HTTP (a `file://` page will not load the iframes). `/tmp` is cleared between sessions; recreate it:
  ```sh
  mkdir -p /tmp/mise-sheet && cat > /tmp/mise-sheet/make.py <<'EOF'
  import sys
  ids=sys.argv[2:]; out=sys.argv[1]
  cells=''.join(f'<figure><figcaption>{i} · {s}</figcaption><iframe src="http://localhost:6016/iframe.html?id={i}&viewMode=story&globals=scheme:{s}"></iframe></figure>' for i in ids for s in ('light','dark'))
  open(out,'w').write(f'''<!doctype html><meta charset="utf-8"><style>body{{margin:0;font:11px sans-serif;display:grid;grid-template-columns:repeat(2,560px);gap:6px;background:#888}}figure{{margin:0;background:#fff}}figcaption{{padding:2px 4px}}iframe{{width:560px;height:300px;border:0;display:block}}</style>{cells}''')
  EOF
  cd /tmp/mise-sheet && python3 -m http.server 6107   # in the background
  python3 make.py sheet.html <story-id> <story-id>…
  "$CH" --headless --disable-gpu --hide-scrollbars --window-size=1130,1400 \
    --virtual-time-budget=30000 --screenshot=sheet.png http://localhost:6107/sheet.html
  ```
  Raise the iframe height with `sed -i '' 's/height:300px/height:500px/' sheet.html` for tall stories.
- **Story ids** come from the title: `Data display/IconChip` → `data-display-iconchip--<story>`. They are listed in `storybook-static/index.json` after a build.
- **An overlay held open by internal state** (DatePicker, NavigationProgress) is screenshotted by flipping its default in the file, rebuilding, and reverting. Storybook URL args did not reach some props (Drawer's `direction`).
- **A stale dev server** fails with "Failed to fetch dynamically imported module" and a `504 Outdated Optimize Dep` on an icon. Not a code bug; restart it.

## Lessons that are not in the code

**Svelte and stories**

- **Stories need `asChild`.** addon-svelte-csf renders a `<Story>`'s children inside the meta `component` unless the story says `asChild`; `tests/stories.test.ts` enforces it. A snippet declared inside `<Story>` or inside a component's children becomes a prop; declare shared snippets at the top level, where a story's instance script can also reference them (that is how a data array carries snippet fields).
- **Stories with live state** keep it in a module-level `$state` object and `bind:` to its fields.
- **A union-typed root** (Calendar's single and multiple, Select) will not take a story's `{...args}` spread; pass args by name.
- **The story skeleton's axes** are a fixed list in `tests/stories.test.ts` (`Formats` was added for NumberInput); a new axis is added there, in `docs/naming.md` and in the skeleton spec.
- **The provenance test wants a root part** named for its folder (`readiness/readiness.svelte`), and an `Origin:` line naming a bare React file (`use-theme.tsx`, not `hooks/use-theme.tsx`). A `Svelte:` line appears only when shadcn-svelte was used.
- **A `.svelte.ts` module** (ThemeState, MediaUploader) carries runes outside a component; it needs a JSDoc header like any `.ts` module.
- **A variable named `props`** collides with the `$props` rune. Native attributes are lowercase (`maxlength`, `onclick`).
- **`$props.id()`** needs Svelte 5.20 and the peer range is any Svelte 5, so an instance id comes from a module counter (Sparkline, Chart).

**Biome**

- `<!-- biome-ignore lint/...: reason -->` goes directly above the element; a `svelte-ignore` beside it goes first.
- `{#each { length: n }}` does not parse; build an array with `Array.from`.
- An `<a>` needs an explicit `href` even when one comes through a spread.

**jsdom and tests**

- Floating content (Select, DropdownMenu, Combobox) is `visibility: hidden`, so it has no accessible name: query with `{ hidden: true }` or by text and `data-slot`.
- `tests/setup.ts` stubs `matchMedia`, `ResizeObserver`, pointer capture, `scrollIntoView` and `elementFromPoint`.
- bits-ui PinInput re-syncs on timers 0, 10 and 50ms after each change; `tests/input-otp.test.ts` waits 60ms after each test, or the last timer fires into a torn-down jsdom.
- Firing `change` on a file input with a plain array breaks jsdom; use `userEvent.upload`, with `applyAccept: false` to test a refused type.
- superforms' `applyAction` hands results to a running SvelteKit client; test fixtures and stories pass `applyAction: false`.
- A test that writes files writes under the git-ignored `.tmp/`.

**bits-ui, each difference from Radix on a `Diverged:` line**

- The highlighted row is `data-highlighted`, so `focus:` classes are mirrored.
- `AlertDialog.Action` does not close the dialog; mise closes it unless the handler calls `preventDefault()`.
- Select needs a `type` (mise defaults to `single`) and an `items` list for the closed trigger to show its label.
- Combobox does not filter and has no chips. LinkPreview (HoverCard) gives its `a` trigger `role="button"`. Collapsible keeps closed content mounted and hidden: assert visibility, not absence.
- Calendars draw no nav icons; each calendar's parts read their own root's context, so Calendar and RangeCalendar share `calendar-classes.ts`, not parts.
- Positioning variables are `--bits-<component>-*`.

**Libraries**

- **TanStack Table 9:** features are declared up front (`dataTableFeatures`), columns built with `dataTableColumns<Row>()`, state read with `table.store.get()`; v9 resets expansion on every row-model rebuild, so `DataTable` sets `autoResetExpanded: false`. A part that needs a live table in a story uses `stories/fixtures/device-table.svelte`.
- **Tabler** (`@tabler/icons-svelte-runes`, since 2026-11-10; Lucide before): import one file per icon (`import IconX from '@tabler/icons-svelte-runes/icons/x'`), never the root, which makes svelte-check load all ~6,000 icons; `import type { Icon }` from the root is fine. `tests/icons.test.ts` enforces both and keeps Lucide out. Filled icons are their own files (`circle-check-filled`, `point-filled`). A rendered icon carries `tabler-icon tabler-icon-<name>`, which tests assert on. The lucide-to-tabler table is in `docs/superpowers/plans/2026-11-10-tabler-icons-and-command-trigger.md`.
- **vaul-svelte** is the `1.0.0-next` line, the Svelte 5 one; `latest` is Svelte 4.

**The React package carried product-specific choices; mise fixed them, each on a `Diverged:` line**

- hard-coded brand hex values, `font-mono`, `--color-blue-*`;
- `bg-accent`, which the React package redefined as the brand tint (mise uses `bg-muted`, or the primary soft wash);
- peso amounts, real tenant names, "tenant" and pricing tiers in story copy (mise uses `$`, generic locations, access or setup);
- product tour hooks (`tourTarget`), dropped.

**The clean-code check**

- **`.ai/guidelines/clean-code/guide.md` is enforced** by
  `tests/conventions.test.ts`, which parses every `.ts` file, and each
  `.svelte` file's scripts (at their offsets, so lines match) and template,
  with the TypeScript compiler and `svelte/compiler`. The rules live in
  `scripts/conventions/`, one module each; exceptions, each with a reason, in
  `exceptions.ts`.
- **Spacing has a fixer**, `pnpm fix:spacing`, sharing the rule's code. Biome
  keeps blank lines but never adds one, so the fixer runs first. Imports and
  re-exports group however they wrap, a semicolon Biome moves to the next line
  belongs to that line, and a `describe` body is not measured as a function.
- **A refactor that must not change behaviour can prove it**: the theme CSS
  and the skill catalogue were compared byte for byte, the seed as JSON, and
  the example's 58 smoke screenshots against the previous run.

**The logistics example (SvelteKit 3)**

- **TypeScript stays on ~6.0.** SvelteKit 3.1 reads `tsconfig` through
  TypeScript's JS API (`ts.sys`), which 7.0 does not have; 7.0 fails the build
  in `load_tsconfig`.
- **`$lib` is gone; use subpath imports.** The example maps `#modules/*` to
  `./src/modules/*` in `package.json` `imports`; its code is one module per
  screen area (`src/modules/<module>/{components,data,utils}`, with `core` and
  `shell` for what is shared). See its README. `kit.alias` is deprecated, and
  `svelte-package` applied an alias to a string in a doc comment, so mise uses
  `tsconfig` `paths` (type-checking only) to check its recipes.
- **Routes:** `resolve('/orders/[id]', { id })` from `$app/paths`; nav items
  are typed as `RouteId` minus dynamic routes. `goto` takes `replace` and
  `reset`, not `replaceState`/`noScroll`/`keepFocus`. `page.url` is read-only;
  copy it with `new URL(page.url.href)`.
- **A single-page app on Pages:** `ssr = false`, adapter-static with
  `fallback: '404.html'`, and a prerendered root shell so `/` answers 200. A
  deep link is answered by `404.html` (status 404, about 10 s on Pages) and
  routed in the browser.
- **The demo store** saves to `localStorage` under `mise-logistics-demo:v<SEED_VERSION>`.
  Bump `SEED_VERSION` on any seed change, content included, or earlier
  visitors keep stale data (that happened once: "mise Logistics (demo)").
- **The smoke run** (`scripts/smoke.ts`) serves `build/` the way Pages does and
  runs the headless shell with `--run-all-compositor-stages-before-draw`;
  without it a dialog or sheet is caught mid fade-in and looks transparent. Its
  browser calls must be async, or they block the in-process server. It cannot
  see console errors without puppeteer.
- **Forms are superforms in SPA mode through `entityForm()`.** superforms
  clears what it tracks once a submit validates, so a save the store then
  refuses must call `cancel()` in `onUpdate`, or the form is left unguarded.
  Its `taintedMessage` can be an async function, which is how the discard
  dialog answers it.
- **bits-ui Select reads `''` as nothing chosen**, so an option meaning "none"
  needs its own value (`'none'`) mapped to `null`.
- **`@internationalized/date` is a direct dependency of the example**: pnpm
  does not let it import mise's copy, and `DatePicker` speaks `CalendarDate`.
  `src/modules/core/data/days.ts` converts to and from the data's day offsets.
- **A record made by the store comes back from the store** (`getShipment` after
  the push): `$state` keeps its own proxy, and later edits to the object that
  was pushed do not reach it.
- **Commit types:** example changes are `chore(example)` or `docs(example)`; a
  `fix`/`feat` scope would make release-please cut a mise release.

## Where things are

| What | Where |
| --- | --- |
| Port spec | `docs/specs/2026-11-04-svelte-port-design.md` |
| Structure, skeleton, triage specs | `docs/specs/2026-11-05-*.md` |
| Plans | `docs/superpowers/plans/` (rounds 0–1, 2, 3, 4a, 4b, 6, 7, 8; the consumer skill; the logistics example; Board) |
| Naming authority | `docs/naming.md` |
| Main entry, Form entry | `src/lib/index.ts`, `src/lib/form.ts` (`mise/form`) |
| The logistics example | `examples/logistics/` (its README covers running, the data and deploying); `pnpm dev:example`; `.github/workflows/example.yml` |
| The consumer skill | `skills/mise/` (hand-written `SKILL.md`, guides and recipes; generated `components/`), its generator in `scripts/skill/` and `scripts/build-skill.ts` |
| Tone maps (the neutral wash) | `src/lib/utils/tone.ts` |
| Story scaffolding and fixtures | `stories/` (`story-axis.svelte`, `on-a-card.svelte`, `fixtures/`) |
| Rules, stack, commands | `CLAUDE.md` (copied to `AGENTS.md`), `.ai/guidelines/`, `.claude/skills/` |
| Repository | `github.com/jovertical/mise-design-system` (private), branch `main` |
| Intended consumer | a Laravel, Inertia and Svelte operations app |
