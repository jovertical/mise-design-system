<!--
  Origin: the React package 2.23.0 `combobox.tsx` (`Combobox`)
  Diverged: bits-ui Combobox for Base UI's, with `bind:value`, `bind:open` and a
    `type` that defaults to `single`. bits-ui does not filter: the caller keeps
    the typed text (ComboboxInput's `oninput`) and renders only the items that
    match, where Base UI filtered an `items` prop itself. Base UI's `Value`,
    `Collection` and `useComboboxAnchor` have no counterpart and are not
    ported; ComboboxContent's `customAnchor` takes the anchor's place.
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
   */
  export type ComboboxProps = (Omit<Single, 'type'> & { type?: 'single' }) | Multiple
</script>

<script lang="ts">
  import { setComboboxContext } from './combobox-context.js'

  let {
    open = $bindable(false),
    value = $bindable(),
    type = 'single',
    ...rest
  }: ComboboxProps = $props()

  setComboboxContext({
    get hasValue() {
      return Array.isArray(value) ? value.length > 0 : Boolean(value)
    },
    clear: () => {
      value = (type === 'multiple' ? [] : '') as never
    },
  })
</script>

<ComboboxPrimitive.Root bind:open bind:value={value as never} type={type as never} {...rest} />
