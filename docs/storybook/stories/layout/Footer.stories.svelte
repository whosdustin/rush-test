<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import { Footer, Content } from "svelte-ui";
</script>

<Meta
  title="Layout/Footer"
  component={Footer, Content}
/>

<Story name="Default">
  <Footer>
    <Content>
      <p class="has-text-centered">
        <strong>Bulma</strong> by <a href="https://jgthms.com">Jeremy Thomas</a>. The source code is licensed
        <a href="http://opensource.org/licenses/mit-license.php">MIT</a>. The website content
        is licensed <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY NC SA 4.0</a>.
      </p>
    </Content>
  </Footer>
</Story>
