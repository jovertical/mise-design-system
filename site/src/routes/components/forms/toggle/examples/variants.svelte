<!--
  `default` is bare until pressed; `outline` carries a border at rest; `solid`
  fills with the brand when pressed. `segmented` belongs to ToggleGroup.
-->
<script lang="ts">
  import { Toggle } from '@jovertical/mise-design-system'
  import IconLetterB from '@tabler/icons-svelte-runes/icons/letter-b'

  const VARIANTS = ['default', 'outline', 'solid'] as const
</script>

{#each VARIANTS as variant (variant)}
  <Toggle {variant} pressed aria-label="Bold, {variant}"><IconLetterB /></Toggle>
{/each}
