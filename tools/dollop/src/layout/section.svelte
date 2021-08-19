<script>
  import { is, pipe, join } from "../utils/helpers";
  
  export let size

  $: modifiers = pipe(
    is(size),
    join(' ')
  )([])
  $: class_list = `section ${modifiers}`
</script>

<section class={class_list}>
  <slot/>
</section>