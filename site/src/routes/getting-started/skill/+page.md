---
title: Agent skill
description: The skill that teaches a coding agent in your app which mise component does which job.
section: Getting started
order: 3
---

mise ships a skill for coding agents. Installed in an app, it tells an agent to reach for a mise component before writing UI, which component does which job, and every part, prop and default of the installed version.

```sh
npx skills add jovertical/mise-design-system --skill mise
```

## What it holds

- An index of jobs and the component for each: "a status or a tag: `Badge`", "are you sure?: `AlertDialog`".
- A catalogue of every component's props, generated from the same Props types these docs' API tables read, so the two never disagree.
- The setup and theming guides, and recipes for a dashboard page, a form and a data table.

## Live context

```sh
npx --no-install mise-theme info --json
```

prints the installed version, the stack, the stylesheet and the theme config, so the agent works from what the app actually has.
