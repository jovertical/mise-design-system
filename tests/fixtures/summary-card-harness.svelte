<script lang="ts">
  import { Button, SummaryCard } from '../../src/lib/index.js'

  let { withAction = true }: { withAction?: boolean } = $props()
</script>

{#snippet clipboard()}
  <svg data-testid="icon"><title>details</title></svg>
{/snippet}
{#snippet edit()}
  <Button variant="ghost" size="sm">Edit</Button>
{/snippet}

<SummaryCard icon={clipboard} title="Product details" action={withAction ? edit : undefined}>
  <p>Wool scarf</p>
</SummaryCard>
