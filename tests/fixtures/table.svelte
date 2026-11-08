<script lang="ts">
  import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from '../../src/lib/index.js'

  let { compact = false }: { compact?: boolean } = $props()
</script>

<Table {compact}>
  <TableCaption>Stock on hand</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead strong>Item</TableHead>
      <TableHead numeric>Qty</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow data-state="selected">
      <TableCell>Flour</TableCell>
      <TableCell numeric>12</TableCell>
    </TableRow>
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell>Total</TableCell>
      <TableCell numeric>12</TableCell>
    </TableRow>
  </TableFooter>
</Table>
