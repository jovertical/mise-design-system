<!--
  Origin: the React package 2.23.0 `collapsible.tsx` (`Collapsible`), itself shadcn/ui new-york `collapsible`
  Svelte: shadcn-svelte `collapsible`
  Diverged: bits-ui Collapsible for Radix, with `bind:open`; Radix's
    `defaultOpen` is the initial value of `open`.
-->
<script lang="ts" module>
  import { Collapsible as CollapsiblePrimitive } from 'bits-ui'

  /**
   * Unstyled: the primitive holds open state and nothing else. `AsideCard`
   * builds a real card on top of it; reach for `Collapsible` directly when the
   * surface around it is not a card.
   */
  export type CollapsibleProps = CollapsiblePrimitive.RootProps
</script>

<script lang="ts">
  let { ref = $bindable(null), open = $bindable(false), ...rest }: CollapsibleProps = $props()
</script>

<CollapsiblePrimitive.Root bind:ref bind:open data-slot="collapsible" {...rest} />
