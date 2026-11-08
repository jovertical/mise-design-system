<!--
  Origin: the React package 2.23.0 `hover-card.tsx` (`HoverCard`), itself shadcn/ui new-york `hover-card`
  Svelte: shadcn-svelte `hover-card`
  Diverged: bits-ui's LinkPreview for Radix's HoverCard, with `bind:open`.
    bits-ui renders no element for the root, so it carries no `data-slot`.
-->
<script lang="ts" module>
  import { LinkPreview as HoverCardPrimitive } from 'bits-ui'

  /**
   * A preview on hover or focus, for a fact worth a glance without leaving the
   * page: a person's details behind their name, a linked record's summary.
   * Reach for `Tooltip` instead when the content is a single short label.
   */
  export type HoverCardProps = HoverCardPrimitive.RootProps
</script>

<script lang="ts">
  let { open = $bindable(false), ...rest }: HoverCardProps = $props()
</script>

<HoverCardPrimitive.Root bind:open {...rest} />
