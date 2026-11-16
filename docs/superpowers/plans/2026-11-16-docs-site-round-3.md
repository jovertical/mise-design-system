# Docs site, round 3: DataTable and Sidebar — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline, as rounds 1 and 2) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pages for DataTable and Sidebar, the two largest compound components, each with live examples, an anatomy and the full API.

**Architecture:** No new site machinery. DataTable's examples build on the type-checked recipe the consumer skill already ships (`skills/mise/recipes/data-table.svelte`). Sidebar's examples and anatomy sit in a fixed-height box made the containing block of the sidebar's `position: fixed` panel, the way mise's own stories do it (`sidebar.stories.svelte`: `h-[420px] overflow-hidden [transform:translateZ(0)]`, `SidebarProvider class="min-h-0"`).

**Tech Stack:** as rounds 1 and 2, plus `@tanstack/svelte-table` in `site/` for `renderSnippet` and `renderComponent` in the DataTable examples (mise depends on it; a strict package manager lets the site import only what it lists).

**Spec:** `docs/specs/2026-11-10-docs-site-design.md`. Rounds 1 and 2's plans hold the conventions (page frontmatter, example rules, the overlay recipe in `site/README.md`, the gate).

## Global Constraints

- Branch `docs/site-round-3`, one pull request into `main`; never push to `main`.
- Commits are `docs(site)` or `docs`; nothing moves mise's version.
- Built only from mise; a gap in mise is fixed in mise first (stop and report).
- Semantic tokens only; the clean-code guide holds.
- Example copy: locations, shifts, orders, stock.
- Gate by exit code before each commit: `pnpm test`, `pnpm build:storybook`, `pnpm --filter mise-docs test`; before the pull request, `pnpm build:pages && pnpm --filter mise-docs smoke`.
- The user installs dependencies.
- Every commit ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Known and accepted

- **`⌘B` / `Ctrl B`.** Each `SidebarProvider` listens for the shortcut on the window, so on the Sidebar page it toggles every example's sidebar as well as the docs' own. The page says so in its Keyboard section; changing it would be a mise change (a provider option to not bind the shortcut), out of scope unless the user asks.
- **A sidebar below the mobile breakpoint** renders as a sheet. The examples are for a desktop width; the page notes it.

## Phase (one; 4 tasks)

