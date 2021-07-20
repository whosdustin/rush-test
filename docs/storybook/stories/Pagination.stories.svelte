<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import { Pagination } from "svelte-ui";
</script>

<Meta
  title="Components/Pagination"
  component={Pagination}
  argTypes={{
    length: {
      control: "number",
      defaultValue: 10
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
    is_rounded: { control: "boolean" },
    next: { action: "next" },
    previous: { action: "previous" },
    to: { action: "to" },
  }}
/>

<Template let:args>
  <Pagination 
    {...args}
    on:next={args.next}
    on:previous={args.previous}
    on:to={args.to}
  ></Pagination>
</Template>

<Story
  name="Default"
  args={{
    length: 10
  }}
/>
