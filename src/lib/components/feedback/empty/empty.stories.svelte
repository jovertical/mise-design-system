<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  // The React package has no Empty stories; EmptyState is the usual way in.
  // This one shows the parts, for a screen with more to say than EmptyState allows.
  import IconPackage from '@tabler/icons-svelte-runes/icons/package'

  import Button from '../../actions/button/button.svelte'
  import Empty from './empty.svelte'
  import EmptyContent from './empty-content.svelte'
  import EmptyDescription from './empty-description.svelte'
  import EmptyHeader from './empty-header.svelte'
  import EmptyMedia from './empty-media.svelte'
  import EmptyTitle from './empty-title.svelte'

  const { Story } = defineMeta({ title: 'Feedback/Empty', component: Empty, tags: ['shadcn'] })
</script>

<Story name="Playground">
  {#snippet template(args)}
    <Empty {...args}>
      <EmptyHeader>
        <EmptyMedia variant="icon"><IconPackage /></EmptyMedia>
        <EmptyTitle>No stock counted at Riverside</EmptyTitle>
        <EmptyDescription>
          Start a count to see on-hand quantities. <a href="#counts">How counts work</a>
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent class="flex-row justify-center gap-2">
        <Button variant="outline">Import counts</Button>
        <Button>Start a count</Button>
      </EmptyContent>
    </Empty>
  {/snippet}
</Story>
