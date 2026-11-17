---
title: Table
description: Rows of data in columns, with no sorting or filtering of its own.
section: Data display
order: 2
group: Tables
keywords: [rows, columns]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

`compact` tightens heads and cells together: a listing whose rows are click targets wants the default, a table being read and compared wants compact. In a card, run it full-bleed (`px-0` on the content, the padding moved to the first and last columns) so its rules reach the card's edges.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'table-header', label: 'Header', part: 'TableHeader', placement: 'top' },
  { slot: 'table-head', label: 'Column head', part: 'TableHead', placement: 'left' },
  { slot: 'table-body', label: 'Body', part: 'TableBody', placement: 'right' },
  { slot: 'table-cell', label: 'Cell', part: 'TableCell', placement: 'left' },
  { slot: 'table-footer', label: 'Footer', part: 'TableFooter', placement: 'bottom' },
]} />

## Examples

### Sections

<Preview example={examples.sections} />

### A row refused

<Preview example={examples['invalid-row']} />

## When to use

A few rows a reader reads: an order's lines, a ledger. Rows a reader sorts, searches and acts on: `DataTable`.

## API reference

<ApiTable component="Table" />
