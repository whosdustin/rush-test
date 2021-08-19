<script>
  import { onDestroy, createEventDispatcher } from "svelte";
  import { Subject } from "rxjs";
  import { debounceTime } from "rxjs/operators";
  import { is, pipe, join } from "../utils/helpers";

  const dispatch = createEventDispatcher()

  export let value = ''
  export let color
  export let size
  export let rows
  export let placeholder
  export let disabled = false
  export let readonly = false
  export let has_fixed_size = false
  export let debounce = 750

  const state$ = new Subject().pipe(debounceTime(debounce))

  const sub$ = state$.subscribe(({ target }) => {
    value = target.value
    dispatch('input', value)
  })

  $: modifiers = pipe(
    is(color),
    is(size),
    join(' ')
  )([])
  $: class_list = `textarea ${modifiers}`

  onDestroy(() => sub$.unsubscribe())
</script>

<textarea
  class={class_list}
  class:has-fixed-size={has_fixed_size}
  on:keyup={event => state$.next(event)}
  {value} {rows} {placeholder} {disabled} {readonly}
></textarea>