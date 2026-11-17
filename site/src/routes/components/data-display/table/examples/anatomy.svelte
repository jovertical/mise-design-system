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
</script>

<div class="w-[30rem]">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Item</TableHead>
        <TableHead numeric>Total</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell class="font-medium">Espresso beans, 1 kg</TableCell>
        <TableCell numeric>$25.00</TableCell>
      </TableRow>
      <TableRow>
        <TableCell class="font-medium">Oat milk, 1 L</TableCell>
        <TableCell numeric>$1.85</TableCell>
      </TableRow>
    </TableBody>
    <TableFooter>
      <TableRow>
        <TableCell>Total</TableCell>
        <TableCell numeric>$26.85</TableCell>
      </TableRow>
    </TableFooter>
  </Table>
</div>
