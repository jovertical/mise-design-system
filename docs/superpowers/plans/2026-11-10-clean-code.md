# Clean code Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. In this repo the user has chosen inline execution in the main session.

**Goal:** One written clean-code standard for mise and the logistics example, checked by a test, with a fixer for statement spacing, and the code refactored until the check passes with no exceptions beyond the declared ones.

**Architecture:** A checker in `scripts/conventions/` parses every source file (TypeScript compiler for `.ts` and for `.svelte` scripts, `svelte/compiler` for `.svelte` templates) into one shape, then runs four rules over it: names, size, non-null assertions, spacing. `tests/conventions.test.ts` runs it over the repository against an exceptions table and a shrinking list of existing breakers. `scripts/fix-spacing.ts` reuses the spacing rule to insert or remove blank lines. The refactor phases then empty the breakers list.

**Tech Stack:** TypeScript ~6.0 compiler API, `svelte/compiler` (Svelte 5 modern AST), Vitest 5, tsx, Biome 2.6.

**Spec:** `docs/specs/2026-11-10-clean-code-design.md`.

## Global Constraints

- Behaviour does not change. Every task keeps green: root `pnpm test` and `pnpm build:storybook` (mise), `pnpm --filter mise-logistics-example test` after a root `pnpm build`, and the example's `pnpm smoke` when the example changes.
- Public API names stay as `docs/naming.md` has them: component names, part names, prop names, exported types and functions of mise's entries. Only internal names change.
- Commit types: `docs:` for the guideline; `test:` for the check; `chore:` for the fixer and spacing; `refactor(<component>)` for mise renames (no release); `chore(example)` for the example. Co-Authored-By trailer.
- Commit only when the gate exits 0, checked by exit code. Phases of at most 5 tasks; phase-gates report and an explicit go; push only after approval.
- The breakers list may only shrink. No task adds an entry, except Task 3, which creates it.
- Dependencies are installed by the user; none are expected (`typescript`, `svelte`, `tsx` are already root devDependencies).
- **Spec refinement:** import bindings are not checked for names. They take the exporting library's name (`import X from '@lucide/svelte/icons/x'`), and renaming them hides where they come from.

## File map

| File | Responsibility |
| --- | --- |
| `.ai/guidelines/clean-code/guide.md` | the rules, with examples |
| `CLAUDE.md`, `AGENTS.md` | link the guide; `writes-clean-code` points at it |
| `.claude/skills/writes-clean-code/SKILL.md` | a short pointer to the guide plus when to read it |
| `scripts/conventions/files.ts` | which files are checked |
| `scripts/conventions/parse.ts` | a file → `{ path, lines, scripts: ScriptUnit[], templateNames: NameSite[] }` |
| `scripts/conventions/names.ts` | the names rule |
| `scripts/conventions/size.ts` | file and function length |
| `scripts/conventions/assertions.ts` | `!` outside `tests/` |
| `scripts/conventions/spacing.ts` | the spacing rule: violations and the edits that fix them |
| `scripts/conventions/index.ts` | `checkFile(path, text): Violation[]`, `checkRepository(root): Violation[]` |
| `scripts/conventions/breakers.ts` | prints the current breakers as the `Record` the test holds |
| `scripts/fix-spacing.ts` | applies the spacing edits to files in place |
| `tests/conventions-rules.test.ts` | each rule on small inputs, and the fixer |
| `tests/conventions.test.ts` | the repository against the rules, exceptions and breakers |
| `package.json` | `fix:spacing` |

## Shared interfaces (defined in Phase 1)

