<script>
  import NavBar from '$lib/ui/navbar.svelte'
  import ProgressBar from '$lib/ui/progress-bar.svelte'
  import { navigating } from '$app/stores'

  let loading = true

  navigating.subscribe(value => {
    loading = (value !== null)
  })
</script>

<style lang="scss">
  :global {
    @import '../../node_modules/concise.css/dist/concise';
    @import '../../node_modules/concise-ui/dist/concise-ui';
    @import '../../node_modules/concise-utils/dist/concise-utils';
  }
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