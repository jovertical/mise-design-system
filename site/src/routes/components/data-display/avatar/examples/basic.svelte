<!--
  AvatarImage for a picture, AvatarFallback for the initials, which render
  while the image loads and stay if it fails. `size-8` by default; a caller
  resizing it sets the initials' size too, since the fallback centres what it
  is given rather than scaling it.
-->
<script lang="ts">
  import { Avatar, AvatarFallback } from '@jovertical/mise-design-system'

  const SIZES = [
    { avatar: 'size-6', initials: 'text-[0.625rem]' },
    { avatar: 'size-8', initials: '' },
    { avatar: 'size-10', initials: '' },
    { avatar: 'size-12', initials: 'text-base' },
  ]
</script>

<div class="flex items-center gap-3">
  {#each SIZES as size (size.avatar)}
    <Avatar class={size.avatar}><AvatarFallback class={size.initials}>AC</AvatarFallback></Avatar>
  {/each}
</div>
