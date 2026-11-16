---
title: Skeleton
description: A placeholder in the shape of what is loading.
section: Feedback
order: 8
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

It takes its size from `class`. Components that load their own content already draw their skeletons: `DataTable` while `isLoading`, for one. Reach for it bare where mise has not drawn the shape for you.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'skeleton', label: 'Skeleton', part: 'Skeleton', placement: 'left' },
]} />

## When to use

A panel whose shape is known before its content arrives. An unknown shape: `LoadingState`. A busy control: `Spinner`.

## API reference

<ApiTable component="Skeleton" />
