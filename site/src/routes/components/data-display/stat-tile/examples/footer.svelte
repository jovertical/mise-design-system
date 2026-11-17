<!-- `footer` sits below everything; `action` is a link out, on the label's line. -->
<script lang="ts">
  import { Button, Progress, StatTile } from '@jovertical/mise-design-system'
  import IconAlertCircle from '@tabler/icons-svelte-runes/icons/alert-circle'
  import IconBuildingStore from '@tabler/icons-svelte-runes/icons/building-store'
</script>

{#snippet alertIcon()}
  <IconAlertCircle />
{/snippet}

{#snippet storeIcon()}
  <IconBuildingStore />
{/snippet}

{#snippet viewAll()}
  <Button variant="outline" size="sm" href="#/locations">View all</Button>
{/snippet}

<div class="grid gap-4 sm:grid-cols-2">
  <StatTile
    label="Locations"
    value="12"
    description="Trading on this account"
    icon={storeIcon}
    iconPosition="left"
    action={viewAll}
  />
  <StatTile
    label="Low stock"
    value="9"
    tone="warning"
    description="3 urgent"
    icon={alertIcon}
    iconPosition="left"
  >
    {#snippet footer()}
      <Progress value={64} />
    {/snippet}
  </StatTile>
</div>
