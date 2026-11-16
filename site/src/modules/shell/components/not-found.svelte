<!-- An address that is not a docs page: prerendered as /not-found, served as 404.html. -->
<script lang="ts">
  import { Button, ErrorState } from '@jovertical/mise-design-system'
  import { resolve } from '$app/paths'
</script>

<ErrorState
  status={404}
  title="No page here"
  description="That address is not part of the docs. The sidebar lists every page."
>
  {#snippet homeLink()}
    <Button href={resolve('/')}>Back to the docs</Button>
  {/snippet}
</ErrorState>
