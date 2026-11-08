<script lang="ts">
  import WarehouseIcon from '@lucide/svelte/icons/warehouse'
  import type { Tone } from '../../src/lib/index.js'
  import { CardTitle } from '../../src/lib/index.js'

  let { iconTone }: { iconTone?: Tone } = $props()
</script>

{#snippet icon()}
  <WarehouseIcon />
{/snippet}

<CardTitle {icon} {iconTone}>Supplier information</CardTitle>
