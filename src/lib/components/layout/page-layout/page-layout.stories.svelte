<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Card from '../card/card.svelte'
  import CardContent from '../card/card-content.svelte'
  import CardHeader from '../card/card-header.svelte'
  import CardTitle from '../card/card-title.svelte'
  import PageLayout from './page-layout.svelte'

  const { Story } = defineMeta({
    title: 'Layout/PageLayout',
    component: PageLayout,
    tags: ['mise'],
    parameters: { layout: 'fullscreen' },
  })
</script>

<!--
  The gutter narrows below `lg` and the gap tightens below `md`. Resize the
  canvas rather than reading the classes: no route has to know the breakpoints.
-->
<Story name="Playground">
  {#snippet template(args)}
    <PageLayout {...args}>
      <Card>
        <CardHeader><CardTitle>First card</CardTitle></CardHeader>
        <CardContent class="text-muted-foreground text-sm">
          Page content sits in a single padded column.
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Second card</CardTitle></CardHeader>
        <CardContent class="text-muted-foreground text-sm">
          The gap between siblings comes from the layout, not from the cards.
        </CardContent>
      </Card>
    </PageLayout>
  {/snippet}
</Story>
