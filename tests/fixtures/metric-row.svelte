<script lang="ts">
  import { MetricRow, type MetricRowStat } from '../../src/lib/index.js'

  let {
    barPlacement,
    hideBar = false,
    trailing,
    percent = 80,
  }: {
    barPlacement?: 'below' | 'inline'
    hideBar?: boolean
    trailing?: string | null
    percent?: number
  } = $props()

  const stats: MetricRowStat[] = [
    { id: 'available', label: 'Available', value: '80%' },
    { id: 'low', label: 'Low stock', value: 3, tone: 'warning' },
  ]
</script>

<MetricRow label="Riverside" {stats} {percent} {barPlacement} {hideBar} {trailing} />
