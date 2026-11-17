<!--
  `outline` is a tag: metadata, not a state, and almost always neutral.
  `solid` shouts, for a status that has to interrupt; a column of solid
  badges says everything equally loud.
-->
<script lang="ts">
  import { Badge } from '@jovertical/mise-design-system'
</script>

<div class="flex flex-col items-start gap-3">
  <div class="flex flex-wrap items-center gap-2">
    <Badge variant="outline">kg</Badge>
    <Badge variant="outline">Dry goods</Badge>
    <Badge variant="outline">Walk-in</Badge>
  </div>
  <div class="flex items-center gap-3">
    <span class="font-heading text-sm">Cold brew concentrate</span>
    <Badge variant="solid" tone="critical">Out of stock</Badge>
  </div>
</div>
