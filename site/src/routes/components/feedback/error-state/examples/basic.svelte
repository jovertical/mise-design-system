<!--
  A sentence saying what happened, a sentence saying why, and one way
  forward. `homeLink` is the app's own link, so mise never learns its router;
  the action names its destination.
-->
<script lang="ts">
  import { Button, ErrorState } from '@jovertical/mise-design-system'
</script>

{#snippet locations()}
  <Button href="#/locations">Back to locations</Button>
{/snippet}

<ErrorState
  title="Not your location"
  description="This record belongs to a location your account cannot administer."
  homeLink={locations}
/>
