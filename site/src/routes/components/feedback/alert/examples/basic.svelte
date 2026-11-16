<!--
  The usual shape: an icon and one sentence with the important words in bold.
  Status is the surface and the icon; the words stay in ink, so a sentence
  saying what to do next does not look like the failure itself.
-->
<script lang="ts">
  import { Alert, AlertDescription } from '@jovertical/mise-design-system'
  import IconAlertTriangle from '@tabler/icons-svelte-runes/icons/alert-triangle'
</script>

<Alert tone="warning" class="max-w-3xl">
  <IconAlertTriangle />
  <AlertDescription>
    This register last synced <strong>3 days ago</strong>. Orders taken on it are still on it.
  </AlertDescription>
</Alert>
