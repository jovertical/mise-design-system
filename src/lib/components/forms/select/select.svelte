<!--
  Origin: the React package 2.23.0 `select.tsx` (`Select`), itself shadcn/ui new-york `select`
  Svelte: shadcn-svelte `select`
  Diverged: bits-ui Select for Radix Select, with `bind:value` and `bind:open`.
    bits-ui needs a `type`; it defaults to `single`, the only kind React's Select had.
    `items` tells the closed trigger its label; see SelectProps.
-->
<script lang="ts" module>
  import { Select as SelectPrimitive } from 'bits-ui'

  type Root = SelectPrimitive.RootProps
  type Single = Extract<Root, { type: 'single' }>
  type Multiple = Extract<Root, { type: 'multiple' }>

  /**
   * Pass `items` (`{ value, label }[]`) so the trigger can show the selected
   * label while the list is closed. bits-ui learns an item's label only when
   * the item renders, and the list renders only when open. Radix kept hidden
   * items mounted for the same purpose.
   */
  export type SelectProps = (Omit<Single, 'type'> & { type?: 'single' }) | Multiple
</script>

<script lang="ts">
  let {
    open = $bindable(false),
    value = $bindable(),
    type = 'single',
    ...rest
  }: SelectProps = $props()
</script>

<SelectPrimitive.Root bind:open bind:value={value as never} type={type as never} {...rest} />