```ts
// scripts/conventions/index.ts
export type Rule = 'names' | 'file-length' | 'function-length' | 'non-null' | 'spacing'
export type Violation = { path: string; line: number; rule: Rule; detail: string }

/** Every violation in one file; `path` is repository-relative with forward slashes. */
export function checkFile(path: string, text: string): Violation[]

/** Every violation in every checked file under `root`. */
export function checkRepository(root: string): Violation[]

// scripts/conventions/parse.ts
import type ts from 'typescript'

/** A TypeScript source to check, and where it sits in the file. */
export type ScriptUnit = { source: ts.SourceFile; lineOffset: number }

/** A name declared in a Svelte template: an {#each} item or index, a snippet parameter. */
export type NameSite = { name: string; line: number }

export type ParsedFile = {
  path: string
  lineCount: number
  scripts: ScriptUnit[]
  templateNames: NameSite[]
}

export function parseFile(path: string, text: string): ParsedFile

// scripts/conventions/spacing.ts
/** An edit to the file's text: insert or delete at an absolute offset. */
export type SpacingEdit = { offset: number; insert: string; deleteCount: number }

export function spacingViolations(file: ParsedFile): Violation[]
export function spacingEdits(file: ParsedFile, text: string): SpacingEdit[]
```

---

## Phase 1: the rules and the check

### Task 1: The guideline and its links

**Files:** Create `.ai/guidelines/clean-code/guide.md`; Modify `CLAUDE.md`, `AGENTS.md` (copy of CLAUDE.md), `.claude/skills/writes-clean-code/SKILL.md`, `.ai/guidelines/style/guide.md`

