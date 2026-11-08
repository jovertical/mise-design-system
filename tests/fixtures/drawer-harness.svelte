<script lang="ts">
  import {
    Button,
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from '../../src/lib/index.js'

  let {
    open = $bindable(false),
    direction,
  }: { open?: boolean; direction?: 'top' | 'bottom' | 'left' | 'right' } = $props()
</script>

<Drawer bind:open {direction}>
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
      <DrawerClose>
        {#snippet child({ props })}
          <Button variant="outline" {...props}>Cancel</Button>
        {/snippet}
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
<output data-testid="open">{open ? 'open' : 'closed'}</output>
