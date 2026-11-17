---
title: Command
description: A filterable, keyboard-navigable list of commands, inline or as a palette.
section: Actions
order: 3
traits: [keyboard, overlay]
keywords: [command palette, search, spotlight, cmdk]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

`Command` filters its items as you type and moves through them with the arrow keys. Bare, it is an inline picker; `CommandDialog` puts the same parts in a dialog for a palette, and `CommandTrigger` is the search field that opens it. The ⌘K search in these docs' header is one.

## Anatomy

<Anatomy example={examples.anatomy} size="lg" parts={[
  { slot: 'command', label: 'Command', part: 'Command', placement: 'top' },
  { slot: 'command-input-wrapper', label: 'Search', part: 'CommandInput', placement: 'left' },
  { slot: 'command-item', label: 'Item', part: 'CommandItem', placement: 'left' },
  { slot: 'command-shortcut', label: 'Shortcut', part: 'CommandShortcut', placement: 'right' },
  { slot: 'command-separator', label: 'Separator', part: 'CommandSeparator', placement: 'right' },
]} />

## Examples

### A palette

<Preview example={examples.palette} />

### Triggers

<Preview example={examples.triggers} />

## When to use

Search across an app's screens and records, or a long list of commands someone will type to find. A few actions on a row: `DropdownMenu`. Picking a value for a form field: `Combobox`.

## API reference

<ApiTable component="Command" />

## Keyboard

| Key | Does |
| --- | --- |
| `⌘K`, `Ctrl` + `K` | Opens the palette, from a `CommandTrigger` with its default `hotkey` |
| Typing | Filters the items |
| `ArrowUp`, `ArrowDown` | Move through the items |
| `Enter` | Runs the highlighted item |
| `Esc` | Closes a palette |
