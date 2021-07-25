<script>
  import { createEventDispatcher } from 'svelte'
  import { DefaultText } from '$lib/global'
  import Editor from '$lib/ui/editor.svelte'
  import { encode, decode } from 'html-entities'
  
  export let title = DefaultText.TITLE
  export let body

  const dispatch = createEventDispatcher()

  function onUpdate(event) {
    dispatch('update', {
      title,
      body: encode(event.detail)
    })
  }

  function onFocus() {
    if (title === DefaultText.TITLE) title = ''
  }

  function onBlur() {
    if (title === '') title = DefaultText.TITLE
  }
</script>

<div grid>
  <div column>
    <h1
      contenteditable="true"
      bind:textContent={title}
      on:focus={onFocus}
      on:blur={onBlur}
    />

    <Editor {body} on:update={onUpdate} />
  </div>
  <div column="2">
    <slot></slot>
  </div>
</div>
