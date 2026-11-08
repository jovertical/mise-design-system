<script lang="ts">
  import { AsideCard } from '../../src/lib/index.js'

  let { open = $bindable(true) }: { open?: boolean } = $props()
</script>

{#snippet bulb()}
  <svg data-testid="icon"><title>tip</title></svg>
{/snippet}

<AsideCard icon={bulb} title="Tips" bind:open>
  <p>The company name appears on every receipt.</p>
</AsideCard>
