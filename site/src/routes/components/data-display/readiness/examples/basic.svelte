<!--
  In place: the summary and the list in an AsideCard beside the form they gate.
  A missing required row is a warning dot tagged Required; a met row needs no
  tag; a not-applicable row is dropped rather than greyed.
-->
<script lang="ts">
  import {
    AsideCard,
    ReadinessChecklist,
    type ReadinessItem,
    ReadinessSummary,
  } from '@jovertical/mise-design-system'
  import IconClipboardCheck from '@tabler/icons-svelte-runes/icons/clipboard-check'

  const items: ReadinessItem[] = [
    { id: 'name', label: 'Name', status: 'met' },
    {
      id: 'price',
      label: 'Selling price',
      status: 'unmet',
      detail: 'Set a price before it can go on sale.',
    },
    { id: 'category', label: 'Category', status: 'met' },
    { id: 'photo', label: 'Photo', status: 'unmet', optional: true },
    { id: 'tax', label: 'Tax code', status: 'not-applicable' },
  ]
</script>

{#snippet icon()}
  <IconClipboardCheck />
{/snippet}

<div class="w-80">
  <AsideCard {icon} title="Ready to sell">
    <div class="flex flex-col gap-4">
      <ReadinessSummary {items} />
      <ReadinessChecklist {items} />
    </div>
  </AsideCard>
</div>
