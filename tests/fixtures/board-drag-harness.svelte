<script lang="ts">
  import { Board, BoardCard, BoardColumn, type BoardMove } from '../../src/lib/index.js'

  let { readonly = false }: { readonly?: boolean } = $props()

  let moves = $state<BoardMove[]>([])

  const onMove = (move: BoardMove) => {
    moves.push(move)
  }
</script>

<Board onMove={readonly ? undefined : onMove}>
  <BoardColumn id="received" title="Received" accepts={() => false}>
    <BoardCard id="or-2060" label="OR-2060" href="/orders/OR-2060">OR-2060</BoardCard>
  </BoardColumn>
  <BoardColumn id="ready" title="Ready" accepts={(card) => card.from === 'received'}>
    <BoardCard id="or-2053" label="OR-2053" href="/orders/OR-2053">OR-2053</BoardCard>
  </BoardColumn>
  <BoardColumn id="cancelled" title="Cancelled" empty="None" />
</Board>
<output data-testid="moves">{JSON.stringify(moves)}</output>
