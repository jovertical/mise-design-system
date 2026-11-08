<!--
  Origin: the React package 2.23.0 `select.tsx` (`SelectLabel`), itself shadcn/ui new-york `select`
  Svelte: shadcn-svelte `select`
  Diverged: bits-ui names this part GroupHeading; it keeps React's name and classes.
-->
<script lang="ts" module>
  import { Select as SelectPrimitive } from 'bits-ui'

  export type SelectLabelProps = SelectPrimitive.GroupHeadingProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: SelectLabelProps = $props()
</script>

<SelectPrimitive.GroupHeading
  bind:ref
  data-slot="select-label"
  class={cn('text-muted-foreground px-2 py-1.5 text-xs', className)}
  {...rest}
/>
