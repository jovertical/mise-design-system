<!--
  Origin: the React package 2.23.0 `combobox.tsx` (`Combobox`)
  Diverged: bits-ui Combobox for Base UI's, with `bind:value`, `bind:open` and a
    `type` that defaults to `single`. bits-ui does not filter: the caller keeps
    the typed text (ComboboxInput's `oninput`) and renders only the items that
    match, where Base UI filtered an `items` prop itself. Base UI's `Value`,
    `Collection` and `useComboboxAnchor` have no counterpart and are not
    ported; ComboboxContent's `customAnchor` takes the anchor's place.
    `allowCustomValue` makes the typed text the value, for a field whose items
    are suggestions (bertos-bakery-ops' audit, 2026-11-10).
-->
<script lang="ts" module>
  import { Combobox as ComboboxPrimitive } from 'bits-ui'

  type Root = ComboboxPrimitive.RootProps
  type Single = Extract<Root, { type: 'single' }>
  type Multiple = Extract<Root, { type: 'multiple' }>

  /**
   * A searchable select: typing into the field narrows the list. Reach for it
   * where the list is long enough that scanning it is slower than typing (a
   * category picker over hundreds of rows), not a five-option status field,
   * which stays a `Select`.
   *
   * Pass `items` (`{ value, label }[]`) so the field can show the selected
   * label while the list is closed, as `Select` does.
   *
   * `allowCustomValue` (single only) turns the items into suggestions: the
   * typed text is the value as it is typed and stays when the field loses
   * focus, and choosing an item sets it to that item's value, so give each
   * suggestion its label as its value.
   */
  export type ComboboxProps =
    | (Omit<Single, 'type'> & { type?: 'single'; allowCustomValue?: boolean })
    | (Multiple & { allowCustomValue?: never })
</script>

<script lang="ts">
  import { setComboboxContext } from './combobox-context.js'

  let {
    open = $bindable(false),
    value = $bindable(),
    type = 'single',
    allowCustomValue = false,
    ...rest
  }: ComboboxProps = $props()

  const report = $derived(rest.onValueChange as ((next: string) => void) | undefined)

  setComboboxContext({
    get hasValue() {
      return Array.isArray(value) ? value.length > 0 : Boolean(value)
    },
    clear: () => {
      value = (type === 'multiple' ? [] : '') as never
    },
    get allowCustomValue() {
      return allowCustomValue && type === 'single'
    },
    get text() {
      return typeof value === 'string' ? value : ''
    },
    setText: (text: string) => {
      value = text as never

      report?.(text)
    },
  })
</script>

<ComboboxPrimitive.Root bind:open bind:value={value as never} type={type as never} {...rest} />
