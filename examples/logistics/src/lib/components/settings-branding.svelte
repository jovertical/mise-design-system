<!-- General settings' branding card: the logo upload, and how the brand mark looks with or without one. -->
<script lang="ts">
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    type MediaAsset,
    MediaDropzone,
    type MediaUploaderAdapter,
    Text,
  } from '@jovertical/mise-design-system'
  import ImageIcon from '@lucide/svelte/icons/image'
  import type { SuperForm } from 'sveltekit-superforms'

  import { initials } from '#lib/data/lookups.js'
  import type { Settings } from '#lib/data/types.js'

  let { form }: { form: SuperForm<Settings> } = $props()

  // The page builds the form once and never replaces it, so reading it here is enough.
  // svelte-ignore state_referenced_locally
  const { form: values } = form

  // The demo has no media service, so an upload is read into a data URL, with
  // the reader's progress so the zone's states show.
  const adapter: MediaUploaderAdapter = {
    ready: true,
    upload(file, { onProgress, signal }) {
      return new Promise((done, fail) => {
        const reader = new FileReader()

        reader.onprogress = (event) => {
          if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100))
        }

        reader.onerror = () => fail(reader.error ?? new Error('Could not read the file'))

        reader.onload = () =>
          done({
            uuid: crypto.randomUUID(),
            url: String(reader.result),
            name: file.name,
            mimeType: file.type,
            size: file.size,
          })

        signal.addEventListener('abort', () => reader.abort())

        reader.readAsDataURL(file)
      })
    },
  }

  const logo = $derived<MediaAsset | null>(
    $values.logo ? { uuid: 'logo', url: $values.logo, name: 'Logo' } : null,
  )
</script>

{#snippet image()}
  <ImageIcon />
{/snippet}

<Card>
  <CardHeader><CardTitle icon={image} iconTone="neutral">Branding</CardTitle></CardHeader>
  <CardContent class="flex flex-col gap-4">
    <MediaDropzone
      {adapter}
      value={logo}
      onValueChange={(asset) => ($values.logo = asset?.url ?? null)}
      placeholder="Drag and drop your logo here"
      hint="PNG, JPG or SVG, up to 2 MB"
      recommendation="512 × 512 px works best"
    />
    <div class="flex flex-col gap-2">
      <Text size="sm" weight="medium">Brand mark preview</Text>
      <div class="grid place-items-center rounded-xl border py-8">
        {#if $values.logo}
          <img src={$values.logo} alt="Logo" class="size-24 rounded-2xl object-contain">
        {:else}
          <span
            class="bg-primary text-primary-foreground grid size-24 place-items-center rounded-2xl text-3xl font-semibold"
          >
            {initials($values.companyName || '?')}
          </span>
        {/if}
      </div>
      <Text size="sm" muted>How the brand appears on documents and emails.</Text>
    </div>
  </CardContent>
</Card>
