<script>
  import { onDestroy, createEventDispatcher } from "svelte";
  import { Subject } from "rxjs";
  import { debounceTime } from "rxjs/operators";
  import { is } from "../utils/helpers";

  const dispatch = createEventDispatcher()

  export let id
  export let value = ''
  export let color
  export let size
  export let is_rounded
  export let is_static
  export let type = 'text'
  export let placeholder
  export let disabled = false
  export let readonly = false
  export let debounce = 750

  const state$ = new Subject().pipe(debounceTime(debounce))

  const sub$ = state$.subscribe(({ target }) => {
    value = target.value
    dispatch('input', value)
  })

  $: modifiers = is(color).is(size).done()
  $: class_list = `input ${modifiers}`

  onDestroy(() => sub$.unsubscribe())
</script>

<input
  class={class_list}
  class:is-rounded={is_rounded}
  class:is-static={is_static}
  on:keyup={event => state$.next(event)}
  {id} {value} {type} {placeholder} {disabled} {readonly}
/>
