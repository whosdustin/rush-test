<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte'
  import { Subject } from "rxjs";
  import { debounceTime } from "rxjs/operators";
  import loader from '@monaco-editor/loader'

  const dispatch = createEventDispatcher()

  export let value = ''
  export let theme = 'vs-dark'
  export let font_size = 16
  export let language = 'javascript'
  export let has_ligatures = true
  export let debounce = 750

  let editor
  const state$ = new Subject().pipe(debounceTime(debounce))

  const sub$ = state$.subscribe($$value => {
    value = $$value
    dispatch('change', value)
  })

  onMount(async () => {
    const monaco = await loader.init()

    editor = monaco.editor.create(
      document.getElementById('monaco-container'), {
      theme,
      value,
      language,
      fontSize: font_size,
      fontLigatures: has_ligatures
    })

    editor.onDidChangeModelContent(event => {
      state$.next(editor.getValue())
    })
  })

  onDestroy(() => {
    if (editor) editor.dispose()
    sub$.unsubscribe()
  })
</script>

<style>
  #monaco-container {
    height: 100vh;
    width: 100%;
  }
</style>

<div id="monaco-container"></div>