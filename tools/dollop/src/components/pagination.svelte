<script>
  import { createEventDispatcher } from 'svelte'
  import { is, pipe, join } from '../utils/helpers';

  const dispatch = createEventDispatcher()

  export let current = 1
  export let length = 10
  export let size
  export let is_rounded = false

  $: pages = Array.from({ length }, (_, i) => ++i)
  $: modifiers = pipe(
    is(size),
    join(' ')
  )([])
  $: class_list = `pagination ${modifiers}`

  function previous() {
    if (current === 1) return
    dispatch('previous', { from: current, to: --current })
  }

  function next() {
    if (current === length) return
    dispatch('next', { from: current, to: ++current })
  }

  function to(page) {
    if (current === page) return
    dispatch('to', { from: current, to: page })
    current = page
  }

  function allowedPage(page, current) {
    const allowed = new Set([1, length])
    let pre = 1
    let post = length

    if (current < 5) {
      allowed.add(++pre).add(++pre).add(++pre)
    } else if (current > length - 4) {
      allowed.add(--post).add(--post).add(--post)
    } else {
      allowed.add(current).add(current + 1).add(current - 1)
    }

    return allowed.has(page)
  }

  function showEllipsis(page, current) {
    return (
      (page === 2 && current > 4) ||
      (page === length - 1 && current < length - 3)
    )
  }
</script>

<nav
  class={class_list}
  class:is-rounded={is_rounded}
  role="navigation"
  aria-label="pagination">
  <a
    class="pagination-previous"
    href="javascript;"
    on:click|preventDefault={previous}>
    Previous
  </a>
  <a
    class="pagination-next"
    href="javascript;"
    on:click|preventDefault={next}>
    Next
  </a>
  <ul class="pagination-list">
    {#each pages as page}
      {#if allowedPage(page, current)}
        <li>
          <a
            class="pagination-link"
            class:is-current={current === page}
            aria-label={current === page ? `Page ${page}` : `Goto page ${page}`}
            aria-current={current === page ? 'page' : null}
            href="javascript;"
            on:click|preventDefault={to(page)}>
            {page}
          </a>
        </li>
      {/if}
      {#if showEllipsis(page, current)}
        <li>
          <span class="pagination-ellipsis">&hellip;</span>
        </li>
      {/if}
    {/each}
  </ul>
</nav>