# Docs site, round 9: Feedback — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline, as rounds 1–8). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pages for the remaining Feedback components: Alert, Empty, EmptyState, ErrorState, LoadingState, Spinner, Skeleton, Progress, NavigationProgress, FeaturePreview and LockedOverlay, completing the group.

**Architecture:** Round 4's per-page steps. No overlays: every component renders on the page. NavigationProgress is fixed to the top of the viewport, so its examples sit in a box made their containing block, as the Sidebar page's do. Components with no `data-slot` of their own (EmptyState, LoadingState) are found by the slots of the parts they compose.

**Spec:** `docs/specs/2026-11-10-docs-site-design.md`.

## Global Constraints

As round 8.

## Sidebar order within Feedback

Toaster 1 (round 2), Alert 2, Empty 3, EmptyState 4, ErrorState 5, LoadingState 6, Spinner 7, Skeleton 8, Progress 9, NavigationProgress 10, FeaturePreview 11, LockedOverlay 12.

## Tasks (one phase)

1. **Alert** (Tones, With title, With icon, With action, With actions, Long content, On a page, Parts alone, Rich description).
2. **Empty**, **EmptyState** (With description, With actions), **ErrorState** (Forbidden, Thrown, Annotated, Bare).
3. **LoadingState** (With description, With actions, In a card, Choosing a treatment), **Spinner** (Sizes, With caption), **Skeleton** (In a card), **Progress**.
4. **NavigationProgress** (Instant navigation), **FeaturePreview** (Long content, Primary only), **LockedOverlay** (Over metric bars).
5. Smoke, the handoff, stop; the pull request on the user's word.
