<script>
  import { createEventDispatcher } from "svelte";
  import { is, pipe, join } from "../utils/helpers";

  const dispatch = createEventDispatcher()

  export let options = []
  export let color
  export let size
  export let is_rounded = false
  export let multiple_size = null

  let selected

  $: modifiers = pipe(
    is(size),
    is(color),
    join(' ')
  )([])
  $: class_list = `select ${modifiers}`
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