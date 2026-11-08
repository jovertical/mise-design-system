---
name: authors-components
description: >-
  Guides adding and changing components in mise — reading the sibling components and
  shadcn-svelte first, the Origin / Svelte / Diverged header, the exported Props type, the prop
  vocabulary (tone, variant, size), the folder layout, the barrel and EXPECTED_EXPORTS, and the
  story. Activates when creating or editing anything in src/lib/components/, changing a prop or
  a default, or deciding whether something belongs in
  the package; or when the user mentions component, primitive, port, prop, variant, tone,
  default, shadcn, bits-ui, Origin header, or naming.
---

# Authors Components

Adapted from the React package's `authors-components` skill. Read
`docs/naming.md` first. It is the naming authority; this skill is the procedure
around it.

## When to Apply

- Adding a component or a part to a family
- Changing a prop, a value, a default, or the classes a component renders
- Renaming or removing anything exported from `src/lib/index.ts`

## 1. Read before writing

The port from the React package is finished; each module's `Origin:` header
records where it came from. Before adding or changing a component, read:

1. **The sibling components** in its group, and `docs/naming.md`. They decide
   the props, the values and the defaults.
2. **The shadcn-svelte component**, if there is one:
   `/tmp/shadcn-svelte-ref/docs/src/lib/registry/ui/<name>/`. Clone it with
   `git clone --depth 1 https://github.com/huntabyte/shadcn-svelte.git /tmp/shadcn-svelte-ref`
   if it is missing. It decides only the Svelte mechanics: bits-ui wiring,
   snippets, `bind:`, accessibility details.

Where the two disagree on anything but mechanics, mise's own components win
on look and behaviour. mise may merge two components into one or rename one
whose name misleads, as the structure spec did with `LoadingStatus` (into
`Spinner`) and `SectionTitle` (into `CardTitle`). Settle a merge in the round's
plan, not mid-change. Record every departure from the React package and every
merge on the surviving module's `Diverged:` line.

A component with no React origin has no file for its `Origin:` line to name,
and `tests/provenance.test.ts` requires one. Ask the user how to record it
before writing one.

## 2. The folder

Pick the group first, from `docs/naming.md` §7: the question the component
answers on a screen, not where it came from.

```
src/lib/components/<group>/<name>/
  <name>.svelte            the root part
  <name>-<part>.svelte     one file per further part
  <name>-variants.ts       a cva map worth importing on its own
  index.ts                 re-exports the parts under their flat names
  <name>.stories.svelte
```

The spec's API translation table, in short:

| React | Svelte 5 |
| --- | --- |
| `className` | `class`, destructured as `class: className` and passed last to `cn()` |
| `children: ReactNode` | `children: Snippet`, rendered with `{@render children?.()}` |
| `asChild` | `href` for an element that can be a link; bits-ui's `child` snippet for a primitive |
| `value` + `onValueChange` | `bind:value`, with `onValueChange` kept |
| `ref` | `ref = $bindable(null)`, plus `bind:this={ref}` or `bind:ref` |
| `React.ComponentProps<'div'>` | `WithElementRef<HTMLAttributes<HTMLDivElement>>` |
| Radix | bits-ui |

## 3. The shape of a part

`card-description.svelte` shows the smallest one:

```svelte
<!--
  Origin: the React package 2.23.0 `card.tsx` (`CardDescription`), itself shadcn/ui new-york `card`
  Svelte: shadcn-svelte `card`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../utils/types.js'

  export type CardDescriptionProps = WithElementRef<HTMLAttributes<HTMLDivElement>>
</script>

<script lang="ts">
  import { cn } from '../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: CardDescriptionProps =
    $props()
</script>

<div
  bind:this={ref}
  data-slot="card-description"
  class={cn('text-muted-foreground text-sm', className)}
  {...rest}
>
  {@render children?.()}
</div>
```

What makes it right:

- **The header comes first.** `tests/provenance.test.ts` fails without it.
  - `Origin:` names the React file. Add the part in brackets for a multi-part file.
  - `Svelte:` appears only when shadcn-svelte was used.
  - `Diverged:` always appears, even when its value is `none`.
- **`<Part>Props` is exported** from the module script.
- **Prose comments carry the decision.** Put the React package's comment on a
  prop or a part, minus the counts it took from the portals, on the Props type
  as JSDoc.
