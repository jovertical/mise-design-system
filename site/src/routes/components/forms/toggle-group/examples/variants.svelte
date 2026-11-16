<!--
  `segmented` reads as a filter; `outline` as one joined control, a row of
  buttons sharing a border, closer to a toolbar than a set of options.
-->
<script lang="ts">
  import { ToggleGroup, ToggleGroupItem } from '@jovertical/mise-design-system'

  const VARIANTS = ['segmented', 'outline'] as const
</script>

<div class="flex flex-col items-center gap-4">
  {#each VARIANTS as variant (variant)}
    <ToggleGroup type="single" {variant} value="left" aria-label="Alignment, {variant}">
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right">Right</ToggleGroupItem>
    </ToggleGroup>
  {/each}
</div>
