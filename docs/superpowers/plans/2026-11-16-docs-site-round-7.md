# Docs site, round 7: Layout — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline, as rounds 1–6). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pages for the ten Layout components: Card, CardGrid, CardList, AsideCard, SummaryCard, Collapsible, PageHeader, PageLayout, SiteHeader and Separator.

**Architecture:** Round 4's per-page steps (`docs/superpowers/plans/2026-11-16-docs-site-round-4.md`, "Every page, the same steps"). PageLayout and SiteHeader are page-sized: their examples sit in a bounded box, as the Sidebar page's do. Parts a component renders without a `data-slot` (AsideCard and SummaryCard render none of their own) are found by selector, checked by the smoke run.

**Spec:** `docs/specs/2026-11-10-docs-site-design.md`.

## Global Constraints

As round 6: branch `docs/site-round-7`; `docs(site)` and `docs` commits; built only from mise; semantic tokens; the clean-code guide; operations copy; descriptions with a colon quoted; the gate by exit code before each commit, and `pnpm build:pages && pnpm --filter mise-docs smoke` before the pull request; the attribution trailer.

## Sidebar order within Layout

PageLayout 1, PageHeader 2, SiteHeader 3, Card 4, CardGrid 5, CardList 6, AsideCard 7, SummaryCard 8, Collapsible 9, Separator 10.

## Tasks (one phase)

1. **Card** (Variants, With action, With footer, With muted footer, With icon, With tinted icon, With hint, Content only, Bleed footer link, As a list, Progress panel).
2. **CardGrid** (Categorised totals) and **CardList** (With item rows, Compact rows, Metric bar rows).
3. **AsideCard** (States, Beside a form), **SummaryCard** (States, In a row), **Collapsible** (Playground).
4. **PageHeader** (its twelve stories, taught as a few), **PageLayout**, **SiteHeader** (In a shell).
5. **Separator** (Orientations, In a toolbar); smoke, the handoff, stop; the pull request on the user's word.
