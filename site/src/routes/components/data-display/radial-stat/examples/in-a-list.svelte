<!--
  A handful of parts, each with its own ring. Four is readable; twenty is a wall
  of dials, which is the line between this and MetricBar. `aria-label` reads in
  place of the ring.
-->
<script lang="ts">
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    RadialStat,
    type Tone,
  } from '@jovertical/mise-design-system'

  const health: {
    label: string
    description: string
    percent: number
    tone: Tone
    count: number
  }[] = [
    {
      label: 'In stock',
      description: 'Above the reorder point',
      percent: 72,
      tone: 'success',
      count: 41,
    },
    {
      label: 'Low stock',
      description: 'At or under the reorder point',
      percent: 21,
      tone: 'warning',
      count: 12,
    },
    {
      label: 'Out of stock',
      description: 'Nothing on hand',
      percent: 7,
      tone: 'critical',
      count: 4,
    },
  ]
</script>

<Card class="w-full max-w-xl">
  <CardHeader><CardTitle>Stock health</CardTitle></CardHeader>
  <CardContent stack="md">
    {#each health as row (row.label)}
      <div class="flex items-center gap-4">
        <RadialStat
          percent={row.percent}
          tone={row.tone}
          aria-label="{row.label}: {row.percent}%"
        />
        <div class="min-w-0 flex-1">
          <p class="font-heading text-base font-medium">{row.label}</p>
          <p class="text-muted-foreground text-sm">{row.description}</p>
        </div>
        <span
          class="bg-muted grid size-10 shrink-0 place-items-center rounded-xl text-sm tabular-nums"
        >
          {row.count}
        </span>
      </div>
    {/each}
  </CardContent>
</Card>
