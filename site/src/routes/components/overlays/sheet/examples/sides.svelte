<!-- `left` holds navigation or filters; `top` and `bottom` span the width, for a short task on a narrow screen. -->
<script lang="ts">
  import {
    Button,
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from '@jovertical/mise-design-system'

  const SIDES = ['right', 'left', 'top', 'bottom'] as const
</script>

{#each SIDES as side (side)}
  <Sheet>
    <SheetTrigger>
      {#snippet child({ props })}
        <Button variant="outline" {...props}>From the {side}</Button>
      {/snippet}
    </SheetTrigger>
    <SheetContent {side}>
      <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
    </SheetContent>
  </Sheet>
{/each}
