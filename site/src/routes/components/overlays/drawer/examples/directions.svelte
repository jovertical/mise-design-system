<!-- `right` is a side panel rather than a bottom sheet; only `bottom` draws the drag handle. -->
<script lang="ts">
  import {
    Button,
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from '@jovertical/mise-design-system'

  const DIRECTIONS = ['bottom', 'right', 'left', 'top'] as const
</script>

{#each DIRECTIONS as direction (direction)}
  <Drawer {direction}>
    <DrawerTrigger>
      {#snippet child({ props })}
        <Button variant="outline" {...props}>From the {direction}</Button>
      {/snippet}
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Order OR-2041</DrawerTitle>
        <DrawerDescription>Quick view without leaving the list.</DrawerDescription>
      </DrawerHeader>
    </DrawerContent>
  </Drawer>
{/each}
