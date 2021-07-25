<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import { Delete } from "svelte-ui";
</script>

<Meta
  title="Elements/Delete"
  component={Delete}
  argTypes={{
    label: { control: "text" },
    size: {
      control: "select",
      options: [
        "small",
        "normal",
        "medium",
        "large"
      ]
    },
    click: { action: "click" }
  }}
/>

<Template let:args>
  <Delete {...args} on:click={args.click} />
</Template>

<Story
  name="Default"
  args={{
    label: 'Delete aria',
  }}
/>
