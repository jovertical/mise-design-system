<!-- `tone` for text that carries a state: an error line is critical, a low-stock note warning. It wins over `muted`. -->
<script lang="ts">
  import { Text, TONES } from '@jovertical/mise-design-system'
</script>

<div class="flex flex-col gap-2">
  {#each TONES as tone (tone)}
    <Text size="sm" {tone}>On-hand updated at Riverside ({tone}).</Text>
  {/each}
</div>
