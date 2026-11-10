<!--
  Origin: mise
  Diverged: none. MonthPicker's popover body: the year with its arrows, and the
    twelve months as a 3×4 grid. Not exported; MonthPicker draws it.
-->
<script lang="ts" module>
  import type { DateValue } from '@internationalized/date'

  export type MonthPickerGridProps = {
    year: number
    selected?: DateValue
    minValue?: DateValue
    maxValue?: DateValue
    locale: string
    onYearChange: (year: number) => void
    onPick: (year: number, month: number) => void
  }

  /** Arrow keys move one month across, three (a row) up and down. */
  const STEPS: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -3, ArrowDown: 3 }
</script>

<script lang="ts">
  import IconChevronLeft from '@tabler/icons-svelte-runes/icons/chevron-left'
  import IconChevronRight from '@tabler/icons-svelte-runes/icons/chevron-right'

  import { cn } from '../../../utils/cn.js'
  import { buttonVariants } from '../../actions/button/button-variants.js'
  import { isMonthOutside, shortMonthNames } from './month-picker-months.js'

  let { year, selected, minValue, maxValue, locale, onYearChange, onPick }: MonthPickerGridProps =
    $props()

  let grid = $state<HTMLElement | null>(null)

  const names = $derived(shortMonthNames(locale))
  const previousBlocked = $derived(isMonthOutside(year - 1, 12, minValue, maxValue))
  const nextBlocked = $derived(isMonthOutside(year + 1, 1, minValue, maxValue))

  const isSelected = (month: number) => selected?.year === year && selected?.month === month

  function moveFocus(event: KeyboardEvent) {
    const step = STEPS[event.key]

    if (!step || !grid) return

    const months = [...grid.querySelectorAll<HTMLButtonElement>('[data-slot="month-picker-month"]')]
    const current = months.indexOf(document.activeElement as HTMLButtonElement)
    const target = months[current + step]

    if (current === -1 || !target) return

    event.preventDefault()

    target.focus()
  }
</script>

<div class="flex w-64 flex-col gap-3 p-3">
  <div class="flex items-center justify-between">
    <button
      type="button"
      aria-label="Previous year"
      disabled={previousBlocked}
      class={cn(buttonVariants({ variant: 'ghost', iconOnly: true, size: 'sm' }))}
      onclick={() => onYearChange(year - 1)}
    >
      <IconChevronLeft class="size-4" />
    </button>
    <span data-slot="month-picker-year" class="text-sm font-medium">{year}</span>
    <button
      type="button"
      aria-label="Next year"
      disabled={nextBlocked}
      class={cn(buttonVariants({ variant: 'ghost', iconOnly: true, size: 'sm' }))}
      onclick={() => onYearChange(year + 1)}
    >
      <IconChevronRight class="size-4" />
    </button>
  </div>

  <div bind:this={grid} data-slot="month-picker-grid" class="grid grid-cols-3 gap-1">
    {#each names as name, index (name)}
      {@const month = index + 1}
      <button
        type="button"
        data-slot="month-picker-month"
        data-selected={isSelected(month) ? '' : undefined}
        aria-pressed={isSelected(month)}
        disabled={isMonthOutside(year, month, minValue, maxValue)}
        class={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'w-full font-normal data-[selected]:bg-primary data-[selected]:text-primary-foreground',
        )}
        onclick={() => onPick(year, month)}
        onkeydown={moveFocus}
      >
        {name}
      </button>
    {/each}
  </div>
</div>
