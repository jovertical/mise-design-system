<script lang="ts">
  import { type ChartConfig, ChartContainer } from '../../src/lib/index.js'

  const config: ChartConfig = {
    completed: { label: 'Completed', color: 'var(--chart-1)' },
    placed: { label: 'Placed', theme: { light: 'oklch(0.5 0.1 200)', dark: 'oklch(0.8 0.1 200)' } },
  }
</script>

<ChartContainer {config} id="orders"><span>marks</span></ChartContainer>
