<!-- `sm` for a dense row or a table cell, `md` everywhere else, `lg` beside large buttons. -->
<script lang="ts">
  import { Input } from '@jovertical/mise-design-system'

  const SIZES = ['sm', 'md', 'lg'] as const
</script>

<div class="flex w-full max-w-xs flex-col gap-3">
  {#each SIZES as size (size)}
    <Input {size} placeholder="Order number, {size}" aria-label="Order number, {size}" />
  {/each}
</div>
