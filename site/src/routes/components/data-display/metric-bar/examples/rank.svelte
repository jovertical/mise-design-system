<!-- `rank` numbers the rows: the list is ordered by the figure, and numbering it says so. -->
<script lang="ts">
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    MetricBar,
  } from '@jovertical/mise-design-system'

  const coverage = [
    { rank: 1, label: 'Harbour', percent: 94, stocked: 412 },
    { rank: 2, label: 'Riverside', percent: 88, stocked: 386 },
    { rank: 3, label: 'North yard', percent: 71, stocked: 311 },
  ]
</script>

<Card class="w-full max-w-md">
  <CardHeader><CardTitle>Catalogue coverage by location</CardTitle></CardHeader>
  <CardContent stack="md">
    {#each coverage as row (row.label)}
      <MetricBar
        rank={row.rank}
        label={row.label}
        value="{row.percent}%"
        percent={row.percent}
        trailing="{row.stocked} items stocked"
      />
    {/each}
  </CardContent>
</Card>
