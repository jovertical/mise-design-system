---
name: git-workflow
description: >-
  Guides git operations in mise — main as the only branch for now, component-scoped
  conventional commits grouped by logical change, the pre-commit gate checked by exit code,
  pushing only at an approved phase or round gate, and releases cut only by release-please. Activates when
  committing, pushing, branching, or when a release or version comes up; or when the user
  mentions git, branch, commit, push, ship, PR, release, tag, or version.
---

# Git Workflow

Adapted from the React package's `git-workflow` skill.

## Base branch

The base is **`main`**. Work commits directly to `main` while the port runs in
rounds. A branch and PR are for when the user asks for one.

## Commits

Conventional, **scoped to the component**, in kebab-case as the folder is named:

```
feat(button): port Button, with href links and disabled-link handling
fix(card): give a bleed footer's button the card's gutter
feat(tokens): mise-theme CLI, config file to theme CSS
docs(plan): record the SvelteKit 3 config change
chore: scaffold the SvelteKit library toolchain
```

- The subject says what changed for a consumer, in the imperative.
- The body says why: the evidence, the alternative, what moves.
- Group by logical change. A component, its tests and its story are one commit.
- End with the attribution trailer the session specifies.

## Pre-commit gate

Commit only when both the gate and the Storybook build exit 0. Check the exit
codes rather than grepping the output, and make the commit conditional on them:

```bash
pnpm test > /tmp/mise-gate.log 2>&1; g=$?
pnpm build:storybook > /tmp/mise-sb.log 2>&1; s=$?
[ $g -eq 0 ] && [ $s -eq 0 ] && git commit …
```

The Storybook build is the only step that compiles `components.css` and the
stories through Tailwind and Vite; `pnpm test` can pass with either broken.

Then review `git status --short`: no `node_modules`, `dist`, `.svelte-kit`,
`storybook-static` or `.tmp`.

## Pushing

Push `main` only at a phase or round gate the user has approved, then confirm CI:

```bash
git push origin main
gh run watch --repo jovertical/mise-design-system --exit-status
```

## Releases: release-please only

`.github/workflows/release.yml` runs release-please on every push to `main`. It
keeps a release PR open whose version follows the conventional commits since
the last release: `fix` a patch, `feat` a minor, `feat!` or a
`BREAKING CHANGE:` footer a major. Merging that PR tags the version, writes
`CHANGELOG.md`, creates the GitHub release and publishes to npm with
provenance, using the repository's `NPM_TOKEN` secret.

- The user merges the release PR. The agent never does.
- Never edit `version` or `CHANGELOG.md`, `git tag`, `gh release create`, or
  `npm publish` by hand.
- A commit's type is a release decision: a breaking API change is `feat!`, even
  in a small diff.

## Common Pitfalls

- Committing after a failed gate or Storybook build because the command chain
  ignored an exit code.
- A non-conventional or unscoped commit.
- One commit mixing two unrelated changes.
- Pushing before the user approved the phase.
