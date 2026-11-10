/**
 * Splits a component file into its two scripts. The module script carries the
 * exported Props type; the instance script carries the `$props()`
 * destructuring, and with it the defaults.
 */
const SCRIPT = /<script\b([^>]*)>([\s\S]*?)<\/script>/g

export function scripts(svelte: string): { module: string | null; instance: string | null } {
  let module: string | null = null
  let instance: string | null = null

  for (const [, attributes, body] of svelte.matchAll(SCRIPT)) {
    if (/\bmodule\b/.test(attributes)) module = body
    else instance = body
  }

  return { module, instance }
}
