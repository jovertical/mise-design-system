<!--
  The mdsvex layout every page goes through: its title, description and
  section from the frontmatter, then the page. mdsvex passes the page body
  as the default slot, which reaches a runes component as `children`.
-->
<script lang="ts">
  import { PageHeader } from '@jovertical/mise-design-system'
  import type { Snippet } from 'svelte'

  type PageLayoutProps = {
    title: string
    description?: string
    section?: string
    children: Snippet
  }

  let { title, description, section, children }: PageLayoutProps = $props()
</script>

<svelte:head>
  <title>{title === 'mise' ? 'mise' : `${title} · mise`}</title>
  {#if description}
    <meta name="description" content={description}>
  {/if}
</svelte:head>

<article data-docs-page class="docs-prose">
  <PageHeader {title} {description} eyebrow={section} />
  {@render children()}
</article>
