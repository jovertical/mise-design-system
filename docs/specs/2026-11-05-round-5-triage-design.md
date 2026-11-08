# mise-design-system — round 5 triage (agreed)

Drafted on 2026-11-05 at the end of round 4b. **Status: agreed** with the user
on 2026-11-05, with the three open questions settled as recorded under
"Decisions". This list, agreed, is round 5's gate (port spec, "Rounds").

## What is left

49 React components in `<react-package>/src/components/` have no Svelte
counterpart. Each is placed in one of four outcomes below. Line counts are the
React file's.

## Port as they are

| Group | Components | Notes |
| --- | --- | --- |
| Overlays | Hint (56), HoverCard (43), Drawer (128) | Drawer needs `vaul-svelte`, a new dependency the user installs. Hint unblocks Card's TitleWithHint and Tooltip's InBothThemes |
| Forms | ButtonGroup (84), Combobox (289), InputOTP (109), SwitchField (126), ChoiceRow (178), Calendar (184), DatePicker (144), TimePicker (122) | Combobox, InputOTP and Calendar come from bits-ui; dates use `@internationalized/date`, already installed, in place of `react-day-picker` and `date-fns` |
| Layout | Collapsible (24), AsideCard (71), SummaryCard (50) | SummaryCard used `SectionTitle`; it moves onto `CardTitle`'s `icon` |
| Data display | Item (225), EntityLabel (83), Timeline (203), TreeLeaf (115), SegmentedCode (91), Readiness (272) | Item unblocks CardList's WithItemRows |
| Feedback | NavigationProgress (109), MediaDropzone (269) | |
| Actions | ThemeToggle (52) | |
| Forms | Form (185) | Ported on shadcn-svelte's Form, which builds on `formsnap` and `sveltekit-superforms`; both are new dependencies the user installs. The plan decides whether they are peers or optional |
| Feedback | FeaturePreview (106), LockedOverlay (78) | Ported as generic panels: a locked card body and a preview of something not yet available. The pricing-tier copy goes, and is recorded on `Diverged:` |

## Port as merges

From the structure spec's candidate table, each decided in its round's plan:

| Merged component | Absorbs | Group |
| --- | --- | --- |
| `NumberInput` with a `format` prop | CountInput (206), DecimalInput (212), CurrencyInput (146, without the peso). QuantityInput (319) is kept and composes it (round 6 plan, R6-4) | Forms |
| `ErrorState` | ErrorPage (94), beside EmptyState and LoadingState | Feedback |
| A `Stepper` family | Stepper (456), StepperNavigation (99) | Navigation |
| One checklist | ChecklistCard (246), TaskChecklist (360) | Data display |

## Defer until a screen needs it

| Components | Why |
| --- | --- |
| Draggable (118), Droppable (55), Sortable (94) | They need a Svelte drag-and-drop library, and nothing asks for one yet |
| MermaidDiagram (249) | A heavy optional dependency for a niche use |

## Drop, as product-specific

| Components | Why |
| --- | --- |
| ProductLogo (135) | The brand |
| TourTooltip (91) | Built for react-joyride |
| CategoryIcon (360), CategoryIconPicker (232) | Commerce's own category icon set |
| AddressFieldset (734), AddressSearch (196) | Philippine address forms |
| CredentialCard (290) | A licence-key card |
| MediaUploader (931) | Welded to the old product's media service |
| MessageComposer (342) | A chat input whose attachments are typed on MediaUploader's adapter; a future one would be designed afresh |
| Waterfall (357) | A billing timeline; needs HoverCard |

## Decisions

The three questions the proposal left open, as the user settled them:

1. **FeaturePreview and LockedOverlay:** keep both, as generic panels without the pricing-tier copy. Round 8.
2. **MessageComposer:** drop. Its attachments are welded to the dropped MediaUploader.
3. **Form:** port it on `formsnap`, as shadcn-svelte does. Round 6.

## Proposed rounds after the gate

- **Round 6, overlays and forms:** Hint, HoverCard, Collapsible, Drawer, ButtonGroup, Combobox, InputOTP, SwitchField, ChoiceRow, NumberInput, QuantityInput, Form.
- **Round 7, dates and flows:** Calendar, DatePicker, TimePicker, the Stepper family, Timeline, SegmentedCode.
- **Round 8, content and status:** Item, EntityLabel, AsideCard, SummaryCard, ErrorState, the checklist, Readiness, TreeLeaf, NavigationProgress, ThemeToggle, MediaDropzone, FeaturePreview, LockedOverlay.

Each round gets its own plan, written like round 4a's and 4b's, with phases of
at most five tasks.

**Done, 2026-11-06.** Rounds 6, 7 and 8 have ported every component in "Port as
they are" and "Port as merges", by the plans in `docs/superpowers/plans/`. What
the triage left is the "Defer" list: Draggable, Droppable, Sortable and
MermaidDiagram, until a screen needs them.
