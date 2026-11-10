/**
 * Origin: the React package 2.23.0 `use-media-uploader.ts`, in its hooks folder
 * Diverged: the part MediaDropzone uses (round 8 plan, R8-7), as a rune-backed
 *   class for one slot rather than React's 640-line hook for galleries: one
 *   file's upload with progress, abort and failure, the type and size checks,
 *   replacing what is there (and unlinking it under `immediate`), retry and
 *   remove. Sources, reordering and the multi-file queue are not ported. A new
 *   file clears a failed upload first: React counted the failure toward the
 *   one slot, so after a failure a fresh drop was refused as "No slots left",
 *   though its own comment said the zone keeps accepting one.
 */

import { refuse } from './media-uploader-checks.js'

/** One stored file, as the consumer's media service returns it. */
export type MediaAsset = {
  uuid: string
  url: string
  thumbnailUrl?: string | null
  name?: string
  mimeType?: string
  size?: number
}

export type MediaUploadOptions = {
  signal: AbortSignal
  onProgress: (percent: number) => void
}

/**
 * Everything the uploader needs the outside world to do. The package makes no
 * request, holds no token and knows no URL: the consumer closes over all three
 * and hands this in. `unlink` is called only under `linkMode: 'immediate'`.
 */
export type MediaUploaderAdapter = {
  /** False while a token or session is still resolving. Gates the add control. */
  ready: boolean
  upload(file: File, options: MediaUploadOptions): Promise<MediaAsset>
  link?(asset: MediaAsset): Promise<MediaAsset>
  unlink?(asset: MediaAsset): Promise<void>
}

/**
 * When media is attached to the record it belongs to. `immediate` unlinks on
 * removal and replacement, as an edit page does; `deferred` does neither, and
 * the form reconciles on submit, as a create page must.
 */
export type MediaLinkMode = 'immediate' | 'deferred'

export type QueuedUpload = {
  id: string
  name: string
  progress: number
  status: 'uploading' | 'failed'
  error?: string
}

export type RejectedFile = {
  id: string
  name: string
  reason: 'type' | 'size' | 'limit'
  message: string
}

export type MediaUploaderOptions = {
  value: MediaAsset | null
  onChange: (value: MediaAsset | null) => void
  adapter: MediaUploaderAdapter
  linkMode: MediaLinkMode
  accept: string
  maxSize: number
  disabled: boolean
  onError?: (error: Error) => void
}

export class MediaUploader {
  queue = $state<QueuedUpload[]>([])
  rejected = $state<RejectedFile[]>([])

  #options: () => MediaUploaderOptions
  #controllers = new Map<string, AbortController>()
  #attempts = new Map<string, (options: MediaUploadOptions) => Promise<MediaAsset>>()

  /** Options are read through a getter, so every call sees the current props. */
  constructor(options: () => MediaUploaderOptions) {
    this.#options = options
  }

  get uploading(): QueuedUpload | undefined {
    return this.queue.find((item) => item.status === 'uploading')
  }

  get failed(): QueuedUpload | undefined {
    return this.queue.find((item) => item.status === 'failed')
  }

  addFiles = (files: FileList | File[] | null) => {
    const { adapter, disabled, onError } = this.#options()
    const candidates = Array.from(files ?? [])

    if (disabled || candidates.length === 0) return

    if (!adapter.ready) {
      onError?.(new Error('Media service is not ready yet.'))

      return
    }

    if (this.uploading) return

    for (const failed of this.queue) this.#settle(failed.id)

    const [first, ...extra] = candidates
    const { accepted, rejected } = this.#triage(first, extra)

    this.rejected = rejected

    if (accepted) this.#start(accepted)
  }

  /** The one file this slot takes, if it passes, and every file refused. */
  #triage(first: File, extra: File[]): { accepted: File | null; rejected: RejectedFile[] } {
    const { accept, maxSize } = this.#options()

    const acceptedTypes = accept
      .split(',')
      .map((type) => type.trim())
      .filter(Boolean)

    const refusals: RejectedFile[] = extra.map((file) => ({
      id: newId(),
      name: file.name,
      reason: 'limit',
      message: 'No slots left.',
    }))

    const refusal = refuse(first, acceptedTypes, maxSize)

    if (refusal)
      return {
        accepted: null,
        rejected: [{ id: newId(), name: first.name, ...refusal }, ...refusals],
      }

    return { accepted: first, rejected: refusals }
  }

  /** A single slot is replaced, not filled: make room, then upload the file. */
  #start(file: File) {
    const { adapter } = this.#options()

    this.#evict()

    const id = newId()

    this.queue = [{ id, name: file.name, progress: 0, status: 'uploading' }]

    this.#attempts.set(id, (options) => adapter.upload(file, options))

    void this.#run(id)
  }

  retry = (id: string) => {
    if (this.queue.find((item) => item.id === id)?.status !== 'failed') return

    void this.#run(id)
  }

  cancel = (id: string) => {
    this.#controllers.get(id)?.abort()

    this.#settle(id)
  }

  /** Clears the slot. An unlink that fails is reported, not rolled back. */
  remove = () => {
    this.rejected = []

    this.#evict()
  }

  /** Stops every request; call when the zone goes away. */
  destroy = () => {
    for (const controller of this.#controllers.values()) controller.abort()

    this.#controllers.clear()
  }

  #evict() {
    const { value, onChange, linkMode, adapter, onError } = this.#options()

    if (!value) return

    onChange(null)

    if (linkMode !== 'immediate' || !adapter.unlink) return

    adapter.unlink(value).catch((error: unknown) => {
      onError?.(new Error(messageOf(error, 'Failed to detach the image.')))
    })
  }

  #settle(id: string) {
    this.#controllers.delete(id)

    this.#attempts.delete(id)

    this.queue = this.queue.filter((item) => item.id !== id)
  }

  #update(id: string, patch: Partial<QueuedUpload>) {
    this.queue = this.queue.map((item) => (item.id === id ? { ...item, ...patch } : item))
  }

  async #run(id: string) {
    const attempt = this.#attempts.get(id)

    if (!attempt) return

    const controller = new AbortController()

    this.#controllers.set(id, controller)

    this.#update(id, { status: 'uploading', error: undefined, progress: 0 })

    try {
      const asset = await attempt({
        signal: controller.signal,
        onProgress: (percent) => this.#update(id, { progress: percent }),
      })

      this.#settle(id)

      this.#options().onChange(asset)
    } catch (error) {
      this.#controllers.delete(id)

      // An abort is a person removing the upload, not a failure to report.
      if (controller.signal.aborted) {
        this.#settle(id)

        return
      }

      this.#update(id, { status: 'failed', error: messageOf(error, 'Upload failed') })
    }
  }
}

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()

  return `media-${Math.random().toString(36).slice(2)}`
}

function messageOf(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback
}
