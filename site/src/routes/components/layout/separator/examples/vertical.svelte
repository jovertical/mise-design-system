<!--
  `vertical` stands between items in a row and takes the row's height;
  `class="h-4"` gives it a shorter one, for a toolbar.
-->
<script lang="ts">
  import { Separator } from '@jovertical/mise-design-system'
</script>

<div class="bg-card flex h-12 items-center gap-2 rounded-xl border px-3 text-sm">
  <span class="font-medium">Orders</span>
  <Separator orientation="vertical" class="h-4" />
  <span class="text-muted-foreground">North depot</span>
  <Separator orientation="vertical" class="h-4" />
  <span class="text-muted-foreground">Today</span>
</div>
