# Naming

What a component is called is the only part of it a consumer has to learn before
using it. These rules exist so that a name can be guessed rather than looked up,
and so the next component gets named by a rule rather than by whichever
neighbour it was pasted from.

Adapted from `docs/naming.md` in the React package 2.23.0.

## 0. The React package is a reference, not a contract

mise starts from the React package's names, so most can be looked up in either
library. Where React's names grew by accident (two components for one job, a
pair that cannot be told apart by name), mise merges or renames, and the
surviving component's `Diverged:` line records what it absorbed. The rules
below explain the names, and they decide the names of anything mise adds or
merges. See `docs/specs/2026-11-05-structure-design.md`.

## 1. shadcn names are frozen

A file whose `Origin:` line ends in `shadcn/ui new-york <name>` keeps the
upstream name, the upstream part names and the upstream file name, even where
they read badly. When toasts arrive, `Toaster` stays `Toaster`.

The reason is the `Diverged:` audit. A vendored file's local changes are found
by diffing it against upstream, and a rename makes that diff useless: every line
moves, and a real divergence hides in the noise. A name is cheap; losing the
ability to tell what was changed is not.

Renames therefore only ever touch files whose origin is not shadcn:
`rg -L 'shadcn/ui' src/lib/components` lists them.

## 2. Name the job

Not the position on screen, not the material it is made of, and not the thing it
stands in for.

| Was | Is | Named |
| --- | --- | --- |
| `TopLoader` | `NavigationProgress` | where it sat |
| `LoadingText` | `LoadingStatus`, now a captioned `Spinner` | what it was made of |
| `EmptyDataPlaceholder` | `EmptyState` | what it substituted for |

`NavigationProgress` also survives the component moving; `TopLoader` would have
had to be renamed the day it moved to the bottom of the viewport.

## 3. Family-first for parts, modifier-first for presets

A component that composes into a family takes the family name first:
`CardTitle`, `InputGroupAddon`, `DialogContent`. A component that is a
standalone preset of something takes the modifier first: `SwitchField`,
`DecimalInput`, `AsideCard`.

The test is whether the thing is *used inside* its family or *instead of* it.
`SummaryCard` is used instead of a hand-built `Card`, so it is modifier-first.
`CardTitle` is used inside a `Card`, so it is family-first.

Names that can be parsed both ways fail this rule. `SectionCardTitle` reads as
`SectionCard` + `Title` and as `Section` + `CardTitle`. React made it
`SectionTitle`; mise folds it into `CardTitle`'s `icon` prop, which needs no
name at all.

## 4. One family per folder, named for the family

A family lives in one folder, named for it in kebab-case, with one `.svelte`
file per part: `layout/card/card.svelte`, `layout/card/card-title.svelte`. The
folder sits inside its purpose group (§7). Its `index.ts` exports the family
under flat names, and the root entry re-exports every folder, so an import
never names a group (D5).

A folder exporting two unrelated components is two folders.

## 5. Every component carries its documentation

Each part exports its `<Part>Props` type, opens with an
`Origin:` / `Svelte:` / `Diverged:` header, carries a prose comment saying what
it decided, and its family has a story.

The `Props` export is not ceremony. A consumer wrapping a component has to
restate its shape otherwise, and the restatement drifts.

The prose comment is where the decision lives. Highlighting a selected row
through `has-[[data-state=checked]]` rather than a prop reads as an accident in
the source and as a design in a sentence.

## 6. One prop name per idea

A prop is named for the idea, and the idea has one name across the package,
including the variant *values* on shadcn-derived components. Rule 1 freezes
their names but not their props.

| Idea | Name |
| --- | --- |
| The component's heading | `title` |
| The name of a value it shows | `label` |
| The line under the title | `description` |
| One control in the header's top-right | `action` |
| A row of buttons below the content | `actions` |
| A glyph the component draws in its own chip | `icon` |
| An arbitrary node before the text: an image, an avatar | `media` |
| Layout slots at the ends of a toolbar row | `leading` / `trailing` |
| Status colour | `tone`, typed `Tone` from `utils/tone.ts` |
| Structural treatment: fill, outline, ghost | `variant`, never a colour |
| Size | `size: 'sm' \| 'md' \| 'lg'`, `md` by default |
| A state | a bare adjective: `loading`, `invalid`, `complete`, `disabled` |

