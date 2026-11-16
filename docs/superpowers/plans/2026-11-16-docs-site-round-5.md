# Docs site, round 5: the rest of Forms — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline, as rounds 1–4). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pages for Combobox, Calendar, TimePicker, MediaDropzone, Form, DatePicker and MonthPicker, completing the Forms group.

**Architecture:** Round 4's per-page steps (`docs/superpowers/plans/2026-11-16-docs-site-round-4.md`, "Every page, the same steps"), with round 2's overlay recipe (`site/README.md`) for the three that open a panel: Combobox's list, DatePicker's calendar and MonthPicker's grid open in place in their anatomy.

**Found while planning (2026-11-16):** DatePicker and MonthPicker kept `open` internal and gave their popover no props, so neither could open in a stage. The user chose to fix it in mise first: mise PR #19, `feat(date-picker)`, gives both a bindable `open` and `contentProps` for their `PopoverContent`. The DatePicker and MonthPicker pages wait for it to merge; this branch is rebased onto `main` after it does. The docs site builds mise from source, so it needs no npm release.

**Spec:** `docs/specs/2026-11-10-docs-site-design.md`.

## Global Constraints

As round 4: branch `docs/site-round-5`; `docs(site)` and `docs` commits; built only from mise; semantic tokens; the clean-code guide; operations copy; the gate by exit code before each commit (`pnpm test`, `pnpm build:storybook`, `pnpm --filter mise-docs test`), and `pnpm build:pages && pnpm --filter mise-docs smoke` before the pull request; the attribution trailer.

## Sidebar order within Forms

Combobox 19, Calendar 20, DatePicker 21, MonthPicker 22, TimePicker 23, MediaDropzone 24, Form 25.

## Tasks (one phase)

1. **Combobox** (stories: Playground, With chips, Free text). Anatomy open in place: `ComboboxContent portalProps={{ disabled: true }}` with the behaviour props, `open` on the root. Parts: input, trigger, content, list, item, item indicator, chips (in a second example if they crowd). Keys: typing filters, arrows move, `Enter` picks, `Esc` closes.
2. **Calendar** (With range, Caption dropdowns), **TimePicker** (Formats, States, In a field). Calendar renders in the page; TimePicker's anatomy is its two triggers, closed.
3. **MediaDropzone** (States, With preview, Empty with preview, Uploading, Failing), **Form** (Playground; from `@jovertical/mise-design-system/form`, SvelteKit only, with superforms: check the site can run a client-side superforms form, or show the code and a static render, and say which).
4. **DatePicker** (States, With range, With a custom label, In a field, Disabled past dates, Opened by the screen) and **MonthPicker** (States, With bounds, In a toolbar, Opened by the screen), after mise PR #19 merges: anatomy with `open` and `contentProps={{ portalProps: { disabled: true }, … }}`.
5. Smoke, the handoff, stop; the pull request on the user's word.
