<script lang="ts">
  import { ChecklistCard } from '@jovertical/mise-design-system'
</script>

{#snippet seeAll()}
  <a href="#/getting-started" class="text-primary text-xs hover:underline">See all steps</a>
{/snippet}

<div class="w-64">
  <ChecklistCard
    title="Get started"
    percent={50}
    items={[
      { id: 'location', label: 'Add a location', done: true },
      { id: 'invite', label: 'Invite a teammate', done: false },
    ]}
    footer={seeAll}
  />
</div>
