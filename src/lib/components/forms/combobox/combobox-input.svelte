<!--
  Origin: the React package 2.23.0 `combobox.tsx` (`ComboboxInput`)
  Diverged: Lucide's chevron-down and x for Tabler's. The clear button is
    drawn here from the root's context rather than as Base UI's `Clear`; like
    it, it shows only while there is a value, and it empties the typed text
    too, through an `input` event the caller's filter hears.
-->
<script lang="ts" module>
  import { Combobox as ComboboxPrimitive } from 'bits-ui'
  import type { Snippet } from 'svelte'

  import type { WithoutChild } from '../../../utils/types.js'

  /**
   * The field: an `InputGroup` with the typed text, the chevron that opens the
   * list, and optionally a clear button that takes the chevron's place while
   * there is a value. `children` render inside the group, after the addon.
   */
  export type ComboboxInputProps = Omit<WithoutChild<ComboboxPrimitive.InputProps>, 'children'> & {
    showTrigger?: boolean
    showClear?: boolean
    children?: Snippet
  }
</script>

<script lang="ts">
  import ChevronDownIcon from '@lucide/svelte/icons/chevron-down'
  import XIcon from '@lucide/svelte/icons/x'

  import { cn } from '../../../utils/cn.js'
  import InputGroup from '../input-group/input-group.svelte'
  import InputGroupAddon from '../input-group/input-group-addon.svelte'
  import InputGroupButton from '../input-group/input-group-button.svelte'
  import InputGroupInput from '../input-group/input-group-input.svelte'
  import { getComboboxContext } from './combobox-context.js'

  let {
    ref = $bindable(null),
    disabled = false,
    showTrigger = true,
    showClear = false,
    class: className,
    children,
    ...rest
  }: ComboboxInputProps = $props()

  const combobox = getComboboxContext()

  function clear() {
    combobox?.clear()
    if (!(ref instanceof HTMLInputElement)) return
    ref.value = ''
    ref.dispatchEvent(new Event('input', { bubbles: true }))
    ref.focus()
  }
</script>

<InputGroup class={cn('w-auto', className)}>
  <ComboboxPrimitive.Input bind:ref {disabled} {...rest}>
    {#snippet child({ props })}
      <InputGroupInput {...props} {disabled} />
    {/snippet}
  </ComboboxPrimitive.Input>
  <InputGroupAddon align="inline-end">
    {#if showTrigger}
      <ComboboxPrimitive.Trigger {disabled}>
        {#snippet child({ props })}
          <InputGroupButton
            {...props}
            size="icon-xs"
            variant="ghost"
            data-slot="input-group-button"
            class="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent [&_svg:not([class*='size-'])]:size-4"
            {disabled}
          >
            <ChevronDownIcon
              data-slot="combobox-trigger-icon"
              class="text-muted-foreground pointer-events-none size-4"
            />
          </InputGroupButton>
        {/snippet}
      </ComboboxPrimitive.Trigger>
    {/if}
    {#if showClear && combobox?.hasValue}
      <InputGroupButton
        data-slot="combobox-clear"
        variant="ghost"
        size="icon-xs"
        aria-label="Clear"
        {disabled}
        onclick={clear}
      >
        <XIcon class="pointer-events-none" />
      </InputGroupButton>
    {/if}
  </InputGroupAddon>
  {@render children?.()}
</InputGroup>
