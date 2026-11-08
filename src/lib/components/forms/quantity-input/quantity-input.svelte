<!--
  Origin: the React package 2.23.0 `quantity-input.tsx`
  Diverged: the amount is NumberInputField (`format="decimal"`), the field
    NumberInput is built on, for React's bare DecimalInput (round 6 plan,
    R6-4). `unit` and `quantity` are bindable, with `onUnitChange` and
    `onQuantityChange` kept; React's `onBlur` is `onQuantityBlur`, since it
    fires for the amount alone. `quantityStep` and `quantityMin` are numbers
    (React kept strings so no existing caller changed). `menuFooter` is a
    snippet handed `closeMenu`. The unit-first trigger shows bits-ui's
    SelectValue, which needs `items`, passed from `units`. Its addon drops the
    stock `pl-3`, so the trigger paints its fill out to the group's edge, as
    the comment on it says, rather than an inset pill inside the padding.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  /**
   * One unit a quantity can be expressed in.
   *
   * `label` names it, `short` is how it is written beside a number. Both are
   * needed because they answer different questions: choosing from a list
   * wants "Milliliter (ml)", the name disambiguated, and reading one back
   * wants "15 ml". `short` falls back to `value`, which is already the short
   * form for most unit sets.
   */
  export type QuantityUnit = {
    value: string
    label: string
    short?: string
    /** A heading the unit is listed under: "Mass", "Volume". First-seen order. */
    group?: string
  }

  /**
   * `unit-first` puts the more considered decision first, which is what a
   * stock movement wants: the unit governs what the number even means.
   * `quantity-first` is for everywhere the amount is the thing being revised
   * (a recipe line, a conversion), where "1250 g" is how the amount is written.
   */
  export type QuantityInputLayout = 'unit-first' | 'quantity-first'

  /**
   * An amount and the unit it is measured in, as one control.
   *
   * Two fields fused rather than two beside each other, because they are one
   * answer: a number without its unit is not a quantity, and a form that can
   * submit one without the other has a state nobody meant.
   */
  export type QuantityInputProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
    /**
     * The units on offer. A prop rather than a constant: a measurement enum is
     * domain, and a package that shipped one would ship an application's
     * contract.
     */
    units: readonly QuantityUnit[]
    layout?: QuantityInputLayout
    unit?: string
    quantity?: number | null
    onUnitChange?: (unit: string) => void
    onQuantityChange?: (quantity: number | null) => void
    /**
     * When the amount loses focus, for a caller that writes on commit rather
     * than on keystroke: "2" on the way to "25" is not an amount anybody meant.
     */
    onQuantityBlur?: () => void
    /**
     * A muted note beside a group's heading, keyed by the group's name: "needs
     * density" beside volume units for an item weighed by the gram. The units
     * stay pickable.
     */
    groupHints?: Readonly<Record<string, string>>
    /**
     * Something below the units in the open menu: a fact and an action, such
     * as "Density 0.92 g per ml · Edit". Handed `closeMenu`, because an action
     * there usually opens something else, and the menu has to go first.
     */
    menuFooter?: Snippet<[() => void]>
    unitPlaceholder?: string
    quantityPlaceholder?: string
    /** How far ↑ and ↓ move the amount. */
    quantityStep?: number
    quantityMin?: number
    /** The most decimal places the amount takes: `0` for a counted unit. No limit when absent. */
    quantityPrecision?: number
    /** Matches `Input`'s own scale. `sm` for a control inside a list row. */
    size?: 'sm' | 'md'
    disabled?: boolean
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import InputGroup from '../input-group/input-group.svelte'
  import InputGroupAddon from '../input-group/input-group-addon.svelte'
  import NumberInputField from '../number-input/number-input-field.svelte'
  import Select from '../select/select.svelte'
  import SelectContent from '../select/select-content.svelte'
  import SelectGroup from '../select/select-group.svelte'
  import SelectItem from '../select/select-item.svelte'
  import SelectLabel from '../select/select-label.svelte'
  import SelectSeparator from '../select/select-separator.svelte'
  import SelectTrigger from '../select/select-trigger.svelte'
  import SelectValue from '../select/select-value.svelte'

  let {
    units,
    layout = 'unit-first',
    unit = $bindable(''),
    quantity = $bindable(null),
    onUnitChange,
    onQuantityChange,
    onQuantityBlur,
    groupHints,
    menuFooter,
    unitPlaceholder = 'Unit',
    quantityPlaceholder = '1',
    quantityStep = 0.01,
    quantityMin = 0,
    quantityPrecision,
    size = 'md',
    disabled = false,
    class: className,
    ...rest
  }: QuantityInputProps = $props()

  // Held here so the footer can close the menu before whatever it opens takes
  // the screen.
  let menuOpen = $state(false)
  const closeMenu = () => {
    menuOpen = false
  }

  const items = $derived(units.map(({ value, label }) => ({ value, label })))
  const shortLabel = $derived(units.find((candidate) => candidate.value === unit)?.short ?? unit)
  const isGrouped = $derived(units.some((candidate) => candidate.group !== undefined))
  // Grouped in first-seen order rather than sorted, so the consumer, who knows
  // which kind of measure an item is counted in, puts that one first.
  const groupNames = $derived([...new Set(units.map((candidate) => candidate.group ?? ''))])
