<!--
  Origin: the React package 2.23.0 `locked-overlay.tsx`
  Diverged: generic, per the round 5 triage (round 8 plan, R8-8): the React
    comments and stories spoke of pricing tiers; the lock here is anything the
    reader cannot open yet (access, setup, a plan). `action` and `children` are
    snippets. Lucide's lock. Spreads the rest onto the root, as every component
    does.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  /**
   * A lock over one card's body, for a widget the reader cannot open while the
   * rest of the page works. The card keeps its frame and header; only the body
   * is swapped for a blurred sample with the pitch on top.
   *
   * The sample and the pitch share one grid cell rather than the pitch being
   * positioned over the sample, so the body is as tall as whichever is taller:
   * positioned absolutely, a short sample let the pitch spill over the card's
   * header. The pitch layer is `relative` for its paint order: the sample's
   * opacity and blur lift it into the positioned layer, and without it the
   * faded sample drew over the pitch card.
   */
  export type LockedOverlayProps = Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> & {
    /** What is locked, as the pitch's heading. */
    title: string
    /** One line saying what the locked content would show. */
    message: string
    /** The way in: "Ask for access", "Finish setup". */
    action: Snippet
    /**
     * Sample content in the shape of the real thing. Blurred, inert and hidden
     * from assistive technology, so its made-up figures are never read as the
     * reader's own.
     */
    children: Snippet
  }
</script>

<script lang="ts">
  import LockIcon from '@lucide/svelte/icons/lock'

  import { cn } from '../../../utils/cn.js'
  import Card from '../../layout/card/card.svelte'
  import CardDescription from '../../layout/card/card-description.svelte'
  import CardFooter from '../../layout/card/card-footer.svelte'
  import CardHeader from '../../layout/card/card-header.svelte'
  import CardTitle from '../../layout/card/card-title.svelte'

  let { title, message, action, children, class: className, ...rest }: LockedOverlayProps = $props()
</script>

<div data-slot="locked-overlay" class={cn('grid h-full', className)} {...rest}>
  <div
    aria-hidden="true"
    inert
    data-slot="locked-overlay-sample"
    class="pointer-events-none col-start-1 row-start-1 self-start select-none opacity-60 blur-sm"
  >
    {@render children()}
  </div>
  <div class="relative col-start-1 row-start-1 flex items-center justify-center p-4">
    <Card class="w-full max-w-xs text-center">
      <CardHeader class="justify-items-center">
        <span
          class="bg-foreground/[0.07] text-muted-foreground flex size-10 items-center justify-center rounded-full"
        >
          <LockIcon class="size-5" />
        </span>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardFooter class="justify-center">{@render action()}</CardFooter>
    </Card>
  </div>
</div>
