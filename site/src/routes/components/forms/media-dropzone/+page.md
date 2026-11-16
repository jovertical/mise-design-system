---
title: MediaDropzone
description: One image, dropped or chosen, uploaded through the app's own adapter.
section: Forms
order: 24
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

mise makes no request, holds no token and knows no URL. The app passes an `adapter` that does all three: `upload` sends a file and resolves to a `MediaAsset`, and `ready` stays false while a token is still resolving. Bind `value` to the asset.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'media-dropzone', label: 'Dropzone', part: 'MediaDropzone', placement: 'top' },
  { slot: 'media-dropzone-zone', label: 'Zone', placement: 'left' },
  { slot: 'media-dropzone-preview', label: 'Preview panel', placement: 'right' },
]} />

## Examples

### With the preview panel

<Preview example={examples['with-preview']} />

### Failing, and not ready

<Preview example={examples.failing} />

## When to use

An image that belongs to a record: a logo, a product photo, a profile picture. `linkMode` says when it attaches: `immediate` on an edit page, `deferred` on a create page, where the form reconciles on submit.

## API reference

<ApiTable component="MediaDropzone" />
