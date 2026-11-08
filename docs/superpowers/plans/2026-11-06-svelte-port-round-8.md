# mise-design-system Round 8 Implementation Plan: content and status

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline execution, as chosen by the user). Steps use checkbox (`- [ ]`) syntax.

**Goal:** Port the last round of the triage: the rows and labels (`Item`, `EntityLabel`, `TreeLeaf`), the cards (`AsideCard`, `SummaryCard`), the status displays (`ErrorState`, the checklist family, `Readiness`, `NavigationProgress`), `ThemeToggle`, the two generic panels the triage kept (`FeaturePreview`, `LockedOverlay`) and `MediaDropzone`. Item unblocks the last deferred story. The round ends at a Storybook review with the user, and with it the port's triage list.

**Architecture:** As in round 7. Each component follows `.claude/skills/authors-components/SKILL.md` and the per-task loop in `docs/superpowers/plans/2026-11-04-svelte-port-round-2.md`, lands in its purpose group (`docs/naming.md` §7), and has its stories on the skeleton (`docs/specs/2026-11-05-story-skeleton-design.md`). This plan states only what differs per component.

**Tech Stack:** what is installed. No new dependency (R8-6, R8-7).

**Spec:** `docs/specs/2026-11-05-round-5-triage-design.md`, "Proposed rounds after the gate", round 8, with FeaturePreview and LockedOverlay added by the triage's decisions. The checklist merge row is decided here (R8-4) and ErrorPage's (R8-3).

## Global Constraints

- **The commit gate is `pnpm test` and `pnpm build:storybook`,** both checked by exit code.
- **No new dependency.**
- **Stories on the skeleton.** Each React story is renamed to its rank's name, merged into an axis or `States`, or kept as a scenario; the commit lists the mapping.
- **Story copy:** generic operations, no pesos, no real names, no "tenant" and no product names.
- **Icons:** Tabler to the matching `@lucide/svelte` icon, one file at a time, by its canonical file.
- **Neutral fills that sit on the canvas** use `bg-foreground/10`, not `bg-muted`, as the round 7 fix did for ChoiceRow, Timeline and Stepper; a component's `Diverged:` line says so where it departs from React.
- **Visual check before each phase gate:** the new stories in light and dark. The dev server stops after two hours; past that, serve `storybook-static/` (handoff, "Storybook").
- **Phase gates:** stop after Tasks 108, 113 and 117, report in the phase-gates format, and push only after approval.

## Shared decisions

