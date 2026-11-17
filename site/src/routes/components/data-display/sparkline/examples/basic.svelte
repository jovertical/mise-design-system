<!-- A figure's recent shape, small enough to sit beside it. The width comes from whatever holds it. -->
<script lang="ts">
  import { Sparkline } from '@jovertical/mise-design-system'
</script>

<div class="flex items-center gap-4">
  <span class="font-heading text-2xl font-semibold tabular-nums">$45.6k</span>
  <Sparkline
    class="w-40"
    data={[180, 210, 240, 260, 300, 320, 335, 340]}
    height={36}
    aria-label="Sales over eight weeks, climbing"
  />
</div>
