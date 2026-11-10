<!--
  The frame every create and edit page sits in, as the client portal lays
  its own: a way back above the title, Cancel and Save in the header, the
  form in a two-thirds card and its summary beside it, stacked below `lg`.
  Save submits the form by id, so it can live outside the <form>.
-->
<script lang="ts" module>
  /** What a page says about itself; each entity form passes it through. */
  export type FormPageText = {
    title: string
    description: string
    back: { href: string; label: string }
    submitLabel: string
  }
</script>

<script lang="ts">
  import { Button, PageHeader, PageLayout } from '@jovertical/mise-design-system'
  import ArrowLeft from '@lucide/svelte/icons/arrow-left'
  import type { Snippet } from 'svelte'

  import UnsavedChangesDialog from './unsaved-changes-dialog.svelte'

  let {
    title,
    description,
    back,
    submitLabel,
    formId,
    form,
    aside,
  }: FormPageText & { formId: string; form: Snippet; aside: Snippet } = $props()
</script>

<PageLayout>
  <PageHeader {title} {description}>
    {#snippet backLink()}
      <a
        href={back.href}
        class="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm"
      >
        <ArrowLeft class="size-4" />
        {back.label}
      </a>
    {/snippet}
    {#snippet actions()}
      <Button variant="outline" href={back.href}>Cancel</Button>
      <Button type="submit" form={formId}>{submitLabel}</Button>
    {/snippet}
  </PageHeader>

  <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
    <div class="min-w-0 lg:col-span-2">{@render form()}</div>
    <div class="flex min-w-0 flex-col gap-6">{@render aside()}</div>
  </div>
</PageLayout>

<UnsavedChangesDialog />
