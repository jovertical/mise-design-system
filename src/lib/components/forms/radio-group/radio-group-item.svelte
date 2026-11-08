<!--
  Origin: the React package 2.23.0 `radio-group.tsx` (`RadioGroupItem`), itself shadcn/ui new-york `radio-group`
  Svelte: shadcn-svelte `radio-group`
  Diverged: unaudited, as in the React package. The indicator is drawn from the
    item's `checked` snippet argument rather than Radix's Indicator part.
-->
<script lang="ts" module>
  import { RadioGroup as RadioGroupPrimitive } from 'bits-ui'

  import type { WithoutChildrenOrChild } from '../../../utils/types.js'

  export type RadioGroupItemProps = WithoutChildrenOrChild<RadioGroupPrimitive.ItemProps>
</script>

<script lang="ts">
  import CircleIcon from '@lucide/svelte/icons/circle'

  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: RadioGroupItemProps = $props()
</script>

<RadioGroupPrimitive.Item
  bind:ref
  data-slot="radio-group-item"
  class={cn(
    'border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
    className,
  )}
  {...rest}
>
  {#snippet children({ checked })}
    <div data-slot="radio-group-indicator" class="relative flex items-center justify-center">
      {#if checked}
        <CircleIcon
          class="fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2"
        />
      {/if}
    </div>
  {/snippet}
</RadioGroupPrimitive.Item>
