<script>
  export let is_grouped
</script>

<div
  class="field"
  clase:is-grouped={is_grouped}>
  <slot name="label"/>
  <slot name="control" />
  <slot name="help" />
</div>