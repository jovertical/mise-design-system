<!-- One column of chips is one shape; `sm` beside a label and a value is the common case. -->
<script lang="ts">
  import { IconChip } from '@jovertical/mise-design-system'
  import IconBuildingWarehouse from '@tabler/icons-svelte-runes/icons/building-warehouse'
  import IconCalendar from '@tabler/icons-svelte-runes/icons/calendar'
  import IconUser from '@tabler/icons-svelte-runes/icons/user'

  const FACTS = [
    { icon: IconBuildingWarehouse, label: 'Location', value: 'Riverside' },
    { icon: IconUser, label: 'Counted by', value: 'Ana Cruz' },
    { icon: IconCalendar, label: 'Date counted', value: '16 Jul 2026' },
  ]
</script>

<div class="flex max-w-xs flex-col gap-4">
  {#each FACTS as fact (fact.label)}
    <div class="flex items-center gap-3">
      <IconChip><fact.icon /></IconChip>
      <div class="flex min-w-0 flex-col">
        <span class="text-muted-foreground text-xs">{fact.label}</span>
        <span class="truncate text-sm font-medium">{fact.value}</span>
      </div>
    </div>
  {/each}
</div>
