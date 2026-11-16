<!-- Guidance beside a form, folding away once read: the answer stays available without staying in the way. -->
<script lang="ts">
  import { AsideCard } from '@jovertical/mise-design-system'
  import IconBulb from '@tabler/icons-svelte-runes/icons/bulb'
</script>

{#snippet bulb()}
  <IconBulb />
{/snippet}

<div class="w-full max-w-sm">
  <AsideCard icon={bulb} title="Tips">
    <ul class="text-muted-foreground list-disc space-y-1 pl-4 text-sm">
      <li>The location name appears on every receipt.</li>
      <li>The opening hours decide when orders can be collected.</li>
    </ul>
  </AsideCard>
</div>
