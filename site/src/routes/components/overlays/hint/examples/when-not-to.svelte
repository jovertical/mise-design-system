<!--
  A `?` is a cost: it hides the sentence behind a hover or a press. "Total
  locations" needs no hint; "Capacity used" does, because what counts toward
  capacity is a rule nobody can guess. StatTile takes one as its `hint`.
-->
<script lang="ts">
  import { Hint, StatTile } from '@jovertical/mise-design-system'
</script>

{#snippet capacityHint()}
  <Hint label="What counts toward capacity">
    Provisioned databases against the plan's ceiling. Locations mid-onboarding count from the moment
    their database is created.
  </Hint>
{/snippet}

<div class="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
  <StatTile label="Total locations" value="248" />
  <StatTile label="Capacity used" value="61%" hint={capacityHint} />
</div>
