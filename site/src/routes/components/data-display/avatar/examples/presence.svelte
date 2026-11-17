<!--
  AvatarStatus wraps an avatar with a pinging dot while someone is here, such
  as who has an order open; offline, it is the avatar alone. PresenceDot on
  its own, for an edge that is not an avatar's.
-->
<script lang="ts">
  import { Avatar, AvatarFallback, AvatarStatus, PresenceDot } from '@jovertical/mise-design-system'
</script>

<div class="flex items-center gap-4">
  <AvatarStatus isOnline label="Has this order open">
    <Avatar><AvatarFallback>AC</AvatarFallback></Avatar>
  </AvatarStatus>
  <AvatarStatus isOnline={false}>
    <Avatar><AvatarFallback>BO</AvatarFallback></Avatar>
  </AvatarStatus>
  <span class="flex items-center gap-2 text-sm">
    <PresenceDot label="Here now" />
    Dana is viewing
  </span>
</div>
