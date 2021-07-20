<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte'
  import loader from '@monaco-editor/loader'

  export let value
  export let theme = 'vs-dark'
  export let fontSize = 16
  export let language = 'javascript'

  let editor
  const dispatch = createEventDispatcher();

  onMount(mountEditor)

  async function mountEditor() {
    const monaco = await loader.init()

    editor = monaco.editor.create(
      document.getElementById('monaco-container'), {
      theme,
      value,
      language,
      fontSize,
      fontLigatures: true
    })

    editor.onDidChangeModelContent(event => {
      dispatch('change', editor.getValue())
    })
  }

  onDestroy(() => {
    if (editor) editor.dispose()
  })
</script>

<style>
  #monaco-container {
    height: 100vh;
    width: 100%;
    font-size:2em;
  }
</style>

<div id="monaco-container"></div>