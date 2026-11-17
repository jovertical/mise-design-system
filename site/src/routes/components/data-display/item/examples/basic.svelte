<!--
  A list row, not a menu row: media, a title, a description and its own
  actions, in an ItemGroup, which is a role="list". A device list or a
  notification feed is this.
-->
<script lang="ts">
  import {
    Button,
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemMedia,
    ItemSeparator,
    ItemTitle,
  } from '@jovertical/mise-design-system'
  import IconAlertTriangle from '@tabler/icons-svelte-runes/icons/alert-triangle'
  import IconDeviceMobile from '@tabler/icons-svelte-runes/icons/device-mobile'
</script>

<ItemGroup class="w-full max-w-lg">
  <Item size="sm">
    <ItemMedia variant="icon"><IconDeviceMobile /></ItemMedia>
    <ItemContent>
      <ItemTitle>Register 1</ItemTitle>
      <ItemDescription>Synced 2 minutes ago</ItemDescription>
    </ItemContent>
    <ItemActions><Button variant="ghost" size="sm">Manage</Button></ItemActions>
  </Item>
  <ItemSeparator />
  <Item size="sm">
    <ItemMedia variant="icon" tone="warning"><IconAlertTriangle /></ItemMedia>
    <ItemContent>
      <ItemTitle>Register 2</ItemTitle>
      <ItemDescription>Not seen for 3 days</ItemDescription>
    </ItemContent>
    <ItemActions><Button variant="ghost" size="sm">Manage</Button></ItemActions>
  </Item>
</ItemGroup>
