# mise-design-system Structure Implementation Plan: grouping by purpose

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline execution, as chosen by the user). Steps use checkbox (`- [ ]`) syntax.

**Goal:** Move every component into a purpose group (`src/lib/components/<group>/<component>/`), title its stories by that group, show a `shadcn` badge in the Storybook sidebar, fold `LoadingStatus` into `Spinner` and `SectionTitle` into `CardTitle`, and bring the docs in line.

**Architecture:** The folder is the group. The structural suites walk two folder levels and check that every story's title matches its folder. The public barrel stays flat, so no consumer import changes. The two merges add optional props to the surviving component; nothing else changes shape.

**Tech Stack:** Svelte 5, SvelteKit packaging, Storybook 10 with addon-svelte-csf, Vitest with Testing Library, `storybook-addon-tag-badges` 3.1.0.

**Spec:** `docs/specs/2026-11-05-structure-design.md`

## Global Constraints

- **The commit gate is `pnpm test` and `pnpm build:storybook`,** both checked by exit code (git-workflow skill).
- **Group folders and titles** (S3), in sidebar order: `typography` → `Typography`, `actions` → `Actions`, `forms` → `Forms`, `navigation` → `Navigation`, `layout` → `Layout`, `overlays` → `Overlays`, `feedback` → `Feedback`, `data-display` → `Data display`. `Foundations` and `Patterns` live under `stories/`.
- **The barrel stays flat** (S4): `export * from './components/<group>/<component>/index.js'`, and no exported name changes except the two removals in Tasks 53 and 54.
- **Tags already exist.** Every story meta carries `tags: ['shadcn']` or `tags: ['mise']`, checked against the `Origin:` header by `tests/provenance.test.ts`. Do not add a second tagging scheme.
- **Visual check before the phase gate:** screenshot the touched stories in light and dark with the cached Chromium (`docs/handoff.md`, "Visual checks").
- **Phase gate:** stop after Task 55 and report in the phase-gates format. Push only after approval.

## Placement

| Group | Folders |
| --- | --- |
| `typography` | `heading`, `text` |
| `actions` | `button`, `dropdown-menu` |
| `forms` | `field`, `label`, `input`, `input-group`, `textarea`, `checkbox`, `switch`, `radio-group`, `select`, `toggle`, `toggle-group` |
| `navigation` | `sidebar`, `breadcrumb`, `tabs` |
| `layout` | `page-layout`, `page-header`, `card`, `separator`, `section-title` (until Task 54) |
| `overlays` | `dialog`, `alert-dialog`, `sheet`, `popover`, `tooltip` |
| `feedback` | `alert`, `sonner`, `spinner`, `skeleton`, `empty`, `empty-state`, `loading-state`, `loading-status` (until Task 53) |
| `data-display` | `badge`, `avatar`, `icon-chip` |

## Phase M (Tasks 51–55)

### Task 51: Move every component into its group

One commit: a half-moved tree does not build.

**Files:**
- Move: every folder in `src/lib/components/` to `src/lib/components/<group>/`
- Move: `stories/{palette,geometry,theming}.stories.svelte` to `stories/foundations/`
- Modify: `src/lib/index.ts`, `.storybook/preview.ts`
- Modify: `tests/stories.test.ts`, `tests/provenance.test.ts`, `tests/barrel.test.ts`

**Interfaces:**
- Produces: `tests/groups.ts` exporting `GROUPS` (folder → title), `componentFolders()` (`{ group, name, path }[]`) and `TITLE_ALIASES` (`{ sonner: 'Toaster' }`), used by the three structural suites.

- [ ] **Step 1: Write the shared folder walk**

`tests/groups.ts`:

```ts
import { existsSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * The purpose groups, in sidebar order: folder name to story title. A folder
 * under src/lib/components/ that is not listed here fails the stories suite.
 */
export const GROUPS = {
  typography: 'Typography',
  actions: 'Actions',
  forms: 'Forms',
  navigation: 'Navigation',
  layout: 'Layout',
  overlays: 'Overlays',
  feedback: 'Feedback',
  'data-display': 'Data display',
} as const

/** Folders whose story title is not the folder name in PascalCase. */
export const TITLE_ALIASES: Record<string, string> = { sonner: 'Toaster' }

export const componentsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'lib', 'components')

const subfolders = (path: string) =>
  existsSync(path)
    ? readdirSync(path, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)
        .sort()
    : []

export const groupFolders = () => subfolders(componentsDir)

/** Every component folder, as `group/name`. */
export const componentFolders = () =>
  groupFolders().flatMap((group) =>
    subfolders(join(componentsDir, group)).map((name) => ({ group, name, path: `${group}/${name}` })),
  )

export const pascal = (folder: string) =>
  TITLE_ALIASES[folder] ?? folder.replace(/(^|-)([a-z])/g, (_, __, letter: string) => letter.toUpperCase())
```

