<script lang="ts">
  import { EntityLabel } from '@jovertical/mise-design-system'
  import IconPackage from '@tabler/icons-svelte-runes/icons/package'
</script>

{#snippet packageIcon()}
  <IconPackage />
{/snippet}

<EntityLabel icon={packageIcon} title="All-purpose flour, 25 kg" description="FL-025 · Dry goods" />
