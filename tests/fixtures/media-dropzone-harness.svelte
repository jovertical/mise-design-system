<script lang="ts">
  import { type MediaAsset, MediaDropzone, type MediaUploaderAdapter } from '../../src/lib/index.js'

  let {
    adapter,
    value = $bindable(null),
    linkMode = 'deferred',
    disabled = false,
    onError,
  }: {
    adapter: MediaUploaderAdapter
    value?: MediaAsset | null
    linkMode?: 'immediate' | 'deferred'
    disabled?: boolean
    onError?: (error: Error) => void
  } = $props()
</script>

<MediaDropzone
  {adapter}
  bind:value
  {linkMode}
  {disabled}
  {onError}
  maxSize={1024}
  previewLabel="Logo"
/>
<output data-testid="value">{value?.uuid ?? 'none'}</output>