| # | Decision | Ruling |
|---|---|---|
| R8-1 | Groups | `Item`, `EntityLabel`, `TreeLeaf`, `Readiness` and the checklist family in Data display. `AsideCard` and `SummaryCard` in Layout. `ErrorState`, `NavigationProgress`, `FeaturePreview` and `LockedOverlay` in Feedback, `ErrorState` beside `EmptyState` and `LoadingState`. `MediaDropzone` in Forms. `ThemeToggle` in Actions |
| R8-2 | Item | shadcn-svelte's `item` parts (Item, ItemGroup, ItemSeparator, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions, ItemHeader, ItemFooter) with React's classes, sizes and media variants, the icon media drawn with `IconChip` and its tones. React's `asChild` is `href` (Item renders an `a`) and bits-ui's `child` snippet, as Button's is |
| R8-3 | ErrorState | React's ErrorPage, renamed by the triage to sit beside EmptyState and LoadingState. `homeLink` and `actions` are snippets; `showBackButton` calls `history.back()` as React's did |
| R8-4 | The checklist family | One family in `data-display/checklist/`, the triage's merge row, as two components over one shared row: `ChecklistCard` (React's ChecklistCard: a ring, a heading and the next few unmet rows, small enough for a sidebar) and `Checklist` (React's TaskChecklist, renamed because "Task" says nothing the list does not: every step, grouped into cards, each row folding open). They answer different questions at different sizes, and React's comments say so; kept apart as R4-2 kept the Metric components. What they share is the row's mark, label and the state a screen reader hears, in one internal part, and the `completed`, `skipped` and `pending` states, with ChecklistCard's `done` read as `completed` |
| R8-5 | Readiness | `ReadinessChecklist`, `ReadinessSummary` and the pure `summariseReadiness`, exported as React's are, so a page can ask the question without rendering either |
| R8-6 | ThemeToggle and the theme | React's `ThemeProvider` and `useTheme` (90 lines: the stored choice, the `system` fallback, the `.dark` class) ported as a Svelte context in `actions/theme-toggle/`, with ThemeToggle beside them as React ships it. Not `mode-watcher`: it would be a new dependency, and owns its own storage key and class handling, where the React package's are already the contract a consumer migrating from it knows. The provider is the one place the class on `<html>` changes |
| R8-7 | MediaDropzone | React's `useMediaUploader` is 640 lines and serves the dropped MediaUploader too. MediaDropzone gets the part it uses, ported as a rune-based `createMediaUploader` in its folder: the adapter interface (`MediaUploaderAdapter`, `MediaAsset`, `MediaUploadOptions`), one file's upload with progress, abort and error, and link and unlink. The gallery, the source list and the multi-file queue are not ported. The adapter is the consumer's, as in React: the package ships no media service |
| R8-8 | FeaturePreview and LockedOverlay | Generic, per the triage: a preview of something not yet available, and a lock over one card's body. React's props, and its classes; the pricing-tier copy in the comments and stories is rewritten without tiers or plans |
| R8-9 | `ReactNode` props | As R7-8: a `Snippet` prop of the same name, `string \| Snippet` where React's was usually a string. A data array's icon is a component, as Stepper's (R7-5) |
| R8-10 | Deferred stories | CardList's WithItemRows is ported in Task 104 and its Deferred comment dropped. That empties the deferred list |

## Phases

- **Phase 8a (Tasks 104–108):** Item, EntityLabel, AsideCard, SummaryCard, ErrorState
- **Phase 8b (Tasks 109–113):** the checklist family, Readiness, TreeLeaf, NavigationProgress, ThemeToggle
- **Phase 8c (Tasks 114–117):** FeaturePreview, LockedOverlay, MediaDropzone, the round gate

## Per-task specifics

Read every React file a task names, and its stories, before writing the test. Each task's tests cover at least what is listed.

- **104 Item** (`data-display/item`, shadcn, R8-2): test the slots, each size's and variant's classes, the media variants with IconChip tones, an `href` item rendering an `a`, and ItemGroup's role. Stories: Playground (Basic); Sizes; With actions; In a card (InsideACard, and CompactInACard, IdentityInACard, BorderedRowsInACard as scenarios); IconMediaTones as Tones; ClickableRow as a scenario. Then CardList's WithItemRows (R8-10).
- **105 EntityLabel** (`data-display/entity-label`, the React package): `title`, `description`, `icon` or `media`, `iconShape`, `iconTone`; both lines truncate. Test the mark, the truncation classes, and media over icon. Stories: Playground (Default); Tones (Toned); With avatar, With a badge; Title only as a scenario; In a table.
- **106 AsideCard** (`layout/aside-card`, the React package): Card on Collapsible, holding its own open state, `defaultOpen`. Test the toggle, `aria-expanded`, and starting collapsed. Stories: Playground (Default); States (StartsCollapsed); BesideAForm as a scenario.
- **107 SummaryCard** (`layout/summary-card`, the React package): React's SectionTitle is CardTitle's `icon` (the structure spec's fold), `action` a snippet, `h-full`. Test the title and icon, the action slot, and `h-full`. Stories: Playground (WithAction); States (ReadOnly); Row as `In a row` or a scenario.
- **108 ErrorState** (`feedback/error-state`, the React package, R8-3): status, title, description, icon, home link, back button, actions, on `Empty`. Test each slot's presence, the back button calling `history.back`, and the status line. Stories: Playground (NotFound); Forbidden, Thrown, Annotated, Bare as scenarios, or `Variants` if React's stories read as one prop's values. Phase 8a's report includes the visual check.
- **109 The checklist family** (`data-display/checklist`, the React package, R8-4): ChecklistCard (ring from `RadialStat`, `size`, `variant` default or outline, the next unmet rows with their actions, the percentage as a prop, the ring `success` at 100 and `primary` before) and Checklist (groups in cards, each with its `percent`, rows that fold open, the `skipped` state, the row's accessible name prefixed by its state). Test ChecklistCard's ring tone at 99 and 100 and its rows; Checklist's grouping, folding, and each state's name prefix. Stories: ChecklistCard's ten (Empty, Partial, Complete as States; Small and Outline as Sizes and Variants; IconRail, WithActions, WithoutFooter as `With …`; FractionalAndLongLabel and NoItems as scenarios) and Checklist's seven (AllPending, PartiallyComplete, Complete as States; Expanded, SingleGroup, WithSkippedRow, EdgeCases as scenarios), in one story file per component, titled `Data display/Checklist` and `Data display/Checklist/Card`.
- **110 Readiness** (`data-display/readiness`, the React package, R8-5): the four statuses, required against optional, `summariseReadiness`'s counting (optional rows count toward progress, not permission), the summary's server override (`ready`), and naming what is missing. Test `summariseReadiness` as a pure function, then each component. Stories: Playground (Checklist); States (Pending, Empty); OptionalVersusRequired, ProgressWithoutRequirementTags, SummaryDerived, SummaryServerOverride as scenarios; In an aside (inside an AsideCard, now ported).
- **111 TreeLeaf** (`data-display/tree-leaf`, the React package): stem, elbow, media chip, label, trailing figure, `position="last"` shortening the stem, `mediaSize`. Test the last row's stem and the media sizes. Stories: Playground (Default), as a recipe's ingredient list.
- **112 NavigationProgress** (`feedback/navigation-progress`, the React package): `pending` jumps the bar to about two thirds and waits; a navigation that resolves flashes it to full and hides it. Test both paths with fake timers. Stories: Playground (SlowNavigation, a toggle that holds `pending`); InstantNavigation as a scenario.
- **113 ThemeToggle** (`actions/theme-toggle`, the React package, R8-6): ThemeProvider (stored choice under React's storage key, `system` from `prefers-color-scheme`, the `.dark` class on `<html>`), `useTheme`, and the icon-only toggle that flips from the resolved theme. Test with the `matchMedia` stub: `system` resolving each way, a first click from `system` landing on the opposite of what it resolved to, and the class and storage following. Stories: Playground (Basic), inside its own provider with a fresh storage key so it does not fight Storybook's scheme global.
- **114 FeaturePreview** (`feedback/feature-preview`, the React package, R8-8): title, headline, benefits, preview, primary and secondary actions, centred. Test each slot and the benefits list. Stories: Playground (Default); PrimaryOnly and LongBenefits as scenarios, or LongBenefits as `Long content`.
- **115 LockedOverlay** (`feedback/locked-overlay`, the React package, R8-8): title, message, action, over the body it locks, which stays visible beneath and inert. Test that the body is `inert`, the lock's slots, and the action. Stories: Playground (OverCardList); OverMetricBars as a scenario.
- **116 MediaDropzone** (`forms/media-dropzone`, the React package, R8-7): `createMediaUploader` first, tested against a fake adapter (progress, abort, failure, not-ready), then the zone: one image, the zone staying put once filled, replace and remove, drag-over state, `accept` and `maxSize` rejection, disabled. Stories: Playground (Empty); States (Uploading, Failing, NotReady, Disabled); With preview (WithPreview, EmptyWithPreview), over a fake adapter in `stories/fixtures/`.
- **117 Round gate:** clean-tree gate, pack check, every round 8 story in both schemes, the deferred list confirmed empty, the triage's port list confirmed done, `docs/handoff.md` updated, hand over for review.

## Docs

- The plan's commit removes the handoff's muted-on-muted open item (fixed in `a4c6d53`) and points the handoff at this plan.
- Task 109 updates the structure spec's candidate table: the checklist row reads "one family in round 8 (R8-4)".
- Task 117 updates `docs/handoff.md`, and the triage's "Proposed rounds" section records that rounds 6 to 8 are done.
