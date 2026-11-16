<!-- For the anatomy: every part an error page takes. -->
<script lang="ts">
  import { Button, ErrorState } from '@jovertical/mise-design-system'
  import IconLock from '@tabler/icons-svelte-runes/icons/lock'
</script>

{#snippet lock()}
  <IconLock />
{/snippet}

{#snippet locations()}
  <Button href="#/locations">Back to locations</Button>
{/snippet}

<ErrorState
  status={403}
  icon={lock}
  title="Not your location"
  description="This record belongs to a location your account cannot administer."
  showBackButton
  homeLink={locations}
/>
