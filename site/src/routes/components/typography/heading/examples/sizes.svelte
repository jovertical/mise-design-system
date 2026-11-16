<!-- `sm` is a card's title, `md` a dialog's, `lg` a section opening a page body. -->
<script lang="ts">
  import { Heading } from '@jovertical/mise-design-system'

  const SIZES = ['lg', 'md', 'sm'] as const
</script>

<div class="flex flex-col gap-3">
  {#each SIZES as size (size)}
    <Heading as="h3" {size}>Purchasing, {size}</Heading>
  {/each}
</div>
