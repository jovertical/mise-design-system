<script lang="ts">
  import {
    ReadinessChecklist,
    type ReadinessItem,
    ReadinessSummary,
  } from '@jovertical/mise-design-system'

  const items: ReadinessItem[] = [
    { id: 'name', label: 'Name', status: 'met' },
    {
      id: 'price',
      label: 'Selling price',
      status: 'unmet',
      detail: 'Set a price before it can go on sale.',
    },
    { id: 'photo', label: 'Photo', status: 'unmet', optional: true },
  ]
</script>

<div class="flex w-80 flex-col gap-6">
  <ReadinessSummary {items} />
  <ReadinessChecklist {items} />
</div>
