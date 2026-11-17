# Docs organisation, round A: metadata, sidebar, since, search — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every component page carries its sub-group, traits and keywords; the sidebar folds by section with sub-group headings; each component knows its origin and the release it arrived in; search matches keywords.

**Architecture:** Frontmatter is the source (`group`, `traits`, `keywords`), validated by `pages.test.ts` against `SUB_GROUPS` (in `navigation.ts`) and `TRAITS` (in `traits.ts`). `navSections()` returns mise's `SidebarNavSection[]` directly, with headings from piece 1. Origin is added to each folder by the `virtual:mise-api` plugin; since-versions are a committed `since.json` written by `site/scripts/since.ts` from the `v*` tags.

**Tech Stack:** as the docs site; `git` for the since walk.

**Spec:** `docs/specs/2026-11-17-docs-organisation-design.md` (sections 1 and 2, and "Search").

## Global Constraints

- Branch `docs/site-organisation`, stacked on `feat/sidebar-nav-headings` (the `SidebarNav` headings it needs); the user reviews both at the end, and the site's pull request merges after the feat's.
- Commits `docs(site)` or `docs`; nothing moves mise's version.
- Built only from mise; semantic tokens only; the clean-code guide holds.
- Gate by exit code before each commit: `pnpm test`, `pnpm build:storybook`, `pnpm --filter mise-docs test`; before the round ends, `pnpm build:pages && pnpm --filter mise-docs smoke`.
- Every commit ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Tasks

### Task 1: The vocabulary and the checks

- `site/src/modules/nav/data/traits.ts`: `TRAITS = ['keyboard', 'overlay', 'form control', 'draggable', 'server data'] as const`, `type Trait`, each with a one-line meaning (the spec's table) as JSDoc.
- `navigation.ts`: `PageMeta` gains `group?: string`, `traits?: string[]`, `keywords?: string[]`; `GUIDE_SECTIONS` (Getting started, Foundations) and `COMPONENT_SECTIONS` (mise's eight groups), `SECTIONS` their concatenation; `SUB_GROUPS: Record<string, string[]>` for Forms, Data display, Feedback and Layout, in the spec's order.
- `pages.test.ts` reads each component page's frontmatter (a small YAML read of the block between `---` lines) and checks: `group` present exactly where `SUB_GROUPS` has the section, and one of its values; every trait in `TRAITS`; keywords lowercase; every sub-group has a page.
- Backfill the frontmatter of the 94 pages from the spec's table (groups), the Keyboard sections and the spec's trait meanings (traits), and the words a reader would search for that title and description lack (keywords).
- Commit `docs(site): sub-groups, traits and keywords on every component page`.

### Task 2: The folding sidebar

- `navSections(pages): SidebarNavSection[]`: the guide sections as labelled runs of links; then one `Components` section whose items are an `Overview` link when `/components` exists, and one group per component section (no `href`, so the row toggles), its items the pages in `order`, preceded by `{ heading }` per sub-group where the section has them.
- `docs-sidebar.svelte` maps hrefs (also inside groups) through `resolve()`, gives each group its tabler icon for the icon rail, and passes `persistKey="mise-docs-nav"`.
- `navigation.test.ts`: guides flat; components grouped in mise order; headings in `SUB_GROUPS` order, each before its pages; a sub-grouped page without a `group` is a test failure upstream, not a crash here.
- Commit `docs(site): the sidebar folds by section, with sub-group headings`.

### Task 3: Origin and since

- `site/vite/mise-api.ts` adds `origin: 'shadcn' | 'mise'` to each folder, by the provenance rule (`shadcn` when the root component's `Origin:` line mentions `shadcn/ui`); `originOf(source)` is a tested pure function in `site/vite/origin.ts`.
- `site/scripts/since.ts` (`pnpm --filter mise-docs since`): for each `v*` tag in version order, the folder names under `src/lib/components/<group>/` (`git ls-tree -d --name-only`); `firstReleases(tags: { version: string; folders: string[] }[]): Record<string, string>` is the tested pure part. Writes `site/src/modules/docs/data/since.json`, sorted.
- `site/src/modules/docs/data/tags.ts`: `sinceOf(folder)` (a version or `null` for unreleased), `isNew(since, current)` (same major and minor as `__MISE_VERSION__`, or unreleased). Tests for both.
- `site/README.md`: run `since` after each release.
- Commit `docs(site): each component's origin, and the release it arrived in`.

### Task 4: Search, smoke, record

- The search palette's item value gains `group`, `traits` and `keywords`.
- `pnpm build:pages && pnpm --filter mise-docs smoke`; the handoff gains the organisation work.
- Commit `docs(site): search by keyword, trait and sub-group`.
