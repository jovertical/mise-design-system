<!--
  Origin: the React package 2.23.0 `dialog.tsx` (`DialogTitle`), itself shadcn/ui new-york `dialog`
  Svelte: shadcn-svelte `dialog`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import { Dialog as DialogPrimitive } from 'bits-ui'

  export type DialogTitleProps = DialogPrimitive.TitleProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: DialogTitleProps = $props()
</script>

<DialogPrimitive.Title
  bind:ref
  data-slot="dialog-title"
  class={cn('font-heading text-lg leading-none font-semibold', className)}
  {...rest}
/>
