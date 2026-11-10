---
name: git-workflow
description: >-
  Guides git operations in mise — main protected by a ruleset, work on a branch merged by a
  pull request once CI passes, component-scoped conventional commits grouped by logical change,
  the pre-commit gate checked by exit code, and releases cut only by release-please. Activates when
  committing, pushing, branching, or when a release or version comes up; or when the user
  mentions git, branch, commit, push, ship, PR, release, tag, or version.
metadata:
  internal: true
---

# Git Workflow

Adapted from the React package's `git-workflow` skill.

## Base branch, and how work reaches it

The base is **`main`**, protected by the repository ruleset **Protect main**:

- changes arrive by pull request only, merged by **squash or rebase** (history
  stays linear; no merge commits);
- the **`check`** job of the CI workflow must pass (it runs the package's
  gate, the example's checks and builds, and the Storybook build);
- `main` cannot be force-pushed or deleted;
- the repository admin (the user) may bypass it, for an emergency. An agent
  works with the user's credentials and so could too; it must not. Always go
  through a pull request.

Work on a branch named for the change (`feat/date-picker-id`,
`chore/example-modules`, `docs/handoff`), one per phase or round. At the gate
the user approves, push the branch and open a pull request into `main`.

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

## Pushing and merging

At a gate the user has approved, push the branch, open the pull request and
watch its CI:

```bash
git push -u origin <branch>
gh pr create --base main --fill
gh pr checks --watch
```

Merge only when `check` is green and the user has said to merge:
`gh pr merge --squash --delete-branch` (or `--rebase` to keep each commit).
Then confirm the push to `main` ran CI, Example and Release.

## Releases: release-please only

`.github/workflows/release.yml` runs release-please on every push to `main`. It
keeps a release PR open whose version follows the conventional commits since
the last release: `fix` a patch, `feat` a minor, `feat!` or a
`BREAKING CHANGE:` footer a major. Merging that PR tags the version, writes
`CHANGELOG.md`, creates the GitHub release and publishes to npm through
npm trusted publishing (OIDC from `release.yml`; no token).

- The user merges the release PR. The agent never does. release-please opens
  it with the workflow's own token, which does not start CI, so `check` never
  reports on it; the user merges it with the admin bypass.
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
