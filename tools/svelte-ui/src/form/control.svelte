<script>
  import { is } from "../utils/helpers";

  export let size
  export let loading

  $: modifiers = is(size).is(loading).done()
  $: class_list = `control ${modifiers}`
</script>

<div class={class_list}>
  <slot/>
</div>