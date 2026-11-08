<!--
  Origin: the React package 2.23.0 `checkbox.tsx`, itself shadcn/ui new-york `checkbox`
  Svelte: shadcn-svelte `checkbox`
  Diverged: unaudited, as in the React package. bits-ui Checkbox for Radix
    Checkbox. The indeterminate state draws a minus, as shadcn-svelte's does,
    and takes the checked fill; Radix's Indicator drew the same check for both.
-->
<script lang="ts" module>
  import { Checkbox as CheckboxPrimitive } from 'bits-ui'

  import type { WithoutChildrenOrChild } from '../../../utils/types.js'

  export type CheckboxProps = WithoutChildrenOrChild<CheckboxPrimitive.RootProps>
</script>

<script lang="ts">
  import CheckIcon from '@lucide/svelte/icons/check'
  import MinusIcon from '@lucide/svelte/icons/minus'

  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    checked = $bindable(false),
    indeterminate = $bindable(false),
    class: className,
    ...rest
  }: CheckboxProps = $props()
</script>

<CheckboxPrimitive.Root
  bind:ref
  bind:checked
  bind:indeterminate
  data-slot="checkbox"
  class={cn(
    'peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
    'data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground data-[state=indeterminate]:border-primary',
    className,
  )}
  {...rest}
>
  {#snippet children({ checked, indeterminate })}
    <div
      data-slot="checkbox-indicator"
      class="grid place-content-center text-current transition-none"
    >
      {#if indeterminate}
        <MinusIcon class="size-3.5" />
      {:else if checked}
        <CheckIcon class="size-3.5" />
      {/if}
    </div>
  {/snippet}
</CheckboxPrimitive.Root>
