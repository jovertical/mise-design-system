<!-- Tone colours the fill, and is worth spending only where the operator should act. -->
<script lang="ts">
  import { Card, CardContent, MetricBar } from '@jovertical/mise-design-system'
</script>

<Card class="w-full max-w-md">
  <CardContent stack="md">
    <MetricBar label="Riverside" value="42%" percent={42} />
    <MetricBar label="Harbour" value="88%" percent={88} tone="warning" />
    <MetricBar label="North yard" value="97%" percent={97} tone="critical" />
  </CardContent>
</Card>
