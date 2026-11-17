/**
 * The pure part of `since.ts`: given each release's component folders, the
 * first release each folder appears in. Kept apart so it is tested without git.
 */
export type Release = { version: string; folders: string[] }

export function compareVersions(first: string, second: string): number {
  const numbers = (version: string) => version.split('.').map(Number)
  const [left, right] = [numbers(first), numbers(second)]
  const differing = left.findIndex((part, index) => part !== right[index])

  return differing === -1 ? 0 : left[differing] - right[differing]
}

export function firstReleases(releases: Release[]): Record<string, string> {
  const earliestFirst = releases.toSorted((first, second) =>
    compareVersions(first.version, second.version),
  )

  const since: Record<string, string> = {}

  for (const release of earliestFirst) {
    for (const folder of release.folders) since[folder] ??= release.version
  }

  return Object.fromEntries(
    Object.entries(since).toSorted(([first], [second]) => first.localeCompare(second)),
  )
}
