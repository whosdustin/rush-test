<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import { Input, Control, Label, Field } from "@dollop/ui";
</script>

<Meta
  title="Form/Input"
  component={Input, Control, Label, Field}
  argTypes={{
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
    is_static: { control: "boolean" },
    input: { action: "input" }
  }}
/>

<Template let:args>
  <Field>
    <Label for="name" slot="label">Input</Label>
    <Control
      slot="control"
      loading={args.loading}
      size={args.size}>
      <Input {...args} on:input={args.input} />
    </Control>
  </Field>
</Template>

<Story
  name="Default"
  args={{
    placeholder: 'Text Input',
    disabled: false,
    readonly: false,
    is_static: false,
    loading: false
  }}
/>
