<!-- `type="multiple"` binds an array: several kinds shown at once. -->
<script lang="ts">
  import { ToggleGroup, ToggleGroupItem } from '@jovertical/mise-design-system'

  let kinds = $state(['open', 'ready'])
</script>

<ToggleGroup type="multiple" variant="outline" bind:value={kinds} aria-label="Show orders">
  <ToggleGroupItem value="open">Open</ToggleGroupItem>
  <ToggleGroupItem value="ready">Ready</ToggleGroupItem>
  <ToggleGroupItem value="collected">Collected</ToggleGroupItem>
</ToggleGroup>
