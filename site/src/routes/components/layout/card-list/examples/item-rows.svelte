<!-- Item rows: each person with an action at the row's end. -->
<script lang="ts">
  import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardList,
    CardTitle,
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemTitle,
  } from '@jovertical/mise-design-system'

  const STAFF = [
    { name: 'Dana', role: 'Shift lead' },
    { name: 'Eli', role: 'Picker' },
  ]
</script>

<Card class="w-full max-w-2xl">
  <CardHeader divided>
    <CardTitle>Staffing</CardTitle>
    <CardDescription>2 assigned to this location.</CardDescription>
  </CardHeader>
  <CardContent>
    <CardList>
      {#each STAFF as person (person.name)}
        <Item>
          <ItemContent>
            <ItemTitle>{person.name}</ItemTitle>
            <ItemDescription>{person.role}</ItemDescription>
          </ItemContent>
          <ItemActions><Button variant="outline" size="sm">Un-assign</Button></ItemActions>
        </Item>
      {/each}
    </CardList>
  </CardContent>
  <CardFooter divided class="justify-end">
    <Button variant="outline" size="sm">Assign staff</Button>
  </CardFooter>
</Card>
