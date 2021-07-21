<script>
  import { be } from '../utils/helpers'

  export let name
  export let color

  $: color_class = be(color, 'has-text')
  $: class_list = `icon ${color_class}`
</script>

<span class={class_list}>
  <i class={name}></i>
</span>