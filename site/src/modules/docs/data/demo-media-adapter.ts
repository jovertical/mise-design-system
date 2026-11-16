/**
 * For the MediaDropzone examples: an upload adapter that sends nothing
 * anywhere. It reports progress over `duration` milliseconds, then hands the
 * file back as an object URL, or fails with `failWith`. A real app's adapter
 * closes over its own endpoint and token; mise makes no request itself.
 */
import type { MediaAsset, MediaUploaderAdapter } from '@jovertical/mise-design-system'

type DemoOptions = { ready?: boolean; duration?: number; failWith?: string }

export function demoMediaAdapter({
  ready = true,
  duration = 1500,
  failWith,
}: DemoOptions = {}): MediaUploaderAdapter {
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
