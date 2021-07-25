<script>
  export let is_mobile
</script>

<nav
  class="level"
  class:is-mobile={is_mobile}>
  {#if $$slots.left}
    <div class="level-left">
      <slot name="left" />
    </div>
  {/if}
  {#if $$slots.right}
    <div class="level-right">
      <slot name="right" />
    </div>
  {/if}
  {#if !$$slots.left && !$$slots.right}
    <slot />
  {/if}
</nav>