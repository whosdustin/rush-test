<script>
  import { has } from '../utils/helpers'

  export let name
  export let color
  export let size

  $: modifiers = has(color, 'text').is(size).done()
  $: class_list = `icon ${modifiers}`
</script>

<span class={class_list}>
  <i class={name}></i>
</span>