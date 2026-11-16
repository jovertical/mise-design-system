<script lang="ts">
  import Hint from '../../src/lib/components/overlays/hint/hint.svelte'

  let open = $state(true)
</script>

<div data-testid="host">
  <Hint
    label="How capacity is counted"
    bind:open
    contentProps={{ portalProps: { disabled: true } }}
  >
    Provisioned databases against the plan's ceiling.
  </Hint>
</div>
<button type="button" onclick={() => (open = false)}>Close the hint</button>
<p data-testid="open">{open}</p>
