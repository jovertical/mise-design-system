---
title: InputOTP
description: A short code typed into one cell per character.
section: Forms
order: 8
group: Text input
traits: [keyboard, form control]
keywords: [otp, pin, verification code, 2fa]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

`maxlength` sets how many cells there are; the `children` snippet receives them as `cells` and lays them out in groups. A pasted code fills every cell at once.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'input-otp', label: 'Input', part: 'InputOTP', placement: 'right' },
  { slot: 'input-otp-group', label: 'Group', part: 'InputOTPGroup', placement: 'left' },
  { slot: 'input-otp-slot', label: 'Cell', part: 'InputOTPSlot', placement: 'bottom' },
  { slot: 'input-otp-separator', label: 'Separator', part: 'InputOTPSeparator', placement: 'top' },
]} />

## Examples

### A masked PIN

`pattern` limits what can be typed; `masked` on a cell shows a dot for each character.

<Preview example={examples['masked-pin']} />

## When to use

A verification code or a PIN of a known length. Anything else is an `Input`.

## API reference

<ApiTable component="InputOTP" />

## Keyboard

| Key | Does |
| --- | --- |
| A character | Fills the current cell and moves to the next |
| `Backspace` | Clears the cell before the cursor |
| `ArrowLeft`, `ArrowRight` | Move between cells |
