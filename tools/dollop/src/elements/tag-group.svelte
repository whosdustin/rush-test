<script>
import { are, pipe, join } from "../utils/helpers";

  export let size
  export let has_addons

  $: modifiers = pipe(
    are(size),
    join(' ')
  )([])
  $: class_list = `tags ${modifiers}`
</script>

<div
  class={class_list}
  class:has-addons={has_addons}>
  <slot />
</div>