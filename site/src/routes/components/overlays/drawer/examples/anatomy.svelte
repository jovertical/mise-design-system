<!--
  Open on the page, for the anatomy: no portal, not modal, and no styles on
  the body, so it leaves the page alone; the box's transform makes it the
  drawer's containing block, at a phone's width.
-->
<script lang="ts">
  import {
    Button,
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
  } from '@jovertical/mise-design-system'
</script>

<div class="bg-muted h-80 w-[26rem] overflow-hidden rounded-xl border [transform:translateZ(0)]">
  <Drawer open modal={false} noBodyStyles>
    <DrawerContent
      portalProps={{ disabled: true }}
      onOpenAutoFocus={(event) => event.preventDefault()}
    >
      <DrawerHeader>
        <DrawerTitle>Filter transfers</DrawerTitle>
        <DrawerDescription>Narrow the list by location and status.</DrawerDescription>
      </DrawerHeader>
      <DrawerFooter><Button>Apply</Button></DrawerFooter>
    </DrawerContent>
  </Drawer>
</div>
