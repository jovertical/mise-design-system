<!-- Body text is `normal`; weight is for a name, a value or a total. -->
<script lang="ts">
  import { Text } from '@jovertical/mise-design-system'

  const WEIGHTS = ['normal', 'medium', 'semibold'] as const
</script>

<div class="flex flex-col gap-2">
  {#each WEIGHTS as weight (weight)}
    <Text {weight}>Espresso beans, 1 kg ({weight})</Text>
  {/each}
</div>