- [ ] **Step 2: Write the failing title test**

In `tests/stories.test.ts`, replace the `components` / `storyFiles` block with:

```ts
import { componentFolders, componentsDir as components, GROUPS, groupFolders, pascal } from './groups.js'

const storyFiles = componentFolders().flatMap(({ path }) =>
  readdirSync(join(components, path))
    .filter((name) => name.endsWith('.stories.svelte'))
    .map((name) => join(path, name)),
)
```

and add, inside the `describe`:

```ts
  it('keeps every component folder inside a known group', () => {
    expect(groupFolders().filter((group) => !(group in GROUPS))).toEqual([])
  })

  it('titles each story by its folder: the group, then the component', () => {
    const wrong = componentFolders().flatMap(({ group, name, path }) => {
      const story = join(path, `${name}.stories.svelte`)
      const title = readFileSync(join(components, story), 'utf8').match(/title:\s*'([^']+)'/)?.[1]
      const expected = `${GROUPS[group as keyof typeof GROUPS]}/${pascal(name)}`
      return title === expected ? [] : [`${story}: '${title}', expected '${expected}'`]
    })
    expect(wrong).toEqual([])
  })
```

- [ ] **Step 3: Run it to see it fail**

Run: `pnpm vitest run tests/stories.test.ts`
Expected: FAIL. `groupFolders()` returns the 39 component folders, none of them a group.

- [ ] **Step 4: Move the folders and rewrite the paths**

Run this once from the repo root. It is a one-off; keep it in `/tmp`, not the repo.

```python
# /tmp/mise-move.py
import pathlib, re, subprocess

PLACEMENT = {
    'typography': ['heading', 'text'],
    'actions': ['button', 'dropdown-menu'],
    'forms': ['field', 'label', 'input', 'input-group', 'textarea', 'checkbox', 'switch',
              'radio-group', 'select', 'toggle', 'toggle-group'],
    'navigation': ['sidebar', 'breadcrumb', 'tabs'],
    'layout': ['page-layout', 'page-header', 'card', 'separator', 'section-title'],
    'overlays': ['dialog', 'alert-dialog', 'sheet', 'popover', 'tooltip'],
    'feedback': ['alert', 'sonner', 'spinner', 'skeleton', 'empty', 'empty-state',
                 'loading-state', 'loading-status'],
    'data-display': ['badge', 'avatar', 'icon-chip'],
}
TITLES = {'typography': 'Typography', 'actions': 'Actions', 'forms': 'Forms',
          'navigation': 'Navigation', 'layout': 'Layout', 'overlays': 'Overlays',
          'feedback': 'Feedback', 'data-display': 'Data display'}
GROUP = {c: g for g, cs in PLACEMENT.items() for c in cs}

root = pathlib.Path('src/lib/components')
present = sorted(p.name for p in root.iterdir() if p.is_dir())
assert sorted(GROUP) == present, set(GROUP) ^ set(present)

for comp, group in GROUP.items():
    (root / group).mkdir(exist_ok=True)
    subprocess.run(['git', 'mv', str(root / comp), str(root / group / comp)], check=True)

def sibling(match):
    comp = match.group(1)
    if comp not in GROUP:
        return match.group(0)
    return match.group(0) if GROUP[comp] == current else f"'../../{GROUP[comp]}/{comp}/"

for comp, group in GROUP.items():
    current = group
    for f in (root / group / comp).iterdir():
        src = f.read_text()
        # One level deeper: every path that leaves the components tree gains a `../`.
        src = src.replace("'../../", "'../../../")
        # A sibling component in another group is reached through that group.
        src = re.sub(r"'\.\./([a-z-]+)/", sibling, src)
        src = re.sub(r"title: '(?:Primitives|Components)/", f"title: '{TITLES[group]}/", src)
        f.write_text(src)

index = pathlib.Path('src/lib/index.ts')
text = index.read_text()
for comp, group in GROUP.items():
    text = text.replace(f"'./components/{comp}/index.js'", f"'./components/{group}/{comp}/index.js'")
index.write_text(text)
```

