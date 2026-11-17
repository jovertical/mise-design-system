# Docs site organisation — Design

**Date:** 2026-11-17. **Status:** approved; built on `feat/sidebar-nav-headings` and `docs/site-organisation`.

**Context:** rounds 1–11 of `2026-11-10-docs-site-design.md` gave every mise component a page: 88 component pages in eight sections, listed flat in the sidebar by `order`. Forms (25) and Data display (23) are long lists, there is no page listing the components, and search matches only a page's section, title and description.

**Goal:** a reader finds a component by browsing (sub-groups, an overview), by filtering (tags) or by the job it does (search keywords), and sees a component's provenance and age on its page.

## Decisions

| | Choice |
| --- | --- |
| Sidebar | Sections fold; sub-groups are headings inside them (mockup C) |
| Overview | A compact table per sub-group, filterable (mockup C) |
| Tags on a page | In the right rail, above "On this page" (mockup C); hidden where the rail is |
| Tag kinds | Origin, since-version, traits (shown); keywords (search only) |
| Traits | A fixed vocabulary, enforced by the page test |
| Since | Generated from the release tags into a committed JSON |
| Where metadata lives | Page frontmatter; origin and since generated |

## 1. Navigation

The sidebar keeps "Getting started" and "Foundations" as labelled sections. Below them one **Components** section holds an **Overview** row (`/components`) and one folding group per mise group, in mise's order: Typography, Actions, Forms, Navigation, Layout, Overlays, Feedback, Data display. The group holding the current page opens; the others start closed, open on a click, and `persistKey` remembers them.

Four groups have sub-groups, drawn as muted, unclickable headings inside the group's list; the other four list their pages directly.

| Group | Sub-groups and pages |
| --- | --- |
| Forms | **Fields:** Field, Label, Form · **Text input:** Input, Textarea, InputGroup, NumberInput, QuantityInput, InputOTP · **Choices:** Select, Combobox, Checkbox, CheckboxGroup, RadioGroup, ChoiceRow, Switch, SwitchField, Toggle, ToggleGroup, ButtonGroup · **Dates and files:** Calendar, DatePicker, MonthPicker, TimePicker, MediaDropzone |
| Data display | **Tables:** DataTable, Table · **Labels:** Badge, DeltaBadge, IconChip, Avatar, EntityLabel, Item · **Records:** FactList, Timeline, TreeLeaf, SegmentedCode · **Measures:** StatTile, MetricGrid, MetricBar, MetricRow, RadialStat, SegmentedBar, Sparkline, Chart · **Workflows:** Board, Checklist, Readiness |
| Feedback | **Messages:** Toaster, Alert · **Page states:** Empty, EmptyState, ErrorState, LoadingState · **Progress:** Spinner, Skeleton, Progress, NavigationProgress · **Gates:** FeaturePreview, LockedOverlay |
| Layout | **Page:** PageLayout, PageHeader, SiteHeader · **Cards:** Card, CardGrid, CardList, AsideCard, SummaryCard · **Structure:** Collapsible, Separator |

The sub-groups and their order are a list in `site/src/modules/nav/data/navigation.ts`, beside `SECTIONS`; a page's place within its sub-group is still its `order`.

### The mise change this needs

`SidebarNav` cannot draw a heading inside a group: a group's `items` are `SidebarNavSubLink[]`. mise gains, as an additive `feat` in its own pull request before the site work:

- `SidebarNavSubHeading = { heading: string }`, and a group's `items` become `(SidebarNavSubLink | SidebarNavSubHeading)[]`.
- Drawn as a muted label inside the group's `SidebarMenuSub`; in the icon rail's dropdown, a `DropdownMenuLabel`.
- An `isNavSubHeading` guard beside `isNavGroup`; active-row matching skips headings.
- A story ("With sub-headings"), a test, the catalogue rebuilt (`pnpm build:skill`), the JSDoc saying when to use one.

The site builds against mise's source through the workspace, so it uses the change once merged; the release follows release-please as always.

## 2. Metadata

### Frontmatter

A component page gains:

```yaml
group: Text input            # required in Forms, Data display, Feedback and Layout; absent elsewhere
traits: [keyboard, form control]
keywords: [money, currency, amount]
```

