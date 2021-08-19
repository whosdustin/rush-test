<script>
  import Delete from './delete.svelte'
  import { is, pipe, join } from "../utils/helpers";

  export let color
  export let size
  export let is_light
  export let is_rounded
  export let has_delete

  $: modifiers = pipe(
    is(size),
    is(color),
    join(' ')
  )([])
  $: class_list = `tag ${modifiers}`
</script>

<span
  class={class_list}
  class:is-light={is_light}
  class:is-rounded={is_rounded}>
  <slot/>
  {#if has_delete}
    <Delete
      size={size !== 'large' ? 'small' : ''}
      label="Delete tag"
      on:click
    />
  {/if}
</span>
