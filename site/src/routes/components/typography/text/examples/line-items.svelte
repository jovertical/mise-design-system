<!--
  A name, a value and a total: `medium` for the first two, `semibold` for the
  last, and `numeric` so the figures line up in a column.
-->
<script lang="ts">
  import { Text } from '@jovertical/mise-design-system'
</script>

<div class="flex w-full max-w-sm flex-col gap-1 text-sm">
  <div class="flex justify-between gap-4">
    <Text weight="medium">Espresso beans, 1 kg</Text>
    <Text numeric>$12.50</Text>
  </div>
  <div class="flex justify-between gap-4">
    <Text weight="medium">Oat milk, 1 L</Text>
    <Text numeric>$1.85</Text>
  </div>
  <div class="flex justify-between gap-4 border-t pt-1">
    <Text weight="semibold">Total</Text>
    <Text weight="semibold" numeric>$14.35</Text>
  </div>
</div>
