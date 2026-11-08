<script lang="ts">
  import { Button, ErrorState } from '../../src/lib/index.js'

  let { full = false }: { full?: boolean } = $props()
</script>

{#snippet lock()}
  <span data-testid="icon">L</span>
{/snippet}
{#snippet home()}
  <Button href="/locations">Back to locations</Button>
{/snippet}
{#snippet retry()}
  <Button variant="outline">Try again</Button>
{/snippet}

{#if full}
  <ErrorState
    status={403}
    icon={lock}
    title="Not your location"
    description="This record belongs to a location your account cannot administer."
    showBackButton
    homeLink={home}
    actions={retry}
  />
{:else}
  <ErrorState
    title="Maintenance"
    description="The app is briefly unavailable while a release lands."
  />
{/if}
