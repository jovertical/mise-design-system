<script lang="ts">
  import { EmptyState, PageHeader, PageLayout } from '@jovertical/mise-design-system'
  import Construction from '@lucide/svelte/icons/construction'
</script>

{#snippet icon()}
  <Construction />
{/snippet}

<PageLayout>
  <PageHeader title="Warehouses" />
  <EmptyState
    {icon}
    title="Coming in a later phase"
    description="This screen is built in the logistics example plan."
  />
</PageLayout>
