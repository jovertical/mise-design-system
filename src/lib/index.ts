/**
 * The public entry. Components live in purpose-group folders (Typography,
 * Forms, Feedback, …) but are re-exported under flat names, so an import never
 * names a group. Biome keeps the lines sorted, so groups appear
 * alphabetically here, not in sidebar order. Utilities are listed by name.
 */

// Actions
export * from './components/actions/button/index.js'
export * from './components/actions/command/index.js'
export * from './components/actions/dropdown-menu/index.js'
export * from './components/actions/theme-toggle/index.js'
// Data display
export * from './components/data-display/avatar/index.js'
export * from './components/data-display/badge/index.js'
export * from './components/data-display/chart/index.js'
export * from './components/data-display/checklist/index.js'
export * from './components/data-display/data-table/index.js'
export * from './components/data-display/delta-badge/index.js'
export * from './components/data-display/entity-label/index.js'
export * from './components/data-display/fact-list/index.js'
export * from './components/data-display/icon-chip/index.js'
export * from './components/data-display/item/index.js'
export * from './components/data-display/metric-bar/index.js'
export * from './components/data-display/metric-grid/index.js'
export * from './components/data-display/metric-row/index.js'
export * from './components/data-display/radial-stat/index.js'
export * from './components/data-display/readiness/index.js'
export * from './components/data-display/segmented-bar/index.js'
export * from './components/data-display/segmented-code/index.js'
export * from './components/data-display/sparkline/index.js'
export * from './components/data-display/stat-tile/index.js'
export * from './components/data-display/table/index.js'
export * from './components/data-display/timeline/index.js'
export * from './components/data-display/tree-leaf/index.js'
// Feedback
export * from './components/feedback/alert/index.js'
export * from './components/feedback/empty/index.js'
export * from './components/feedback/empty-state/index.js'
export * from './components/feedback/error-state/index.js'
export * from './components/feedback/feature-preview/index.js'
export * from './components/feedback/loading-state/index.js'
export * from './components/feedback/locked-overlay/index.js'
export * from './components/feedback/navigation-progress/index.js'
export * from './components/feedback/progress/index.js'
export * from './components/feedback/skeleton/index.js'
export * from './components/feedback/sonner/index.js'
export * from './components/feedback/spinner/index.js'
// Forms
export * from './components/forms/button-group/index.js'
export * from './components/forms/calendar/index.js'
export * from './components/forms/checkbox/index.js'
export * from './components/forms/choice-row/index.js'
export * from './components/forms/combobox/index.js'
export * from './components/forms/date-picker/index.js'
export * from './components/forms/field/index.js'
export * from './components/forms/input/index.js'
export * from './components/forms/input-group/index.js'
export * from './components/forms/input-otp/index.js'
export * from './components/forms/label/index.js'
export * from './components/forms/media-dropzone/index.js'
export * from './components/forms/number-input/index.js'
export * from './components/forms/quantity-input/index.js'
export * from './components/forms/radio-group/index.js'
export * from './components/forms/select/index.js'
export * from './components/forms/switch/index.js'
export * from './components/forms/switch-field/index.js'
export * from './components/forms/textarea/index.js'
export * from './components/forms/time-picker/index.js'
export * from './components/forms/toggle/index.js'
export * from './components/forms/toggle-group/index.js'
// Layout
export * from './components/layout/aside-card/index.js'
export * from './components/layout/card/index.js'
export * from './components/layout/card-grid/index.js'
export * from './components/layout/card-list/index.js'
export * from './components/layout/collapsible/index.js'
export * from './components/layout/page-header/index.js'
export * from './components/layout/page-layout/index.js'
export * from './components/layout/separator/index.js'
export * from './components/layout/summary-card/index.js'
// Navigation
export * from './components/navigation/breadcrumb/index.js'
export * from './components/navigation/sidebar/index.js'
export * from './components/navigation/stepper/index.js'
export * from './components/navigation/tabs/index.js'
// Overlays
export * from './components/overlays/alert-dialog/index.js'
export * from './components/overlays/dialog/index.js'
export * from './components/overlays/drawer/index.js'
export * from './components/overlays/hint/index.js'
export * from './components/overlays/hover-card/index.js'
export * from './components/overlays/popover/index.js'
export * from './components/overlays/sheet/index.js'
export * from './components/overlays/tooltip/index.js'
// Typography
export * from './components/typography/heading/index.js'
export * from './components/typography/text/index.js'

export { DEFAULT_MOBILE_BREAKPOINT, IsMobile } from './hooks/is-mobile.svelte.js'
export { cn } from './utils/cn.js'
export { segmentedItem, segmentedTrack } from './utils/segmented-control.js'
export {
  type Size,
  TONE_CSS_VAR,
  TONE_FILL_CLASS,
  TONE_HOVER_CLASS,
  TONE_INDICATOR_CLASS,
  TONE_OUTLINE_CLASS,
  TONE_SOFT_CLASS,
  TONE_SOLID_CLASS,
  TONE_STROKE_CLASS,
  TONE_TEXT_CLASS,
  TONES,
  type Tone,
} from './utils/tone.js'
export type {
  WithElementRef,
  WithoutChild,
  WithoutChildren,
  WithoutChildrenOrChild,
} from './utils/types.js'
