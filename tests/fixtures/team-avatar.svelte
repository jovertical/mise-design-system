<script lang="ts">
  import { Avatar, AvatarFallback, AvatarImage, AvatarStatus } from '../../src/lib/index.js'

  let { isOnline = false }: { isOnline?: boolean } = $props()
</script>

<AvatarStatus {isOnline} label="Has this order open">
  <Avatar class="size-10">
    <AvatarImage src="/missing.png" alt="Ana Cruz" />
    <AvatarFallback>AC</AvatarFallback>
  </Avatar>
</AvatarStatus>
