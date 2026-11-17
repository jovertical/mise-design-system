<!--
  A row you can click is a link or a button, never a div with an onclick:
  `href` renders it as an a, `child` as a button, so the whole row is the
  target and the keyboard reaches it.
-->
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
  } from '@jovertical/mise-design-system'
  import IconChevronRight from '@tabler/icons-svelte-runes/icons/chevron-right'
  import IconDeviceMobile from '@tabler/icons-svelte-runes/icons/device-mobile'
  import IconServer from '@tabler/icons-svelte-runes/icons/server'
</script>

<ItemGroup class="w-96">
  <Item size="sm" href="#/registers/1">
    <ItemMedia variant="icon"><IconDeviceMobile /></ItemMedia>
    <ItemContent>
      <ItemTitle>Register 1</ItemTitle>
      <ItemDescription>Opens its page: a link, because it navigates.</ItemDescription>
    </ItemContent>
    <ItemActions><IconChevronRight class="text-muted-foreground size-4" /></ItemActions>
  </Item>
  <ItemSeparator />
  <Item size="sm">
    {#snippet child({ props })}
      <button type="button" {...props}>
        <ItemMedia variant="icon"><IconServer /></ItemMedia>
        <ItemContent>
          <ItemTitle>Outpost server</ItemTitle>
          <ItemDescription>Opens a panel: a button, because it stays on the page.</ItemDescription>
        </ItemContent>
      </button>
    {/snippet}
  </Item>
</ItemGroup>
