# Docs site, round 2: overlays (Dialog, Select, Sonner) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (the user chose inline execution in round 1) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pages for Dialog, Select and Sonner, each with a live anatomy of the open overlay drawn inside its stage, and the Anatomy changes overlays need.

**Architecture:** Round 1's site, unchanged in shape. `Anatomy` gains a contained stage (`contain: layout paint`, so a `position: fixed` overlay and its backdrop stay inside it), markers above the overlay, a second measure after open animations, a `size` for taller stages, and an optional `selector` for parts a dependency renders without a `data-slot`. The examples plugin reloads a page's examples when a file is added in dev.

**Tech Stack:** as round 1: SvelteKit 3, mdsvex, mise, bits-ui (through mise), svelte-sonner (through mise), Vitest, headless Chrome smoke.

**Spec:** `docs/specs/2026-11-10-docs-site-design.md` (amended in this plan's commit: the anatomy's `selector`). Round 1's plan, `docs/superpowers/plans/2026-11-10-docs-site-round-1.md`, has the conventions this plan does not repeat in full (page frontmatter, example rules, the gate).

## Global Constraints

- Branch `docs/site-round-2`, one pull request into `main`. Never push to `main`.
- Commits are `docs(site)` or `docs`; nothing moves mise's version.
- The site is built only from mise. A gap in a mise component (a part that cannot render inline) is fixed in mise first, on its own branch, and released before the page uses it; stop and report if one turns up.
- Colours from mise's semantic tokens only; the clean-code guide holds (`.svelte` ≤ 250 lines, `.ts` ≤ 300, functions ≤ 40, `pnpm fix:spacing` then `pnpm format`).
- Example copy is generic operations: locations, shifts, orders, stock.
- Gate before each commit, by exit code: `pnpm test`, `pnpm build:storybook`, `pnpm --filter mise-docs test`; and before the pull request, `pnpm build:pages && pnpm --filter mise-docs smoke`.
- Every commit ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Findings from the spike (2026-11-16, throwaway, deleted)

- **Dialog** is `position: fixed` with a fixed backdrop. With `portalProps={{ disabled: true }}` it still covers the viewport, and as a modal it traps focus, locks scroll and closes on Escape. With the stage at `contain: layout paint` and `overflow: hidden`, the dialog and its backdrop centre inside the stage. bits-ui's `trapFocus={false}`, `preventScroll={false}`, `interactOutsideBehavior="ignore"` and `escapeKeydownBehavior="ignore"` (passed through `DialogContent`'s rest props) keep the page usable. The backdrop (`z-50`, blurred) draws over the markers, so markers need a higher layer.
- **Select** works inline: `open` on `Select`, `portalProps={{ disabled: true }}` and the same behaviour props on `SelectContent`; floating-ui places the list under its trigger inside the stage.
- **Sonner**: a second `<Toaster id="anatomy">` in the example and `toast(…, { toasterId: 'anatomy', duration: Infinity })` render a toast inside the stage and nowhere else; the page's own `Toaster` (no id) ignores it. svelte-sonner marks its parts `data-sonner-toast`, `data-title`, `data-description`, `data-button`, `data-icon`, not `data-slot`, so the anatomy needs a selector for them.
- **Dev server**: a new file in an `examples/` folder is not seen until the server restarts (round 1 stopped watching the folder because Vite treats a watched folder as an import).

## Spec amendment (in this plan's commit)

