<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { toast } from 'svelte-sonner'

  import Button from '../../actions/button/button.svelte'
  import Toaster from './sonner.svelte'

  const { Story } = defineMeta({
    title: 'Feedback/Toaster',
    component: Toaster,
    tags: ['shadcn'],
    parameters: { layout: 'centered' },
  })

  function showTypes() {
    return {
      success: () => toast.success('Payment recorded'),
      info: () => toast.info('Sync will run at midnight'),
      warning: () => toast.warning('Stock is running low'),
      error: () => toast.error('Card was declined'),
      loading: () => toast.loading('Syncing location prices…'),
    }
  }

  const types = showTypes()

  function submitOrder() {
    toast.promise(
      new Promise((resolve, reject) =>
        window.setTimeout(() => (Math.random() > 0.5 ? resolve(true) : reject()), 1500),
      ),
      {
        loading: 'Submitting order…',
        success: 'Order submitted',
        error: 'Order failed, try again',
      },
    )
  }
</script>

{#snippet typeButtons()}
  <div class="flex flex-wrap gap-3">
    <Button variant="outline" onclick={types.success}>Success</Button>
    <Button variant="outline" onclick={types.info}>Info</Button>
    <Button variant="outline" onclick={types.warning}>Warning</Button>
    <Button variant="outline" onclick={types.error}>Error</Button>
    <Button variant="outline" onclick={types.loading}>Loading</Button>
  </div>
{/snippet}

<!--
  The plain case: a message, no type, and no icon. The icons cover the typed
  toasts only, and that absence is the tell that this toast is not reporting a
  status.
-->
<Story name="Playground">
  {#snippet template(args)}
    <Toaster {...args} />
    <Button variant="outline" onclick={() => toast('Shift opened')}>Show toast</Button>
  {/snippet}
</Story>

<!-- The five typed variants, each with its icon and its status colours. -->
<Story name="Types" asChild>
  <Toaster />
  {@render typeButtons()}
</Story>
<!-- A second line under the title, for when the type alone does not say enough. -->
<Story name="With description" asChild>
  <Toaster />
  <Button
    variant="outline"
    onclick={() =>
      toast.error('Card was declined', {
        description: 'The issuing bank returned insufficient funds.',
      })}
  >
    Show toast
  </Button>
</Story>

<!--
  A toast that resolves itself: `loading` while the promise is pending, then
  `success` or `error` as it settles.
-->
<Story name="With promise" asChild>
  <Toaster />
  <Button variant="outline" onclick={submitOrder}>Submit order</Button>
</Story>

<!-- An inline action, for a toast that can undo its own cause. -->
<Story name="With action" asChild>
  <Toaster />
  <Button
    variant="outline"
    onclick={() =>
      toast('Item archived', {
        action: { label: 'Undo', onClick: () => toast.success('Item restored') },
      })}
  >
    Archive item
  </Button>
</Story>

<!--
  Action and cancel together: the confirm-in-place shape for a destructive
  change the operator can back out of without leaving the page.
-->
<Story name="With action and cancel" asChild>
  <Toaster />
  <Button
    variant="outline"
    onclick={() =>
      toast('Delete this discount?', {
        action: { label: 'Delete', onClick: () => toast.success('Discount deleted') },
        cancel: { label: 'Cancel', onClick: () => {} },
      })}
  >
    Delete discount
  </Button>
</Story>

<!--
  `duration` in milliseconds, and `Infinity` for a toast that leaves only when
  dismissed: the shape a must-acknowledge message wants.
-->
<Story name="Persistent toast" asChild>
  <Toaster />
  <Button
    variant="outline"
    onclick={() =>
      toast.warning('Register is offline; changes will sync when it reconnects', {
        duration: Number.POSITIVE_INFINITY,
      })}
  >
    Show persistent toast
  </Button>
</Story>

<!-- Several toasts stacked, which exercises the queue. -->
<Story name="Stacked" asChild>
  <Toaster />
  <Button
    variant="outline"
    onclick={() => {
      toast.success('Location prices sent')
      toast.info('2 registers are still syncing')
      toast.error('1 register failed to sync')
    }}
  >
    Trigger 3 toasts
  </Button>
</Story>
