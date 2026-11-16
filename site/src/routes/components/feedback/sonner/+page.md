---
title: Toaster
description: Short messages about what just happened, that leave on their own.
section: Feedback
order: 1
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

Render `Toaster` once in the root layout, then call `toast()` from anywhere. These docs do the same, so the toasts above appear where an app's would.

```svelte
<script>
  import { Toaster } from '@jovertical/mise-design-system'
</script>

<Toaster />
```

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { selector: '[data-sonner-toast]', label: 'Toast', placement: 'bottom' },
  { selector: '[data-icon]', label: 'Icon', placement: 'left' },
  { selector: '[data-title]', label: 'Title', placement: 'left' },
  { selector: '[data-description]', label: 'Description', placement: 'left' },
  { selector: '[data-button]', label: 'Action', placement: 'right' },
]} />

mise styles the toasts and follows the page's scheme; the parts themselves are [svelte-sonner](https://svelte-sonner.vercel.app)'s, so they are named by its attributes rather than a `data-slot`.

## Examples

### Types

Each type carries its icon and colour. Say what happened, in the past tense, about the thing it happened to.

<Preview example={examples.types} />

### With an action

`action` puts a button on the toast, for the one thing worth doing next: undo, view, retry.

<Preview example={examples['with-action']} />

### Following a promise

`toast.promise` shows one toast that moves from loading to success or error as the work ends.

<Preview example={examples.promise} />

## When to use

A toast reports something that already happened and needs nothing back. A message the reader must act on, or one that should stay, belongs in the page as an `Alert`.

## API reference

`Toaster` takes svelte-sonner's toaster props: `position`, `expand`, `richColors`, `closeButton`, `duration`, `id` and the rest. Without `theme` it follows the page's `.dark` class.

<ApiTable component="Toaster" />

### `toast()`

| Call | Shows |
| --- | --- |
| `toast(message, options?)` | A plain toast |
| `toast.success`, `toast.info`, `toast.warning`, `toast.error` | A toast of that type, with its icon |
| `toast.loading(message, options?)` | A spinner, until it is updated or dismissed |
| `toast.promise(promise, { loading, success, error })` | One toast that follows the promise |
| `toast.dismiss(id?)` | Removes one toast, or every toast |

Each returns the toast's id. The options:

| Option | Does |
| --- | --- |
| `description` | A second, quieter line |
| `action` | `{ label, onClick }`, a button on the toast |
| `cancel` | `{ label, onClick }`, a quieter second button |
| `duration` | Milliseconds before it leaves; `Number.POSITIVE_INFINITY` to stay |
| `id` | Reuse an id to update a toast in place |
| `toasterId` | Send it to the `Toaster` with that `id` |
