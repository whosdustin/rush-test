<script>
  import { createEventDispatcher } from 'svelte';
  import { be } from './utils/helpers';
  
  const dispatch = createEventDispatcher();

  export let color
  export let size = 'normal'
  export let is_fullwidth
  export let is_light
  export let is_outlined

  export let label

  $: color_class = be(color);
  $: size_class = be(size)

  $: class_list = `button ${color_class} ${size_class}`

</script>

<style lang="scss" global>
  @import "../node_modules/bulma/sass/utilities/_all";
  @import "../node_modules/bulma/sass/elements/button";
</style>

<button
  type="button"
  class={class_list}
  class:is-light={is_light}
  class:is-outlined={is_outlined}
  class:is-fullwidth={is_fullwidth}
  on:click={() => dispatch('click')}>
  {label}
</button>
