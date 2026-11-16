<!--
  With the preview panel, for a logo: the image is contained, not cropped, and
  a new drop replaces it. Hover the image for its remove button.
-->
<script lang="ts">
  import { type MediaAsset, MediaDropzone } from '@jovertical/mise-design-system'
  import { demoMediaAdapter } from '#modules/docs/data/demo-media-adapter.js'

  const adapter = demoMediaAdapter()

  let logo: MediaAsset | null = $state(null)
</script>

<div class="w-96">
  <MediaDropzone
    {adapter}
    bind:value={logo}
    previewLabel="Logo"
    previewCaption="Shown on receipts and the register's sign-in screen."
    recommendation="Recommended: 480 × 192, transparent background"
  />
</div>
