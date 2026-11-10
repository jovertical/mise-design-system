<!--
  Origin: the React package 2.23.0 `media-dropzone.tsx`
  Diverged: over MediaUploader, the one-slot part of React's useMediaUploader
    (round 8 plan, R8-7). `value` is bindable, with `onValueChange` for React's
    `onChange`; `icon` is a snippet. Lucide's cloud-upload and trash. The
    preview panel is its own part, `media-dropzone-preview.svelte`.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'

  import type { MediaAsset, MediaLinkMode, MediaUploaderAdapter } from './media-uploader.svelte.js'

  /**
   * One image, on a zone that stays put: a logo, an avatar, a cover.
   *
   * The zone does not collapse once something is in it: a single slot's
   * prompt is the control, and replacing is the common action, so dropping a
   * new file replaces the old one (unlinking it under `immediate`). The
   * preview is a panel, not a tile, and contains the image rather than
   * cropping it: a cropped logo is a wrong logo.
   */
  export type MediaDropzoneProps = {
    value?: MediaAsset | null
    onValueChange?: (value: MediaAsset | null) => void
    /** The consumer's media service: the package makes no request of its own. */
    adapter: MediaUploaderAdapter
    linkMode?: MediaLinkMode
    /** What a native `<input accept>` takes. Images when absent. */
    accept?: string
    /** Bytes. 2MB when absent. */
    maxSize?: number
    disabled?: boolean
    class?: string
    icon?: Snippet
    placeholder?: string
    hint?: string
    recommendation?: string
    actionLabel?: string
    /** Heads the preview panel. Without it there is no panel. */
    previewLabel?: string
    previewCaption?: string
    emptyLabel?: string
    /**
     * Failures the zone recovers from on its own: an unlink that did not take,
     * an adapter that was not ready. A failed upload keeps its message and a
     * Retry instead.
     */
    onError?: (error: Error) => void
  }

  const DEFAULT_ACCEPT = 'image/png,image/jpeg,image/jpg,image/svg+xml,image/webp'
  const DEFAULT_MAX_SIZE = 2 * 1024 * 1024
</script>

<script lang="ts">
  import CloudUploadIcon from '@lucide/svelte/icons/cloud-upload'

  import { cn } from '../../../utils/cn.js'
  import Button from '../../actions/button/button.svelte'
  import Progress from '../../feedback/progress/progress.svelte'
  import Spinner from '../../feedback/spinner/spinner.svelte'
  import Text from '../../typography/text/text.svelte'
  import MediaDropzonePreview from './media-dropzone-preview.svelte'
  import { MediaUploader } from './media-uploader.svelte.js'

  let {
    value = $bindable(null),
    onValueChange,
    adapter,
    linkMode = 'deferred',
    accept = DEFAULT_ACCEPT,
    maxSize = DEFAULT_MAX_SIZE,
    disabled = false,
    class: className,
    icon,
    placeholder = 'Drag and drop your image here',
    hint,
    recommendation,
    actionLabel = 'Choose file',
    previewLabel,
    previewCaption,
    emptyLabel = 'Nothing uploaded yet',
    onError,
  }: MediaDropzoneProps = $props()

  const uploader = new MediaUploader(() => ({
    value,
    onChange: (next) => {
      value = next

      onValueChange?.(next)
    },
    adapter,
    linkMode,
    accept,
    maxSize,
    disabled,
    onError,
  }))

  $effect(() => uploader.destroy)

  let input = $state<HTMLInputElement | null>(null)
  let draggingOver = $state(false)

  const uploading = $derived(uploader.uploading)
  // A failure keeps its entry so the message and Retry survive; that is not
  // busy, and the zone keeps accepting a fresh drop.
  const busy = $derived(disabled || !adapter.ready || Boolean(uploading))

  function drop(event: DragEvent) {
    event.preventDefault()

    draggingOver = false

    if (busy) return

    uploader.addFiles(event.dataTransfer?.files ?? null)
  }
</script>

<div data-slot="media-dropzone" class={cn('flex flex-col gap-4', className)}>
  <input
    bind:this={input}
    type="file"
    {accept}
    class="hidden"
    disabled={busy}
    onchange={(event) => {
      uploader.addFiles(event.currentTarget.files)
      event.currentTarget.value = ''
    }}
  >

  <!-- Dropping a file is a pointer affordance with no keyboard equivalent; the
       keyboard path is the real button inside the zone, so the zone takes no
       role that would announce a target a keyboard cannot operate. -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- biome-ignore lint/a11y/noStaticElementInteractions: drop target, keyboard path is the button inside it -->
  <div
    data-slot="media-dropzone-zone"
    data-dragging={draggingOver || undefined}
    ondrop={drop}
    ondragover={(event) => {
      if (busy) return
      event.preventDefault()
      draggingOver = true
    }}
    ondragleave={() => (draggingOver = false)}
    class={cn(
      'flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-colors',
      draggingOver ? 'border-primary bg-primary/5' : 'border-border',
    )}
  >
    <span
      class="bg-foreground/[0.07] text-muted-foreground mb-2 flex size-10 items-center justify-center rounded-xl [&_svg]:size-5"
    >
      {#if uploading}
        <Spinner class="size-5" />
      {:else if icon}
        {@render icon()}
      {:else}
        <CloudUploadIcon />
      {/if}
    </span>
    <p class="text-sm font-medium">{placeholder}</p>
    {#if hint}
      <Text as="p" size="xs" muted>{hint}</Text>
    {/if}
    {#if recommendation}
      <Text as="p" size="xs" muted>{recommendation}</Text>
    {/if}

    {#if uploading}
      <Progress
        value={uploading.progress}
        class="mt-3 w-40"
        aria-label="Uploading {uploading.name}"
      />
    {:else}
      <Button
        type="button"
        variant="outline"
        class="mt-3"
        disabled={busy}
        onclick={() => input?.click()}
      >
        {actionLabel}
      </Button>
    {/if}
  </div>

  {#if previewLabel}
    <MediaDropzonePreview
      {value}
      label={previewLabel}
      caption={previewCaption}
      {emptyLabel}
      {disabled}
      onremove={uploader.remove}
    />
  {/if}

  {#if uploader.failed}
    {@const failed = uploader.failed}
    <p class="text-destructive flex items-center gap-2 text-sm">
      <span class="truncate">{failed.error}</span>
      <Button
        type="button"
        size="sm"
        variant="outline"
        class="h-7"
        onclick={() => uploader.retry(failed.id)}
      >
        Retry
      </Button>
    </p>
  {/if}

  {#each uploader.rejected as item (item.id)}
    <p class="text-destructive text-sm">
      <span class="text-foreground">{item.name}</span>
      — {item.message}
    </p>
  {/each}
</div>
