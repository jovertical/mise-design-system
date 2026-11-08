<!--
  Origin: the React package 2.23.0 `sheet.tsx` (`SheetDescription`), itself shadcn/ui new-york `sheet`
  Svelte: shadcn-svelte `sheet`
  Diverged: unaudited, as in the React package.
-->
<script lang="ts" module>
  import { Dialog as SheetPrimitive } from 'bits-ui'

  export type SheetDescriptionProps = SheetPrimitive.DescriptionProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: SheetDescriptionProps = $props()
</script>

<SheetPrimitive.Description
  bind:ref
  data-slot="sheet-description"
  class={cn('text-muted-foreground text-sm', className)}
  {...rest}
/>
