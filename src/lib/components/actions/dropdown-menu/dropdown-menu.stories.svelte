<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import IconDots from '@tabler/icons-svelte-runes/icons/dots'

  import Button from '../button/button.svelte'
  import DropdownMenu from './dropdown-menu.svelte'
  import DropdownMenuCheckboxItem from './dropdown-menu-checkbox-item.svelte'
  import DropdownMenuContent from './dropdown-menu-content.svelte'
  import DropdownMenuGroup from './dropdown-menu-group.svelte'
  import DropdownMenuItem from './dropdown-menu-item.svelte'
  import DropdownMenuLabel from './dropdown-menu-label.svelte'
  import DropdownMenuRadioGroup from './dropdown-menu-radio-group.svelte'
  import DropdownMenuRadioItem from './dropdown-menu-radio-item.svelte'
  import DropdownMenuSeparator from './dropdown-menu-separator.svelte'
  import DropdownMenuShortcut from './dropdown-menu-shortcut.svelte'
  import DropdownMenuSub from './dropdown-menu-sub.svelte'
  import DropdownMenuSubContent from './dropdown-menu-sub-content.svelte'
  import DropdownMenuSubTrigger from './dropdown-menu-sub-trigger.svelte'
  import DropdownMenuTrigger from './dropdown-menu-trigger.svelte'

  const { Story } = defineMeta({
    title: 'Actions/DropdownMenu',
    component: DropdownMenu,
    tags: ['shadcn'],
    parameters: { layout: 'centered' },
  })
</script>

<!--
  A menu of commands, and that word is the whole distinction from `Popover`. It
  renders `role="menu"` with `menuitem` children, moves focus with the arrow
  keys, and closes when something is chosen. If the rows are not commands, it
  is a list in a `Popover`, not a menu.
-->
<Story name="Playground">
  {#snippet template(args)}
    <DropdownMenu {...args}>
      <DropdownMenuTrigger>
        {#snippet child({ props })}
          <Button variant="outline" size="sm" {...props}>Actions</Button>
        {/snippet}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          Edit
          <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem tone="critical">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  {/snippet}
</Story>

<!--
  Every row kind at once: items, a label, checkboxes, radios and a submenu.
  They share one treatment: `min-h-7`, `gap-2`, `px-2 py-1.5`, `rounded-xl`.
  The minimum height keeps a row of plain text the same height as one carrying
  a control.
-->
<Story name="Every row kind" asChild>
  <DropdownMenu>
    <DropdownMenuTrigger>
      {#snippet child({ props })}
        <Button variant="ghost" iconOnly aria-label="More" {...props}><IconDots /></Button>
      {/snippet}
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-56">
      <DropdownMenuLabel>View</DropdownMenuLabel>
      <DropdownMenuGroup>
        <DropdownMenuCheckboxItem checked>Show archived</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Show drafts</DropdownMenuCheckboxItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuLabel>Sort by</DropdownMenuLabel>
      <DropdownMenuRadioGroup value="recent">
        <DropdownMenuRadioItem value="recent">Most recent</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
      <DropdownMenuSeparator />
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>Export</DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuItem>CSV</DropdownMenuItem>
          <DropdownMenuItem>JSON</DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </DropdownMenuContent>
  </DropdownMenu>
</Story>

<!--
  `tone="critical"` colours the row and its glyph, and tints on highlight
  rather than filling. The command that cannot be undone should look different
  before it is chosen, not after.
-->
<Story name="Destructive" asChild>
  <DropdownMenu>
    <DropdownMenuTrigger>
      {#snippet child({ props })}
        <Button variant="outline" size="sm" {...props}>Manage</Button>
      {/snippet}
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem>Rename</DropdownMenuItem>
      <DropdownMenuItem>Move</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem tone="critical">Delete permanently</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</Story>
