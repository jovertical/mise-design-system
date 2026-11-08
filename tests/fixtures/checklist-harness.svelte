<script lang="ts">
  import { Checklist, type ChecklistGroup } from '../../src/lib/index.js'

  let { expandedId = $bindable<string | undefined>(undefined) }: { expandedId?: string } = $props()
</script>

{#snippet add()}
  <button type="button">Add a category</button>
{/snippet}

<Checklist
  groups={[
    {
      key: 'menu',
      label: 'Set up your menu',
      percent: 50,
      tasks: [
        {
          id: 'category',
          label: 'Add a category',
          state: 'completed',
          description: 'Group items.',
          actions: add,
        },
        { id: 'location', label: 'Add a second location', state: 'skipped' },
        {
          id: 'product',
          label: 'Add your first product',
          state: 'pending',
          description: 'Something to sell.',
        },
      ],
    },
  ] satisfies ChecklistGroup[]}
  {expandedId}
  onExpandedChange={(id) => (expandedId = id ?? undefined)}
/>
<output data-testid="expanded">{expandedId ?? 'none'}</output>
