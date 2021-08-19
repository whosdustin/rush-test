<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import { Pagination } from "@dollop/ui";
</script>

<Meta
  title="Components/Pagination"
  component={Pagination}
  argTypes={{
    length: { control: "number" },
    size: {
      control: "select",
      options: [
        "small",
        "medium",
        "large"
      ]
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
