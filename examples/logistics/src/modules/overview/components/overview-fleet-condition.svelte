<!-- The overview's fleet condition: the share of vehicles at each condition, from their last inspection. -->
<script lang="ts">
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    RadialStat,
  } from '@jovertical/mise-design-system'
  import { store } from '#modules/core/data/store.svelte.js'
  import { CONDITIONS, fleetCondition } from '#modules/fleet/data/index.js'
  import { CONDITION } from '#modules/fleet/utils/status.js'

  const condition = $derived(fleetCondition(store))
</script>

<Card>
  <CardHeader>
    <CardTitle>Fleet condition</CardTitle>
    <CardDescription>From the last inspection of each vehicle.</CardDescription>
  </CardHeader>
  <CardContent class="flex flex-col gap-4">
    {#each CONDITIONS as key (key)}
      <div class="flex items-center gap-3">
        <RadialStat percent={condition[key].share} tone={CONDITION[key].tone} diameter={44} />
        <div class="flex flex-col">
          <span class="text-sm font-medium">{CONDITION[key].label}</span>
          <span class="text-muted-foreground text-xs">{CONDITION[key].note}</span>
        </div>
        <span class="ml-auto text-sm tabular-nums">{condition[key].count}</span>
      </div>
    {/each}
  </CardContent>
</Card>
