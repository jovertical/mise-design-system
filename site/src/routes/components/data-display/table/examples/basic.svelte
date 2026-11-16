<!--
  Rows carry a hover fill and a rule. Money columns are `numeric`:
  right-aligned with tabular figures, so prices line up at the decimal point.
  A TableFooter row totals the columns.
-->
<script lang="ts">
  import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from '@jovertical/mise-design-system'

  const LINES = [
    { item: 'Espresso beans, 1 kg', qty: 2, unit: '$12.50', total: '$25.00' },
    { item: 'Oat milk, 1 L', qty: 1, unit: '$1.85', total: '$1.85' },
    { item: 'Cold brew concentrate', qty: 1, unit: '$26.13', total: '$26.13' },
  ]
</script>

<div class="w-full max-w-2xl">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Item</TableHead>
        <TableHead numeric>Qty</TableHead>
        <TableHead numeric>Unit price</TableHead>
        <TableHead numeric>Total</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {#each LINES as line (line.item)}
        <TableRow>
          <TableCell class="font-medium">{line.item}</TableCell>
          <TableCell numeric>{line.qty}</TableCell>
          <TableCell numeric>{line.unit}</TableCell>
          <TableCell numeric>{line.total}</TableCell>
        </TableRow>
      {/each}
    </TableBody>
    <TableFooter>
      <TableRow>
        <TableCell>Totals</TableCell>
        <TableCell numeric>4</TableCell>
        <TableCell />
        <TableCell numeric>$52.98</TableCell>
      </TableRow>
    </TableFooter>
  </Table>
</div>
