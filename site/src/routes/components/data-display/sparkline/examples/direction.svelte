<!--
  The tone is the series' identity, not a verdict on its direction: a falling
  line in green is a fall in a thing that is good. Fewer than two points draws
  nothing, rather than a dot or a flat rule.
-->
<script lang="ts">
  import { Sparkline } from '@jovertical/mise-design-system'
</script>

<div class="grid gap-6 sm:grid-cols-3">
  <Sparkline
    class="w-48"
    tone="success"
    data={[180, 210, 240, 260, 300, 320, 335, 340]}
    aria-label="Orders completed, climbing"
  />
  <Sparkline
    class="w-48"
    tone="success"
    data={[340, 320, 290, 300, 260, 230, 210, 180]}
    aria-label="Orders completed, falling"
  />
  <div class="w-48">
    <Sparkline data={[42]} />
    <p class="text-muted-foreground text-xs">One point: nothing draws.</p>
  </div>
</div>