Run: `python3 /tmp/mise-move.py && git status --short | head`
Expected: renames under `src/lib/components/<group>/`, and `src/lib/index.ts` modified.

Then move the foundation stories and fix their one import each:

```sh
mkdir -p stories/foundations
git mv stories/palette.stories.svelte stories/geometry.stories.svelte stories/theming.stories.svelte stories/foundations/
sed -i '' "s#'\.\./src/lib/#'../../src/lib/#" stories/foundations/*.stories.svelte
```

`stories/on-a-card.svelte` stays where it is; it is a helper, not a story.

- [ ] **Step 5: Sort the barrel and order the sidebar**

In `src/lib/index.ts`, regroup the component lines under one comment per group, in the order of `GROUPS`, so the file reads like the sidebar. Update its header comment: names are flat (S4), folders are grouped (S3).

In `.storybook/preview.ts`, add to `parameters`:

```ts
    options: {
      storySort: {
        order: [
          'Foundations',
          'Typography',
          'Actions',
          'Forms',
          'Navigation',
          'Layout',
          'Overlays',
          'Feedback',
          'Data display',
          'Patterns',
        ],
      },
    },
```

- [ ] **Step 6: Point the provenance and barrel suites at the two-level walk**

`tests/provenance.test.ts`: replace its `components` / `folders` block with

```ts
import { componentFolders, componentsDir as components } from './groups.js'

const folders = componentFolders()
```

then `modules` reads `folders.flatMap(({ path }) => readdirSync(join(components, path)).filter(isModule).map((name) => `${path}/${name}`))`, and the tag test reads the story at `${path}/${name}.stories.svelte` and the module at `${path}/${name}.svelte`. Tighten the tag check from "includes the expected tag" to "is exactly the expected tag", as the spec requires:

```ts
      const tags = [...(read(story).match(/tags:\s*\[([^\]]*)\]/)?.[1] ?? '').matchAll(/'([^']+)'/g)].map(
        (match) => match[1],
      )
      const expected = provenanceOf(`${path}/${name}.svelte`)
      return tags.length === 1 && tags[0] === expected ? [] : [`${story} should be tagged only '${expected}'`]
```

`tests/barrel.test.ts`: `folders` becomes `componentFolders().map(({ path }) => path)`, and the re-export regex becomes

```ts
      ...barrel.matchAll(/export \* from '\.\/components\/([a-z-]+\/[a-z-]+)\/index\.js'/g),
```

- [ ] **Step 7: Run the gate**

Run: `pnpm test && pnpm build:storybook; echo "exit=$?"`
Expected: `exit=0`, 203 tests (201 plus the two new title tests). If svelte-check reports an unresolved import, the move script missed a path form; fix it by hand and re-run.

- [ ] **Step 8: Commit**

```sh
git add -A src/lib stories tests .storybook
git commit -m "refactor: group components by purpose, one folder per group

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

(Run the commit only when Step 7 exited 0.)

### Task 52: Show the `shadcn` badge in the sidebar

**Precondition:** the user has run `pnpm add -D storybook-addon-tag-badges` (3.1.0). Stop and ask if `package.json` does not list it.

**Files:**
- Modify: `.storybook/main.ts`
- Create: `.storybook/manager.ts`

- [ ] **Step 1: Read the addon's README** in `node_modules/storybook-addon-tag-badges/README.md` for the 3.x config shape. The code below follows it; correct names if the README differs.

- [ ] **Step 2: Register the addon** in `.storybook/main.ts`:

```ts
  addons: [
    '@storybook/addon-svelte-csf',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    'storybook-addon-tag-badges',
  ],
```

- [ ] **Step 3: Configure one badge**, `.storybook/manager.ts`:

```ts
import { addons } from 'storybook/manager-api'
import type { TagBadgeParameters } from 'storybook-addon-tag-badges/manager-helpers'

