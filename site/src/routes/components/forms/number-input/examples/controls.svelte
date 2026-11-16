<!--
  − and + either side, each disabled at its end of the range. `step` moves
  that many at a time with the buttons and arrow keys; Shift moves ten steps.
-->
<script lang="ts">
  import { NumberInput } from '@jovertical/mise-design-system'

  let copies: number | null = $state(1)
  let crates: number | null = $state(15)
</script>

<NumberInput aria-label="Copies" format="integer" controls min={1} max={10} bind:value={copies} />
<NumberInput aria-label="Crates" format="integer" controls step={5} bind:value={crates} />
