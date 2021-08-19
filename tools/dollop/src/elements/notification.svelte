<script>
  import Delete from './delete.svelte'
  import { is, pipe, join } from "../utils/helpers";
  
  export let color
  export let is_light

  $: modifiers = pipe(
    is(color),
    join(' ')
  )([])
  $: class_list = `notification ${modifiers}`
</script>
<div
  class={class_list}
  class:is-light={is_light}>
  <Delete label="Delete notification" on:click />
  <slot />
</div>