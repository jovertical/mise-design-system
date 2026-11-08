<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import {
    fakeMediaAdapter,
    SAMPLE_LOGO,
  } from '../../../../../stories/fixtures/fake-media-adapter.js'
  import OnACard from '../../../../../stories/on-a-card.svelte'
  import StoryAxis from '../../../../../stories/story-axis.svelte'
  import MediaDropzone from './media-dropzone.svelte'
  import type { MediaAsset } from './media-uploader.svelte.js'

  const { Story } = defineMeta({
    title: 'Forms/MediaDropzone',
    component: MediaDropzone,
    tags: ['mise'],
  })

  const working = fakeMediaAdapter()
  const slow = fakeMediaAdapter({ duration: 60_000 })
  const failing = fakeMediaAdapter({ failWith: 'The media service did not answer.' })

  const state = $state({
    empty: null as MediaAsset | null,
    preview: { uuid: 'logo', url: SAMPLE_LOGO, name: 'North Bakery logo' } as MediaAsset | null,
    emptyPreview: null as MediaAsset | null,
    uploading: null as MediaAsset | null,
    failing: null as MediaAsset | null,
  })
</script>

<!--
  One image, on a zone that stays put. Drop a file or choose one; the adapter
  here uploads nowhere and hands the file back after a moment.
-->
<Story name="Playground" asChild>
  <OnACard>
    <div class="w-96">
      <MediaDropzone
        adapter={working}
        bind:value={state.empty}
        hint="PNG, JPG, SVG or WEBP, up to 2MB"
      />
    </div>
  </OnACard>
</Story>

<!--
  Not ready, while the adapter's token or session is still resolving, and
  disabled. Both keep the zone in place and turn the button off.
-->
<Story name="States" asChild>
  <StoryAxis values={['not ready', 'disabled'] as const} orientation="vertical">
    {#snippet item(which)}
      <OnACard>
        <div class="w-96">
          {#if which === 'not ready'}
            <MediaDropzone adapter={fakeMediaAdapter({ ready: false })} />
          {:else}
            <MediaDropzone adapter={working} disabled />
          {/if}
        </div>
      </OnACard>
    {/snippet}
  </StoryAxis>
</Story>

<!--
  With the preview panel, for a logo: the image is contained, not cropped, and
  a new drop replaces it. Hover the image for its remove button.
-->
<Story name="With preview" asChild>
  <OnACard>
    <div class="w-96">
      <MediaDropzone
        adapter={working}
        bind:value={state.preview}
        previewLabel="Logo"
        previewCaption="Shown on receipts and the register's sign-in screen."
        recommendation="Recommended: 480 × 192, transparent background"
      />
    </div>
  </OnACard>
</Story>

<!-- The preview panel before anything is uploaded. -->
<Story name="Empty with preview" asChild>
  <OnACard>
    <div class="w-96">
      <MediaDropzone adapter={working} bind:value={state.emptyPreview} previewLabel="Logo" />
    </div>
  </OnACard>
</Story>

<!-- Choose a file: the upload takes a minute here, so the spinner and bar stay. -->
<Story name="Uploading" asChild>
  <OnACard>
    <div class="w-96"><MediaDropzone adapter={slow} bind:value={state.uploading} /></div>
  </OnACard>
</Story>

<!--
  Choose a file: the upload fails, and the message stays with a Retry. The zone
  still takes a fresh drop.
-->
<Story name="Failing" asChild>
  <OnACard>
    <div class="w-96"><MediaDropzone adapter={failing} bind:value={state.failing} /></div>
  </OnACard>
</Story>
