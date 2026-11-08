<!--
  Origin: the React package 2.23.0 `hover-card.tsx` (`HoverCardTrigger`), itself shadcn/ui new-york `hover-card`
  Svelte: shadcn-svelte `hover-card`
  Diverged: `asChild` is bits-ui's `child` snippet. The trigger renders an `a`,
    and bits-ui gives it `role="button"` with `aria-haspopup="dialog"`, where
    Radix leaves a plain link.
-->
<script lang="ts" module>
  import { LinkPreview as HoverCardPrimitive } from 'bits-ui'

  export type HoverCardTriggerProps = HoverCardPrimitive.TriggerProps
</script>

<script lang="ts">
  let { ref = $bindable(null), ...rest }: HoverCardTriggerProps = $props()
</script>

<HoverCardPrimitive.Trigger bind:ref data-slot="hover-card-trigger" {...rest} />
