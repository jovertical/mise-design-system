<script lang="ts">
  import { SegmentedBar } from '@jovertical/mise-design-system'
</script>

<SegmentedBar
  class="w-[32rem]"
  segments={[
    { label: 'Adequate', value: 412, tone: 'success' },
    { label: 'Low', value: 63, tone: 'warning' },
    { label: 'Untracked', value: 96, tone: 'neutral' },
  ]}
/>
