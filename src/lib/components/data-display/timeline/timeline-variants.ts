/**
 * Origin: the React package 2.23.0 `timeline.tsx` (`timelineDotVariants`)
 * Diverged: split out of the component file, as badge-variants.ts is. The
 *   neutral badge is `bg-foreground/[0.07]` rather than React's `bg-muted`, which
 *   vanished on the muted canvas; a foreground wash reads on the page and on a
 *   card alike, as Skeleton's does. Other classes and the defaults unchanged.
 */
import { cva, type VariantProps } from 'class-variance-authority'

export const timelineDotVariants = cva(
  'col-start-2 col-end-3 row-start-1 row-end-1 flex size-8 shrink-0 items-center justify-center rounded-full [&>svg]:size-4',
  {
    variants: {
      /**
       * Solid for the event that matters, soft for the rest.
       *
       * The soft variants are a 15% wash of the status colour with the icon at
       * full strength, so a row reads as its status without a saturated 32px
       * disc competing with the text beside it. 10% read as white on a white
       * card: the wash has to survive being a 32px circle rather than a 15px
       * dot. `primary` is deliberately solid: it marks the entry the reader is
       * meant to land on first. Which is why these are not `TONE_SOFT_CLASS`,
       * whose wash is 10%.
       */
      tone: {
        primary: 'bg-primary text-primary-foreground',
        neutral: 'bg-foreground/[0.07] text-muted-foreground',
        info: 'bg-info/15 text-info',
        success: 'bg-success/15 text-success',
        warning: 'bg-warning/15 text-warning',
        critical: 'bg-destructive/15 text-destructive',
      },
    },
    defaultVariants: {
      tone: 'primary',
    },
  },
)

export type TimelineDotTone = NonNullable<VariantProps<typeof timelineDotVariants>['tone']>
