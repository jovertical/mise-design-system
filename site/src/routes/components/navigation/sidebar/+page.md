---
title: Sidebar
description: The app's main menu, in a panel beside the page that can collapse to icons.
section: Navigation
order: 1
traits: [keyboard]
keywords: [navigation, menu, nav]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.nav} />

`SidebarProvider` owns the open and collapsed state and the CSS variables the family reads; it wraps both `Sidebar`, the panel, and `SidebarInset`, the page beside it. Most apps draw the menu with `SidebarNav` from data, as these docs do: give it sections and the current path, and it lights the row and opens its group.

These examples sit in a box made the sidebar's containing block (`[transform:translateZ(0)]`); in an app the sidebar runs the height of the window.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'sidebar-wrapper', label: 'Provider', part: 'SidebarProvider', placement: 'top' },
  { slot: 'sidebar-container', label: 'Panel', part: 'Sidebar', placement: 'bottom' },
  { slot: 'sidebar-header', label: 'Header', part: 'SidebarHeader', placement: 'left' },
  { slot: 'sidebar-menu-item', label: 'Item', part: 'SidebarMenuItem', placement: 'left' },
  { slot: 'sidebar-menu-badge', label: 'Badge', part: 'SidebarMenuBadge', placement: 'right' },
  { slot: 'sidebar-footer', label: 'Footer', part: 'SidebarFooter', placement: 'left' },
  { slot: 'sidebar-rail', label: 'Rail', part: 'SidebarRail', placement: 'right' },
  { slot: 'sidebar-inset', label: 'Inset', part: 'SidebarInset', placement: 'right' },
  { slot: 'sidebar-trigger', label: 'Trigger', part: 'SidebarTrigger', placement: 'top' },
]} />

## Examples

### Composed by hand

For a menu `SidebarNav` does not draw, the parts compose it: a header, groups of menus with a label each, badges, a footer, and a rail along the edge that toggles the sidebar when clicked.

<Preview example={examples.composed} />

### Themes and shapes

`sidetheme` colours the panel once and every row follows; `variant` is its shape.

<Preview example={examples.themes} />

## When to use

The sidebar is the app's main menu, there on every page. For sections of one page, use `Tabs`; for where the reader is in a hierarchy, `Breadcrumb`.

## API reference

<ApiTable component="Sidebar" />

## Keyboard

| Key | Does |
| --- | --- |
| `⌘B`, `Ctrl` + `B` | Opens or collapses the sidebar |
| `Tab` | Moves through the rows; a group's row opens it with `Enter` or `Space` |

Every `SidebarProvider` listens for the shortcut on the window, so on this page `⌘B` toggles each example's sidebar along with the docs' own. Below the mobile breakpoint the sidebar opens as a sheet; these examples are drawn for a desktop width.
