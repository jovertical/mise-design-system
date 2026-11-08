# mise-design-system Story Skeleton Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline execution, as chosen by the user). Steps use checkbox (`- [ ]`) syntax.

**Goal:** Every component story file follows one skeleton (Playground, Matrix, axes, States, With…, Long content, In…, scenarios), drawn with two shared helpers and enforced by a test.

**Architecture:** The test lands first with an allowlist of every story file not yet converted, so each commit stays green. Each task converts a set of groups and removes them from the allowlist. The last task deletes the allowlist.

**Tech Stack:** Svelte 5, Storybook 10 with addon-svelte-csf 5, Vitest.

**Spec:** `docs/specs/2026-11-05-story-skeleton-design.md`

## Global Constraints

- **The commit gate is `pnpm test` and `pnpm build:storybook`,** both checked by exit code.
- **No component changes.** Only `*.stories.svelte`, `stories/`, `tests/stories.test.ts` and docs.
- **Stories need `asChild`** unless they render through `{#snippet template(args)}` (existing rule, `tests/stories.test.ts`).
- **A `Playground` renders through `{#snippet template(args)}`**, spreading `args` onto the meta component, with `args` set on the `<Story>` to the values the old first story used.
- **Snippets shared by several stories are declared at the top level**, never inside a `<Story>`.
- **A story dropped as a repeat is named in the commit message**, so the user can see what went.
- **Visual check before the phase gate:** every converted file's stories, light and dark.
- **Phase gate:** stop after Task 60 and report. Push only after approval.

## Phase N (Tasks 56–60)

### Task 56: The helpers, the test, and the rule in the docs

**Files:**
- Create: `stories/story-matrix.svelte`, `stories/story-axis.svelte`
- Modify: `tests/stories.test.ts`, `docs/naming.md` §7, `.claude/skills/authors-components/SKILL.md` §6

- [ ] **Step 1: The helpers.**

`stories/story-matrix.svelte`:

```svelte
<!--
  Story scaffolding, not a package export: two axes of a component crossed, with
  the column labels across the top and the row labels down the side.
-->
<script lang="ts" generics="Row extends string, Column extends string">
  import type { Snippet } from 'svelte'

  let {
    rows,
    columns,
    cell,
  }: {
    rows: readonly Row[]
    columns: readonly Column[]
    cell: Snippet<[Row, Column]>
  } = $props()
</script>

<div
  class="grid items-center justify-start gap-x-4 gap-y-3"
  style:grid-template-columns="auto repeat({columns.length}, auto)"
>
  <span></span>
  {#each columns as column (column)}
    <span class="text-muted-foreground text-xs">{column}</span>
  {/each}
  {#each rows as row (row)}
    <span class="text-muted-foreground text-xs">{row}</span>
    {#each columns as column (column)}
      <div>{@render cell(row, column)}</div>
    {/each}
  {/each}
</div>
```

`stories/story-axis.svelte`:

```svelte
<!--
  Story scaffolding, not a package export: one prop's values side by side, each
  labelled. Vertical puts the label to the left, for items too wide to sit in a
  row.
-->
<script lang="ts" generics="Value extends string">
  import type { Snippet } from 'svelte'

  let {
    values,
    item,
    orientation = 'horizontal',
  }: {
    values: readonly Value[]
    item: Snippet<[Value]>
    orientation?: 'horizontal' | 'vertical'
  } = $props()
</script>

{#if orientation === 'vertical'}
  <div class="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3">
    {#each values as value (value)}
      <span class="text-muted-foreground text-xs">{value}</span>
      <div>{@render item(value)}</div>
    {/each}
  </div>
{:else}
  <div class="flex flex-wrap items-end gap-6">
    {#each values as value (value)}
      <div class="flex flex-col items-center gap-2">
        {@render item(value)}
        <span class="text-muted-foreground text-xs">{value}</span>
      </div>
    {/each}
  </div>
{/if}
```

- [ ] **Step 2: The test.** Add to `tests/stories.test.ts`:

```ts
const AXES = ['Variants', 'Sizes', 'Tones', 'Shapes', 'Sides', 'Types', 'Weights', 'Orientations']
const BANNED = ['Default', 'Basic', 'Plain', 'Small']

/** Files not yet on the skeleton. Each task removes its groups; Task 60 deletes this. */
const PENDING: string[] = [/* every story path, filled from storyFiles at Step 3 */]

/** The skeleton's rank for a story name (spec, "The skeleton"). */
function rank(name: string): number {
  if (name === 'Playground') return 1
  if (name === 'Matrix') return 2
  if (AXES.includes(name)) return 3
  if (name === 'States') return 4
  if (name.startsWith('With ')) return 5
  if (name === 'Long content') return 6
  if (/^(In|On) /.test(name)) return 7
  return 8
}

const stories = (source: string) =>
  [...source.matchAll(/(-->\s*)?<Story name="([^"]+)"/g)].map(([, comment, name]) => ({
    name,
    commented: comment !== undefined,
  }))

describe('the story skeleton', () => {
  const files = storyFiles.filter((file) => !PENDING.includes(file))
  const read = (file: string) => readFileSync(join(components, file), 'utf8')

  it('opens every file with a Playground', () => {
    const wrong = files.filter((file) => stories(read(file))[0]?.name !== 'Playground')
    expect(wrong).toEqual([])
  })

  it('uses no banned name', () => {
    const wrong = files.flatMap((file) =>
      stories(read(file))
        .filter(({ name }) => BANNED.includes(name))
        .map(({ name }) => `${file}: ${name}`),
    )
    expect(wrong).toEqual([])
  })

  it('keeps the skeleton order, scenarios last', () => {
    const wrong = files.filter((file) => {
      const ranks = stories(read(file)).map(({ name }) => rank(name))
      return ranks.some((value, index) => index > 0 && value < ranks[index - 1])
    })
    expect(wrong).toEqual([])
  })

  it('draws a Matrix with StoryMatrix', () => {
    const wrong = files.filter((file) => {
      const source = read(file)
      return source.includes('<Story name="Matrix"') && !source.includes('story-matrix.svelte')
    })
    expect(wrong).toEqual([])
  })

  it('explains every story after the Playground in a comment', () => {
    const wrong = files.flatMap((file) =>
      stories(read(file))
        .slice(1)
        .filter(({ commented }) => !commented)
        .map(({ name }) => `${file}: ${name}`),
    )
    expect(wrong).toEqual([])
  })

  it('lists no converted file as pending', () => {
    expect(PENDING.filter((file) => !storyFiles.includes(file))).toEqual([])
  })
})
```

