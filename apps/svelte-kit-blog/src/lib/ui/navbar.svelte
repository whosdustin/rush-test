<script>
  const nav_items = [
    {
      name: 'Home',
      path: '/'
    },
    {
      name: 'Login',
      path: '/login'
    },
    {
      name: 'New',
      path: '/new'
    }
  ]
</script>

<nav grid="center justify-end">
  {#each nav_items as nav}
    <a class="_ps" sveltekit:prefetch href={nav.path}>{nav.name}</a>
  {/each}
</nav>
