<!--
  Origin: the React package 2.23.0 `choice-row.tsx` (`ChoiceRowReadonly`)
  Diverged: spreads the rest onto the root, as every component does.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  /**
   * A settled choice, in the shape of the choice it was.
   *
   * For showing a value whose editor lives somewhere else. Same surface as
   * `ChoiceRow`, so a column of them reads as one card, with a filled dot
   * instead of a control: nothing here takes a click, and a real radio would
   * offer an edit this row cannot honour.
   */
  export type ChoiceRowReadonlyProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
    label: string
    description?: string
    selected: boolean
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { label, description, selected, class: className, ...rest }: ChoiceRowReadonlyProps = $props()
</script>

<div
  data-slot="choice-row-readonly"
  class={cn(
    'flex w-full items-start gap-3 rounded-2xl border p-4',
    selected ? 'border-primary bg-primary/5' : 'border-border bg-muted/40 opacity-60',
    className,
  )}
  {...rest}
>
  <span
    aria-hidden="true"
    class={cn(
      'mt-1 flex size-4 shrink-0 items-center justify-center rounded-full border',
      selected ? 'border-primary' : 'border-muted-foreground/40',
    )}
  >
    {#if selected}
      <span class="bg-primary size-2 rounded-full"></span>
    {/if}
  </span>

  <span class="min-w-0 flex-1">
    <span class="block text-sm font-medium">{label}</span>
    {#if description}
      <span class="text-muted-foreground mt-0.5 block text-sm">{description}</span>
    {/if}
  </span>
</div>
