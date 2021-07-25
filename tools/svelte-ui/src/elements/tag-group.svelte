<script>
import { are } from "../utils/helpers";

  export let size
  export let has_addons

  $: modifiers = are(size).done()
  $: class_list = `tags ${modifiers}`
</script>

<div
  class={class_list}
  class:has-addons={has_addons}>
  <slot />
</div>