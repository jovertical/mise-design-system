<!--
  Origin: the React package 2.23.0 `count-input.tsx`, `decimal-input.tsx` and `currency-input.tsx`, merged
  Diverged: the typing part of NumberInput, on its own, for a composite that
    owns the InputGroup (QuantityInput); it renders `InputGroupInput`, so the
    group's focus ring and error state find it. See NumberInput for the merge.
-->
<script lang="ts" module>
  import type { HTMLInputAttributes } from 'svelte/elements'

  import type { NumberInputFormat } from './number-input-math.js'

  /**
   * The field alone: a number typed into a text field, inside an `InputGroup`
   * the caller draws. `NumberInput` is this with its own group, buttons and
   * prefix; reach for the field only when composing another control.
   */
  export type NumberInputFieldProps = Omit<
    HTMLInputAttributes,
    'type' | 'value' | 'min' | 'max' | 'step' | 'prefix' | 'children' | 'files'
  > & {
    format?: NumberInputFormat
    value?: number | null
    onValueChange?: (value: number | null) => void
    min?: number
    max?: number
    step?: number
    precision?: number
    clearable?: boolean
    ref?: HTMLInputElement | null
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import InputGroupInput from '../input-group/input-group-input.svelte'
  import { add, clamp, INPUT_MODE, parse, placesFor, sanitize } from './number-input-math.js'

  let {
    ref = $bindable(null),
    value = $bindable(null),
    onValueChange,
    format = 'decimal',
    min = 0,
    max,
    step = 1,
    precision,
    clearable = true,
    class: className,
    oninput,
    onfocus,
    onblur,
    onkeydown,
    onmouseup,
    ...rest
  }: NumberInputFieldProps = $props()

  // The typed text while the field has focus; null otherwise.
  let draft = $state<string | null>(null)
  // A click focuses on mousedown and then places the caret on mouseup, undoing
  // the select-all. Set by focus, spent by the mouseup that follows.
  let selectingOnFocus = false

  const places = $derived(placesFor(format, precision))
  const isCurrency = $derived(format === 'currency')
  const textOf = (next: number) => (isCurrency ? (next / 100).toFixed(2) : String(next))
  const committed = $derived(value === null || value === undefined ? '' : textOf(value))

  /** Typed text, in the units it is shown in, to `value`'s units. */
  const toValue = (shown: number) => (isCurrency ? Math.round(shown * 100) : shown)

  function commit(next: number | null) {
    const settled = next === null && !clearable ? min : next

    value = settled

    onValueChange?.(settled)
  }

  const handleInput: NumberInputFieldProps['oninput'] = (event) => {
    const field = event.currentTarget
    const next = sanitize(field.value, min < 0, places)

    if (field.value !== next) field.value = next

    draft = next

    const parsed = parse(next)

    if (next === '') {
      if (clearable) commit(null)
    } else if (parsed !== null) {
      commit(clamp(toValue(parsed), min, max))
    }

    oninput?.(event)
  }

  const handleFocus: NumberInputFieldProps['onfocus'] = (event) => {
    draft = committed
    selectingOnFocus = true

    event.currentTarget.select()

    onfocus?.(event)
  }

  const handleMouseUp: NumberInputFieldProps['onmouseup'] = (event) => {
    if (selectingOnFocus) {
      event.preventDefault()

      selectingOnFocus = false
    }

    onmouseup?.(event)
  }

  const handleBlur: NumberInputFieldProps['onblur'] = (event) => {
    // An untouched draft commits nothing, so tabbing through a field holding an
    // out-of-range value does not quietly rewrite it.
    if (draft !== null && draft !== committed) {
      const parsed = parse(draft)

      commit(parsed === null ? null : clamp(toValue(parsed), min, max))
    }

    draft = null
    selectingOnFocus = false

    onblur?.(event)
  }

  const handleKeyDown: NumberInputFieldProps['onkeydown'] = (event) => {
    // Focus from the keyboard has no mouseup to spend the flag on, and a stale
    // one would swallow the next click meant to place the caret.
    selectingOnFocus = false

    onkeydown?.(event)

    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return

    event.preventDefault()

    const direction = event.key === 'ArrowUp' ? 1 : -1
    const current = parse(draft ?? committed)

    const next =
      current === null
        ? clamp(Math.max(min, 0), min, max)
        : clamp(add(toValue(current), direction * step * (event.shiftKey ? 10 : 1)), min, max)

    commit(next)

    draft = textOf(next)
  }
</script>

<InputGroupInput
  bind:ref
  type="text"
  inputmode={INPUT_MODE[format]}
  autocomplete="off"
  role="spinbutton"
  aria-valuenow={value ?? undefined}
  aria-valuetext={committed || undefined}
  aria-valuemin={min}
  aria-valuemax={max}
  data-format={format}
  class={cn('tabular-nums', className)}
  value={draft ?? committed}
  oninput={handleInput}
  onfocus={handleFocus}
  onblur={handleBlur}
  onkeydown={handleKeyDown}
  onmouseup={handleMouseUp}
  {...rest}
/>
