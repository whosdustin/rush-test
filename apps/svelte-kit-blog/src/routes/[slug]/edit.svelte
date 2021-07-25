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
  import PostForm from '$lib/ui/post-form.svelte'
  import { update } from '$lib/services/posts'
  import { goto } from '$app/navigation'
  
  export let post
  
  let { _id, title, body } = post.data[0]

  function onUpdate(event) {
    title = event.detail.title
    body = event.detail.body
  }

  async function saveChanges() {
    try {
      const response = await update(_id, { title, body })
      if (response) goto(`/${response.data.slug}`)
    } catch (error) {
      console.info({error})
    }
  }
</script>

<PostForm {title} {body} on:update={onUpdate}>
  <button class="_mtxs" on:click={saveChanges}>Update</button>
</PostForm>
