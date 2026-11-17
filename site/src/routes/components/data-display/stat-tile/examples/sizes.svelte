<!-- `sm` for a dense row or a figure in another card, `md` four across, `lg` one or two across. -->
<script lang="ts">
  import { StatTile } from '@jovertical/mise-design-system'
  import IconPackage from '@tabler/icons-svelte-runes/icons/package'

  const sizes = ['sm', 'md', 'lg'] as const
</script>

{#snippet icon()}
  <IconPackage />
{/snippet}

<div class="grid gap-4 sm:grid-cols-3">
  {#each sizes as size (size)}
    <StatTile label="Tracked items" value="1,284" {size} {icon} />
  {/each}
</div>
