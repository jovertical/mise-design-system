---
name: mise
description: >-
  Builds Svelte 5 UI in an app that uses @jovertical/mise-design-system: picking the mise
  component for a job, its props and defaults, theming, and setting mise up. Activates when
  writing or changing Svelte UI in an app that depends on @jovertical/mise-design-system, or
  setting mise up in a new app; or when the user mentions mise, the design system, a mise
  component, tone, variant, or mise-theme.
---

# mise

mise is a library of Svelte 5 components and a Tailwind v4 theme for operations dashboards:
locations, shifts, orders, stock. This skill is for an app that depends on it. Before writing
any UI, find the mise component that does the job; write your own only when none does.

## This app

```json
!`npx --no-install mise-theme info --json`
```

`stack` says how the app is wired (`sveltekit`, `inertia` or `vite`), `stylesheet` where mise's
theme is imported, `themeConfig` whether the app has its own theme, and `form` whether
`mise/form` can be used. If the command failed, mise is not installed here: follow
[setup.md](setup.md).

## Which copy to trust

This skill may be newer or older than the mise the app has installed. When they disagree, read
`node_modules/@jovertical/mise-design-system/skills/mise/` instead: that copy ships with the
installed `version` above, and its `components/` files list exactly the props that version
takes.

## Rules

- **Use a mise component before writing UI.** A badge, a card, a table, an empty state or a
  confirmation dialog almost certainly exists; the index below says which.
- **Compose before customising.** A card of facts is `Card` with `FactList` in it, not a styled
  `div`. A dashboard is `PageLayout`, `PageHeader`, `CardGrid` and `StatTile`s.
- **Props before classes.** Colour is `tone`: `neutral`, `primary`, `info`, `success`,
  `warning` or `critical` (never `destructive`, `error` or `danger`). Treatment is `variant`.
  Size is `size`: `sm`, `md` (the default) or `lg`. States are bare adjectives: `loading`,
  `invalid`, `disabled`.
- **Semantic colours only.** `bg-primary`, `text-muted-foreground`, `border-border`. Never a
  palette class (`bg-blue-500`) or a `dark:` colour override: the theme handles dark mode.
- **`class` is for layout**: margin, width, grid placement. Do not restyle a component's
  colours, radius or type through `class`; change the theme ([theming.md](theming.md)).
- **A neutral fill on the page** is `bg-foreground/[0.07]`, the same wash mise's neutral badges
  use. `bg-muted` is the page canvas, so a `bg-muted` chip disappears on it.
- **The app formats, mise displays.** Money, dates and statuses are formatted by the app.
  `NumberInput` with `format="currency"` takes and reports integer cents.
- **Every component** takes `class` and spreads other attributes onto its root, and every part
  takes `bind:ref`. Overlays and inputs use `bind:open` and `bind:value`.
- **For the app's own components**, mise exports `cn` (class merging), the `Tone` and `Size`
  types, `TONES`, and the tone class maps (`TONE_SOFT_CLASS`, `TONE_SOLID_CLASS`,
  `TONE_TEXT_CLASS`, `TONE_FILL_CLASS` and the rest), so a custom badge-like element matches
  mise's colours.

## Which component

Each line is a job and the component that does it. The group files list every part, prop,
type and default.

**Actions** ([components/actions.md](components/actions.md))

- A button, or a link that looks like one (`href`): `Button`
- A menu of actions on a row or a page: `DropdownMenu`
- A searchable list of commands or a palette (`CommandDialog`): `Command`
- The light and dark switch: `ThemeToggle`, inside a `ThemeProvider`

**Forms** ([components/forms.md](components/forms.md))

- A label, description and error around any input: `Field` (with `Label`)
- Text: `Input`; several lines: `Textarea`
- An input with an icon, a prefix or a button inside it: `InputGroup`
- A number, a price or a count: `NumberInput`, never `Input type="number"`
- An amount and its unit (2.5 kg): `QuantityInput`
- One choice from a few: `RadioGroup`; when each choice needs a description or media:
  `ChoiceRow`
