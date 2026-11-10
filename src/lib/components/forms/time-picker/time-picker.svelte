<!--
  Origin: the React package 2.23.0 `time-picker.tsx`
  Diverged: `value` is an `@internationalized/date` `Time`, bindable, with
    `onValueChange` for React's `onChange`, where React carried a JS `Date`
    whose date part passed through untouched (round 7 plan, R7-1, R7-6). A
    caller with a full datetime joins a DatePicker's day and this time. Spreads
    the rest onto the row, as every component does, except `id` and
    `aria-invalid`, which go on the hour select so a `FieldLabel` reaches it.
    Adds `hourCycle` (a 24-hour clock with no period select) and `minuteStep`,
    which React's lacked (bertos-bakery-ops' audit, 2026-11-10).
-->
<script lang="ts" module>
  import type { Time } from '@internationalized/date'
  import type { HTMLAttributes } from 'svelte/elements'

  /**
   * Three selects standing in for a clock: hour, minute, and AM/PM.
   *
   * There is no popover and no dial: these are schedule and shift-boundary
   * fields, not a stopwatch, and a row of selects reads faster than a dial for
   * "set this to 5:30 PM" while composing cleanly next to a `DatePicker`.
   *
   * A partial selection (only the hour picked, say) fills the rest from the
   * current value or 12:00 AM rather than emitting a half-formed time.
   *
   * The value is an `@internationalized/date` `Time`. `id` and `aria-invalid`
   * land on the hour select, so `<FieldLabel for>` focuses it and an invalid
   * field draws its border.
   */
  export type TimePickerProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
    value?: Time
    onValueChange?: (value: Time) => void
    disabled?: boolean
    /** `12` shows 1–12 and an AM/PM select; `24` shows 00–23 and no period. */
    hourCycle?: 12 | 24
    /**
     * The minutes listed, every `minuteStep` from 00. A value between steps
     * keeps its own minute listed, so loading it loses nothing.
     */
    minuteStep?: number
  }

  type Period = 'AM' | 'PM'

  const pad = (value: number) => value.toString().padStart(2, '0')
  const TWELVE_HOURS = Array.from({ length: 12 }, (_, index) => String(index + 1))
  const TWENTY_FOUR_HOURS = Array.from({ length: 24 }, (_, index) => pad(index))
  const PERIODS: Period[] = ['AM', 'PM']
  const toItems = (values: readonly string[]) => values.map((value) => ({ value, label: value }))
  const PERIOD_ITEMS = toItems(PERIODS)

  /** Every `step` minutes from 00, with `current` added in order when it falls between. */
  function minutesAt(step: number, current: string): string[] {
    const listed = Array.from({ length: Math.ceil(60 / step) }, (_, index) => pad(index * step))

    if (!current || listed.includes(current)) return listed

    return [...listed, current].sort()
  }
</script>

<script lang="ts">
  import { Time as TimeValue } from '@internationalized/date'

  import { cn } from '../../../utils/cn.js'
  import Select from '../select/select.svelte'
  import SelectContent from '../select/select-content.svelte'
  import SelectItem from '../select/select-item.svelte'
  import SelectTrigger from '../select/select-trigger.svelte'
  import SelectValue from '../select/select-value.svelte'

  let {
    value = $bindable(),
    onValueChange,
    disabled = false,
    hourCycle = 12,
    minuteStep = 1,
    id,
    'aria-invalid': ariaInvalid,
    class: className,
    ...rest
  }: TimePickerProps = $props()

  const twelveHour = $derived(hourCycle === 12)
  const hours = $derived(twelveHour ? TWELVE_HOURS : TWENTY_FOUR_HOURS)
  const hourItems = $derived(toItems(hours))

  const hour = $derived.by(() => {
    if (!value) return ''

    if (!twelveHour) return pad(value.hour)

    return String(value.hour % 12 === 0 ? 12 : value.hour % 12)
  })

  const minute = $derived(value ? pad(value.minute) : '')
  const minutes = $derived(minutesAt(minuteStep, minute))
  const minuteItems = $derived(toItems(minutes))
  const period = $derived<Period | ''>(value ? (value.hour >= 12 ? 'PM' : 'AM') : '')

  function toHours24(pickedHour: number, pickedPeriod: Period) {
    if (!twelveHour) return pickedHour

    return pickedPeriod === 'PM' ? (pickedHour % 12) + 12 : pickedHour % 12
  }

  function commit(next: { hour?: string; minute?: string; period?: Period }) {
    const nextHour = Number(next.hour ?? (hour || (twelveHour ? '12' : '0')))
    const nextMinute = Number(next.minute ?? (minute || '0'))
    const nextPeriod = next.period ?? (period || 'AM')
    const time = new TimeValue(toHours24(nextHour, nextPeriod), nextMinute)

    value = time

    onValueChange?.(time)
  }
</script>

<div data-slot="time-picker" class={cn('flex items-center gap-2', className)} {...rest}>
  <Select
    type="single"
    value={hour}
    items={hourItems}
    {disabled}
    onValueChange={(picked) => commit({ hour: picked })}
  >
    <SelectTrigger
      id={id ?? undefined}
      aria-invalid={ariaInvalid}
      class="w-[72px]"
      aria-label="Hour"
    >
      <SelectValue placeholder="--" />
    </SelectTrigger>
    <SelectContent>
      {#each hours as option (option)}
        <SelectItem value={option} label={option} />
      {/each}
    </SelectContent>
  </Select>

  <span class="text-muted-foreground">:</span>

  <Select
    type="single"
    value={minute}
    items={minuteItems}
    {disabled}
    onValueChange={(picked) => commit({ minute: picked })}
  >
    <SelectTrigger class="w-[72px]" aria-label="Minute">
      <SelectValue placeholder="--" />
    </SelectTrigger>
    <SelectContent>
      {#each minutes as option (option)}
        <SelectItem value={option} label={option} />
      {/each}
    </SelectContent>
  </Select>

  {#if twelveHour}
    <Select
      type="single"
      value={period}
      items={PERIOD_ITEMS}
      {disabled}
      onValueChange={(picked) => commit({ period: picked as Period })}
    >
      <SelectTrigger class="w-[76px]" aria-label="AM or PM">
        <SelectValue placeholder="AM" />
      </SelectTrigger>
      <SelectContent>
        {#each PERIODS as option (option)}
          <SelectItem value={option} label={option} />
        {/each}
      </SelectContent>
    </Select>
  {/if}
</div>
