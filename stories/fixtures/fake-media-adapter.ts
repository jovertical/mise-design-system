/**
 * Story scaffolding, not a package export: a media adapter that uploads
 * nowhere. It reports progress over `duration` milliseconds and then returns
 * the file as an object URL, or fails with `failWith`.
 */
import type { MediaAsset, MediaUploaderAdapter } from '../../src/lib/index.js'

export function fakeMediaAdapter({
  ready = true,
  duration = 1500,
  failWith,
}: {
  ready?: boolean
  duration?: number
  failWith?: string
} = {}): MediaUploaderAdapter {
  return {
    ready,
    upload: (file, { signal, onProgress }) =>
      new Promise<MediaAsset>((resolve, reject) => {
        const started = Date.now()

        const tick = setInterval(() => {
          const percent = Math.min(100, ((Date.now() - started) / duration) * 100)

          onProgress(percent)

          if (percent < 100) return

          clearInterval(tick)

          if (failWith) reject(new Error(failWith))
          else
            resolve({ uuid: crypto.randomUUID(), url: URL.createObjectURL(file), name: file.name })
        }, 100)

        signal.addEventListener('abort', () => {
          clearInterval(tick)

          reject(new DOMException('Aborted', 'AbortError'))
        })
      }),
    unlink: async () => {},
  }
}

/** A small placeholder logo, as a data URL, for stories that start filled. */
export const SAMPLE_LOGO =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="96" viewBox="0 0 240 96"><rect width="240" height="96" rx="16" fill="#4f46e5"/><text x="120" y="60" font-family="sans-serif" font-size="32" font-weight="700" fill="white" text-anchor="middle">North Bakery</text></svg>',
  )
