# Docs organisation, round B: the overview, the rail's tags, the eyebrow — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A `/components` page lists every component by section and sub-group, filterable by origin, newness and trait; a component page shows its tags in the right rail and its sub-group in the eyebrow.

**Architecture:** A new `modules/overview` holds the pure parts (`data/entries.ts` joins pages, mise's API data and `since.json` into one entry per component; `utils/filter.ts` filters and reads tags from a URL) and the overview's components. The rail's tags read the same entries. The overview page is `routes/components/+page.md`, so the sidebar's Overview row appears on its own.

**Tech Stack:** as round A.

**Spec:** `docs/specs/2026-11-17-docs-organisation-design.md` (section 3).

## Global Constraints

As round A. Built only from mise parts: `Input`, `ToggleGroup`, `Table`, `Badge`, `EmptyState`, `Button`.

## Tasks

### Task 1: Entries and the filter

- `modules/overview/data/entries.ts`: `ComponentEntry` (`title`, `href`, `description`, `section`, `group`, `origin`, `since`, `isNew`, `traits`, `keywords`); `componentEntries(pages, docs, releases, current)`, the folder being the href's last segment; `entryAt(href)` over the site's own data for the rail; `sectionsOf(entries)`, the entries in `COMPONENT_SECTIONS` and `SUB_GROUPS` order.
- `modules/overview/utils/filter.ts`: `FILTER_TAGS` (`shadcn`, `mise`, `new`, then `TRAITS`), `matchesTag`, `filterEntries(entries, query, tags)` (tags with AND, the query against `searchTextOf`), `tagsFrom(params)` (known tags only), `overviewHref(tag)`.
- Tests for each, then commit `docs(site): component entries and the overview's filter`.

### Task 2: The overview page

- `modules/overview/components/component-index.svelte`: the `Input`, the multiple `ToggleGroup` of `FILTER_TAGS`, then per section an `h2` (with an id, for the rail) and per sub-group a `component-table.svelte` (name link, description, tags as `Badge`s); an `EmptyState` with "Clear filters" when nothing matches. Reads `?tag=` in the browser after it loads and writes it back with `replaceState`.
- `routes/components/+page.md`: title Components, a description, the index.
- The page tests that walk component pages skip the overview (it is not a component page).
- Smoke: `/components` in both schemes.
- Commit `docs(site): the components overview`.

### Task 3: The rail's tags and the eyebrow

- `modules/shell/components/page-tags.svelte`: for a component page, its origin, `since 1.x` or `Unreleased` (with `New` beside it when new), and its traits, each a `Badge` linking to the filtered overview; in `on-this-page.svelte` above "On this page".
- `page-layout.svelte` takes `group`; the eyebrow is "Forms · Text input" where there is one.
- Smoke, the handoff; commit `docs(site): a component page's tags in the rail, its sub-group in the eyebrow`.
