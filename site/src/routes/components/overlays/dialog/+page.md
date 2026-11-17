---
title: Dialog
description: A task in a window over the page, holding focus until it is answered or dismissed.
section: Overlays
order: 1
traits: [keyboard, overlay]
keywords: [modal, popup]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

The screen owns `open` and binds it. Most dialogs open from something other than a button beside them, a row action or a shortcut, so `DialogTrigger` is for the rare dialog that only a button opens.

## Anatomy

<Anatomy example={examples.anatomy} size="lg" parts={[
  { slot: 'dialog-overlay', label: 'Backdrop', part: 'DialogOverlay', placement: 'top' },
  { slot: 'dialog-content', label: 'Content', part: 'DialogContent', placement: 'bottom' },
  { slot: 'dialog-header', label: 'Header', part: 'DialogHeader', placement: 'left' },
  { slot: 'dialog-title', label: 'Title', part: 'DialogTitle', placement: 'left' },
  { slot: 'dialog-description', label: 'Description', part: 'DialogDescription', placement: 'left' },
  { slot: 'dialog-footer', label: 'Footer', part: 'DialogFooter', placement: 'right' },
  { slot: 'dialog-close', label: 'Close button', placement: 'right' },
]} />

`DialogContent` brings the backdrop and the close button itself; a dialog is `Dialog`, `DialogContent`, and the header, body and footer inside it.

## Examples

### With a form

Submit saves, then closes the dialog through the bound `open`. The dismiss button reads "Cancel", because closing discards what was typed.

<Preview example={examples['with-form']} />

### Sizes

`size` names four widths rather than each dialog carrying its own `max-w-*`. `lg` is the default.

<Preview example={examples.sizes} />

### Without a close button

For a surface that takes over rather than holding a task, like a search. Escape and an outside click still close it.

<Preview example={examples['without-close-button']} />

## When to use

A dialog holds one task the page waits on. To ask "are you sure?" before something that cannot be undone, use `AlertDialog`, which makes the reader choose. For a longer task beside the page, use `Sheet`.

## API reference

<ApiTable component="Dialog" />

## Keyboard

| Key | Does |
| --- | --- |
| `Esc` | Closes the dialog |
| `Tab`, `Shift` + `Tab` | Moves focus through the dialog, never out of it |

Focus moves into the dialog when it opens and back to what opened it when it closes.
