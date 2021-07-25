<script context="module">
  import { find } from '$lib/services/posts'

  /**
	 * @type {import('@sveltejs/kit').Load}
	 */
  export async function load({ page }) {
    const post = await find(page.params.slug)
    
    if (!post) return {}

    return {
      props: { post }
    }
  }
</script>

<script>
  import { decode } from 'html-entities'

  export let post
  let { title, body } = post.data[0]
</script>

<article>
  <h1>{title}</h1>
  {@html decode(body)}
</article>
