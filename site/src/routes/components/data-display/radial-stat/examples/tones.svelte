<!-- The stroke scales with the diameter, so a small ring stays legible. -->
<script lang="ts">
  import { RadialStat } from '@jovertical/mise-design-system'
</script>

<div class="flex flex-wrap items-center gap-6">
  <RadialStat percent={40} diameter={48} />
  <RadialStat percent={72} tone="info" />
  <RadialStat percent={88} tone="warning" />
  <RadialStat percent={18} diameter={120} tone="critical" />
</div>
