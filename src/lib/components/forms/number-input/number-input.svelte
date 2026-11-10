<!--
  Origin: the React package 2.23.0 `count-input.tsx`, `decimal-input.tsx` and `currency-input.tsx`, merged
  Diverged: one component for React's CountInput, DecimalInput and
    CurrencyInput, chosen with `format` (round 6 plan, R6-3). `value` is
    bindable and always `number | null`, with `onValueChange` for React's
    `onChange`. `clearable` defaults to `true` for every format, so an emptied
    count commits `null` unless `clearable={false}`, CountInput's default. The −
    and + buttons are `controls`, off by default. Currency has no default
    symbol (React's was ₱); `prefix` takes one. Every format selects its text on
    focus and steps ten times as far with Shift, as DecimalInput did. A pasted
    comma is dropped as a thousands separator, as DecimalInput dropped it: `.`
    is the only decimal point either package reads. The typing is
    NumberInputField, which QuantityInput composes. With controls the field is
    capped with `max-w-32` rather than React's `w-32`, which Field's
    `[&>*]:w-full` overrode, stretching it across the form.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'

  import type { NumberInputFieldProps } from './number-input-field.svelte'

  /**
   * A number typed into a text field, never `type="number"`: the native one
   * has 8px spinners drawn differently in every engine, a scroll wheel that
   * changes a quantity under a passing pointer, "1e" accepted as a number in
   * progress, and a selection API that throws.
   *
   * A keystroke that is not a digit, the one decimal point or a leading minus
   * the floor allows is dropped. While the field has focus the operator owns
   * what is in it, so "0." and "-" survive the keystroke that makes them; each
   * keystroke that reads as a number is reported, clamped, and blur settles the
   * draft. Focus selects the whole value, because the common edit is replacing
   * it. ↑ and ↓ step, Shift ten times as far.
   *
   * `null` is an empty field, not zero: right for a weight or a price, where
   * blank means "not recorded" and zero would claim something.
   */
  export type NumberInputProps = NumberInputFieldProps & {
    /**
     * `integer` takes whole numbers; `decimal` takes up to `precision` places;
     * `currency` speaks minor units: `value` is an integer count of cents,
     * shown with two places, and only two can be typed, because a third has no
     * cent to land in. Everything crossing the boundary is then an integer, the
     * units an API uses, and no price arrives as 19.99 and leaves as
     * 1998.9999999999998.
     */
    format?: NumberInputFieldProps['format']
    /** The floor, in `value`'s units. A negative one lets a minus sign be typed. */
    min?: number
    /** No ceiling when absent. */
    max?: number
    /** How far ↑, ↓ and the buttons move it, in `value`'s units. */
    step?: number
    /** The most decimal places `decimal` takes. No limit when absent. */
    precision?: number
    /**
     * An emptied field commits `null`. Off, it commits `min`: for a count where
     * zero is a real answer and the field should never be blank.
     */
    clearable?: boolean
    /**
     * − and + either side, inside the field's own fill, so it reads as one
     * control beside the plain inputs around it. Each disables at its end of
     * the range.
     */
    controls?: boolean
    /** Ahead of the number: a currency symbol, a unit. */
    prefix?: string | Snippet
  }
</script>

<script lang="ts">
  import IconMinus from '@tabler/icons-svelte-runes/icons/minus'
  import IconPlus from '@tabler/icons-svelte-runes/icons/plus'

  import { cn } from '../../../utils/cn.js'
  import InputGroup from '../input-group/input-group.svelte'
  import InputGroupAddon from '../input-group/input-group-addon.svelte'
  import InputGroupButton from '../input-group/input-group-button.svelte'
  import InputGroupText from '../input-group/input-group-text.svelte'
  import NumberInputField from './number-input-field.svelte'
  import { add, clamp } from './number-input-math.js'

  let {
    ref = $bindable(null),
    value = $bindable(null),
    onValueChange,
    format = 'decimal',
    min = 0,
    max,
    step = 1,
    clearable = true,
    controls = false,
    prefix,
    disabled,
    class: className,
    'aria-label': ariaLabel,
    ...rest
  }: NumberInputProps = $props()

  const isEmpty = $derived(value === null || value === undefined)
  const isAtMin = $derived(isEmpty || (value as number) <= min)
  const isAtMax = $derived(max !== undefined && !isEmpty && (value as number) >= max)

  function pressStep(direction: 1 | -1) {
    // An empty field has nothing to step down from; stepping up starts it at the floor.
    if (isEmpty && direction === -1) return

    const next = isEmpty
      ? clamp(Math.max(min, 0), min, max)
      : clamp(add(value as number, direction * step), min, max)

    value = next

    onValueChange?.(next)
  }
</script>

<InputGroup
  data-slot="number-input"
  data-format={format}
  data-disabled={disabled}
  class={cn(controls && 'max-w-32', className)}
>
  {#if controls}
    <!-- The addons' stock negative margin pulls a button past the group's
         edge, which overflows a scrolling form when the field sits against its
         side. Padding alone seats the buttons inside the fill. -->
    <InputGroupAddon align="inline-start" class="pl-1.5 has-[>button]:ml-0">
      <InputGroupButton
        size="icon-xs"
        aria-label={ariaLabel ? `Decrease ${ariaLabel}` : 'Decrease'}
        disabled={disabled || isAtMin}
        onclick={() => pressStep(-1)}
      >
        <IconMinus />
      </InputGroupButton>
    </InputGroupAddon>
  {/if}

  {#if prefix}
    <InputGroupAddon align="inline-start">
      {#if typeof prefix === 'string'}
        <InputGroupText>{prefix}</InputGroupText>
      {:else}
        {@render prefix()}
      {/if}
    </InputGroupAddon>
  {/if}

  <NumberInputField
    bind:ref
    bind:value
    {onValueChange}
    {format}
    {min}
    {max}
    {step}
    {clearable}
    {disabled}
    aria-label={ariaLabel}
    class={controls ? 'text-center' : undefined}
    {...rest}
  />

  {#if controls}
    <InputGroupAddon align="inline-end" class="pr-1.5 has-[>button]:mr-0">
      <InputGroupButton
        size="icon-xs"
        aria-label={ariaLabel ? `Increase ${ariaLabel}` : 'Increase'}
        disabled={disabled || isAtMax}
        onclick={() => pressStep(1)}
      >
        <IconPlus />
      </InputGroupButton>
    </InputGroupAddon>
  {/if}
</InputGroup>
