/**
 * Origin: the React package 2.23.0 `badge.tsx` (`badgeVariants`), itself shadcn/ui new-york `badge`
 * Diverged: split out of the component file, as button-variants.ts is.
 *   Classes, variants and defaults unchanged.
 */
import { cva } from 'class-variance-authority'

import {
  TONE_OUTLINE_CLASS,
  TONE_SOFT_CLASS,
  TONE_SOLID_CLASS,
  TONES,
  type Tone,
} from '../../../utils/tone.js'

export type BadgeVariant = 'solid' | 'soft' | 'outline'

const TREATMENT: Record<BadgeVariant, Record<Tone, string>> = {
  solid: TONE_SOLID_CLASS,
  soft: TONE_SOFT_CLASS,
  outline: TONE_OUTLINE_CLASS,
}

export const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-lg border border-transparent px-2 py-0.5 text-xs w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:opacity-90',
  {
    variants: {
      variant: {
        solid: '',
        soft: '',
        outline: 'bg-transparent',
      },
      /**
       * The label shape is `rounded-lg px-2`, sized for a word. Around one digit
       * that is a squarish lozenge wider than it is tall. A count fixes the
       * height and makes it the minimum width, so a single digit is a circle;
       * `px-1.5` only takes over once a second digit outgrows it.
       */
      count: {
        true: 'h-5 min-w-5 rounded-full px-1.5 py-0 tabular-nums',
        false: '',
      },
      /**
       * A neutral badge is regular weight; a toned one is medium.
       *
       * Counted before 2.0: 36 of 152 badges in the portals overrode the weight
       * to `font-normal`, and 34 of those were neutral — `outline` or the old
       * `secondary`. A neutral badge is a label on a row, and at medium weight
       * a column of them outshouts the row's own title. Weight is for a state.
       */
      tone: {
        neutral: 'font-normal',
        primary: 'font-medium',
        info: 'font-medium',
        success: 'font-medium',
        warning: 'font-medium',
        critical: 'font-medium',
      },
    },
    compoundVariants: (['solid', 'soft', 'outline'] as const).flatMap((variant) =>
      TONES.map((tone) => ({ variant, tone, class: TREATMENT[variant][tone] })),
    ),
    defaultVariants: {
      variant: 'soft',
      tone: 'neutral',
      count: false,
    },
  },
)
