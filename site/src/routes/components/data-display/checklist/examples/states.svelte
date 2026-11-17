<!--
  All three states. `skipped` is not a quieter `completed`: the step is finished
  with, but nothing was done. The icons differ, and so does what a screen
  reader hears: "Completed:", "Skipped:", "Not started:".
-->
<script lang="ts">
  import { Checklist, type ChecklistGroup } from '@jovertical/mise-design-system'

  const groups: ChecklistGroup[] = [
    {
      key: 'locations',
      label: 'Set up your locations',
      percent: 67,
      tasks: [
        { id: 'location', label: 'Add a location', state: 'completed' },
        { id: 'transfers', label: 'Set up stock transfers', state: 'skipped' },
        { id: 'reorder', label: 'Set reorder points', state: 'pending' },
      ],
    },
  ]
</script>

<div class="w-full max-w-2xl"><Checklist {groups} /></div>
