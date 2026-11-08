<!--
  Origin: the React package 2.23.0 `avatar.tsx` (`Avatar`), itself shadcn/ui new-york `avatar`
  Svelte: shadcn-svelte `avatar`
  Diverged: unaudited, as in the React package. bits-ui Avatar for Radix.
-->
<script lang="ts" module>
  import { Avatar as AvatarPrimitive } from 'bits-ui'

  /** `size-8` by default; a caller resizing it sets the initials' size too. */
  export type AvatarProps = AvatarPrimitive.RootProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: AvatarProps = $props()
</script>

<AvatarPrimitive.Root
  bind:ref
  data-slot="avatar"
  class={cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', className)}
  {...rest}
/>
