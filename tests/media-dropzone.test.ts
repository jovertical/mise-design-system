import { fireEvent, render, screen, waitFor } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { MediaAsset, MediaUploadOptions } from '../src/lib/index.js'
import MediaDropzoneHarness from './fixtures/media-dropzone-harness.svelte'

/** An adapter whose uploads wait until the test settles them. */
function fakeAdapter({ ready = true } = {}) {
  const calls: {
    file: File
    options: MediaUploadOptions
    resolve: (asset: MediaAsset) => void
    reject: (error: Error) => void
  }[] = []
  const unlink = vi.fn(async () => {})
  const adapter = {
    ready,
    upload: (file: File, options: MediaUploadOptions) =>
      new Promise<MediaAsset>((resolve, reject) => {
        calls.push({ file, options, resolve, reject })
      }),
    unlink,
  }
  return { adapter, calls, unlink }
}

const png = (name = 'logo.png', size = 100) =>
  new File(['x'.repeat(size)], name, { type: 'image/png' })
const fileInput = () => document.querySelector('input[type="file"]') as HTMLInputElement
const zone = () => document.querySelector('[data-slot="media-dropzone-zone"]') as HTMLElement
const bound = () => screen.getByTestId('value').textContent

describe('MediaDropzone', () => {
  it('uploads a chosen file with progress, then shows it in the panel', async () => {
    const { adapter, calls } = fakeAdapter()
    render(MediaDropzoneHarness, { adapter })
    await userEvent.upload(fileInput(), png())
    expect(calls).toHaveLength(1)
    calls[0].options.onProgress(40)
    await waitFor(() => expect(screen.getByLabelText('Uploading logo.png')).toBeInTheDocument())
    calls[0].resolve({ uuid: 'a1', url: '/logo.png', name: 'logo.png' })
    await waitFor(() => expect(bound()).toBe('a1'))
    expect(screen.getByRole('img', { name: 'logo.png' })).toHaveClass('object-contain')
  })

  it('refuses the wrong type and an oversized file, saying why', async () => {
    const { adapter, calls } = fakeAdapter()
    render(MediaDropzoneHarness, { adapter })
    const user = userEvent.setup({ applyAccept: false })
    await user.upload(fileInput(), new File(['x'], 'notes.txt', { type: 'text/plain' }))
    expect(screen.getByText(/PNG, JPEG, JPG, SVG\+XML, WEBP only\./)).toBeInTheDocument()
    await user.upload(fileInput(), png('big.png', 4096))
    expect(screen.getByText(/Larger than 1KB\./)).toBeInTheDocument()
    expect(calls).toHaveLength(0)
  })

  it('keeps a failure with a Retry, and still takes a fresh drop', async () => {
    const { adapter, calls } = fakeAdapter()
    render(MediaDropzoneHarness, { adapter })
    await userEvent.upload(fileInput(), png())
    calls[0].reject(new Error('Network down'))
    await waitFor(() => expect(screen.getByText('Network down')).toBeInTheDocument())
    await userEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(calls).toHaveLength(2)
    calls[1].reject(new Error('Network down'))
    await waitFor(() => expect(screen.getByText('Network down')).toBeInTheDocument())
    // React counted the failure toward the one slot and refused this drop.
    await fireEvent.drop(zone(), { dataTransfer: { files: [png('second.png')] } })
    expect(calls).toHaveLength(3)
    expect(screen.queryByText('Network down')).toBeNull()
  })

  it('replaces what is there, unlinking it under immediate', async () => {
    const { adapter, calls, unlink } = fakeAdapter()
    render(MediaDropzoneHarness, {
      adapter,
      linkMode: 'immediate',
      value: { uuid: 'old', url: '/old.png', name: 'old.png' },
    })
    await userEvent.upload(fileInput(), png('new.png'))
    expect(unlink).toHaveBeenCalledWith(expect.objectContaining({ uuid: 'old' }))
    calls[0].resolve({ uuid: 'new', url: '/new.png' })
    await waitFor(() => expect(bound()).toBe('new'))
  })

  it('removes the image from its panel', async () => {
    const { adapter } = fakeAdapter()
    render(MediaDropzoneHarness, {
      adapter,
      value: { uuid: 'a1', url: '/logo.png', name: 'logo.png' },
    })
    await userEvent.click(screen.getByRole('button', { name: 'Remove logo.png' }))
    expect(bound()).toBe('none')
    expect(screen.getByText('Nothing uploaded yet')).toBeInTheDocument()
  })

  it('highlights while a file is dragged over', async () => {
    const { adapter } = fakeAdapter()
    render(MediaDropzoneHarness, { adapter })
    await fireEvent.dragOver(zone())
    expect(zone()).toHaveClass('border-primary')
    await fireEvent.dragLeave(zone())
    expect(zone()).not.toHaveClass('border-primary')
  })

  it('reports an adapter that is not ready, and disables the button', async () => {
    const { adapter, calls } = fakeAdapter({ ready: false })
    const onError = vi.fn()
    render(MediaDropzoneHarness, { adapter, onError })
    expect(screen.getByRole('button', { name: 'Choose file' })).toBeDisabled()
    await fireEvent.drop(zone(), { dataTransfer: { files: [png()] } })
    expect(calls).toHaveLength(0)
  })
})
