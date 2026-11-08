<!--
  Origin: the React package 2.23.0 `input.tsx`, itself shadcn/ui new-york `input`
  Svelte: shadcn-svelte `input`
  Diverged: `bind:value` and, for type="file", `bind:files`, as shadcn-svelte
    has them. Classes unchanged.
-->
<script lang="ts" module>
  import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  type InputType = Exclude<HTMLInputTypeAttribute, 'file'>

  export type InputProps = WithElementRef<
    Omit<HTMLInputAttributes, 'type'> &
      ({ type: 'file'; files?: FileList } | { type?: InputType; files?: undefined })
  >

  const INPUT_CLASS = [
    'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground bg-input/50 h-9 w-full min-w-0 rounded-2xl border border-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
  ]
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    value = $bindable(),
    files = $bindable(),
    type,
    class: className,
    ...rest
  }: InputProps = $props()
</script>

{#if type === 'file'}
  <input
    bind:this={ref}
    bind:files
    bind:value
    type="file"
    data-slot="input"
    class={cn(INPUT_CLASS, className)}
    {...rest}
  >
{:else}
  <input
    bind:this={ref}
    bind:value
    {type}
    data-slot="input"
    class={cn(INPUT_CLASS, className)}
    {...rest}
  >
{/if}
