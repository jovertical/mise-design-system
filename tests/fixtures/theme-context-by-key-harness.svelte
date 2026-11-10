<script lang="ts">
  import { setContext } from 'svelte'

  import { ThemeState, ThemeToggle } from '../../src/lib/index.js'

  // As another copy of mise would set it: the same registered symbol, not this module's.
  setContext(Symbol.for('mise-theme'), new ThemeState('mise-test-theme', 'dark'))
</script>

<ThemeToggle />
