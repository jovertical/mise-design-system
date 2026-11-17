---
title: NavigationProgress
description: A thin bar across the top of the window while a route loads.
section: Feedback
order: 10
group: Progress
keywords: [loading bar, route change]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

Render it once in the root layout and feed `pending` from the router: in SvelteKit, `pending={navigating.to !== null}` from `$app/state`, as the logistics demo does.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'navigation-progress', label: 'Bar', part: 'NavigationProgress', placement: 'bottom' },
]} />

## When to use

Any app with routes that can take a moment. A job's own progress: `Progress`. A panel waiting on data: `Skeleton` or `LoadingState`.

## API reference

<ApiTable component="NavigationProgress" />
