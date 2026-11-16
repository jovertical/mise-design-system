<!--
  Choose a file: the upload fails, and the message stays with a Retry. The
  zone still takes a fresh drop. `ready: false`, while the app's token is
  still resolving, keeps the zone and turns its button off.
-->
<script lang="ts">
  import { type MediaAsset, MediaDropzone } from '@jovertical/mise-design-system'
  import { demoMediaAdapter } from '#modules/docs/data/demo-media-adapter.js'

  const failing = demoMediaAdapter({ failWith: 'The media service did not answer.' })
  const waiting = demoMediaAdapter({ ready: false })

  let photo: MediaAsset | null = $state(null)
</script>

<div class="flex w-96 flex-col gap-4">
  <MediaDropzone adapter={failing} bind:value={photo} />
  <MediaDropzone adapter={waiting} />
</div>
