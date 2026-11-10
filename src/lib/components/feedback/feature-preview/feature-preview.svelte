<!--
  Origin: the React package 2.23.0 `feature-preview.tsx`
  Diverged: generic, per the round 5 triage (round 8 plan, R8-8): the React
    comments and stories pitched a pricing tier; here it is a preview of
    anything not yet available to the reader. `preview` and the actions are
    snippets. Spreads the rest onto the section, as every component does.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  /**
   * The page a reader lands on when a feature is not open to them yet, in
   * place of an error, so a locked page still says what it would do and how
   * to get it.
   *
   * `LockedOverlay` at page scale, so a locked page and a locked widget speak
   * one language: the real screen's shape, blurred and inert, full width, with
   * the pitch in a card centred over it. Not a modal behind a button: the
   * reader navigated here on purpose, and the pitch is the only thing on the
   * page. Every word comes from the caller; the component owns the layout.
   */
  export type FeaturePreviewProps = Omit<HTMLAttributes<HTMLElement>, 'title' | 'children'> & {
    /** The feature's name, as the page would title it: "Purchase orders". */
    title: string
    /** What the feature does, in one line. */
    headline: string
    /** Two or three concrete benefits. More turns the pitch into a manual. */
    benefits: readonly string[]
    /**
     * A static sample of the real screen, from made-up data, laid out as the
     * page would be. Blurred, inert and hidden from assistive technology: a
     * picture of the feature, never a working copy.
     */
    preview: Snippet
    /** The way in: "Turn on purchase orders". */
    primaryAction: Snippet
    /** Usually "Learn more". */
    secondaryAction?: Snippet
  }
</script>

<script lang="ts">
  import IconLock from '@tabler/icons-svelte-runes/icons/lock'

  import { cn } from '../../../utils/cn.js'
  import Card from '../../layout/card/card.svelte'
  import CardContent from '../../layout/card/card-content.svelte'
  import CardDescription from '../../layout/card/card-description.svelte'
  import CardFooter from '../../layout/card/card-footer.svelte'
  import CardHeader from '../../layout/card/card-header.svelte'
  import CardTitle from '../../layout/card/card-title.svelte'

  let {
    title,
    headline,
    benefits,
    preview,
    primaryAction,
    secondaryAction,
    class: className,
    ...rest
  }: FeaturePreviewProps = $props()
</script>

<section data-slot="feature-preview" class={cn('grid', className)} {...rest}>
  <div
    aria-hidden="true"
    inert
    data-slot="feature-preview-sample"
    class="pointer-events-none col-start-1 row-start-1 self-start select-none opacity-60 blur-sm"
  >
    {@render preview()}
  </div>
  <div class="relative col-start-1 row-start-1 flex items-center justify-center p-4">
    <Card class="w-full max-w-lg">
      <CardHeader class="justify-items-center text-center">
        <span
          class="bg-foreground/[0.07] text-muted-foreground flex size-10 items-center justify-center rounded-full"
        >
          <IconLock class="size-5" />
        </span>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{headline}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul
          class="text-muted-foreground marker:text-muted-foreground/60 flex list-disc flex-col gap-2 pl-5 text-sm"
        >
          {#each benefits as benefit (benefit)}
            <li>{benefit}</li>
          {/each}
        </ul>
      </CardContent>
      <CardFooter class="flex-wrap justify-center gap-2">
        {@render primaryAction()}
        {@render secondaryAction?.()}
      </CardFooter>
    </Card>
  </div>
</section>
