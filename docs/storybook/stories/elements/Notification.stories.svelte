<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import { Notification } from "@dollop/ui";
</script>

<Meta
  title="Elements/Notification"
  component={Notification}
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
    is_light: { control: "boolean" },
    delete: { action: "delete" }
  }}
/>

<Template let:args>
  <Notification {...args} on:click={args.delete}>
    {args.label}
  </Notification>
</Template>

<Story
  name="Default"
  args={{
    label: "Primar lorem ipsum dolor sit amet, consectetur adipiscing elit lorem ipsum dolor. Pellentesque risus mi, tempus quis placerat ut, porta nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus diam, et dictum felis venenatis efficitur.",
    is_light: false
  }}
/>
