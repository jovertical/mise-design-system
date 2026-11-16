<!--
  The bare bar, `value` against `max`. MetricBar and MetricRow colour it by
  tone; reach for Progress directly when no label or figure sits beside it.
-->
<script lang="ts">
  import { Button, Progress } from '@jovertical/mise-design-system'

  let counted = $state(62)
</script>

<div class="flex w-72 flex-col gap-3">
  <Progress value={counted} aria-label="Stock count progress" />
  <div class="flex items-center gap-2">
    <Button variant="outline" size="sm" onclick={() => (counted = Math.max(0, counted - 10))}>
      − 10
    </Button>
    <Button variant="outline" size="sm" onclick={() => (counted = Math.min(100, counted + 10))}>
      + 10
    </Button>
    <span class="text-muted-foreground text-sm tabular-nums">{counted}% counted</span>
  </div>
</div>