- One choice from many: `Select`; searchable or several values: `Combobox`
- On or off: `Switch`; with a label and description in a row: `SwitchField`; a tick:
  `Checkbox`
- A date: `DatePicker`; a calendar on the page: `Calendar`; a time: `TimePicker`
- A one-time code: `InputOTP`
- An image or file upload: `MediaDropzone`
- Segmented buttons: `ToggleGroup`; one pressed state: `Toggle`; joined buttons and inputs:
  `ButtonGroup`
- A validated form in SvelteKit: `Form`, from `@jovertical/mise-design-system/form`. It needs
  SvelteKit; in an Inertia or plain Vite app use `Field` with the app's own form state
  ([recipes/form.md](recipes/form.md))

**Navigation** ([components/navigation.md](components/navigation.md))

- The app's side menu: `Sidebar`
- Where am I: `Breadcrumb`
- Sections of one page: `Tabs`
- The steps of a flow: `Stepper`

**Layout** ([components/layout.md](components/layout.md))

- The page frame: `PageLayout`, with `PageHeader` for the title, description and actions
- A surface: `Card`
- Cards in a grid: `CardGrid`; rows inside one card: `CardList`
- A collapsible card for a side column: `AsideCard`
- What one step produced, read-only: `SummaryCard`
- Show and hide a section: `Collapsible`
- A rule: `Separator`

**Overlays** ([components/overlays.md](components/overlays.md))

- "Are you sure?": `AlertDialog`
- A task in a modal: `Dialog`; in a side panel: `Sheet`; from the bottom on mobile: `Drawer`
- A small floating panel: `Popover`; a preview on hover: `HoverCard`
- A label on hover: `Tooltip`; a `?` that explains the thing beside it: `Hint`

**Feedback** ([components/feedback.md](components/feedback.md))

- A message in the page: `Alert`; a toast: `Toaster` once in the layout, then `toast(…)`
- Loading: `Spinner` inline, `Skeleton` for the shape of what is coming, `LoadingState` for a
  whole panel
- Nothing here yet: `EmptyState`; to compose your own: `Empty` and its parts
- An error page (not found, forbidden, failed): `ErrorState`
- Progress: `Progress`; a route change: `NavigationProgress`
- A feature the user cannot use yet: `FeaturePreview` for a whole page, `LockedOverlay` over
  one card

**Data display** ([components/data-display.md](components/data-display.md))

- A status or a tag: `Badge`; a change up or down: `DeltaBadge`
- A person's picture or initials: `Avatar`; a named thing with its mark and one line:
  `EntityLabel`; a list row with media, text and actions: `Item`
- An icon in a tinted square: `IconChip`
- Label and value pairs: `FactList`
- The headline number of a dashboard: `StatTile`. One figure per tile, with its delta, unit and
  sparkline
- One subject and several figures with a bar beneath: `MetricRow`
- One measure drawn as a bar, in a ranked list: `MetricBar`; sub-groups to compare side by
  side: `MetricGrid`
- A share of a whole as a ring: `RadialStat`; as one segmented bar: `SegmentedBar`
- A trend in a cell or a tile: `Sparkline`; a full chart: `ChartContainer` (LayerChart)
- Rows of data: `Table`; with sorting, filtering, selection or pagination: `DataTable`
- A history of events: `Timeline`
- Setup steps: `Checklist`, and `ChecklistCard` for the summary card; what a page still needs
  before going live: `ReadinessChecklist`
- A code read off one screen and typed into another: `SegmentedCode`
- A row in a nested list: `TreeLeaf`

**Typography** ([components/typography.md](components/typography.md))

- A heading: `Heading`; body text with size, muting and tone: `Text`

## Read next

- [setup.md](setup.md): install mise and wire it into SvelteKit, Laravel with Inertia, or Vite.
- [theming.md](theming.md): presets, the brand colour, radius, fonts and dark mode.
- [recipes/dashboard-page.md](recipes/dashboard-page.md): a dashboard page.
- [recipes/form.md](recipes/form.md): a form, in Inertia and in SvelteKit.
- [recipes/data-table.md](recipes/data-table.md): a data table with filters and row actions.
