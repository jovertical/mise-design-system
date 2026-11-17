<script lang="ts">
  import { Checklist, type ChecklistGroup } from '@jovertical/mise-design-system'

  const groups: ChecklistGroup[] = [
    {
      key: 'locations',
      label: 'Set up your locations',
      percent: 50,
      tasks: [
        { id: 'location', label: 'Add a location', state: 'completed' },
        { id: 'reorder', label: 'Set reorder points', state: 'pending' },
      ],
    },
  ]
</script>

<div class="w-[30rem]"><Checklist {groups} /></div>
