<script>
  import { is } from "../utils/helpers";

  export let size
  export let label

  $: modifiers = is(size).done()
  $: class_list = `delete ${modifiers}`
</script>

<button
  class={class_list}
  title={label}
  aria-label={label}
  on:click>
</button>