`Tone` is `neutral | primary | info | success | warning | critical`. The red
is `critical`; the CSS token keeps its shadcn name, `--destructive`. The brand is
`primary`, never `accent`: `--accent` means "active nav row".

Every component takes `class` and spreads the rest of its props onto its root
element.

## 7. Where a story lives

A component goes in the group for the question it answers on a screen. Where
it came from is not a group: that is on its `Origin:` line, and Storybook shows
it as a `shadcn` badge.

The group is the folder, `src/lib/components/<group>/<component>/`, and the
story title is the folder: `forms/select/` is `Forms/Select`.
`tests/stories.test.ts` fails on a title that does not match, or on a group
folder not in `tests/groups.ts`. In sidebar order:

| Group | Folder | What goes there |
| --- | --- | --- |
| `Foundations/` | `stories/foundations/` | Tokens: palette, geometry, theming. No component |
| `Typography/` | `typography/` | Text styles: Heading, Text |
| `Actions/` | `actions/` | Things to press: Button, DropdownMenu (a menu of things to do) |
| `Forms/` | `forms/` | Anything that takes or picks a value, Toggle and ToggleGroup included |
| `Navigation/` | `navigation/` | Moving between screens or sections: Sidebar, Breadcrumb, Tabs |
| `Layout/` | `layout/` | Arranging a page: PageLayout, PageHeader, Card, Separator |
| `Overlays/` | `overlays/` | Content above the page: Dialog, Sheet, Popover, Tooltip |
| `Feedback/` | `feedback/` | Telling the operator what is happening: Alert, Toaster, Spinner, Skeleton, the Empty and Loading panels |
| `Data display/` | `data-display/` | Showing a value or a thing: Badge, Avatar, IconChip |
| `Patterns/` | `stories/patterns/` | A composition of several components with no component of its own |

A group may use components from another group. Layout may use Data display
(CardTitle draws an IconChip); keep it one way, so no two groups import each
other.

A family nests under its root: `Data display/DataTable/Toolbar`.

### What a story file holds

Every story file follows one skeleton, in this order. Only `Playground` is
required, and ranks never go down through a file
(`docs/specs/2026-11-05-story-skeleton-design.md`; `tests/stories.test.ts`
enforces it).

| Rank | Story | Shows |
| --- | --- | --- |
| 1 | `Playground` | The component on `args`, wired to controls |
| 2 | `Matrix` | Two visual axes crossed, drawn with `stories/story-matrix.svelte` |
| 3 | `Variants`, `Sizes`, `Tones`, `Shapes`, `Sides`, `Types`, `Weights`, `Orientations`, `Themes`, `Thicknesses`, `Surfaces`, `Densities`, `Formats` | One prop's values, drawn with `stories/story-axis.svelte` |
| 4 | `States` | Disabled, invalid, checked, loading: each labelled |
| 5 | `With <part>` | An optional part or slot |
| 6 | `Long content` | Overflow and truncation |
| 7 | `In <context>` / `On <context>` | Where a screen puts it |
| 8 | A scenario, named freely | An arrangement a screen really uses |

`Default`, `Basic`, `Plain` and `Small` are banned: each is the Playground or an
axis. A new axis name is added to `AXES` in the test. Every story after the
Playground opens with a comment saying what it shows and why. A story that
repeats the Playground or the Matrix goes, and so does a scheme variant: the
toolbar switches scheme.

A story shows the component's API: its props, its states, and the two or three
arrangements a screen actually wants. It is not a recipe book. A story whose
comment says "copy it; do not import it" is describing a component that has not
been written yet.

## Domain prefixes that are allowed

`Page` means "belongs to a routed page": `PageHeader`, `PageLayout`. It is not a
hedge and it is not decoration. A `PageHeader` is meaningfully different from a
`CardHeader`, and the prefix is what says so.
