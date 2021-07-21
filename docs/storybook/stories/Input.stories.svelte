<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import { Input } from "svelte-ui";
</script>

<Meta
  title="Form/Input"
  component={Input}
  argTypes={{
    color: { 
      control: { 
        type: "select", 
        options: [
          'primary',
          'success',
          'warning',
          'danger',
          'info',
          'link'
        ]
      },
    },
    size: {
      control: {
        type: "select",
        options: [
          "small",
          "medium",
          "large"
        ]
      },
    },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    is_static: { control: "boolean" }
  }}
/>

<Template let:args>
  <Input {...args} />
</Template>

<Story
  name="Default"
  args={{
    placeholder: 'Text Input',
    disabled: false,
    readonly: false,
    is_static: false
  }}
/>
