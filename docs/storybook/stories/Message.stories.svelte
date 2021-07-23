<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import { Message } from "svelte-ui";
</script>

<Meta
  title="Components/Message"
  component={Message}
  argTypes={{
    header: { control: "text" },
    content: { control: "text" },
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
    delete: { action: "delete" }
  }}
/>

<Template let:args>
  <Message {...args} on:delete={args.delete}>
    <p slot="header">{args.header}</p>
    {args.content}
  </Message>
</Template>

<Story
  name="Default"
  args={{
    header: "Hello World",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque risus mi, tempus quis placerat ut, porta nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus diam, et dictum felis venenatis efficitur. Aenean ac eleifend lacus, in mollis lectus. Donec sodales, arcu et sollicitudin porttitor, tortor urna tempor ligula, id porttitor mi magna a neque. Donec dui urna, vehicula et sem eget, facilisis sodales sem."
  }}
/>
