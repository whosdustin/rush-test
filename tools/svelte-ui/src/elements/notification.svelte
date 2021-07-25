<script>
  import Delete from './delete.svelte'
  import { is } from "../utils/helpers";
  
  export let color
  export let is_light

  $: modifiers = is(color).done()
  $: class_list = `notification ${modifiers}`
</script>
<div
  class={class_list}
  class:is-light={is_light}>
  <Delete label="Delete notification" on:click />
  <slot />
</div>