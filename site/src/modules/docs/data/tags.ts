/**
 * A component's tags beyond its frontmatter: the release it arrived in (from
 * since.json, which scripts/since.ts writes after each release) and whether
 * that makes it new.
 */
import SINCE from './since.json' with { type: 'json' }

/** The release a folder first shipped in, or `null` while it is unreleased. */
export function sinceOf(folder: string, releases: Record<string, string> = SINCE): string | null {
  return releases[folder] ?? null
}

const minorOf = (version: string) => version.split('.').slice(0, 2).join('.')

/** New in the current minor, or not released yet. */
export function isNew(since: string | null, current: string): boolean {
  return since === null || minorOf(since) === minorOf(current)
}
