<!-- An hour and a minute, pre-filled to a shift boundary. The value is an @internationalized/date Time. -->
<script lang="ts">
  import { Time } from '@internationalized/date'
  import { TimePicker } from '@jovertical/mise-design-system'

  let value: Time | undefined = $state(new Time(17, 30))
</script>

<TimePicker bind:value />
