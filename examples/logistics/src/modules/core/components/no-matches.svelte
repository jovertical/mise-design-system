<!-- What a filtered table shows when nothing matches: say so, and say how to widen it. -->
<script lang="ts">
  import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@jovertical/mise-design-system'

  let { things, hint = 'Clear the search or the filters.' }: { things: string; hint?: string } =
    $props()
</script>

<Empty>
  <EmptyHeader>
    <EmptyTitle>No {things} match</EmptyTitle>
    <EmptyDescription>{hint}</EmptyDescription>
  </EmptyHeader>
</Empty>
