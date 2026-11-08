<script module lang="ts">
  import StoreIcon from '@lucide/svelte/icons/store'
  import TabletIcon from '@lucide/svelte/icons/tablet'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Button from '../../actions/button/button.svelte'
  import EmptyState from './empty-state.svelte'

  const { Story } = defineMeta({
    title: 'Feedback/EmptyState',
    component: EmptyState,
    tags: ['mise'],
  })
</script>

{#snippet tablet()}
  <TabletIcon />
{/snippet}
{#snippet store()}
  <StoreIcon />
{/snippet}
{#snippet locationActions()}
  <Button variant="outline">Import locations</Button>
  <Button>Add location</Button>
{/snippet}

<!--
  With no wording of its own, the panel falls back to copy that is true anywhere,
  which is the tell that a screen has not been given its own yet.
-->
<Story name="Playground">
  {#snippet template(args)}
    <EmptyState {...args} icon={tablet} />
  {/snippet}
</Story>

<!-- A title and a line under it, saying where the things will come from. -->
<Story name="With description" asChild>
  <EmptyState
    icon={store}
    title="No locations yet"
    description="Locations appear here once setup is finished."
  />
</Story>

<!--
  An empty list is a dead end unless it offers the way out. Actions lay out in a
  row, so keep them to two: a primary and an escape.
-->
<Story name="With actions" asChild>
  <EmptyState
    icon={store}
    title="No locations yet"
    description="Add the first location to start pairing registers to it."
    actions={locationActions}
  />
</Story>
