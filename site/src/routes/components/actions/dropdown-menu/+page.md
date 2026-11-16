---
title: DropdownMenu
description: A menu of commands behind a trigger.
section: Actions
order: 2
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

"Commands" is the whole distinction from a `Popover`: a menu renders `role="menu"` with `menuitem` rows, moves focus with the arrow keys, and closes when something is chosen. The trigger takes a `Button` through its `child` snippet.

## Anatomy

<Anatomy example={examples.anatomy} size="lg" parts={[
  { slot: 'dropdown-menu-trigger', label: 'Trigger', part: 'DropdownMenuTrigger', placement: 'left' },
  { slot: 'dropdown-menu-content', label: 'Menu', part: 'DropdownMenuContent', placement: 'bottom' },
  { slot: 'dropdown-menu-label', label: 'Label', part: 'DropdownMenuLabel', placement: 'left' },
  { slot: 'dropdown-menu-shortcut', label: 'Shortcut', part: 'DropdownMenuShortcut', placement: 'right' },
  { slot: 'dropdown-menu-checkbox-item', label: 'Checkbox row', part: 'DropdownMenuCheckboxItem', placement: 'left' },
  { slot: 'dropdown-menu-separator', label: 'Separator', part: 'DropdownMenuSeparator', placement: 'right' },
]} />

## Examples

### Every row kind

<Preview example={examples['every-row-kind']} />

A row that cannot be undone takes `tone="critical"`, so it looks different before it is chosen, and goes last.

## When to use

Actions on a row or a page, more than fit as buttons. A row's actions at the end of a `DataTable` row: `DataTableRowActions`. A searchable list of commands: `Command`.

## API reference

<ApiTable component="DropdownMenu" />

## Keyboard

| Key | Does |
| --- | --- |
| `Enter`, `Space`, `ArrowDown` | Opens the menu from its trigger |
| `ArrowUp`, `ArrowDown` | Move through the rows |
| `ArrowRight`, `ArrowLeft` | Open and close a submenu |
| `Enter` | Runs the row |
| `Esc` | Closes the menu |
