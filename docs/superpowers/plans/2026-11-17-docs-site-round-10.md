# Docs site, round 10: Data display, labels and records — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline, as rounds 1–9). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pages for the first half of Data display: Badge, DeltaBadge, IconChip, Avatar, EntityLabel, Item, FactList, Table, Timeline, TreeLeaf and SegmentedCode. Round 11 takes the measures: StatTile, MetricBar, MetricGrid, MetricRow, RadialStat, SegmentedBar, Sparkline, Chart, Board, Checklist and Readiness.

**Architecture:** Round 4's per-page steps. No overlays.

**Spec:** `docs/specs/2026-11-10-docs-site-design.md`.

## Global Constraints

As round 9.

## Sidebar order within Data display

DataTable 1 (round 3), Table 2, Badge 3, DeltaBadge 4, IconChip 5, Avatar 6, EntityLabel 7, Item 8, FactList 9, Timeline 10, TreeLeaf 11, SegmentedCode 12. Round 11 continues from 13.

## Tasks (one phase)

1. **Badge** (Matrix, Count, Statuses, Tags, Solid, From a domain status), **DeltaBadge** (Variants, Directions, Inverted, Units, Currency prefix), **IconChip** (Matrix, Tones, In a detail list).
2. **Avatar** (Sizes, With status, Presence), **EntityLabel** (Tones, With a badge, With avatar, In a table, Title only), **Item** (Sizes, Tones, With actions, In a card, Clickable row).
3. **FactList** (Orientations, States, With icon, Long content, Two blocks, Totals coloured by sign, Grouped facts), **Table** (Densities, States, With sections, In a card, Column totals, Stacked identity cell).
4. **Timeline** (Tones, States, With presence, Without icons), **TreeLeaf**, **SegmentedCode** (Sizes, Pairing code).
5. Smoke, the handoff, stop; the pull request on the user's word.
