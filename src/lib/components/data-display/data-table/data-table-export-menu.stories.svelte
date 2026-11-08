<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import { DEVICES } from '../../../../../stories/fixtures/devices.js'
  import Toaster from '../../feedback/sonner/sonner.svelte'
  import DataTableExportMenu from './data-table-export-menu.svelte'

  const copyText = () =>
    [
      'serial\tlocation\tstatus',
      ...DEVICES.map((device) => `${device.serial}\t${device.location}\t${device.status}`),
    ].join('\n')

  const { Story } = defineMeta({
    title: 'Data display/DataTable/ExportMenu',
    component: DataTableExportMenu,
    tags: ['mise'],
    args: { onExportCsv: () => {}, getCopyText: copyText },
  })
</script>

<!--
  Three items, each shown only when wired: a menu of things you cannot do is
  worse than a shorter one. Copy is tab-separated, so it pastes into a
  spreadsheet as columns; the page builds the text, knowing which fields matter.
-->
<Story name="Playground">
  {#snippet template(args)}
    <Toaster />
    <DataTableExportMenu {...args} />
  {/snippet}
</Story>

<!-- Copy only: the common case for a table with no server-side export job. -->
<Story name="Copy only" asChild>
  <Toaster />
  <DataTableExportMenu getCopyText={copyText} />
</Story>

<!--
  Print prints the window unless given a handler. The theme's print stylesheet
  drops the sidebar, the header and the card border, so the page prints as the
  table.
-->
<Story name="Print only" asChild>
  <DataTableExportMenu onPrint={() => window.print()} />
</Story>
