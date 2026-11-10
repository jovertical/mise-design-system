<!--
  Origin: the React package 2.23.0 `data-table-export-menu.tsx`
  Diverged: the trigger drops `font-mono`, which the package does not use. A
    passed `onPrint` counts as an action, so a print-only menu shows; React
    counted only CSV and copy, and its own print-only story drew nothing.
    Lucide's printer, file-spreadsheet, copy and chevron-down for Tabler's.
-->
<script lang="ts" module>
  /**
   * Export actions behind one trigger. Each item shows only when the page wires
   * it, so the menu never offers something that does nothing.
   */
  export type DataTableExportMenuProps = {
    /** Opens the page's full export flow, usually a dialog queuing a server job. */
    onExportCsv?: () => void
    /**
     * The loaded rows as tab-separated text, ready to paste into a spreadsheet.
     * The page builds it, since only it knows which fields are worth copying.
     */
    getCopyText?: () => string
    /** Defaults to printing the window. */
    onPrint?: () => void
  }
</script>

<script lang="ts">
  import ChevronDownIcon from '@lucide/svelte/icons/chevron-down'
  import CopyIcon from '@lucide/svelte/icons/copy'
  import FileSpreadsheetIcon from '@lucide/svelte/icons/file-spreadsheet'
  import PrinterIcon from '@lucide/svelte/icons/printer'
  import { toast } from 'svelte-sonner'

  import Button from '../../actions/button/button.svelte'
  import DropdownMenu from '../../actions/dropdown-menu/dropdown-menu.svelte'
  import DropdownMenuContent from '../../actions/dropdown-menu/dropdown-menu-content.svelte'
  import DropdownMenuItem from '../../actions/dropdown-menu/dropdown-menu-item.svelte'
  import DropdownMenuTrigger from '../../actions/dropdown-menu/dropdown-menu-trigger.svelte'

  let { onExportCsv, getCopyText, onPrint }: DataTableExportMenuProps = $props()

  async function copy() {
    if (!getCopyText) return

    const text = getCopyText()

    if (!text) {
      toast.error('Nothing to copy', { description: 'Load some rows first, then try again.' })

      return
    }

    try {
      await navigator.clipboard.writeText(text)

      toast.success('Copied to clipboard')
    } catch {
      // Refused without a secure context or permission.
      toast.error('Could not copy', { description: 'Your browser blocked clipboard access.' })
    }
  }

  const hasAnyAction = $derived(Boolean(onExportCsv || getCopyText || onPrint))
</script>

{#if hasAnyAction}
  <DropdownMenu>
    <DropdownMenuTrigger>
      {#snippet child({ props })}
        <Button
          variant="ghost"
          class="bg-input/50 hover:bg-input h-8 gap-1.5 rounded-2xl border border-transparent px-3 text-sm font-normal"
          {...props}
        >
          Export
          <ChevronDownIcon class="size-4 opacity-60" />
        </Button>
      {/snippet}
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="min-w-40">
      <DropdownMenuItem onSelect={() => (onPrint ?? (() => window.print()))()}>
        <PrinterIcon class="size-4" />
        Print
      </DropdownMenuItem>
      {#if onExportCsv}
        <DropdownMenuItem onSelect={onExportCsv}>
          <FileSpreadsheetIcon class="size-4" />
          CSV
        </DropdownMenuItem>
      {/if}
      {#if getCopyText}
        <DropdownMenuItem onSelect={() => void copy()}>
          <CopyIcon class="size-4" />
          Copy
        </DropdownMenuItem>
      {/if}
    </DropdownMenuContent>
  </DropdownMenu>
{/if}
