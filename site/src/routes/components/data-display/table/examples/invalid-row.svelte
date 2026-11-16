<!--
  An editable row refused: the whole row carries the error, the input is
  aria-invalid, the derived figure is red, and one line says why beside the
  control rather than in a summary above.
-->
<script lang="ts">
  import {
    Input,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@jovertical/mise-design-system'
</script>

<div class="w-full max-w-3xl">
  <Table compact>
    <TableHeader>
      <TableRow>
        <TableHead>Item</TableHead>
        <TableHead numeric>On hand</TableHead>
        <TableHead class="w-36">Adjustment</TableHead>
        <TableHead numeric>New qty</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell class="font-medium">Oat milk, 1 L, case of 6</TableCell>
        <TableCell numeric class="text-muted-foreground">30</TableCell>
        <TableCell
          ><Input value="-4" aria-label="Adjustment" class="text-right tabular-nums" /></TableCell
        >
        <TableCell numeric class="font-medium">26</TableCell>
      </TableRow>
      <TableRow class="bg-destructive-soft hover:bg-destructive-soft">
        <TableCell class="font-medium">Espresso grinder burrs</TableCell>
        <TableCell numeric class="text-muted-foreground">9</TableCell>
        <TableCell>
          <div class="flex flex-col gap-1">
            <Input
              aria-invalid="true"
              value="-21"
              aria-label="Adjustment"
              class="text-right tabular-nums"
            />
            <p class="text-destructive text-xs">Would drive stock negative</p>
          </div>
        </TableCell>
        <TableCell numeric class="text-destructive font-medium">-12</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</div>
