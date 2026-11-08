<!--
  Origin: the React package 2.23.0 `tree-leaf.tsx`
  Diverged: `icon` is a snippet, `label` and `trailing` strings or snippets.
    `mediaSize` `default` is `md`, the vocabulary's middle size.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLLiAttributes } from 'svelte/elements'

  const STEM_CLASS = { middle: 'h-full', last: 'h-1/2' } as const
  const MEDIA_SIZE_CLASS = { md: 'size-8', sm: 'size-6' } as const

  /**
   * One row of a nested list: a stem down its left edge, an elbow into the
   * row, a media chip, a label, and an optional trailing figure.
   *
   * Named for what it renders rather than for a `Tree` family that does not
   * exist: a caller composes a `<ul>` of these, because the uses that exist (a
   * bundle's components, a recipe's ingredients) nest one level deep and never
   * more.
   */
  export type TreeLeafProps = Omit<HTMLLiAttributes, 'children'> & {
    /** `last` shortens the stem to half height, so it does not run past the final row. */
    position?: keyof typeof STEM_CLASS
    icon: Snippet
    label: string | Snippet
    trailing?: string | Snippet
    mediaSize?: keyof typeof MEDIA_SIZE_CLASS
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    position = 'middle',
    icon,
    label,
    trailing,
    mediaSize = 'md',
    class: className,
    ...rest
  }: TreeLeafProps = $props()
</script>

{#snippet text(value: string | Snippet)}
  {#if typeof value === 'string'}
    {value}
  {:else}
    {@render value()}
  {/if}
{/snippet}

<li
  data-slot="tree-leaf"
  data-position={position}
  class={cn('relative flex items-center gap-3 pl-6 pt-3', className)}
  {...rest}
>
  <span
    aria-hidden="true"
    data-slot="tree-leaf-stem"
    class={cn('absolute left-0 top-0 w-4 border-l', STEM_CLASS[position])}
  ></span>
  <span
    aria-hidden="true"
    data-slot="tree-leaf-elbow"
    class="absolute left-0 top-1/2 w-4 -translate-y-px border-t"
  ></span>
  <div
    data-slot="tree-leaf-media"
    class={cn(
      "flex shrink-0 items-center justify-center rounded-sm border bg-muted [&_svg:not([class*='size-'])]:size-4",
      MEDIA_SIZE_CLASS[mediaSize],
    )}
  >
    {@render icon()}
  </div>
  <!-- min-w-0 with flex-1, or a long label pushes `trailing` out of the row: a
       clipped name beside its figure beats a full name beside nothing. -->
  <span data-slot="tree-leaf-label" class="min-w-0 flex-1 truncate text-sm"
    >{@render text(label)}</span
  >
  {#if trailing}
    <span data-slot="tree-leaf-trailing" class="shrink-0">{@render text(trailing)}</span>
  {/if}
</li>
