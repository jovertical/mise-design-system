<!--
  Origin: the React package 2.23.0 `dialog.tsx` (`DialogTrigger`), itself shadcn/ui new-york `dialog`
  Svelte: shadcn-svelte `dialog`
  Diverged: `asChild` is bits-ui's `child` snippet. No `type` default; Radix's trigger had none.
-->
<script lang="ts" module>
  import { Dialog as DialogPrimitive } from 'bits-ui'

  export type DialogTriggerProps = DialogPrimitive.TriggerProps
</script>

<script lang="ts">
  let { ref = $bindable(null), ...rest }: DialogTriggerProps = $props()
</script>

<DialogPrimitive.Trigger bind:ref data-slot="dialog-trigger" {...rest} />
