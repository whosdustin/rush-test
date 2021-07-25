<script>
  import { Meta, Story } from "@storybook/addon-svelte-csf";
  import { Media, Image, Content } from "svelte-ui";
</script>

<Meta
  title="Layout/Media"
  component={Media, Image, Content},
/>

<Story name="Default">
  <Media>
    <Image
      slot="media_left"
      src="https://placehold.co/128x128"
      alt="Blank 200 by 200 image placeholder"
      ratio="64x64"
    />
    <Content slot="content">
      <p>
        <strong>John Smith</strong> <small>@johnsmith</small> <small>31m</small>
        <br>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.
      </p>
    </Content>
  </Media>
</Story>
