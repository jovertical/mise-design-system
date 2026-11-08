<!--
  Origin: the React package 2.23.0 `popover.tsx` (`PopoverTrigger`), itself shadcn/ui new-york `popover`
  Svelte: shadcn-svelte `popover`
  Diverged: `asChild` is bits-ui's `child` snippet.
-->
<script lang="ts" module>
  import { Popover as PopoverPrimitive } from 'bits-ui'

  export type PopoverTriggerProps = PopoverPrimitive.TriggerProps
</script>

<script lang="ts">
  let { ref = $bindable(null), ...rest }: PopoverTriggerProps = $props()
</script>

<PopoverPrimitive.Trigger bind:ref data-slot="popover-trigger" {...rest} />
