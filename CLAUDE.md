# mise-design-system

> **Read first:** `docs/specs/2026-11-04-svelte-port-design.md` (what this is
> and why), then `.ai/guidelines/architecture/guide.md`,
> `.ai/guidelines/style/guide.md` and `.ai/guidelines/theming/guide.md`.
> `docs/naming.md` is the naming authority. The round plan in progress is in
> `docs/superpowers/plans/`.

## What this is

An MIT-licensed Svelte 5 component library and Tailwind v4 theme for
operations dashboards, public and published to npm from 1.0.

It was ported from the author's earlier React design system at 2.23.0 ("the
React package"), but not its brand. The port is finished: each module's
`Origin:` header records the React file it came from, and mise owns its API
from here, merging or renaming where React's names grew by accident
(`docs/specs/2026-11-05-structure-design.md`). shadcn-svelte is the reference
for Svelte and bits-ui mechanics only.

Work runs in rounds. Each round ends with the user reviewing it in Storybook,
and the next round starts only on an explicit go.

## Stack

Svelte 5 · SvelteKit 3 as build tooling only (config in `vite.config.ts`) ·
`@sveltejs/package` 3 · TypeScript ~6.0 · Tailwind CSS 4 · bits-ui 2 ·
class-variance-authority · `@lucide/svelte` · Vitest 5 + Testing Library
(jsdom) · Storybook 10 (`@storybook/sveltekit`, `addon-svelte-csf`) ·
Biome 2.6 (including `.svelte`) · pnpm 12.

## Rules

- Prop names, values and defaults follow `docs/naming.md` and the sibling
  components. A ported module's classes stay as ported; a deliberate departure
  from the React package, a merge included, is recorded on the surviving
  module's `Diverged:` line.
- A component lives in `src/lib/components/<group>/<name>/`, and its story is
  titled `<Group>/<Name>`. The groups and what goes in each are in
  `docs/naming.md` §7; `tests/stories.test.ts` enforces the title.
- Components never import `$app/*`. They are plain Svelte 5.
- Relative imports in `.ts` files end in `.js`.
- Every component module opens with an `Origin:` / `Svelte:` / `Diverged:`
  header. `Origin:` names the React file a module was ported from, or is
  `mise` for one mise authored itself. `tests/provenance.test.ts` enforces it,
  and the story's `tags` must match.
- Every component folder is re-exported from `src/lib/index.ts`, and its
  runtime names are listed in `tests/barrel.test.ts`.
- Colours come from the semantic tokens and the `Tone` maps in
  `src/lib/utils/tone.ts`. A component never writes a colour of its own.
- Story copy is generic operations: locations, shifts, orders, stock.
  Nothing product-specific.
- release-please owns `version`, `CHANGELOG.md`, tags, GitHub releases and the
  npm publish. Never do any of them by hand; a conventional commit on `main` is
  what moves the next version.
- Dependencies are installed by the user, not by the agent.
- `skills/mise/` is the skill that apps using mise install, and it ships in the
  package. Keep it current with the code: `pnpm build:skill` after a Props
  change, a new component in its index, setup and theming changes in its
  guides. `tests/skill.test.ts` enforces the generated part. The six skills in
  `.claude/skills/` are for working on mise and carry `metadata.internal`, so
  the `skills` CLI does not offer them to apps.

## Commands

- `pnpm storybook`: build the theme and start Storybook on :6006
- `pnpm test`: svelte-check, Biome, unit tests
- `pnpm build`: `svelte-package`, `dist/theme.css`, publint
- `pnpm build:skill`: regenerate `skills/mise/components/` from the Props types

## Skills

Activate the matching skill before working in its area:

- `authors-components`: adding, porting or changing anything in `src/lib/components/<group>/`
- `changes-tokens`: anything in `src/lib/tokens/` or `src/lib/styles/`
- `vitest-testing`: writing or fixing a test
- `git-workflow`: committing or pushing
- `documents-updates`: after a component, default, token or flow change
- `writes-clean-code`: every code change
