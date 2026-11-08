<!--
  Origin: the React package 2.23.0 `collapsible.tsx` (`CollapsibleTrigger`), itself shadcn/ui new-york `collapsible`
  Svelte: shadcn-svelte `collapsible`
  Diverged: `asChild` is bits-ui's `child` snippet.
-->
<script lang="ts" module>
  import { Collapsible as CollapsiblePrimitive } from 'bits-ui'

  export type CollapsibleTriggerProps = CollapsiblePrimitive.TriggerProps
</script>

<script lang="ts">
  let { ref = $bindable(null), ...rest }: CollapsibleTriggerProps = $props()
</script>

<CollapsiblePrimitive.Trigger bind:ref data-slot="collapsible-trigger" {...rest} />
