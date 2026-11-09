# Handoff: mise Svelte port, paused 2026-11-09 with the port list done

Read this first when resuming. It records where the work stopped, what is left
to decide, how the work is run, and what was learned along the way that the
code and plans do not say.

## Where it stands

**The port is done.** Every component the round 5 triage placed as "port" or
"merge" exists, is tested, has stories on the skeleton, and is pushed. CI is
green on `main`, the tree is clean, and no story is deferred.

- **Gate:** 516 tests; `pnpm test`, `pnpm build` (publint clean) and `pnpm build:storybook` pass from a clean tree.
- **History:** one squashed commit, `cb18fcd feat: mise 1.0`, then the release-please 1.0.0 merge, the trusted-publishing switch, and the consumer skill.

**The consumer skill is done (2026-11-09).** `skills/mise/` teaches an agent in an app that uses mise which component does which job, with a catalogue generated from the Props types (`pnpm build:skill`), setup and theming guides, three type-checked recipes, and `mise-theme info --json` for live context. It ships in the package; apps install it with `npx skills add jovertical/mise-design-system --skill mise`, or link the packaged copy with `npx skills experimental_sync`. Spec `docs/specs/2026-11-09-consumer-skill-design.md`, plan `docs/superpowers/plans/2026-11-09-consumer-skill.md`.

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

## Next steps: the user's to choose

Nothing is in progress. Ask which of these comes next:

0. **Check DataTable's faceted filter.** The status filter in the DataTable stories sets an array of values on a column that declares no `filterFn`, and DataTable registers no array filter, so it may not filter at all. The data-table recipe gives its column a `filterFn` to be safe. Confirm in Storybook, and if it is broken, decide whether DataTable should register an `arrIncludesSome`-style default.

1. **The deferred components.** Draggable, Droppable and Sortable (they need a Svelte drag-and-drop library; none is installed) and MermaidDiagram (a heavy optional dependency). The triage defers them until a screen asks for one. If one is wanted, write a plan like round 8's first, and ask the user to install any dependency.
2. **v1 and publishing (D10): done 2026-11-09.** `@jovertical/mise-design-system` 1.0.0 is on npm (tag `v1.0.0`, GitHub release), cut by release-please (`release-please-config.json`, `.github/workflows/release.yml`; the git-workflow skill has the rules). The repo is public, from a fresh single-commit history; the old history is in a git bundle outside the repo. 1.0.0 went out with an npm token and no provenance attestation; later releases publish through npm trusted publishing, which attaches provenance. The release PR's own CI run fails with "workflow file issue" and no jobs; `main`'s CI covers the merged code. A PAT or GitHub App token for release-please would let PR events run CI, if that is ever wanted.

**Licensing is settled (2026-11-09).** The user wrote the React package, so mise's MIT `LICENSE` (Copyright Jovert Palonpon) covers the ported code, and no further notice is needed. At the user's request the tree no longer names that product: `Origin:` headers say "the React package 2.23.0", components not from shadcn/ui are tagged `mise`, and docs use `<react-package>` where a path stood. Keep it that way; the git history still has the old name until the squash at publish.
The small cosmetic items React shares are fixed (2026-11-09): QuantityInput's unit-first trigger sits flush with the group edge (its addon is `pl-0`), NumberInput with controls is capped with `max-w-32` so a Field's `[&>*]:w-full` cannot stretch it, and the neutral wash is softened (above).

## How the work is run

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
- **A stale dev server** fails with "Failed to fetch dynamically imported module" and a `504 Outdated Optimize Dep` on a Lucide icon. Not a code bug; restart it.

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
- **Lucide:** some names are aliases; use the canonical file (`trash`, not `trash-2`). Import a type from one icon, not from the `@lucide/svelte` root, which makes svelte-check load all ~4,300 icons. Lucide has no filled icons; a filled check is `circle-check` with `fill-current [&_path]:text-background`.
- **vaul-svelte** is the `1.0.0-next` line, the Svelte 5 one; `latest` is Svelte 4.

**The React package carried product-specific choices; mise fixed them, each on a `Diverged:` line**

- hard-coded brand hex values, `font-mono`, `--color-blue-*`;
- `bg-accent`, which the React package redefined as the brand tint (mise uses `bg-muted`, or the primary soft wash);
- peso amounts, real tenant names, "tenant" and pricing tiers in story copy (mise uses `$`, generic locations, access or setup);
- product tour hooks (`tourTarget`), dropped.

## Where things are

| What | Where |
| --- | --- |
| Port spec | `docs/specs/2026-11-04-svelte-port-design.md` |
| Structure, skeleton, triage specs | `docs/specs/2026-11-05-*.md` |
| Plans | `docs/superpowers/plans/` (rounds 0–1, 2, 3, 4a, 4b, 6, 7, 8) |
| Naming authority | `docs/naming.md` |
| Main entry, Form entry | `src/lib/index.ts`, `src/lib/form.ts` (`mise/form`) |
| The consumer skill | `skills/mise/` (hand-written `SKILL.md`, guides and recipes; generated `components/`), its generator in `scripts/skill/` and `scripts/build-skill.ts` |
| Tone maps (the neutral wash) | `src/lib/utils/tone.ts` |
| Story scaffolding and fixtures | `stories/` (`story-axis.svelte`, `on-a-card.svelte`, `fixtures/`) |
| Rules, stack, commands | `CLAUDE.md` (copied to `AGENTS.md`), `.ai/guidelines/`, `.claude/skills/` |
| Repository | `github.com/jovertical/mise-design-system` (private), branch `main` |
| Intended consumer | a Laravel, Inertia and Svelte operations app |
