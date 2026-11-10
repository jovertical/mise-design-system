import { render, waitFor } from '@testing-library/svelte'
import { afterEach, describe, expect, it } from 'vitest'

import { Toaster, toast } from '../src/lib/index.js'

// svelte-sonner renders its list only once there is a toast to show.
const toaster = () => document.body.querySelector('[data-sonner-toaster]') as HTMLElement

afterEach(() => {
  document.documentElement.classList.remove('dark')

  toast.dismiss()
})

describe('Toaster', () => {
  it('follows the page, not the OS, when no theme is given', async () => {
    render(Toaster)

    toast('Shift opened')

    await waitFor(() => expect(toaster()).toHaveAttribute('data-sonner-theme', 'light'))

    document.documentElement.classList.add('dark')

    await waitFor(() => expect(toaster()).toHaveAttribute('data-sonner-theme', 'dark'))
  })

  it('takes an explicit theme over the page', async () => {
    document.documentElement.classList.add('dark')

    render(Toaster, { theme: 'light' })

    toast('Shift opened')

    await waitFor(() => expect(toaster()).toHaveAttribute('data-sonner-theme', 'light'))
  })

  it('tags each toast with mise-toast and its type, for components.css', async () => {
    render(Toaster)

    toast.success('Stock count posted')

    await waitFor(() => {
      const item = document.body.querySelector('[data-sonner-toast]') as HTMLElement

      expect(item).toHaveClass('mise-toast')
      expect(item).toHaveAttribute('data-type', 'success')
      expect(item).toHaveTextContent('Stock count posted')
    })
  })

  it('keeps a caller toast class alongside mise-toast', async () => {
    render(Toaster, { toastOptions: { classes: { title: 'font-heading' } } })

    toast('Shift opened')

    await waitFor(() => {
      expect(document.body.querySelector('[data-sonner-toast]')).toHaveClass('mise-toast')
      expect(document.body.querySelector('[data-title]')).toHaveClass('font-heading')
    })
  })
})
