<!--
  The full "Get started" list, part way through. Completed rows go muted and
  keep their place, so the list does not reshuffle between visits, and each
  group carries its own share. `expandedId` is controlled: open a row, and the
  one before closes.
-->
<script lang="ts">
  import { Button, Checklist, type ChecklistGroup } from '@jovertical/mise-design-system'

  let expandedId: string | undefined = $state('location')

  const groups: ChecklistGroup[] = $derived([
    {
      key: 'locations',
      label: 'Set up your locations',
      percent: 67,
      tasks: [
        {
          id: 'location',
          label: 'Add a location',
          state: 'completed',
          description: 'Each location keeps its own stock, shifts and registers.',
        },
        {
          id: 'stock',
          label: 'Count opening stock',
          state: 'completed',
          description: 'A first count gives every later movement a starting point.',
        },
        {
          id: 'reorder',
          label: 'Set reorder points',
          state: 'pending',
          description: 'Items under their reorder point show up as low stock.',
          actions: setReorderPoints,
          learnMore: reorderGuide,
        },
      ],
    },
    {
      key: 'team',
      label: 'Bring in your team',
      percent: 0,
      tasks: [
        {
          id: 'invite',
          label: 'Invite a teammate',
          state: 'pending',
          description: 'Each person signs in with their own PIN.',
        },
        { id: 'shifts', label: 'Plan the first week of shifts', state: 'pending' },
      ],
    },
  ])
</script>

{#snippet setReorderPoints()}
  <Button size="sm" variant="outline" href="#/stock/reorder-points">Set reorder points</Button>
{/snippet}

{#snippet reorderGuide()}
  <a href="#/guides/reorder-points" class="text-primary hover:underline">How reorder points work</a>
{/snippet}

<div class="w-full max-w-2xl">
  <Checklist {groups} {expandedId} onExpandedChange={(id) => (expandedId = id ?? undefined)} />
</div>
