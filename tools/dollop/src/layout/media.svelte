<article class="media">
  {#if $$slots.media_left}
    <div class="media-left">
      <slot name="media_left" />
    </div>
  {/if}
  {#if $$slots.content}  
    <div class="media-content">
      <slot name="content" />
    </div>
  {/if}
  {#if !$$slots.content && !$$slots.media_left}
    <slot />
  {/if}
</article>