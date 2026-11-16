<!--
  The clock a team reads: 12-hour with AM/PM, or 24-hour with no period.
  `minuteStep` lists only the minutes a schedule uses.
-->
<script lang="ts">
  import { Time } from '@internationalized/date'
  import { TimePicker } from '@jovertical/mise-design-system'
</script>

<div class="flex flex-col items-center gap-4">
  <TimePicker value={new Time(17, 30)} />
  <TimePicker hourCycle={24} value={new Time(17, 30)} />
  <TimePicker hourCycle={24} minuteStep={15} value={new Time(17, 30)} />
</div>
