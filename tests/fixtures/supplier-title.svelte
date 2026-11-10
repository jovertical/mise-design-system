<script lang="ts">
  import IconBuildingWarehouse from '@tabler/icons-svelte-runes/icons/building-warehouse'
  import type { Tone } from '../../src/lib/index.js'
  import { CardTitle } from '../../src/lib/index.js'

  let { iconTone }: { iconTone?: Tone } = $props()
</script>

{#snippet icon()}
  <IconBuildingWarehouse />
{/snippet}

<CardTitle {icon} {iconTone}>Supplier information</CardTitle>
