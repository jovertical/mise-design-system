<!-- `visual` takes half the row and yields: a long figure squeezes the shape, never the reverse. -->
<script lang="ts">
  import { DeltaBadge, Sparkline, StatTile } from '@jovertical/mise-design-system'
  import IconCoin from '@tabler/icons-svelte-runes/icons/coin'
  import IconShoppingCart from '@tabler/icons-svelte-runes/icons/shopping-cart'
</script>

{#snippet cartIcon()}
  <IconShoppingCart />
{/snippet}

{#snippet coinIcon()}
  <IconCoin />
{/snippet}

{#snippet rising()}
  <DeltaBadge value={15.7} />
{/snippet}

<div class="grid gap-4 sm:grid-cols-2">
  <StatTile
    label="Transactions"
    value="1,284"
    unit="orders"
    delta={rising}
    icon={cartIcon}
    iconTone="primary"
    iconPosition="left"
  >
    {#snippet visual()}
      <Sparkline data={[4, 6, 5, 9, 8, 12, 11, 15]} height={36} />
    {/snippet}
  </StatTile>
  <StatTile
    label="Gross revenue"
    value="$45.6k"
    exactValue="$45,612.40"
    delta={rising}
    icon={coinIcon}
    iconTone="primary"
    iconPosition="left"
  >
    {#snippet visual()}
      <Sparkline data={[8, 7, 9, 11, 10, 14, 16, 19]} tone="success" height={36} />
    {/snippet}
  </StatTile>
</div>