In "Anatomy", after the slot rule: *A part a dependency renders without a `data-slot` (svelte-sonner's toast) is found by `selector` instead, a CSS selector such as `[data-sonner-toast]`. `site/tests/pages.test.ts` checks slots against mise's source; a selector is checked by the smoke run, which fails when a part is not found.*

## Phase (one; 5 tasks)

| Task | Builds |
| --- | --- |
| 1 | Anatomy for overlays, and the examples plugin watching for new files |
| 2 | The Dialog page |
| 3 | The Select page |
| 4 | The Sonner page |
| 5 | Smoke, the written record, the pull request |

Gate: stop after Task 5, report, wait for the user's review and word to merge.

---

### Task 1: Anatomy for overlays; new example files in dev

**Files:**
- Modify: `site/src/modules/docs/components/anatomy.svelte`, `site/vite/examples.ts`, `site/tests/pages.test.ts` (selector parts skip the slot check)
- Test: `site/tests/anatomy.test.ts`, `site/tests/vite-plugins.test.ts`

**Interfaces:**
- `AnatomyPart` becomes `{ slot?: string; selector?: string; label: string; part?: string; placement?: Placement }`; exactly one of `slot` or `selector`. The part's query is `selector ?? [data-slot="${slot}"]`, and its key (legend, `data-anatomy-missing`, the `#each` key) is `slot ?? selector`.
- `AnatomyProps` gains `size?: 'md' | 'lg'`: `md` (default) `min-h-64`, `lg` `min-h-96` for an open overlay.
- `examples()` gains `configureServer(server)`: on `add` or `unlink` of a `.svelte` file whose folder is named `examples`, it invalidates that folder's `__examples__.js` module and sends a full reload.

- [ ] **Step 1: Failing tests.** In `site/tests/anatomy.test.ts` add:

```ts
it('finds a part by selector when a dependency renders it without a data-slot', async () => {
  const { container } = render(Anatomy, {
    example,
    parts: [{ selector: '[data-slot="part-one"]', label: 'By selector' }],
  })

  await tick()

  expect(container.querySelectorAll('[data-anatomy-marker]')).toHaveLength(1)
})

it('measures again when an open animation ends', async () => {
  const { container } = render(Anatomy, { example, parts })

  await tick()

  RECTS['part-one'] = { x: 120, y: 100, width: 80, height: 40 }

  await fireEvent.animationEnd(container.querySelector('[data-slot="part-one"]') as HTMLElement)

  await fireEvent.mouseEnter(screen.getByText('First').closest('li') as HTMLElement)

  expect(container.querySelector<HTMLElement>('[data-anatomy-outline]')?.style.left).toBe('120px')
})

it('contains the stage, so a fixed overlay stays inside it', () => {
  const { container } = render(Anatomy, { example, parts, size: 'lg' })
  const stage = container.querySelector('[data-anatomy-stage]')

  expect(stage?.className).toContain('[contain:layout_paint]')

  expect(stage?.className).toContain('min-h-96')
})
```

Reset `RECTS['part-one']` in `beforeEach` (copy the constant per test) so the animation test does not leak. In `site/tests/vite-plugins.test.ts`, add a test that `examples().configureServer` is defined, and a unit test for the pure helper `examplesModuleFor(file: string): string | null` (returns `<folder>/__examples__.js` for `/x/examples/basic.svelte`, `null` for `/x/other/basic.svelte` and for `/x/examples/notes.md`).

- [ ] **Step 2: Run them; they fail.** `pnpm --filter mise-docs vitest run tests/anatomy.test.ts tests/vite-plugins.test.ts`.

- [ ] **Step 3: Anatomy.**
  - Stage class: `relative flex flex-wrap items-center justify-center gap-4 overflow-hidden px-16 py-10 [contain:layout_paint]`, plus `min-h-64` or `min-h-96` by `size`. Comment why: `contain: layout` makes the stage the containing block of a `position: fixed` overlay.
  - The SVG layer, markers and outline get `z-[60]` (above an overlay's `z-50`).
  - `measure` queries `part.selector ?? \`[data-slot="${part.slot}"]\``; `missing` holds keys (`slot ?? selector`).
  - In the `$effect`, add `stage.addEventListener('animationend', measure)` and `'transitionend'`, removed in the cleanup.
  - Legend: show the key in the `code` cell; `#each` keyed by it.
  - Keep `anatomy.svelte` under 250 lines; move the query and key into `anatomy-layout.ts` as `partQuery(part)` and `partKey(part)` if it grows.

- [ ] **Step 4: Examples plugin.** Export `examplesModuleFor(file)`; in `configureServer`, `server.watcher.on('add', handle)` and `on('unlink', handle)`, where `handle` finds the module by `server.moduleGraph.getModuleById(examplesModuleFor(file))`, calls `server.moduleGraph.invalidateModule(module)` and `server.ws.send({ type: 'full-reload' })`. Keep `examples()` under 40 lines by putting the handler in a named function below.

- [ ] **Step 5: `pages.test.ts`.** The slot check matches only `slot: '…'`; a `selector: '…'` part is left to the smoke run. Add a comment saying so.

- [ ] **Step 6: Run the tests; they pass.** Then `pnpm dev:site`, add a throwaway `examples/zz.svelte` under the Button page, confirm the page reloads with `examples.zz` defined, delete it.

- [ ] **Step 7: Gate, commit** `docs(site): anatomy for overlays, and new example files picked up in dev`.

---

### Task 2: The Dialog page

**Files:**
- Create: `site/src/routes/components/overlays/dialog/+page.md`, `examples/basic.svelte`, `examples/sizes.svelte`, `examples/with-form.svelte`, `examples/scrolling.svelte`, `examples/anatomy.svelte`

**Interfaces:** consumes Task 1's `size` and the existing `Preview`, `Anatomy`, `ApiTable`.

- [ ] **Step 1: Examples.** Read `src/lib/components/overlays/dialog/*.svelte` and `dialog.stories.svelte` first; use only props they have.
  - `basic.svelte`: a `DialogTrigger` (`Button variant="outline"` via the trigger's `child` snippet, as the stories do) "Close location", opening a real dialog (normal portal and behaviour): title "Close Sta Cruz for the day?", description "Open orders move to tomorrow's shift.", footer with `DialogClose` "Cancel" and a solid "Close location".
  - `sizes.svelte`: one trigger per `DialogSize` (read `DIALOG_SIZE_CLASS` for the names).
  - `with-form.svelte`: "Rename shift" with `Field`, `Label`, `Input`, footer Save.
  - `scrolling.svelte`: long content (twelve stock lines) in a fixed-height body, as the stories show scrolling.
  - `anatomy.svelte`: `<Dialog open>` with `DialogContent portalProps={{ disabled: true }} trapFocus={false} preventScroll={false} interactOutsideBehavior="ignore" escapeKeydownBehavior="ignore"`, header, title, description, footer. A comment says why each prop is there.
- [ ] **Step 2: Page.** Frontmatter: `title: Dialog`, description from `DialogContentProps`' JSDoc or "A task in a window over the page, which takes focus until it is answered or dismissed.", `section: Overlays`, `order: 1` (check `SECTIONS` has `Overlays`). Sections: hero `Preview` (basic), "Anatomy" with `size="lg"` and parts `dialog-overlay` (Overlay, `DialogOverlay`), `dialog-content` (Content, `DialogContent`), `dialog-header` (Header), `dialog-title` (Title, `DialogTitle`), `dialog-description` (Description), `dialog-footer` (Footer), `dialog-close` (Close button); pick placements so lines do not cross the text (side for the stacked parts; check in the browser). Examples: Sizes, With a form, Scrolling content; a "When to use" paragraph pointing to `AlertDialog` for "are you sure?" and `Sheet` for a side panel (plain text, no links: those pages do not exist yet, and a link would fail the prerender). `ApiTable component="Dialog"`. Keyboard: `Esc` closes, `Tab`/`Shift+Tab` cycle inside, focus returns to the trigger on close.
- [ ] **Step 3: Check.** `pnpm --filter mise-docs test` (pages checks), `pnpm --filter mise-docs build`, then in `pnpm dev:site`, light and dark: the anatomy's dialog sits inside its stage, every marker is visible above the backdrop, the page still scrolls and takes focus, and the basic example opens a real dialog over the page.
- [ ] **Step 4: Gate, commit** `docs(site): the Dialog page, its anatomy open inside the stage`.

---

### Task 3: The Select page

**Files:**
- Create: `site/src/routes/components/forms/select/+page.md`, `examples/basic.svelte`, `examples/groups.svelte`, `examples/in-a-field.svelte`, `examples/disabled.svelte`, `examples/anatomy.svelte`

- [ ] **Step 1: Examples.** Read `select.svelte`, `select-trigger.svelte`, `select.stories.svelte` first.
  - `basic.svelte`: a single select of shifts (Day, Night, Weekend) with `bind:value` and the selected label in the trigger, as the stories do.
  - `groups.svelte`: locations grouped by region with `SelectGroup`, `SelectLabel`, `SelectSeparator`.
  - `in-a-field.svelte`: inside `Field` with `Label` and a description, the way a form uses it.
  - `disabled.svelte`: a disabled select and a disabled item.
  - `anatomy.svelte`: `<Select type="single" open value="day">` in a `div` tall enough for the list, `SelectContent portalProps={{ disabled: true }} preventScroll={false} interactOutsideBehavior="ignore" escapeKeydownBehavior="ignore"`, with a label, two items and a separator.
- [ ] **Step 2: Page.** `title: Select`, `section: Forms`, `order: 1`. Anatomy (`size="lg"`): `select-trigger` (Trigger, `SelectTrigger`, `placement: 'top'`), `select-value` (Value), `select-content` (Content, `SelectContent`), `select-label` (Group label), `select-item` (Item, `SelectItem`), `select-item-indicator` (Selected mark), `select-separator` (Separator); placements chosen so no line crosses item text. A "When to use" paragraph: one choice from many; `RadioGroup` for a few, `Combobox` when it needs search (plain text). `ApiTable component="Select"`. Keyboard: `Space`/`Enter`/`ArrowDown` opens, arrows move, typing jumps to a match, `Enter` selects, `Esc` closes.
- [ ] **Step 3: Check** as Task 2.
- [ ] **Step 4: Gate, commit** `docs(site): the Select page`.

---

### Task 4: The Sonner page

**Files:**
- Create: `site/src/routes/components/feedback/sonner/+page.md`, `examples/basic.svelte`, `examples/types.svelte`, `examples/with-action.svelte`, `examples/promise.svelte`, `examples/anatomy.svelte`

- [ ] **Step 1: Examples.** The page's own `Toaster` is in the site layout, so examples call `toast(…)` from a button and the toast appears where a real app's would.
  - `basic.svelte`: "Save count" calls `toast('Stock count saved')`.
  - `types.svelte`: buttons for `toast.success`, `toast.info`, `toast.warning`, `toast.error`, each with operations copy.
  - `with-action.svelte`: a toast with `description` and `action: { label: 'Undo', onClick }`.
  - `promise.svelte`: `toast.promise` over a 1.5s timer, loading, success and error messages.
  - `anatomy.svelte`: its own `<Toaster id="anatomy" position="bottom-center" />` and, in an `$effect`, `toast.success('Stock count saved', { toasterId: 'anatomy', description: 'Riverside, 412 items counted.', duration: Number.POSITIVE_INFINITY, action: { label: 'Undo', onClick: () => {} } })`, returning a cleanup that dismisses it. A comment says why the toaster has an id (so the page's toaster does not show it too).
- [ ] **Step 2: Page.** `title: Toaster` (the export's name; the URL keeps the folder, `/components/feedback/sonner`), `section: Feedback`, `order: 1`. Opening prose: render `Toaster` once in the root layout, then call `toast()` anywhere. Anatomy (`size="lg"`) by selector: `[data-sonner-toast]` (Toast), `[data-icon]` (Icon), `[data-title]` (Title), `[data-description]` (Description), `[data-button]` (Action); a sentence saying these parts are svelte-sonner's. Examples: Types, With an action, Promise. API: `ApiTable component="Toaster"`, then a hand-written "`toast()`" table (`toast(message, options)`, `.success`, `.info`, `.warning`, `.error`, `.promise`, `.dismiss`; options `description`, `action`, `duration`, `id`, `toasterId`), checked against `node_modules/svelte-sonner/dist/types.d.ts`.
- [ ] **Step 3: Check** as Task 2; also that pressing the hero example shows exactly one toast.
- [ ] **Step 4: Gate, commit** `docs(site): the Toaster page, its anatomy found by svelte-sonner's own attributes`.

---

### Task 5: Smoke, the written record, the pull request

- [ ] **Step 1:** `pnpm build:pages && pnpm --filter mise-docs smoke`; every route ✓, including the three new pages in both schemes with every anatomy marker drawn.
- [ ] **Step 2:** `site/README.md`'s "Adding a component page" gains the overlay recipe (open inline with `portalProps={{ disabled: true }}` and the behaviour props; `size="lg"`) and `selector` for dependency-rendered parts; and notes that new example files now reload in dev. `docs/handoff.md`'s `docs/site` entry: round 1 merged and live, round 2 on `docs/site-round-2`.
- [ ] **Step 3:** Gate, commit `docs: the overlay anatomy recipe, and round 2 in the handoff`.
- [ ] **Step 4: STOP.** Report (tasks, smoke output, anything that differed). On the user's yes: push, `gh pr create --base main --title "docs: the docs site, round 2 (Dialog, Select, Toaster)"`, watch `check`. Merge only on the user's word; then confirm Pages deployed and the three pages load with their anatomy on the live site.
