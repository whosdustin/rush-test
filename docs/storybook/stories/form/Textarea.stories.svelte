<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import { Textarea, Control } from "@dollop/ui";
</script>

<Meta
  title="Form/Textarea"
  component={Textarea, Control}
  argTypes={{
    rows: { control: "number" },
    color: { 
      control: "select",
      options: [
        'primary',
        'success',
        'warning',
        'danger',
        'info',
        'link'
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
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    has_fixed_size: { control: "boolean" },
    input: { action: "input" }
  }}
/>

<Template let:args>
  <Control
    is_loading={args.is_loading}
    size={args.size}>
    <Textarea {...args} on:input={args.input} />
  </Control>
</Template>

<Story
  name="Default"
  args={{
    placeholder: 'Textarea Input',
    disabled: false,
    readonly: false,
    has_fixed_size: false,
    is_loading: false
  }}
/>
