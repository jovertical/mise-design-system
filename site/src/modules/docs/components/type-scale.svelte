<!-- Every Heading and Text size, drawn by the components themselves. -->
<script lang="ts">
  import { Heading, Text } from '@jovertical/mise-design-system'

  const HEADINGS = ['lg', 'md', 'sm'] as const
  const TEXTS = ['sm', 'xs'] as const
</script>

<div class="not-prose my-6 flex flex-col divide-y rounded-2xl border">
  {#each HEADINGS as size (size)}
    <div class="flex items-baseline justify-between gap-4 px-4 py-3">
      <Heading as="h4" {size}>Stock on hand at Riverside</Heading>
      <code class="text-muted-foreground shrink-0 text-xs">Heading size="{size}"</code>
    </div>
  {/each}
  {#each TEXTS as size (size)}
    <div class="flex items-baseline justify-between gap-4 px-4 py-3">
      <Text {size}>Shift closes at 22:00; late orders move to tomorrow.</Text>
      <code class="text-muted-foreground shrink-0 text-xs">Text size="{size}"</code>
    </div>
  {/each}
</div>
