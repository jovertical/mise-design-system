<script lang="ts">
  import {
    Button,
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
  } from '@jovertical/mise-design-system'
  import IconDeviceMobile from '@tabler/icons-svelte-runes/icons/device-mobile'
</script>

<Item size="sm" variant="outline" class="w-[28rem]">
  <ItemMedia variant="icon"><IconDeviceMobile /></ItemMedia>
  <ItemContent>
    <ItemTitle>Register 1</ItemTitle>
    <ItemDescription>Synced 2 minutes ago</ItemDescription>
  </ItemContent>
  <ItemActions><Button variant="ghost" size="sm">Manage</Button></ItemActions>
</Item>
