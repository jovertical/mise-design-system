<!--
  A row in flight spins rather than warning. `showRequirement={false}` for a
  progress list, what a server is doing, where a queued step tagged Required in
  warning colour would read as a problem.
-->
<script lang="ts">
  import { ReadinessChecklist, type ReadinessItem } from '@jovertical/mise-design-system'

  const items: ReadinessItem[] = [
    { id: 'location', label: 'Location created', status: 'met' },
    { id: 'stock', label: 'Opening stock loaded', status: 'pending' },
    { id: 'registers', label: 'Registers paired', status: 'unmet' },
  ]
</script>

<div class="w-80"><ReadinessChecklist {items} showRequirement={false} /></div>
