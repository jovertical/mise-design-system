<!-- `items` lets the closed trigger show the chosen label. -->
<script lang="ts">
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@jovertical/mise-design-system'

  const SHIFTS = [
    { value: 'day', label: 'Day shift' },
    { value: 'night', label: 'Night shift' },
    { value: 'weekend', label: 'Weekend shift' },
  ]

  let value = $state('day')
</script>

<Select bind:value items={SHIFTS}>
  <SelectTrigger class="max-w-xs" aria-label="Shift">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    {#each SHIFTS as shift (shift.value)}
      <SelectItem value={shift.value} label={shift.label} />
    {/each}
  </SelectContent>
</Select>
