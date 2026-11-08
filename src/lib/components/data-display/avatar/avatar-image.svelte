<!--
  Origin: the React package 2.23.0 `avatar.tsx` (`AvatarImage`), itself shadcn/ui new-york `avatar`
  Svelte: shadcn-svelte `avatar`
  Diverged: unaudited, as in the React package. bits-ui Avatar for Radix.
-->
<script lang="ts" module>
  import { Avatar as AvatarPrimitive } from 'bits-ui'

  export type AvatarImageProps = AvatarPrimitive.ImageProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: AvatarImageProps = $props()
</script>

<AvatarPrimitive.Image
  bind:ref
  data-slot="avatar-image"
  class={cn('aspect-square size-full', className)}
  {...rest}
/>
