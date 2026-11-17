---
title: Button
description: An action a person takes, or a link that looks like one.
section: Actions
order: 1
traits: [keyboard]
keywords: [cta, link, submit, loading]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

With `href` it renders an `<a>`, so a button that goes somewhere is a real link.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'button', label: 'Button', part: 'Button', placement: 'top' },
  { slot: 'button-spinner', label: 'Loading spinner', placement: 'bottom' },
]} />

The label and any icon are the button's children; an icon sizes itself to the button.

## Examples

### Variants

`solid` is the page's main action, `soft` and `outline` the ones beside it, `ghost` a quiet one in a toolbar, and `link` an action that reads as a link. One solid button per decision.

<Preview example={examples.variants} />

### Tones

`tone` says what the action does to the work. It defaults to `primary` for `solid` and `link` and to `neutral` for the rest; `critical` is for something that cannot be taken back.

<Preview example={examples.tones} />

### Sizes

<Preview example={examples.sizes} />

### With an icon

<Preview example={examples['with-icon']} />

An `iconOnly` button is square and round, and needs an `aria-label`.

### Loading

`loading` shows a spinner before the label, sets `aria-busy`, and disables the button so a second press cannot repeat what the first started.

<Preview example={examples.loading} />

## API reference

<ApiTable component="Button" />

## Keyboard

| Key | Does |
| --- | --- |
| `Enter`, `Space` | Runs the action |
| `Tab` | Moves focus to the next control |
