/**
 * Origin: the React package 2.23.0 `button-variants.ts`, itself shadcn/ui new-york `button`
 * Diverged: none. Copied verbatim; only the import path moved.
 *
 * `variant` (solid, soft, outline, ghost, link) × `tone` (the shared `Tone`),
 * sizes `sm | md | lg`, and `iconOnly` for the square. Hover is `--muted`,
 * never `--accent`.
 */
import { cva, type VariantProps } from 'class-variance-authority'

import {
  type Size,
  TONE_HOVER_CLASS,
  TONE_OUTLINE_CLASS,
  TONE_SOFT_CLASS,
  TONE_SOLID_CLASS,
  TONE_TEXT_CLASS,
  TONES,
  type Tone,
} from '../../../utils/tone.js'

export type ButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost' | 'link'

const TREATMENT: Record<ButtonVariant, (tone: Tone) => string> = {
  solid: (tone) => `${TONE_SOLID_CLASS[tone]} hover:opacity-85`,
  soft: (tone) => `${TONE_SOFT_CLASS[tone]} hover:opacity-80 data-[state=open]:opacity-80`,
  outline: (tone) =>
    `bg-background shadow-xs dark:bg-input/30 ${TONE_OUTLINE_CLASS[tone]} ${TONE_HOVER_CLASS[tone]}`,
  ghost: (tone) => `${TONE_TEXT_CLASS[tone]} ${TONE_HOVER_CLASS[tone]}`,
  link: (tone) => `${TONE_TEXT_CLASS[tone]} underline-offset-4 hover:underline`,
}

const VARIANTS: readonly ButtonVariant[] = ['solid', 'soft', 'outline', 'ghost', 'link']

/**
 * The tone a variant takes when none is given.
 *
 * A solid button is the page's primary action, so it defaults to the brand; a
 * link is navigation, and navigation is brand-coloured too. Everything else is
 * secondary by construction and defaults to neutral — an outline Cancel beside
 * a solid Save should not also be blue.
 */
export function defaultButtonTone(variant: ButtonVariant): Tone {
  if (variant === 'solid' || variant === 'link') return 'primary'

  return 'neutral'
}

const buttonClasses = cva(
  // Radius, transparent border and the press nudge are lifted from the
  // reference's shipped button CSS. The radius is a fixed 16px rather than
  // `rounded-full`, so it reads as a pill at the default height and keeps a
  // consistent corner on the taller sizes.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-transparent bg-clip-padding text-sm font-medium transition-all select-none active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: { solid: '', soft: '', outline: '', ghost: '', link: '' },
      tone: {
        neutral: '',
        primary: '',
        info: '',
        success: '',
        warning: '',
        critical: '',
      },
      size: {
        sm: 'h-8 gap-1.5 px-3 has-[>svg]:px-2.5',
        md: 'h-9 px-4 py-2 has-[>svg]:px-3',
        lg: 'h-10 px-6 has-[>svg]:px-4',
      },
      /**
       * A square button holding one glyph, drawn as a circle.
       *
       * A flag rather than three more sizes. Before 2.0 the size list was
       * `default | sm | lg | icon | icon-sm | icon-lg`, which made "how big"
       * and "what shape" one choice, and a caller wanting a small icon button
       * had to know it was spelt `icon-sm` and not `sm`.
       *
       * Round because the reference draws it round, and because 14 call sites
       * across the portals had already overridden a row's ⋯ trigger to
       * `rounded-full` by hand.
       */
      iconOnly: {
        true: 'rounded-full px-0 has-[>svg]:px-0',
        false: '',
      },
    },
    compoundVariants: [
      ...VARIANTS.flatMap((variant) =>
        TONES.map((tone) => ({ variant, tone, class: TREATMENT[variant](tone) })),
      ),
      { iconOnly: true, size: 'sm', class: 'size-8' },
      { iconOnly: true, size: 'md', class: 'size-9' },
      { iconOnly: true, size: 'lg', class: 'size-10' },
    ],
    defaultVariants: {
      variant: 'solid',
      tone: 'primary',
      size: 'md',
      iconOnly: false,
    },
  },
)

export type ButtonSize = Size

/**
 * The class string for a button, for an element that has to look like one
 * without being `Button` — a calendar's nav arrows, a link styled as an action.
 *
 * A function rather than the bare cva so the tone default follows the variant
 * here too. cva's `defaultVariants` is one fixed tone, and a caller asking for
 * `{ variant: 'ghost' }` would have got brand-blue ink.
 */
export function buttonVariants({
  variant = 'solid',
  tone,
  size,
  iconOnly,
}: VariantProps<typeof buttonClasses> = {}) {
  const resolvedVariant = variant ?? 'solid'

  return buttonClasses({
    variant: resolvedVariant,
    tone: tone ?? defaultButtonTone(resolvedVariant),
    size,
    iconOnly,
  })
}
