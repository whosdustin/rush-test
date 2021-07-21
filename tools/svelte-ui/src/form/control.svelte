<script>
  import { be } from "../utils/helpers";

  export let size
  export let is_loading

  $: size_class = be(size)
  $: class_list = `control ${size_class}`
</script>

<div
  class={class_list}
  class:is-loading={is_loading}>
  <slot/>
</div>