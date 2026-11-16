<!-- Off, on, and both again disabled: a setting the viewer cannot change. -->
<script lang="ts">
  import { Switch } from '@jovertical/mise-design-system'
</script>

<Switch aria-label="Off" />
<Switch checked aria-label="On" />
<Switch disabled aria-label="Disabled, off" />
<Switch checked disabled aria-label="Disabled, on" />
