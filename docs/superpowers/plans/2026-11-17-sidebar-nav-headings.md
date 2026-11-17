# SidebarNav sub-headings — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline, as the docs rounds). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A `SidebarNav` group may hold muted, unclickable headings among its rows, so a long group splits into named runs: piece 1 of the docs organisation.

**Architecture:** A new data type, `SidebarNavSubHeading = { heading: string }`, joins `SidebarNavSubLink` in a group's `items`. The pure helpers in `sidebar-nav.ts` skip headings; `sidebar-nav-group.svelte` draws one as an `<li>` label inside `SidebarMenuSub` when expanded, and as a `DropdownMenuLabel` in the icon rail's menu. Additive: every existing menu renders as before.

**Tech Stack:** Svelte 5, bits-ui, Vitest with Testing Library, Storybook (addon-svelte-csf).

**Spec:** `docs/specs/2026-11-17-docs-organisation-design.md`, "The mise change this needs".

## Global Constraints

- Branch `feat/sidebar-nav-headings` (it carries the spec); one pull request into `main` on the user's word; never push to `main`.
- Commit type `feat(sidebar)`, never `feat!`: mise ships API changes as minors. release-please owns the version, CHANGELOG and tags; the user merges its pull request.
- The authors-components skill holds: `Origin`/`Diverged` headers, prose comments on decisions, semantic tokens, the story skeleton.
- The clean-code guide holds: no abbreviations, statements separated by blank lines (`pnpm fix:spacing`), functions ≤40 lines.
- Gate by exit code before each commit: `pnpm test` and `pnpm build:storybook`; `pnpm --filter mise-docs test` too, since the site builds against this source.
- Every commit ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

---

### Task 1: The heading type, and helpers that skip it

**Files:**
- Modify: `src/lib/components/navigation/sidebar/sidebar-nav.ts`
- Modify: `src/lib/components/navigation/sidebar/index.ts` (export the two new types)
- Test: `tests/sidebar-nav.test.ts`

**Interfaces:**
- Produces: `type SidebarNavSubHeading = { heading: string }`, `type SidebarNavSubItem = SidebarNavSubLink | SidebarNavSubHeading`, `SidebarNavGroup.items: SidebarNavSubItem[]`, `isNavSubHeading(item: SidebarNavSubItem): item is SidebarNavSubHeading` (module-internal, like `isNavGroup`; not in the barrel).

- [ ] **Step 1: Failing tests.** In `tests/sidebar-nav.test.ts`, add a section with a headed group and two cases:

```ts
const HEADED: SidebarNavSection[] = [
  {
    label: 'Components',
    items: [
      {
        label: 'Forms',
        items: [
          { heading: 'Text input' },
          { label: 'Input', href: '/components/forms/input' },
          { heading: 'Choices' },
          { label: 'Select', href: '/components/forms/select' },
        ],
      },
    ],
  },
]

describe('sub-headings', () => {
  it('are never the current row', () => {
    expect(activeHref(HEADED, '/components/forms/select')).toBe('/components/forms/select')
  })

  it('leave the group holding its rows', () => {
    expect(groupsHolding(HEADED, '/components/forms/input')).toEqual(['Forms'])
  })
})
```

- [ ] **Step 2: Run** `pnpm vitest run tests/sidebar-nav.test.ts`. Expected: a type error in `svelte-check` terms and, at runtime, `activeHref` mapping a heading's `undefined` href; the second case may pass by accident, the first fails on `matchesPath(current, undefined)`.
- [ ] **Step 3: Implement** in `sidebar-nav.ts`, below `SidebarNavSubLink`:

```ts
/**
 * A label among a group's rows, naming the run below it: "Text input" over
 * Input and Textarea. Not a link and never current. For a group long enough
 * that its rows want names; a short one reads better without.
 */
export type SidebarNavSubHeading = { heading: string }

export type SidebarNavSubItem = SidebarNavSubLink | SidebarNavSubHeading
```

`SidebarNavGroup.items` becomes `SidebarNavSubItem[]`. Add the guard beside `isNavGroup`:

```ts
export function isNavSubHeading(item: SidebarNavSubItem): item is SidebarNavSubHeading {
  return 'heading' in item
}
```

and make the two helpers read links only:

```ts
function subLinks(group: SidebarNavGroup): SidebarNavSubLink[] {
  return group.items.filter((child) => !isNavSubHeading(child))
}
```

`hrefsOf` maps `subLinks(item)` instead of `item.items`; `groupsHolding` tests `subLinks(group).some(…)`. Update the file's `Diverged:` line: "…mise owns it (2026-11-10). A group may hold sub-headings (2026-11-17)." Export `type SidebarNavSubHeading` and `type SidebarNavSubItem` from `index.ts` in the existing `sidebar-nav.js` block (types only, so `EXPECTED_EXPORTS` does not change).
- [ ] **Step 4: Run** `pnpm vitest run tests/sidebar-nav.test.ts`. Expected: PASS. `pnpm check` will now fail in `sidebar-nav-group.svelte` (items keyed by `href`): Task 2 fixes it; do not commit yet.

### Task 2: Drawing a heading, expanded and collapsed

**Files:**
- Modify: `src/lib/components/navigation/sidebar/sidebar-nav-group.svelte`
- Modify: `tests/fixtures/sidebar-nav-harness.svelte` (a `headed` prop)
- Test: `tests/sidebar-nav.test.ts`

**Interfaces:**
- Consumes: `isNavSubHeading`, `SidebarNavSubItem` from Task 1.
- Produces: `data-slot="sidebar-nav-sub-heading"` on the expanded heading; the collapsed one is a `DropdownMenuLabel` (`data-slot="dropdown-menu-label"`).

