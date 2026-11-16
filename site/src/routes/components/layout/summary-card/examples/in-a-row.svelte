<!--
  A row of three, the shape the cards are made for; `h-full` keeps them one
  height. The last is read-only, as in a flow that runs forward only.
-->
<script lang="ts">
  import {
    Badge,
    Button,
    FactList,
    FactListItem,
    SummaryCard,
  } from '@jovertical/mise-design-system'
  import IconClipboardList from '@tabler/icons-svelte-runes/icons/clipboard-list'
  import IconDeviceTablet from '@tabler/icons-svelte-runes/icons/device-tablet'
  import IconPencil from '@tabler/icons-svelte-runes/icons/pencil'
  import IconTag from '@tabler/icons-svelte-runes/icons/tag'
</script>

{#snippet clipboard()}
  <IconClipboardList />
{/snippet}

{#snippet tag()}
  <IconTag />
{/snippet}

{#snippet tablet()}
  <IconDeviceTablet />
{/snippet}

{#snippet edit()}
  <Button variant="ghost" size="sm"><IconPencil class="size-4" />Edit</Button>
{/snippet}

{#snippet inStock()}
  <Badge>In stock</Badge>
{/snippet}

<div class="grid w-full gap-4 md:grid-cols-3">
  <SummaryCard icon={clipboard} title="Product" action={edit} class="h-full">
    <FactList class="gap-3">
      <FactListItem orientation="vertical" label="Name" value="Flour, 25 kg" />
      <FactListItem orientation="vertical" label="SKU" value="FL-025" />
    </FactList>
  </SummaryCard>
  <SummaryCard icon={tag} title="Pricing & stock" action={edit} class="h-full">
    <FactList class="gap-3">
      <FactListItem orientation="vertical" label="Selling price" value="$18.50" />
      <FactListItem orientation="vertical" label="Stock status" value={inStock} />
    </FactList>
  </SummaryCard>
  <SummaryCard icon={tablet} title="Registers" class="h-full">
    <FactList class="gap-3">
      <FactListItem orientation="vertical" label="Registered" value="2 registers" />
    </FactList>
  </SummaryCard>
</div>
