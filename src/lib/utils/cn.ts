import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges class names, with later Tailwind utilities beating earlier ones in the
 * same group: `cn('p-2', 'p-4')` is `'p-4'`, not both.
 *
 * `clsx` first, so Svelte 5's array and object `class` values work as they do
 * on a plain element.
 *
 * Copied from the React package 2.23.0 src/lib/cn.ts.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
