<!--
  The summary counts on its own: optional rows move the bar without holding the
  door, so it reads ready short of 100%. Pass `ready` where a server owns the
  gate; false with every row ticked says "Not ready yet" rather than claiming
  otherwise.
-->
<script lang="ts">
  import { type ReadinessItem, ReadinessSummary } from '@jovertical/mise-design-system'

  const items: ReadinessItem[] = [
    { id: 'name', label: 'Name', status: 'met' },
    { id: 'price', label: 'Selling price', status: 'met' },
    { id: 'photo', label: 'Photo', status: 'unmet', optional: true },
  ]
</script>

<div class="flex w-80 flex-col gap-6">
  <ReadinessSummary {items} />
  <ReadinessSummary items={items.filter((item) => item.status === 'met')} ready={false} />
</div>