</script>

{#snippet option(candidate: QuantityUnit)}
  <SelectItem value={candidate.value} label={candidate.label} />
{/snippet}

{#snippet unitOptions()}
  {#if isGrouped}
    {#each groupNames as groupName, index (groupName || 'ungrouped')}
      <SelectGroup>
        {#if index > 0}
          <SelectSeparator />
        {/if}
        {#if groupName}
          <SelectLabel
            class="flex items-center justify-between gap-3 font-medium uppercase tracking-wide"
          >
            {groupName}
            {#if groupHints?.[groupName]}
              <span class="font-normal normal-case tracking-normal">{groupHints[groupName]}</span>
            {/if}
          </SelectLabel>
        {/if}
        {#each units.filter(
          (candidate) => (candidate.group ?? '') === groupName,
        ) as candidate (candidate.value)}
          {@render option(candidate)}
        {/each}
      </SelectGroup>
    {/each}
  {:else}
    {#each units as candidate (candidate.value)}
      {@render option(candidate)}
    {/each}
  {/if}
  {#if menuFooter}
    <div
      data-slot="quantity-input-menu-footer"
      class="text-muted-foreground mt-1 flex items-center justify-between gap-3 border-t px-2 pt-2 pb-1 text-xs"
    >
      {@render menuFooter(closeMenu)}
    </div>
  {/if}
{/snippet}

{#snippet quantityField()}
  <NumberInputField
    format="decimal"
    class="flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent"
    step={quantityStep > 0 ? quantityStep : 1}
    min={quantityMin}
    precision={quantityPrecision}
    placeholder={quantityPlaceholder}
    bind:value={quantity}
    onValueChange={onQuantityChange}
    onblur={() => onQuantityBlur?.()}
    {disabled}
  />
{/snippet}

<InputGroup
  data-slot="quantity-input"
  data-layout={layout}
  class={cn(size === 'sm' && 'h-8', className)}
  {...rest}
>
  {#if layout === 'quantity-first'}
    {@render quantityField()}

    <!-- A direct child of the group rather than an InputGroupAddon. The addon
         is built for something decorating a field, so it carries padding, a
         negative margin around a button and a click that forwards to the
         input: right for a decoration, wrong for a control that is half the
         field. -->
    <Select
      type="single"
      bind:value={unit}
      bind:open={menuOpen}
      onValueChange={onUnitChange}
      {items}
      {disabled}
    >
      <SelectTrigger
        {size}
        class="w-24 shrink-0 justify-between rounded-l-none rounded-r-2xl border-0 border-l border-l-input bg-input/40 px-3 text-foreground shadow-none! hover:bg-input/60 focus-visible:ring-0"
      >
        <!-- The short form beside the number; the open menu keeps the full
             label, because choosing a unit is the one moment its name matters. -->
        {#if unit}
          <span data-slot="select-value">{shortLabel}</span>
        {:else}
          <SelectValue placeholder={unitPlaceholder} />
        {/if}
      </SelectTrigger>
      <SelectContent>{@render unitOptions()}</SelectContent>
    </Select>
  {:else}
    <InputGroupAddon
      align="inline-start"
      class="w-2/3 justify-start overflow-hidden border-r py-0 pl-0"
    >
      <Select
        type="single"
        bind:value={unit}
        bind:open={menuOpen}
        onValueChange={onUnitChange}
        {items}
        {disabled}
      >
        <!-- The trigger carries the group's radius on the edge it sits against,
             because it paints the fill out to that edge. -->
        <SelectTrigger
          class="h-full w-full truncate rounded-l-2xl rounded-r-none border-0 text-left text-foreground shadow-none! focus:ring-0!"
        >
          <SelectValue placeholder={unitPlaceholder} />
        </SelectTrigger>
        <SelectContent>{@render unitOptions()}</SelectContent>
      </Select>
    </InputGroupAddon>

    {@render quantityField()}
  {/if}
</InputGroup>
