<!-- For the anatomy: the search group, a glyph addon and a clear button. -->
<script lang="ts">
  import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
  } from '@jovertical/mise-design-system'
  import IconSearch from '@tabler/icons-svelte-runes/icons/search'
  import IconX from '@tabler/icons-svelte-runes/icons/x'

  let search = $state('flour')
</script>

<InputGroup class="w-80">
  <InputGroupAddon><IconSearch class="size-4" /></InputGroupAddon>
  <InputGroupInput bind:value={search} placeholder="Search stock…" aria-label="Search stock" />
  <InputGroupAddon align="inline-end">
    <InputGroupButton size="icon-xs" aria-label="Clear" onclick={() => (search = '')}>
      <IconX class="size-3.5" />
    </InputGroupButton>
  </InputGroupAddon>
</InputGroup>
