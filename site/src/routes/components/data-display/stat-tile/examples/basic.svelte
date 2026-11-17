<!-- One figure, qualified: a caption, a delta, a muted line, the icon out of the reading path. -->
<script lang="ts">
  import { DeltaBadge, StatTile } from '@jovertical/mise-design-system'
  import IconShoppingCart from '@tabler/icons-svelte-runes/icons/shopping-cart'
</script>

{#snippet icon()}
  <IconShoppingCart />
{/snippet}

{#snippet delta()}
  <DeltaBadge value={15.7} />
{/snippet}

<StatTile
  class="w-72"
  label="Orders today"
  value="1,284"
  description="Across 12 locations"
  {icon}
  {delta}
/>
