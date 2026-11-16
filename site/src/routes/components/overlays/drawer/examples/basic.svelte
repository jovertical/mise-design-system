<!-- Slides up from the bottom by default: the phone sheet, for a short task on a narrow screen. -->
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
  } from '@jovertical/mise-design-system'
</script>

<Drawer>
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
