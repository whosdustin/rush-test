<script>
  export let disabled
  export let checked
</script>

<label class="checkbox" disabled={disabled ? true : null}>
  <input
    type="checkbox"
    bind:checked on:change
    disabled={disabled ? true : null} />
  <slot/>
</label>