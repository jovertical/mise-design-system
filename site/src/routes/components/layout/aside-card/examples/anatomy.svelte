<script lang="ts">
  import { AsideCard } from '@jovertical/mise-design-system'
  import IconBulb from '@tabler/icons-svelte-runes/icons/bulb'
</script>

{#snippet bulb()}
  <IconBulb />
{/snippet}

<div class="w-80">
  <AsideCard icon={bulb} title="Tips">
    <p class="text-muted-foreground text-sm">The location name appears on every receipt.</p>
  </AsideCard>
</div>
