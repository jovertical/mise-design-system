# Docs site, round 8: Overlays — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline, as rounds 1–7). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pages for the remaining Overlays: AlertDialog, Sheet, Drawer, Popover, HoverCard, Tooltip and Hint, completing the group.

**Architecture:** Round 4's per-page steps, and round 2's overlay recipe for every anatomy: open on the root, `portalProps={{ disabled: true }}` and the behaviour props on the content, `size="lg"`, the stage's `contain: layout paint` keeping a fixed overlay inside it. Each content part already takes `portalProps`.

**Found while planning (2026-11-16):** `Hint` wraps a `Tooltip` and exposes neither `open` nor the content's props, the gap DatePicker and MonthPicker had (mise #19). Its page waits on the user's choice at the gate: a mise `feat` giving Hint a bindable `open` and `contentProps`, as #19 did, or an anatomy of the closed `?` trigger with the tooltip itself shown on the Tooltip page.

**Spec:** `docs/specs/2026-11-10-docs-site-design.md`.

## Global Constraints

As round 7.

## Sidebar order within Overlays

Dialog 1 (round 2), AlertDialog 2, Sheet 3, Drawer 4, Popover 5, HoverCard 6, Tooltip 7, Hint 8.

## Tasks (one phase)

1. **AlertDialog** (Playground, Sizes).
2. **Sheet** (Sides) and **Drawer** (Sides).
3. **Popover** (As a form, Short list, Scrolling list) and **HoverCard**.
4. **Tooltip** (Sides, With a hint).
5. Smoke, the handoff, stop with the Hint question; Hint's page after the user's choice; the pull request on the user's word.
