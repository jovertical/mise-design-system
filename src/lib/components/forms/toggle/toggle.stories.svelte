<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import IconEye from '@tabler/icons-svelte-runes/icons/eye'
  import IconItalic from '@tabler/icons-svelte-runes/icons/italic'
  import IconLetterB from '@tabler/icons-svelte-runes/icons/letter-b'
  import IconPencil from '@tabler/icons-svelte-runes/icons/pencil'
  import IconPlus from '@tabler/icons-svelte-runes/icons/plus'
  import IconTrash from '@tabler/icons-svelte-runes/icons/trash'
  import IconUnderline from '@tabler/icons-svelte-runes/icons/underline'

  import StoryAxis from '../../../../../stories/story-axis.svelte'

  import Tooltip from '../../overlays/tooltip/tooltip.svelte'
  import TooltipContent from '../../overlays/tooltip/tooltip-content.svelte'
  import TooltipTrigger from '../../overlays/tooltip/tooltip-trigger.svelte'
  import Toggle from './toggle.svelte'

  const { Story } = defineMeta({ title: 'Forms/Toggle', component: Toggle, tags: ['shadcn'] })
</script>

<!--
  One on/off control, not a group: reach for `ToggleGroup` the moment a second
  option joins it. `variant="segmented"` only makes sense inside that group's
  track; a lone `Toggle` wants `default` or `outline`.
-->
<Story name="Playground">
  {#snippet template(args)}
    <Toggle aria-label="Toggle bold" {...args}><IconLetterB /></Toggle>
  {/snippet}
</Story>

<!--
  `default` is bare until pressed; `outline` carries a border at rest; `solid`
  fills with the brand when pressed. `segmented` is left out: it only makes
  sense inside a `ToggleGroup` track.
-->
<Story name="Variants" asChild>
  <StoryAxis values={['default', 'outline', 'solid'] as const}>
    {#snippet item(variant)}
      <Toggle {variant} pressed aria-label="Bold, {variant}"><IconLetterB /></Toggle>
    {/snippet}
  </StoryAxis>
</Story>

<!-- Off, pressed, and disabled. The pressed fill follows `aria-pressed`. -->
<Story name="States" asChild>
  <StoryAxis values={['off', 'pressed', 'disabled'] as const}>
    {#snippet item(state)}
      <Toggle
        variant="outline"
        pressed={state === 'pressed'}
        disabled={state === 'disabled'}
        aria-label="Bold, {state}"
      >
        <IconLetterB />
      </Toggle>
    {/snippet}
  </StoryAxis>
</Story>

<!--
  `iconOnly` draws the toggle as a circle around one glyph, the way an icon-only
  `Button` is drawn. It needs an `aria-label`, because the glyph is all a sighted
  reader gets.
-->
<Story name="Icon only" asChild>
  <div class="flex items-center gap-3">
    <Toggle iconOnly size="sm" variant="outline" aria-label="Bold"><IconLetterB /></Toggle>
    <Toggle iconOnly variant="outline" aria-label="Italic"><IconItalic /></Toggle>
    <Toggle iconOnly size="lg" variant="outline" pressed aria-label="Underline">
      <IconUnderline />
    </Toggle>
  </div>
</Story>

<!--
  `solid` for a grid of toggles read at a glance: outlined when off, the brand
  fill when on. One role's actions on one resource (view, edit, create, delete),
  as a permission matrix draws them. The second row is disabled: the pressed
  pair is granted, and not the viewer's to change.
-->
<Story name="Solid" asChild>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-1.5">
      <Toggle iconOnly size="sm" variant="solid" pressed aria-label="Revoke view stock">
        <IconEye />
      </Toggle>
      <Toggle iconOnly size="sm" variant="solid" pressed aria-label="Revoke edit stock">
        <IconPencil />
      </Toggle>
      <Toggle iconOnly size="sm" variant="solid" aria-label="Grant create stock">
        <IconPlus />
      </Toggle>
      <Toggle iconOnly size="sm" variant="solid" aria-label="Grant delete stock">
        <IconTrash />
      </Toggle>
    </div>
    <div class="flex items-center gap-1.5">
      <Toggle iconOnly size="sm" variant="solid" pressed disabled aria-label="View stock, granted">
        <IconEye />
      </Toggle>
      <Toggle iconOnly size="sm" variant="solid" pressed disabled aria-label="Edit stock, granted">
        <IconPencil />
      </Toggle>
      <Toggle iconOnly size="sm" variant="solid" disabled aria-label="Create stock, not granted">
        <IconPlus />
      </Toggle>
      <Toggle iconOnly size="sm" variant="solid" disabled aria-label="Delete stock, not granted">
        <IconTrash />
      </Toggle>
    </div>
  </div>
</Story>

<!--
  A solid toggle as a tooltip's trigger, the way an editable matrix cell is
  drawn. The fill follows `aria-pressed`, so the trigger's own `data-state`
  cannot turn a pressed toggle back to off.
-->
<Story name="Solid with tooltip" asChild>
  <Tooltip>
    <TooltipTrigger>
      {#snippet child({ props })}
        <Toggle
          iconOnly
          size="sm"
          variant="solid"
          pressed
          aria-label="Revoke view stock"
          {...props}
        >
          <IconEye />
        </Toggle>
      {/snippet}
    </TooltipTrigger>
    <TooltipContent>Revoke "view stock"</TooltipContent>
  </Tooltip>
</Story>
