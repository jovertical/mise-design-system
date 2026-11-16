<!--
  `invert` for a metric where falling is the point: failed payments, time to
  fulfil, stock at risk. The arrow still follows the sign; only the colour
  flips.
-->
<script lang="ts">
  import { DeltaBadge } from '@jovertical/mise-design-system'
</script>

<div class="flex flex-wrap items-center gap-3">
  <DeltaBadge value={-2.8} invert />
  <DeltaBadge value={6.4} invert />
</div>
