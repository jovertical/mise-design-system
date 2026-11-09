/**
 * The clean-code check: every rule of `.ai/guidelines/clean-code/guide.md`
 * that a parser can decide, over one file or the whole repository.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { nonNullViolations } from './assertions.js'
import { checkedFiles } from './files.js'
import { nameViolations } from './names.js'
import { parseFile } from './parse.js'
import { fileLengthViolations, functionLengthViolations } from './size.js'
import { spacingViolations } from './spacing.js'

export type Rule = 'names' | 'file-length' | 'function-length' | 'non-null' | 'spacing'
export type Violation = { path: string; line: number; rule: Rule; detail: string }

/** Every violation in one file; `path` is repository-relative with forward slashes. */
export function checkFile(path: string, text: string): Violation[] {
  const file = parseFile(path, text)

  return [
    ...nameViolations(file),
    ...fileLengthViolations(file),
    ...functionLengthViolations(file),
    ...nonNullViolations(file),
    ...spacingViolations(file),
  ].toSorted((first, second) => first.line - second.line)
}

/** Every violation in every checked file under `root`. */
export function checkRepository(root: string): Violation[] {
  return checkedFiles(root).flatMap((path) =>
    checkFile(path, readFileSync(join(root, path), 'utf8')),
  )
}

export const formatViolation = (violation: Violation) =>
  `${violation.path}:${violation.line}: ${violation.rule}: ${violation.detail}`
