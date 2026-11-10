<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import IconBuildingStore from '@tabler/icons-svelte-runes/icons/building-store'
  import IconClipboardList from '@tabler/icons-svelte-runes/icons/clipboard-list'
  import IconDeviceTablet from '@tabler/icons-svelte-runes/icons/device-tablet'
  import IconPencil from '@tabler/icons-svelte-runes/icons/pencil'
  import IconTag from '@tabler/icons-svelte-runes/icons/tag'

  import Button from '../../actions/button/button.svelte'
  import Badge from '../../data-display/badge/badge.svelte'
  import FactList from '../../data-display/fact-list/fact-list.svelte'
  import FactListItem from '../../data-display/fact-list/fact-list-item.svelte'
  import SummaryCard from './summary-card.svelte'

  const { Story } = defineMeta({
    title: 'Layout/SummaryCard',
    component: SummaryCard,
    tags: ['mise'],
    args: { title: 'Product details' },
  })
</script>

{#snippet clipboard()}
  <IconClipboardList />
{/snippet}
{#snippet store()}
  <IconBuildingStore />
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
{#snippet product()}
  <FactList class="gap-3">
    <FactListItem orientation="vertical" label="Name" value="Wool scarf" />
    <FactListItem orientation="vertical" label="SKU" value="WS-001" />
    <FactListItem orientation="vertical" label="Category" value="Accessories" />
  </FactList>
{/snippet}

<!-- The builder's case: a step you can still go back and change, through `action`. -->
<Story name="Playground">
  {#snippet template(args)}
    <div class="max-w-sm">
      <SummaryCard
        {...args}
        icon={clipboard}
        title={args.title ?? ''}
        action={edit}
        children={product}
      />
    </div>
  {/snippet}
</Story>

<!--
  Read-only, the wizard's case: a flow that runs forward only, so there is no
  Edit to offer and the header carries the title alone.
-->
<Story name="States" asChild>
  <div class="max-w-sm">
    <SummaryCard icon={store} title="Company">
      <FactList class="gap-3">
        <FactListItem orientation="vertical" label="Trading name" value="North Bakery" />
        <FactListItem orientation="vertical" label="Industry" value="Food & Beverage" />
        <FactListItem orientation="vertical" label="Tax registration" value="Registered" />
      </FactList>
    </SummaryCard>
  </div>
</Story>

<!--
  A row of three, which is what the cards are shaped for. `h-full` keeps them
  the same height when one has more fields than the others; the ragged version
  reads as three unrelated cards.
-->
<Story name="In a row" asChild>
  <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    <SummaryCard icon={clipboard} title="Product details" action={edit}>
      <FactList class="gap-3">
        <FactListItem orientation="vertical" label="Name" value="Wool scarf" />
        <FactListItem orientation="vertical" label="SKU" value="WS-001" />
        <FactListItem orientation="vertical" label="Type" value="Simple" />
        <FactListItem
          orientation="vertical"
          label="Description"
          multiline
          value="Soft wool blend scarf with fringe detail. A warm accessory for cooler months."
        />
      </FactList>
    </SummaryCard>
    <SummaryCard icon={tag} title="Pricing & stock" action={edit}>
      <FactList class="gap-3">
        <FactListItem orientation="vertical" label="Selling price" value="$7.99" />
        <FactListItem orientation="vertical" label="On hand" value={60} />
        <FactListItem orientation="vertical" label="Stock status" value={inStock} />
      </FactList>
    </SummaryCard>
    <SummaryCard icon={tablet} title="Devices">
      <FactList class="gap-3">
        <FactListItem orientation="vertical" label="Registered" value="2 registers" />
        <FactListItem orientation="vertical" label="Location" value="Main" />
      </FactList>
    </SummaryCard>
  </div>
</Story>
