<script>
  import { createEventDispatcher } from "svelte";
  import { be } from "../utils/helpers";

  const dispatch = createEventDispatcher()

  export let options = []
  export let color
  export let size
  export let is_rounded = false
  export let multiple_size = null

  let selected

  $: color_class = be(color)
  $: size_class = be(size)
  $: class_list = `select ${color_class} ${size_class}`
</script>

<div
  class={class_list}
  class:is-multiple={!!multiple_size}
  class:is-rounded={is_rounded}>
  <select
    bind:value={selected}
    size={multiple_size}
    on:blur={dispatch('selected', selected)}>
    {#each options as option}
      <option value={option.value}>
        {option.label}
      </option>
    {/each}
  </select>
</div>