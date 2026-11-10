import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import { Button } from '../src/lib/index.js'
import { text } from './snippet.js'

describe('Button', () => {
  it('renders a button with its data attributes and defaults', () => {
    render(Button, { children: text('Save changes') })

    const button = screen.getByRole('button', { name: 'Save changes' })

    expect(button).toHaveAttribute('data-slot', 'button')
    expect(button).toHaveAttribute('data-variant', 'solid')
    expect(button).toHaveAttribute('data-tone', 'primary')
    expect(button).toHaveAttribute('data-size', 'md')
    expect(button).not.toHaveAttribute('data-icon-only')
    expect(button).toHaveClass('bg-primary', 'h-9')
  })

  it("takes its corner from the theme's --radius-button, fully round without it", () => {
    render(Button, { children: text('Save') })

    expect(screen.getByRole('button')).toHaveClass('rounded-[var(--radius-button,9999px)]')
  })

  it('defaults the tone by variant: neutral for outline, primary for link', () => {
    const { unmount } = render(Button, { variant: 'outline', children: text('Cancel') })

    expect(screen.getByRole('button')).toHaveAttribute('data-tone', 'neutral')

    unmount()

    render(Button, { variant: 'link', children: text('Details') })

    expect(screen.getByRole('button')).toHaveAttribute('data-tone', 'primary')
  })

  it('takes an explicit tone over the default', () => {
    render(Button, { tone: 'critical', children: text('Delete') })

    expect(screen.getByRole('button')).toHaveClass('bg-destructive')
  })

  it('draws an icon-only button as a circle of the size', () => {
    render(Button, { iconOnly: true, size: 'sm', 'aria-label': 'More', children: text('⋯') })

    const button = screen.getByRole('button', { name: 'More' })

    expect(button).toHaveAttribute('data-icon-only', 'true')
    expect(button).toHaveClass('rounded-full', 'size-8')
    expect(button).not.toHaveClass('rounded-[var(--radius-button,9999px)]')
  })

  it('lets a caller class beat the variant class', () => {
    render(Button, { class: 'px-8', children: text('Wide') })

    const button = screen.getByRole('button')

    expect(button).toHaveClass('px-8')
    expect(button).not.toHaveClass('px-4')
  })

  it('disables a button with the native attribute', () => {
    render(Button, { disabled: true, children: text('Save') })

    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('renders a link when given an href', () => {
    render(Button, { href: '/orders', children: text('Orders') })

    const link = screen.getByRole('link', { name: 'Orders' })

    expect(link).toHaveAttribute('href', '/orders')
    expect(link).toHaveAttribute('data-slot', 'button')
  })

  it('takes a disabled link out of navigation and the tab order', () => {
    const { container } = render(Button, {
      href: '/orders',
      disabled: true,
      children: text('Orders'),
    })

    const link = container.querySelector('a') as HTMLAnchorElement

    expect(link).not.toHaveAttribute('href')
    expect(link).toHaveAttribute('aria-disabled', 'true')
    expect(link).toHaveAttribute('role', 'link')
    expect(link).toHaveAttribute('tabindex', '-1')
  })

  it('passes native handlers through', () => {
    let clicks = 0

    render(Button, { onclick: () => clicks++, children: text('Count') })

    screen.getByRole('button').click()

    expect(clicks).toBe(1)
  })
})
