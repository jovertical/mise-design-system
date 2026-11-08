<!--
  Origin: the React package 2.23.0 `choice-row.tsx` (`ChoiceRow`)
  Diverged: React's `htmlFor` is `for`, and `control` and `media` are snippets.
    Spreads the rest onto the root, as every component does.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  /**
   * A bordered row that is entirely clickable and highlights when its control
   * is checked.
   *
   * The highlight is `has-[[data-state=checked]]` rather than a prop, so the
   * row follows whichever control it was handed without being told which one
   * that is or what its value means.
   *
   * The control is `pointer-events-none`, and that is load-bearing. A
   * `<label>` forwards its clicks to the labelable element it names, and a
   * control inside that label is also hit directly, so a click on the control
   * both activates it and bubbles to the label, which activates it again.
   * Radio survives that because selecting an already-selected radio is a
   * no-op; a checkbox does not, and toggles straight back. Taking pointer
   * events off the control leaves exactly one path in. Keyboard focus and
   * space are unaffected, because neither is a pointer event.
   *
   * **The control leads, unless there is `media`; then it trails.** A leading
   * control gives a column of rows one left edge to scan. Media takes that
   * edge over: an avatar is larger and carries colour, so beside a radio it
   * wins the eye and the row ends up with two competing left-hand columns.
   * Trailing it splits the row into identity on the left and state on the
   * right, as iOS selection lists and Material 3's trailing control do.
   * Derived from `media` rather than taken as a prop, so a whole product gets
   * one layout.
   */
  export type ChoiceRowProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
    /** Must match the control's own `id`, or the row will not forward its click. */
    for: string
    /** A `RadioGroupItem`, a `Checkbox`: anything bits-ui drives with `data-state`. */
    control: Snippet
    /**
     * Sits between the control and the label: an avatar, a logo, a product
     * thumbnail. For identifying *who or what* the row is about, where the
     * control says whether it is chosen. Not an icon chip: a row of glyphs
     * beside a row of radios reads as two controls.
     *
     * Passing this **moves the control to the trailing edge**.
     */
    media?: Snippet
    label: string
    description?: string
    /** A short qualifier beside the label: "Coming soon", "Recommended". */
    badge?: string
    disabled?: boolean
    /** Revealed under the row, outside the label, inside the same border. */
    children?: Snippet
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import Badge from '../../data-display/badge/badge.svelte'

  let {
    for: htmlFor,
    control,
    media,
    label,
    description,
    badge,
    disabled = false,
    class: className,
    children,
    ...rest
  }: ChoiceRowProps = $props()
</script>

<div
  data-slot="choice-row"
  class={cn(
    'rounded-2xl border transition-colors',
    'border-border bg-muted/40',
    'has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5',
    disabled && 'opacity-60',
    className,
  )}
  {...rest}
>
  <label
    for={htmlFor}
    class={cn(
      'flex w-full items-start gap-3 p-4',
      disabled ? 'cursor-not-allowed' : 'cursor-pointer',
    )}
  >
    <!-- Leading: aligned to the label's first line, because that is the text it
         names. Trailing: centred against the row, which is how a state column
         on the right reads. -->
    {#if !media}
      <span class="pointer-events-none mt-0.5 flex shrink-0">{@render control()}</span>
    {:else}
      <!-- Pointer events off for the same reason as the control: a click landing
           on media inside the label would bubble and arrive twice. -->
      <span class="pointer-events-none flex shrink-0"> {@render media()} </span>
    {/if}

    <span class="min-w-0 flex-1">
      <span class="flex flex-wrap items-center gap-2">
        <span class="text-sm font-medium">{label}</span>
        {#if badge}
          <Badge>{badge}</Badge>
        {/if}
      </span>

      {#if description}
        <span class="text-muted-foreground mt-0.5 block text-sm">{description}</span>
      {/if}
    </span>

    {#if media}
      <span class="pointer-events-none flex shrink-0 self-center">{@render control()}</span>
    {/if}
  </label>

  {#if children}
    <!-- Outside the label, or a click anywhere in here would toggle the row. -->
    <div class="border-border/60 border-t px-4 py-4">{@render children()}</div>
  {/if}
</div>
