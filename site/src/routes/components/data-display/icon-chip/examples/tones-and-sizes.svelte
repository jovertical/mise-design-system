<!--
  Neutral is the default and should stay the common case; `primary` is the
  brand, never a status. The square's radius steps with the size.
-->
<script lang="ts">
  import { IconChip, TONES } from '@jovertical/mise-design-system'
  import IconPackage from '@tabler/icons-svelte-runes/icons/package'

  const SIZES = ['sm', 'md', 'lg'] as const
</script>

<div class="flex flex-col items-center gap-4">
  <div class="flex items-center gap-3">
    {#each TONES as tone (tone)}
      <IconChip size="md" {tone}><IconPackage /></IconChip>
    {/each}
  </div>
  <div class="flex items-center gap-3">
    {#each SIZES as size (size)}
      <IconChip {size}><IconPackage /></IconChip>
      <IconChip {size} shape="circle"><IconPackage /></IconChip>
    {/each}
  </div>
</div>
