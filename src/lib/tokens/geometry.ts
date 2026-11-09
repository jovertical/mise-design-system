/**
 * Everything in the theme that is not a colour and not configurable: the
 * radius scale's shape, the shell's structural measurements, and the control
 * geometry components hard-code.
 *
 * Adapted from the React package 2.23.0 src/tokens/geometry.ts.
 */

/** Structural measurements, declared in `:root`. `--spacing` drives every spacing utility. */
export const sizing = {
  '--sidebar-width': 'calc(var(--spacing) * 20)',
  '--header-height': '64px',
  '--spacing': '0.25rem',
} as const

/**
 * Derived from the single `--radius`, so one edit moves the whole scale in
 * step. `--radius-4xl` is what cards and dialogs use, clamped to 24px by
 * `rounded-[min(var(--radius-4xl),24px)]`.
 */
export const radiusScale = {
  '--radius-sm': 'calc(var(--radius) - 4px)',
  '--radius-md': 'calc(var(--radius) - 2px)',
  '--radius-lg': 'var(--radius)',
  '--radius-xl': 'calc(var(--radius) + 4px)',
  '--radius-2xl': 'calc(var(--radius) + 8px)',
  '--radius-3xl': 'calc(var(--radius) + 12px)',
  '--radius-4xl': 'calc(var(--radius) + 16px)',
} as const

/**
 * `--container-content` caps the content column, header bar included, so
 * tables do not stretch the full width of an ultrawide display.
 */
export const layout = {
  '--height-header': 'var(--header-height)',
  '--width-sidebar': 'var(--sidebar-width)',
  '--container-content': '96rem',
  '--spacing': 'var(--spacing)',
} as const

/**
 * Control geometry, recorded as a rule rather than emitted as CSS.
 *
 * Components hard-code these classes; the table exists so that a new component
 * has one place to check instead of copying whichever neighbour it was pasted
 * from. Kept in sync with the Geometry docs page in Storybook.
 */
export const geometryRules = {
  card: 'rounded-[min(var(--radius-4xl),24px)]',
  dialog: 'rounded-[min(var(--radius-4xl),24px)]',
  button: 'rounded-[var(--radius-button,9999px)]',
  input: 'rounded-2xl',
  select: 'rounded-2xl',
  toolbarPill: 'rounded-2xl',
  // The segmented control's track and its pill are both fully round, and the
  // pill is lifted with `shadow-sm`. The composed class strings live in
  // `src/components/segmented-control.ts`, which is what `Tabs`, `ToggleGroup`
  // and `DataTableViewToggle` read; these two lines record the geometry so a
  // new control can check the table without importing a component.
  segmentedTrack: 'rounded-full',
  segmentedItem: 'rounded-full',
  menuSurface: 'rounded-2xl',
  menuRow: 'rounded-lg',
  sidebarNavRow: 'rounded-xl',
  badge: 'rounded-lg',
  iconAction: 'rounded-full',
  toolbarControlHeight: 'h-8',
  formControlHeight: 'h-9',
  menuRowHeight: 'py-1.5',
} as const
