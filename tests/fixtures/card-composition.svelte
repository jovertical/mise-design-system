<script lang="ts">
  import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from '../../src/lib/index.js'

  let {
    variant = 'default',
    divided = false,
    stack,
    bleed = false,
    footerVariant = 'default',
  }: {
    variant?: 'default' | 'ghost'
    divided?: boolean
    stack?: 'sm' | 'md' | 'lg'
    bleed?: boolean
    footerVariant?: 'default' | 'muted'
  } = $props()
</script>

<Card {variant} class="extra-card">
  <CardHeader {divided}>
    <CardTitle>Morning shift</CardTitle>
    <CardDescription>Riverside location</CardDescription>
    <CardAction>Edit</CardAction>
  </CardHeader>
  <CardContent {stack}>12 orders</CardContent>
  <CardFooter {bleed} variant={footerVariant}>View all orders</CardFooter>
</Card>
