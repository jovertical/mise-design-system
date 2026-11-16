<!-- `InputGroupText` for a fixed unit or symbol rather than an interactive addon. -->
<script lang="ts">
  import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
  } from '@jovertical/mise-design-system'
</script>

<InputGroup class="max-w-xs">
  <InputGroupAddon><InputGroupText>$</InputGroupText></InputGroupAddon>
  <InputGroupInput placeholder="0.00" aria-label="Unit price" />
  <InputGroupAddon align="inline-end"><InputGroupText>USD</InputGroupText></InputGroupAddon>
</InputGroup>
