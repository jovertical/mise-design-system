<!--
  `barPlacement="inline"`: the bar is a picture of the one figure, so they stay
  on a line. `trailing={null}` holds the slot empty, so every bar ends at the
  same x.
-->
<script lang="ts">
  import {
    Badge,
    Card,
    CardContent,
    CardHeader,
    CardList,
    CardTitle,
    MetricRow,
    type Tone,
  } from '@jovertical/mise-design-system'

  type Health = 'Critical' | 'Watch' | null

  const categories: { name: string; detail: string; percent: number; health: Health }[] = [
    { name: 'Drinks', detail: '9 items · $29.4k value', percent: 56, health: 'Critical' },
    { name: 'Bakery', detail: '4 items · $7.2k value', percent: 75, health: 'Watch' },
    { name: 'Dry goods', detail: '3 items · $1.5k value', percent: 92, health: null },
  ]

  const HEALTH_TONE: Record<'Critical' | 'Watch' | 'Healthy', Tone> = {
    Critical: 'critical',
    Watch: 'warning',
    Healthy: 'success',
  }
</script>

<Card class="w-full max-w-2xl">
  <CardHeader divided><CardTitle>Stock health by category</CardTitle></CardHeader>
  <CardContent>
    <CardList>
      {#each categories as category (category.name)}
        {#snippet badge()}
          <Badge tone={HEALTH_TONE[category.health ?? 'Healthy']}>{category.health}</Badge>
        {/snippet}
        <MetricRow
          label={category.name}
          description={category.detail}
          barPlacement="inline"
          percent={category.percent}
          tone={HEALTH_TONE[category.health ?? 'Healthy']}
          stats={[{ id: 'health', value: `${category.percent}%` }]}
          trailing={category.health === null ? null : badge}
        />
      {/each}
    </CardList>
  </CardContent>
</Card>
