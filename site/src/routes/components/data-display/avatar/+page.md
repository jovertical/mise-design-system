---
title: Avatar
description: A person's picture or initials, with whether they are here.
section: Data display
order: 6
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

`<AvatarImage src alt />` inside an `Avatar` shows a picture, with the `AvatarFallback`'s initials while it loads or if it fails.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'avatar', label: 'Avatar', part: 'Avatar', placement: 'left' },
  { slot: 'avatar-fallback', label: 'Initials', part: 'AvatarFallback', placement: 'top' },
  { slot: 'presence-dot', label: 'Presence', part: 'PresenceDot', placement: 'right' },
]} />

## Examples

### Who is here

<Preview example={examples.presence} />

## When to use

A person beside their name: a staff list, who counted, who has a record open. A person with a line about them, as one unit: `EntityLabel` with the avatar as its `media`.

## API reference

<ApiTable component="Avatar" />
