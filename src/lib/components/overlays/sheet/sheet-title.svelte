<!--
  Origin: the React package 2.23.0 `sheet.tsx` (`SheetTitle`), itself shadcn/ui new-york `sheet`
  Svelte: shadcn-svelte `sheet`
  Diverged: unaudited, as in the React package.
-->
<script lang="ts" module>
  import { Dialog as SheetPrimitive } from 'bits-ui'

  export type SheetTitleProps = SheetPrimitive.TitleProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: SheetTitleProps = $props()
</script>

<SheetPrimitive.Title
  bind:ref
  data-slot="sheet-title"
  class={cn('text-foreground font-semibold', className)}
  {...rest}
/>
