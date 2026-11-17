<!--
  The first cell of a table, where most hand-built copies lived. It brings no
  padding of its own, and a long name truncates instead of stretching the
  column.
-->
<script lang="ts">
  import {
    EntityLabel,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@jovertical/mise-design-system'
  import IconPackage from '@tabler/icons-svelte-runes/icons/package'

  const LINES = [
    { name: 'All-purpose flour, 25 kg', unit: 'sack', sku: 'FL-025', sent: 12 },
    {
      name: 'Single origin cold brew concentrate, 1 litre',
      unit: 'bottle',
      sku: 'CB-001',
      sent: 48,
    },
  ]
</script>

{#snippet packageIcon()}
  <IconPackage />
{/snippet}

<div class="w-full max-w-xl">
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
