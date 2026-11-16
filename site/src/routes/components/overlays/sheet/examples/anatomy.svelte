<!--
  Open on the page, for the anatomy: no portal, so the panel slides in from
  the stage's edge, and none of its hold on the page.
-->
<script lang="ts">
  import {
    Button,
    FactList,
    FactListItem,
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
  } from '@jovertical/mise-design-system'
</script>

<Sheet open>
  <SheetContent
    portalProps={{ disabled: true }}
    onOpenAutoFocus={(event) => event.preventDefault()}
    trapFocus={false}
    preventScroll={false}
    interactOutsideBehavior="ignore"
    escapeKeydownBehavior="ignore"
  >
    <SheetHeader>
      <SheetTitle>Order OR-2041</SheetTitle>
      <SheetDescription>Bloom & Stem · placed 9 Jul</SheetDescription>
    </SheetHeader>
    <FactList class="px-4">
      <FactListItem label="Service" value="Express" />
      <FactListItem label="Total" value="$81.00" />
    </FactList>
    <SheetFooter><Button variant="outline">Close</Button></SheetFooter>
  </SheetContent>
</Sheet>
