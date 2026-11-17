<!-- Every tone but neutral, which a series never wants: it would read as disabled. -->
<script lang="ts">
  import { Sparkline } from '@jovertical/mise-design-system'

  const tones = ['primary', 'info', 'success', 'warning', 'critical'] as const
  const climbing = [180, 210, 240, 260, 300, 320, 335, 340]
</script>

<div class="grid gap-4 sm:grid-cols-5">
  {#each tones as tone (tone)}
    <Sparkline data={climbing} {tone} class="w-full" aria-label="{tone} series, climbing" />
  {/each}
</div>