| Task | Builds |
| --- | --- |
| 1 | The DataTable page (and the site's `@tanstack/svelte-table` dependency) |
| 2 | The Sidebar page |
| 3 | Smoke, the written record |
| 4 | Stop, report, the pull request on the user's word |

---

### Task 1: The DataTable page

**Files:**
- Modify: `site/package.json` (`"@tanstack/svelte-table": "^9.3.1"` in `dependencies`, the version the example uses); the user runs `pnpm install`
- Create: `site/src/routes/components/data-display/data-table/+page.md`, `examples/basic.svelte`, `examples/toolbar.svelte`, `examples/selection.svelte`, `examples/states.svelte`, `examples/grid.svelte`, `examples/anatomy.svelte`. Each example holds its own few orders: the examples plugin reads only `.svelte` files, and an example's source should stand alone when copied

- [ ] **Step 1: Dependency.** Add the line; ask the user to run `pnpm install`; wait; confirm `site/node_modules/@tanstack/svelte-table` exists.
- [ ] **Step 2: Examples.** Read `skills/mise/recipes/data-table.svelte`, `data-table.svelte`'s Props, and `data-table.stories.svelte` first; use only what they use.
  - `basic.svelte`: orders (number, location, status as a toned `Badge`, total), sortable headers with `DataTableColumnHeader`, `title`, `defaultSort`, `getRowId`, `withPadding={false}`.
  - `toolbar.svelte`: the recipe's `DataTableToolbar` with search and a faceted status filter (`filterFn`), and `DataTableRowActions` per row.
  - `selection.svelte`: `enableRowSelection`, `bind:rowSelection`, a bulk action in the toolbar's `actions`.
  - `states.svelte`: a `ToggleGroup` or two `Button`s switching between `isLoading` and an empty `data` with `emptyState`.
  - `grid.svelte`: `viewMode="grid"` with a `card` snippet (a `Card` per order), and `DataTableViewToggle` if the stories pair them.
  - `anatomy.svelte`: the toolbar example's table at four rows, `withPadding={false}`.
- [ ] **Step 3: Page.** `title: DataTable`, `section: Data display`, `order: 1`, description from its Props JSDoc ("A listing: a card holding an optional title, a toolbar, the table and a closing strip…"). A paragraph: sorting and filtering are the server's in a real app (`filters`, `onFiltersChange`, `hasNextPage`, `fetchNextPage`); these examples filter in the browser. Anatomy (default size; read the rendered DOM for which slots appear first): `data-table` (Card), `data-table-toolbar` (Toolbar, `DataTableToolbar`), `table-header` (Header row), `table-head` (Column header, `DataTableColumnHeader`), `table-row` (Row), `table-cell` (Cell), `data-table-row-actions` (Row actions, `DataTableRowActions`), `data-table-strip` (Closing strip); placements chosen in the browser so no line crosses cell text. Examples: With a toolbar, Row selection, Loading and empty, Grid view. "When to use": `Table` for a few rows with no sorting or filtering; `DataTable` for a listing. `ApiTable component="DataTable"`. A "Building columns" section with a fenced snippet of `dataTableColumns<Order>()`, `column.accessor`, `renderComponent(DataTableColumnHeader, …)` and `renderSnippet`, taken from the recipe.
- [ ] **Step 4: Check.** `pnpm --filter mise-docs test`, `build`, and in the browser in light and dark: sorting, search, the filter and selection work in the examples; the anatomy draws every marker.
- [ ] **Step 5: Gate, commit** `docs(site): the DataTable page`.

---

### Task 2: The Sidebar page

**Files:**
- Create: `site/src/routes/components/navigation/sidebar/+page.md`, `examples/nav.svelte`, `examples/composed.svelte`, `examples/collapsible.svelte`, `examples/variants.svelte`, `examples/anatomy.svelte`

- [ ] **Step 1: Examples.** Read `sidebar.stories.svelte`, `sidebar-nav.svelte`, `sidebar.svelte`'s Props (`side`, `variant`, `collapsible`, `sidetheme`) first. Every example wraps its provider the way the stories do: `<div class="h-[420px] w-full overflow-hidden rounded-xl border [transform:translateZ(0)]"><SidebarProvider class="min-h-0">…</SidebarProvider></div>`, with a comment saying the transform makes the box the sidebar's containing block.
  - `nav.svelte`: `SidebarNav` from data (sections Operations and Inventory, a group with sub-rows, a badge, `current` on one row), the way the docs' own sidebar and the logistics demo use it; `SidebarInset` with a `SidebarTrigger`.
  - `composed.svelte`: the parts by hand: `SidebarHeader`, `SidebarContent` with a `SidebarGroup`, `SidebarGroupLabel`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton` (`isActive`), `SidebarMenuBadge`, `SidebarFooter`.
  - `collapsible.svelte`: `collapsible="icon"` with icons on every row, opened and closed by its trigger.
  - `variants.svelte`: a `ToggleGroup` choosing `variant` (`sidebar`, `floating`, `inset`) and one for `sidetheme` (read `SidebarSideTheme` for the names), redrawing one sidebar.
  - `anatomy.svelte`: the composed sidebar, open, with a rail.
- [ ] **Step 2: Page.** `title: Sidebar`, `section: Navigation`, `order: 1`. Opening prose: `SidebarProvider` owns the open state and the CSS variables, `Sidebar` the panel, `SidebarInset` the page beside it; most apps draw the menu with `SidebarNav` from data, as these docs do. Anatomy (default size): `sidebar-wrapper` (Provider), `sidebar-container` (Panel, `Sidebar`), `sidebar-header` (Header), `sidebar-content` (Content), `sidebar-group` (Group), `sidebar-menu` (Menu), `sidebar-menu-item` (Item), `sidebar-menu-badge` (Badge), `sidebar-footer` (Footer), `sidebar-rail` (Rail), `sidebar-inset` (Inset), `sidebar-trigger` (Trigger); placements in the browser (the panel's parts `left`, the inset's `right`). Examples: Composed by hand, Collapsing to icons, Variants and themes. "When to use": the app's main menu; `Tabs` for sections of one page. `ApiTable component="Sidebar"`, and `ApiTable component="SidebarNav"` only if `componentDocs` lists it as its own folder (it lives in the sidebar folder, so it is a part of `Sidebar`'s table; check, and link its section instead). Keyboard: `⌘B` / `Ctrl B` toggles the sidebar, with the note from "Known and accepted"; the rest is links and buttons.
- [ ] **Step 3: Check** as Task 1; also that the docs' own sidebar is unaffected by the examples (other than `⌘B`).
- [ ] **Step 4: Gate, commit** `docs(site): the Sidebar page`.

---

### Task 3: Smoke, the written record

- [ ] **Step 1:** `pnpm build:pages && pnpm --filter mise-docs smoke`: every route ✓, the two new pages in both schemes with every marker drawn.
- [ ] **Step 2:** `site/README.md` gains the boxed-sidebar recipe beside the overlay one. `docs/handoff.md`: round 2 merged and live, round 3 on `docs/site-round-3`; later rounds, group by group, each with its own plan.
- [ ] **Step 3:** Gate, commit `docs: the boxed sidebar recipe, and round 3 in the handoff`.

### Task 4: Stop

Report (tasks, smoke output, anything that differed). On the user's yes: push, `gh pr create --base main --title "docs: the docs site, round 3 (DataTable, Sidebar)"`, watch `check`. Merge only on the user's word; then confirm Pages deployed and both pages draw their anatomy on the live site.
