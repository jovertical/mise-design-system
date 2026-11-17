# Docs site, round 11: Data display, measures — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline, as rounds 1–10). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pages for the rest of Data display: StatTile, MetricBar, MetricGrid, MetricRow, RadialStat, SegmentedBar, Sparkline, Chart, Board, Checklist and Readiness. With them every component in mise has a page.

**Architecture:** Round 4's per-page steps. No overlays. Folders whose root export is not the folder's name take their `ApiTable` from the root export: Chart's is `ChartContainer`, Readiness's `ReadinessChecklist`. A part with no `data-slot` of its own (MetricGrid's cells, a StatTile's value, a chart's series) is found by a selector.

**Spec:** `docs/specs/2026-11-10-docs-site-design.md`.

## Global Constraints

As round 10.

## Sidebar order within Data display

Continues from round 10: StatTile 13, MetricGrid 14, MetricBar 15, MetricRow 16, RadialStat 17, SegmentedBar 18, Sparkline 19, Chart 20, Board 21, Checklist 22, Readiness 23.

## Tasks (one phase)

1. **StatTile** (Sizes, Surfaces, States, With delta, With visual, With rows, Four across, Icon leading, Money), **MetricGrid** (Two columns, One toned cell).
2. **MetricBar** (Tones, With context, With rank, By status), **MetricRow** (In a card list, Inline bar, Without stats), **RadialStat** (Sizes, Tones, In a list, A count inside).
3. **SegmentedBar** (Sizes, States, In a table row), **Sparkline** (Tones, Direction, Not enough data), **Chart** (Playground, With comparison, With markers).
4. **Board** (Tones, States, With dragging), **Checklist** and **ChecklistCard** (States, Expanded, Variants, With actions), **Readiness** (States, In an aside, Summary derived).
5. Smoke, the handoff (every group documented), stop; the pull request on the user's word.