- [ ] **Step 3: Fill `PENDING`** with every entry of `storyFiles` (print them once with a throwaway `console.log`, paste, delete the log), sorted. Run `pnpm vitest run tests/stories.test.ts`: every test passes, vacuously.

- [ ] **Step 4: The docs.** `docs/naming.md` §7 gains a "What a story file holds" subsection: the skeleton table, the rules and the helpers, pointing at the spec. The authors-components skill §6 replaces "Port every React story by name" with "Port every React story onto the skeleton: rename it to its rank's name, merge it into an axis or `States`, or keep it as a scenario."

- [ ] **Step 5: Gate and commit:** `test(stories): the story skeleton, its helpers, and a test that holds files to it`.

### Tasks 57–60: Convert the stories

One task per set of groups:

- **Task 57:** Typography, Actions, Data display (`heading`, `text`, `button`, `dropdown-menu`, `avatar`, `badge`, `icon-chip`)
- **Task 58:** Forms (`checkbox`, `field`, `input`, `input-group`, `label`, `radio-group`, `select`, `switch`, `textarea`, `toggle`, `toggle-group`)
- **Task 59:** Navigation, Layout, Overlays (`breadcrumb`, `sidebar`, `tabs`, `card`, `page-header`, `page-layout`, `separator`, `alert-dialog`, `dialog`, `popover`, `sheet`, `tooltip`)
- **Task 60:** Feedback (`alert`, `empty`, `empty-state`, `loading-state`, `skeleton`, `sonner`, `spinner`), then delete `PENDING` and its last test

For each file:

- [ ] **Step 1: Read it**, and the React story file it was ported from, to see what each story is for.
- [ ] **Step 2: Map each story to a rank.** The renames known now:

| File | From | To |
| --- | --- | --- |
| button | — | order: Playground, Matrix, Sizes, then the scenarios |
| dropdown-menu | Basic | Playground |
| avatar | Default | Playground |
| badge | Count, States, Tags, Solid, From a domain status | States moves before the scenarios |
| icon-chip | Sizes and shapes | Matrix |
| icon-chip | Beside text | In a detail list |
| text | Truncated | Long content |
| text | The common three | moves after Long content, as a scenario |
| alert | Variants (first) | Playground, then Variants |
| alert | With and without icon | With icon |
| empty-state | Fallback | Playground |
| empty-state | Described | With description |
| empty | Parts | Playground |
| loading-state | Default | Playground |
| skeleton | Text line, Card | Playground, In a card |
| sonner | Default | Playground |
| sonner | Types dark | dropped (the toolbar switches scheme) |
| spinner | Default | Playground |
| checkbox, switch | Default | Playground |
| input | Default, Invalid, Disabled | Playground, States |
| input-group, select, radio-group, sheet, tooltip, dialog, alert-dialog, breadcrumb, sidebar, card | Default | Playground |
| select, alert-dialog | Small | Sizes |
| label | With input | Playground |
| textarea | Plain, Below minimum | Playground, States |
| toggle | Default | Playground |
| toggle-group | Segmented, Segmented sizes | Playground, Sizes |
| tabs, popover | Basic | Playground |
| tabs | On the page surface, Inside a card, In a card header | On a page, In a card, In a card header |
| page-layout | Basic | Playground |
| page-header | Listing | Playground (its args), and Listing stays as a scenario only if it adds to it |
| separator | Horizontal, Vertical | Playground, Orientations |
| field | Default, Horizontal, Responsive | Playground, Orientations |

  A story not in the table keeps its name if its rank fits the order, and moves otherwise. A story that only repeats the Playground or the Matrix is dropped and named in the commit.

- [ ] **Step 3: Rewrite the file.** The Playground on `args` through `{#snippet template(args)}`. Matrices on `StoryMatrix`, axes on `StoryAxis`. A comment above every story after the Playground; keep the existing ones.
- [ ] **Step 4: Remove the converted files from `PENDING`.** Run `pnpm vitest run tests/stories.test.ts`; the skeleton tests now hold them.
- [ ] **Step 5: Gate, screenshot the converted stories in both schemes, and commit** per task: `docs(stories): put <groups> on the story skeleton`, listing any dropped story.

Task 60 also deletes `PENDING` and the "lists no converted file as pending" test, so the skeleton holds every file.

### Phase N gate

- Clean-tree gate: `rm -rf dist storybook-static .svelte-kit && pnpm test && pnpm build && pnpm build:storybook`.
- A contact sheet of every Playground, light and dark, and of every Matrix and axis story.
- Report in the phase-gates format and wait for approval to push.
