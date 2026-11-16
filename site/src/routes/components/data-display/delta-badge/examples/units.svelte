<!--
  `unit` covers rates and multiples: turnover moves in x, not %. Money takes
  `prefix`, after the sign, with `unit` emptied.
-->
<script lang="ts">
  import { DeltaBadge } from '@jovertical/mise-design-system'
</script>

<div class="flex flex-wrap items-center gap-3">
  <DeltaBadge value={15.7} />
  <DeltaBadge value={0.7} unit="x" />
  <DeltaBadge value={12} precision={0} />
  <DeltaBadge value={1.25} prefix="$" unit="" precision={2} />
  <DeltaBadge value={-1.4} prefix="$" unit="" precision={2} />
</div>
