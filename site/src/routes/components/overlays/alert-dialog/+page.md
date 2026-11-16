---
title: AlertDialog
description: An "are you sure?" that makes the reader choose before something hard to undo.
section: Overlays
order: 2
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

Unlike `Dialog`, it does not close on an outside click: the reader must choose `AlertDialogCancel` or `AlertDialogAction`. The action names what happens ("Close location", not "OK"), and a destructive one takes `tone="critical"`.

## Anatomy

<Anatomy example={examples.anatomy} size="lg" parts={[
  { slot: 'alert-dialog-overlay', label: 'Backdrop', part: 'AlertDialogOverlay', placement: 'top' },
  { slot: 'alert-dialog-content', label: 'Content', part: 'AlertDialogContent', placement: 'bottom' },
  { slot: 'alert-dialog-title', label: 'Title', part: 'AlertDialogTitle', placement: 'left' },
  { slot: 'alert-dialog-description', label: 'Description', part: 'AlertDialogDescription', placement: 'left' },
  { slot: 'alert-dialog-cancel', label: 'Cancel', part: 'AlertDialogCancel', placement: 'left' },
  { slot: 'alert-dialog-action', label: 'Action', part: 'AlertDialogAction', placement: 'right' },
]} />

## Examples

### Small, with no description

<Preview example={examples.small} />

## When to use

Before an action that is destructive or hard to undo: closing a location, cancelling an order, discarding a draft. A task in a window: `Dialog`.

## API reference

<ApiTable component="AlertDialog" />

## Keyboard

| Key | Does |
| --- | --- |
| `Tab` | Moves between Cancel and the action, never out of the dialog |
| `Esc` | Cancels |
| `Enter` | Runs the focused button |
