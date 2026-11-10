<script lang="ts">
  import { SiteHeader, SiteHeaderSeparator } from '../../src/lib/index.js'

  let { contentClass }: { contentClass?: string } = $props()
</script>

<SiteHeader {contentClass}>
  <button type="button">Toggle</button>
  <SiteHeaderSeparator />
  <span>Orders</span>
</SiteHeader>
