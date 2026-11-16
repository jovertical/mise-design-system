<!-- `size` resizes the segmented track, to sit level with a smaller or larger control beside it. -->
<script lang="ts">
  import { ToggleGroup, ToggleGroupItem } from '@jovertical/mise-design-system'

  const SIZES = ['sm', 'md', 'lg'] as const
</script>

<div class="flex flex-col items-center gap-4">
  {#each SIZES as size (size)}
    <ToggleGroup type="single" variant="segmented" {size} value="1" aria-label="Multiplier, {size}">
      <ToggleGroupItem value="1">1x</ToggleGroupItem>
      <ToggleGroupItem value="1.5">1.5x</ToggleGroupItem>
      <ToggleGroupItem value="2">2x</ToggleGroupItem>
    </ToggleGroup>
  {/each}
</div>
