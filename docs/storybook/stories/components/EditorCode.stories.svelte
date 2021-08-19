<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import { EditorCode } from '@dollop/ui';
</script>

<Meta 
  title="Components/EditorCode"
  component={EditorCode}
  argTypes={{
    font_size: { control: "number" },
    theme: {
      control: "select",
      options: [
        'vs',
        "vs-dark",
        "hc-black"
      ]
    },
    language: {
      control: "select",
      options: [
        "html",
        "css",
        "json",
        "javascript",
        "typescript"
      ]
    },
    change: { action: "change" }
  }}
/>

<Template let:args>
  <EditorCode  {...args} on:change={args.change} />
</Template>

<Story
  name="Default"
  args={{
    font_size: 16,
    theme: 'vs-dark',
    language: 'javascript'
  }}
/>