- [ ] **Step 1: The guide.** Sections in this order, each rule with a Bad/Good pair in the repository's style (Biome: single quotes, no semicolons): Names (the spec's rules, the allowances, the banned list, the import refinement above); Modules; Size (with the exempt kinds); Repetition; Spacing (the five rules and the spec's two examples verbatim); Carried over (early returns, no `else` after `return`, lookup maps, `=== null`, `$props()` defaults, no `!` outside tests). End with "How it is checked": `tests/conventions.test.ts`, the exceptions table, the breakers list that only shrinks, and `pnpm fix:spacing`.
- [ ] **Step 2: Links.** `CLAUDE.md` line 4–5 list of guides gains `.ai/guidelines/clean-code/guide.md`; its skills list keeps `writes-clean-code: every code change`. Copy `CLAUDE.md` over `AGENTS.md`. `style/guide.md` gains one line under "TypeScript and Svelte": "Names, module boundaries, size and spacing: `../clean-code/guide.md`."
- [ ] **Step 3: The skill.** Keep the frontmatter (`description` unchanged so it still activates); replace the body with: when to apply (every change), "The rules are in `.ai/guidelines/clean-code/guide.md`; read it before writing code", the four checks the test runs, and "Run `pnpm fix:spacing` then `pnpm format` before the gate".
- [ ] **Step 4:** `pnpm test` exits 0 (docs only). Commit `docs: a clean-code guideline, with the skill pointing at it`.

### Task 2: The checker

**Files:** Create `scripts/conventions/{files,parse,names,size,assertions,spacing,index}.ts`; Test `tests/conventions-rules.test.ts` (first line `// @vitest-environment node`)

- [ ] **Step 1: Rule tests first.** One `describe` per rule, calling `checkFile('src/lib/example.ts', text)` (or a `.svelte` path) on a template literal and asserting the violations' `rule`, `line` and `detail`:
  - names: `(a, b) =>` reports `a` and `b`; `catch (e)`; `const { class: c } = props`; `for (const i of list)`; `function f(pkg)`; `.svelte` `{#each orders as o, i (o.id)}` reports `o` and `i` at the template line; `{#snippet row(r)}` reports `r`; allowed: `index`, `event`, `args`, `x`, `_unused`, `id`, `ref`, a type parameter `T`, `import X from '…'`.
  - file-length: a 251-line `.svelte` and a 301-line `.ts` report once at line 1; 250 and 300 do not.
  - function-length: a 41-line arrow function reports at its first line; 40 does not.
  - non-null: `value!.length` in `src/` reports; the same in `tests/` does not.
  - spacing: each of the spec's five rules, both directions (a missing blank line is reported with "add a blank line"; a forbidden one with "remove the blank line"); two single-line `const`s together pass; two single-line assignments together pass; two calls together fail; a multi-line `const` between single-line ones needs blank lines both sides; a one-line guard needs one after; the spec's `save` and `format.ts` examples pass as written and fail compacted; in a `.svelte` file the line reported is the file's line, not the script's.
- [ ] **Step 2: `files.ts`.** `checkedFiles(root): string[]`: walk `src`, `tests`, `scripts`, `stories` at the root and `examples/*/src`, `examples/*/tests`, `examples/*/scripts`; keep `.ts` and `.svelte`; skip any path with a segment in `node_modules`, `dist`, `build`, `.svelte-kit`, `storybook-static`, `.tmp`, `.smoke`; return repository-relative POSIX paths, sorted.
- [ ] **Step 3: `parse.ts`.**
  - `.ts`: one `ScriptUnit` from `ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)`, `lineOffset: 0`; `templateNames: []`.
  - `.svelte`: `parse(text, { modern: true })` from `svelte/compiler`. For `ast.instance` and `ast.module`, take the text between the `<script …>` tag's end and `</script>` (`script.content.start`/`end`), parse it as TS, and set `lineOffset` to the 0-based line of `content.start` in the file. For the template (`ast.fragment`), walk the nodes: an `EachBlock` gives `context` (an `Identifier` or a pattern; collect its identifier names) and `index` (a string); a `SnippetBlock` gives `parameters` (patterns); `ArrowFunctionExpression` and `FunctionExpression` inside expressions give `params`. A node's line is computed from its `start` offset. Skip the `instance`/`module` subtrees in this walk.
- [ ] **Step 4: `names.ts`.** Over each `ScriptUnit`, visit `VariableDeclaration`, `Parameter`, `BindingElement`, `CatchClause` variable, `FunctionDeclaration`/`ClassDeclaration` names, and `for…of`/`for…in` initialisers; take each `Identifier` binding (recursing through object and array binding patterns). Skip `TypeParameter` and anything under an `ImportDeclaration`. A name breaks the rule when `/^_/` does not match and either it is one character other than `x` or `y`, or it is in `BANNED = ['acc','arr','btn','cb','cfg','ctx','curr','el','err','ev','evt','fn','idx','msg','num','obj','opts','pkg','prev','res','str','tmp','val']`. Detail: `` `"${name}" is too short or abbreviated` ``. Template `NameSite`s go through the same test.
- [ ] **Step 5: `size.ts` and `assertions.ts`.** File length: `lineCount` against 250 (`.svelte`) or 300 (`.ts`), detail `` `${lineCount} lines, over ${limit}` ``. Function length: every `FunctionDeclaration`, `FunctionExpression`, `ArrowFunction`, `MethodDeclaration`, `GetAccessor`, `SetAccessor` with a body; lines from its start to end inclusive over 40. Non-null: every `NonNullExpression` when the path does not start with `tests/` and has no `/tests/` segment.
- [ ] **Step 6: `spacing.ts`.** For every statement list (`SourceFile.statements`, `Block.statements`, `ModuleBlock.statements`, `CaseClause.statements`, `DefaultClause.statements`), skip leading `ImportDeclaration`s as one group and check each consecutive pair `(previous, next)`:

```ts
const startLine = (node: ts.Node, source: ts.SourceFile) => {
  // A comment above a statement belongs to it.
  const comments = ts.getLeadingCommentRanges(source.text, node.getFullStart()) ?? []
  const start = comments[0]?.pos ?? node.getStart(source)

  return source.getLineAndCharacterOfPosition(start).line
}

const endLine = (node: ts.Node, source: ts.SourceFile) =>
  source.getLineAndCharacterOfPosition(node.getEnd()).line

const isMultiLine = (node: ts.Node, source: ts.SourceFile) =>
  source.getLineAndCharacterOfPosition(node.getStart(source)).line !== endLine(node, source)

const isDeclaration = (node: ts.Node) =>
  ts.isVariableStatement(node) || ts.isTypeAliasDeclaration(node)

const isAssignment = (node: ts.Node) =>
  ts.isExpressionStatement(node) &&
  ts.isBinaryExpression(node.expression) &&
  node.expression.operatorToken.kind >= ts.SyntaxKind.FirstAssignment &&
  node.expression.operatorToken.kind <= ts.SyntaxKind.LastAssignment

const isGuard = (node: ts.Node, source: ts.SourceFile) =>
  ts.isIfStatement(node) &&
  !node.elseStatement &&
  !isMultiLine(node, source) &&
  (ts.isReturnStatement(node.thenStatement) ||
    ts.isThrowStatement(node.thenStatement) ||
    ts.isContinueStatement(node.thenStatement) ||
    ts.isBreakStatement(node.thenStatement))

/** Whether the pair may sit on adjacent lines (rule 2); otherwise a blank line is required. */
const mayGroup = (previous: ts.Node, next: ts.Node, source: ts.SourceFile) =>
  !isMultiLine(previous, source) &&
  !isMultiLine(next, source) &&
  !isGuard(previous, source) &&
  ((isDeclaration(previous) && isDeclaration(next)) ||
    (isAssignment(previous) && isAssignment(next)))
```

  The blank lines between a pair are the lines strictly between `endLine(previous)` and `startLine(next)` that are empty after trimming. A pair that may not group and has none is a violation at `startLine(next) + lineOffset + 1`, detail `add a blank line before this statement`. Rule 5: the first statement of a `Block` with a blank line between the `{` line and it, and the last with one before the `}`, report `remove the blank line`. `spacingEdits` returns, for each missing blank line, `{ offset: <absolute offset of the end of previous's last line>, insert: '\n', deleteCount: 0 }`, and for each forbidden one a deletion of that empty line; absolute offsets add the unit's `content.start` for `.svelte`.
- [ ] **Step 7: `index.ts`.** `checkFile` parses once and concatenates the four rules' violations, sorted by line. `checkRepository` maps `checkedFiles(root)` through `checkFile` with `readFileSync`.
- [ ] **Step 8:** `pnpm vitest run tests/conventions-rules.test.ts` passes; `pnpm test` exits 0 (svelte-check covers `scripts/`). Commit `test: a checker for names, size, non-null assertions and statement spacing`.

### Task 3: The repository check

**Files:** Create `tests/conventions.test.ts` (`// @vitest-environment node`), `scripts/conventions/breakers.ts`

- [ ] **Step 1: `breakers.ts`.** `pnpm tsx scripts/conventions/breakers.ts` runs `checkRepository('.')`, drops excepted paths (imports `EXCEPTIONS` from the test's companion module below), and prints `Record<string, Rule[]>` source text, one path per line, rules sorted, for pasting.
- [ ] **Step 2: Exceptions.** Put them in `scripts/conventions/exceptions.ts` so the test and `breakers.ts` share them:

```ts
/** Paths a rule does not apply to, each with the reason. Globs are `*` within a segment. */
export const EXCEPTIONS: Partial<Record<Rule, Record<string, string>>> = {
  'file-length': {
    'src/lib/components/*/*/*.stories.svelte': 'The story skeleton makes a story file long by design',
    'src/lib/tokens/tailwind-palette.ts': 'Generated by scripts/copy-tailwind-palette.ts',
  },
  'function-length': {
    'src/lib/components/*/*/*.stories.svelte': 'The story skeleton makes a story file long by design',
  },
  'non-null': {},
  names: {},
  spacing: {
    'src/lib/tokens/tailwind-palette.ts': 'Generated by scripts/copy-tailwind-palette.ts',
  },
}
```
- [ ] **Step 3: The test.**

```ts
/**
 * The repository against the clean-code guide. BREAKERS lists files that broke
 * a rule when the check landed; it may only shrink. A listed file that no
 * longer breaks its rule fails too, so the list never goes stale.
 */
const BREAKERS: Record<string, Rule[]> = {
  // pasted from `pnpm tsx scripts/conventions/breakers.ts`
}

it('every file keeps to the guide, outside the exceptions and the listed breakers', () => {
  const unexpected = checkRepository('.').filter(
    (violation) =>
      !isExcepted(violation) && !BREAKERS[violation.path]?.includes(violation.rule),
  )

  expect(unexpected.map(format)).toEqual([])
})

it('lists no breaker that has been fixed', () => {
  const violations = checkRepository('.')
  const stale = Object.entries(BREAKERS).flatMap(([path, rules]) =>
    rules
      .filter((rule) => !violations.some((v) => v.path === path && v.rule === rule))
      .map((rule) => `${path}: ${rule} is fixed; remove it from BREAKERS`),
  )

  expect(stale).toEqual([])
})
```

  (`format` gives `path:line: rule: detail`; `isExcepted` matches the path against the rule's globs. Name the callback parameter `violation`, not `v`, in the real file; the check will say so.)
- [ ] **Step 4:** Run `breakers.ts`, paste its output into `BREAKERS`, `pnpm test` exits 0. Record the counts per rule in the commit body. Commit `test: the repository checked against the clean-code guide`.

### Task 4: The spacing fixer

**Files:** Create `scripts/fix-spacing.ts`; Modify `package.json`; Test `tests/conventions-rules.test.ts` (fixer cases)

- [ ] **Step 1: Tests first.** `fixSpacing(path, text): string`: the compacted `save` and `format.ts` examples become the spec's versions; a file with a forbidden blank line after `{` loses it; running it on its own output returns the same text; a `.svelte` file's markup is untouched.
- [ ] **Step 2: Implement** `fixSpacing` by applying `spacingEdits` from the highest offset down. The CLI: `tsx scripts/fix-spacing.ts [paths…]` (default: every checked file), writes only files whose text changed, prints how many.
- [ ] **Step 3:** `package.json` scripts gain `"fix:spacing": "tsx scripts/fix-spacing.ts"`. `pnpm test` exits 0. Commit `chore: pnpm fix:spacing, the statement-spacing fixer`.

**Phase 1 gate.** Report the breaker counts per rule and per area (mise `src/lib`, mise tests and scripts, stories, example). Wait.

---

## Phase 2: spacing everywhere

### Task 5: Spacing in mise

- [ ] `pnpm fix:spacing src tests scripts stories`, then `pnpm format`. Read the diff: only blank lines change (`git diff --stat` and `git diff -U0 | grep '^[+-][^+-]' | grep -v '^[+-]$'` prints nothing). Remove the `spacing` entries for these paths from `BREAKERS`. Gate: `pnpm test`, `pnpm build:storybook`. Commit `chore: statements spaced as the clean-code guide asks, in mise`.

### Task 6: Spacing in the example

- [ ] The same over `examples/logistics/src tests scripts`, then the example's `pnpm exec biome format --write .`. Gate: root `pnpm test`, the example's `pnpm test` and `pnpm smoke`. Commit `chore(example): statements spaced as the clean-code guide asks`.

**Phase 2 gate.** BREAKERS has no `spacing` entry. Report and wait.

---

## Phase 3: names in mise

Each task: rename within the listed files only, never an exported name, a prop or a part name; `pnpm test` and `pnpm build:storybook`; remove the paths' `names` entries; commit per area as `refactor(<area>): descriptive names` (`<area>` the component group, `tokens`, `utils`, `tests` or `scripts`).

### Task 7: Components, `actions` to `data-display`
### Task 8: Components, `feedback` to `typography`, and `utils`
### Task 9: `tokens`, `scripts`, `tests`, `stories`

- [ ] Comparators become `(first, second)`, loop counters `index`, events `event`, `n`/`c`/`p` the thing they hold. Where a name is a library's vocabulary not in the allowances, the guide's allowance list grows with a reason rather than the code being bent; say so in the phase report.
- [ ] Function-length and non-null entries in these areas are fixed in the same tasks: a long function is split into named helpers below it; a `!` becomes a guard or a narrowed type.

**Phase 3 gate.** BREAKERS has no mise `names`, `function-length` or `non-null` entry. Report and wait.

---

## Phase 4: the example's data layer

### Task 10: A folder per entity

**Files:** `src/lib/data/{orders,shipments,fleet,products,warehouses,clients}.ts` → `src/lib/data/<entity>/index.ts`; `schemas.ts` split into `src/lib/data/<entity>/schema.ts` (the shared `cents` and `TIMEZONES` move to `src/lib/data/shared.ts` and `settings/schema.ts`); `readiness.ts` split into `src/lib/data/<entity>/readiness.ts`; every import updated (`#lib/data/orders.js` → `#lib/data/orders/index.js`, schemas from `#lib/data/orders/schema.js`).

- [ ] Move with `git mv` so history follows; update imports; the example's tests import the new paths. Gate: example `pnpm test`, `pnpm smoke`. Commit `chore(example): each entity's reads, writes, schema and readiness in one folder`.

### Task 11: `source`, not `s`

- [ ] Every `s: Source` parameter and its uses become `source`, in `src/lib/data/**` and the tests (`let s: Store` → `let source: Store`). Gate as above. Commit `chore(example): the data layer's source is called source`.

### Task 12: The form setup apart from the discard dialog

- [ ] `src/lib/entity-form.svelte.ts` keeps `entityForm`; the discard state (`discard`, `askToDiscard`, `answerDiscard`) moves to `src/lib/discard.svelte.ts`. Gate; re-run the order flow checks (Phase 1 of the edit-pages plan, the `drive.mts` script). Commit `chore(example): the discard prompt's state in its own module`.

**Phase 4 gate.** Report and wait.

---

## Phase 5: the example's components

### Task 13: `form-section` and `readiness-card`

- [ ] `src/lib/components/form-section.svelte`: props `{ icon: Snippet; title: string; hint: string; children: Snippet }`; renders the `section` with `CardTitle {icon} iconTone="primary"`, the muted `Text`, and the children. `readiness-card.svelte`: props `{ items: ReadinessItem[]; title?: string }` (default "Ready to save"), the `AsideCard` around `ReadinessSummary` and `ReadinessChecklist`. The six forms and six asides use them; their local `heading` snippets go. Gate with `pnpm smoke`. Commit `chore(example): one form section and one readiness card for every form`.

### Task 14: Pages over the limit

- [ ] Each `.svelte` file still listed for `file-length` is split into section components beside it (a route's in `src/routes/<route>/` as `<section>.svelte`, a form's in `src/lib/components/<entity>-form/`), each under 250 lines. Expected: `settings/general/+page.svelte`, `+page.svelte` (overview), `orders/+page.svelte`, `order-form.svelte`, `shipment-form.svelte`. Gate with `pnpm smoke`; compare its screenshots with the previous run by eye. Commit per page, `chore(example): <page> in sections`.

### Task 15: The example's remaining names and checks

- [ ] Every remaining example entry in BREAKERS (`names`, `function-length`, `non-null`): `pkg` → `item`, `(a, b)` → `(first, second)`, the tests' `!` → a guard helper as `seedOrder` already does. Gate. Commit `chore(example): descriptive names throughout`.

**Phase 5 gate.** Report and wait.

---

## Phase 6: the finish

### Task 16: An empty list, the docs, and every check

- [ ] `BREAKERS` is `{}`; its comment now says a new breaker is fixed, not listed. The guide's "How it is checked" says the list is empty. `docs/handoff.md`: the gate gains the conventions test and `pnpm fix:spacing`; the lessons gain the checker's parsing note (scripts parsed at their offsets). `CLAUDE.md`/`AGENTS.md` mention `pnpm fix:spacing` beside `pnpm format`.
- [ ] Gates: root `pnpm test`, `pnpm build`, `pnpm build:storybook`; example `pnpm test`, `pnpm smoke`; the five browser flow scripts (`drive.mts` to `drive5.mts`, 40 checks). Commit `docs: the clean-code check in the handoff and the agent notes`.

**Phase 6 gate.** Final report; push on approval and watch CI.
