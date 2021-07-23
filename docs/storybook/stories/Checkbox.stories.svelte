<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import { Checkbox } from "svelte-ui";
</script>

<Meta
  title="Form/Checkbox"
  component={Checkbox}
  argTypes={{
    label: { control: "text" },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    change: { action: "change" },
  }}
/>

<Template let:args>
  <Checkbox {...args} on:change={args.change}>
    {args.label}
  </Checkbox>
</Template>

<Story
  name="Default"
  args={{
    label: "Remember me",
    disabled: false,
    checked: false,
  }}
/>
