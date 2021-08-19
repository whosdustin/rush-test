<script>
  import { is, pipe, join } from "../utils/helpers";

  export let size
  export let label

  $: modifiers = pipe(
    is(size),
    join(' ')
  )([])
  $: class_list = `delete ${modifiers}`
</script>

<button
  class={class_list}
  title={label}
  aria-label={label}
  on:click>
</button>