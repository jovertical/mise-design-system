<!--
  The rail beside a page: a component page's tags, then its h2 and h3, which
  mdsvex gave ids (vite/markdown.ts). The headings are read from the page
  after it renders, again on each navigation. Wide screens only.
-->
<script lang="ts">
  import { Text } from '@jovertical/mise-design-system'
  import PageTags from '#modules/overview/components/page-tags.svelte'
  import { page } from '$app/state'

  type Entry = { id: string; text: string; level: number }

  let entries: Entry[] = $state([])

  $effect(() => {
    void page.url.pathname

    const headings = document.querySelectorAll<HTMLElement>(
      // The page's own headings only: an example's (a board column's title) has an id too.
      '[data-docs-page] > h2[id], [data-docs-page] > h3[id]',
    )

    entries = [...headings].map((heading) => ({
      id: heading.id,
      text: heading.textContent ?? '',
      level: heading.tagName === 'H3' ? 3 : 2,
    }))
  })
</script>

<aside class="sticky top-20 hidden w-48 shrink-0 self-start xl:block">
  <PageTags />
  {#if entries.length > 0}
    <nav aria-label="On this page">
      <Text size="sm" weight="medium">On this page</Text>
      <ul class="mt-3 flex flex-col gap-1.5 text-sm">
        {#each entries as entry (entry.id)}
          <li class={entry.level === 3 ? 'pl-3' : ''}>
            <a href="#{entry.id}" class="text-muted-foreground hover:text-foreground"
              >{entry.text}</a
            >
          </li>
        {/each}
      </ul>
    </nav>
  {/if}
</aside>
