<!--
  Origin: the React package 2.23.0 `combobox.tsx` (`ComboboxItem`)
  Diverged: the highlighted row is `bg-muted`, as SelectItem's, where React used
    `bg-accent`, which the React package redefined as the brand tint. bits-ui
    reads the field's text from `label`, so an item names itself with `label`;
    children are optional and render in its place.
-->
<script lang="ts" module>
  import { Combobox as ComboboxPrimitive } from 'bits-ui'
  import type { Snippet } from 'svelte'

  import type { WithoutChild } from '../../../utils/types.js'

  export type ComboboxItemProps = Omit<WithoutChild<ComboboxPrimitive.ItemProps>, 'children'> & {
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
  }: ComboboxItemProps = $props()
</script>

<ComboboxPrimitive.Item
  bind:ref
  {value}
  {label}
  data-slot="combobox-item"
  class={cn(
    "data-[highlighted]:bg-muted data-[highlighted]:text-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    className,
  )}
  {...rest}
>
  {#snippet children({ selected })}
    {#if content}
      {@render content()}
    {:else}
      {label ?? value}
    {/if}
    {#if selected}
      <span
        data-slot="combobox-item-indicator"
        class="pointer-events-none absolute right-2 flex size-4 items-center justify-center"
      >
        <IconCheck class="pointer-events-none size-4 pointer-coarse:size-5" />
      </span>
    {/if}
  {/snippet}
</ComboboxPrimitive.Item>
