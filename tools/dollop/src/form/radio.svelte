<script>
  export let name = ''
  export let disabled
  export let value
  export let group
</script>

<label class="radio" disabled={disabled ? true : null}>
  <input
    type="radio"
    disabled={disabled ? true : null} 
    bind:group on:change {value} {name} />
  <slot/>
</label>