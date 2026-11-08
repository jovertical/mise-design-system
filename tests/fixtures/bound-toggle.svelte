<script lang="ts">
  import type { ToggleSize, ToggleVariant } from '../../src/lib/index.js'
  import { Toggle } from '../../src/lib/index.js'

  let {
    pressed = $bindable(false),
    variant,
    size,
    iconOnly,
    disabled = false,
  }: {
    pressed?: boolean
    variant?: ToggleVariant
    size?: ToggleSize
    iconOnly?: boolean
    disabled?: boolean
  } = $props()
</script>

<Toggle bind:pressed {variant} {size} {iconOnly} {disabled} aria-label="Late orders only">L</Toggle>
<output data-testid="state">{pressed ? 'on' : 'off'}</output>
