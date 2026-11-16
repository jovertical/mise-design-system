<!--
  Four columns, a badge and a figure per cell: a small, fixed set of totals,
  where a share of a whole would mean nothing since they are not parts of
  one sum.
-->
<script lang="ts">
  import {
    Badge,
    Card,
    CardContent,
    CardGrid,
    CardGridCell,
    CardHeader,
    CardTitle,
    type Tone,
  } from '@jovertical/mise-design-system'

  const ACCOUNTS: { name: string; tone: Tone; amount: string }[] = [
    { name: 'Revenue', tone: 'success', amount: '$84,200.00' },
    { name: 'Tax liability', tone: 'warning', amount: '$6,340.00' },
    { name: 'Contra revenue', tone: 'neutral', amount: '−$1,120.00' },
    { name: 'Cash and receivables', tone: 'info', amount: '$79,760.00' },
  ]
</script>

<Card class="w-full">
  <CardHeader><CardTitle>Accounts</CardTitle></CardHeader>
  <CardContent>
    <CardGrid columns={4}>
      {#each ACCOUNTS as account (account.name)}
        <CardGridCell class="flex flex-col items-start gap-2">
          <Badge tone={account.tone}>{account.name}</Badge>
          <p class="text-lg font-medium tabular-nums">{account.amount}</p>
        </CardGridCell>
      {/each}
    </CardGrid>
  </CardContent>
</Card>
