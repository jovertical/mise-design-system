<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import IconArrowsExchange from '@tabler/icons-svelte-runes/icons/arrows-exchange'

  import Button from '../../actions/button/button.svelte'
  import Card from '../../layout/card/card.svelte'
  import CardContent from '../../layout/card/card-content.svelte'
  import CardDescription from '../../layout/card/card-description.svelte'
  import CardHeader from '../../layout/card/card-header.svelte'
  import CardTitle from '../../layout/card/card-title.svelte'
  import EmptyState from '../empty-state/empty-state.svelte'
  import Skeleton from '../skeleton/skeleton.svelte'
  import Spinner from '../spinner/spinner.svelte'
  import LoadingState from './loading-state.svelte'

  const { Story } = defineMeta({
    title: 'Feedback/LoadingState',
    component: LoadingState,
    tags: ['mise'],
  })
</script>

{#snippet movementsIcon()}
  <IconArrowsExchange />
{/snippet}
{#snippet backgroundAction()}
  <Button variant="outline">Continue in background</Button>
{/snippet}

<!--
  The default. `title` falls back to a bare "Loading", the signal that a screen
  has not been given its own wording yet.
-->
<Story name="Playground">
  {#snippet template(args)}
    <LoadingState {...args} />
  {/snippet}
</Story>

<!--
  Say what is being waited on and, where it matters, what has not happened yet.
  A wait long enough to render a panel for is long enough to explain.
-->
<Story name="With description" asChild>
  <LoadingState
    title="Reading the file"
    description="Working out its layout and which locations it refers to. Nothing has been written yet."
  />
</Story>

<!--
  A wait with a way out. Only worth offering when leaving is safe: a server-side
  job that survives the tab closing, not a form mid-submit.
-->
<Story name="With actions" asChild>
  <LoadingState
    title="Preparing the stock report"
    description="This runs on the server and reports back, so leaving will not cancel it."
    actions={backgroundAction}
  />
</Story>

<!--
  In a card, where both usually live. LoadingState and EmptyState occupy the same
  box, so a list that flips from one to the other does not move. The border is
  the only difference: dashed says nothing is coming, solid says something is.
-->
<Story name="In a card" asChild>
  <div class="grid gap-4 md:grid-cols-2">
    <Card>
      <CardHeader class="border-b">
        <CardTitle>Stock movements</CardTitle>
        <CardDescription>Every adjustment, transfer and sale for this item</CardDescription>
      </CardHeader>
      <CardContent><LoadingState title="Reading movements" /></CardContent>
    </Card>
    <Card>
      <CardHeader class="border-b">
        <CardTitle>Stock movements</CardTitle>
        <CardDescription>Every adjustment, transfer and sale for this item</CardDescription>
      </CardHeader>
      <CardContent>
        <EmptyState
          icon={movementsIcon}
          title="No movements yet"
          description="Movements appear here once this item is counted, transferred or sold."
        />
      </CardContent>
    </Card>
  </div>
</Story>

<!--
  Which loading treatment, and when. Prefer the treatment that preserves layout:
  a Skeleton where the shape is known, a Spinner inside the control that is busy,
  a captioned Spinner for an inline line, and LoadingState only where the shape of
  what is coming cannot be predicted.
-->
<Story name="Choosing a treatment" asChild>
  <div class="grid gap-4 md:grid-cols-2">
    <Card>
      <CardHeader><CardTitle>Known shape: Skeleton</CardTitle></CardHeader>
      <CardContent class="space-y-2">
        <Skeleton class="h-4 w-2/3" />
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-1/2" />
      </CardContent>
    </Card>
    <Card>
      <CardHeader><CardTitle>In a control: Spinner</CardTitle></CardHeader>
      <CardContent
        ><Button disabled><Spinner />Importing</Button></CardContent
      >
    </Card>
    <Card>
      <CardHeader><CardTitle>Inline caption: Spinner</CardTitle></CardHeader>
      <CardContent><Spinner>Checking stock at every location</Spinner></CardContent>
    </Card>
    <Card>
      <CardHeader><CardTitle>Shape unknown: LoadingState</CardTitle></CardHeader>
      <CardContent><LoadingState title="Reading the file" /></CardContent>
    </Card>
  </div>
</Story>
