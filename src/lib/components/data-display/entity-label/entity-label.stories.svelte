<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import IconAlertTriangle from '@tabler/icons-svelte-runes/icons/alert-triangle'
  import IconBox from '@tabler/icons-svelte-runes/icons/box'
  import IconFileText from '@tabler/icons-svelte-runes/icons/file-text'
  import IconPackage from '@tabler/icons-svelte-runes/icons/package'

  import OnACard from '../../../../../stories/on-a-card.svelte'
  import Avatar from '../avatar/avatar.svelte'
  import AvatarFallback from '../avatar/avatar-fallback.svelte'
  import Badge from '../badge/badge.svelte'
  import Table from '../table/table.svelte'
  import TableBody from '../table/table-body.svelte'
  import TableCell from '../table/table-cell.svelte'
  import TableHead from '../table/table-head.svelte'
  import TableHeader from '../table/table-header.svelte'
  import TableRow from '../table/table-row.svelte'
  import EntityLabel from './entity-label.svelte'

  const { Story } = defineMeta({
    title: 'Data display/EntityLabel',
    component: EntityLabel,
    tags: ['mise'],
    args: { title: 'cycle-count-sheet.pdf', description: '212 KB' },
  })

  const LINES = [
    { name: 'Espresso beans, 1 kg', unit: 'Supply', sku: 'SUP-0041', sent: 12 },
    {
      name: 'Single origin Ethiopian Yirgacheffe, 250 g retail bag',
      unit: 'Product',
      sku: 'PRD-0107',
      sent: 30,
    },
    { name: 'Oat milk, 1 L', unit: 'Supply', sku: 'SUP-0211', sent: 24 },
  ]
</script>

{#snippet fileIcon()}
  <IconFileText />
{/snippet}
{#snippet boxIcon()}
  <IconBox />
{/snippet}
{#snippet packageIcon()}
  <IconPackage />
{/snippet}
{#snippet warningIcon()}
  <IconAlertTriangle />
{/snippet}
{#snippet supplierAvatar()}
  <Avatar><AvatarFallback class="text-xs">NC</AvatarFallback></Avatar>
{/snippet}
{#snippet staffAvatar()}
  <Avatar><AvatarFallback class="text-xs">DR</AvatarFallback></Avatar>
{/snippet}

<!-- A thing: a glyph in the chip, the name, one qualifying line. -->
<Story name="Playground">
  {#snippet template(args)}
    <OnACard><EntityLabel {...args} icon={fileIcon} /></OnACard>
  {/snippet}
</Story>

<!--
  `iconTone` when the entity itself is in a state worth a colour: a supply
  below its reorder level. The name stays in ink; the chip carries the state.
-->
<Story name="Tones" asChild>
  <OnACard>
    <EntityLabel
      icon={warningIcon}
      iconTone="warning"
      title="Oat milk, 1 L"
      description="3 left · reorder at 12"
    />
  </OnACard>
</Story>

<!--
  A classifying badge goes beside the label, not inside the name: the name
  truncates, and a badge caught in the truncation would vanish first.
-->
<Story name="With a badge" asChild>
  <OnACard>
    <div class="flex w-80 items-center justify-between gap-3">
      <EntityLabel media={staffAvatar} title="Dana Reyes" description="dana@example.com" />
      <Badge>Manager</Badge>
    </div>
  </OnACard>
</Story>

<!--
  A person or a supplier: `media` takes the Avatar as given. Its default 32px
  matches the chip's, so a column mixing people and things stays level.
-->
<Story name="With avatar" asChild>
  <OnACard>
    <EntityLabel media={supplierAvatar} title="Northwind Coffee Co." description="SUP-1001" />
  </OnACard>
</Story>

<!--
  The first cell of a table, where most hand-built copies lived. It brings no
  padding, so the cell's own is the only padding; the narrow column shows a
  long name truncating instead of stretching the table.
-->
<Story name="In a table" asChild>
  <div class="max-w-xl">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="w-56">Item</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead numeric>Sent</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {#each LINES as line (line.sku)}
          <TableRow>
            <TableCell class="max-w-56">
              <EntityLabel icon={packageIcon} title={line.name} description={line.unit} />
            </TableCell>
            <TableCell class="text-muted-foreground">{line.sku}</TableCell>
            <TableCell numeric>{line.sent}</TableCell>
          </TableRow>
        {/each}
      </TableBody>
    </Table>
  </div>
</Story>

<!-- No description: a line item named by what it is. -->
<Story name="Title only" asChild>
  <OnACard><EntityLabel icon={boxIcon} title="Espresso beans, 1 kg" /></OnACard>
</Story>
