<script module lang="ts">
  import FilterIcon from '@lucide/svelte/icons/funnel'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Button from '../../actions/button/button.svelte'
  import Input from '../../forms/input/input.svelte'
  import Label from '../../forms/label/label.svelte'
  import Popover from './popover.svelte'
  import PopoverContent from './popover-content.svelte'
  import PopoverTrigger from './popover-trigger.svelte'

  const { Story } = defineMeta({
    title: 'Overlays/Popover',
    component: Popover,
    tags: ['shadcn'],
    parameters: { layout: 'centered' },
  })

  const shortList = ['Shift opened', 'Stock count posted', 'Register paired']
  const longList = [
    'Shift opened',
    'Stock count posted',
    'Register paired',
    'Sync recovered',
    'Location created',
    'Order refunded',
  ]
</script>

<!--
  A popover carries no semantics of its own: it is a positioned panel, and
  whatever goes in it brings its own meaning. That is the difference between
  this and `DropdownMenu`, which is a menu of commands and says so to a screen
  reader.
-->
<Story name="Playground">
  {#snippet template(args)}
    <Popover {...args}>
      <PopoverTrigger>
        {#snippet child({ props })}
          <Button variant="outline" {...props}>Open</Button>
        {/snippet}
      </PopoverTrigger>
      <PopoverContent>
        <p class="text-muted-foreground">
          A panel. The padding and the width are the component's; the content is yours.
        </p>
      </PopoverContent>
    </Popover>
  {/snippet}
</Story>

<!--
  The form shape, and the one case that wants the reference's layout: add
  `flex flex-col gap-4` at the call site, as here.
-->
<Story name="As a form" asChild>
  <Popover>
    <PopoverTrigger>
      {#snippet child({ props })}
        <Button variant="outline" {...props}><FilterIcon />Filters</Button>
      {/snippet}
    </PopoverTrigger>
    <PopoverContent class="flex flex-col gap-4">
      <div class="grid gap-2">
        <Label for="min">Minimum</Label>
        <Input id="min" placeholder="0" />
      </div>
      <div class="grid gap-2">
        <Label for="max">Maximum</Label>
        <Input id="max" placeholder="100" />
      </div>
      <Button size="sm">Apply</Button>
    </PopoverContent>
  </Popover>
</Story>

<!--
  A short list, separated by space. `p-0` because a list panel owns its own
  padding: its rows run to the panel's edges. With no scroll, the header and
  footer need nothing drawn between them and the rows.
-->
<Story name="Short list" asChild>
  <Popover>
    <PopoverTrigger>
      {#snippet child({ props })}
        <Button variant="outline" {...props}>Notifications</Button>
      {/snippet}
    </PopoverTrigger>
    <PopoverContent class="w-80 p-0">
      <div class="px-4 pt-4 pb-2"><p class="font-medium">Notifications</p></div>
      <div class="max-h-64 overflow-y-auto">
        {#each shortList as title}
          <div class="px-4 py-3">
            <p class="text-sm font-medium">{title}</p>
            <p class="text-muted-foreground text-xs">a few minutes ago</p>
          </div>
        {/each}
      </div>
      <div class="px-2 pt-2 pb-3">
        <Button variant="ghost" size="sm" class="w-full text-xs">Show all</Button>
      </div>
    </PopoverContent>
  </Popover>
</Story>

<!--
  A list that scrolls, fenced with rules. Separate a popover's sections with
  space when its content fits, and with a rule when the middle scrolls under a
  fixed header or footer. A rule that fences nothing is decoration; space that
  fences a scroll boundary is a missing edge.
-->
<Story name="Scrolling list" asChild>
  <Popover>
    <PopoverTrigger>
      {#snippet child({ props })}
        <Button variant="outline" {...props}>Notifications</Button>
      {/snippet}
    </PopoverTrigger>
    <PopoverContent class="w-80 p-0">
      <div class="flex items-center justify-between border-b px-4 py-3">
        <p class="text-sm font-semibold">Notifications</p>
        <Button variant="ghost" size="sm" class="h-auto px-2 py-1 text-xs">Mark all read</Button>
      </div>
      <div class="max-h-48 overflow-y-auto">
        {#each longList as title}
          <div class="px-4 py-3">
            <p class="text-sm font-medium">{title}</p>
            <p class="text-muted-foreground text-xs">a few minutes ago</p>
          </div>
        {/each}
      </div>
      <div class="border-t p-2">
        <Button variant="ghost" size="sm" class="w-full text-xs">Show all</Button>
      </div>
    </PopoverContent>
  </Popover>
</Story>
