<!--
  The site form, for New site and Edit site: where it is and who runs it,
  how big it is, and its zones as rows. On an existing site each zone shows
  what it holds, which its capacity can't go below. Zones pair with what they
  hold by position, so an existing zone can be renamed or resized but not
  removed; only rows added here can be.
-->
<script lang="ts">
  import {
    Button,
    Card,
    CardContent,
    CardTitle,
    Input,
    NumberInput,
    Separator,
    Text,
  } from '@jovertical/mise-design-system'
  import {
    FormControl,
    FormField,
    FormFieldErrors,
    FormFieldset,
    FormLabel,
    FormLegend,
  } from '@jovertical/mise-design-system/form'
  import Gauge from '@lucide/svelte/icons/gauge'
  import LayoutGrid from '@lucide/svelte/icons/layout-grid'
  import Plus from '@lucide/svelte/icons/plus'
  import Warehouse from '@lucide/svelte/icons/warehouse'
  import X from '@lucide/svelte/icons/x'
  import { untrack } from 'svelte'

  import FormPage, { type FormPageText } from '#lib/components/form-page.svelte'
  import SiteAside from '#lib/components/site-aside.svelte'
  import { type SiteInput, siteSchema } from '#lib/data/warehouses/schema.js'
  import { entityForm } from '#lib/entity-form.svelte.js'

  let {
    initial,
    page,
    save,
    used = [],
  }: {
    initial: SiteInput
    page: FormPageText
    save: (values: SiteInput) => void
    /** What each existing zone holds, by position; empty for a new site. */
    used?: number[]
  } = $props()

  const form = entityForm(
    siteSchema,
    untrack(() => initial),
    (values) => save(values),
  )

  const { form: values, enhance } = form

  type TextKey = 'name' | 'city' | 'manager'

  function addZone() {
    $values.zones = [...$values.zones, { name: '', capacity: 0 }]
  }

  function removeZone(index: number) {
    $values.zones = $values.zones.toSpliced(index, 1)
  }
</script>

{#snippet siteIcon()}
  <Warehouse />
{/snippet}
{#snippet capacityIcon()}
  <Gauge />
{/snippet}
{#snippet zonesIcon()}
  <LayoutGrid />
{/snippet}

{#snippet heading(icon: typeof siteIcon, title: string, hint: string)}
  <div class="flex flex-col gap-1">
    <CardTitle {icon} iconTone="primary">{title}</CardTitle>
    <Text as="p" size="sm" muted>{hint}</Text>
  </div>
{/snippet}

{#snippet textField(name: TextKey, label: string, placeholder: string)}
  <FormField {form} {name}>
    <FormControl>
      {#snippet children({ props })}
        <FormLabel required>{label}</FormLabel>
        <Input {...props} {placeholder} bind:value={$values[name]} />
      {/snippet}
    </FormControl>
    <FormFieldErrors />
  </FormField>
{/snippet}

{#snippet countField(name: 'capacityUnits' | 'docks', label: string)}
  <FormField {form} {name}>
    <FormControl>
      {#snippet children({ props })}
        <FormLabel required>{label}</FormLabel>
        <NumberInput {...props} format="integer" clearable={false} bind:value={$values[name]} />
      {/snippet}
    </FormControl>
    <FormFieldErrors />
  </FormField>
{/snippet}

{#snippet body()}
  <form method="POST" id="site-form" use:enhance>
    <Card>
      <CardContent class="flex flex-col gap-6">
        <section class="flex flex-col gap-4">
          {@render heading(siteIcon, 'Site', 'Where it is and who runs it.')}
          <div class="grid gap-4 sm:grid-cols-3">
            {@render textField('name', 'Name', 'East Gate')}
            {@render textField('city', 'City', 'Eastport')}
            {@render textField('manager', 'Manager', 'P. Ruiz')}
          </div>
        </section>

        <Separator />

        <section class="flex flex-col gap-4">
          {@render heading(
            capacityIcon,
            'Capacity',
            'How much it can hold, and how many trucks it can load at once.',
          )}
          <div class="grid gap-4 sm:grid-cols-2">
            {@render countField('capacityUnits', 'Capacity in units')}
            {@render countField('docks', 'Loading docks')}
          </div>
        </section>

        <Separator />

        <section class="flex flex-col gap-4">
          {@render heading(
            zonesIcon,
            'Zones',
            used.length > 0
              ? 'Existing zones can be renamed or resized; zones added here can be removed.'
              : 'One row per zone.',
          )}
          <FormFieldset {form} name="zones" class="flex flex-col gap-3">
            <FormLegend class="sr-only">Zones</FormLegend>
            {#each $values.zones as _, index (index)}
              {@const holds = used[index] ?? 0}
              <div class="grid grid-cols-[1fr_10rem_6rem_auto] items-start gap-3">
                <FormField {form} name={`zones[${index}].name` as const} class="space-y-0">
                  <FormControl>
                    {#snippet children({ props })}
                      <FormLabel class="sr-only">Zone {index + 1} name</FormLabel>
                      <Input
                        {...props}
                        bind:value={$values.zones[index].name}
                        placeholder="Zone A"
                      />
                    {/snippet}
                  </FormControl>
                  <FormFieldErrors class="mt-1 empty:hidden" />
                </FormField>
                <FormField {form} name={`zones[${index}].capacity` as const} class="space-y-0">
                  <FormControl>
                    {#snippet children({ props })}
                      <FormLabel class="sr-only">Zone {index + 1} capacity in units</FormLabel>
                      <NumberInput
                        {...props}
                        format="integer"
                        clearable={false}
                        bind:value={$values.zones[index].capacity}
                      />
                    {/snippet}
                  </FormControl>
                  <FormFieldErrors class="mt-1 empty:hidden" />
                </FormField>
                <Text size="sm" muted class="mt-2 tabular-nums">
                  {holds > 0 ? `${holds.toLocaleString('en-US')} used` : 'Empty'}
                </Text>
                <Button
                  type="button"
                  variant="ghost"
                  iconOnly
                  aria-label="Remove zone {index + 1}"
                  disabled={$values.zones.length === 1 || index < used.length}
                  onclick={() => removeZone(index)}
                >
                  <X />
                </Button>
              </div>
            {/each}
            <FormFieldErrors class="empty:hidden" />
            <div>
              <Button type="button" variant="ghost" size="sm" onclick={addZone}>
                <Plus />
                Add zone
              </Button>
            </div>
          </FormFieldset>
        </section>
      </CardContent>
    </Card>
  </form>
{/snippet}

{#snippet aside()}
  <SiteAside values={$values} {used} />
{/snippet}

<FormPage {...page} formId="site-form" form={body} {aside} />
