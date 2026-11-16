<!--
  Open on the page, for the anatomy: no portal, so the list renders inside the
  stage under its trigger, and none of the hold an open list takes on the
  page (scroll lock, closing on Escape or an outside click).
-->
<script lang="ts">
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
  } from '@jovertical/mise-design-system'

  const SHIFTS = [
    { value: 'day', label: 'Day shift' },
    { value: 'night', label: 'Night shift' },
    { value: 'weekend', label: 'Weekend shift' },
  ]
</script>

<div class="h-72">
  <Select open value="day" items={SHIFTS}>
    <SelectTrigger class="w-56" aria-label="Shift">
      <SelectValue />
    </SelectTrigger>
    <SelectContent
      portalProps={{ disabled: true }}
      preventScroll={false}
      interactOutsideBehavior="ignore"
      escapeKeydownBehavior="ignore"
    >
      <SelectGroup>
        <SelectLabel>Weekdays</SelectLabel>
        <SelectItem value="day" label="Day shift" />
        <SelectItem value="night" label="Night shift" />
      </SelectGroup>
      <SelectSeparator />
      <SelectItem value="weekend" label="Weekend shift" />
    </SelectContent>
  </Select>
</div>
