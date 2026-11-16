<!-- A panel at the viewport's edge, `right` by default: a quick view without leaving the list. -->
<script lang="ts">
  import {
    Button,
    FactList,
    FactListItem,
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from '@jovertical/mise-design-system'
</script>

<Sheet>
  <SheetTrigger>
    {#snippet child({ props })}
      <Button variant="outline" {...props}>Quick view</Button>
    {/snippet}
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Order OR-2041</SheetTitle>
      <SheetDescription>Bloom & Stem · placed 9 Jul</SheetDescription>
    </SheetHeader>
    <FactList class="px-4">
      <FactListItem label="Service" value="Express" />
      <FactListItem label="Ships from" value="Harbour Hub" />
      <FactListItem label="Total" value="$81.00" />
    </FactList>
    <SheetFooter>
      <SheetClose>
        {#snippet child({ props })}
          <Button variant="outline" {...props}>Close</Button>
        {/snippet}
      </SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>
