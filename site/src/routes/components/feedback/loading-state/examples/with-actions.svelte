<!--
  A wait with a way out: only worth offering when leaving is safe, a job on
  the server that survives the tab closing, not a form mid-submit.
-->
<script lang="ts">
  import { Button, LoadingState } from '@jovertical/mise-design-system'
</script>

{#snippet background()}
  <Button variant="outline">Continue in background</Button>
{/snippet}

<LoadingState
  title="Preparing the stock report"
  description="This runs on the server and reports back, so leaving will not cancel it."
  actions={background}
/>
