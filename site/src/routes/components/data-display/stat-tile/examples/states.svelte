<!-- Loading and error keep the tile's height; an error shows the em dash a missing value does. -->
<script lang="ts">
  import { StatTile } from '@jovertical/mise-design-system'
  import IconCoin from '@tabler/icons-svelte-runes/icons/coin'
  import IconShoppingCart from '@tabler/icons-svelte-runes/icons/shopping-cart'
  import IconWallet from '@tabler/icons-svelte-runes/icons/wallet'
</script>

{#snippet cartIcon()}
  <IconShoppingCart />
{/snippet}

{#snippet walletIcon()}
  <IconWallet />
{/snippet}

{#snippet coinIcon()}
  <IconCoin />
{/snippet}

<div class="grid gap-4 sm:grid-cols-3">
  <StatTile label="Total orders" value="159" description="Lifetime to date" icon={cartIcon} />
  <StatTile
    label="Open order value"
    value={null}
    description="Orders in progress"
    icon={walletIcon}
    loading
  />
  <StatTile
    label="Lifetime value"
    value="$1,627,280"
    description="Billable revenue to date"
    icon={coinIcon}
    error
  />
</div>
