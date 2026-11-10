<!--
  The order form's packages: one row per package, its contents and weight,
  labelled by position, with at least one row always there.
-->
<script lang="ts">
  import { Badge, Button, Input, NumberInput } from '@jovertical/mise-design-system'
  import {
    FormControl,
    FormField,
    FormFieldErrors,
    FormFieldset,
    FormLabel,
    FormLegend,
  } from '@jovertical/mise-design-system/form'
  import Package from '@lucide/svelte/icons/package'
  import Plus from '@lucide/svelte/icons/plus'
  import X from '@lucide/svelte/icons/x'
  import type { SuperForm } from 'sveltekit-superforms'

  import FormSection from '#modules/core/components/form-section.svelte'
  import type { OrderInput } from '#modules/orders/data/schema.js'

  let { form }: { form: SuperForm<OrderInput> } = $props()

  // The form is built once per page and never replaced, so reading it here is enough.
  // svelte-ignore state_referenced_locally
  const { form: values } = form

  function addPackage() {
    $values.packages = [...$values.packages, { contents: '', weightKg: 0 }]
  }

  function removePackage(index: number) {
    $values.packages = $values.packages.toSpliced(index, 1)
  }
</script>

<FormSection icon={Package} title="Packages" hint="One row per package. Labels number themselves.">
  <FormFieldset {form} name="packages" class="flex flex-col gap-3">
    <FormLegend class="sr-only">Packages</FormLegend>
    {#each $values.packages as _, index (index)}
      <div class="grid grid-cols-[auto_1fr_9rem_auto] items-start gap-3">
        <Badge variant="outline" class="mt-2">PKG-{index + 1}</Badge>
        <FormField {form} name={`packages[${index}].contents` as const} class="space-y-0">
          <FormControl>
            {#snippet children({ props })}
              <FormLabel class="sr-only">PKG-{index + 1} contents</FormLabel>
              <Input
                {...props}
                bind:value={$values.packages[index].contents}
                placeholder="What is in it"
              />
            {/snippet}
          </FormControl>
          <FormFieldErrors class="mt-1 empty:hidden" />
        </FormField>
        <FormField {form} name={`packages[${index}].weightKg` as const} class="space-y-0">
          <FormControl>
            {#snippet children({ props })}
              <FormLabel class="sr-only">PKG-{index + 1} weight in kilograms</FormLabel>
              <NumberInput
                {...props}
                bind:value={$values.packages[index].weightKg}
                clearable={false}
                prefix="kg"
              />
            {/snippet}
          </FormControl>
          <FormFieldErrors class="mt-1 empty:hidden" />
        </FormField>
        <Button
          type="button"
          variant="ghost"
          iconOnly
          aria-label="Remove PKG-{index + 1}"
          disabled={$values.packages.length === 1}
          onclick={() => removePackage(index)}
        >
          <X />
        </Button>
      </div>
    {/each}
    <FormFieldErrors class="empty:hidden" />
    <div>
      <Button type="button" variant="ghost" size="sm" onclick={addPackage}>
        <Plus />
        Add package
      </Button>
    </div>
  </FormFieldset>
</FormSection>
