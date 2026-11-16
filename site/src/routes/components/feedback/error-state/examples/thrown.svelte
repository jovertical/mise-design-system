<!-- A thrown error is the one case with something to try: retry leads, the way out follows. -->
<script lang="ts">
  import { Button, ErrorState } from '@jovertical/mise-design-system'
</script>

{#snippet retry()}
  <Button variant="outline">Try again</Button>
{/snippet}

{#snippet locations()}
  <Button href="#/locations">Back to locations</Button>
{/snippet}

<ErrorState
  title="Something went wrong"
  description="The location list could not be loaded."
  actions={retry}
  homeLink={locations}
/>
