<!--
  One section of a create or edit form: an icon-titled heading, a muted line
  saying what the section is for, then its fields. Every entity form uses it,
  so the sections read the same on every page.
-->
<script lang="ts">
  import { CardTitle, Text } from '@jovertical/mise-design-system'
  import type { Component, Snippet } from 'svelte'

  let {
    icon: Icon,
    title,
    hint,
    children,
  }: {
    /** A Lucide icon component, drawn in the heading's chip. */
    icon: Component
    title: string
    hint: string
    children: Snippet
  } = $props()
</script>

{#snippet glyph()}
  <Icon />
{/snippet}

<section class="flex flex-col gap-4">
  <div class="flex flex-col gap-1">
    <CardTitle icon={glyph} iconTone="primary">{title}</CardTitle>
    <Text as="p" size="sm" muted>{hint}</Text>
  </div>
  {@render children()}
</section>