- **A ported module's classes stay as ported**, character for character. Colour
  comes from the semantic tokens and `src/lib/utils/tone.ts`, never from a
  class the component invents.
- **`...rest` goes on the root**, last, so callers can set any attribute.
- **Imports:** in `.ts`, relative imports end in `.js`. A runtime import used by
  both scripts sits in the module script only; importing the same name in both
  is a duplicate-identifier error.

## 4. Props follow one vocabulary

| Idea | Prop |
| --- | --- |
| Status colour | `tone: Tone`: `neutral \| primary \| info \| success \| warning \| critical` |
| Structural treatment | `variant`, never a colour |
| Size | `size: Size`: `sm \| md \| lg`, `md` by default |
| Heading / value name / line under | `title` / `label` / `description` |
| State | a bare adjective: `loading`, `invalid`, `disabled` |

Red is `critical`, never `destructive`, `error` or `danger` as a value. Neutral
is `neutral`, never `default` or `muted`.

## 5. Register it

1. Write `index.ts`: `export { default as CardTitle, type CardTitleProps } from './card-title.svelte'`.
2. Add `export * from './components/<group>/<name>/index.js'` to
   `src/lib/index.ts`, under its group's comment. Biome keeps the lines sorted.
3. Append the runtime names to `EXPECTED_EXPORTS` in `tests/barrel.test.ts`.

## 6. The story

```svelte
<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import OnACard from '../../../../../stories/on-a-card.svelte'
  import Badge from './badge.svelte'

  const { Story } = defineMeta({ title: 'Data display/Badge', component: Badge, tags: ['shadcn'] })
</script>

<Story name="Playground">
  {#snippet template(args)}
    <OnACard><Badge {...args}>Open</Badge></OnACard>
  {/snippet}
</Story>
```

- **Title:** `<Group>/<Name>`, the folder it lives in: `data-display/badge/`
  is `Data display/Badge`. `tests/stories.test.ts` checks it; a folder whose
  title is not its PascalCase name goes in `TITLE_ALIASES` in `tests/groups.ts`.
- **Tags:** exactly one, `['shadcn']` or `['mise']`, read from the `Origin:`
  line. The provenance test checks it, and Storybook shows `shadcn` as a
  sidebar badge.
- **`asChild` on every static story.** Without it, addon-svelte-csf renders the
  story's children *inside* the meta `component`: a ghost Card inside a default
  Card, a Dialog story inside a bare DialogContent. A story either uses
  `{#snippet template(args)}` (the Playground) or says `<Story name="…" asChild>`.
  `tests/stories.test.ts` enforces it.
- **Port every React story onto the skeleton** in `docs/naming.md` §7:
  `Playground` first, then `Matrix`, the axes, `States`, `With …`,
  `Long content`, `In …`, and scenarios last. Rename a React story to its
  rank's name, merge it into an axis or `States`, or keep it as a scenario.
  Draw a Matrix with `stories/story-matrix.svelte` and an axis with
  `stories/story-axis.svelte`. A comment opens every story after the
  Playground. `tests/stories.test.ts` checks all of it.
- A story that needs a component not yet ported is deferred, with a comment at
  the top saying which component blocks it.
- **Copy** is generic operations: locations, shifts, orders, stock, registers.
- **`OnACard`** for anything that lives on a card. The canvas is `--muted`.
- **A neutral fill is `bg-foreground/[0.07]`** (`TONE_SOFT_CLASS.neutral`),
  never `bg-muted`, which is the canvas and vanishes on it. `bg-muted` is for
  tracks, strips and row surfaces, which a border or their contents carry.
  Skeleton alone keeps `bg-foreground/10`: a placeholder's pulse needs the
  extra contrast.

## 7. Verify

```bash
pnpm test               # svelte-check, biome, vitest
pnpm storybook          # look at it in light, dark and a second preset
```

## Common Pitfalls

- Taking an API decision from shadcn-svelte instead of `docs/naming.md` and the sibling components.
- A class retyped instead of copied, or assembled from a template string that Tailwind cannot see.
- A missing `Diverged:` line, or a `Svelte:` line naming a component that was not used.
- Forgetting the barrel line or `EXPECTED_EXPORTS`.
- A story tag typed from memory instead of read from the header.
- A relative `.ts` import without `.js`.
