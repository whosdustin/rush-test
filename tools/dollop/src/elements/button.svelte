<script>
  import { is, pipe, join } from '../utils/helpers.js';

  export let color
  export let size
  export let is_fullwidth
  export let is_light
  export let is_outlined

  export let label

  $: modifiers = pipe(is(size), is(color), join(' '))([])
  $: class_list = `button ${modifiers}`
</script>

<button
  type="button"
  class={class_list}
  class:is-light={is_light}
  class:is-outlined={is_outlined}
  class:is-fullwidth={is_fullwidth}
  on:click>
  <slot />
</button>
