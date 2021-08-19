<script>
  import { is, pipe, join } from "../utils/helpers";

  export let src
  export let alt
  export let ratio = 'fullwidth'
  export let is_rounded

  $: modifiers = pipe(
    is(ratio),
    join(' ')
  )([])
  $: class_list = `image ${modifiers}`
</script>

<figure class={class_list}>
  <img class:is-rounded={is_rounded} {src} {alt} />
</figure>