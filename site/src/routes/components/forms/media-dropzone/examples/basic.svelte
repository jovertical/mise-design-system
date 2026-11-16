<!--
  One image, on a zone that stays put. Drop a file or choose one. The adapter
  is the app's: here it uploads nowhere and hands the file back.
-->
<script lang="ts">
  import { type MediaAsset, MediaDropzone } from '@jovertical/mise-design-system'
  import { demoMediaAdapter } from '#modules/docs/data/demo-media-adapter.js'

  const adapter = demoMediaAdapter()

  let photo: MediaAsset | null = $state(null)
</script>

<div class="w-96">
  <MediaDropzone {adapter} bind:value={photo} hint="PNG, JPG, SVG or WEBP, up to 2MB" />
</div>
