<script lang="ts">
  import IconBuildingWarehouse from '@tabler/icons-svelte-runes/icons/building-warehouse'

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
  <IconBuildingWarehouse />
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
