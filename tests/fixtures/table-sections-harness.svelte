<script lang="ts">
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableSectionRow,
  } from '../../src/lib/index.js'

  let { colspan }: { colspan?: number } = $props()
</script>

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Account</TableHead>
      <TableHead>Location</TableHead>
      <TableHead numeric>Balance</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableSectionRow {colspan}>Assets</TableSectionRow>
    <TableRow>
      <TableCell>Cash</TableCell>
      <TableCell>North depot</TableCell>
      <TableCell numeric>1,200.00</TableCell>
    </TableRow>
  </TableBody>
</Table>
