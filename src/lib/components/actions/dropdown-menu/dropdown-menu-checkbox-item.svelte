<!--
  Origin: the React package 2.23.0 `dropdown-menu.tsx` (`DropdownMenuCheckboxItem`), itself shadcn/ui new-york `dropdown-menu`
  Svelte: shadcn-svelte `dropdown-menu`
  Diverged: bits-ui marks the active row `data-highlighted` rather than focusing
    it, so each `focus:` utility is mirrored on `data-[highlighted]`. The check
    is drawn from the item's `checked` snippet argument. Tabler's check for
    Lucide's.
-->
<script lang="ts" module>
  import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui'
  import type { Snippet } from 'svelte'

  import type { WithoutChildrenOrChild } from '../../../utils/types.js'

  export type DropdownMenuCheckboxItemProps =
    WithoutChildrenOrChild<DropdownMenuPrimitive.CheckboxItemProps> & {
      children?: Snippet
    }
</script>

<script lang="ts">
  import IconCheck from '@tabler/icons-svelte-runes/icons/check'

  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    checked = $bindable(false),
    class: className,
    children: content,
    ...rest
  }: DropdownMenuCheckboxItemProps = $props()
</script>

<DropdownMenuPrimitive.CheckboxItem
  bind:ref
  bind:checked
  data-slot="dropdown-menu-checkbox-item"
  class={cn(
    "focus:bg-muted data-[highlighted]:bg-muted focus:text-foreground data-[highlighted]:text-foreground relative flex cursor-default items-center min-h-7 gap-2 rounded-xl in-data-[slot=dialog-content]:rounded-2xl py-1.5 pr-2 pl-8 text-sm whitespace-nowrap outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    className,
  )}
  {...rest}
>
  {#snippet children({ checked })}
    <span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
      {#if checked}
        <IconCheck class="size-4" />
      {/if}
    </span>
    {@render content?.()}
  {/snippet}
</DropdownMenuPrimitive.CheckboxItem>
