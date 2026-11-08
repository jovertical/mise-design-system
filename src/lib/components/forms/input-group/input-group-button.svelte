<!--
  Origin: the React package 2.23.0 `input-group.tsx` (`InputGroupButton`), itself shadcn/ui new-york `input-group`
  Svelte: shadcn-svelte `input-group`
  Diverged: React's `render` prop, which cloned an element, has no Svelte
    equivalent and is dropped, as `asChild` is.
-->
<script lang="ts" module>
  import type { ButtonProps } from '../../actions/button/button.svelte'
  import type { InputGroupButtonSize } from './input-group-variants.js'

  export type InputGroupButtonProps = Omit<ButtonProps, 'size'> & {
    size?: InputGroupButtonSize
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import Button from '../../actions/button/button.svelte'
  import { inputGroupButtonVariants } from './input-group-variants.js'

  let {
    ref = $bindable(null),
    type = 'button',
    variant = 'ghost',
    size = 'xs',
    class: className,
    ...rest
  }: InputGroupButtonProps = $props()
</script>

<Button
  bind:ref
  {type}
  {variant}
  data-size={size}
  data-slot="input-group-button"
  class={cn(inputGroupButtonVariants({ size }), className)}
  {...rest}
/>
