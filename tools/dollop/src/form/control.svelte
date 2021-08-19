<script>
  import { is, pipe, join } from "../utils/helpers";

  export let size
  export let loading

  $: modifiers = pipe(
    is(size),
    is(loading),
    join(' ')
  )([])
  $: class_list = `control ${modifiers}`
</script>

<div class={class_list}>
  <slot/>
</div>