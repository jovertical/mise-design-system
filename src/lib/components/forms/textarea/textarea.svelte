<!--
  Origin: the React package 2.23.0 `textarea.tsx`, itself shadcn/ui new-york `textarea`
  Svelte: shadcn-svelte `textarea`
  Diverged: `bind:value` replaces React's controlled and uncontrolled pair, so
    the counter reads the bound value and needs no mirrored length. The limits
    are the native `maxlength` / `minlength`, as Svelte spells them.
-->
<script lang="ts" module>
  import type { HTMLTextareaAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * A counter appears only when `maxlength` is set: a bare number counts up
   * towards nothing. `maxlength` stops typing at the ceiling, so falling under
   * `minlength` is the only reachable invalid state, and only once something
   * has been typed. An untouched optional field is not wrong.
   */
  export type TextareaProps = WithElementRef<HTMLTextareaAttributes, HTMLTextAreaElement>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    value = $bindable(),
    maxlength,
    minlength,
    class: className,
    ...rest
  }: TextareaProps = $props()

  const length = $derived(String(value ?? '').length)
  const isBelowMinimum = $derived(
    minlength !== undefined && minlength !== null && length > 0 && length < minlength,
  )
</script>

{#snippet field()}
  <textarea
    bind:this={ref}
    bind:value
    data-slot="textarea"
    {maxlength}
    {minlength}
    class={cn(
      'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-input/50 flex field-sizing-content min-h-16 w-full rounded-2xl border border-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
      className,
    )}
    {...rest}
  ></textarea>
{/snippet}

{#if maxlength === undefined || maxlength === null}
  {@render field()}
{:else}
  <div class="flex w-full flex-col gap-1">
    {@render field()}
    <span
      aria-live="polite"
      class={cn(
        'text-muted-foreground self-end text-xs tabular-nums',
        isBelowMinimum && 'text-destructive',
      )}
    >
      {isBelowMinimum ? `${length} / ${minlength} minimum` : `${length} / ${maxlength}`}
    </span>
  </div>
{/if}
