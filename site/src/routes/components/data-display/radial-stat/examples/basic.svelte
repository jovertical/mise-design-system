<!-- A share drawn as an arc, the figure inside it. `thick` for a ring that is its card's subject. -->
<script lang="ts">
  import { RadialStat } from '@jovertical/mise-design-system'
</script>

<div class="flex items-end gap-6">
  <RadialStat percent={64} diameter={140} tone="success" thickness="thick">
    <div class="text-center">
      <div class="font-heading text-2xl font-semibold tabular-nums">64%</div>
      <div class="text-muted-foreground text-xs">received</div>
    </div>
  </RadialStat>
  <RadialStat percent={64} />
  <RadialStat percent={64} diameter={48} thickness="thick" />
</div>
