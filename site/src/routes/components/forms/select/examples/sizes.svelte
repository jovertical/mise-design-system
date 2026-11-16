<!-- `size="sm"` for a select in a dense row: a table cell, a toolbar. -->
<script lang="ts">
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@jovertical/mise-design-system'

  const CHANNELS = [
    { value: 'all', label: 'All channels' },
    { value: 'counter', label: 'Counter' },
    { value: 'online', label: 'Online' },
  ]

  const SIZES = ['sm', 'md'] as const
</script>

{#each SIZES as size (size)}
  <Select value="all" items={CHANNELS}>
    <SelectTrigger {size} class="w-40" aria-label="Channel, {size}">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {#each CHANNELS as channel (channel.value)}
        <SelectItem value={channel.value} label={channel.label} />
      {/each}
    </SelectContent>
  </Select>
{/each}