- [ ] **Step 1: Harness.** Add `headed = false` to the harness props; when true, `SECTIONS` gets a third section:

```ts
{
  label: 'Components',
  items: [
    {
      label: 'Forms',
      items: [
        { heading: 'Text input' },
        { label: 'Input', href: '/components/forms/input' },
        { heading: 'Choices' },
        { label: 'Select', href: '/components/forms/select' },
      ],
    },
  ],
}
```

(build `SECTIONS` with `$derived` so the prop is read reactively, or spread the extra section in conditionally).
- [ ] **Step 2: Failing tests** in the `SidebarNav` describe:

```ts
it('draws a sub-heading as a label among the rows, not a link', () => {
  render(SidebarNavHarness, { current: '/components/forms/select', headed: true })

  const heading = screen.getByText('Choices')

  expect(heading).toHaveAttribute('data-slot', 'sidebar-nav-sub-heading')
  expect(screen.queryByRole('link', { name: 'Choices' })).toBeNull()
  expect(screen.getByRole('link', { name: 'Select' })).toHaveAttribute('aria-current', 'page')
})

it('draws a sub-heading as a menu label when collapsed to icons', async () => {
  render(SidebarNavHarness, { current: '/', open: false, headed: true })

  await userEvent.click(screen.getByRole('button', { name: 'Forms' }))

  expect(await screen.findByText('Text input')).toHaveAttribute('data-slot', 'dropdown-menu-label')
})
```

- [ ] **Step 3: Run** them. Expected: FAIL (a heading renders as a broken link row, or the each-block key is `undefined` twice).
- [ ] **Step 4: Implement.** In `sidebar-nav-group.svelte` import `DropdownMenuLabel` and `isNavSubHeading`, key both each-blocks by a heading's text or a row's href, and branch:

```svelte
{#snippet subHeading(text: string)}
  <!-- A label, not a link: it names the rows below it and is never current. -->
  <li
    data-slot="sidebar-nav-sub-heading"
    class="text-sidebar-foreground/60 px-2 pt-2 pb-0.5 text-xs font-medium first:pt-0.5"
  >
    {text}
  </li>
{/snippet}
```

expanded:

```svelte
{#each group.items as item (isNavSubHeading(item) ? `heading:${item.heading}` : item.href)}
  {#if isNavSubHeading(item)}
    {@render subHeading(item.heading)}
  {:else}
    <SidebarNavLink {item} {active} {link} sub />
  {/if}
{/each}
```

collapsed, inside `DropdownMenuContent`: the same key; a heading is `<DropdownMenuLabel>{item.heading}</DropdownMenuLabel>`, a row the existing `DropdownMenuItem`. Check the label's colour on all three `sidetheme`s in Storybook (Task 3); `text-sidebar-foreground/60` follows the theme's foreground. Append to the header's `Diverged:` "A heading among the rows is a label, expanded or in the menu."
- [ ] **Step 5: Run** `pnpm vitest run tests/sidebar-nav.test.ts` and `pnpm check`. Expected: PASS, no type errors.

### Task 3: The story, the catalogue, the commit

**Files:**
- Modify: `src/lib/components/navigation/sidebar/sidebar.stories.svelte`
- Regenerate: the consumer skill's catalogue (`pnpm build:skill`)

- [ ] **Step 1: Story.** Give `navShell` a `sections = NAV` parameter (`{#snippet navShell(current: string, open = true, sections: SidebarNavSection[] = NAV)}`, passing `sections` to `SidebarNav`). Add `NAV_HEADED` beside `NAV`:

```ts
/** A group long enough that its rows want names. */
const NAV_HEADED: SidebarNavSection[] = [
  {
    label: 'Inventory',
    items: [
      {
        label: 'Stock',
        icon: IconPackage,
        items: [
          { heading: 'Counts' },
          { label: 'Stock levels', href: '/stock/levels' },
          { label: 'Stock counts', href: '/stock/counts' },
          { heading: 'Movements' },
          { label: 'Transfers', href: '/stock/transfers' },
          { label: 'Adjustments', href: '/stock/adjustments' },
        ],
      },
    ],
  },
]
```

(import `IconPackage` from `@tabler/icons-svelte-runes/icons/package`), and after "With nav":

```svelte
<!--
  A group whose rows fall into runs takes `{ heading }` items among them: a
  muted label, not a link, never current. Collapsed to icons, it is a label in
  the group's menu.
-->
<Story name="With nav sub-headings" asChild>
  {@render navShell('/stock/transfers', true, NAV_HEADED)}
</Story>
```

- [ ] **Step 2: Look** in `pnpm storybook` at "With nav sub-headings" in panel, primary and light (the Themes control), expanded and collapsed: the heading reads as a label, quieter than a row, aligned with the rows' text.
- [ ] **Step 3: Catalogue.** `pnpm build:skill`; `git diff skills/` shows the new types in the Sidebar entry.
- [ ] **Step 4: Gate and commit.** `pnpm fix:spacing && pnpm format`; `pnpm test`, `pnpm build:storybook`, `pnpm --filter mise-docs test`, all exit 0. Commit the plan, the source, tests, story and skill as `feat(sidebar): sub-headings inside a SidebarNav group`.
- [ ] **Step 5: Stop and report.** On the user's word: push, `gh pr create --base main --title "feat(sidebar): sub-headings inside a SidebarNav group"` (body: what, why, the spec link, the checks), watch `check`. The user merges and releases; then site round A gets its plan.
