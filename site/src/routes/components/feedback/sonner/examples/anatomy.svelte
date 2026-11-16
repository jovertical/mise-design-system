<!--
  For the anatomy: a toaster of its own, which only toasts sent to its id
  reach, so the page's toaster does not show this one too. The toast stays
  until the page leaves.
-->
<script lang="ts">
  import { Toaster, toast } from '@jovertical/mise-design-system'

  $effect(() => {
    const id = toast.success('Stock count saved', {
      toasterId: 'anatomy',
      description: 'Riverside, 412 items counted.',
      duration: Number.POSITIVE_INFINITY,
      action: { label: 'Undo', onClick: () => {} },
    })

    return () => toast.dismiss(id)
  })
</script>

<Toaster id="anatomy" position="top-center" />
