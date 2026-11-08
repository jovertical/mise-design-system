<!--
  Origin: the React package 2.23.0 `entity-label.tsx`
  Diverged: `title` and `description` are strings or snippets, and `icon` and
    `media` are snippets.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  import type { Tone } from '../../../utils/tone.js'
  import type { IconChipShape } from '../icon-chip/icon-chip-variants.js'

  /**
   * Names one thing (a person, a supplier, a document, a line item) with its
   * mark and one qualifying line, wherever it appears: a table cell, a picker
   * option, the head of a menu.
   *
   * Distinct from `Item`, which is a *row*: it owns a line of a list, with
   * padding, a hover and actions at its end. This owns nothing but the label,
   * so it sits inside whatever does without bringing padding of its own.
   *
   * `gap-3` between mark and text. The name and the line under it both
   * truncate: a table column is as wide as its widest cell, and one long file
   * name should not decide that for the rest.
   */
  export type EntityLabelProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
    /** The name. */
    title: string | Snippet
    /** One qualifying line: a size, a code, a role. */
    description?: string | Snippet
    /** A glyph, drawn in an `IconChip`. Takes precedence over `media`. */
    icon?: Snippet
    /** A mark given as is: an `Avatar` for a person or a supplier. */
    media?: Snippet
    iconShape?: IconChipShape
    /** When the entity itself is in a state worth a colour. The name stays in ink. */
    iconTone?: Tone
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import IconChip from '../icon-chip/icon-chip.svelte'

  let {
    title,
    description,
    icon,
    media,
    iconShape,
    iconTone,
    class: className,
    ...rest
  }: EntityLabelProps = $props()
</script>

{#snippet text(value: string | Snippet)}
  {#if typeof value === 'string'}
    {value}
  {:else}
    {@render value()}
  {/if}
{/snippet}

<div data-slot="entity-label" class={cn('flex min-w-0 items-center gap-3', className)} {...rest}>
  {#if icon}
    <IconChip shape={iconShape} tone={iconTone}>{@render icon()}</IconChip>
  {:else}
    {@render media?.()}
  {/if}
  <div class="flex min-w-0 flex-col">
    <div class="truncate text-sm font-medium">{@render text(title)}</div>
    {#if description}
      <div class="text-muted-foreground truncate text-xs">{@render text(description)}</div>
    {/if}
  </div>
</div>
