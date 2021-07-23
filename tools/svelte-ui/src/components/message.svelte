<script>
  import { createEventDispatcher } from "svelte";
  import { is } from "../utils/helpers";

  const dispatch = createEventDispatcher()

  export let color
  export let size

  $: modifiers = is(size).is(color).done()
  $: class_list = `message ${modifiers}`
</script>

<article class={class_list}>
  {#if $$slots.header}
    <div class="message-header">
      <slot name="header" />
      <button
        class="delete"
        aria-label="delete"
        on:click={() => dispatch('delete')}></button>
    </div>
  {/if}
  <div class="message-body">
    <slot />
  </div>
</article>