<!--
  Origin: the React package 2.23.0 `media-dropzone.tsx` (the preview)
  Diverged: the preview panel under the zone, as its own part so MediaDropzone
    keeps under the size the clean-code guide allows. Not exported: it is
    MediaDropzone's, drawn when the caller passes `previewLabel`.
-->
<script lang="ts" module>
  import type { MediaAsset } from './media-uploader.svelte.js'

  export type MediaDropzonePreviewProps = {
    value: MediaAsset | null
    label: string
    caption?: string
    emptyLabel: string
    disabled: boolean
    onremove: () => void
  }
</script>

<script lang="ts">
  import TrashIcon from '@lucide/svelte/icons/trash'

  import Button from '../../actions/button/button.svelte'
  import Text from '../../typography/text/text.svelte'

  let { value, label, caption, emptyLabel, disabled, onremove }: MediaDropzonePreviewProps =
    $props()
</script>

<div data-slot="media-dropzone-preview" class="flex flex-col gap-2">
  <p class="text-sm font-medium">{label}</p>
  <div class="border-border bg-muted/40 flex h-40 items-center justify-center rounded-2xl border">
    {#if value}
      <div class="group relative">
        <!-- object-contain, not cover: the thing in a one-image field is
             usually a logo, and a cropped logo is a wrong logo. -->
        <img
          src={value.thumbnailUrl || value.url}
          alt={value.name || label}
          class="max-h-32 object-contain"
        >
        {#if !disabled}
          <Button
            type="button"
            iconOnly
            variant="ghost"
            class="bg-background/90 hover:text-destructive absolute -top-2 -right-2 size-7 rounded-full opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
            onclick={onremove}
            aria-label="Remove {value.name || label}"
          >
            <TrashIcon class="size-3.5" />
          </Button>
        {/if}
      </div>
    {:else}
      <Text as="p" size="sm" muted>{emptyLabel}</Text>
    {/if}
  </div>
  {#if caption}
    <Text as="p" size="xs" muted>{caption}</Text>
  {/if}
</div>
