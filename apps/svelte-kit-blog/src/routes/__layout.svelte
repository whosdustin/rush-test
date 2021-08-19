<script>
  import NavBar from '$lib/ui/navbar.svelte'
  import ProgressBar from '$lib/ui/progress-bar.svelte'
  import { navigating } from '$app/stores'
  import '@dollop/ui/dist/dollop.css'

  let loading = true

  navigating.subscribe(value => {
    loading = (value !== null)
  })
</script>

<style lang="scss">

</style>
{#if loading}<ProgressBar/>{/if}

<div container>
  <NavBar/>
  <main grid>
    <section column="8 +2">
      <slot />
    </section>
  </main>
</div>