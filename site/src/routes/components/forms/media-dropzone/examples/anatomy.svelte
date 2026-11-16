<script lang="ts">
  import { MediaDropzone } from '@jovertical/mise-design-system'
  import { demoMediaAdapter } from '#modules/docs/data/demo-media-adapter.js'

  const adapter = demoMediaAdapter()
</script>

<div class="w-96">
  <MediaDropzone {adapter} previewLabel="Logo" hint="PNG, JPG, SVG or WEBP, up to 2MB" />
</div>
