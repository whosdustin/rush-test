<script>
  import { be } from "../utils/helpers";

  export let color
  export let size
  export let is_rounded
  export let type = 'text'
  export let placeholder
  export let disabled = false
  export let readonly = false
  export let is_static

  $: size_class = be(size)
  $: color_class = be(color)
  $: class_list = `input ${color_class} ${size_class}`
</script>

<input
  class={class_list}
  class:is-rounded={is_rounded}
  class:is-static={is_static}
  {type} {placeholder} {disabled} {readonly} />