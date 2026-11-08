<!--
  Origin: the React package 2.23.0 `field.tsx` (`FieldError`), itself shadcn/ui new-york `field`
  Svelte: shadcn-svelte `field`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * The field's error, announced as an alert. Children win; otherwise
   * `errors` is de-duplicated by message, one shown as text and several as a
   * list. Nothing renders when there is nothing to say.
   */
  export type FieldErrorProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    errors?: Array<{ message?: string } | undefined>
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    errors,
    class: className,
    children,
    ...rest
  }: FieldErrorProps = $props()

  const messages = $derived([
    ...new Set((errors ?? []).map((error) => error?.message).filter((message) => !!message)),
  ] as string[])
</script>

{#if children || messages.length > 0}
  <div
    bind:this={ref}
    role="alert"
    data-slot="field-error"
    class={cn('text-destructive text-sm font-normal', className)}
    {...rest}
  >
    {#if children}
      {@render children()}
    {:else if messages.length === 1}
      {messages[0]}
    {:else}
      <ul class="ml-4 flex list-disc flex-col gap-1">
        {#each messages as message}
          <li>{message}</li>
        {/each}
      </ul>
    {/if}
  </div>
{/if}
