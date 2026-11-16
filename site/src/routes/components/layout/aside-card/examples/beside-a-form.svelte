<!--
  In place: the form takes the column, the aside takes 360px, and the split
  only happens at `xl`; below that the aside drops under the form. `open`
  false starts one collapsed, for a card that repeats on every step.
-->
<script lang="ts">
  import { AsideCard, Card, CardContent } from '@jovertical/mise-design-system'
  import IconInfoCircle from '@tabler/icons-svelte-runes/icons/info-circle'
  import IconShieldCheck from '@tabler/icons-svelte-runes/icons/shield-check'
</script>

{#snippet info()}
  <IconInfoCircle />
{/snippet}

{#snippet shield()}
  <IconShieldCheck />
{/snippet}

<div class="grid w-full gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
  <Card class="h-fit">
    <CardContent class="text-muted-foreground py-16 text-center text-sm"
      >The location's fields</CardContent
    >
  </Card>
  <aside class="grid h-fit grid-cols-1 gap-4">
    <AsideCard icon={info} title="What this step does">
      <p class="text-muted-foreground text-sm">
        Creates the location record. Nothing is set up yet.
      </p>
    </AsideCard>
    <AsideCard icon={shield} title="Before you continue" open={false}>
      <p class="text-muted-foreground text-sm">
        The name cannot be changed after receipts are issued.
      </p>
    </AsideCard>
  </aside>
</div>