`traits` and `keywords` are optional. Keywords are lowercase words a reader might search for that the title and description do not contain: `kpi` on StatTile, `kanban` on Board, `dropdown` on Select and DropdownMenu.

### Traits

A fixed vocabulary in `site/src/modules/nav/data/traits.ts`:

| Trait | Means |
| --- | --- |
| `keyboard` | The page documents keys beyond Tab and Enter |
| `overlay` | Opens above the page (dialog, popover, menu) |
| `form control` | Holds a value a form submits |
| `draggable` | Something in it moves by dragging |
| `server data` | Built to page, sort or filter on the server |

A new trait is a line in that file and nowhere else.

### Origin

`shadcn` or `mise`, from the `Origin:` line of the folder's root component, by the rule `tests/provenance.test.ts` already applies: `shadcn` when the line mentions `shadcn/ui`, `mise` otherwise. The `virtual:mise-api` plugin, which already reads every folder, adds `origin` to each `FolderDoc` it serves. A page's origin is its `ApiTable` component's folder's.

### Since

`site/scripts/since.ts` (`pnpm --filter mise-docs since`) lists the `v*` tags in version order and, for each component folder, finds the first tag whose tree has `src/lib/components/<group>/<folder>/` (`git ls-tree`), wherever the folder sat at the time. It writes `site/src/modules/docs/data/since.json` (`{ "<folder>": "1.6.0" }`), which is committed. The walk is a pure function over a tag-to-folders map, so it is tested without git.

It is re-run after each release; `site/README.md` and the handoff say so. A folder with no entry shows **Unreleased** rather than failing a test, so a new component's page can merge before its release.

**New** means a component's `since` has the current version's major and minor (1.8 today), or it is unreleased.

### Checks (`site/tests/pages.test.ts`)

- `group` is one of its section's sub-groups, present exactly where the section has them.
- Every trait is in the vocabulary; keywords are lowercase.
- Every sub-group has at least one page.

## 3. Pages, rail and search

### The overview, `/components`

A prerendered page built only from mise parts:

- An `Input` filtering by name, description and keywords as you type.
- A `ToggleGroup` (multiple) of chips: `shadcn`, `mise`, `New`, and each trait. Chosen chips combine with AND.
- One `Table` per section and sub-group, headed "Forms · Text input": the name as a link, the description, the tags as `Badge`s.
- An `EmptyState` when nothing matches, with a way to clear the filters.

The chips chosen are mirrored in the URL (`?tag=keyboard&tag=mise`), so a page's badge links to a filtered overview. A prerendered page cannot read the query, so the page reads it in the browser after it loads (as `scheme-from-url` does) and writes it back with `replaceState` as chips change. The filter is a pure function in `modules/nav/utils/`, tested on its own.

### A component page

- The right rail gains a **Tags** block above "On this page": origin, `since 1.x` or `Unreleased`, and the traits, each a `Badge` linking to `/components?tag=…`. Below the breakpoint where the rail hides, the tags hide with it.
- The eyebrow above the title reads "Forms · Text input" where the page has a sub-group.

### Search

The ⌘K palette's match text for a page gains its group, traits and keywords. Results stay grouped by section.

## Testing

- Unit: the sidebar's sections and sub-groups from page metadata; the since walk; the origin rule; the overview filter.
- `pages.test.ts`: the checks above.
- Smoke: `/components` joins the routes, in both schemes.
- mise's own gate for the `SidebarNav` change.

## Delivery

Three pieces, each with its own plan, gate and pull request:

1. **mise:** `SidebarNav` sub-headings (`feat(sidebar)`). The user merges and releases.
2. **Site round A:** frontmatter on the 88 pages, the folding sidebar with sub-groups, origin in `virtual:mise-api`, the since script and `since.json`, search keywords, the page checks.
3. **Site round B:** the overview page, the rail's Tags block, the eyebrow.

## Out of scope

- Live thumbnails on the overview (mockup B was declined).
- Tags on Foundations or Getting started pages.
- Sub-groups for Typography, Actions, Navigation and Overlays.
