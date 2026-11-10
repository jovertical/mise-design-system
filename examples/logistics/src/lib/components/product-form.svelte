<!--
  The product form, for New product and Edit product: what it is, what it
  costs and when to reorder, and its stock by site. A new product takes an
  opening count per site; an existing one shows its stock read-only, since
  stock moves through adjustments rather than this form.
-->
<script lang="ts">
  import {
    Card,
    CardContent,
    Input,
    NumberInput,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Separator,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@jovertical/mise-design-system'
  import {
    FormControl,
    FormField,
    FormFieldErrors,
    FormLabel,
  } from '@jovertical/mise-design-system/form'
  import Package from '@lucide/svelte/icons/package'
  import Tag from '@lucide/svelte/icons/tag'
  import Warehouse from '@lucide/svelte/icons/warehouse'
  import { untrack } from 'svelte'

  import FormPage, { type FormPageText } from '#lib/components/form-page.svelte'
  import FormSection from '#lib/components/form-section.svelte'
  import ProductAside from '#lib/components/product-aside.svelte'
  import { locationName } from '#lib/data/lookups.js'
  import { type ProductInput, productSchema } from '#lib/data/products/schema.js'
  import { store } from '#lib/data/store.svelte.js'
  import type { Product } from '#lib/data/types.js'
  import { entityForm } from '#lib/entity-form.svelte.js'
  import { CATEGORY_LABEL } from '#lib/status.js'

  let {
    initial,
    page,
    save,
    stock = null,
  }: {
    initial: ProductInput
    page: FormPageText
    save: (values: ProductInput) => void
    /** An existing product's stock; null on a new product. */
    stock?: Product['stock'] | null
  } = $props()

  const form = entityForm(
    productSchema,
    untrack(() => initial),
    (values) => save(values),
  )

  const { form: values, enhance } = form

  const categories = Object.entries(CATEGORY_LABEL).map(([value, label]) => ({ value, label }))
</script>

{#snippet body()}
  <form method="POST" id="product-form" use:enhance>
    <Card>
      <CardContent class="flex flex-col gap-6">
        <FormSection icon={Package} title="Product" hint="What it is and how it is counted.">
          <div class="grid gap-4 sm:grid-cols-2">
            <FormField {form} name="name">
              <FormControl>
                {#snippet children({ props })}
                  <FormLabel required>Name</FormLabel>
                  <Input {...props} bind:value={$values.name} placeholder="Stretch film, 23µm" />
                {/snippet}
              </FormControl>
              <FormFieldErrors />
            </FormField>
            <FormField {form} name="sku">
              <FormControl>
                {#snippet children({ props })}
                  <FormLabel required>SKU</FormLabel>
                  <Input
                    {...props}
                    value={$values.sku}
                    oninput={(event) => ($values.sku = event.currentTarget.value.toUpperCase())}
                    placeholder="PK-0499"
                  />
                {/snippet}
              </FormControl>
              <FormFieldErrors />
            </FormField>
            <FormField {form} name="category">
              <FormControl>
                {#snippet children({ props })}
                  <FormLabel>Category</FormLabel>
                  <Select
                    type="single"
                    value={$values.category}
                    onValueChange={(next) => ($values.category = next as Product['category'])}
                    items={categories}
                  >
                    <SelectTrigger {...props} class="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {#each categories as category (category.value)}
                        <SelectItem value={category.value} label={category.label} />
                      {/each}
                    </SelectContent>
                  </Select>
                {/snippet}
              </FormControl>
              <FormFieldErrors />
            </FormField>
            <FormField {form} name="unit">
              <FormControl>
                {#snippet children({ props })}
                  <FormLabel required>Unit</FormLabel>
                  <Input {...props} bind:value={$values.unit} placeholder="roll, pack, pallet" />
                {/snippet}
              </FormControl>
              <FormFieldErrors />
            </FormField>
          </div>
        </FormSection>

        <Separator />

        <FormSection icon={Tag} title="Pricing" hint="What it sells for, and when to order more.">
          <div class="grid gap-4 sm:grid-cols-2">
            <FormField {form} name="price">
              <FormControl>
                {#snippet children({ props })}
                  <FormLabel required>Price</FormLabel>
                  <NumberInput
                    {...props}
                    format="currency"
                    prefix="$"
                    clearable={false}
                    bind:value={$values.price}
                  />
                {/snippet}
              </FormControl>
              <FormFieldErrors />
            </FormField>
            <FormField {form} name="reorderPoint">
              <FormControl>
                {#snippet children({ props })}
                  <FormLabel>Reorder point</FormLabel>
                  <NumberInput
                    {...props}
                    format="integer"
                    clearable={false}
                    bind:value={$values.reorderPoint}
                  />
                {/snippet}
              </FormControl>
              <FormFieldErrors />
            </FormField>
          </div>
        </FormSection>

        <Separator />

        <FormSection
          icon={Warehouse}
          title={stock ? 'Stock by site' : 'Opening stock'}
          hint={stock
            ? 'Stock moves through adjustments, not this form.'
            : 'What is on the shelf at each site today.'}
        >
          {#if stock}
            <Table compact>
              <TableHeader>
                <TableRow>
                  <TableHead>Site</TableHead>
                  <TableHead class="text-right">On hand</TableHead>
                  <TableHead class="text-right">Reserved</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {#each stock as row (row.locationId)}
                  <TableRow>
                    <TableCell>{locationName(store, row.locationId)}</TableCell>
                    <TableCell class="text-right tabular-nums">{row.onHand}</TableCell>
                    <TableCell class="text-right tabular-nums">{row.reserved}</TableCell>
                  </TableRow>
                {/each}
              </TableBody>
            </Table>
          {:else}
            <div class="grid gap-4 sm:grid-cols-2">
              {#each $values.openingStock as row, index (row.locationId)}
                <FormField {form} name={`openingStock[${index}].onHand` as const}>
                  <FormControl>
                    {#snippet children({ props })}
                      <FormLabel>{locationName(store, row.locationId)}</FormLabel>
                      <NumberInput
                        {...props}
                        format="integer"
                        clearable={false}
                        bind:value={$values.openingStock[index].onHand}
                      />
                    {/snippet}
                  </FormControl>
                  <FormFieldErrors />
                </FormField>
              {/each}
            </div>
          {/if}
        </FormSection>
      </CardContent>
    </Card>
  </form>
{/snippet}

{#snippet aside()}
  <ProductAside values={$values} {stock} />
{/snippet}

<FormPage {...page} formId="product-form" form={body} {aside} />
