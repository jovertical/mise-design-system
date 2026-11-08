<!--
  Origin: the React package 2.23.0 `command.tsx` (`CommandDialog`), itself shadcn/ui new-york `command`
  Svelte: shadcn-svelte `command`
  Diverged: the dialog's sizing reaches the list through `data-slot` selectors, where React reached into cmdk's attributes. The title defaults to "Command palette", sentence case.
-->
<script lang="ts" module>
  import type { Command as CommandPrimitive, Dialog as DialogPrimitive } from 'bits-ui'
  import type { Snippet } from 'svelte'

  import type { WithoutChildrenOrChild } from '../../../utils/types.js'

  /**
   * `Command` in a `Dialog`, for a palette that takes over the screen. The
   * title and description are for a screen reader only.
   */
  export type CommandDialogProps = WithoutChildrenOrChild<DialogPrimitive.RootProps> &
    WithoutChildrenOrChild<CommandPrimitive.RootProps> & {
      title?: string
      description?: string
      showCloseButton?: boolean
      class?: string
      children: Snippet
    }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import Dialog from '../../overlays/dialog/dialog.svelte'
  import DialogContent from '../../overlays/dialog/dialog-content.svelte'
  import DialogDescription from '../../overlays/dialog/dialog-description.svelte'
  import DialogHeader from '../../overlays/dialog/dialog-header.svelte'
  import DialogTitle from '../../overlays/dialog/dialog-title.svelte'
  import Command from './command.svelte'

  let {
    open = $bindable(false),
    value = $bindable(''),
    title = 'Command palette',
    description = 'Search for a command to run.',
    showCloseButton = true,
    class: className,
    children,
    ...rest
  }: CommandDialogProps = $props()
</script>

<Dialog bind:open {...rest}>
  <DialogContent class={cn('overflow-hidden p-0', className)} {showCloseButton}>
    <DialogHeader class="sr-only">
      <DialogTitle>{title}</DialogTitle>
      <DialogDescription>{description}</DialogDescription>
    </DialogHeader>
    <Command
      bind:value
      class="**:data-[slot=command-input-wrapper]:h-12 **:data-[slot=command-input]:h-12 [&_[data-slot=command-group]]:px-2 [&_[data-slot=command-input-wrapper]_svg]:size-5 [&_[data-slot=command-item]]:px-2 [&_[data-slot=command-item]]:py-3 [&_[data-slot=command-item]_svg]:size-5"
    >
      {@render children()}
    </Command>
  </DialogContent>
</Dialog>
