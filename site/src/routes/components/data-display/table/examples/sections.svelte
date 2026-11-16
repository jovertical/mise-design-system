<!-- Rows grouped under a heading row each: TableSectionRow spans every column. `compact` for a table being read. -->
<script lang="ts">
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableSectionRow,
  } from '@jovertical/mise-design-system'

  const LEDGER = [
    {
      section: 'Assets',
      rows: [
        { account: 'Cash on hand', location: 'Riverside', balance: '$4,210.00' },
        { account: 'Stock', location: 'Harbour', balance: '$18,940.00' },
      ],
    },
    {
      section: 'Liabilities',
      rows: [{ account: 'Supplier payables', location: 'All', balance: '$6,120.00' }],
    },
  ]
</script>

<div class="w-full max-w-2xl">
  <Table compact>
    <TableHeader>
      <TableRow>
        <TableHead>Account</TableHead>
        <TableHead>Location</TableHead>
        <TableHead numeric>Balance</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {#each LEDGER as group (group.section)}
        <TableSectionRow>{group.section}</TableSectionRow>
        {#each group.rows as row (row.account + row.location)}
          <TableRow>
            <TableCell>{row.account}</TableCell>
            <TableCell>{row.location}</TableCell>
            <TableCell numeric>{row.balance}</TableCell>
          </TableRow>
        {/each}
      {/each}
    </TableBody>
  </Table>
</div>
