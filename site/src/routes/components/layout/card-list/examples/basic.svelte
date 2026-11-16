<!--
  Rows ruled edge to edge. CardList cancels the card's side padding and hands
  it back to each row, so the rules reach the edges while the rows line up
  with the header. It sits in a padded CardContent.
-->
<script lang="ts">
  import {
    Card,
    CardContent,
    CardHeader,
    CardList,
    CardTitle,
  } from '@jovertical/mise-design-system'

  const SESSIONS = [
    { label: 'Open', duration: '2h 14m', count: '5 registers' },
    { label: 'Idle', duration: '18m', count: '2 registers' },
    { label: 'Closed', duration: '—', count: '9 registers' },
  ]
</script>

<Card class="w-full max-w-md">
  <CardHeader divided><CardTitle>Register sessions</CardTitle></CardHeader>
  <CardContent>
    <CardList>
      {#each SESSIONS as row (row.label)}
        <div class="flex items-center justify-between gap-3 text-sm">
          <span>{row.label}</span>
          <span class="flex items-baseline gap-3 tabular-nums">
            <span class="font-medium">{row.duration}</span>
            <span class="text-muted-foreground">{row.count}</span>
          </span>
        </div>
      {/each}
    </CardList>
  </CardContent>
</Card>
