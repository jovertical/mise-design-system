<!--
  Origin: the React package 2.23.0 `select.tsx` (`SelectItem`), itself shadcn/ui new-york `select`
  Svelte: shadcn-svelte `select`
  Diverged: bits-ui reads the trigger text from `label`, so an item names itself
    with `label`; children are optional and render in its place. bits-ui marks
    the active row `data-highlighted` rather than focusing it, so the `focus:`
    pair is mirrored on `data-[highlighted]`. Tabler's check for Lucide's.
-->
<script lang="ts" module>
  import { Select as SelectPrimitive } from 'bits-ui'
  import type { Snippet } from 'svelte'

  import type { WithoutChild } from '../../../utils/types.js'

  /**
   * `focus:bg-muted` rather than `--accent`, which is a nav tint and never a
   * hover.
   */
  export type SelectItemProps = Omit<WithoutChild<SelectPrimitive.ItemProps>, 'children'> & {
    children?: Snippet
  }
</script>

<script lang="ts">
  import IconCheck from '@tabler/icons-svelte-runes/icons/check'

  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    value,
    label,
    class: className,
    children: content,
    ...rest
  }: SelectItemProps = $props()
</script>

<SelectPrimitive.Item
  bind:ref
  {value}
  {label}
  data-slot="select-item"
  class={cn(
    "focus:bg-muted focus:text-foreground data-[highlighted]:bg-muted data-[highlighted]:text-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center min-h-7 gap-2 rounded-xl in-data-[slot=dialog-content]:rounded-2xl py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
    className,
  )}
  {...rest}
>
  {#snippet children({ selected })}
    <span
      data-slot="select-item-indicator"
      class="absolute right-2 flex size-3.5 items-center justify-center"
    >
      {#if selected}
        <IconCheck class="size-4" />
      {/if}
    </span>
    <span>
      {#if content}
        {@render content()}
      {:else}
        {label ?? value}
      {/if}
    </span>
  {/snippet}
</SelectPrimitive.Item>
