<script>
  import { is } from "../utils/helpers";
  
  export let size

  $: modifiers = is(size).done()
  $: class_list = `section ${modifiers}`
</script>

<section class={class_list}>
  <slot/>
</section>