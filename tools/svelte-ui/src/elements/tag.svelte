<script>
  import { is } from "../utils/helpers";

  export let color
  export let size
  export let is_light
  export let is_rounded

  $: modifiers = is(size).is(color).done()
  $: class_list = `tag ${modifiers}`
</script>

<span
  class={class_list}
  class:is-light={is_light}
  class:is-rounded={is_rounded}>
  <slot/>
</span>
