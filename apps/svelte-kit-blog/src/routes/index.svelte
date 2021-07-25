<script context='module'>
  import { find_all } from '$lib/services/posts'
  
  export async function load() {
    return {
      props: {
        posts: await find_all()
      }
    }
  }
</script>

<script>
  import { format } from 'date-fns'
  export let posts;
</script>

All posts
{#await posts}
  <p>Loading...</p>
{:then posts}
  {#each posts.data as post}
    <h2><a sveltekit:prefetch href={post.slug}>{post.title}</a></h2>
    <p>{format(new Date(post.createdAt), 'MMMM dd, yyyy')}</p>
  {/each}
{/await}