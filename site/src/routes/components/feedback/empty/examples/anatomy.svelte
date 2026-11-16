<!-- For the anatomy. -->
<script lang="ts">
  import {
    Button,
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
  } from '@jovertical/mise-design-system'
  import IconPackage from '@tabler/icons-svelte-runes/icons/package'
</script>

<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon"><IconPackage /></EmptyMedia>
    <EmptyTitle>No stock counted at Riverside</EmptyTitle>
    <EmptyDescription>
      Start a count to see on-hand quantities. <a href="#/counts">How counts work</a>
    </EmptyDescription>
  </EmptyHeader>
  <EmptyContent class="flex-row justify-center gap-2">
    <Button variant="outline">Import counts</Button>
    <Button>Start a count</Button>
  </EmptyContent>
</Empty>
