<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import { Button } from "svelte-ui";
</script>

<Meta
  title="Elements/Button"
  component={Button}
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
    is_outlined: { control: "boolean" },
    is_transparent: { control: "boolean" },
    click: { action: "click" },
  }}
/>

<Template let:args>
  <Button {...args} on:click={args.click} />
</Template>

<Story
  name="Default"
  args={{
    label: "Button",
    is_light: false,
    is_outlined: false,
    is_transparent: false,
  }}
/>
