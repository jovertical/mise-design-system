---
title: Tabs
description: Sections of one page, one shown at a time.
section: Navigation
order: 3
traits: [keyboard]
keywords: [tab, sections]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

The track is a wash, not a colour, so it darkens whatever it sits on: the page's `bg-muted` and a card's white alike.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'tabs-list', label: 'Track', part: 'TabsList', placement: 'left' },
  { slot: 'tabs-trigger', label: 'Trigger', part: 'TabsTrigger', placement: 'top' },
  { slot: 'tabs-content', label: 'Panel', part: 'TabsContent', placement: 'right' },
]} />

## Examples

### A disabled trigger

<Preview example={examples.disabled} />

### In a card header

<Preview example={examples['in-a-card-header']} />

## When to use

Sections of one page that a reader moves between: a record's details and its history. A filter or a view switch with no panels under it: `ToggleGroup`. The app's sections: `Sidebar`.

## API reference

<ApiTable component="Tabs" />

## Keyboard

| Key | Does |
| --- | --- |
| `Tab` | Moves into the track, then to the open panel |
| `ArrowLeft`, `ArrowRight` | Move between triggers and open them |
| `Home`, `End` | Move to the first or last trigger |
