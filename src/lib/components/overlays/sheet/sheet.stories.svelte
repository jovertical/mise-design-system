<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import StoryAxis from '../../../../../stories/story-axis.svelte'

  import Button from '../../actions/button/button.svelte'
  import Sheet from './sheet.svelte'
  import SheetClose from './sheet-close.svelte'
  import SheetContent from './sheet-content.svelte'
  import SheetDescription from './sheet-description.svelte'
  import SheetFooter from './sheet-footer.svelte'
  import SheetHeader from './sheet-header.svelte'
  import SheetTitle from './sheet-title.svelte'
  import SheetTrigger from './sheet-trigger.svelte'

  const { Story } = defineMeta({
    title: 'Overlays/Sheet',
    component: Sheet,
    tags: ['shadcn'],
    parameters: { layout: 'centered' },
  })
</script>

<!--
  A panel anchored to the viewport's edge, `side="right"` by default: the
  desktop side panel, for a quick view without leaving the list.
-->
<Story name="Playground">
  {#snippet template(args)}
    <Sheet {...args}>
      <SheetTrigger>
        {#snippet child({ props })}
          <Button variant="outline" {...props}>Open panel</Button>
        {/snippet}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Order 2041</SheetTitle>
          <SheetDescription>Quick view without leaving the list.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose>
            {#snippet child({ props })}
              <Button variant="outline" {...props}>Close</Button>
            {/snippet}
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  {/snippet}
</Story>

<!--
  Every `side`. `left` holds navigation or filters; `top` and `bottom` span the
  viewport's width, for a short task on a narrow screen.
-->
<Story name="Sides" asChild>
  <StoryAxis values={['right', 'left', 'top', 'bottom'] as const}>
    {#snippet item(side)}
      <Sheet>
        <SheetTrigger>
          {#snippet child({ props })}
            <Button variant="outline" {...props}>Open from the {side}</Button>
          {/snippet}
        </SheetTrigger>
        <SheetContent {side}>
          <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
        </SheetContent>
      </Sheet>
    {/snippet}
  </StoryAxis>
</Story>
