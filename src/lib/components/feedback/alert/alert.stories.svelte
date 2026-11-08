<script module lang="ts">
  import ArrowRightIcon from '@lucide/svelte/icons/arrow-right'
  import CircleCheckIcon from '@lucide/svelte/icons/circle-check'
  import ClockIcon from '@lucide/svelte/icons/clock'
  import InfoIcon from '@lucide/svelte/icons/info'
  import OctagonAlertIcon from '@lucide/svelte/icons/octagon-alert'
  import TerminalIcon from '@lucide/svelte/icons/terminal'
  import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import StoryAxis from '../../../../../stories/story-axis.svelte'

  import Button from '../../actions/button/button.svelte'
  import Alert from './alert.svelte'
  import AlertAction from './alert-action.svelte'
  import AlertDescription from './alert-description.svelte'
  import AlertTitle from './alert-title.svelte'

  const VARIANTS = ['default', 'info', 'success', 'warning', 'destructive'] as const

  const { Story } = defineMeta({ title: 'Feedback/Alert', component: Alert, tags: ['shadcn'] })
</script>

<Story name="Playground">
  {#snippet template(args)}
    <Alert class="max-w-3xl" {...args}>
      <InfoIcon />
      <AlertDescription
        >Registers can be paired to a location from the registers page.</AlertDescription
      >
    </Alert>
  {/snippet}
</Story>

<!--
  Five variants. Status is the surface and the icon; the words stay in ink. Red
  body text reads as the message being an error rather than being about one; a
  sentence explaining what to do next should not look like the failure itself.
-->
<Story name="Variants" asChild>
  <StoryAxis values={VARIANTS} orientation="vertical">
    {#snippet item(variant)}
      {#if variant === 'info'}
        <Alert variant="info">
          <InfoIcon />
          <AlertDescription>
            Each transfer creates two stock-ledger rows: a <strong>negative entry</strong> for the
            source location and a <strong>positive entry</strong> for the destination. Total stock
            is unchanged.
          </AlertDescription>
        </Alert>
      {:else if variant === 'success'}
        <Alert variant="success">
          <CircleCheckIcon />
          <AlertDescription>
            Location created. Registers can be paired to it from the registers page.
          </AlertDescription>
        </Alert>
      {:else if variant === 'warning'}
        <Alert variant="warning">
          <TriangleAlertIcon />
          <AlertDescription>
            This register last synced <strong>3 days ago</strong>. Orders taken on it are still on
            it.
          </AlertDescription>
        </Alert>
      {:else if variant === 'destructive'}
        <Alert variant="destructive">
          <OctagonAlertIcon />
          <AlertDescription
            >Three registers could not be set up. Nothing was charged.</AlertDescription
          >
        </Alert>
      {:else if variant === 'default'}
        <Alert>
          <TerminalIcon />
          <AlertDescription>
            The default variant states something without colouring it at all.
          </AlertDescription>
        </Alert>
      {/if}
    {/snippet}
  </StoryAxis>
</Story>
<!--
  With a title, for a message that needs a heading and a paragraph. Most do not:
  the usual shape is a single sentence with the important words in bold.
-->
<Story name="With title" asChild>
  <div class="grid max-w-3xl gap-3">
    <Alert variant="destructive">
      <OctagonAlertIcon />
      <AlertTitle>Sync has not run for 3 days</AlertTitle>
      <AlertDescription>
        Orders taken on this register are still on it and have not reached the server.
      </AlertDescription>
    </Alert>
  </div>
</Story>

<!--
  The layout has two columns only when there is an icon: the grid collapses its
  first track to `0` otherwise, so a text-only alert sits flush left.
-->
<Story name="With icon" asChild>
  <div class="grid max-w-2xl gap-4">
    <Alert>
      <InfoIcon />
      <AlertTitle>With an icon</AlertTitle>
      <AlertDescription>The text is indented to the second column.</AlertDescription>
    </Alert>
    <Alert>
      <AlertTitle>Without an icon</AlertTitle>
      <AlertDescription>The gutter collapses rather than sitting empty.</AlertDescription>
    </Alert>
  </div>
</Story>

<!--
  With an action: the button the alert asks the reader to press, in
  `AlertAction`. It takes a third column on the right, centred across the title
  and description. Reach for this instead of turning the alert into a flex row.
-->
<Story name="With action" asChild>
  <div class="grid max-w-3xl gap-3">
    <Alert variant="warning">
      <ClockIcon />
      <AlertTitle>Waiting for approval</AlertTitle>
      <AlertDescription>
        Price change: minimum $13.00 → $12.00 · <strong>0 of 2</strong> approvals. Its fields stay
        as they are until it is decided.
      </AlertDescription>
      <AlertAction>
        <Button variant="outline" size="sm">Review<ArrowRightIcon /></Button>
      </AlertAction>
    </Alert>
    <Alert variant="destructive">
      <OctagonAlertIcon />
      <AlertDescription
        >Invoice <strong>INV-2026-0014</strong> is overdue by 9 days.</AlertDescription
      >
      <AlertAction><Button variant="outline" size="sm">Open billing</Button></AlertAction>
    </Alert>
  </div>
</Story>

<!-- Two actions, the main one solid. More than two is a form, not an alert. -->
<Story name="With actions" asChild>
  <Alert class="max-w-3xl">
    <InfoIcon />
    <AlertTitle>Setup stopped at Registers</AlertTitle>
    <AlertDescription>Pick up where it left off, or discard the draft.</AlertDescription>
    <AlertAction>
      <Button variant="ghost" size="sm">Discard</Button>
      <Button size="sm">Continue setup</Button>
    </AlertAction>
  </Alert>
</Story>

<!--
  On a phone the action drops below the text instead of taking a column, which
  would squeeze the sentence to a word a line.
-->
<Story
  name="With action on a phone"
  asChild
  globals={{ viewport: { value: 'mobile1', isRotated: false } }}
>
  <Alert variant="warning">
    <ClockIcon />
    <AlertTitle>Waiting for approval</AlertTitle>
    <AlertDescription>Close Riverside · <strong>1 of 2</strong> approvals.</AlertDescription>
    <AlertAction>
      <Button variant="outline" size="sm">Review<ArrowRightIcon /></Button>
    </AlertAction>
  </Alert>
</Story>

<!--
  The title is `line-clamp-1`: it truncates rather than wrapping. Anything that
  needs a second line belongs in the description, which wraps freely.
-->
<Story name="Long content" asChild>
  <div class="grid max-w-2xl gap-4">
    <Alert variant="warning">
      <TriangleAlertIcon />
      <AlertTitle>
        This title is deliberately long enough to run past the end of the alert and be clamped
      </AlertTitle>
      <AlertDescription>
        <p>
          The description has no clamp, so it wraps as far as it needs to. This is where the detail
          goes: what happened, and what the operator can do about it.
        </p>
        <p>A second paragraph keeps its own leading rather than running together.</p>
      </AlertDescription>
    </Alert>
  </div>
</Story>

<!--
  Every variant on `bg-background` rather than the canvas, which is where a
  difference in surface shows up. Switch the scheme here: each status icon has a
  lighter dark step.
-->
<Story name="On a page" asChild parameters={{ layout: 'fullscreen' }}>
  <div class="bg-background grid gap-3 p-8">
    <Alert variant="info"
      ><InfoIcon /><AlertDescription>Informational, on the page surface.</AlertDescription></Alert
    >
    <Alert variant="success"
      ><CircleCheckIcon /><AlertDescription>Something finished.</AlertDescription></Alert
    >
    <Alert variant="warning">
      <TriangleAlertIcon />
      <AlertDescription>Something needs attention but still works.</AlertDescription>
    </Alert>
    <Alert variant="destructive"
      ><OctagonAlertIcon /><AlertDescription>Something failed.</AlertDescription></Alert
    >
  </div>
</Story>

<!--
  Either part can stand alone. A title-only alert keeps a `min-h-4` so it does
  not collapse against the icon.
-->
<Story name="Parts alone" asChild>
  <div class="grid max-w-2xl gap-4">
    <Alert>
      <TerminalIcon />
      <AlertTitle>Title only</AlertTitle>
    </Alert>
    <Alert>
      <TerminalIcon />
      <AlertDescription>Description only, with no heading above it.</AlertDescription>
    </Alert>
  </div>
</Story>

<!-- A list inside the description lines up on the left edge of the text. -->
<Story name="Rich description" asChild>
  <Alert class="max-w-2xl" variant="destructive">
    <OctagonAlertIcon />
    <AlertTitle>Three registers could not be set up</AlertTitle>
    <AlertDescription>
      <p>Each one reported a different reason:</p>
      <ul class="list-inside list-disc text-sm">
        <li>Register 2: pairing code already claimed</li>
        <li>Kitchen display: no location assigned</li>
        <li>Register 4: offline since 14:20</li>
      </ul>
    </AlertDescription>
  </Alert>
</Story>
