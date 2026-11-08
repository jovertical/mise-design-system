<script lang="ts">
  import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemMedia,
    ItemSeparator,
    ItemTitle,
  } from '../../src/lib/index.js'
</script>

<ItemGroup>
  <Item size="sm">
    <ItemMedia variant="icon" tone="warning"><span>!</span></ItemMedia>
    <ItemContent>
      <ItemTitle>Register 2</ItemTitle>
      <ItemDescription>Not seen for 3 days</ItemDescription>
    </ItemContent>
    <ItemActions><button type="button">Manage</button></ItemActions>
  </Item>
  <ItemSeparator />
  <Item size="sm" href="#device">
    <ItemContent><ItemTitle>Register 1</ItemTitle></ItemContent>
  </Item>
  <Item size="sm">
    {#snippet child({ props })}
      <button type="button" {...props}>Open settings</button>
    {/snippet}
  </Item>
</ItemGroup>
