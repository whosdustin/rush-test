<script>
  import { has, is, pipe, join } from '../utils/helpers'

  export let name
  export let color
  export let size

  $: modifiers = pipe(
    has('text', color),
    is(size),
    join(' ')
  )([])
  $: class_list = `icon ${modifiers}`
</script>

<span class={class_list}>
  <i class={name}></i>
</span>