<script context="module">
  /**
	 * @type {import('@sveltejs/kit').Load}
	 */
  export async function load({ page }) {
    if (page.params.slug !== 'new') return {}
  }
</script>

<script>
  import Post from '$lib/models/Post'
  import PostForm from '$lib/ui/post-form.svelte'
  import { create } from '$lib/services/posts'
  import { goto } from '$app/navigation'
  
  let title
  let body

  function onUpdate(event) {
    title = event.detail.title
    body = event.detail.body
  }

  async function onSave() {
    try {
      const response = await create(new Post(title, body))
      if (response) goto(`/${response.data.slug}`)
    } catch (error) {
      console.info({error})
    }
  }
</script>

<PostForm {title} {body} on:update={onUpdate}>
  <button class="_mtxs" on:click={onSave}>Save</button>
</PostForm>
