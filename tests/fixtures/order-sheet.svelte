<script lang="ts">
  import type { SheetSide } from '../../src/lib/index.js'
  import {
    Button,
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from '../../src/lib/index.js'

  let { open = $bindable(false), side }: { open?: boolean; side?: SheetSide } = $props()
</script>

<Sheet bind:open>
  <SheetTrigger>
    {#snippet child({ props })}
      <Button variant="outline" {...props}>Open panel</Button>
    {/snippet}
  </SheetTrigger>
  <SheetContent {side}>
    <SheetHeader>
      <SheetTitle>Order 2041</SheetTitle>
      <SheetDescription>Quick view without leaving the list.</SheetDescription>
    </SheetHeader>
    <SheetFooter>
      <SheetClose>
        {#snippet child({ props })}
          <Button variant="outline" {...props}>Done</Button>
        {/snippet}
      </SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>
<output data-testid="open">{open ? 'open' : 'closed'}</output>
