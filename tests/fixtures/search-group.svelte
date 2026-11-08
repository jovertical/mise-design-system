<script lang="ts">
  import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
  } from '../../src/lib/index.js'

  let { value = $bindable('flour') }: { value?: string } = $props()
</script>

<InputGroup>
  <InputGroupAddon><InputGroupText>Find</InputGroupText></InputGroupAddon>
  <InputGroupInput placeholder="Search stock" aria-label="Search stock" bind:value />
  <InputGroupAddon align="inline-end">
    <InputGroupButton size="icon-xs" aria-label="Clear" onclick={() => (value = '')}>
      ×
    </InputGroupButton>
  </InputGroupAddon>
</InputGroup>
<output data-testid="value">{value}</output>
