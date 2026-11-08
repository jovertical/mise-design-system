<!--
  Origin: the React package 2.23.0 `collapsible.tsx` (`CollapsibleContent`), itself shadcn/ui new-york `collapsible`
  Svelte: shadcn-svelte `collapsible`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import { Collapsible as CollapsiblePrimitive } from 'bits-ui'

  export type CollapsibleContentProps = CollapsiblePrimitive.ContentProps
</script>

<script lang="ts">
  let { ref = $bindable(null), ...rest }: CollapsibleContentProps = $props()
</script>

<CollapsiblePrimitive.Content bind:ref data-slot="collapsible-content" {...rest} />
