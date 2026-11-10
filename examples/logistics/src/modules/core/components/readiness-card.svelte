<!-- The aside card every create and edit page ends with: how far along the record is, and what it still needs. -->
<script lang="ts">
  import {
    AsideCard,
    ReadinessChecklist,
    type ReadinessItem,
    ReadinessSummary,
  } from '@jovertical/mise-design-system'
  import IconListCheck from '@tabler/icons-svelte-runes/icons/list-check'

  let { items, title = 'Ready to save' }: { items: ReadinessItem[]; title?: string } = $props()
</script>

{#snippet checks()}
  <IconListCheck />
{/snippet}

<AsideCard icon={checks} {title}>
  <div class="flex flex-col gap-4">
    <ReadinessSummary {items} />
    <ReadinessChecklist {items} />
  </div>
</AsideCard>
