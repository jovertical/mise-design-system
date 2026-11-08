<script lang="ts">
  import WarehouseIcon from '@lucide/svelte/icons/warehouse'

  import { FactList, FactListItem } from '../../src/lib/index.js'

  let {
    orientation,
    withIcon = false,
    compact = false,
    value = 'Riverside',
    multiline = false,
  }: {
    orientation?: 'horizontal' | 'vertical'
    withIcon?: boolean
    compact?: boolean
    value?: string | null
    multiline?: boolean
  } = $props()
</script>

{#snippet icon()}
  <WarehouseIcon />
{/snippet}

<FactList {compact}>
  <FactListItem
    {orientation}
    label="Location"
    {value}
    {multiline}
    icon={withIcon ? icon : undefined}
    valueClass="text-success"
  />
</FactList>
