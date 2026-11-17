<!--
  Severities, at a shift close. A blocking row unmet is critical; a `warn` row
  is tagged "Check" and does not block; an optional one stays muted. An
  `action` under an unmet row points at where it is fixed.
-->
<script lang="ts">
  import { ReadinessChecklist, type ReadinessItem } from '@jovertical/mise-design-system'

  const items: ReadinessItem[] = $derived([
    {
      id: 'locations',
      label: 'Every location closed',
      status: 'unmet',
      severity: 'block',
      detail: 'South depot is still open.',
      action: closeLocation,
    },
    {
      id: 'drawers',
      label: 'Drawers balance',
      status: 'met',
      severity: 'block',
      detail: 'Off by $0.00.',
    },
    {
      id: 'count',
      label: 'Stock count recorded',
      status: 'unmet',
      severity: 'warn',
      detail: 'Last counted 2 days ago.',
    },
    { id: 'notes', label: 'Handover note', status: 'unmet', optional: true },
  ])
</script>

{#snippet closeLocation()}
  <a href="#/locations/south-depot" class="text-primary hover:underline">Close South depot</a>
{/snippet}

<div class="w-80"><ReadinessChecklist {items} /></div>
