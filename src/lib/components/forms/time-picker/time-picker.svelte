<!--
  Origin: the React package 2.23.0 `time-picker.tsx`
  Diverged: `value` is an `@internationalized/date` `Time`, bindable, with
    `onValueChange` for React's `onChange`, where React carried a JS `Date`
    whose date part passed through untouched (round 7 plan, R7-1, R7-6). A
    caller with a full datetime joins a DatePicker's day and this time. Spreads
    the rest onto the row, as every component does.
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
   */
  export type TimePickerProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
    value?: Time
    onValueChange?: (value: Time) => void
    disabled?: boolean
  }

  type Period = 'AM' | 'PM'

  const pad = (n: number) => n.toString().padStart(2, '0')
  const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1))
  const MINUTES = Array.from({ length: 60 }, (_, i) => pad(i))
  const PERIODS: Period[] = ['AM', 'PM']
  const toItems = (values: readonly string[]) => values.map((value) => ({ value, label: value }))
  const HOUR_ITEMS = toItems(HOURS)
  const MINUTE_ITEMS = toItems(MINUTES)
  const PERIOD_ITEMS = toItems(PERIODS)
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
    class: className,
    ...rest
  }: TimePickerProps = $props()

  const hour = $derived(value ? String(value.hour % 12 === 0 ? 12 : value.hour % 12) : '')
  const minute = $derived(value ? pad(value.minute) : '')
  const period = $derived<Period | ''>(value ? (value.hour >= 12 ? 'PM' : 'AM') : '')

  function commit(next: { hour?: string; minute?: string; period?: Period }) {
    const nextHour = Number(next.hour ?? (hour || '12'))
    const nextMinute = Number(next.minute ?? (minute || '0'))
    const nextPeriod = next.period ?? (period || 'AM')
    const hours24 = nextPeriod === 'PM' ? (nextHour % 12) + 12 : nextHour % 12
    const time = new TimeValue(hours24, nextMinute)
    value = time
    onValueChange?.(time)
  }
</script>

<div data-slot="time-picker" class={cn('flex items-center gap-2', className)} {...rest}>
  <Select
    type="single"
    value={hour}
    items={HOUR_ITEMS}
    {disabled}
    onValueChange={(picked) => commit({ hour: picked })}
  >
    <SelectTrigger class="w-[72px]" aria-label="Hour">
      <SelectValue placeholder="--" />
    </SelectTrigger>
    <SelectContent>
      {#each HOURS as option (option)}
        <SelectItem value={option} label={option} />
      {/each}
    </SelectContent>
  </Select>

  <span class="text-muted-foreground">:</span>

  <Select
    type="single"
    value={minute}
    items={MINUTE_ITEMS}
    {disabled}
    onValueChange={(picked) => commit({ minute: picked })}
  >
    <SelectTrigger class="w-[72px]" aria-label="Minute">
      <SelectValue placeholder="--" />
    </SelectTrigger>
    <SelectContent>
      {#each MINUTES as option (option)}
        <SelectItem value={option} label={option} />
      {/each}
    </SelectContent>
  </Select>

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
</div>
