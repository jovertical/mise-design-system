# mise docs

The documentation site for mise, published at
<https://jovertical.github.io/mise-design-system/> with the logistics demo at
`/demo/`. SvelteKit with adapter-static, every page prerendered, pages written
in Markdown through mdsvex. Like the logistics example it is built only from
mise and consumes the built package.

## Running it

```sh
pnpm dev:site            # from the repository root: mise's watcher and the site on :5190
pnpm --filter mise-docs test
```

To see it as GitHub Pages serves it, the demo included:

```sh
pnpm build:pages                          # mise, the docs, the demo, assembled in site/build
node --import tsx site/scripts/serve.ts   # http://localhost:5191/mise-design-system/
pnpm --filter mise-docs smoke             # every page in light and dark, plus a demo deep link
```

## Adding a component page

1. Create `src/routes/components/<group>/<name>/+page.md`, `<group>` and
   `<name>` as the component's folder in `src/lib/components/`. Its
   frontmatter gives `title`, `description`, `section` (the group's label, as
   in `src/modules/nav/data/navigation.ts`) and `order` within the section; the
   sidebar and the search palette pick it up from there.
2. Put each example in `examples/<name>.svelte` beside it. An example imports
   only from `@jovertical/mise-design-system` (and Tabler icons) and uses
   operations copy: locations, shifts, orders, stock.
3. In the page:

   ```svelte
   <script>
     import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
     import examples from './examples?examples'
   </script>

   <Preview example={examples.basic} />

   <Anatomy example={examples.anatomy} parts={[
     { slot: 'dialog-content', label: 'Content', part: 'DialogContent' },
   ]} />

   <ApiTable component="Dialog" />
   ```

   `examples['with-icon']` reaches a file whose name has a dash. An anatomy
   part names a `data-slot` the component renders; `part` links its legend row
   to that part's API table, and `placement` (`top` or `bottom`) gives a part
   that sits in a row a straight leader instead of one from the side.
4. `pnpm --filter mise-docs test` runs `tests/pages.test.ts`, which fails on
   an `ApiTable` naming something mise lacks, an anatomy slot mise never
   renders, a missing example, or a component page without an anatomy and an
   API table.

## How it fits together

- `vite/mise-api.ts` serves `componentDocs()` (from
  `scripts/skill/component-docs.ts`, the data the skill catalogue renders) as
  `virtual:mise-api`, so an API table cannot drift from the Props types.
- `vite/examples.ts` turns a page's `examples/` folder into components with
  their source, highlighted by Shiki at build, so the code a page shows is the
  code that runs and no highlighter reaches the browser.
- `vite/markdown.ts` puts the base path on Markdown links and ids on headings.
- Shiki's `css-variables` theme is mapped onto mise's semantic tokens in
  `src/app.css`, so code follows the theme and dark mode.
- `scripts/assemble-pages.ts` lays the docs and the demo out as one Pages
  site; the inline script in `src/app.html` hands a missed demo deep link from
  the root `404.html` to the demo.
