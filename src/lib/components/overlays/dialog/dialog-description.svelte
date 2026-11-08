<!--
  Origin: the React package 2.23.0 `dialog.tsx` (`DialogDescription`), itself shadcn/ui new-york `dialog`
  Svelte: shadcn-svelte `dialog`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import { Dialog as DialogPrimitive } from 'bits-ui'

  export type DialogDescriptionProps = DialogPrimitive.DescriptionProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: DialogDescriptionProps = $props()
</script>

<DialogPrimitive.Description
  bind:ref
  data-slot="dialog-description"
  class={cn('text-muted-foreground text-sm', className)}
  {...rest}
/>
