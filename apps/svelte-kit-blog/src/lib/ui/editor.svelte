<script>
  import { browser } from '$app/env'
  import { onMount, onDestroy, createEventDispatcher } from 'svelte'
  import { DefaultText } from '$lib/global'
  import { Editor } from '@tiptap/core'
  import StarterKit from '@tiptap/starter-kit'
  import { decode } from 'html-entities'

  export let body

  let element
  let editor

  const dispatch = createEventDispatcher()

  if (browser) {
    onMount(() => {
      editor = new Editor({
        element: element,
        extensions: [ StarterKit ],
        onTransaction: () => {
          editor = editor
        },
        onUpdate() {
          dispatch('update', this.getHTML())
        },
        onFocus() {
          if (body === DefaultText.BODY)
            this.commands.clearContent(true)
        },
        onBlur() {
          if (body === DefaultText.EMPTY_EDITOR)
            this.commands.setContent(DefaultText.BODY, true)
        }
      })

      if (editor)
        body = body ? decode(body) : DefaultText.BODY
        editor.commands.setContent(body, true)
    })

    onDestroy(() => {
      if (editor) editor.destroy()
    })
  }
</script>

<style global>
  .ProseMirror {
    border-bottom: solid 1px grey;
  }
</style>

<div bind:this={element}></div>
