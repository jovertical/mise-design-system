<!--
  A thing: a glyph in the chip, its name, one qualifying line. A person or a
  supplier takes an Avatar as `media`, at the chip's 32px, so a column mixing
  people and things stays level.
-->
<script lang="ts">
  import { Avatar, AvatarFallback, EntityLabel } from '@jovertical/mise-design-system'
  import IconPackage from '@tabler/icons-svelte-runes/icons/package'
</script>

{#snippet packageIcon()}
  <IconPackage />
{/snippet}

{#snippet supplier()}
  <Avatar><AvatarFallback class="text-xs">NM</AvatarFallback></Avatar>
{/snippet}

<div class="flex flex-col gap-4">
  <EntityLabel
    icon={packageIcon}
    title="All-purpose flour, 25 kg"
    description="FL-025 · Dry goods"
  />
  <EntityLabel media={supplier} title="North Mill" description="SUP-1001" />
</div>
