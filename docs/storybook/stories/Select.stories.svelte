<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import { Select } from "svelte-ui";
</script>

<Meta
  title="Form/Select"
  component={Select}
  argTypes={{
    options: {
      control: "array",
      defaultValue: [
        { value: 1, label: 'First' },
        { value: 2, label: 'Second' },
        { value: 3, label: 'Third' }
      ]
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
    is_rounded: { control: "boolean" },
    multiple_size: { control: "number" },
    selected: { action: 'selected' }
  }}
/>

<Template let:args>
  <Select  {...args} on:selected={args.selected}></Select>
</Template>

<Story
  name="Default"
  args={{
    options: [
      { value: 1, label: 'First' },
      { value: 2, label: 'Second' },
      { value: 3, label: 'Third' }
    ],
    is_rounded: false,
    multiple_size: 0
  }}
/>
