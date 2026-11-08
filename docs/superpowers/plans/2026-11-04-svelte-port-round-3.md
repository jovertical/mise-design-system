# mise-design-system Round 3 Implementation Plan: dashboard shell

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline execution, as chosen by the user). Steps use checkbox (`- [ ]`) syntax.

**Goal:** Port round 3 of the spec, plus the four pieces it depends on (`IconChip`, `Empty`, `LoadingStatus`, `IsMobile`). The round 3 components are `Sidebar`, `PageLayout`, `PageHeader`, `Breadcrumb`, `SectionTitle`, `EmptyState`, `LoadingState`, `Skeleton`, `Spinner`, `Heading` and `Text`. The round ends at a Storybook review with the user.

**Architecture:** As in round 2. Each component follows `.claude/skills/authors-components/SKILL.md` and the per-task loop in `docs/superpowers/plans/2026-11-04-svelte-port-round-2.md`. This plan states only what differs per component.

**Spec:** `docs/specs/2026-11-04-svelte-port-design.md`, "Rounds", row 3.

## Global Constraints

The round 0–1 and round 2 constraints all apply, plus:

- **The commit gate is `pnpm test` and `pnpm build:storybook`,** both checked by exit code (git-workflow skill).
- **Visual check before each phase gate:** screenshot the new stories with the cached Playwright Chromium, in light and dark, and look at them before reporting. The binary is `~/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell`; the URL is `http://localhost:6006/iframe.html?id=<story-id>&viewMode=story&globals=scheme:<light|dark>`.
- **Phase gates:** stop after Tasks 40, 45 and 49, and report in the phase-gates format.

## Shared decisions

| # | Decision | Ruling |
|---|---|---|
| R3-1 | `useIsMobile` | React's hook becomes `IsMobile`, a class extending Svelte's `MediaQuery` from `svelte/reactivity`, as shadcn-svelte does. Read it as `new IsMobile().current`. It is exported with `DEFAULT_MOBILE_BREAKPOINT` (768), from `src/lib/hooks/is-mobile.svelte.ts`. No new dependency. |
| R3-2 | Hooks folder | `src/lib/hooks/` holds non-component reactive helpers. Each is exported from the barrel by name and listed in `EXPECTED_EXPORTS`. The provenance suite covers components only. |
| R3-3 | `Origin: the React package` components | Heading, Text, PageLayout, PageHeader, Breadcrumb, SectionTitle, EmptyState, LoadingState, IconChip, Empty and LoadingStatus were authored by the React package. Their stories are titled `Components/<Name>` and tagged `mise`. Their `Origin:` lines name the React file, with no `shadcn/ui` clause. |
| R3-4 | `ReactNode` props | A `ReactNode` prop (`title`, `description`, `action`, `icon`, …) becomes a `Snippet` prop of the same name, rendered in a `div` (spec). A plain string is also accepted where the React prop was usually a string. Each such prop is typed `string \| Snippet`. |
| R3-5 | Sidebar | It is ported in two tasks, the shell and then the menu. The cookie persistence and keyboard shortcut come over as React has them. Anything React reads from `next/*` or the portals' router is out. |

## Task order and phases

- **Phase I (Tasks 36–40):** Skeleton, Spinner, Heading, Text, IconChip
- **Phase J (Tasks 41–45):** Empty, EmptyState, LoadingStatus, LoadingState, SectionTitle
- **Phase K (Tasks 46–49):** Breadcrumb, PageLayout + PageHeader, IsMobile + Sidebar shell, Sidebar menu
- **Phase L (Task 50):** the round gate

## Per-task specifics

The per-task loop in the round 2 plan applies: read, write the test first, write the parts, barrel, stories, gate, commit. Before porting a component, read every React file it names and every React story. Each task's tests must cover at least:

- **36 Skeleton:** `data-slot`, and the pulse and muted classes. Stories: TextLine, Card.
- **37 Spinner:** `role="status"` and its label, if React sets them; the size classes. Stories: Default, Sizes. When this lands, revisit Dialog's GenerateAndDownload; it still needs Progress, so it stays deferred.
- **38 Heading:** the level renders the right element (`h1`–`h6`), and size and tone come from React's maps. Stories: Playground, Sizes, SectionOpening (it uses Text, so add it in Task 39).
- **39 Text:** the element (`as`), weight, tone and truncate as React has them. Stories: Playground, TheCommonThree, Weights, Tones, Truncated. Also add Heading's SectionOpening.
- **40 IconChip:** size, shape and tone classes, and the glyph passed as children or a snippet. Stories: Playground, SizesAndShapes, Tones, BesideText.
- **41 Empty:** every part `empty.tsx` exports. It has no React story of its own; write one covering its parts.
- **42 EmptyState:** built on Empty, with title, description and actions as R3-4 props. Stories: Fallback, Described, WithActions.
- **43 LoadingStatus:** built on Spinner. Stories: Basic, Specific.
- **44 LoadingState:** built on Empty and Spinner. Stories: Default, WithDescription, WithActions, InACard, ChoosingATreatment.
- **45 SectionTitle:** built on Card and IconChip. Stories: Default, TintedChip.
- **46 Breadcrumb:** every part, with `asChild` becoming `href` or a `child` snippet as in Button. Test the separator and the collapsed ellipsis. Stories: Default, WithTrailingPage, LongName, Collapsed.
- **47 PageLayout + PageHeader:** two commits. PageHeader's slots (eyebrow, back link, trail, accessory, actions) follow R3-4. Stories: PageLayout Basic. PageHeader's twelve: Listing, Flow, TitleWithAncestorTrail, TrailAsTitle, TrailAsTitleWithAccessory, WithAccessoryAndActions, LongTitle, TruncatedTitle, WithEyebrow, WithBackLink, Busiest, Detail.
- **48 IsMobile + Sidebar shell:**
  - `IsMobile` follows R3-1.
  - The shell parts are SidebarProvider (context, cookie, shortcut), Sidebar (desktop and mobile Sheet), SidebarTrigger, SidebarRail, SidebarInset, and the Header, Footer, Content and Separator parts.
  - Test that the trigger toggles `data-state`, that `bind:open` works, and that the mobile path renders a Sheet when `IsMobile` is true (stub `matchMedia` to match).
- **49 Sidebar menu:** the Group, Menu, MenuButton (with its tooltip when collapsed), MenuAction, MenuBadge, MenuSkeleton and MenuSub parts, and the input. Stories: Default.
- **50 Round gate:**
  - the clean-tree gate and the pack check;
  - re-check the deferred stories whose blockers this round ported;
  - screenshot every new story in both schemes;
  - push after approval, watch CI, and hand over.
