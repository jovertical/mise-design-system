<!-- The three most common pieces of styled text. A bare `muted` inherits the line's size. -->
<script lang="ts">
  import { Text } from '@jovertical/mise-design-system'
</script>

<div class="flex max-w-sm flex-col gap-3 text-sm">
  <Text as="p" size="sm" muted>Stock counts from the last cycle count, per location.</Text>
  <Text as="p" size="xs" muted>Updated 16 Jul 2026 by Ana Cruz.</Text>
  <p>Riverside <Text muted>· 4 staff</Text></p>
</div>
