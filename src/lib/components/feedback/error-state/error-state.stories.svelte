<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import IconAlertCircle from '@tabler/icons-svelte-runes/icons/alert-circle'
  import IconLock from '@tabler/icons-svelte-runes/icons/lock'

  import Button from '../../actions/button/button.svelte'
  import ErrorState from './error-state.svelte'

  const { Story } = defineMeta({
    title: 'Feedback/ErrorState',
    component: ErrorState,
    tags: ['mise'],
    parameters: { layout: 'fullscreen' },
    args: {
      title: 'Transfer not found',
      description:
        "This transfer may have been created in a different browser session and isn't available after a reload.",
    },
  })
</script>

{#snippet transfers()}
  <Button href="#transfers">Back to transfers</Button>
{/snippet}
{#snippet locations()}
  <Button href="#locations">Back to locations</Button>
{/snippet}
{#snippet retry()}
  <Button variant="outline">Try again</Button>
{/snippet}
{#snippet lock()}
  <IconLock />
{/snippet}
{#snippet alert()}
  <IconAlertCircle />
{/snippet}

<!--
  A sentence saying what happened, a sentence saying why, and one way forward.
  `homeLink` is the app's own link, drawn as a Button with `href`, or the
  router's link in one, so the package never learns which router it runs under.
  The action names its destination: "Back to transfers", not "Go to Dashboard".
-->
<Story name="Playground">
  {#snippet template(args)}
    <ErrorState
      {...args}
      title={args.title ?? ''}
      description={args.description ?? ''}
      homeLink={transfers}
    />
  {/snippet}
</Story>

<!--
  A refusal explains the rule, not the mechanism. The reader cannot fix
  permissions from here, so the only useful action is the way out.
-->
<Story name="Forbidden" asChild>
  <ErrorState
    title="Not your location"
    description="This record belongs to a location your account cannot administer."
    homeLink={locations}
  />
</Story>

<!-- A thrown error is the one case with something to try: retry leads, the way out follows. -->
<Story name="Thrown" asChild>
  <ErrorState
    title="Something went wrong"
    description="The location list could not be loaded."
    actions={retry}
    homeLink={locations}
  />
</Story>

<!--
  `status`, `icon` and `showBackButton` are all off unless asked for. Together
  they make a heavier page: worth it where the code is what the reader needs to
  report, and not otherwise.
-->
<Story name="Annotated" asChild>
  <ErrorState
    status={403}
    icon={lock}
    title="Not your location"
    description="This record belongs to a location your account cannot administer."
    showBackButton
    homeLink={locations}
  />
</Story>

<!-- With no link and no back button, the panel is a statement rather than a junction. -->
<Story name="Bare" asChild>
  <ErrorState
    icon={alert}
    title="Maintenance"
    description="The app is briefly unavailable while a release lands."
  />
</Story>
