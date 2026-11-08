<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import StoryAxis from '../../../../../stories/story-axis.svelte'
  import Button from '../../actions/button/button.svelte'
  import Drawer from './drawer.svelte'
  import DrawerClose from './drawer-close.svelte'
  import DrawerContent from './drawer-content.svelte'
  import DrawerDescription from './drawer-description.svelte'
  import DrawerFooter from './drawer-footer.svelte'
  import DrawerHeader from './drawer-header.svelte'
  import DrawerTitle from './drawer-title.svelte'
  import DrawerTrigger from './drawer-trigger.svelte'

  const { Story } = defineMeta({
    title: 'Overlays/Drawer',
    component: Drawer,
    tags: ['shadcn'],
    parameters: { layout: 'centered' },
    argTypes: {
      direction: { control: 'inline-radio', options: ['bottom', 'top', 'left', 'right'] },
    },
  })
</script>

<!--
  Slides from the bottom by default: the phone sheet. Neither portal is
  mobile-first, so this stays for the case a phone-width screen wants a bottom
  sheet rather than a centred `Dialog`.
-->
<Story name="Playground">
  {#snippet template(args)}
    <Drawer {...args}>
      <DrawerTrigger>
        {#snippet child({ props })}
          <Button variant="outline" {...props}>Filter</Button>
        {/snippet}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filter transfers</DrawerTitle>
          <DrawerDescription>Narrow the list by location and status.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Apply</Button>
          <DrawerClose>
            {#snippet child({ props })}
              <Button variant="outline" {...props}>Cancel</Button>
            {/snippet}
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  {/snippet}
</Story>

<!--
  Every direction. `right` is a side panel rather than a bottom sheet, for a
  quick view without leaving the list; only `bottom` draws the drag handle.
-->
<Story name="Sides" asChild>
  <StoryAxis values={['bottom', 'right', 'left', 'top'] as const}>
    {#snippet item(direction)}
      <Drawer {direction}>
        <DrawerTrigger>
          {#snippet child({ props })}
            <Button variant="outline" {...props}>Open from the {direction}</Button>
          {/snippet}
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Order OR-2041</DrawerTitle>
            <DrawerDescription>Quick view without leaving the list.</DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    {/snippet}
  </StoryAxis>
</Story>
