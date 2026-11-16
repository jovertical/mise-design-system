<!-- For the anatomy. -->
<script lang="ts">
  import { Button, FactList, FactListItem, SummaryCard } from '@jovertical/mise-design-system'
  import IconClipboardList from '@tabler/icons-svelte-runes/icons/clipboard-list'
  import IconPencil from '@tabler/icons-svelte-runes/icons/pencil'
</script>

{#snippet clipboard()}
  <IconClipboardList />
{/snippet}

{#snippet edit()}
  <Button variant="ghost" size="sm"><IconPencil class="size-4" />Edit</Button>
{/snippet}

<div class="w-80">
  <SummaryCard icon={clipboard} title="Product details" action={edit}>
    <FactList class="gap-3">
      <FactListItem orientation="vertical" label="Name" value="All-purpose flour, 25 kg" />
      <FactListItem orientation="vertical" label="SKU" value="FL-025" />
      <FactListItem orientation="vertical" label="Category" value="Dry goods" />
    </FactList>
  </SummaryCard>
</div>
