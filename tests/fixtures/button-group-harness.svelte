<script lang="ts">
  import {
    Button,
    ButtonGroup,
    type ButtonGroupOrientation,
    ButtonGroupSeparator,
    ButtonGroupText,
  } from '../../src/lib/index.js'

  let { orientation }: { orientation?: ButtonGroupOrientation } = $props()
</script>

<ButtonGroup {orientation} aria-label="Range">
  <ButtonGroupText>$</ButtonGroupText>
  <ButtonGroupSeparator />
  <Button variant="outline">Day</Button>
  <Button variant="outline">Week</Button>
</ButtonGroup>
