<!--
  Origin: the React package 2.23.0 `avatar.tsx` (`AvatarFallback`), itself shadcn/ui new-york `avatar`
  Svelte: shadcn-svelte `avatar`
  Diverged: unaudited, as in the React package. bits-ui Avatar for Radix.
    The fill is `bg-foreground/[0.07]`, the neutral wash, not `bg-muted`, which
    vanished on the muted canvas and on a muted row.
-->
<script lang="ts" module>
  import { Avatar as AvatarPrimitive } from 'bits-ui'

  /** Renders while the image loads, and stays if it fails. */
  export type AvatarFallbackProps = AvatarPrimitive.FallbackProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: AvatarFallbackProps = $props()
</script>

<AvatarPrimitive.Fallback
  bind:ref
  data-slot="avatar-fallback"
  class={cn(
    'bg-foreground/[0.07] flex size-full items-center justify-center rounded-full',
    className,
  )}
  {...rest}
/>
