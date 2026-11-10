<!--
  Origin: the React package 2.23.0 `radio-group.tsx` (`RadioGroup`), itself shadcn/ui new-york `radio-group`
  Svelte: shadcn-svelte `radio-group`
  Diverged: unaudited, as in the React package. bits-ui RadioGroup for Radix,
    with `bind:value`.
-->
<script lang="ts" module>
  import { RadioGroup as RadioGroupPrimitive } from 'bits-ui'

  /**
   * One choice from a few, all visible: `bind:value` and a `RadioGroupItem` per
   * option, each with its `Label`. When each choice needs a description or
   * media, `ChoiceRow`; from many, `Select`.
   */
  export type RadioGroupProps = RadioGroupPrimitive.RootProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    value = $bindable(''),
    class: className,
    ...rest
  }: RadioGroupProps = $props()
</script>

<RadioGroupPrimitive.Root
  bind:ref
  bind:value
  data-slot="radio-group"
  class={cn('grid gap-3', className)}
  {...rest}
/>
