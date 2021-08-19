<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import { Tag } from "@dollop/ui";
</script>

<Meta
  title="Elements/Tag"
  component={Tag}
  argTypes={{
    label: { control: "text" },
    color: { 
      control: "select",
      options: [
        'primary',
        'success',
        'warning',
        'danger',
        'info',
        'link',
        'white',
        'light',
        'dark',
        'black',
        'text'
      ]
    },
    size: {
      control: "select",
      options: [
        "small",
        "normal",
        "medium",
        "large"
      ]
    },
    is_light: { control:  "boolean" },
    is_rounded: { control:  "boolean" },
    has_delete: { control: "boolean" },
    click: { action: "delete" }
  }}
/>

<Template let:args>
  <Tag {...args} on:click={args.click}>
    {args.label}
  </Tag>
</Template>

<Story
  name="Default"
  args={{
    label: "Tag",
    is_light: false,
    is_rounded: false,
    has_delete: false
  }}
/>
