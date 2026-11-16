<!-- One on/off control. Reach for ToggleGroup the moment a second option joins it. -->
<script lang="ts">
  import { Toggle } from '@jovertical/mise-design-system'
  import IconStar from '@tabler/icons-svelte-runes/icons/star'

  let pinned = $state(false)
</script>

<Toggle variant="outline" bind:pressed={pinned} aria-label="Pin to the dashboard">
  <IconStar />
  Pin
</Toggle>