/**
 * One badge: `shadcn`, on components whose React origin is shadcn/ui. The tag
 * itself is checked against each component's `Origin:` header by
 * tests/provenance.test.ts; this only makes it visible. `mise` is left
 * unbadged, since it is the default.
 */
const tagBadges: TagBadgeParameters = [
  {
    tags: 'shadcn',
    badge: { text: 'shadcn', tooltip: 'Ported from shadcn/ui' },
    display: { sidebar: ['component'], toolbar: true },
  },
]

addons.setConfig({ tagBadges })
```

- [ ] **Step 4: Gate, then look.** Run `pnpm test && pnpm build:storybook; echo "exit=$?"` (expect `exit=0`). Start a fresh dev server, open `http://localhost:<port>/` with the cached Chromium at 1400×900 and screenshot the sidebar. Expected: groups in the `storySort` order, a `shadcn` badge on Button, Select, Sidebar and the rest, none on Breadcrumb, Heading, IconChip.

- [ ] **Step 5: Commit**

```sh
git add .storybook package.json pnpm-lock.yaml
git commit -m "feat(storybook): badge shadcn-derived components in the sidebar

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

### Task 53: Fold `LoadingStatus` into `Spinner`

**Files:**
- Modify: `src/lib/components/feedback/spinner/spinner.svelte`, `spinner.stories.svelte`
- Modify: `src/lib/components/feedback/loading-state/loading-state.stories.svelte`
- Modify: `tests/skeleton-spinner.test.ts`, `tests/empty-loading.test.ts`, `tests/fixtures/empty-panels.svelte`, `tests/barrel.test.ts`, `src/lib/index.ts`
- Delete: `src/lib/components/feedback/loading-status/`

**Interfaces:**
- Produces: `Spinner` with optional `children: Snippet`. `SpinnerProps` gains `children?: Snippet`.

- [ ] **Step 1: Write the failing tests.** Add to the `Spinner` describe in `tests/skeleton-spinner.test.ts`:

```ts
  it('takes a caption, which becomes the status name', () => {
    render(CaptionedSpinner)
    const status = screen.getByRole('status', { name: 'Checking stock at every location' })
    expect(status.tagName).toBe('SPAN')
    expect(status).toHaveClass('text-muted-foreground', 'text-sm')
    expect(status.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    expect(status.querySelector('svg')).not.toHaveAttribute('role')
  })
```

with `tests/fixtures/captioned-spinner.svelte`:

```svelte
<script lang="ts">
  import { Spinner } from '../../src/lib/index.js'
</script>

<Spinner>Checking stock at every location</Spinner>
```

and `import CaptionedSpinner from './fixtures/captioned-spinner.svelte'` at the top.

- [ ] **Step 2: Run it to see it fail.** `pnpm vitest run tests/skeleton-spinner.test.ts`. Expected: FAIL, no status named "Checking stock…".

- [ ] **Step 3: Implement.** `spinner.svelte` becomes:

```svelte
<!--
  Origin: the React package 2.23.0 `spinner.tsx`, itself shadcn/ui new-york `spinner`
  Svelte: shadcn-svelte `spinner`
  Diverged: takes an optional caption as children, absorbing React's `LoadingStatus`
    (`loading-status.tsx`). Captioned, it renders a `<span>` rather than LoadingStatus's
    `<p>`, so it can sit inside a button or a line of text. Otherwise unaudited, as in
    the React package.
-->
<script lang="ts" module>
  import LoaderCircleIcon from '@lucide/svelte/icons/loader-circle'
  import type { ComponentProps, Snippet } from 'svelte'

  /**
   * `role="status"` and an `aria-label`, unlike a hand-spun icon: reach for this
   * rather than a spinning loader glyph, which is silent to a screen reader.
   *
   * Give it a caption to say what is being waited on: "Loading…" alone says
   * nothing the spinner does not. The caption is then the status's name.
   */
  export type SpinnerProps = ComponentProps<typeof LoaderCircleIcon> & { children?: Snippet }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { class: className, children, ...rest }: SpinnerProps = $props()
</script>

{#if children}
  <span role="status" data-slot="spinner" class="text-muted-foreground inline-flex items-center gap-2 text-sm">
    <LoaderCircleIcon aria-hidden="true" class={cn('size-4 animate-spin', className)} {...rest} />
    <span>{@render children()}</span>
  </span>
{:else}
  <LoaderCircleIcon
    role="status"
    aria-label="Loading"
    data-slot="spinner"
    class={cn('size-4 animate-spin', className)}
    {...rest}
  />
{/if}
```

- [ ] **Step 4: Remove `LoadingStatus`.**
  - `git rm -r src/lib/components/feedback/loading-status`
  - Drop its line from `src/lib/index.ts` and `'LoadingStatus'` from `EXPECTED_EXPORTS`.
  - In `tests/empty-loading.test.ts`, delete the `describe('LoadingStatus', …)` block. In `tests/fixtures/empty-panels.svelte`, drop `'status'` from `kind`, the `LoadingStatus` import and the `{:else}` branch (the `{:else if kind === 'loading'}` becomes `{:else}`).
  - In `loading-state.stories.svelte`, replace the import with nothing (Spinner is already imported), the third card's title with `Inline caption: Spinner`, its body with `<Spinner>Checking stock at every location</Spinner>`, and `LoadingStatus for an inline caption` in the comment with `a captioned Spinner for an inline line`.

- [ ] **Step 5: Move the stories.** Append to `spinner.stories.svelte`:

```svelte
<!--
  A caption names what is being waited on, and becomes the status's accessible
  name. "Loading…" alone tells the operator nothing the spinner does not.
-->
<Story name="With caption" asChild>
  <div class="flex flex-col gap-3">
    <Spinner>Loading locations…</Spinner>
    <Spinner>Setting up the first location…</Spinner>
  </div>
</Story>
```

- [ ] **Step 6: Gate and commit.** `pnpm test && pnpm build:storybook; echo "exit=$?"`, expecting `exit=0`. Then:

```sh
git add -A src/lib tests
git commit -m "feat(spinner)!: take a caption, absorbing LoadingStatus

LoadingStatus is removed. <Spinner>Loading locations…</Spinner> replaces it.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

### Task 54: Fold `SectionTitle` into `CardTitle`

**Files:**
- Modify: `src/lib/components/layout/card/card-title.svelte`, `card.stories.svelte`
- Modify: `tests/card.test.ts`, `tests/fixtures/supplier-title.svelte`, `tests/barrel.test.ts`, `src/lib/index.ts`
- Delete: `src/lib/components/layout/section-title/`, `tests/section-title.test.ts`

**Interfaces:**
- Produces: `CardTitle` with optional `icon: Snippet` and `iconTone: Tone`.

- [ ] **Step 1: Point the fixture at `CardTitle` and move the tests.** `tests/fixtures/supplier-title.svelte` renders `<CardTitle {icon} {iconTone}>Supplier information</CardTitle>`, importing `CardTitle` instead of `SectionTitle`. Move both `it` blocks from `tests/section-title.test.ts` into `tests/card.test.ts` under `describe('CardTitle with an icon', …)`, unchanged, with `import SupplierTitle from './fixtures/supplier-title.svelte'`. Delete `tests/section-title.test.ts`.

- [ ] **Step 2: Run it to see it fail.** `pnpm vitest run tests/card.test.ts`. Expected: FAIL. CardTitle ignores `icon`, so there is no `svg`.

- [ ] **Step 3: Implement.** `card-title.svelte`:

```svelte
<!--
  Origin: the React package 2.23.0 `card.tsx` (`CardTitle`), itself shadcn/ui new-york `card`
  Svelte: shadcn-svelte `card`
  Diverged: takes `icon` and `iconTone`, absorbing React's `SectionTitle`
    (`section-title.tsx`).
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  import type { Tone } from '../../../utils/tone.js'
  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * A flex row, so a hint or a status badge sits on the title's baseline
   * without the caller arranging it. `min-w-0` lets a long title truncate
   * against its neighbour instead of pushing it out of the header.
   */
  export type CardTitleProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    /** A leading glyph that marks where a section starts. Bare and muted at `size-4` unless `iconTone` is given. */
    icon?: Snippet
    /**
     * Draws `icon` in an `IconChip` of this tone. `primary` when the headings are
     * the page's structure, as on a long form. Never a status tone: a heading is
     * not a status.
     */
    iconTone?: Tone
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import IconChip from '../../data-display/icon-chip/icon-chip.svelte'

  let {
    ref = $bindable(null),
    class: className,
    icon,
    iconTone,
    children,
    ...rest
  }: CardTitleProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="card-title"
  class={cn('font-heading flex min-w-0 items-center gap-2 text-base font-medium', className)}
  {...rest}
>
  {#if icon && iconTone}
    <IconChip tone={iconTone}>{@render icon()}</IconChip>
  {:else if icon}
    <span class="text-muted-foreground [&_svg]:size-4">{@render icon()}</span>
  {/if}
  {@render children?.()}
</div>
```

Check `section-title.svelte` before deleting it: if it wraps the children in an element or adds classes beyond `flex items-center gap-2`, carry that over here too.

- [ ] **Step 4: Remove `SectionTitle`.** `git rm -r src/lib/components/layout/section-title`; drop its barrel line, and `'SectionTitle'` from `EXPECTED_EXPORTS`.

- [ ] **Step 5: Move the stories.** Add to `card.stories.svelte` the two stories from the deleted `section-title.stories.svelte`, renamed `Title with icon` and `Title with tinted icon`, with `<SectionTitle …>` becoming `<CardTitle …>` and the `warehouse` snippet declared at the top level of the file, beside any existing ones. Keep both comments.

- [ ] **Step 6: Gate and commit.** `pnpm test && pnpm build:storybook; echo "exit=$?"`, expecting `exit=0`. Then:

```sh
git add -A src/lib tests
git commit -m "feat(card)!: CardTitle takes an icon, absorbing SectionTitle

SectionTitle is removed. <CardTitle {icon} iconTone=\"primary\"> replaces it.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

### Task 55: Bring the docs in line

**Files:**
- Modify: `docs/specs/2026-11-04-svelte-port-design.md` (D5, D9, and the package tree under "Package structure")
- Modify: `docs/naming.md` §7
- Modify: `CLAUDE.md`, then copy it to `AGENTS.md`
- Modify: `.claude/skills/authors-components/SKILL.md`, `.claude/skills/documents-updates/SKILL.md`
- Modify: `docs/handoff.md`

- [ ] **Step 1: Spec.** D5 becomes: "Flat names from the root entry: `Dialog`, `DialogContent`, `DialogTitle`. Names follow React unless a `Diverged:` line says otherwise. `docs/naming.md` carries over." D9 becomes: "shadcn-svelte, for bits-ui wiring and Svelte mechanics only. The React package is the reference for look and behaviour; mise owns its API (see `2026-11-05-structure-design.md`)." Show `components/<group>/<component>/` in the package tree.

- [ ] **Step 2: `docs/naming.md` §7.** Replace the group table with the spec's: Foundations, then the eight purpose groups, then Patterns, with the rule "a component goes in the group for the question it answers on a screen; its provenance is on its `Origin:` line and shown as a `shadcn` badge." Keep the family-nesting line and the paragraph on what a story is for.

- [ ] **Step 3: `CLAUDE.md` / `AGENTS.md` and the skills.** Every `src/lib/components/<name>/` becomes `src/lib/components/<group>/<name>/`. The authors-components skill gains, in its per-component steps: pick the group from `docs/naming.md` §7 first; the story title is `<Group>/<Name>`; the tag follows the `Origin:` line. Replace any "names match React" wording with "reference, not contract". `grep -rn "Primitives/\|Components/" docs .claude CLAUDE.md` should then find only historical plans.

- [ ] **Step 4: Handoff.** Record that the structure change landed, the new story ids (`navigation-sidebar--default` and the like), and that round 4 starts from the spec's candidate table.

- [ ] **Step 5: Gate and commit.** `pnpm test && pnpm build:storybook; echo "exit=$?"`, expecting `exit=0`. Then:

```sh
git add docs CLAUDE.md AGENTS.md .claude
git commit -m "docs: grouping by purpose, and React as a reference

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

### Phase M gate

- Clean-tree gate: `rm -rf dist storybook-static .svelte-kit && pnpm test && pnpm build && pnpm build:storybook`.
- Screenshot, light and dark: the sidebar at 1400×900, Spinner's With caption, LoadingState's Choosing a treatment, Card's Title with icon and Title with tinted icon, and one story from each group to confirm nothing lost its styles in the move.
- Report in the phase-gates format and wait for approval to push.
