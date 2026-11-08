// Copied from the React package 2.23.0 src/lib/tone.ts. Diverged: the
// neutral soft wash is `bg-foreground/[0.07]`, not `bg-muted` (see TONE_SOFT_CLASS).
/**
 * The one status scale, and the one size scale, every component takes.
 *
 * Before 2.0 there were six tone types — `MetricTone`, `StatTone`,
 * `RadialTone`, `SegmentTone`, `SparklineTone`, `IconTone` — naming the same
 * idea five ways: the neutral was `default`, `muted` or `neutral`; the red was
 * `critical`, `destructive` or `error`; the brand was `primary` or `accent`.
 * A caller moving a status from a tile to a badge had to translate it, and
 * each map drifted on its own.
 *
 * `critical` rather than `destructive` or `error`. It names what the operator
 * should feel about the state, which is what a tone is for; `destructive`
 * describes an action and `error` a failure, and a badge reading "Overdue" is
 * neither. The CSS token keeps its shadcn name, `--destructive`.
 *
 * `primary` is the brand, washed from `--color-primary-soft`. It is never
 * `--accent`, which means "active nav row" and nothing else.
 *
 * The maps are whole class strings so Tailwind can see every one of them.
 * Components pick the treatment — a soft wash, a solid fill, an outline, bare
 * ink, a bar fill — and never write a colour of their own.
 */
export type Tone = 'neutral' | 'primary' | 'info' | 'success' | 'warning' | 'critical'

/**
 * `md` is the default everywhere. A component with only two sizes takes `sm`
 * and `md`; one that needs a larger step takes `lg`. Never `default`, `slim`
 * or `xs` — those were three names for "not the big one".
 */
export type Size = 'sm' | 'md' | 'lg'

export const TONES: readonly Tone[] = [
  'neutral',
  'primary',
  'info',
  'success',
  'warning',
  'critical',
]

/**
 * A 10% wash under ink of the same tone — a status, not an action.
 *
 * Neutral is a 7% foreground wash, not `--muted`. The canvas is `--muted`, so
 * a neutral badge or chip in `bg-muted` vanished wherever it sat on the page
 * rather than on a card; a foreground wash reads on the canvas, on a card and
 * on a muted row, in both schemes, as Skeleton's always has. 7% rather than
 * Skeleton's 10%: at 10% a neutral fill read a step darker than the old
 * `bg-muted` on a white card, heavier than a status that claims nothing should.
 * Every neutral fill outside this map (an avatar, a rank disc, a stepper's
 * track) writes the same `bg-foreground/[0.07]`.
 */
export const TONE_SOFT_CLASS: Record<Tone, string> = {
  neutral: 'bg-foreground/[0.07] text-muted-foreground',
  primary: 'bg-primary-soft text-primary',
  info: 'bg-info-soft text-info',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  critical: 'bg-destructive-soft text-destructive',
}

/**
 * A full fill. Neutral is the ink colour inverted rather than a grey, so that
 * "solid" always means the loudest thing in its row; a light grey fill is
 * what `soft` is for.
 *
 * Each status writes in its own `-foreground` ink rather than white: white
 * reads on the light scheme's 600 steps but all but vanishes on the dark
 * scheme's bright 400s.
 */
export const TONE_SOLID_CLASS: Record<Tone, string> = {
  neutral: 'bg-foreground text-background',
  primary: 'bg-primary text-primary-foreground',
  info: 'bg-info text-info-foreground',
  success: 'bg-success text-success-foreground',
  warning: 'bg-warning text-warning-foreground',
  critical: 'bg-destructive text-destructive-foreground',
}

export const TONE_OUTLINE_CLASS: Record<Tone, string> = {
  neutral: 'border-border text-foreground',
  primary: 'border-primary/50 text-primary',
  info: 'border-info/50 text-info',
  success: 'border-success/50 text-success',
  warning: 'border-warning/50 text-warning',
  critical: 'border-destructive/50 text-destructive',
}

/** Ink alone, for a ghost or a link. Neutral inherits the surrounding text. */
export const TONE_TEXT_CLASS: Record<Tone, string> = {
  neutral: '',
  primary: 'text-primary',
  info: 'text-info',
  success: 'text-success',
  warning: 'text-warning',
  critical: 'text-destructive',
}

/** The wash an interactive element takes on hover and while its menu is open. */
export const TONE_HOVER_CLASS: Record<Tone, string> = {
  neutral: 'hover:bg-muted data-[state=open]:bg-muted',
  primary: 'hover:bg-primary-soft data-[state=open]:bg-primary-soft',
  info: 'hover:bg-info-soft data-[state=open]:bg-info-soft',
  success: 'hover:bg-success-soft data-[state=open]:bg-success-soft',
  warning: 'hover:bg-warning-soft data-[state=open]:bg-warning-soft',
  critical: 'hover:bg-destructive-soft data-[state=open]:bg-destructive-soft',
}

/**
 * The fill of a mark — a bar, a ring, a dot, a sparkline. Neutral is the
 * muted ink rather than the brand, so an unremarkable bar reads as a quantity
 * and not as a claim; `primary` is there for the bar that should.
 */
export const TONE_FILL_CLASS: Record<Tone, string> = {
  neutral: 'bg-muted-foreground',
  primary: 'bg-primary',
  info: 'bg-info',
  success: 'bg-success',
  warning: 'bg-warning',
  critical: 'bg-destructive',
}

/** The same fill as a stroke, for a ring. */
export const TONE_STROKE_CLASS: Record<Tone, string> = {
  neutral: 'stroke-muted-foreground',
  primary: 'stroke-primary',
  info: 'stroke-info',
  success: 'stroke-success',
  warning: 'stroke-warning',
  critical: 'stroke-destructive',
}

/**
 * The fill of `Progress`'s indicator, set from the outside. `Progress` is
 * shadcn's and paints its own `bg-primary`; the `data-slot` selector beats it.
 */
export const TONE_INDICATOR_CLASS: Record<Tone, string> = {
  neutral: '[&_[data-slot=progress-indicator]]:bg-muted-foreground',
  primary: '[&_[data-slot=progress-indicator]]:bg-primary',
  info: '[&_[data-slot=progress-indicator]]:bg-info',
  success: '[&_[data-slot=progress-indicator]]:bg-success',
  warning: '[&_[data-slot=progress-indicator]]:bg-warning',
  critical: '[&_[data-slot=progress-indicator]]:bg-destructive',
}

/**
 * The colour as a CSS value, for a library that takes one rather than a class
 * — recharts' `stroke` and `stopColor`. Red is `--destructive`, not the
 * `--color-error` palette hue: `Sparkline` once drew with the latter, a second
 * red beside every badge and bar on the page.
 */
export const TONE_CSS_VAR: Record<Tone, string> = {
  neutral: 'var(--muted-foreground)',
  primary: 'var(--primary)',
  info: 'var(--color-info)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  critical: 'var(--destructive)',
}
