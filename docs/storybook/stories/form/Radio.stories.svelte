<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import { Radio, Control } from "@dollop/ui";
</script>

<Meta
  title="Form/Radio"
  component={Radio, Control}
  argTypes={{
    label_yes: { control: "text" },
    label_no: { control: "text" },
    yes: { control: "text" },
    no: { control: "text" },
    group: { control: "text" },
    disabled: { control: "boolean" },
    change: { action: "change" },
  }}
/>

<Template let:args>
  <Control>
    <Radio
      value={args.yes}
      disabled={args.disabled}
      on:change={args.change}>
      {args.label_yes}
    </Radio>
    <Radio
      value={args.no}
      disabled={args.disabled}
      on:change={args.change}>
      {args.label_no}
    </Radio>
  </Control>
</Template>

<Story
  name="Default"
  args={{
    label_yes: "Yes",
    label_no: "No",
    yes: "yes",
    no: "no",
    group: "yes",
    disabled: false
  }}
/>
