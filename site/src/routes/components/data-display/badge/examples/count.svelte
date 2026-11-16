<!--
  `count` for a number on its own: one digit is a circle, more stretch it
  into a pill of the same height, with tabular figures. "3 items" is a label,
  not a count.
-->
<script lang="ts">
  import { Badge } from '@jovertical/mise-design-system'
</script>

<div class="flex items-center gap-3">
  <Badge count tone="primary">3</Badge>
  <Badge count tone="warning">12</Badge>
  <Badge count tone="critical">99+</Badge>
  <Badge count variant="solid" tone="primary">7</Badge>
</div>
