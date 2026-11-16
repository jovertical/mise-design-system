<!--
  Shaped to what it stands in for, with no default size: here a card's
  avatar, two lines and a paragraph while it loads.
-->
<script lang="ts">
  import { Skeleton } from '@jovertical/mise-design-system'
</script>

<div class="flex w-full max-w-sm flex-col gap-3 rounded-xl border p-4">
  <div class="flex items-center gap-3">
    <Skeleton class="size-10 shrink-0 rounded-full" />
    <div class="flex flex-col gap-1.5">
      <Skeleton class="h-4 w-32" />
      <Skeleton class="h-3 w-20" />
    </div>
  </div>
  <Skeleton class="h-3 w-full" />
  <Skeleton class="h-3 w-4/5" />
</div>
