<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import { Icon } from "svelte-ui";
</script>

<Meta
  title="Elements/Icon"
  component={Icon}
  argTypes={{
    name: { control: "text" },
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
  }}
/>

<Template let:args>
  <Icon {...args} />
</Template>

<Story
  name="Default"
  args={{
    name: 'fas fa-home',
  }}
/>
