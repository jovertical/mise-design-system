<script lang="ts">
  import StoreIcon from '@lucide/svelte/icons/store'

  import { MetricBar, type Tone } from '../../src/lib/index.js'

  let {
    percent = 76,
    tone,
    withIcon = false,
    rank,
  }: { percent?: number; tone?: Tone; withIcon?: boolean; rank?: number } = $props()
</script>

{#snippet icon()}
  <StoreIcon />
{/snippet}

<MetricBar
  label="Active"
  value="589"
  description="Selling now"
  trailing="589 / 775"
  {percent}
  {tone}
  {rank}
  icon={withIcon ? icon : undefined}
/>
