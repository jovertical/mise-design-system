<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import StoryAxis from '../../../../../stories/story-axis.svelte'

  import Button from '../../actions/button/button.svelte'
  import AlertDialog from './alert-dialog.svelte'
  import AlertDialogAction from './alert-dialog-action.svelte'
  import AlertDialogCancel from './alert-dialog-cancel.svelte'
  import AlertDialogContent from './alert-dialog-content.svelte'
  import AlertDialogDescription from './alert-dialog-description.svelte'
  import AlertDialogFooter from './alert-dialog-footer.svelte'
  import AlertDialogHeader from './alert-dialog-header.svelte'
  import AlertDialogTitle from './alert-dialog-title.svelte'
  import AlertDialogTrigger from './alert-dialog-trigger.svelte'

  const { Story } = defineMeta({
    title: 'Overlays/AlertDialog',
    component: AlertDialog,
    tags: ['shadcn'],
    parameters: { layout: 'centered' },
  })
</script>

<!--
  For a confirmation the operator cannot dismiss by clicking outside it: `Dialog`
  closes on an outside click, this does not. Reach for it when the action is
  destructive or hard to undo; everything else wants `Dialog`.
-->
<Story name="Playground">
  {#snippet template(args)}
    <AlertDialog {...args}>
      <AlertDialogTrigger>
        {#snippet child({ props })}
          <Button variant="outline" {...props}>Close location</Button>
        {/snippet}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Close Riverside?</AlertDialogTitle>
          <AlertDialogDescription>
            This cannot be undone. 398 units across 22 items will need to be moved first.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction tone="critical">Close location</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  {/snippet}
</Story>

<!--
  `size="sm"` for a shorter confirmation with no `AlertDialogDescription`: the
  title already says everything the operator needs.
-->
<Story name="Sizes" asChild>
  <StoryAxis values={['md', 'sm'] as const}>
    {#snippet item(size)}
      <AlertDialog>
        <AlertDialogTrigger>
          {#snippet child({ props })}
            <Button variant="outline" {...props}>Discard draft</Button>
          {/snippet}
        </AlertDialogTrigger>
        <AlertDialogContent {size}>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard this draft?</AlertDialogTitle>
            {#if size === 'md'}
              <AlertDialogDescription>
                The 4 lines added since the last save will be lost.
              </AlertDialogDescription>
            {/if}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <AlertDialogAction tone="critical">Discard</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    {/snippet}
  </StoryAxis>
</Story>
