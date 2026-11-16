# Docs site, round 6: Typography, Actions and Navigation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline, as rounds 1–5). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pages for Heading, Text, Command, DropdownMenu, ThemeToggle, Breadcrumb, Tabs and Stepper, completing Typography, Actions and Navigation.

**Architecture:** Round 4's per-page steps (`docs/superpowers/plans/2026-11-16-docs-site-round-4.md`, "Every page, the same steps"), round 2's overlay recipe (`site/README.md`) for DropdownMenu (its content takes `portalProps`) and for `CommandDialog`'s example. Command's anatomy is the inline `Command`, which renders on the page.

**Spec:** `docs/specs/2026-11-10-docs-site-design.md`.

## Global Constraints

As round 4: branch `docs/site-round-6`; `docs(site)` and `docs` commits; built only from mise; semantic tokens; the clean-code guide; operations copy; frontmatter descriptions with a colon quoted; the gate by exit code before each commit, and `pnpm build:pages && pnpm --filter mise-docs smoke` before the pull request; the attribution trailer.

## Sidebar order

Typography: Heading 1, Text 2. Actions: Button 1 (round 1), DropdownMenu 2, Command 3, ThemeToggle 4. Navigation: Sidebar 1 (round 3), Breadcrumb 2, Tabs 3, Stepper 4.

## Tasks (one phase)

1. **Heading and Text** (stories: Sizes, Section opening; Weights, Tones, Long content, Line items and a total, The common three).
2. **DropdownMenu** (Every row kind, Destructive), anatomy open in place; **ThemeToggle** (Playground; it switches the docs' own scheme, which the page says).
3. **Command** (States, With trigger, In a dialog, In a header): inline anatomy; `CommandDialog` as an example.
4. **Breadcrumb** (With trailing page, Long content, Collapsed) and **Tabs** (States, With content, On a page, In a card, In a card header, Full width).
5. **Stepper** (its stories and StepperNavigation's), then smoke, the handoff, stop; the pull request on the user's word.
