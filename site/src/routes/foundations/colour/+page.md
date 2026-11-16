---
title: Colour
description: The semantic tokens every component reads, and the six tones a status takes.
section: Foundations
order: 1
---

<script>
  import { SEMANTIC_TOKENS } from '@jovertical/mise-design-system/tokens'
  import { TokenSwatches } from '#modules/docs/components/index.js'
</script>

A component never writes a colour of its own. It reads a semantic token, so the theme, and the scheme, decide every colour at once. Toggle dark mode to see each swatch change.

## Semantic tokens

<TokenSwatches tokens={SEMANTIC_TOKENS} />

Use them as Tailwind classes: `bg-primary`, `text-muted-foreground`, `border-border`. A neutral fill on the page is `bg-foreground/[0.07]`, the wash mise's neutral badges use, because `bg-muted` is the page canvas itself.

## Tones

A status takes one of six tones, the same names on every component that has one:

| Tone | Means |
| --- | --- |
| `neutral` | No status worth a colour |
| `primary` | The brand; the thing to look at |
| `info` | Something to know |
| `success` | Done, healthy, on time |
| `warning` | Needs attention soon |
| `critical` | Failed, overdue, or cannot be taken back |

`critical` rather than `destructive` or `error`: it names what the operator should feel about the state. A badge reading "Overdue" is neither destructive nor an error. The CSS token keeps its shadcn name, `--destructive`.
