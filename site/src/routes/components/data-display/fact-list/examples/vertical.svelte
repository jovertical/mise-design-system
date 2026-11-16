<!--
  `vertical` stacks label and value, for a narrow column where a right-
  aligned value would truncate to nothing. It takes an `icon` for a fact that
  identifies, and `multiline` lets one long value wrap.
-->
<script lang="ts">
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    FactList,
    FactListItem,
  } from '@jovertical/mise-design-system'
  import IconBuildingWarehouse from '@tabler/icons-svelte-runes/icons/building-warehouse'
  import IconUser from '@tabler/icons-svelte-runes/icons/user'
</script>

{#snippet warehouse()}
  <IconBuildingWarehouse />
{/snippet}

{#snippet person()}
  <IconUser />
{/snippet}

<Card class="w-full max-w-xs">
  <CardHeader><CardTitle>Supplier</CardTitle></CardHeader>
  <CardContent>
    <FactList class="gap-4">
      <FactListItem
        orientation="vertical"
        icon={warehouse}
        label="Ships from"
        value="North Mill, Riverside"
      />
      <FactListItem orientation="vertical" icon={person} label="Contact" value="Ana Cruz" />
      <FactListItem
        orientation="vertical"
        multiline
        label="Notes"
        value="Delivers Tuesdays and Fridays before 07:00. Call ahead for orders over 40 sacks."
      />
    </FactList>
  </CardContent>
</Card>
